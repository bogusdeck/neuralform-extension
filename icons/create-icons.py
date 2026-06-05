#!/usr/bin/env python3
import base64

SIZES = [16, 48, 128]

def create_simple_icon(size):
    width = size
    height = size
    gradient_start = "#667eea"
    gradient_end = "#764ba2"

    svg = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:{gradient_start};stop-opacity:1" />
            <stop offset="100%" style="stop-color:{gradient_end};stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="{width}" height="{height}" rx="{width//6}" fill="url(#grad)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="{width//2}" font-weight="bold" font-family="Arial">A</text>
</svg>'''

    return svg

for size in SIZES:
    svg_content = create_simple_icon(size)
    filename = f'icon{size}.svg'

    with open(filename, 'w') as f:
        f.write(svg_content)

    print(f"Created {filename}")

print("\nTo convert to PNG, use an online tool like:")
print("- https://convertio.co/svg-png/")
print("- https://cloudconvert.com/svg-to-png")
print("\nOr install cairosvg: pip install cairosvg")
print("Then run: cairosvg icon16.svg -o icon16.png")
