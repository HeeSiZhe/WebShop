<template>
  <div>
    <typeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName">{{searchParams.categoryName}}<i @click="removeCateName">×</i></li>
            <li class="with-x" v-if="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword">×</i></li>
            <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(':')[1]}}<i @click="removeTrademark">×</i></li>
            <li class="with-x" v-for="(p,index) in searchParams.props" :key="index">{{ p.split(':')[1] }}<i @click="removeAttr(index)">×</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active:isOne}" @click="changeOrder(1)">
                  <a>综合<span v-show="isOne" class="iconfont" :class="{'icon-up':isAsc,'icon-down':isDesc}"></span></a>
                </li>
                <li :class="{active:isTwo}" @click="changeOrder(2)">
                  <a>价格<span v-show="isTwo" class="iconfont" :class="{'icon-up':isAsc,'icon-down':isDesc}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <!-- 产品列表-->
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`"
                      ><img v-lazy="good.defaultImg"
                    /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器-->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5" @pageInfo="pageInfo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters,mapState } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      //带给服务器参数
      searchParams: {
        //一级分类的ID
        category1Id: "",
        //二级分类的ID
        category2Id: "",
        //三级分类的ID
        category3Id: "",
        //分类名字
        categoryName: "",
        //关键字
        keyword: "",
        //排序
        order: "1:desc",
        //分页器：代表当前第几页
        pageNo: 1,
        //代表每一页展示数据个数
        pageSize: 10,
        //平台售卖属性操作带的参数
        props: [],
        //品牌
        trademark: "",
      },
    };
  },
  components: {
    SearchSelector,
  },
  beforeMount() {
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  mounted() {
    //在发送请求之前带给服务器参数【searchParams参数发生变化便可将参数带给服务器】
    this.getData();
  },
  methods: {
    //向服务器发请求
    getData() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    //删除分类名字面包屑
    removeCateName(){
      //用undefined置空数据(此参数可有可无)，数据便不会再向服务器发送，优化性能
      this.searchParams.categoryName = undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      //点'x'时只清空query参数，保留params参数,同时$route改变,watch中向服务器发送请求
      this.$router.push({name:'search',params:this.$route.params})
    },
    //删除关键字面包屑
    removeKeyword(){
      this.searchParams.keyword = undefined
      this.$bus.$emit('clear')
      //点'x'时只清空params参数，保留query参数,同时$route改变,watch中向服务器发送请求
      this.$router.push({name:'search',query:this.$route.query})
    },
    //自定义事件回调
    trademarkInfo(mark){
      this.searchParams.trademark = `${mark.tmId}:${mark.tmName}`
      this.getData()
    },
    //删除品牌面包屑
    removeTrademark(){
      this.searchParams.trademark = undefined
      this.getData()
    },
    //收集平台属性自定义事件回调
    attrInfo(attr,Value){
      let Info = `${attr.attrId}:${Value}:${attr.attrName}`
      if(this.searchParams.props.indexOf(Info) === -1)this.searchParams.props.push(Info)
      this.getData()
    },
    //删除售卖属性面包屑
    removeAttr(index){
      this.searchParams.props.splice(index,1)
      //再次发送请求
      this.getData()
    },
    //升降序操作
    changeOrder(flag){
      //flag形参是为了判断点击的是'综合'还是'价格'，综合是1 价格是2
      //这里是起始的状态
      let originflag = this.searchParams.order.split(":")[0]
      let originsort = this.searchParams.order.split(":")[1]
      //准备一个新的order值
      let neworder=''
      //判断
      if(flag == originflag){
        neworder = `${originflag}:${originsort == 'desc' ? 'asc' :'desc'}`
      }else{
        neworder = `${flag}:${"desc"}`
      }
      //合并order
      this.searchParams.order = neworder
      //发送请求
      this.getData()
    },
    //自定义事件页码的回调
    pageInfo(pageNo){
      this.searchParams.pageNo = pageNo
      this.getData()
    }
  },
  computed: {
    ...mapGetters(["goodsList"]),
    isOne(){
      return this.searchParams.order.indexOf('1') != -1
    },
    isTwo(){
      return this.searchParams.order.indexOf('2') != -1
    },
    isAsc(){
      return this.searchParams.order.indexOf('asc') != -1
    },
    isDesc(){
      return this.searchParams.order.indexOf('desc') != -1
    },
    ...mapState({total:state => state.search.searchlist.total})
  },
  watch: {
    //监听路由信息，若发生变化再发一次请求
    $route(newVlue, oldValue) {
      //每次发请求之前先把商品searchParams里的id置空，让它接收新的id
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      //发起请求之前需要将参数合并，新的参数才会发送至服务器
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getData();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>