<template>
  <section class="real-app">
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下去要做什么"
      @keyup.enter="addTodo"
    />
    <Item
      v-for="todo in filterTodos"
      :key="todo.id"
      :todo="todo"
      @delete="deleteTodo"
    ></Item>
    <Tabs
      :filter="filter"
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    ></Tabs>
  </section>
</template>

<script>
import Item from "./item.vue";
import Tabs from "./tabs.vue";
let id = 0;
export default {
  props: ["id"],
  data() {
    return {
      todos: [
        {
          completed: false,
          content: "我是第一个任务",
        },
        {
          completed: false,
          content: "菊花茶，白水杯",
        },
      ],
      filter: "all",
    };
  },
  components: {
    Item,
    Tabs,
  },
  computed: {
    filterTodos() {
      switch (this.filter) {
        case "all":
          return this.todos;
        case "active":
          return this.todos.filter((todo) => !todo.completed);
        case "completed":
          return this.todos.filter((todo) => todo.completed);
      }

      /* const completed = this.filter === "completed"
            return this.todos.filter(todo => completed === todo.completed) */
    },
  },
  mounted() {
    console.log(this.id);
    console.log(this.$route);
  },
  methods: {
    addTodo(e) {
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        completed: false,
      });
      e.target.value = "";
    },
    deleteTodo(id) {
      let index = this.todos.findIndex(function (i) {
        return i.id === id;
      });

      this.todos.splice(index, 1);
    },
    toggleFilter(state) {
      this.filter = state;
    },
    clearAllCompleted() {
      this.todos = this.todos.filter((todo) => !todo.completed);
    },
  },
};
</script>
<style lang="less">
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
  .add-input {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    line-height: 1.4em;
    border: none;
    border-bottom: 1px solid #f1f1f1;
    outline: none;
    box-sizing: border-box;
    padding: 16px 16px 16px 60px;
  }
}
</style>
