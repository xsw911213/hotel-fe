<template>
  <div class="order">
    <div class="bg">
      <p class="title">确认订单</p>
      <p class="room">房间号:  <span>{{room}}</span></p>
      <ul class="list">
        <p class="shopping-list">购物单: <span>{{shoppingCar.text}}</span></p>
        <li v-for="(item,index) in shoppingCar.details" :key="index">
          <span class="name">{{item.name}}</span>
          <span class="num">x{{item.num}}</span>
          <span class="price">￥{{item.price}}</span>
        </li>
        <p class="all-price">总计： ￥{{price}}</p>
      </ul>
      <div class="remarks">
        <textarea placeholder="备注"></textarea>

        <cube-button @click="submit">确认下单</cube-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order',
  data () {
    return {
      shoppingCar: {},
      room: 0,
      price: 0,
      successContent:''
    }
  },
  methods:{
    submit(){
      this.$createDialog({
        type: 'alert',
        // icon: 'cubeic-alert',
        showClose: true,
        title: '提交成功',
        content:this.successContent,
        onClose: () => {
          this.$createToast({
            type: 'warn',
            time: 1000,
            txt: '点击关闭按钮'
          }).show()
        }
      }).show()

    }
  },
  mounted(){
    this.shoppingCar = JSON.parse(sessionStorage.getItem('shoppingCar'));
    this.room = this.$route.query.room;
    this.successContent = `您的订单我们已经收到，费用将在您退房时一并结算。 如有任何疑问，请拨打前台电话<a  href="tel:${this.$route.query.tel}">${this.$route.query.tel}（点击即可拨打）</a>进行询问`


    this.shoppingCar.details.forEach((item,index) => {
      this.price += item.num * item.price;
    })
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
   @import "./order.scss";
</style>
