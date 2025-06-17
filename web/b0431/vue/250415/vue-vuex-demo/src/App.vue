<template>
  <div class="all">
    <AddTodo></AddTodo>
    <FilterTodo></FilterTodo>
    <Todos></Todos>
  </div>
</template>

<script>
import Todos from "@/components/Todos.vue";
import AddTodo from "@/components/AddTodo.vue";
import FilterTodo from "@/components/FilterTodo.vue";
export default {
  name: "",
  data() {
    return {};
  },
  components: {
    Todos,
    AddTodo,
    FilterTodo,
  },
  methods: {},
};
</script>

<style>
body {
  background-color: #e8f7f0;
}
.all {
  width: 1000px;
  margin: 0 auto;
}
</style>
