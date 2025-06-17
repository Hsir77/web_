// 设置webpack打包的一些规则

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

// path模块 路径拼接
const isProd = process.env.NODE_ENV === 'production' // 是否生产环境


function resolve(dir) {
    return path.resolve(__dirname, '..', dir)
}


module.exports = {
    mode: isProd ? 'production' : 'development', //模式：生产模式还是开发模式
    entry: {
        app: './src/main.ts' //程序主入口目录
    },
    output: {
        path: resolve('dist'), //将打包好的文件放到dist目录里面
        filename: '[name].[contenthash:8].js' //产生的js文件是以app加上8位的哈希值.js来命名的
    },
    module: {
        rules: [	//rules主要是通过ts-loader这个包针对于ts文件，针对src目录里面的ts和tsx文件进行编译处理操作
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: [resolve('src')]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ //会将dist目录中以前打包的js文件进行清楚
        }),

        new HtmlWebpackPlugin({ //针对于./public/index.html进行打包的
            template: './public/index.html'
        })
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js'] //针对于'.ts', '.tsx', '.js'这三种文件进行处理引入文件可以不写他的扩展名
    },


    devServer: {
        host: 'localhost', // 主机名
        port: 8081, //端口
        open: true //自定打开浏览器
    },

}