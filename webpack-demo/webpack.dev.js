const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const glob = require('glob')
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
                chunks: [pageName],
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

module.exports = {
    // entry: './src/index.js', // 入口文件:针对单入口
    entry,
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定打包目录
        // filename: 'bundle.js'  // 指定打包文件
        filename: '[name]_[hash:8].js'  // 通过一个占位符来指定打包文件
    }, // 输入文件
    mode: 'development', // 环境
    // 默认是false,也就是不开启
    // watch: true,
    // 只有开启监听模式时，watchOptions才有意义
    // watchOptions: {
    //     // 默认为空，不监听的文件或者文件夹，支持正则匹配
    //     ignored: /node_modules/,
    //     // 监听到变化发生后会等300ms再去执行，默认300ms
    //     aggregateTimeout: 300,
    //     // 判断文件是否发生变化是通过不停询问系统指定文件有没有
    //     poll: 1000
    // },
    module: {
        rules: [ // loader配置
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                // 解析字体
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'errors-only'
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     title: '我的标题',
        //     filename: 'index.html', // 输出的html文件
        //     template: './src/index/index.html'
        new webpack.HotModuleReplacementPlugin()
    ].concat(htmlWebpackPlugin), // 插件配置
    // devtool: 'inline-source-map'
    devtool: 'source-map'
}