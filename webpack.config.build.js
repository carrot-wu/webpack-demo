// 引入基础配置
const webpackBase = require("./webpack.config.base");
const ExtractTextPlugin = require('extract-text-webpack-plugin');//加载分离css文件和js文件的插件
const webpackMerge = require('webpack-merge') 



//生产环境css配置
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',

    use: [
        {loader: 'css-loader', options: {importLoaders: 1,minimize:true}},
        {loader: 'postcss-loader'},
    ],
    publicPath: '../'    //TODO 因为这里下面的css文件输出地址在css中  路径图片的../变成了 /被吃掉了 搜一下雨要在这充值设置一下
})



module.exports = webpackMerge(webpackBase,{

    /*loader 模块加载*/
    module: {
        rules: [
            {
                test: /\.css$/, //匹配所有css文件
                use: cssProd,
                exclude: /node_modules/ //excluder排除怼node下的文件的匹配
            },

        ]
    },
    /*插件安装*/
    plugins: [
        /*加载把css文件单独分离出来的插件*/
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/[name]-[contenthash:6].css').replace('css/js', 'css');
                /* [name] 根据html名字获取的css名字  contenthash:6加上hash:6值*/
            },
            allChunks: true
        })

    ],
});