(function () {
	window.appItem = {
		template: `
     <tr>
        
       <td>{{item.id}}</td>
         <td>{{item.title}}</td>
          <td>{{item.body}}</td>
          <td> <a href="javascript:;" @click="deleteItem1(item.id)">删除</a></td>
         
                </tr>

    `,
		props: ['item', 'index', 'deleteItem'],
		methods: {
			deleteItem1(index) {
				this.deleteItem(index);
			},
		},
	};
})();
