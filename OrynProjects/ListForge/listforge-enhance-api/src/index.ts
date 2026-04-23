import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sharp from "sharp";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: `${process.env.MAX_IMAGE_MB ?? "12"}mb` }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "listforge-enhance-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "listforge-enhance-api",
    message: "Use GET /health or POST /v1/photo/enhance",
    endpoints: {
      health: "GET /health",
      enhance: "POST /v1/photo/enhance",
      enhanceBatch: "POST /v1/photo/enhance/batch",
    },
  });
});

type BackgroundStyle =
  | "original"
  | "studio_white"
  | "studio_gray"
  | "showroom"
  | "outdoor_soft"
  | "blur_subtle";

type EnhanceMode = "auto" | "electronics" | "general";

type EnhanceRequest = {
  imageBase64: string;
  mode: EnhanceMode;
  stepId?: string;
  backgroundStyle?: BackgroundStyle;
  enhanceLevel?: "standard" | "pro" | "wow";
};

type BatchEnhanceRequest = {
  photos: Array<{
    id: string;
    imageBase64: string;
    mode: EnhanceMode;
    stepId?: string;
    backgroundStyle?: BackgroundStyle;
    enhanceLevel?: "standard" | "pro" | "wow";
  }>;
};

const allowedBackgrounds = new Set<BackgroundStyle>([
  "original",
  "studio_white",
  "studio_gray",
  "showroom",
  "outdoor_soft",
  "blur_subtle",
]);

function isExteriorStep(stepId?: string) {
  return stepId === "front_3_4" || stepId === "side" || stepId === "rear_3_4";
}

function normalizeBackgroundStyle(stepId: string | undefined, requested: BackgroundStyle): BackgroundStyle {
  if (!isExteriorStep(stepId)) return "original";
  return requested;
}

function backgroundColorForStyle(style: BackgroundStyle): string | null {
  switch (style) {
    case "studio_white":
      return "ffffff";
    case "studio_gray":
      return "d7d7d7";
    case "showroom":
      return "eceff3";
    case "outdoor_soft":
      return "f3f7ff";
    case "blur_subtle":
      return "f4f4f4";
    case "original":
    default:
      return null;
  }
}

async function callRemoveBg(
  imageBuffer: Buffer,
  backgroundStyle: BackgroundStyle,
  timeoutMs: number,
): Promise<Buffer> {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  const baseUrl = process.env.REMOVE_BG_API_BASE_URL ?? "https://api.remove.bg/v1.0";
  if (!apiKey) {
    throw new Error("REMOVE_BG_API_KEY is not configured.");
  }

  const formData = new FormData();
  formData.append("image_file_b64", imageBuffer.toString("base64"));
  formData.append("size", "auto");
  formData.append("format", "jpg");

  const bgColor = backgroundColorForStyle(backgroundStyle);
  if (bgColor) {
    formData.append("bg_color", bgColor);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl}/removebg`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`remove.bg failed (${response.status}): ${errorBody.slice(0, 240)}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timeout);
  }
}

async function polishImage(imageBuffer: Buffer, level: "standard" | "pro" | "wow" = "pro"): Promise<Buffer> {
  const normalized = sharp(imageBuffer, { failOn: "none" }).rotate().toColorspace("srgb");
  const isWow = level === "wow";
  const isPro = level === "pro";
  const base = normalized
    .modulate({
      brightness: isWow ? 1.06 : isPro ? 1.03 : 1.01,
      saturation: isWow ? 1.14 : isPro ? 1.06 : 1.03,
    })
    .linear(isWow ? 1.08 : 1.03, isWow ? -(8 / 255) : -(3 / 255))
    .normalise({ lower: isWow ? 2 : 4, upper: isWow ? 98 : 96 })
    .gamma(isWow ? 1.08 : 1.04);

  const sharpened =
    isWow
      ? base
          .median(1)
          .sharpen({ sigma: 1.45, m1: 1.05, m2: 0.32, x1: 2.2, y2: 12.0, y3: 20.0 })
          .modulate({ saturation: 1.03 })
      : isPro
      ? base.sharpen({ sigma: 1.1, m1: 0.9, m2: 0.25, x1: 2.0, y2: 10.0, y3: 18.0 })
      : base.sharpen({ sigma: 0.9, m1: 0.8, m2: 0.18, x1: 2.0, y2: 8.0, y3: 14.0 });

  return sharpened
    .jpeg({
      quality: isWow ? 92 : isPro ? 90 : 86,
      chromaSubsampling: "4:4:4",
      mozjpeg: true,
    })
    .toBuffer();
}

async function enhanceSingle(input: EnhanceRequest) {
  const start = Date.now();
  const requestedStyle = input.backgroundStyle ?? "original";
  const normalizedStyle = normalizeBackgroundStyle(input.stepId, requestedStyle);
  const provider = process.env.ENHANCE_PROVIDER ?? "remove_bg";
  const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS ?? 12000);
  const level = input.enhanceLevel ?? "pro";

  const originalBuffer = Buffer.from(input.imageBase64, "base64");
  if (!originalBuffer.length) {
    throw new Error("imageBase64 must be a valid base64 image.");
  }

  if (provider !== "remove_bg" || normalizedStyle === "original") {
    const polishedOriginal = await polishImage(originalBuffer, level);
    return {
      optimizedImageBase64: polishedOriginal.toString("base64"),
      backgroundRemoved: false,
      backgroundStyleApplied: normalizedStyle,
      provider: provider === "remove_bg" ? "fallback" : "internal",
      latencyMs: Date.now() - start,
    };
  }

  try {
    const enhancedBuffer = await callRemoveBg(originalBuffer, normalizedStyle, timeoutMs);
    const polishedResult = await polishImage(enhancedBuffer, level);
    return {
      optimizedImageBase64: polishedResult.toString("base64"),
      backgroundRemoved: true,
      backgroundStyleApplied: normalizedStyle,
      provider: "remove_bg",
      latencyMs: Date.now() - start,
    };
  } catch {
    const polishedFallback = await polishImage(originalBuffer, level);
    return {
      optimizedImageBase64: polishedFallback.toString("base64"),
      backgroundRemoved: false,
      backgroundStyleApplied: "original" as const,
      provider: "fallback" as const,
      latencyMs: Date.now() - start,
    };
  }
}

app.post("/v1/photo/enhance", async (req, res) => {
  const body = req.body as EnhanceRequest;
  if (!body || typeof body.imageBase64 !== "string" || !body.imageBase64) {
    res.status(400).json({ error: "ValidationError", message: "imageBase64 is required." });
    return;
  }

  if (!body.mode || !["auto", "electronics", "general"].includes(body.mode)) {
    res.status(400).json({ error: "ValidationError", message: "mode must be auto|electronics|general." });
    return;
  }

  const backgroundStyle = body.backgroundStyle ?? "original";
  if (!allowedBackgrounds.has(backgroundStyle)) {
    res.status(400).json({ error: "ValidationError", message: "backgroundStyle is invalid." });
    return;
  }

  try {
    const result = await enhanceSingle(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "EnhanceFailed",
      message: error instanceof Error ? error.message : "Enhancement failed.",
    });
  }
});

app.get("/v1/photo/enhance", (_req, res) => {
  res.status(405).json({
    error: "MethodNotAllowed",
    message: "Use POST /v1/photo/enhance with JSON body.",
  });
});

app.post("/v1/photo/enhance/batch", async (req, res) => {
  const body = req.body as BatchEnhanceRequest;
  const photos = body?.photos;
  if (!Array.isArray(photos) || photos.length === 0) {
    res.status(400).json({ error: "ValidationError", message: "photos[] is required." });
    return;
  }

  const results = await Promise.all(
    photos.map(async (photo) => {
      if (!photo?.id || !photo?.imageBase64 || !photo?.mode) {
        return {
          id: photo?.id ?? "unknown",
          ok: false,
          error: "Invalid photo payload.",
        };
      }
      const style = photo.backgroundStyle ?? "original";
      if (!allowedBackgrounds.has(style)) {
        return {
          id: photo.id,
          ok: false,
          error: "Invalid backgroundStyle.",
        };
      }
      try {
        const enhanced = await enhanceSingle(photo);
        return {
          id: photo.id,
          ok: true,
          ...enhanced,
        };
      } catch (error) {
        return {
          id: photo.id,
          ok: false,
          error: error instanceof Error ? error.message : "Enhancement failed.",
        };
      }
    }),
  );

  res.status(200).json({ results });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => {
  console.log(`listforge-enhance-api listening on port ${port}`);
});
