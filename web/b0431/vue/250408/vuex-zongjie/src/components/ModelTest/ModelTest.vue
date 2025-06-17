<template>
	<div>
		<h2>深入v-model</h2>
		<!-- 
      v-model
      就是获取input中的value值，将这个值复制给msg
      在将msg通过v-bind绑定，给msg
      监听一个input，表单内容发生改变，内容就会触发
    -->
		<input type="text" v-model="msg" />
		<span>{{ msg }}</span>
		<h3>v-model父级通信原理</h3>
		<!-- :value
         @input
    -->
		<CustomInput :value="msg" @input="msg = $event"></CustomInput>
		<CustomInput :value="msg" @input="fn"></CustomInput>
		<CustomInput v-model="msg"></CustomInput>
		<!-- v-model等价于第一种 :value="msg" @input="msg = $event" -->
	</div>
</template>

<script type="text/ecmascript-6">
import CustomInput from './CustomInput.vue'
export default {
  name: 'ModelTest',
  data() {
    return {
      msg: ''
    }
  },
  components: {
    CustomInput
  },
  methods: {
    fn(value) {
      // console.log(value);
      this.msg = value;
    }
  }
}
</script>
