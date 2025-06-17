<template>
	<div>
		小明的爸爸现在有{{ money }}元
		<h2>不使用sync修改符</h2>
		<Child :money="money" @updateMonet="money = $event"></Child>
		<h2>使用sync修改符</h2>
		<!-- 
      :money.sync="money" 相当于:money @updateMoney 的集合
      1、父组件向子组件传递的数据 必须是Data中的数据
      2、必须在子组件中绑定一个自定义事件 实现父子组件数据同步
        这个自定义事件必须是update:xxxx
        xxxx就是sync修饰符前面自定义的名称
    -->
		<!-- <p :aaa="cccc"></p> -->
		<Child2 :money.sync="money"></Child2>
		<hr />
	</div>
</template>

<script type="text/ecmascript-6">
import Child from './Child.vue';
import Child2 from './Child2.vue'
export default {
  name: 'SyncTest',
  data() {
    return {
      money: 1000
    };
  },
  components: {
    Child,
    Child2
  }
}
</script>
