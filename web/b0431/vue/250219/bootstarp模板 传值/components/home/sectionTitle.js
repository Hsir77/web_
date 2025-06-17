(function () {
	window.sectionTitle = {
		template: `
					<div class="table-responsive">
							<table class="table table-striped">
									<thead>
											<tr>
													<th>ID</th>
													<th>姓名</th>
													<th>工资</th>
													<th>操作</th>
											</tr>
									</thead>
									<tbody>
											<item v-for="(emp,index) in empList" :key="emp.id" :emp="emp" :delete12="delete12"></item>
									</tbody>
							</table>
					</div>
			`,
		components: {
			Item,
		},
		props: {
			empList: {
				type: Array,
				required: true,
			},
			delete12: {
				type: Function,
				required: true,
			},
		},
	};
})();
