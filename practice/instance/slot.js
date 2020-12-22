import Vue from "vue"

const component = {
  template: `
    <div :style='style'>
      <slot value="456"></slot>
    </div>
  `,
  data(){
    return {
      style: {
        width: '200px',
        height: '200px',
        border: '1px solid #ccc'
      }
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
    val: 123
  },
  template: `
    <div>
      <comp>
        <span slot-scope="wer">{{ wer.value }}</span>
      </comp>
    </div>
  `
})
