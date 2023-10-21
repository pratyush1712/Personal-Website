import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    "short_name": "Pratyush Sudhakar",
    "name": "Personal Website of Pratyush Sudhakar",
    "icons": [
      {
        "src": "favicon.png",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "favicon.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "favicon.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  }
} 