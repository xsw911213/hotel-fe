<template>
  <div class="order">
    <p>确认订单</p>
    <p>房间号</p>
    <ul>清单</ul>
    <textarea>备注</textarea>
    <button>确认下单</button>
    <div>成功提示：
      您的订单我们已经收到，费用将在您退房时一并结算。
      如有任何疑问，请拨打前台电话010-88886666进行询问
    </div>
  </div>
</template>

<script>
export default {
  name: 'order',
  data () {
    return {
      shoppingCar:{},
    }
  },
  mounted(){
    this.shoppingCar = JSON.parse(sessionStorage.getItem('shoppingCar'));
    console.log(this.shoppingCar)
    console.log(this.$route)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   @import "./order.scss";
</style>
