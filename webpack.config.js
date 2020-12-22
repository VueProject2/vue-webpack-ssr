const path = require("path");
//vue-loader版本是v15的话，加一个plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//html插件
const HTMLPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
//分离css的插件
const CssExtractPlugin = require("mini-css-extract-plugin");

//判断环境，值为true时是开发环境
//这里process.env.NODE_ENV对应的是package.json中"scripts"里"build"、"dev"里配置的环境变量
const isDev = process.env.NODE_ENV === "development"

const config = {
    mode: process.env.NODE_ENV || "production",
    //指定项目的运行环境是web平台
    target: "web",
    //entry设置入口文件
    //__dirname是当前文件webpack.config.js所在地址，也就是根目录
    //path.join()方法，将两个路径拼接起来，形成一个绝对路径
    entry: path.join(__dirname, "client/index.js"),
    //output设置出口
    output: {
        filename: "bundle.[hash:8].js", //设置文件名，这里不能使用chunkhash，否则会报错
        path: path.join(__dirname, "dist") //设置文件路径
    },
    plugins: [
        new VueLoaderPlugin(),
        new HTMLPlugin(),
        //这个作用是在项目其他地方获取环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        })
    ],
    module: {
        //rules配置规则
        rules: [{
                //test检测文件类型
                //test值是一个正则，下边这个正则就是匹配所有.vue文件
                test: /.vue$/,
                //loader让webpack能够去处理那些非JavaScript文件
                loader: "vue-loader"
            },
            {
                test: /\.jsx$/,
                loader: "babel-loader"
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [{
                    //url-loader可以把图片转换成base64代码
                    loader: 'url-loader',
                    options: {
                        limit: 1024, //当文件大小小于1024时，就会将图片转换成base64代码
                        name: '[name]-123.[ext]', //配置名称，[name]是原文件名，[ext]是后缀
                    }
                }]
            }
        ]
    }
}

if (isDev) { //开发环境
    config.mode = 'development';
    //开发环境下，处理less文件
    config.module.rules.push({
        test: /\.less$/,
        //当前需要处理.less文件，首先是less-loader将文件处理成css代码，css-loader将待变
        use: [
            "style-loader",
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    //less-loader和portcss-loader都会生成sourceMap，
                    //这里的作用是使用之前的loader生成的sourceMap，提高编译速度
                    sourceMap: true
                }
            },
            "less-loader"
        ]
    })
    config.devtool = "#cheap-module-eval-source-map"
    config.devServer = {
        port: 8000, //端口
        //host设置成0.0.0.0之后，项目就可以通过ip地址访问，比如本机ip，或者127.0.0.1
        host: '0.0.0.0',
        // open: true,
        inline: true,
        overlay: {
            errors: true, //将编译错误显示在网页上
        },
        hot: true, //作用是：更改内容的时候，不会将页面更新，而是只更新当前组件
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin()
    )
} else { //生产环境
    config.mode = 'production';
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        // vendor: ['vue'],
    }
    config.output.filename = '[name].[chunkhash:8].js';
    //生产环境下分离css
    config.module.rules.push({
        test: /\.less$/,
        use: [{
                loader: CssExtractPlugin.loader,
                /* options: {
                    publicPath: '../'
                } */
            },
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    //less-loader和portcss-loader都会生成sourceMap，
                    //这里的作用是使用之前的loader生成的sourceMap，提高编译速度
                    sourceMap: true
                }
            },
            "less-loader"
        ]
    })
    config.plugins.push(
        new CssExtractPlugin({
            filename: 'styles.[contenthash:8].css',
        })
    );

    //这里配置比较复杂，还没搞清楚
    config.optimization = {
        splitChunks: {
            chunks: 'all',
            /* cacheGroups: { // 这里开始设置缓存的 chunks
                commons: {
                    chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    minSize: 0, // 最小尺寸，默认0,
                    minChunks: 2, // 最小 chunk ，默认1
                    maxInitialRequests: 5 // 最大初始化请求书，默认1
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/, // 正则规则验证，如果符合就提取 chunk
                    chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    priority: 10, // 缓存组优先级
                    enforce: true
                }
            } */
        },
        runtimeChunk: true
    }
}

module.exports = config