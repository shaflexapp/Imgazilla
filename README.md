<div align="center">
    <br><h2><b>Imgazilla - </b> figma plugin for exporting favicon and image optimization</h2>
    <br><a title="Imgazilla - figma plugin for exporting favicon and image optimization" href="https://imgazilla.app">
        <img align="center" width="639" src="https://github.com/user-attachments/assets/c43b1b3b-02f5-4596-9d61-638b91c12e3b" alt="imgazilla" />
    </a>
</div>

## 📖 Table of Features
- Generate favicon.
- Optimize images.
- Background removal.
- Billing integration (lemonSqueez).
- Telegram notification.
- Figma API.

## 📖 Table of main packages
- Reactjs
- TypeScript
- Tailwindcss
- Redux-toolkit
- Radix-ui
- React-hook-form

## Quickstart

- Run `yarn` to install dependencies.
- Run `yarn dev` to start dev server.
- Open `Figma` -> `Plugins` -> `Development` -> `Import plugin from manifest...` and choose `manifest.json` file from this repo.

1. To change the UI of your plugin (the Reactjs code), start editing [App.tsx](src/app/App.tsx).  
2. To interact with the Figma API edit [FigmaPlugin.ts](./src/plugin/FigmaPlugin.ts).

## Browser support

The plugin UI runs in the browser that runs Figma. Figma itself needs Chrome 120, Edge 121, Firefox 128 ESR or Safari 17.4 or later, and the Figma desktop app ships a current Chromium.
The UI needs at least Chrome 111, Safari 16.4 or Firefox 128, the versions Tailwind CSS v4 requires. It also calls `Object.hasOwn` and `Array.prototype.at` while it loads. All browsers that Figma supports meet this.
