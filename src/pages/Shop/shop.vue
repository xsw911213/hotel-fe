<template>
  <div class="shop">
    <div v-show="errorRoom" class="error-room">
      <p>该房间二维码已经失效</p>
    </div>
    <div v-show="!errorRoom" class="main">
      <!-- 滚动广告 -->
      <cube-slide ref="slide" >
        <cube-slide-item v-for="(item, index) in topAd.data" :key="index" >
          <a :href="item.url">
            <img :src="item.image">
          </a>
        </cube-slide-item>
      </cube-slide>
      <!--end 滚动广告 -->
      <p class="shop-name">{{shopName}} <a class="tel" :href="`tel:${tel}`"><img src="../../assets/tel.png" alt=""></a></p>
      <!-- 菜单 -->
      <div v-if="category.length > 0" class="commodity-service">
        <!-- 右边栏 -->
        <ul class="right">
          <p>{{category[categoryActive].categoryName}}</p>
          <li v-for="(item ,index) in category[categoryActive].details" :key="index">
            <div class="img">
              <img :src="item.img">
              <span>图片仅供参考</span>
            </div>
            <p class="name">{{item.name}}</p>
            <p class="price">{{`￥${item.price}/${item.unit}`}}</p>
            <div v-if="distribution" class="quantity">
              <div v-if="item.putaway">
                <a v-show="item.num" class="subtract" @click="subtract(item)">-</a>
                <input v-show="item.num" class="num" :value="item.num" readonly/>
                <a class="add" @click="add(item)">+</a>
              </div>
              <div v-else>
                <p class="putaway">该商品已经下架</p>
              </div>
            </div>
          </li>
        </ul>
        <!--end 右边栏 -->
        <!-- 左边栏 -->
        <ul class="left">
          <a class="left-btn" :class="categoryActive === index ? 'active':''" v-for="(item ,index) in category" :key="index" @click="changeCategory(item,index)">{{item.categoryName}}</a>
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
            // src: '//oz4rno8dv.bkt.clouddn.com/e459954134a6feeca39788f78be13506ecda7227.png',
            src: '//oz4rno8dv.bkt.clouddn.com/6896a8696b8038f4fc8989ab005e4fccc3b90047.jpg'
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
        errorRoom: true,
        // 酒店是否支持配送
        distribution: true,
        // 房间信息
        roominfo: {},
        // 酒店名称
        shopName:'',
        tel:'',
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
          item.details.forEach((item)=>{
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
          item.details.forEach((item)=>{
            item.num = 0;
          })
        })
        sessionStorage.removeItem('shoppingCar');
      },
      submit(){
        if(this.shoppingCar.num){
          let jsonStr = JSON.stringify(this.shoppingCar);
          sessionStorage.setItem("shoppingCar", jsonStr);
          this.$route.query.tel = this.tel;
          let roominfostr = sessionStorage.getItem('roominfo') || JSON.stringify(this.$route.query);
          sessionStorage.setItem("roominfo", roominfostr);
          this.$router.push({ name: 'order', query:this.roominfo});
        }
      }
    },
    mounted(){
      this.roominfo = JSON.parse(sessionStorage.getItem('roominfo')) || this.$route.query;
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

     
      console.log(this.host.baseUrl)
        
      // 
      _this.axios({
        method: 'get',
        url: '/baseinfosetting',
        params: {userid: _this.$route.query.userid},
        baseURL: _this.host.baseUrl
        //baseURL:'http://10.168.34.43:3008/api'
      }).then((res)=>{
        console.log(res)
        let data = res.data.data;
        // console.log(data);
        _this.category = data.commodityList;

        //判断房间是否存在
        let room = _this.$route.query.room;
        console.log(room,data.roomList)
        for(let item of data.roomList){
          if(item === room){
            _this.errorRoom = false;
            break
          }
        }

        _this.category.forEach((item,index) => {
          item.details.forEach((item)=>{
            item.num = 0;
          })
        })
        _this.shopName = data.pageInfo.name;
        _this.tel = data.pageInfo.tel;
        _this.distribution = data.pageInfo.delivery;
        sessionStorage.setItem("marked", data.pageInfo.marked);
        sessionStorage.setItem("printer", JSON.stringify(data.printers));
      })

      // console.log(data);
      
      // console.log(this.axios)
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
  @import "./shop.scss";
</style>
