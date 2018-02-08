<template>
  <div class="shop">
    <div class="main">
      <!-- 滚动广告 -->
      <cube-slide ref="slide" >
        <cube-slide-item v-for="(item, index) in topAd.data" :key="index" >
          <a :href="item.url">
            <img :src="item.image">
          </a>
        </cube-slide-item>
      </cube-slide>
      <!--end 滚动广告 -->
      <p class="shop-name">{{shopName}}</p>
      <!-- 菜单 -->
      <div v-if="category.length > 0" class="commodity-service">
        <!-- 右边栏 -->
        <ul class="right">
          <p>{{category[categoryActive].name}}</p>
          <li v-for="(item ,index) in category[categoryActive].shops" :key="index">
            <img :src="item.image">
            <p class="name">{{item.name}}</p>
            <p class="price">{{`￥${item.price}/${item.unit}`}}</p>
            <div v-if="distribution" class="quantity">
              <a v-show="item.num" class="subtract" @click="subtract(item)">-</a>
              <input v-show="item.num" class="num" :value="item.num" readonly/>
              <a class="add" @click="add(item)">+</a>
            </div>
          </li>
        </ul>
        <!--end 右边栏 -->
        <!-- 左边栏 -->
        <ul class="left">
          <a class="left-btn" :class="categoryActive === index ? 'active':''" v-for="(item ,index) in category" :key="index" @click="changeCategory(item,index)">{{item.name}}</a>
        </ul>
        <!--end 左边栏 -->
      </div>
      <!--end 菜单 -->
      <!-- 购物车详情 -->
      <div v-if="distribution" class="shopping-cart-details" v-show="shoppingCar.shoppingCartDetailsShow">
        <a class="close" @click="showDetail()"></a>
        <ul>
          <div class="first">
            <span>购物车</span>
            <button @click="clearShoppingCar"><i></i>清空购物车</button>
          </div>
          <li class="list" v-for="(item,index) in shoppingCar.details" :key="index">
            <span class="name">{{item.name}}</span>
            <span class="price">￥ {{item.price}}</span>
            <div class="quantity">
              <a v-show="item.num" class="subtract" @click="subtract(item)">-</a>
              <input v-show="item.num" class="num" :value="item.num" readonly/>
              <a class="add" @click="add(item)">+</a>
            </div>
          </li>
        </ul>
      </div>
      <!--end 购物车详情 -->
      <!-- 购物车 -->
      <div v-if="distribution" class="shopping-cart">
        <a class="icon" :class="shoppingCar.num ? 'fill' :''" @click="showDetail()">
          <img src="../../assets/icon-car-fill.png">
          <span v-show="shoppingCar.num" class="num">{{shoppingCar.num}}</span>
        </a>
        <div class="all-price">
          <p>{{shoppingCar.text}}</p>
        </div>
        <cube-button :class="shoppingCar.num ? 'fill' :''" @click="submit()">{{shoppingCar.num ? '去结算' : '未购物'}}</cube-button>
      </div>
      <!--end 购物车 -->
    </div>
    <!-- 开屏广告 -->
    <div v-show="beginAd.show" class="ad-begin">
      <p>{{beginAd.second}}秒后自动关闭</p> 
      <div class="begin-ad-img" >
        <a :href="beginAd.href">
          <img :src="beginAd.src">
        </a>
        <a class="close-ad-bgein" @click.stop="closeBeginAd"></a>
      </div>
      
    </div>
    <!--end 开屏广告 -->
  </div>
</template>

<script>
  import data from '../data.js'
  export default {
    name: 'shop',
    data () {
      return {
        // 开屏广告
        beginAd:{
          show: false,
          second: 5,
          href: '',
          src: '',
          default:{
            href: '#',
            src: '//oz4rno8dv.bkt.clouddn.com/e459954134a6feeca39788f78be13506ecda7227.png'
          }
        },
        // 滚动条广告
        topAd:{
          data:[],
          default:[
            {
              url:'#',
              image:'//oz4rno8dv.bkt.clouddn.com/5239ca09d79de598e0062eb5a21d36110fed2a6f.png'
            },
            {
              url:'#',
              image:'//oz4rno8dv.bkt.clouddn.com/e2ebb1a752059dfdf2bb6ba321cf92c90a39472a.png'
            }
          ]
        },
        // 酒店是否支持配送
        distribution: true,
        // 房间信息
        roominfo: {},
        // 酒店名称
        shopName:'远宇诚快捷酒店',
        categoryActive: 0,
        category: [],
        // 购物车
        shoppingCar:{
          text : '您还没有选择商品',
          num : 0,
          shoppingCartDetailsShow:false,
          details:[]
        }
      }
    },
    methods:{
      closeBeginAd(){
        this.beginAd.show = false;
      },
      changeCategory(item,index){
        this.categoryActive = index;
      },
      subtract(item){
        item.num --;
        this.setShoppingCarData(item,false);
      },
      add(item){
        item.num ++;
        this.setShoppingCarData(item,true);
      },
      setShoppingCarData(shop,isAdd){
        let num = 0;
        let price = 0;
        this.category.forEach((item,index) => {
          item.shops.forEach((item)=>{
            num += item.num;
            price += item.num * item.price;
          })
        })
 
        this.shoppingCar.num = num;
        if(this.shoppingCar.num === 0){
          this.shoppingCar.shoppingCartDetailsShow = false;
        }
        this.shoppingCar.text = `共  ${num}件商品   ￥${price}`;

        if(isAdd){
          let hasSameShop = false;
          let max = this.shoppingCar.details.length;
          // this.shoppingCar.details.forEach((item)=>{
          //   if(item.id === shop.id){
          //     hasSameShop = true;
          //   }
          // })
          for(let item of this.shoppingCar.details){
            if(item.id === shop.id){
              hasSameShop = true;
              break
            }
          }

          if(!hasSameShop){
            this.shoppingCar.details.push(shop);
          }
        }else{
          this.shoppingCar.details.forEach((item,index)=>{
            if(item.num === 0){
              this.shoppingCar.details.splice(index,1);
            }
          })
        }
      },
      showDetail(){
        if(this.shoppingCar.num > 0){
          this.shoppingCar.shoppingCartDetailsShow = !this.shoppingCar.shoppingCartDetailsShow;
        }else{
          this.shoppingCar.shoppingCartDetailsShow = false;
        }
      },
      clearShoppingCar(){
        this.shoppingCar = {
          text : '您还没有选择商品',
          num : 0,
          shoppingCartDetailsShow:false,
          details:[]
        }
        this.category.forEach((item,index) => {
          item.shops.forEach((item)=>{
            item.num = 0;
          })
        })
        sessionStorage.removeItem('shoppingCar');
      },
      submit(){
        if(this.shoppingCar.num){
          let jsonStr = JSON.stringify(this.shoppingCar);
          sessionStorage.setItem("shoppingCar", jsonStr);
          let roominfostr = sessionStorage.getItem('roominfo') || JSON.stringify(this.$route.query);
          sessionStorage.setItem("roominfo", roominfostr);
          this.$router.push({ name: 'order', query:this.roominfo});
        }
      }
    },
    mounted(){
      this.roominfo = JSON.parse(sessionStorage.getItem('roominfo')) || this.$route.query;
      let shoppingCar = JSON.parse(sessionStorage.getItem('shoppingCar'));
      if(shoppingCar){
        this.shoppingCar = shoppingCar;
      }
      let _this = this;
      // console.log(_this.$route)
      _this.beginAd.show = true;
      // 开屏广告 oz4rno8dv.bkt.clouddn.com/e459954134a6feeca39788f78be13506ecda7227.png
      // 滚动条广告1 oz4rno8dv.bkt.clouddn.com/5239ca09d79de598e0062eb5a21d36110fed2a6f.png
      // 滚动条广告2 oz4rno8dv.bkt.clouddn.com/e2ebb1a752059dfdf2bb6ba321cf92c90a39472a.png
      _this.axios({
        method: 'get',
        url: '/getad',
        baseURL:'http://adsys.xushaoweisite.com/api'
        //baseURL:'http://10.168.34.43:3008/api'
      }).then(
        function(res){
          let data = res.data.data;

          if(data.beginAd.length > 0){
            // 如果有开屏广告
            let beginAd = data.beginAd[0]

            _this.beginAd.src = beginAd.adimg;
            _this.beginAd.href = beginAd.link;
          }else if(data.beginAd.length === 0){
            // 如果没有开屏广告,添加默认广告
            _this.beginAd.src = _this.beginAd.default.src;
            _this.beginAd.href = _this.beginAd.default.href;
          }

          if(data.topAd.length > 0){

          }else if(data.topAd.length === 0){
            _this.topAd.data = _this.topAd.default;
            
          }
          _this.$refs.slide.refresh();

          
          const djs = setInterval(()=>{
            _this.beginAd.second -= 1;
            if(_this.beginAd.second === 0){
              _this.beginAd.show = false;
              clearInterval(djs);
            }
          },1000)
        }
      )

      data.forEach((item,index) => {
        item.shops.forEach((item)=>{
          item.num = 0;
        })
      })
        
      _this.category = data;

      // console.log(data);
      
      // console.log(this.axios)
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
  @import "./shop.scss";
</style>
