const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: "none",
    entry: {
        'large-number': './src/index.js',
        'large-number.min': './src/index.js'
    },
    output: {
        filename: '[name].js',
        library: 'largeNumber', // 指定库的全局变量
        libraryTarget: 'umd', // 支持库引入的方式
        libraryExport: 'default'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/
            }),
        ]
    }
}