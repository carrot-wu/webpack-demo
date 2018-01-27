const path = require('path'); //定义绝对路径
const fs = require('fs');
const utils = require('./getFileConfig'); //获取文件名称
const htmlWepackPlugin = require('html-webpack-plugin'); //html模板插件
const cleanWebpackPlugin = require('clean-webpack-plugin'); //每次清楚dist文件的插件
const copyWebpackPluigin = require('copy-webpack-plugin'); //复制文件  用于一些无法npm的第三方框架ui 但是需要在html模板中添加css框架
const UglifyJSPlugin = require('uglifyjs-webpack-plugin') //开启多线程进行加快速度

const webpack = require('webpack') //获取内置的webpack
/*一些多页面应用的配置*/

// 定义入口文件的集合
let entryTemplate = {}
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];

/*文件名字数组*/
let templateFileName = utils.getFileNameList('./src/page')


// 通过htmlwebpackPlugin创建多个模板文件

templateFileName.forEach((pageName) => {
    const _htmlTemplate = new htmlWepackPlugin({

        /* 删除了 这里加了page目录本来想着页面能够丢到page目录下  后面发现热更新模块并不行 反而资源文件能够读取了*/
        filename: `./page/${pageName}.html`,
        template: path.resolve(__dirname, `./src/page/${pageName}.html`),
        title:'',//打包的html title
        minify: {
            removeComments: true,
            collapseWhitespace: true
        },
        //TODO 定义每个文件所加载的js模块 自身带的js 以及commonsjs
        chunks: ['vendor', 'app',pageName],
	    chunksSortMode:'manual' //定义js加载顺序 按顺序
    })
    //template模板
    HTMLPlugins.push(_htmlTemplate)
    //定义入口文件
    entryTemplate[pageName] = path.resolve(__dirname, `./src/js/${pageName}.js`)
})


/*
//  创建多个实例
const extractCSS = new ExtractTextPlugin(' stylesheets / [name] -one.css ');
const extractLESS = new ExtractTextPlugin(' stylesheets / [name] -two.css ');
*/




module.exports = {
    entry: Object.assign(entryTemplate, {'app': path.resolve(__dirname, `./src/js/app.js`)}), /*webpack打包的入口文件地址*/
    output: {
        path: path.resolve(__dirname, './dist'), /*webpack打包的文件输出地址*/
        filename: 'js/[name]-[chunkhash:6].js',
	    /*webpack打包的文件名字 其中【】那么根据入口文件名字进行命名 其中
        用chunkhash的原因文件没有发生改变并不会修改hash
        */
        //publicPath 上线替换真实的http,如果设置为/则需把dist下的文件放在项目的根目录


    },

    /*loader 模块加载*/
    module: {
        rules: [
            /*引入jq  如果在项目中需要用到jquery 直接require("expose-loader?$!jquery");*/
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.js$/, //匹配所有css文件
                use: [
                    {loader: 'babel-loader'}, //编译es6
                ],
                exclude: /node_modules/ //excluder排除怼node下的文件的匹配
            },

            {
                test: /\.html$/, //匹配所有css文件
                use: ['html-loader?minimize=true'],
                exclude: /node_modules/ //excluder排除怼node下的文件的匹配
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name]-[hash:6].[ext]',
                        outputPath: 'image/',
                        limit: 4000,
                        publicPath:'../' // 所以是基于page文件夹进行相对定位 要设置publicPath绝对路径
                    }

                }, 'image-webpack-loader']
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name:6].[ext]',
                    outputPath: 'fonts/',
                    publicPath:'../' //同理 所以是基于page文件夹进行相对定位 要设置publicPath绝对路径
                }
            }

        ]
    },
    /*插件安装*/
    plugins: [
        /*以一个html模板进行创建html文件*/
        ...HTMLPlugins,
        /*每次进行打包的时候都把dist文件的内容进行清除*/
        new cleanWebpackPlugin(
            ['dist'], //这里指每次清除dist文件夹的文件 匹配的文件夹
            {
                root: __dirname,//制定插件根目录位置
                //verbose: true, //开启控制台输出
                dry: false//启用删除文件
            }
        ),

        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            // filename: "vendor.js"
            // (Give the chunk a different name)

            minChunks: 2|Infinity, //最低打进公共包的使用次数
            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
        }),
	    //抽取manifest
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
        }),
	    new webpack.HashedModuleIdsPlugin(),//用于固定模块id 防止调整顺序对于id进行重新打包

	    new UglifyJSPlugin({
		    parallel: true
	    }), //开启多线程进行打包
        //复制文件
        new copyWebpackPluigin([
            {
                from: path.resolve(__dirname, './src/commonCss/mui.min.css'),
                to: path.resolve(__dirname, './dist/commonCss'),
                force: true
            }
        ])
    ],

};