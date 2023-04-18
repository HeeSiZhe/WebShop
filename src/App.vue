<template>
  <div>
  <Header/>
  <router-view></router-view>
  <Footer v-show="this.$route.meta.show"/>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name:'APP',
  components:{Header,Footer},
  mounted(){
    //派发action获取商品三级列表的数据，挂载在App根组件的mounted上只用发送一次请求，数据就已经在仓库中了
    this.$store.dispatch('CateList')
  },
}
</script>

<style>

</style>