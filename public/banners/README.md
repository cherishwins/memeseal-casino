# Marketing Banners

Drop-in SVG assets for promoting the casino. All vector — scale to any size, edit in Figma / Inkscape / any browser, or export to PNG with:

```bash
# Using rsvg-convert
rsvg-convert -w 1200 -h 630 social-share.svg -o social-share.png

# Or with ImageMagick
magick convert -density 300 social-share.svg social-share.png
```

| File | Dimensions | Best for |
| --- | --- | --- |
| `social-share.svg` | 1200×630 | Open Graph / Twitter Card / Facebook share previews |
| `telegram-channel.svg` | 1280×720 | Telegram channel banner, group cover |
| `x-post.svg` | 1600×900 | X / Twitter post hero image |

## Customizing for your theme

Each SVG uses these brand colors. Search-and-replace to re-skin:

| Token | Hex | Where |
| --- | --- | --- |
| Matrix green | `#00ff41` | Primary accents, grid |
| Frog green | `#39ff14` | Body callouts |
| Casino gold | `#ffd700` | CTAs, headline highlights |
| Neon pink | `#ff00ff` | Secondary accents |
| Neon cyan | `#00ffff` | Tags, small labels |
| Background | `#0d0d0d` | Dark base |

## When to use which

- **`social-share.svg`** — Set as `og:image` and `twitter:image` in `index.html`. This is what shows when someone shares your URL.
- **`telegram-channel.svg`** — Upload as your bot's profile photo or channel banner in BotFather / channel settings.
- **`x-post.svg`** — Use for organic posts. Pair with a 1-liner: *"750 free chips, 100× jackpot, the lottery pot grows with every bet."*
