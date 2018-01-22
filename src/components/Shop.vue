<template>
  <div class="shop">
    <div class="main">
      <cube-slide ref="slide" >
        <cube-slide-item v-for="(item, index) in topAd.data" :key="index" >
          <a :href="item.url">
            <img :src="item.image">
          </a>
        </cube-slide-item>
      </cube-slide>
      <p class="shop-name">{{shopName}}</p>
      <div v-if="category.length > 0" class="commodity-service">
        <ul class="right">
          <p>{{category[categoryActive].name}}</p>
          <li v-for="(item ,index) in category[categoryActive].shops" :key="index">
            <img :src="item.image">
            <p class="name">{{item.name}}</p>
            <p class="price">{{`￥${item.price}/${item.unit}`}}</p>
            <div class="quantity">
              <a v-show="item.num" class="subtract" @click="subtract(item)">-</a>
              <input v-show="item.num" class="num" :value="item.num"/>
              <a class="add" @click="add(item)">+</a>
            </div>
          </li>
        </ul>
        <ul class="left">
          <a class="left-btn" :class="categoryActive === index ? 'active':''" v-for="(item ,index) in category" :key="index" @click="changeCategory(item,index)">{{item.name}}</a>
        </ul>
      </div>
      <div class="shopping-cart">
        <a class="icon" :class="shoppingCar.num ? 'fill' :''" >
          <img src="../assets/icon-car-fill.png">
          <span v-show="shoppingCar.num" class="num">{{shoppingCar.num}}</span>
        </a>
        <div class="all-price">
          <p>{{shoppingCar.text}}</p>
        </div>
        <cube-button :class="shoppingCar.num ? 'fill' :''" >{{shoppingCar.num ? '去结算' : '未购物'}}</cube-button>
      </div>
    </div>
    <!-- 开屏广告 -->
    <div v-show="beginAd.show" class="ad-begin">
      <p>点击空白处关闭...({{beginAd.second}}秒后自动关闭)</p>
      <a class="close-ad-bgein" @click="closeBeginAd"></a>
      <a class="begin-ad-img" :href="beginAd.href">
        <img :src="beginAd.src">
      </a>
    </div>
  </div>
</template>

<script>
  import data from './data.js'
  export default {
    name: 'shop',
    data () {
      return {
        checked: true,
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
        shopName:'远宇诚快捷酒店',
        categoryActive: 0,
        category: [],
        shoppingCar:{
          text : '您还没有选择商品',
          num : 0,
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
        this.setShoppingCarData(item);
      },
      add(item){
        item.num ++;
        this.setShoppingCarData(item);
      },
      setShoppingCarData(shop){
        let num = 0;
        let price = 0;
        this.category.forEach((item,index) => {
          item.shops.forEach((item)=>{
            num += item.num;
            price += item.num * item.price;
          })
        })
 
        this.shoppingCar.num = num;
        this.shoppingCar.text = `共  ${num}件商品   ￥${price}`;
      }
    },
    mounted(){
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

      console.log(data);
      
      // console.log(this.axios)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
  $main-color:#3290e8;
  .shop{
    width: 100%;
    height: 100%;

    .main{
      width: 100%;
      height: 100%;
      overflow: hidden;

      .shop-name{
        padding: .25rem;
        color: #fff;
        font-size: .35rem;
        background-color: $main-color;
      }

      .commodity-service{
        width: 100%;
        // height: 100%;
        height: calc(100% - 1.45rem - .85rem);
        background-color: #fff;

        .left{
          position: absolute;
          top: 0;
          left: 0;
          width: 1.5rem;
          height: 100%;
          background-color: #efefef;
          overflow: auto;

          .left-btn{
            display: block;
            line-height: 1.8;
            font-size: .25rem;
            padding: .1rem;
            margin: .05rem 0;
          }

          .active{
            background-color: #fff;
            &::before{
              content: "";
              position: absolute;
              width: 6px;
              height: 100%;
              top: 0;
              left: 0;
              background-color: $main-color;
            }
          }
        }

        .right{

          height: 100%;
          padding-left: 1.55rem;
          overflow: auto;
          -webkit-overflow-scrolling: touch;

          & > p{
            padding: .2rem .2rem;
            font-size: .25rem;
            background-color: #efefef;
            color: #747474;
          }
          & > li{
            height: 1.5rem;
            margin: .2rem 0;
            // padding-top: 1px;
            padding: .1rem;
            // background-color: #e2e2e2;
            border-bottom: 1px solid #e2e2e2;

            img{
              position: absolute;
              width: 1.3rem;
              height: 1.3rem;
              top: .1rem;
              left: .1rem;
            }

            .name{
              position: relative;
              margin-left: 1.55rem;
              margin-top: .2rem;
              font-size: .3rem;
            }

            .price{
              position: relative;
              margin-left: 1.55rem;
              margin-top: .3rem;
              font-size: .26rem;
              color: #f3832f;
            }

            .quantity{
              position: absolute;
              width: 1.8rem;
              height: .4rem;
              top: .8rem;
              right: .2rem;
              // background-color: #e2e2e2;

              a{
                display: block;
                position: absolute;
                top: 0;
                width: .4rem;
                height: .4rem;
                border-radius: 50%;
                background-color: #eb7878;
                color: #fff;
                text-align: center;
                font-size: .4rem;
                line-height: .35rem;
              }

              input{
                position: absolute;
                top: 0;
                width: .7rem;
                left: .55rem;
                height: .4rem;
                font-size: .3rem;
                text-align: center;
                border: 1px solid #9b9b9b;
              }

              .subtract{
                left: 0;
              }

              .add{
                right: 0;
              }
            }
          }
          
        }
      }

      .shopping-cart{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: .8rem;
        background-color: #3f4249;

        .icon{
          display: block;
          position: absolute;
          width: .9rem;
          height: .9rem;
          top: -.3rem;
          left: .3rem;
          border-radius: 50%;
          background-color: #747474;

          &.fill{
            background-color: $main-color;
          }

          img{
            position: absolute;
            width: 70%;
            height: 70%;
            left: 15%;
            top: 15%;
          }

          .num{
            position: absolute;
            width: .4rem;
            height: .4rem;
            top: -.1rem;
            right: -.1rem;
            background-color: rgb(250, 73, 73);
            color: #fff;
            font-size: .3rem;
            border-radius: 50%;
            text-align: center;
            line-height: .4rem;
          }
        }

        .all-price{
          position: absolute;
          left: 1.5rem;
          line-height: .6rem;
          font-size: .3rem;
          color: #fff;
        }
      }

      .cube-btn{
        position: absolute;
        width: 1.5rem;
        height: .8rem;
        top: 0;
        right: 0;
        background-color: #a1a1a1;
        color: #fff;
        font-size: .3rem;

        &.fill{
          background-color: #33b348;
        }
      }
    }

    .ad-begin{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .7);

      p{
        position: absolute;
        top:.2rem;
        right:.2rem;
        color:#fff;
        font-size:.25rem;
      }

      .close-ad-bgein{
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .begin-ad-img{
        display: block;
        position: absolute;
        width: 6rem;
        height: 9rem;
        margin: auto;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        img{
          width: 6rem;
          height: 9rem;
        }
      }

      
    }
  }

  .cube-slide-dots{
    line-height: 1px;
  }
  
</style>
