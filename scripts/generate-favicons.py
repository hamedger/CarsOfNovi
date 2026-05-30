#!/usr/bin/env python3
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo.png"
APP = ROOT / "app"
PUBLIC = ROOT / "public"


def center_on_canvas(img: Image.Image, size: int) -> Image.Image:
    out = img.copy()
    out.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - out.width) // 2
    y = (size - out.height) // 2
    canvas.paste(out, (x, y), out)
    return canvas


def main() -> None:
    img = Image.open(SRC).convert("RGBA")

    for size, name in [(32, "icon.png"), (180, "apple-icon.png")]:
        center_on_canvas(img, size).save(APP / name, "PNG")
        print(f"Wrote app/{name}")

    ico_sizes = [16, 32, 48]
    frames = [center_on_canvas(img, s) for s in ico_sizes]
    frames[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=frames[1:],
    )
    print("Wrote public/favicon.ico")


if __name__ == "__main__":
    main()
