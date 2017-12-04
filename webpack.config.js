const path = require('path'); //定义绝对路径
const htmlWepackPlugin = require('html-webpack-plugin'); //html模板插件
const cleanWebpackPlugin = require('clean-webpack-plugin'); //每次清楚dist文件的插件
const webpack = require('webpack') //获取内置的webpack


const ExtractTextPlugin = require('extract-text-webpack-plugin');//加载分离css文件和js文件的插件
/*
//  创建多个实例
const extractCSS = new ExtractTextPlugin(' stylesheets / [name] -one.css ');
const extractLESS = new ExtractTextPlugin(' stylesheets / [name] -two.css ');
*/
module.exports = {
    entry: path.resolve(__dirname, './src/js/app.js'), /*webpack打包的入口文件地址*/
    output: {
        path: path.resolve(__dirname, './dist'), /*webpack打包的文件输出地址*/
        filename: 'js/[name]-[hash].js'/*webpack打包的文件名字 其中【】那么根据入口文件名字进行命名 其中哈有hash*/
    },
    /*loader 模块加载*/
    module: {
        rules: [
            {
                test: /\.js$/, //匹配所有css文件
                use: [
                    {loader: 'babel-loader'}, //编译es6
                ],
                exclude: /node_modules/ //excluder排除怼node下的文件的匹配
            },
            {
                test: /\.css$/, //匹配所有css文件
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        //{loader:'style-loader'}, //加载loader
                        {loader: 'css-loader', options: {importLoaders: 1}},
                        {loader: 'postcss-loader'},
                    ]
                }),
                exclude: /node_modules/ //excluder排除怼node下的文件的匹配
            }
            /*, 两种不同文文件的打包方法
            {
                test:/\.less$/, //匹配所有less文件
                use:extractLESS.extract([
                    //{loader:'style-loader'}, //加载loader
                    {loader:'css-loader',options:{importLoaders:1}},
                    {loader:'postcss-loader'},
                    {loader:'less-loader'}//因为上面编译的css所有要吧less先编译成css

                ]),
                exclude:/node_modules/ //excluder排除怼node下的文件的匹配
            }*/
        ]
    },
    /*插件安装*/
    plugins: [
    /*以一个html模板进行创建html文件*/
        new htmlWepackPlugin({
            template: 'index.html',
            filename: 'main.html'
        }),
        /*每次进行打包的时候都把dist文件的内容进行清除*/
        new cleanWebpackPlugin(
            ['dist'], //这里指每次清除dist文件夹的文件 匹配的文件夹
            {
                root: __dirname,//制定插件根目录位置
                //verbose: true, //开启控制台输出
                dry: false//启用删除文件
            }
        ),
        /*加载把css文件单独分离出来的插件*/
        new ExtractTextPlugin({
            filename:  (getPath) => {
                return getPath('css/[name]-[contenthash].css').replace('css/js', 'css');
                /* [name] 根据html名字获取的css名字  contenthash加上hash值*/
            },
            allChunks: true
        }),
        /*  开启热模块更新*/

        new webpack.HotModuleReplacementPlugin()
    ],
    /*开启sourcemap调试*/
    devtool: 'eval-source-map',
    devServer:{
    	contentBase:path.join(__dirname,"./dist"),
    	port:8032,
    	hot:true, //热更新
    	/*inline模式开启服务器*/
    	inline:true,
    	historyApiFallback: false, //跳转页面
    	openPage:'main.html'

    }
};