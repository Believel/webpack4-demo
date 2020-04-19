const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css
const glob = require('glob')
const webpack = require('webpack');
// 打包时命令行有信息提示的插件
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// 分析打包速度的插件
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// 体积大小分析插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
// 动态返回
const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugin = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/(.*)\/index.js/);
        const pageName = match && match[1]
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
    })
    return {
        entry,
        htmlWebpackPlugin
    }
}
const {entry, htmlWebpackPlugin } = setMPA();

const prodConfig = {
    entry,
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定打包目录
        // filename: 'bundle.js'  // 指定打包文件
        filename: '[name]_[chunkhash:8].js'  // 通过一个占位符来指定打包文件
    }, // 输入文件
    mode: 'production', // 生产环境
    resolve: {
        alias: {
            react: path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
        },
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.js'],
        mainFields: ['main']
    },
    module: {
        rules: [ // loader配置
            {
                test: /\.js$/,
                use: 'babel-loader?cacheDirectory=true',
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
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    },
                    {
                        // 压缩图片
                        loader: 'image-webpack-loader',
                        options: {
                          mozjpeg: {
                            progressive: true,
                            quality: 65
                          },
                          // optipng.enabled: false will disable optipng
                          optipng: {
                            enabled: false,
                          },
                          pngquant: {
                            quality: [0.65, 0.90],
                            speed: 4
                          },
                          gifsicle: {
                            interlaced: false,
                          },
                          // the webp option will enable WEBP
                          webp: {
                            quality: 75
                          }
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
        }),
        new FriendlyErrorsWebpackPlugin(),
        new BundleAnalyzerPlugin(),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, 'build/library'),
            manifest: require('./build/library/library.json')
        })
    ].concat(htmlWebpackPlugin), // 插件配置
    // devtool: 'eval' // 没有单独的source map文件生成
    // devtool: 'source-map' // 生成map文件
    // devtool: 'inline-source-map' // 不生成单独的source map文件，和打包文件内容合在一起
    stats: 'errors-only'
}

module.exports = smp.wrap(prodConfig)