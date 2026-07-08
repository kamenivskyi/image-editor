# 🖼️ Image Editor — Non-Destructive Browser Image Editor

A browser-based, non-destructive image editor built with **Vue 3**, **Nuxt 3** **Vuetify 4**, **Pinia**, and **TypeScript**. Designed for the printing industry workflow where preparing and adjusting images for output is everyday work.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Image Upload** | Drag-and-drop or click-to-browse with file validation (JPEG, PNG, WebP, BMP; max 10 MB) |
| **Crop** | Interactive cropping with aspect ratio presets (Free, 1:1, 4:3, 16:9) via [cropperjs](https://github.com/fengyuanchen/cropperjs) |
| **Brightness** | Live slider (-100 to +100) with real-time preview |
| **Saturation** | Live slider (-100 to +100) with real-time preview |
| **Filters** ★ | Grayscale, Sepia, Invert with adjustable intensity (0–100%) |
| **Reset** | One-click reset to the original unedited image |
| **Export Image** | Download the edited result as PNG |
| **Export JSON** ★ | Download the operations pipeline as a replayable JSON descriptor |

> ★ — Bonus features

## 🚀 Quick Start

```bash
npm i && npm run dev
```

The app will be available at `http://localhost:3000/`.

## 🏗️ Architecture

### Non-Destructive Pipeline

The editor never mutates the original image. Instead, it maintains an ordered list of **operation descriptors** and replays them sequentially on the original to produce the preview:

```
Original Image → [crop] → [brightness] → [saturation] → [filter] → Preview
```

- **Reset** = clear the operations list → preview reverts to original
- **Export** = render the pipeline onto an offscreen canvas and download the result

### Design Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Strategy** | `app/core/operations/*` | Each operation (brightness, saturation, crop, filter) implements the `IImageOperation` interface. New operations can be added without modifying existing code (Open/Closed Principle). |
| **Registry** | `app/core/registry.ts` | A central map of operation type → strategy. Decouples consumers from concrete implementations. |
| **Mediator** | `app/composables/*` | Composables (`useEditor`, `useImageExport`) mediate between UI components and the store/pipeline, keeping components thin. |
| **Pipeline** | `app/core/pipeline.ts` | Sequential application of operations on an offscreen canvas, producing the final result. |

### SOLID Principles

- **Single Responsibility** — Each operation handles one transformation; the store manages state; composables manage coordination.
- **Open/Closed** — New operations are added by creating a new file in `core/operations/` and registering it, without touching existing code.
- **Interface Segregation** — `IImageOperation` is a minimal contract (`type` + `apply`).
- **Dependency Inversion** — The pipeline and store depend on the `IImageOperation` interface, not on concrete operations.

## 📁 Project Structure

```
app/
├── app.vue                          # Root layout (upload view ↔ editor view)
├── types/
│   └── editor.ts                    # TypeScript interfaces & types
├── core/                            # Pipeline engine (framework-agnostic)
│   ├── registry.ts                  # OperationRegistry (singleton)
│   ├── pipeline.ts                  # applyPipeline() — renders operations on canvas
│   └── operations/                  # Strategy implementations
│       ├── brightness.ts
│       ├── saturation.ts
│       ├── crop.ts
│       └── filter.ts
├── stores/
│   └── editor.ts                    # Pinia store — state, operations[], preview
├── composables/
│   ├── useEditor.ts                 # Mediator — file upload, slider updates, debouncing
│   └── useImageExport.ts            # Image & JSON export logic
├── components/
│   ├── ImageUpload.vue              # Drag-and-drop upload zone
│   ├── ImageCanvas.vue              # Live preview display
│   ├── EditorToolbar.vue            # Top bar — mode toggle, reset, export
│   ├── AdjustmentPanel.vue          # Brightness & saturation sliders
│   ├── FilterPanel.vue              # Filter selection cards + intensity
│   └── CropPanel.vue                # Crop tool with aspect ratio presets
└── assets/scss/                     # SCSS 7-1 architecture with BEM
    ├── main.scss                    # Entry point
    ├── abstracts/
    │   ├── _variables.scss          # Design tokens (colors, spacing, typography)
    │   └── _mixins.scss             # Reusable mixins (glassmorphism, responsive)
    ├── base/
    │   ├── _reset.scss              # CSS reset
    │   └── _typography.scss         # Font import (Inter), base text styles
    ├── components/
    │   └── _editor.scss             # BEM component styles
    └── layout/
        └── _app.scss                # App layout base
```

## 🔧 Operations JSON Schema

When exporting operations, the app produces a JSON file with the following structure. Replaying these operations on the original image reproduces the edited result:

```json
{
  "version": 1,
  "originalFileName": "photo.jpg",
  "operations": [
    {
      "type": "crop",
      "params": { "x": 10, "y": 20, "width": 300, "height": 200 }
    },
    {
      "type": "brightness",
      "params": { "value": 25 }
    },
    {
      "type": "saturation",
      "params": { "value": -15 }
    },
    {
      "type": "filter",
      "params": { "name": "sepia", "intensity": 80 }
    }
  ]
}
```

### Schema Details

| Field | Type | Description |
|-------|------|-------------|
| `version` | `number` | Schema version for forward compatibility |
| `originalFileName` | `string` | Name of the source file |
| `operations` | `IOperationDescriptor[]` | Ordered list of operations to replay |
| `operations[].type` | `string` | Operation identifier (`crop`, `brightness`, `saturation`, `filter`) |
| `operations[].params` | `object` | Operation-specific parameters |

### Parameter Reference

| Operation | Param | Type | Range | Description |
|-----------|-------|------|-------|-------------|
| `brightness` | `value` | `number` | -100 … +100 | 0 = unchanged, maps to CSS `brightness(0…2)` |
| `saturation` | `value` | `number` | -100 … +100 | 0 = unchanged, maps to CSS `saturate(0…2)` |
| `crop` | `x`, `y`, `width`, `height` | `number` | pixels | Rectangle in original image coordinates |
| `filter` | `name` | `string` | `grayscale` \| `sepia` \| `invert` | CSS filter name |
| `filter` | `intensity` | `number` | 0 … 100 | Filter strength in percent |

## 🎨 Styling

- **SCSS 7-1 architecture** with **BEM** naming convention
- **Dark theme** with green accent palette (`#16a34a` / `#22c55e`)
- **Glassmorphism** effects on panels and toolbar
- **Responsive** layout — sidebar collapses below `1024px`, toolbar adapts below `768px`
- **Inter** font via Google Fonts

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Nuxt](https://nuxt.com/) | 4.x | Framework & build tooling |
| [Vue](https://vuejs.org/) | 3.5 | Reactive UI |
| [Vuetify](https://vuetifyjs.com/) | 4.x | Material Design component library |
| [Pinia](https://pinia.vuejs.org/) | 3.x | State management |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [cropperjs](https://github.com/fengyuanchen/cropperjs) | 1.x | Interactive image cropping |
| [SCSS](https://sass-lang.com/) | — | Styling (7-1 architecture + BEM) |

## 📝 Key Decisions & Trade-offs

1. **CSS Canvas Filters over Pixel Manipulation** — Using `ctx.filter` with CSS filter functions (`brightness()`, `saturate()`, `grayscale()`, etc.) instead of manual pixel-by-pixel ImageData manipulation. This is GPU-accelerated and much faster, though slightly less precise than per-pixel math.

2. **Stale-Render Protection** — The store uses a render counter to discard outdated preview renders when the user moves sliders quickly, preventing visual flickering.

3. **Debounced Preview** — Slider adjustments debounce the pipeline re-render (100ms) to avoid excessive canvas redraws during rapid slider movement.

4. **SSR Disabled** — The app sets `ssr: false` because the entire editing pipeline relies on browser-only APIs (Canvas, FileReader, cropperjs). No server-side rendering benefit exists for this use case.

5. **cropperjs v1 over v2** — v2 is a complete rewrite using Web Components with a different API. v1 provides the classic, well-documented jQuery-style API that integrates cleanly with Vue refs.

6. **Upsert-Based Operation Management** — Operations are stored as a flat array with upsert semantics (one entry per type). This simplifies the model at the cost of not supporting multiple operations of the same type (e.g., two brightness adjustments). For this editor's scope, that trade-off is acceptable.

## 📄 License

MIT
