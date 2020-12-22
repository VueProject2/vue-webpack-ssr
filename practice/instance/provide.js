import Vue from "vue"

const ChildComponent = {
  template: `<div>{{data.value}}</div>`,
  inject: ['yeye', 'data'],
  mounted(){
    console.log(this.yeye)
  }
}

const component = {
  components: {
  	childC: ChildComponent,
  },
  template: `
    <div :style='style'>
      <slot value="456"></slot>
			<childC></childC>
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
  }
}
new Vue({
  el: "#root",
  components: {
    Comp: component,
  },
  provide(){
    const data = {}

    Object.defineProperty(data,'value', {
      get: () => this.val,
      enumerable: true//设置为true，让value可以被读取
    })

    return{
      yeye: this,
      // value: this.val
      data
    }
  },
  data: {
    val: "我是爷爷"
  },
  template: `
    <div>
      <comp></comp>
      <input type="text" v-model="val" />
    </div>
  `,
})
