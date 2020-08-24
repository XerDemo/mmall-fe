/*
 * @Author: XerDemo
 * @Date:   2020-08-22 22:17:02
 * @Last Modified by:   XerDemo
 * @Last Modified time: 2020-08-24 20:16:50
 */
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置  dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';


// 获取html-webpack-plugin 参数
var getHtmlConfig = function(name) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        inject: true,
        hash: true,
        chunks: ['common', name]
    }
}
var config = {
    entry: {
    	// 将plugins中name置为"common"  将common.js合并到base.js中
    	// "webpack-dev-save/client?http://localhost:8088/"使执行webpack-dev-save浏览器最上面的黑条消失 

    	// "common": ["./src/page/common/index.js","webpack-dev-save/client?http://localhost:8088/"], 

    	// 优化1 
    	// 因为在线上环境不需要 "webpack-dev-save/client?http://localhost:8088/"  使用环境变量配置 
    	// 当WEBPACK_ENV = "dev"即开发环境，将"webpack-dev-save/client?http://localhost:8088/"加入common 如果是online线上环境则不加

    	// 优化2
    	// $ WEBPACK_ENV=dev webpack-dev-server --inline --port 8088  启动命令太长 利用npm自定义命令 修改package.json中的scrip 

        "common": ["./src/page/common/index.js"], 
        "index": ["./src/page/index/index.js"],
        "login": ["./src/page/login/index.js"]
    },
    output: {
        path: './dist', // 存放文件的地址
        publicPath: '/dist', // 浏览器访问的地址 
        filename: 'js/[name].js'
    },
    externals: {
        "jquery": "windows.jquery"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' }
        ]
    },
    plugins: [
        // 独立通用模块到js/bash.js
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "js/base.js"
        }),
        // 打css文件单独打包到文件
        new ExtractTextPlugin("css/[name].css"),
        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig("index")),
        new HtmlWebpackPlugin(getHtmlConfig("login")),
    ]
}

if(WEBPACK_ENV === "dev") {
	config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;