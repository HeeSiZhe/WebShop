<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="cartInfo in cartInfoList"
          :key="cartInfo.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cartInfo.isChecked == 1"
              @change="changeCheckCart(cartInfo, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl" />
            <div class="item-msg">{{ cartInfo.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cartInfo.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('deCrement', -1, cartInfo)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cartInfo.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cartInfo)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('inCrement', 1, cartInfo)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cartInfo.skuNum * cartInfo.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartList(cartInfo)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isCheckedAll&&cartInfoList.length>0"
          @click="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none" @click="deleteCartChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade" class="sum-btn">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  methods: {
    getData() {
      this.$store.dispatch("getCartList");
    },
    //商品数量加减和修改(加上节流，不会让商品数为0和负数)
    handler: throttle(async function (type, disNum, cartInfo) {
      switch (type) {
        case "inCrement":
          //点击 + 时传给服务器的变化量为1
          disNum = 1;
          break;
        case "deCrement":
          //点击 - 时先判断购买量是否大于1，如果大于就传给服务器的变化量为-1，如果购买量小于等于1，那么变化量就得为0
          disNum = cartInfo.skuNum > 1 ? -1 : 0;
          break;
        //注意 change传进来的disNum是用户输入的购买量，而传给服务器的disNum是数据的变化量
        case "change":
          if (isNaN(disNum) || disNum < 1) {
            //如果用户输入的是非法数据或者输入一个负数，传给服务器的变化量应该为0
            disNum = 0;
          } else {
            //如果用户的输入合法 则传给服务器的变化的量等于 用户输入的量（自动取整）减去初始购买量
            disNum = parseInt(disNum) - cartInfo.skuNum;
          }
      }
      try {
        //代表修改成功
        await this.$store.dispatch("AddOrUpdateShopCart", {
          skuId: cartInfo.skuId,
          skuNum: disNum,
        });
        //再一次获取服务器数据用于展示
        this.getData();
      } catch (error) {
        //代表修改失败
      }
    }, 1000),
    //删除购物车里的商品
    async deleteCartList(cartInfo) {
      try {
        await this.$store.dispatch("deleteCartList", cartInfo.skuId);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //改变商品勾选状态
    async changeCheckCart(cartInfo, event) {
      try {
        let isChecked = event.target.checked ? 1 : 0;
        //派发actions，要传入商品的id和是否被选中两个参数给服务器，服务器进行修改商品的isChecked属性
        await this.$store.dispatch("changeCheckCart", {
          skuId: cartInfo.skuId,
          isChecked,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //删除所有被选中的商品
    async deleteCartChecked() {
      try {
        await this.$store.dispatch("deleteCartChecked");
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //全选按钮
    async updateAllCartChecked(event) {
      let isChecked = event.target.checked ? 1 : 0;
      try {
        await this.$store.dispatch("updateAllCartChecked", isChecked);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(["cartList"]),
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    //计算总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach((item) => {
        sum += item.skuNum * item.skuPrice;
      });
      return sum;
    },
    //全选
    isCheckedAll() {
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>