<template>
	<div>
		<h2>效果一: 显示TODO列表时, 已完成的TODO为绿色</h2>

		<hr />
		<h2>效果二: 显示TODO列表时, 带序号, TODO的颜色为蓝绿搭配</h2>
		<List :todos="todos">
			<template v-slot="{ index, item }">
				<p :style="{ color: index % 2 ? 'green' : 'blue' }">序号:{{ index }}{{ item.text }}</p>
			</template>
		</List>
	</div>
</template>

<script type="text/ecmascript-6">
//子组件
import List from './List'
export default {
  name: 'ScopeSlotTest',
  data () {
    return {
      todos: [
        {id: 1, text: 'AAA', isComplete: false},
        {id: 2, text: 'BBB', isComplete: true},
        {id: 3, text: 'CCC', isComplete: false},
        {id: 4, text: 'DDD', isComplete: false},
      ]
    }
  },

  components: {
    List
  }
}
</script>
