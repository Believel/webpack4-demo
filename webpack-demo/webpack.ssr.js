const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const glob = require('glob')
const webpack = require('webpack');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
// 动态返回
const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugin = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/(.*)\/index-server.js/);
        const pageName = match && match[1]
        console.log(pageName)
        if (pageName) {
            entry[pageName] = entryFile
            htmlWebpackPlugin.push(
                new HtmlWebpackPlugin({
                    title: pageName,
                    filename: `${pageName}.html`,
                    template: path.join(__dirname, `./src/${pageName}/index.html`),
                    // 注意:chunks中的值是有顺序的，先加入的先执行
                    chunks: ['vendors', 'commons', pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                })
            )
        }
    })
    return {
        entry,
        htmlWebpackPlugin
    }
}
const {entry, htmlWebpackPlugin } = setMPA();

module.exports = {
    // entry: {   // 多入口
        // index: './src/index/index.js',
        // main: './src/main.js'
    entry,
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定打包目录
        // filename: 'bundle.js'  // 指定打包文件
        filename: '[name]-server.js',  // 通过一个占位符来指定打包文件
        libraryTarget: 'umd'
    }, // 输入文件
    mode: 'none', // 生产环境
    module: {
        rules: [ // loader配置
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                    },
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,// rem转成px单位，这里是1rem = 75px
                            remPrecision: 8 // rem转化的小数
                        }
                    }
                ],
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                // 解析字体
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new MiniCSSExtractPlugin({
            filename: '[name]_[contenthash:8].css',
            chunkFilename: '[id].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        })
    ].concat(htmlWebpackPlugin), // 插件配置
    // devtool: 'eval' // 没有单独的source map文件生成
    // devtool: 'source-map' // 生成map文件
    // devtool: 'inline-source-map' // 不生成单独的source map文件，和打包文件内容合在一起
}