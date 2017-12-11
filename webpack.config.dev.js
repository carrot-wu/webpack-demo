// 引入基础配置
const webpackBase = require("./webpack.config.base");
const webpackMerge = require('webpack-merge') //获取内置的webpack
const webpack = require('webpack')
const cssDev = [
    {loader: 'style-loader'}, //加载loader
    {loader: 'css-loader', options: {importLoaders: 1}},
    {loader: 'postcss-loader'},

] //开发环境下css的配置


module.exports = webpackMerge(webpackBase,{

 
    /*loader 模块加载*/
    module: {
        rules: [
            {
                test: /\.css$/, //匹配所有css文件
                use: cssDev,
                exclude: /node_modules/ //excluder排除怼node下的文件的匹配
            },

        ]
    },
    /*插件安装*/
    plugins: [
        /*  开启热模块更新*/
        //new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    /*开启sourcemap调试*/
    devtool: 'eval-source-map',
    devServer: {
        //contentBase: path.join(__dirname, "./dist"),
        //因为热更新使用的是内存 默认资源是保存在内存中的 需要使用publishpath制定相对路径
        contentBase: './',
        publicPath: '/',
        port: 8032,
        hot: true, //热更新
        hotOnly: true,
        /*inline模式开启服务器*/
        inline: true,
        //historyApiFallback: true, //跳转页面
        openPage: './index.html', //默认打开的页面
        open: true, //自动打开页面,
        clientLogLevel: "none" //阻止打印那种搞乱七八糟的控制台信息
        //注意  热更新还存在着许多的bug
    }
});