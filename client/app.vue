<template>
  <div id="app">
    <div id="cover"></div>
    <Header />
    <!--  -->
    <router-link :to="{ name: 'login' }">login</router-link>
    <router-link to="/todo">todo</router-link>
    <router-link to="/todo/exact">app-exact</router-link>
    <button @click="toTodo">todo</button>
    <router-view></router-view>
    <Footer />
  </div>
</template>
<script>
import Header from "./layout/header.vue";
import Footer from "./layout/footer.jsx";
import Todo from "./views/todo/todo.vue";
export default {
  components: {
    Header,
    Footer,
    Todo,
  },
  mounted() {
    console.log(this.$style);
  },
  data() {
    return {
      text: "hellow",
    };
  },
  methods: {
    toTodo() {
      this.$router.push({ name: "todo", query: { userId: 123 } });
    },
  },
};
</script>
<style lang="less">
#app {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  #cover {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: #999;
    opacity: 0.9;
    z-index: -1;
  }
}
</style>
