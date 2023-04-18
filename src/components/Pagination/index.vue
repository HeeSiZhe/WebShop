<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="$emit('pageInfo', pageNo - 1)">
      上一页
    </button>
    <button
      v-if="startNumandendNum.start > 1"
      @click="$emit('pageInfo', 1)"
    >
      1
    </button>
    <button v-if="startNumandendNum.start > 2">···</button>

    <button
      v-for="(page, index) in startNumandendNum.end"
      :key="index"
      v-if="page >= startNumandendNum.start"
      @click="$emit('pageInfo', page)"
      :class="{active:pageNo==page}"
    >
      {{ page }}
    </button>

    <button v-if="startNumandendNum.end < totalPage - 1">···</button>
    <button
      v-if="startNumandendNum.end < totalPage"
      @click="$emit('pageInfo', totalPage)"
    >
      {{ totalPage }}
    </button>
    <button @click="$emit('pageInfo', pageNo + 1)" :disabled="pageNo==totalPage">下一页</button>
    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>
  
  <script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    startNumandendNum() {
      const { pageNo, totalPage, continues } = this;
      let start = 0;
      let end = 0;
      //当总面数小于连续页码会出现不正常情况，这时不考虑continues了
      if (continues > totalPage) {
        start = 1;
        end = totalPage;
      } else {
        start = pageNo - Math.floor(continues / 2);
        end = pageNo + Math.floor(continues / 2);
        //虽然总页面数大于连续页码了，但是这时pageNo会出现两种不正常情况
        if (start < 1) {
          start = 1;
          end = continues;
        }
        if (end > totalPage) {
          end = totalPage;
          start = end - continues + 1;
        }
      }
      return { start, end };
    },
  },
};
</script>
  
  <style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
  