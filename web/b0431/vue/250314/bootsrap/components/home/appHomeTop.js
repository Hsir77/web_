// 立即执行函数表达式（IIFE）
(function () {
	// 定义模板字符串，用于描述Dashboard组件右边上半区域的结构
	const template = `
        <!--右边上半区域-->
<div>
    <h1 class="page-header">{{title}}</h1>
    <slot name="name1"></slot>
    <div class="row placeholders">
    <slot name="name2"></slot>

        <!-- 使用v-for指令循环渲染元素 -->
        <div 
            class="col-xs-6 col-sm-3 placeholder" 
            v-for="(item, index) in hobbies" 
            :key="index"
        >
            <img 
                src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dWAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" 
                width="280" 
                height="280" 
                class="img-responsive" 
                alt="Generic placeholder thumbnail"
            >
            <h4>{{item}}</h4>
            <button @click="deleteHobbies(index)">删除</button>
        </div>
    </div>
</div>
    `;

	// 将Dashboard对象挂载到window全局对象上
	window.appHomeTop = {
		template,
		// 声明组件接收的props属性
		props: ['hobbies', 'title'],
		methods: {
			// deleteHobbies方法用于删除指定索引的hobbies项，并触发父组件的自定义事件
			deleteHobbies(index) {
				// console.log(index);
				this.$emit('xxx', index);
				console.log(this);
				console.log('adsad');
				// this.$emit 用来触发父组件中的自定义事件
				// 语法：参数1，参数2
				// 参数1：父组件中自定义的方法名称
				// 参数2：要给父组件传递的参数
			},
		},
	};
})();
