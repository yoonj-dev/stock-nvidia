#!/usr/bin/env python3
"""
Generate Branding Assets for NVIDIA on Tap (stock-nvidia)
- Favicon (SVG, PNG 32x32, ICO)
- App Icons (192x192, 512x512, apple-touch-icon 180x180)
- Logo (SVG)
- Web App Manifest (manifest.json)
- ads.txt
"""

import math
import os
from PIL import Image, ImageDraw

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
ICONS_DIR = os.path.join(PUBLIC_DIR, "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

# 1. Generate Favicon SVG (NVIDIA Emerald Tensor Core + Quantum Momentum Vector)
FAVICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="nvdaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#76B900" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <linearGradient id="trendGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#76B900" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Squircle -->
  <rect x="4" y="4" width="92" height="92" rx="24" fill="url(#bg)" stroke="rgba(118,185,0,0.3)" stroke-width="2"/>

  <!-- NVIDIA Iconic Eye Arch (Tensor Swirl) -->
  <path d="M 24 50 C 24 35 35 24 50 24 C 65 24 76 35 76 50 C 76 65 65 76 50 76" fill="none" stroke="url(#nvdaGrad)" stroke-width="6" stroke-linecap="round"/>
  <path d="M 34 50 C 34 41 41 34 50 34 C 59 34 66 41 66 50" fill="none" stroke="#76B900" stroke-width="4" stroke-linecap="round"/>

  <!-- Central Silicon Core -->
  <circle cx="50" cy="50" r="6" fill="#76B900" filter="url(#glow)"/>

  <!-- Candlestick + Vector Line -->
  <rect x="42" y="44" width="3" height="12" rx="1" fill="#10B981"/>
  <rect x="52" y="38" width="3" height="14" rx="1" fill="#76B900"/>
  <rect x="62" y="30" width="3" height="18" rx="1" fill="#38BDF8"/>

  <!-- Upward Momentum Vector Line -->
  <path d="M 22 68 Q 46 56 78 22" fill="none" stroke="url(#trendGrad)" stroke-width="3.5" stroke-linecap="round" filter="url(#glow)"/>
  <polygon points="80,19 72,21 78,27" fill="#38BDF8"/>
</svg>
"""

# 2. Generate Brand Logo SVG
LOGO_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" fill="none">
  <defs>
    <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
    <linearGradient id="logoNvda" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#76B900" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <linearGradient id="logoTrend" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#76B900" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>

  <!-- Left Icon Mark (64x64) -->
  <g transform="translate(0, 0)">
    <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#logoBg)" stroke="rgba(118,185,0,0.3)" stroke-width="1.5"/>
    <!-- Eye Arch -->
    <path d="M 18 32 C 18 24 24 18 32 18 C 40 18 46 24 46 32 C 46 40 40 46 32 46" fill="none" stroke="url(#logoNvda)" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Candlestick + Vector Line -->
    <rect x="26" y="27" width="2.5" height="8" rx="0.8" fill="#10B981"/>
    <rect x="32" y="23" width="2.5" height="10" rx="0.8" fill="#76B900"/>
    <rect x="38" y="19" width="2.5" height="12" rx="0.8" fill="#38BDF8"/>
    <path d="M 16 42 Q 28 34 48 16" stroke="url(#logoTrend)" stroke-width="2" stroke-linecap="round"/>
    <polygon points="49,14 44,16 47,19" fill="#38BDF8"/>
  </g>

  <!-- Typography: NVIDIA on Tap -->
  <text x="72" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-size="20" font-weight="900" letter-spacing="-0.02em" fill="url(#textGrad)">NVIDIA</text>

  <!-- "on Tap" Badge Pill -->
  <rect x="156" y="16" width="66" height="22" rx="11" fill="#76B900" fill-opacity="0.15" stroke="#76B900" stroke-opacity="0.4" stroke-width="1"/>
  <text x="166" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Pretendard', sans-serif" font-size="11" font-weight="800" fill="#76B900" letter-spacing="0.04em">ON TAP</text>

  <!-- Subtitle -->
  <text x="72" y="48" font-family="-apple-system, BlinkMacSystemFont, 'JetBrains Mono', monospace" font-size="9.5" font-weight="600" fill="#71717A" letter-spacing="0.08em">NVDA INVESTOR HUB</text>
</svg>
"""

# 3. Web App Manifest
MANIFEST_JSON = """{
  "name": "NVIDIA on Tap - Investor Hub",
  "short_name": "NVIDIA on Tap",
  "description": "NVIDIA (NVDA) 실시간 퀀트 리서치, Blackwell AI 슈퍼사이클 속보 및 밸류에이션 인텔리전스 허브",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#09090b",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
"""

ADS_TXT = "google.com, pub-3683251602683857, DIRECT, f08c47fec0942fa0\n"

def render_icon_image(size: int) -> Image.Image:
    """Renders high-res pixel icon for Apple touch icon and Android PWA."""
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    r = int(canvas_size * 0.22)
    draw.rounded_rectangle([0, 0, canvas_size - 1, canvas_size - 1], radius=r, fill=(15, 23, 42, 255))
    draw.rounded_rectangle([0, 0, canvas_size - 1, canvas_size - 1], radius=r, outline=(118, 185, 0, 100), width=int(3 * scale))

    # Center Eye Arch
    cx, cy = canvas_size / 2, canvas_size / 2
    outer_rad = canvas_size * 0.32
    inner_rad = canvas_size * 0.18

    # Green Swirl Arc
    box = [cx - outer_rad, cy - outer_rad, cx + outer_rad, cy + outer_rad]
    draw.arc(box, start=120, end=390, fill=(118, 185, 0, 255), width=int(14 * scale))

    # Center core
    cr = int(canvas_size * 0.08)
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(118, 185, 0, 255))

    # Trend vector line
    p1 = (int(canvas_size * 0.2), int(canvas_size * 0.72))
    p2 = (int(canvas_size * 0.8), int(canvas_size * 0.22))
    draw.line([p1, p2], fill=(56, 189, 248, 255), width=int(7 * scale))

    # Arrow head
    draw.polygon([
        (int(canvas_size * 0.83), int(canvas_size * 0.19)),
        (int(canvas_size * 0.74), int(canvas_size * 0.20)),
        (int(canvas_size * 0.80), int(canvas_size * 0.27)),
    ], fill=(56, 189, 248, 255))

    return img.resize((size, size), Image.Resampling.LANCZOS)

def execute_generation():
    print("Executing branding asset generation...")
    # Write SVG files
    with open(os.path.join(PUBLIC_DIR, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(FAVICON_SVG.strip())

    with open(os.path.join(PUBLIC_DIR, "logo.svg"), "w", encoding="utf-8") as f:
        f.write(LOGO_SVG.strip())

    with open(os.path.join(PUBLIC_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        f.write(MANIFEST_JSON.strip())

    with open(os.path.join(PUBLIC_DIR, "ads.txt"), "w", encoding="utf-8") as f:
        f.write(ADS_TXT)

    # Render PNGs and ICO
    icon_512 = render_icon_image(512)
    icon_512.save(os.path.join(ICONS_DIR, "icon-512x512.png"), "PNG")

    icon_192 = render_icon_image(192)
    icon_192.save(os.path.join(ICONS_DIR, "icon-192x192.png"), "PNG")

    apple_touch = render_icon_image(180)
    apple_touch.save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG")

    favicon_32 = render_icon_image(32)
    favicon_32.save(os.path.join(PUBLIC_DIR, "favicon.png"), "PNG")

    favicon_16 = render_icon_image(16)
    favicon_48 = render_icon_image(48)
    favicon_16.save(
        os.path.join(PUBLIC_DIR, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[favicon_32, favicon_48],
    )
    print("✅ All branding assets generated successfully.")

if __name__ == "__main__":
    import sys
    if "--execute" in sys.argv or "-y" in sys.argv:
        execute_generation()
    else:
        print("Run with --execute to generate actual asset files after user confirmation.")
