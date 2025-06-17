const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	//mode 用来判断当前的环境是开发环境 还是生产环境
	// 开发环境 打包后的文件不是压缩版 development
	// 生产环境 打包后的文件是压缩版 production
	//none 打包后的文件不是压缩版
	mode: 'none',
	// 配置项 webpack 并没有规定使用绝对路径
	entry: path.join(__dirname, './src/main.js'), // 对那个文件进行打包
	// 配置出口文件路径 这个配置 必须是一个对象的形式存在 文件名称 文件放在的位置
	output: {
		// 存放文件的路径地址 webpack 规定了 必须使用绝对路径
		path: path.join(__dirname, './dist/'),
		filename: 'build.js', // 打包文件名称
	},
	module: {
		rules: [
			{
				// 匹配文件资源
				test: /\.css$/,
				use: [
					// 使用什么插件进行匹配css文件
					'style-loader', //让JS识别css语法
					'css-loader', // css转换为JS
				],
			},
			{
				// 匹配文件资源
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				use: [
					// 使用什么插件进行匹配css文件
					'file-loader', //让JS识别css语法
				],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					// 使用什么插件进行匹配css文件
					loader: 'babel-loader', //让JS识别css语法
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
		}),
	],

	devServer: {
		static: './dist',
	},
};

// 使用 webpack 进行打包
