<template>
	<div>
		<h2>自定义带Hover提示的按钮</h2>
		<el-button type="primary" icon="el-icon-edit" size="mini" :title="msg">主要按钮</el-button>
		<HitButton
			type="primary"
			icon="el-icon-edit"
			size="mini"
			:title="msg"
			@xxx="handle1"
			@xxxx="handle2"
		></HitButton>
	</div>
</template>

<script type="text/ecmascript-6">

import HitButton from "../HitButton"
export default {
  name: 'AttrsListenersTest',
  components:{
    HitButton
  },
  data(){
    return{
      msg:"6666666"
    }
  },

  methods: {
    handle1(){
      console.log(11111);
    },
    handle2(){
      console.log(22222);
    }

  },
}
</script>
