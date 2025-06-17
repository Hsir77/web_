(function () {
	window.App = {
		template: `
      <div>
        <!--头部导航区域-->
        <app-nav-bar></app-nav-bar>
        <!--核心区域:分左右两边-->
        <div class="container-fluid">
          <div class="row">
            <!--左边菜单栏区域 appLeft-->
            <app-left></app-left>
            <!-- 右边主页面区域：分上下两个区域 AppHome -->
            <app-home>

            <h1 class="page-header" slot="dashboard">{{title}}</h1>
            </app-home>
          </div>
        </div>
      </div>
    `,
		components: {
			appNavBar,
			appLeft,
			appHome,
		},
		data() {
			return {
				title: '仪表盘',
			};
		},
	};
})();
