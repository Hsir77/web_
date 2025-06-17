(function () {
	window.appLeft = {
		template: `
    
			<div class="container-fluid">
				<div class="row">
					<!--左边菜单栏区域-->
					<div class="col-sm-3 col-md-2 sidebar">
						<ul class="nav nav-sidebar">
							
						<router-link to="/" tag="li" exact > <a href="">首页</a></router-link>
		    		<router-link to="/news" tag="li"> <a href="">新闻</a></router-link>
						<router-link to="/about" tag="li"> <a href="">关于</a></router-link>
						</ul>
						
					</div>

					<!--右边主页面区域: 分上下两个区域-->
				</div>
			</div>`,
	};
})();
