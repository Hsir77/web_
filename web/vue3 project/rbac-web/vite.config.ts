// loadEnv可以加载不同环境中的常量
//@ts-ignore
import { defineConfig, ConfigEnv, UserConfigExport, loadEnv } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import { viteMockServe } from 'vite-plugin-mock';

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
	// 调用loadEnv方法返回当前环境的对象
	// 参数1：当前模式（默认是开发环境），参数2：当前环境的变量文件在哪里,process.cwd()可以返回index.html所在的位置（也就是项目的根目录）
	let env = loadEnv(mode, process.cwd());
	return {
		plugins: [
			vue(),
			// createSvgIconsPlugin({
			//   // 在使用svg的时候将图标存放到src/assets/icons文件夹中
			//   iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
			//   symbolId: 'icon-[dir]-[name]',
			// }),
			viteMockServe({
				localEnabled: command === 'serve',
			}),
		],
		resolve: {
			alias: {
				'@': path.resolve('./src'),
			},
		},
		// 代理服务器
		server: {
			//首先修改了request中的基本请求为/dev-api
			//在这段代码中拦截所有/dev-api为首的请求转发到/3000端口
			// 移除路径中的 /dev-api
			proxy: {
				[env.VITE_APP_BASE_API]: {
					target: env.VITE_APP_SERVICE_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/dev-api/, ''),
				},
			},
		},
	};
};
