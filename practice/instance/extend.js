import Vue from "vue"

const component = {
  props:{
    active: Boolean,
    propOne: String,
  },
  template: `
    <div>
      <p>{{text}}</p>
    </div>
  `,
  data(){
    return {
      text: 123
    }
  },
  beforeCreate(){
    console.log("c,beforeCreate")
  },
  created(){
    console.log("c,created")
  },
  beforeMount(){
    console.log("c,beforeMount")
  },
  mounted(){
    console.log("c,mounted")
  }
}

// const CompVue = Vue.extend(component);

// new CompVue({
//   el: "#root",
//   //这里注意，没用props
//   propsData: {
//     propOne: "124"
//   },
//   //这里的data和上边的data进行了合并，如果有相同属性，则使用这里的值
//   data: {
//     text: "err"
//   },
//   beforeCreate(){
//     console.log("p,beforeCreate")
//   },
//   created(){
//     console.log("p,created")
//   },
//   beforeMount(){
//     console.log("p,beforeMount")
//   },
//   mounted(){
//     console.log("p,mounted")
//   },
// })

const component2 = {
  extends: component,
  data(){
    return {
      text: "1"
    }
  },
  beforeCreate(){
    console.log("p,beforeCreate")
  },
  created(){
    console.log("p,created")
  },
  beforeMount(){
    console.log("p,beforeMount")
  },
  mounted(){
    console.log("p,mounted")
  },
}

new Vue({
  el: "#root",
  components: {
    Comp: component2,
  },
  template: `
    <comp></comp>
  `
})
