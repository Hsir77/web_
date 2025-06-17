import Vue from "vue";
import Vuex from "vuex";
import Todos from "./modules/Todos";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { Todos },
});
