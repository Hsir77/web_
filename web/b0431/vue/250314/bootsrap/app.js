(function () {
	const template = `
      <div id="app">
          <!--头部导航区域-->
          <app-nav-bar></app-nav-bar>
          <!--核心区域:分左右两边-->
          <div class="container-fluid">
              <div class="row">
                  <app-left></app-left>
                  <keep-alive>
                  <router-view></router-view>
                     </keep-alive>
                 <!-- <app-home></app-home> -->
                  <!--右边主页面区域：分上下两个区域-->
              </div>
          </div>
      </div>
  `;

	window.App = {
		template,
		components: {
			appLeft,
			appHome,
			appNavBar,
		},
	};
})();
