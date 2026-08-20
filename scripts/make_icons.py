from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / 'prototype' / 'icons'
root.mkdir(parents=True, exist_ok=True)

for size in (16, 48, 128):
    image = Image.new('RGBA', (size, size), (15, 20, 27, 255))
    draw = ImageDraw.Draw(image)
    margin = max(1, size // 10)
    draw.rounded_rectangle((margin, margin, size - margin - 1, size - margin - 1), radius=max(2, size // 6), fill=(54, 123, 218, 255))
    center = size // 2
    amplitude = max(2, size // 5)
    points = []
    for x in range(max(1, size - 2 * margin)):
        phase = (x / max(1, size - 2 * margin)) * 6.283185307
        y = center + int(amplitude * __import__('math').sin(phase * 2.0))
        points.append((margin + x, y))
    draw.line(points, fill=(255, 255, 255, 255), width=max(1, size // 16), joint='curve')
    image.save(root / f'icon{size}.png')
