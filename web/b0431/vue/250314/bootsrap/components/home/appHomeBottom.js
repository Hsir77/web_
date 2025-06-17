// bootsrap/components/home/appHomeTop.js
(function () {
	window.appHomeBottom = {
		template: `
    <div>

     <h2 class="sub-header">Section title</h2>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                 
                  <th>id</th>
                  <th>title</th>
                  <th>body</th> 
                  <th>删除</th>
               
                </tr>
              </thead>
              <tbody>
               <app-item v-for="(item,index) in ArrList" :key="index" :item="item" :index="index" :deleteItem="deleteItem"></app-item>
                
              </tbody>
            </table>
          </div>
        </div> 
          </div>`,
		props: ['ArrList', 'deleteItem'],
		components: {
			appItem,
		},
	};
})();
