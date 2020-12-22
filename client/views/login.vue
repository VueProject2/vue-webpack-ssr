<template>
  <div>
    登录{{ count }}
  </div>
</template>
<script>
import { mapState,mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState(['count'])
  },
  mounted(){
    let i = 0;
    setInterval(() => {
      this.updateCount(i++)
    }, 1000);
  },
  methods: {
    ...mapMutations(['updateCount'])
  }
}
</script>
