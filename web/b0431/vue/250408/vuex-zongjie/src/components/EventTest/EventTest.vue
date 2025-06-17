<template>
	<div>
		<h1>EventTest组件</h1>
		<button @click="handler">原生Dom事件</button>
		<!-- @click点击后没有任何的反应 
         因为这个click不是原生的Dom事件 而是给子组件传递一个自定义事件 
         在组件中定义的方法名和原生的Dom事件名称重复，也是自定义事件 -->
		<!-- 给子组件传递的自定义事件 不限制个数 -->
		<Event1 @xxx="aaa" @yyy="bbb"></Event1>
		<!-- 配合修饰符将自定义事件变成原生的Dom事件 
         注意点:如果使用修饰符native将自定义事件变成原生的Dom事件 有一个前提 
         自定时间名称必须和原生的Dom事件相同 -->
		<Event2 @click.native="handler3"></Event2>
	</div>
</template>

<script type="text/ecmascript-6">
import Event1 from './Event1.vue'
import Event2 from './Event2.vue'
export default {
  name: 'EventTest',

  components: {
    Event1,
    Event2,
  },

  methods: {
    handler() {
      console.log(1);
    },
    aaa(a) {
      console.log(a, 'Event1组件方法1');
    },
    bbb(a) {
      console.log(a, 'Event1组件方法2');
    },
    handler3() {
      console.log('原生DOM事件');
    }
  }
}
</script>
