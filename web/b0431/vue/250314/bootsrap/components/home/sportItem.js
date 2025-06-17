(function () {
	const template = `
      <div class="jumbotron">
          <h2>{{item.id}} -- {{item.title}}</h2>
          <p>{{item.content}}</p>
      </div>
  `;

	window.sportItem = {
		template,
		props: ['SportItem'],
		data() {
			return {
				id: 1,
				item: { id: 1, title: '世界杯开赛啦', content: '世界杯于明晚8点举行开幕式...' },
			};
		},
		// 侦听器 监听器
		watch: {
			// 主要路由地址发生改变就会触发某一个方法 路由地址 关键字 $route 就是用来获取路径地址中携带的参数
			$route() {
				console.log(1);
				// console.log();
				console.log(this.$route.params);
				// this.$route.params 返回是一个对象 可以获取路由地址中携带的参数
				this.id = this.$route.params.id;
				console.log(typeof this.id);
				this.item = this.SportItem.find((item) => {
					return item.id == this.id;
				});
			},
		},
	};
})();
