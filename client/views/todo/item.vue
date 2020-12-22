<template>
  <div :class="['todo-item', todo.completed ? 'completed' : '']">
    <input type="checkbox" class="toggle" v-model="todo.completed" />
    <label>{{ todo.content }}</label>
    <button class="destory" @click="deleteTodo"></button>
  </div>
</template>
<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteTodo() {
      this.$emit("delete", this.todo.id);
    },
  },
};
</script>
<style lang="less">
.todo-item {
  position: relative;
  background: #fff;
  font-size: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:hover {
    .destory:after {
      content: "X";
    }
  }

  label {
    white-space: pre-line;
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  &.completed {
    label {
      color: #d9d9d9;
      text-decoration: line-through;
    }
  }
}

.toggle {
  text-align: center;
  width: 32px;
  height: 32px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 10px;
  appearance: none;
  outline: none;
  &:after {
    content: url("../../assets/images/check-no.png");
  }
  &:checked:after {
    content: url("../../assets/images/check.png");
  }
}
.destory {
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 24px;
  color: #cc9a9a;
  transition: color 0.2s ease-out;
  background: transparent;
  appearance: none;
  border: none;
  cursor: pointer;
  outline: none;
}
</style>
