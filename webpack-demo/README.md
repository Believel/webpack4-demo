# webpack:配置文件名称
1. webpack默认配置文件：`webpack.config.js`
2. 可以通过 `webpack --config` 指定配置文件

# 环境搭建：安装`webpack`和`webpack-cli`
1. `npm install webpack webpack-cli --save-dev`
2. 检查是否安装成功
```js
./node_modules/.bin/webpack -v
```

# 通过`npm script`运行webpack
```js
"scripts": {
    "build": "webpack"  // npm run build 运行构建
},
// 原理： 模块局部安装在`node_modules/.bin`目录创建软链接
```

# webpack核心概念
## entry
## plugins
1. 插件用于bundle文件的优化，资源管理和环境变量注入
2. 作用于整个构建过程
3. 常用的插件
    * CommonsChunkPlugin  将chunks相同的模块代码取成公共js
    * `clean-webpack-plugin` 清理构建目录
    * ExtractTextWebpackPlugin 将CSS从bundle文件里提取出来成为一个独立的css文件
    * `html-webpack-plugin` 创建html文件去承载输出的bundle,也可以压缩html（里面有minify属性）
    * UglifyjsWebpackPlugin 压缩js（现在webpack内置了压缩，只需要mode设置为production）
    * `optimize-css-assets-webpack-plugin` 压缩css
    * `mini-css-extract-plugin` 提取css
    * `css-loader` 用于解析.css文件，并且转换成commonjs对象
    * `style-loader` 将样式通过<style></style>标签插入到head中
    * 自动补全CSS3前缀插件：`autoprefixer`和`postcss-loader`
        * 1. 在`webpack.config.js`
        ```js
            module.exports = {
                module: {
                    rules: [
                        {
                            test: /\.css$/,
                            use: [
                                {
                                    loader: MiniCSSExtractPlugin.loader,
                                },
                                'css-loader',
                              + 'postcss-loader'
                            ],
                            exclude: '/node_modules/'
                        },
                    ]
                }
            }
        ```
        * 2. 创建`postcss.config.js`

        ```js
        module.exports = {
            plugins: [
                require('autoprefixer')
                //require('autoprefixer')({
                //    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                //})
            ]
        }
        // 上面autoprefixer中传入browsers属性时,现在是会报警告的，可以用上面的overrideBrowserslist替代或者单独建一个`.browserslistrc`文件存储值
        ```
        * 3. 创建`.browserslistrc`

        ```js
        # Browsers that we support
        last 2 version
        >1%
        ios 7
        ```
    * 移动端css px自动转成rem
        * 插件`px2rem-loader`
    * 内联HTML和JS
        * `raw-loader`插件:`npm i raw-loader@0.5.1 -D`
        ```js
        // index.html
            <head>
                ${ require('raw-loader!./meta.html') }
                <title>Document</title>
                <script>${require('raw-loader!babel-loader!./node_modules/amfe-flexible/index.js')}</script>
            </head>
        ```
# webpack解析es6
```js
npm install @babel/core @babel/preset-env babel-loader -D
```
# webpack解析css
```js
css-loader 用于解析.css文件，并且转换成commonjs对象
style-loader将样式通过<style></style>标签插入到head中
```
# webpack解析图片、字体
```js
{
    test: /\.(png|svg|jpg|gif)$/,
    use: ['file-loader']
}
// url-loader也可以处理图片和字体，可以设置较小资源自动base64
```
# webpack中的文件监听
## webpack开启监听模式，有两种方式：
* 抵用 webpack 命令时，带上--watch参数
* 在配置webpack.config.js中设置 `watch: true`
```js
module.exports = {
        // 默认是false,也就是不开启
    watch: true,
    // 只有开启监听模式时，watchOptions才有意义
    watchOptions: {
        // 默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored: /node_modules/,
        // 监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout: 300,
        // 判断文件是否发生变化是通过不停询问系统指定文件有没有
        poll: 1000
    },
}
```
# webpack中热更新及原理分析
## 热更新webpack-dev-server
* WDS 不刷新浏览器
* WDS 不输出文件，而是放在内存中
* 使用 HotModuleReplacementPlugin插件
```js
const webpack = require('webpack')
module.exports = {
    mode: 'development',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}

// package.json中scripts属性中配置
"dev": "webpack-dev-server --open"
```
# 文件指纹策略`chunkhash`、`contenthash`和`hash`
1. 什么是文件指纹
    * 打包后输出的文件名的后缀
2. 常见的文件指纹有哪些
    * 1. Hash: 和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值就会更改
    * 2. Chunkhash: 和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值
    * 3. Contenthash: 根据文件内容来定义hash,文件内容不变，怎contentHash不变
```js
module.exports = {
    entry: {
        app: 'src/app.js',
        search: 'src/search.js
    },
    output: {
        filename: '[name][chunkhash:8].js',
        path: __dirname + 'dist'
    },
    plugins: [
        // 和style-loader不能同时使用，有冲突
        new MiniCssExtractPlugin({
            filename: `[name][contenthash:8].css`
        })
    ]
}
```
# 文件压缩（HTML、CSS和JavaScript代码压缩）
## HTML压缩
1. html-webpack-plugin
## CSS压缩
1. optimize-css-assets-webpack-plugin
2. cssnano
## JS压缩
1. uglifyjs-webpack-plugin现在内置了，只要mode设置为production即可生效

# webpack中打包多页面应用方案
> 多页面中每个页面对应一个entry,一个html-webpack-plugin,缺点是每次新增或者删除页面需要更改webpack配置

1. 动态获取entry和设置html-webpack-plugin数量
```js
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
```

# webpack中使用sourcemap
> 作用是通过source map 定位到源代码，开发环境开启，线上环境关闭
```js
devtool: 'source-map' // 生成独立的map文件
devtool: 'inline-source-map' // map内容和打包文件一样在一起
devtool: 'eval' // 不会生成map文件，嵌在打包文件中
```
# 提取页面公共资源
## 基础库分离
* 方式1：
    1. 思路: 将react、react-dom基础包通过cdn引入，不打入bundle中
    2. 方法: 使用`html-webpack-externals-plugin`
    ```js
    const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
    plugins: [
        new HtmlWebpackExternalsPlugin({
            externals: [
              {
                module: 'react',
                entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                global: 'React',
              },
              {
                module: 'react-dom',
                entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                global: 'ReactDOM',
              },
            ],
        })
    ]
    // 这样集成进去，打包引入的react、react-dom的地方，打包出来的文件会减少125K左右
    ```
    3. 手动在`index.html`引入react、react-dom文件的js
* 方式2：
    1. 利用webpack4中提供的内置的`SplitChunksPlugin`
        * chunks参数说明：
            * async 异步引入的库进行分离(默认)
            * initial 同步引入的库进行分离
            * all 所有引入的库进行分离(推荐)
    2. usage
    ```js
    module.exports = {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /(react|react-dom)/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    }
    // 注意这只是打包分离出来，使用的话，还需要把分离出来的vendors，放在html-webpack-plugin的`chunks`中
    ```
* 方式3：
    1. 使用DLLPlugin进行分包，DLLReferencePlugin对manifest.json引用，进行预编译资源文件。
    2. 创建一个`webpack.dll.js`文件
    ```js
    const path = require('path')
    const webpack = require('webpack')
    module.exports = {
        entry: {
            library: [
                'react',
                'react-dom'
            ]
        },
        output: {
            filename: '[name]_[chunkhash].dll.js',
            path: path.join(__dirname, 'build/library'),
            library: '[name]'
        },
        plugins: [
            new webpack.DllPlugin({
                name: '[name]_[hash]', // 暴露DLL的函数名
                path: path.join(__dirname, 'build/library/[name].json') // manifest.json文件的绝对路径
            })
        ]
    }
    ```
    2.在构建的webpack.config.js中
    ```js
    module.exports = {
        plugins: [
            new webpack.DllReferencePlugin({
                context: path.join(__dirname, 'build/library'), // 绝对路径，manifest中请求的上下文
                manifest: require('./build/library/library.json') // 包含 content 和 name 的对象，或者在编译时(compilation)的一个用于加载的 JSON manifest 绝对路径
            })
        ]
    }
    ```



## 公共文件分离
```js

module.exports = {
    optimization: {
        splitChunks: {
            minSize: 0, // 分离的最小的包体积大小
            cacheGroups: {
                // key键名字可以随意起
                // 分离公共基础库
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all'
                },
                // 分离公共文件
                commonFile: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2 // 设置最小引用次数为2次
                }
            }
        }
    }
}
// 注意这只是打包分离出来，使用的话，还需要把分离出来的chunks名字放在html-webpack-plugin的`chunks`中
```

# tree shaking(摇树优化)
* 概念：1个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking 就是只把用到的方法打入bundle, 没用到的方法会uglify阶段被擦除掉
* 使用：
    * webpack默认支持，在`.babelrc`里设置`moudles: false`即可
    * production mode的情况下默认开启
* 要求：必须是ES6的语法
* 无用的CSS如何删除掉？
    * PurifyCSS：遍历代码，识别已经用到的CSS class
    * uncss: HTML需要通过jsdom加载，所有的样式通过postCSS解析，通过document.querySelector来识别在html文件里面不存在的选择器
    

# Scope Hoisting
* 现象：构建后的代码存在大量的闭包
* 原理：将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
* 好处：通过scope hoisting可以减少函数声明代码和内存开销
* 使用webpack mode 为production默认开启,必须是ES6语法，其他不支持

# 代码分割和动态import
* 适用场景
    * 抽离相同代码到一个共享块
    * 脚本懒加载，使得初始下载的代码更小
        * 懒加载脚本的方式
            1. CommonJS: require.ensure
            2. ES6：动态import（目前还没有原生支持，需要babel转换）
                * 安装babel插件`npm i @babel/plugin-syntax-dynamic-import -D`
                * .babelrc
                ```js
                {
                    plugins: ["@babel/plugin-syntax-dynamic-import"]
                }
                ```
                * usage
                ```js
                // 代码补全，只粘贴了主要代码
                import('./component/text.js').then(Text => {
                    console.log(Text)
                    this.setState({
                        Text: Text.default
                    })
                })
                // 打包的时候会生成一个独立的文件：例如 4_7a1a2466.js，当触发的时候可以在浏览器network中动态的看到加载此文件的情况
                ```
# webpack中打包组件和基础库
1. `webpack.config.js` 
```js
const TerserPlugin = require('terser-webpack-plugin');//指定压缩文件
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
```
2. `package.json`
```js
{
    "name": "large-number-zpp",
    "version": "1.0.0",
    "description": "大整数加法打包发版测试",
    "main": "index.js",
}
```
# webpack中使用ESLint
1. `eslint-loader`

# webpack实现SSR打包
## SSR 代码实现思路
* 服务端
    * 使用`react-dom/server`的`renderToString`方法将React组件渲染成字符串
    * 服务端路由返回对应的模板
* 客户端
    * 打包出针对服务端的组件

> 图片没显示出来

# 优化构建时命令行的显示日志
## 统计信息stats
1. 'errors-only' none 只有错误发生时输出
2. ’minimal‘ none 只在发生错误或有新的编译时输出
3. ’none' false 没有输出
4. ‘normal’ true 标准输出
5. ‘verbose’ none 全部输出
## 命令行打印信息插件
1. `friendly-errors-webpack-plugin`
```js
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
module.exports = {
    plugins: [
        new FriendlyErrorsWebpackPlugin()
    ]
}
```

# 构建异常和中断处理
1. 每次构建完成后输入`echo $?`获取错误码

# 使用webpack内置的stats查看构建信息统计
```js
"scripts": {
    "build:stats": "webpack --env production --json > stats.json"
}
```
# 速度分析
1. 使用`speed-measure-webpack-plugin`
```js
// 可以看到每个loader和插件执行耗时
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const webpackConfig = smp.wrap({
    plugins: [
      new MyPlugin(),
      new MyOtherPlugin()
    ]
});
```
# 体积分析
1. 使用`webpack-bundle-analyzer`
```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
// 构建完成之后会在端口8888展示出来
```
# 使用高版本的webpack和Node.js
## webpack4优化原因
1. V8带来的优化(for of替代forEach，Map和Set替代Object,includes替代indexOf)
2. 默认使用更快的md4 hash算法
3. webpack AST可以直接从loader传递给AST减少解析时间
4. 使用字符串方法替代正则表达式

# 充分利用缓存提升二次构建速度
## 思路
* `babel-loader`开启缓存
* `terser-webpack-plugin`开启缓存
* 使用`cache-loader`或者`hard-source-webpack-plugin`

# 缩小构建目标
## 减少文件搜索范围
1. 优化 `resolve.modules`配置（减少模块搜索层级）
2. 优化 `resolve.mainFields`配置
3. 优化 `resolve.extension`配置
4. 合理使用 `alias`
```js
resolve: {
    alias: {
        react: path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
    },
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.js'],
    mainFields: ['main']
},
```

# 使用webpack进行图片压缩
1. 使用`image-webpack-loader`
```js
module.exports = {
    module: {
        rules: [
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
            }
        ]
    }
}
```

# 使用动态Polyfill服务



# webpack-cli
## webpack-cli做的事情
1. 引入 `yargs`,对命令行进行定制
2. 分析命令行参数，对各个参数进行转换，组成编译配置项
3. 引用 `webpack`,根据配置项进行编译和构建


# 动手实现一个简易的 webpack
1. 可以将ES6语法转换成ES5
    * 通过 `babylon` 生成AST
    * 通过 `babel-core` 将AST重新生成源码
2. 可以分析模块之间的依赖关系
    * 通过`babel-traverse`的`ImportDeclaration`方法获取依赖属性
3. 生成的 JS 文件可以在浏览器中运行