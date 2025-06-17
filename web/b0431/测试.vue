<template>
  <div>
    <button @click="updateNestedValue">更新嵌套值</button>
    <p>内部值: {{ nestedObject.innerValue }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nestedObject: {
        innerValue: '初始值'
      }
    };
  },
  watch: {
    nestedObject: {
      // 深度监听 nestedObject 对象内部属性的变化
      deep: true,
      // 侦听开始时立即触发一次回调函数
      immediate: true,
      // 回调函数，当 nestedObject 或其内部属性发生变化时执行
      handler(newValue, oldValue) {
        console.log('对象发生变化:', newValue, oldValue);
      }
    }
  },
  methods: {
    // 用于更新嵌套对象的值
    updateNestedValue() {
      this.nestedObject.innerValue = '新值';
    }
  }
};
</script>    