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
      upscale: "POST /v1/photo/upscale",
      enhanceUpscale: "POST /v1/photo/enhance-upscale",
    },
  });
});

type BackgroundStyle =
  | "original"
  | "auto_best"
  | "studio_white"
  | "studio_gray"
  | "showroom"
  | "outdoor_soft"
  | "blur_subtle"
  | "clean_white"
  | "soft_gradient"
  | "dark_studio"
  | "neutral_lifestyle"
  | "light_texture";

type EnhanceMode = "auto" | "electronics" | "general";

type EnhanceRequest = {
  imageBase64: string;
  mode: EnhanceMode;
  stepId?: string;
  backgroundStyle?: BackgroundStyle;
  enhanceLevel?: "standard" | "pro" | "wow";
  adjustments?: {
    exposure?: number;
    contrast?: number;
    saturation?: number;
    sharpen?: number;
    denoise?: number;
  };
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

type UpscaleRequest = {
  imageBase64: string;
  scale: 2 | 4;
  format?: "jpg" | "png" | "webp";
  enhanceLevel?: "standard" | "pro" | "wow";
  adjustments?: {
    exposure?: number;
    contrast?: number;
    saturation?: number;
    sharpen?: number;
    denoise?: number;
  };
};

type EnhanceUpscaleRequest = {
  imageBase64: string;
  mode: EnhanceMode;
  stepId?: string;
  backgroundStyle?: BackgroundStyle;
  enhanceLevel?: "standard" | "pro" | "wow";
  scale: 2 | 4;
  format?: "jpg" | "png" | "webp";
  adjustments?: {
    exposure?: number;
    contrast?: number;
    saturation?: number;
    sharpen?: number;
    denoise?: number;
  };
};

const allowedBackgrounds = new Set<BackgroundStyle>([
  "original",
  "auto_best",
  "studio_white",
  "studio_gray",
  "showroom",
  "outdoor_soft",
  "blur_subtle",
  "clean_white",
  "soft_gradient",
  "dark_studio",
  "neutral_lifestyle",
  "light_texture",
]);

function isExteriorStep(stepId?: string) {
  return stepId === "front_3_4" || stepId === "side" || stepId === "rear_3_4";
}

function selectAutoBestStyle(mode: EnhanceMode): BackgroundStyle {
  if (mode === "electronics") return "clean_white";
  if (mode === "general") return "neutral_lifestyle";
  return "studio_white";
}

function normalizeBackgroundStyle(
  mode: EnhanceMode,
  stepId: string | undefined,
  requested: BackgroundStyle,
): BackgroundStyle {
  const picked = requested === "auto_best" ? selectAutoBestStyle(mode) : requested;
  if (mode === "auto" && !isExteriorStep(stepId)) return "original";
  return picked;
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
    case "clean_white":
      return "fdfdfd";
    case "soft_gradient":
      return "e8edf6";
    case "dark_studio":
      return "2a2d33";
    case "neutral_lifestyle":
      return "f1efe9";
    case "light_texture":
      return "ece8df";
    case "original":
    case "auto_best":
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

async function polishImage(
  imageBuffer: Buffer,
  level: "standard" | "pro" | "wow" = "pro",
  adjustments?: {
    exposure?: number;
    contrast?: number;
    saturation?: number;
    sharpen?: number;
    denoise?: number;
  },
): Promise<Buffer> {
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const exposureAdj = clamp(adjustments?.exposure ?? 0, -1, 1);
  const contrastAdj = clamp(adjustments?.contrast ?? 0, -1, 1);
  const saturationAdj = clamp(adjustments?.saturation ?? 0, -1, 1);
  const sharpenAdj = clamp(adjustments?.sharpen ?? 0, -1, 1);
  const denoiseAdj = clamp(adjustments?.denoise ?? 0, -1, 1);

  const normalized = sharp(imageBuffer, { failOn: "none" }).rotate().toColorspace("srgb");
  const isWow = level === "wow";
  const isPro = level === "pro";
  const baseBrightness = isWow ? 1.06 : isPro ? 1.03 : 1.01;
  const baseSaturation = isWow ? 1.14 : isPro ? 1.06 : 1.03;
  const base = normalized
    .modulate({
      brightness: baseBrightness + exposureAdj * 0.18,
      saturation: baseSaturation + saturationAdj * 0.25,
    })
    .linear((isWow ? 1.08 : 1.03) + contrastAdj * 0.2, (isWow ? -(8 / 255) : -(3 / 255)) - exposureAdj * (8 / 255))
    .normalise({ lower: isWow ? 2 : 4, upper: isWow ? 98 : 96 })
    .gamma((isWow ? 1.08 : 1.04) + exposureAdj * 0.08);

  const sharpened =
    isWow
      ? base
          .median(denoiseAdj > 0 ? 1 : 0)
          .sharpen({
            sigma: Math.max(0.7, 1.45 + sharpenAdj * 0.6),
            m1: 1.05,
            m2: 0.32,
            x1: 2.2,
            y2: 12.0,
            y3: 20.0,
          })
          .modulate({ saturation: 1.03 })
      : isPro
      ? base.sharpen({
          sigma: Math.max(0.6, 1.1 + sharpenAdj * 0.6),
          m1: 0.9,
          m2: 0.25,
          x1: 2.0,
          y2: 10.0,
          y3: 18.0,
        })
      : base.sharpen({
          sigma: Math.max(0.5, 0.9 + sharpenAdj * 0.6),
          m1: 0.8,
          m2: 0.18,
          x1: 2.0,
          y2: 8.0,
          y3: 14.0,
        });

  return sharpened
    .jpeg({
      quality: isWow ? 92 : isPro ? 90 : 86,
      chromaSubsampling: "4:4:4",
      mozjpeg: true,
    })
    .toBuffer();
}

async function upscaleSingle(input: UpscaleRequest) {
  const start = Date.now();
  const imageBuffer = Buffer.from(input.imageBase64, "base64");
  if (!imageBuffer.length) {
    throw new Error("imageBase64 must be a valid base64 image.");
  }

  if (input.scale !== 2 && input.scale !== 4) {
    throw new Error("scale must be 2 or 4.");
  }

  const level = input.enhanceLevel ?? "pro";
  const format = input.format ?? "jpg";
  const polished = await polishImage(imageBuffer, level, input.adjustments);
  const base = sharp(polished, { failOn: "none" }).rotate();
  const metadata = await base.metadata();
  const width = Math.max(1, metadata.width ?? 0);
  const height = Math.max(1, metadata.height ?? 0);
  const targetWidth = Math.round(width * input.scale);
  const targetHeight = Math.round(height * input.scale);

  let pipeline = base.resize(targetWidth, targetHeight, {
    fit: "fill",
    kernel: sharp.kernel.lanczos3,
    withoutEnlargement: false,
  });

  if (format === "png") {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else if (format === "webp") {
    pipeline = pipeline.webp({ quality: 92, effort: 5 });
  } else {
    pipeline = pipeline.jpeg({ quality: 92, chromaSubsampling: "4:4:4", mozjpeg: true });
  }

  const outputBuffer = await pipeline.toBuffer();
  return {
    upscaledImageBase64: outputBuffer.toString("base64"),
    scaleApplied: input.scale,
    width: targetWidth,
    height: targetHeight,
    formatApplied: format,
    provider: "internal" as const,
    latencyMs: Date.now() - start,
  };
}

async function enhanceSingle(input: EnhanceRequest) {
  const start = Date.now();
  const requestedStyle = input.backgroundStyle ?? "original";
  const normalizedStyle = normalizeBackgroundStyle(input.mode, input.stepId, requestedStyle);
  const provider = process.env.ENHANCE_PROVIDER ?? "remove_bg";
  const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS ?? 12000);
  const level = input.enhanceLevel ?? "pro";

  const originalBuffer = Buffer.from(input.imageBase64, "base64");
  if (!originalBuffer.length) {
    throw new Error("imageBase64 must be a valid base64 image.");
  }

  if (provider !== "remove_bg" || normalizedStyle === "original") {
    const polishedOriginal = await polishImage(originalBuffer, level, input.adjustments);
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
    const polishedResult = await polishImage(enhancedBuffer, level, input.adjustments);
    return {
      optimizedImageBase64: polishedResult.toString("base64"),
      backgroundRemoved: true,
      backgroundStyleApplied: normalizedStyle,
      provider: "remove_bg",
      latencyMs: Date.now() - start,
    };
  } catch {
    const polishedFallback = await polishImage(originalBuffer, level, input.adjustments);
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

app.post("/v1/photo/upscale", async (req, res) => {
  const body = req.body as UpscaleRequest;
  if (!body || typeof body.imageBase64 !== "string" || !body.imageBase64) {
    res.status(400).json({ error: "ValidationError", message: "imageBase64 is required." });
    return;
  }
  if (body.scale !== 2 && body.scale !== 4) {
    res.status(400).json({ error: "ValidationError", message: "scale must be 2 or 4." });
    return;
  }
  if (body.format && !["jpg", "png", "webp"].includes(body.format)) {
    res.status(400).json({ error: "ValidationError", message: "format must be jpg|png|webp." });
    return;
  }

  try {
    const result = await upscaleSingle(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "UpscaleFailed",
      message: error instanceof Error ? error.message : "Upscale failed.",
    });
  }
});

app.post("/v1/photo/enhance-upscale", async (req, res) => {
  const body = req.body as EnhanceUpscaleRequest;
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
  if (body.scale !== 2 && body.scale !== 4) {
    res.status(400).json({ error: "ValidationError", message: "scale must be 2 or 4." });
    return;
  }
  if (body.format && !["jpg", "png", "webp"].includes(body.format)) {
    res.status(400).json({ error: "ValidationError", message: "format must be jpg|png|webp." });
    return;
  }

  try {
    const start = Date.now();
    const enhanced = await enhanceSingle({
      imageBase64: body.imageBase64,
      mode: body.mode,
      stepId: body.stepId,
      backgroundStyle,
      enhanceLevel: body.enhanceLevel ?? "pro",
      adjustments: body.adjustments,
    });

    const upscaled = await upscaleSingle({
      imageBase64: enhanced.optimizedImageBase64,
      scale: body.scale,
      format: body.format ?? "jpg",
      enhanceLevel: body.enhanceLevel ?? "pro",
      adjustments: body.adjustments,
    });

    res.status(200).json({
      optimizedImageBase64: upscaled.upscaledImageBase64,
      backgroundRemoved: enhanced.backgroundRemoved,
      backgroundStyleApplied: enhanced.backgroundStyleApplied,
      enhanceProvider: enhanced.provider,
      upscaleProvider: upscaled.provider,
      scaleApplied: upscaled.scaleApplied,
      width: upscaled.width,
      height: upscaled.height,
      formatApplied: upscaled.formatApplied,
      latencyMs: Date.now() - start,
      timing: {
        enhanceLatencyMs: enhanced.latencyMs ?? null,
        upscaleLatencyMs: upscaled.latencyMs ?? null,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "EnhanceUpscaleFailed",
      message: error instanceof Error ? error.message : "Enhance+upscale failed.",
    });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => {
  console.log(`listforge-enhance-api listening on port ${port}`);
});
