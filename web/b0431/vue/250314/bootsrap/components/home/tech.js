(function () {
	const template = `
        <!-- 科技栏目 -->
        <div>
            <ul>
                <!-- 不适用router-link进行跳转页面 并且拼接参数 -->
                <!-- 可以使用JS的形式 定义方法 在方法中执行某些操作 -->

                <li v-for="item in TechArr" :key="item.id">
                    <span>{{item.title}}</span>
                    <button class="btn btn-default btn-xs" @click="PushTech(item.id)">查看(Push)</button>&nbsp;
                    <button class="btn btn-default btn-xs" @click="ReplaceTech(item.id)">查看(replace)</button>
                </li>
            </ul>
            <router-view :TechArr="TechArr"></router-view>
        </div>
    `;

	window.tech = {
		template,
		data() {
			return {
				TechArr: [],
			};
		},
		created() {
			this.getTechArr();
		},
		methods: {
			getTechArr() {
				axios
					.get('http://127.0.0.1:5500/web/b0431/vue/250314/bootsrap/db/tech.json')
					.then((res) => {
						this.TechArr = res.data;
					})
					.catch((err) => {
						console.log(err);
					});
			},
			PushTech(id) {
				// console.log(id);
				// vue-router提供跳转路径的方法 $router  $route
				// $route 是vue提供获取路径参数的方法
				// // $router 是vue提供跳转页面的方法
				// this.$router.push('/news/tech/techItem/' + id);

				// this.$router.push('/new/tech/techItem/' + id) 这样直接写会进行报错
				// 在vue-router 3.xxx 以上的版本 会将方法转换为promise异步函数

				// push进行回退的时候 会回退到上一步
				this.$router.push('/news/tech/techItem/' + id).catch((err) => {
					console.log(err);
				});
			},
			ReplaceTech(id) {
				// console.log(id);
				// 使用this.$router.replace 进行回退的时候 会回退到上一个路由地址

				this.$router.replace('/news/tech/techItem/' + id);
			},
		},
	};
})();
