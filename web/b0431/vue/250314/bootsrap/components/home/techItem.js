(function () {
	const template = `
      <!-- 详情 -->
      <div class="jumbotron">
          <h2>{{id}}----{{item.title}}</h2>
          <p>{{item.content}}</p>
      </div>
  `;

	window.techItem = {
		template,
		props: ['TechArr'],
		data() {
			return {
				id: 1,
				item: { id: 1, title: '5G时代...', content: '5G时代的到来，让人工智能飞起来...' },
			};
		},
		watch: {
			$route() {
				this.id = this.$route.params.id;
				this.item = this.TechArr.find((item) => {
					return item.id == this.id;
				});
			},
		},
	};
})();
