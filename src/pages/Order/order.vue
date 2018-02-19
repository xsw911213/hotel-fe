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
        <textarea v-model="remark" placeholder="备注"></textarea>

        <cube-button v-show="btnShow" @click="submit">确认下单</cube-button>

        <p v-show="!btnShow" class="finish">下单完成</p>
      </div>
    </div>
    <div v-show="loading" class="loading">
      <cube-loading :size="40"></cube-loading>
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
      loading: false,
      btnShow: true,
      remark:'',
      successContent:''
    }
  },
  methods:{
    submit(){
      let _this = this;
      let list = [];
      this.shoppingCar.details.forEach((item,index)=>{
        let obj = {};
        obj.name = item.name;
        obj.price = item.price;
        obj.num = item.num;
        list.push(obj);
      })
      let now = new Date();
      let postData = {
        userid:_this.$route.query.userid,
        room: _this.room,
        orderNum: `${now.getFullYear()}${now.getMonth() < 9 ?`0${now.getMonth() + 1}` : now.getMonth() + 1}${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}${now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()}${now.getMinutes() < 10 ?`0${now.getMinutes()}`:now.getMinutes()}${now.getSeconds() < 10 ?`0${now.getSeconds()}`:now.getSeconds()}`,
        orderContent:{
          list: list,
          remark: _this.remark,
          totalPrice:_this.price
        },
        printers: JSON.parse(sessionStorage.getItem('printer'))
      }
      this.loading = true;
      this.axios({
        method: 'post',
        baseURL: _this.host.baseUrl,
        url: '/order',
        data: postData
      }).then((res)=>{
        this.loading = false;
        this.btnShow = false;
        this.$createDialog({
          type: 'alert',
          // icon: 'cubeic-alert',
          showClose: true,
          title: '提交成功',
          content: this.successContent,
          onClose: () => {
            console.log('close')
          }
        }).show()
      })
      

    }
  },
  mounted(){
    this.shoppingCar = JSON.parse(sessionStorage.getItem('shoppingCar'));
    this.room = this.$route.query.room;
    this.successContent = `${sessionStorage.getItem('marked')}如有任何疑问，请拨打前台电话<a href="tel:${this.$route.query.tel}">${this.$route.query.tel}（点击即可拨打）</a>进行询问`


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
