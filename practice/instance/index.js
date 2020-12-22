import Vue from "vue"

const component = {
  template: `
    <div>
      <p @click="handleChange">{{propOne}}</p>
    </div>
  `,
  props:{
    propOne: String,
    obj: {
      type: Object,
      default: () => {}
    },
    active: {
      // type: Boolean,
      validator(value){
        return typeof value === "boolean"
      }
    }
  },
  data(){
    return {
      text: 123
    }
  },
  methods: {
    handleChange(){
      this.$emit("change")
    }
  }
}

new Vue({
  el: '#root',
  template: `
    <div>
      <comp-one :prop-one="text" @change="handleChange"></comp-one>
    </div>
  `,
  components:{
    CompOne: component
  },
  data: {
    text: "123"
  },
  methods: {
    handleChange(){
      this.text += 1
    }
  }
})
