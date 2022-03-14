const { merge } = require('webpack-merge');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = (config) => {
  const isProd = config.mode === 'production';
  const tailwindConfig = require('./tailwind.config.js')(isProd);

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
                  plugins: [
                    require('postcss-import'),
                    require('tailwindcss')(tailwindConfig),
                    require('autoprefixer'),
                    purgecss({
                      content: ['./**/*.html'],
                      // Example to let PurgeCss know how to exclude cdk and mat prefixes if your using Angular CDK and Angular Material
                      whitelistPatterns: [/^cdk-|mat-/],
                      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
                      keyframes: true,
                      blocklist: [/^lg:/, /^md:/, /^sm:/, /^xl:/, /^2xl:/, /^xxs:/, /^xxxs:/, /^grid-cols-/, /^gap-/, /^italic/, /^tw-ring-/, /^flex-shrink/, /^flex-grow/],
                    }),
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  });
};
