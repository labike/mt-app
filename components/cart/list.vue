<template>
  <el-table
    :data="cartData"
    style="width: 980px">
    <el-table-column
      label="项目"
      prop="name"
      width="532">
    </el-table-column>
    <el-table-column
      label="单价"
      prop="price"
      width="132">
    </el-table-column>
    <el-table-column
      label="数量"
      prop="count"
      width="212">
      <template slot-scope="scope">
        <el-input-number 
          v-model="scope.row.count" 
          :min="1" 
        ></el-input-number>
      </template>
    </el-table-column>
    <el-table-column label="总价">
      <template slot-scope="scope">
        <div class="">
          {{scope.row.price * scope.row.count}}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      cartData: {
        type: Array,
        default(){
          return []
        }
      }
    }
  }
</script>

<style lang="scss">

</style>