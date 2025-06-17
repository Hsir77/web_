<template>
  <div style="background: #ccc; height: 80px;">
    <h2>Event1组件</h2>
    <span>其它内容</span>
    <!-- <p>{{ aaa }}</p> -->
    <button @click="click1">点击方法</button>
    <button @click="$emit('xxx', 456)">传递456</button>
    <button @click="$emit('yyy', 789)">传递789</button>
  </div>
</template>

<script>
export default {
  // props: ['aaa'],
  methods: {
    click1() {
      // 两个参数
      // 第一个参数：调用父组件中的方法名
      // 第二个参数：给父组件传递的数据
      this.$emit('xxx', 123)
    }
  }
}
</script>