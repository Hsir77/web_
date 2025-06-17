<template>
  <div class="home">
    <router-link to="/event">event深入</router-link>&nbsp;&nbsp;
    <router-link to="/model">v-model深入</router-link>&nbsp;&nbsp;
    <router-link to="/sync">属性修饰符sync</router-link>&nbsp;&nbsp;
    <router-link to="/attrs-listeners">$attrs与$listeners</router-link>&nbsp;&nbsp;
    <router-link to="/children-parent">$children与$parent</router-link>&nbsp;&nbsp;
    <router-link to="/scope-slot">作用域插槽scope-slot</router-link>&nbsp;&nbsp;
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: "Home",
  components: {
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.home {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
