import Vue from "vue"

const component = {
  template: `
    <div :style='style'>
      <slot></slot>
    </div>
  `,
  render(createElement){
    return createElement(
      'div',
      {
        style: this.style,
        on: {
          click: () => { this.$emit("click") }
        }
      },
      this.$slots.default
    )
  },
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
  data: {
    val: "123"
  },
  methods: {
    handleClick(){
      console.log("clicked")
    }
  },
  render(h){
    return h(
      'comp',
      {
        ref: 'comp',
        on: {
          'click': this.handleClick
        }
      },
      [
        h(
          'span',
          {
            ref: 'span',

          },
          this.val
        )
      ]
    )
  }
})
