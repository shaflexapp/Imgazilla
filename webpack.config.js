const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Dotenv = require('dotenv-webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('./webpack/plugins/inline-chunk-html');

const getEnvFile = (mode) =>
  mode === 'production' ? '.env' : '.env.development.local';

// An existing env file fully controls the bundle, as before. Without one
// (e.g. in CI) the values come from the build environment instead.
const hasEnvFile = (mode) => fs.existsSync(getEnvFile(mode));

const assertProductionEnv = (mode) => {
  if (mode !== 'production') return;

  const envFile = getEnvFile(mode);
  const env = hasEnvFile(mode)
    ? dotenv.parse(fs.readFileSync(envFile))
    : process.env;

  if (!env.BASE_API_URL || !env.BASE_API_URL.trim()) {
    throw new Error(
      `BASE_API_URL is not set, so the plugin would not know where the API is. ` +
        (hasEnvFile(mode)
          ? `Add BASE_API_URL=https://imgazilla.app/api to ${envFile} ` +
            '(the build environment is only read when there is no env file).'
          : `Create ${envFile} from .env.example, or pass it in the environment: ` +
            'BASE_API_URL=https://imgazilla.app/api yarn build'),
    );
  }
};

const createConfig = (_env, { mode }) => ({
  mode: mode === 'production' ? 'production' : 'development',
  devtool: mode === 'production' ? false : 'inline-source-map',
  entry: {
    ui: './src/app/index.tsx',
    code: './src/plugin/FigmaPlugin.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              // React 19 requires the automatic JSX runtime (react/jsx-runtime).
              // The syntax is still detected from the file extension.
              jsc: {
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader', // Translates CSS into CommonJS
          'postcss-loader', // Process CSS with PostCSS
        ],
      },
      {
        // Always inlined as a base64 data URL, like url-loader without a limit.
        test: /\.(png|jpg|gif|webp)$/,
        type: 'asset/inline',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
          },
        ],
      },
    ],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    fallback: {
      stream: require.resolve('stream-browserify'),
    },
  },

  experiments: {
    // html-webpack-plugin builds index.html. Without this, webpack >= 5.109
    // enables its own HTML support and minifies index.html a second time,
    // including the inlined ui chunk.
    html: false,
  },

  optimization: {
    nodeEnv: mode === 'production' ? 'production' : 'development',
    minimize: mode === 'production',
    usedExports: true,
    concatenateModules: true,
  },

  output: {
    publicPath: '',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new Dotenv({
      path: getEnvFile(mode),
      systemvars: !hasEnvFile(mode),
      silent: !hasEnvFile(mode),
    }),
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      inject: 'body',
      filename: 'index.html',
      chunks: ['ui'],
      cache: mode === 'production',
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
  ],
});

module.exports = (env, argv) => {
  assertProductionEnv(argv.mode);

  return createConfig(env, argv);
};
