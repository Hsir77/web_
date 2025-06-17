// 立即执行函数表达式（IIFE）
(function () {
	// 定义模板字符串，包含了一个带有特定样式类的div，以及一个dashboard组件和list标签
	const template = `
			<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
					<!-- 注释说明：click在正常标签中是单击事件，在组件中是自定义事件 -->
					<app-home-top :hobbies="hobbies" title='爱好123' @xxx="deleteItem">
					<h4 slot="name1">插槽</h4>
					<h4 slot="name2">插槽2</h4>
					
					</app-home-top>
					
					<!--右边下半区域-->
					<app-home-bottom :ArrList="ArrList" :deleteItem="deleteItem1"></app-home-bottom>
			</div>
	`;

	// 定义appHome对象，并挂载到window全局对象上
	window.appHome = {
		template,
		// data函数返回组件的初始数据，这里包含一个hobbies数组
		data() {
			return {
				hobbies: ['抽烟', '喝酒', '烫头', '睡觉'],
				ArrList: [],
			};
		},
		// 声明组件所依赖的子组件
		components: {
			appHomeTop,
			appHomeBottom,
		},
		created() {
			const http = 'https://jsonplaceholder.typicode.com/posts';
			axios
				.get(http)
				.then((res) => {
					this.ArrList = res.data;
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 定义组件的方法
		methods: {
			// deleteItem方法用于从hobbies数组中删除指定索引的元素
			deleteItem(index) {
				// console.log('父组件的方法', index);
				this.hobbies.splice(index, 1);
			},
			deleteItem1(index) {
				this.ArrList = this.ArrList.filter((item) => {
					return item.id != index;
				});
			},
		},
	};
})();
