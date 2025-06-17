(function () {
	window.Item = {
		template: `
          <tr>
              <td>{{emp.id}}</td>
              <td>{{emp.name}}</td>
              <td>{{emp.salary}}</td>
              <td><a href="#" @click="delete12(emp)" :delete12="delete12">删除</a></td>
          </tr>
      `,
		props: {
			emp: {
				type: Object,
				required: true,
			},
			delete12: {
				type: Function,
				required: true,
			},
		},
	};
})();
