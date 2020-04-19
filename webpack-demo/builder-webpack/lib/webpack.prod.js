const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  plugins: [
    // 代码压缩
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0, // 分离的最小的包体积大小
      cacheGroups: {
        // 基础库分离
        commons: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all',
        },
        // 公共包提取
        commonFile: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2, // 设置最小引用次数为2次
        },
      },
    },
  },
};
module.exports = merge(baseConfig, prodConfig);
