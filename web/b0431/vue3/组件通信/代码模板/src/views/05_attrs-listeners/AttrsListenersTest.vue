<template>
	<div>
		<h1>useAttrs</h1>
		<el-button round type="success" :icon="Edit" title="这是一个按钮">success</el-button>
		<HintButton type="success" :icon="Edit" title="这是一个按钮"></HintButton>
	</div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue';
import HintButton from './HintButton.vue';
</script>

<style scoped></style>
