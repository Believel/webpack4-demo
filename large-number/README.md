#  webpack 打包库和组件
> 需求：实现一个大整数加法库的打包：1.需要打包压缩版和非压缩版本 2.支持AMD/CJS/ESM 模块引入

1. 命令行中先登录npm账号: `npm login`
2. 命令行中发布：`npm publish`
    * 发布npm包报错：03 403 Forbidden - PUT https://registry.npmjs.org/large-number - You do not have permission to publish "large-number". Are you logged in as the correct user?
        * 解决办法是你在package.json中登记的name已经被采用了，重命名了，所以得换一个。我们在发布一个包之前，最好拿着这个登记的name去搜一下，如果已经有了，那就要换一个。