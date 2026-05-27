#!/usr/bin/env python3
"""Remove near-black background from logo PNG for transparent blend on dark pages."""

from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "assets" / "logo-source.png"
OUT = Path(__file__).resolve().parents[1] / "public" / "logo.png"

# Pixels darker than this become transparent (tune for #000 / JPEG artifacts)
BLACK_THRESHOLD = 28


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r <= BLACK_THRESHOLD and g <= BLACK_THRESHOLD and b <= BLACK_THRESHOLD:
                pixels[x, y] = (0, 0, 0, 0)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"Wrote transparent logo to {OUT}")


if __name__ == "__main__":
    main()
