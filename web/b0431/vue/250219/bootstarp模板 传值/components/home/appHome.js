(function () {
	window.appHome = {
		template: `
					<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
							<!--右边上半区域
							<h1 class="page-header">Dashboard</h1>-->
							<slot name="dashboard"></slot>
							<dashboard :hobbies="hobbies" @delete_hobby="deleteHobbies"></dashboard>
							<!--右边下半区域-->
							<h2 class="sub-header">Section title</h2>
							<section-title :emp-list="empList" :delete12="delete12"></section-title>
					</div>
			`,
		components: {
			Dashboard,
			sectionTitle,
		},
		data() {
			return {
				hobbies: ['1', '2', '3', '4'],
				empList: [
					{ id: 1, name: '小明', salary: '10000' },
					{ id: 2, name: '小红', salary: '12000' },
					{ id: 3, name: '小李', salary: '11000' },
					{ id: 4, name: '小王', salary: '13000' },
					{ id: 5, name: '小张', salary: '14000' },
					{ id: 6, name: '小赵', salary: '15000' },
				],
			};
		},
		methods: {
			delete12(emp) {
				this.empList.splice(emp.id - 1, 1);
				this.empList.forEach((element, index) => {
					element.id = index + 1;
				});
			},
			deleteHobbies(index) {
				this.hobbies.splice(index, 1);
				PubSub.publish('changenum', 1);
			},
		},
	};
})();
