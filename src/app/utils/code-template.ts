import escapeHtml from 'escape-html';

const appleHtmlSnippet = `
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">    
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" sizes="1024x1024" href="/apple-touch-icon-1024x1024.png">`;

export const getHtmlSnippet = ({
  color,
  isAndroid = false,
  isIOS = false,
  websiteName,
}: {
  color?: string;
  isAndroid?: boolean;
  isIOS?: boolean;
  websiteName?: string;
}) => {
  const snippet = [];

  snippet.push(
    `
    <link rel="icon" href="/favicon.ico">`,
  );

  if (isIOS) {
    snippet.push(appleHtmlSnippet);
  }

  snippet.push(
    `
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
  );

  if (isAndroid) {
    snippet.push(
      `
    <link rel="manifest" href="/manifest.json" />`,
    );
  }

  if (isAndroid && websiteName) {
    snippet.push(
      `
    <meta name="application-name" content="${escapeHtml(websiteName)}">`,
    );
  }

  snippet.push(
    `
    <meta name="theme-color" content="${color || '#FFFFFF'}">`,
  );

  return snippet;
};

export const getManifestObject = ({
  websiteName,
  themeColor,
}: {
  websiteName: string;
  themeColor: string;
}) => ({
  short_name: websiteName,
  name: websiteName,
  description: 'Manifest description',
  start_url: 'index.html',
  display: 'standalone',
  theme_color: themeColor,
  background_color: '#FFFFFF',
  icons: [
    {
      src: 'android-chrome-36x36.png',
      type: 'image/png',
      sizes: '36x36',
    },
    {
      src: 'android-chrome-48x48.png',
      type: 'image/png',
      sizes: '48x48',
    },
    {
      src: 'android-chrome-72x72.png',
      type: 'image/png',
      sizes: '72x72',
    },
    {
      src: 'android-chrome-96x96.png',
      type: 'image/png',
      sizes: '96x96',
    },
    {
      src: 'android-chrome-144x144.png',
      type: 'image/png',
      sizes: '144x144',
    },
    {
      src: 'android-chrome-192x192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: 'android-chrome-256x256.png',
      type: 'image/png',
      sizes: '256x256',
    },
    {
      src: 'android-chrome-384x384.png',
      type: 'image/png',
      sizes: '384x384',
    },
    {
      src: 'android-chrome-512x512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
});

export const headTag = '<head />';
