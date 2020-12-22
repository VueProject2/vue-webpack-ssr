import Vue from "vue"

const component = {
  model:{
    prop: "val",
    event: "change"
  },
  props:{
    val: String
  },
  template: `
    <div>
      <input type="text" @input="handleInput" :value="val"/>
    </div>
  `,
  data(){
    return {
      text: 123
    }
  },
  methods: {
  	handleInput(e){
    	this.$emit("change",e.target.value)
    }
  }
}
new Vue({
  el: "#root",
  components: {
    Comp: component,
  },
  data: {
    val: '123'
  },
  template: `
    <div>
      <p>{{val}}</p>
      <comp v-model="val"></comp>
    </div>
  `
})
