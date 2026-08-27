from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "youtune-icon-source.png"
OUTPUT = ROOT / "prototype" / "icons"
SIZES = (16, 48, 128)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing icon source: {SOURCE}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    with Image.open(SOURCE) as image:
        source = image.convert("RGBA")
        if source.width != source.height:
            raise SystemExit("The YouTune icon source must be square")
        for size in SIZES:
            rendered = source.resize((size, size), Image.Resampling.LANCZOS)
            rendered.save(OUTPUT / f"icon{size}.png", format="PNG", optimize=True)
            print(f"Wrote {OUTPUT / f'icon{size}.png'}")


if __name__ == "__main__":
    main()
