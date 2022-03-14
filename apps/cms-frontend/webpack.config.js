const { merge } = require('webpack-merge');
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const path = require('path');
module.exports = (config) => {
  const tailwindConfig = require('./tailwind.config.js')(mode);
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  syntax: 'postcss-scss',
                  plugins: [require('postcss-import'), require('tailwindcss')(tailwindConfig), require('autoprefixer')],
                },
              },
            },
          ],
          exclude: [path.normalize(`${config.resolve.modules[0]}/libs/`)],
        },
      ],
    },
  });
};
