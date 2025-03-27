# `<sw-image>`

Somewhat overengineered web component to create image placeholders.

## Installation
Via [`npm`](https://www.npmjs.com/package/@shadeweave/sw-image) or download [`sw-image.js`](./sw-image.js) directly for use in your project.

```sh
npm install @shadeweave/sw-image
```

## Usage
Default:
`<sw-image></sw-image>`

Custom size:
`<sw-image width="200" height="200"></sw-image>`

Text inside of image:
`<sw-image text="Lorem ipsum"></sw-image>`

Responsive image:
`<sw-image fluid></sw-image>`

## Options
| Attribute | Default | Description |
|-|-|-|
| `img` | | Output as an `<img>`.  This encodes the SVG as the image's data source. |
| `fluid` | | Create responsive image that scales to the width of their container. |
| `width` | `100%` | Image width.  Can be a percentage or a unitless pixel value. |
| `height` | `160` | Image height. Can be a percentage  or a unitless pixel value. |
| `bg-color` | `#dadef0` | Color of the background. |
| `text-color` | `#1c2428` | Text color.  Please keep minimum contrast ratios in mind. |
| `font-family` | `system-ui, sans-serif` | Font family |
| `font-size` | `1rem` | Font size |
| `font-weight` | `600` | Font weight |
| `title` | `"Placeholder"` | Title text.  Shown as browser tooltip on hover. First part of `alt` attribute. |
| `text` | `""` | Text to display within the image. Second portion of the `alt` attribute.  |

