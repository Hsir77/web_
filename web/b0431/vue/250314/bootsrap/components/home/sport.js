(function () {
	const template = `
      <!--体育栏目-->
      <div>
     
          <ul>
              <li v-for="item in SportItem" :key="item.id">
                  <router-link :to="'/news/sport/sportItem/' + item.id">{{item.title}}</router-link>
              </li>
          </ul>
          <!--详情-->
          <router-view :SportItem="SportItem"></router-view>
      </div>
  `;

	window.sport = {
		template,
		data() {
			return {
				SportItem: [],
			};
		},
		created() {
			axios
				.get('http://127.0.0.1:5500/web/b0431/vue/250314/bootsrap/db/sport.json')
				.then((res) => {
					this.SportItem = res.data;
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
	};
})();
