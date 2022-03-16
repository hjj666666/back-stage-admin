<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 上面的根据标题进行收索搜索框 -->
      <!-- 当回车按键弹起的时候触发handleFilter方法，native阻止input默认事情--> 
      <el-input v-model="listQuery.intro" placeholder="根据简介搜索" style="width: 200px;margin-right:20px" class="filter-item" @keyup.enter.native="handleFilter" />
       
      <!-- 类型选择框 -->
      <el-select v-model="listQuery.type" placeholder="类型限制" clearable class="filter-item" style="width: 130px;margin-right:20px">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item" :value="item.key" />
      </el-select>

      <!-- 搜索按钮 -->
      <!--饿了么的button 组件   v-waves使用水波纹特效 type设置样式  icon设置图标 @click触发方法 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-right:650px" @click="handleFilter" >
        搜索
      </el-button>

      <!-- 添加按钮 -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        增加
      </el-button>

      <!-- 导出按钮 -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

<!-- 这里就是下面的列表模块 -->
<!--以上都是搜索框的内容  -->
<!-- 下面是列表展示  -->
<!-- v-loading 过渡效果 listLoading
             data 遍历的数组
             border 是否带有纵向边框
             fit 列的宽度是否自撑开
             @sort-change 当表格的排序条件发生变化的时候会触发该事件
 -->
<!-- 表格data显示的数据 -->
<!-- sortChange是下面的列表升降序箭头 -->
    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

 <!-- 表单的列组件  label  显示的标题  prop  对应列内容的字段名  sortable 对应列是否可以排序  align 对齐方式 -->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="日期" prop="time" width="150px" align="center" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

<!-- 这里绑定了一个修改数据的回调函数，和edit的是一样 -->
      <el-table-column label="简介" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.intro}}</span>
        </template>
      </el-table-column>
       
      <el-table-column label="类型" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格" prop="price" :sortable="'custom'" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>

       <!-- 状态栏 -->
      <el-table-column label="套餐状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <!-- type控制按钮的颜色样式 -->
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>


        <!-- 这里是我们的操作栏 -->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- 已经完善 -->
          <el-button v-if="row.status!='售罄'" size="mini" type="success" @click="handleModifyStatus(row,'售罄')">
            售罄
          </el-button>
          <el-button v-if="row.status!='可购买'" size="mini" @click="handleModifyStatus(row,'可购买')">
           可购买
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

<!-- 这里是下面的分页器 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

<!-- 下面分别是编辑页面，以及添加页面，这里应该是定位的形式出现 -->
<!-- 饿了么的对话框组件  这里用于展示 新增修改界面  
       :title="textMap[dialogStatus]"  标题为下面声明的textMap数组中的dialogStatus key 的值
       :visible.sync="dialogFormVisible"   是否显示 Dialog 传入true展示 flase隐藏 这里界面初始化时为false 点击新增和修改时修改为true
 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
<!-- 这部分是添加的表单 -->
<!-- 饿了么的表单组件  
    ref  给表单起个别名dataForm 下面可以用this.$ref.dataForm获取表单dom
    rules设置表单数据校验规则为rules，rules在下面vue中声明  label-position标题对齐方式
-->
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="简介">
            <el-input v-model="temp.intro" placeholder="请输入简介"></el-input>
        </el-form-item>

        <el-form-item label="日期" >
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择一个日期" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择一个状态">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择类型">
            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
         
          <el-form-item label="价格">
            <el-input v-model="temp.price" placeholder="请输入价格"></el-input>
        </el-form-item>

        <el-form-item label="行程介绍">
          <el-input v-model="temp.schedu" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
       <!--@click="dialogStatus==='create'?createData():updateData()"  如果 vue的变量dialogStatus为create就执行新增方法，
       否则执行修改 -->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
 // 从api中引入与后台交互的请求方法
import { fetchList, createArticle, updateArticle } from '@/api/travel'
    // 引入水波纹
import waves from '@/directive/waves' // waves directive
    // 格式化时间
import { parseTime } from '@/utils'
   // 分页组件
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


const typeOptions=["美食","约游","玩好","乐享","纯味"]

export default {
  name: 'TableCk',
     // 引用的组件
  components: { Pagination },
     // 自定义组件引入水波纹特效
  directives: { waves },

  filters: {
      //状态转换器，控制状态tag显示的颜色
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
    // 定义基础数据
  data() {
    return {
      tableKey: 0,
      // 获取过来的数据
      // 先让页面显示这些静态的数据
      list: [
        {
        id:1,
        timestamp:2019-10-1,
        intro:111,
        price:999,
        status:"可购买",
        // 添加一个类型选型方便进行搜索
        // 乐品，美食，纯味，玩好，约游
        type:"美食",
        schedu:"行程的详情介绍可通过点击简介进行观看"
      },
      {
        id:2,
        timestamp:2020-10-2,
        intro:'111',
        price:99,
        status:"可购买",
        type:"约游"
      }
      ],
      // 目前中list中数据的条数
      total: 2,
      // 这个时我们发送fetchList需要携带的参数
      listQuery: {
        // 请求的是第几页的数据
        page: 1,
        // 请求数据的多少
        limit: 20,
        intro: "",
        // 添加一个类型限定条件
        type:"约游",
        // 控制后端发送过来的数据的升降
        sort: '+id'
      },
      // 这部分数据是控制列表中的升降序
      // label组件的显示名，每个选项的key
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      // 修改页面中的选择状态框
      statusOptions: ['售罄','可购买'],
       // 新增与修改界面使用的缓存数据
      temp: {
        id: undefined,
        intro:"",
        price: '',
        timestamp: "",
        schedu: '',
        type:'',
        status: '可购买'
      },
      // 对话框展示控制属性
      dialogFormVisible: false,
       // 对话框标题数组
      //  update，create是 dialogStatus的值，  :title="textMap[dialogStatus]"控制dialog显示添加还是编辑
      textMap: {
        update: '编辑',
        create: '添加'
      },
      // 控制修改页面能否显示
      dialogPvVisible: false,
      // 通过这个状态点击确认时执行修改方法还是编辑方法
      dialogStatus: '',
      pvData: [],
      // 控制导出按钮的loing?
      downloadLoading: false,
      typeOptions
    }
  },
  // 钩子函数，当界面创建的时候调用.getList() 获取列表数据
  created() {
    // 接口出了问题先不用
    // this.getList()
  },
  methods: {
     // 接口不知到为什么错了先不使用mock中的数据
     // 获取列表数据
    getList() {
        // 将table设置 载入效果
      // this.listLoading = true
           //从后台请求数据
      fetchList(this.listQuery).then(response => {
           // 将获取到的数据替换data中的数据
        this.list = response.data.items
        // 下面这个是每次请求的数量也就是我们的每一页的参数
        this.total = response.data.total

        // Just to simulate the time of the request
        // 模拟请求的延迟，正式开发去掉
        setTimeout(() => {
          // 取消tabel的载入效果，展示数据
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

     
    //  这个是搜索函数
    //  搜索框绑定了这个函数，但是getList()，搞好接口好应该可以使用
    // 搜索这里是直接对接后端的所以我这里不好修改
    // 它是通过获取限制条件下取得的数据然后直接重新渲染列表
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },


// 处理我们的状态
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },

// 这个是升降箭头的回调函数
// 下面两个函数展示都用不了因为后端没搭建好
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
      if (prop === 'price') {
        this.sortByPrice(order)
      }
      if (prop === 'time') {
        this.sortByTime(order)
      }
    },
    sortByID(order) {
      /*
      这是项目自带的通过后端接口，重新抓取数据实现
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
      */
       //按照降序排序
        if(order == "descending"){
            this.list = this.list.sort((a, b) => b.id - a.id);
        }
        //按照升序排序
        else{
            this.list = this.list.sort((a, b) => a.id - b.id);
        }
    },

// 直接在前端实现排序，不使用后端
    sortByPrice(order){
         //按照降序排序
        if(order == "descending"){
            this.list = this.list.sort((a, b) => b.price - a.price);
        }
        //按照升序排序
        else{
            this.list = this.list.sort((a, b) => a.price - b.price);
        }

    },
    sortByTime(order){
        //按照降序排序
        if(order == "descending"){
          // 这里需要将时间转化为时间撮
            this.list = this.list.sort((a, b) => new Date(b.timestamp)*1 - new Date(a.timestamp)*1);
        }
        //按照升序排序
        else{
            this.list = this.list.sort((a, b) => new Date(a.timestamp*1) - new Date(b.timestamp*1));
        }
    },


  // 重置temp缓存数据 在每次点击新增和修改时调用，避免数据出错
    resetTemp() {
      this.temp = {
        id: undefined,
        intro:"",
        price: '',
        timestamp: new Date(),
        schedu: '',
        status: '可购买'
      }
    },

       
    // 点击新增按钮触发的方法  展示新增界面
    handleCreate() {
      //清空temp数据
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
        // 当下一次vue的dom元素更新时执行
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

       //出现添加页面后，创建数据方法
    createData() {
       // 饿了么form表单前端校验的固定写法，当点击确定新增数据时，再校验一遍数据是否符合rules
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
             //设置基础数据
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            // 到后端请求新增数据
          //createArticle(this.temp).then(() => {})
            // 删除list中的数据
            this.list.unshift(this.temp)
            // 将dialog对话框隐藏
            this.dialogFormVisible = false
             // 这里添加成功后弹出一个消息窗口
            this.$notify({
              title: '成功',
              message: '成功添加数据',
              type: 'success',
              duration: 2000
            })
        }
      })
    },

      // 点击修改执行的方法  显示修改界面
    handleUpdate(row) {
         // 将table中的row数据深拷贝到temp 中
        //  将那一行要修改的数据先放到，修改框中
      this.temp = Object.assign({}, row) // copy obj
         //设置dialog基础数据
        //  随机生成一个时间后面，可以用后端提供的数据替换
      this.temp.timestamp = new Date(this.temp.timestamp)
      // 将页面显示为修改页面
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
       // 当下一次vue的dom元素更新时执行
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

//validate：

//对整个表单进行校验的方法，参数为一个回调函数。
//该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
//若不传入回调函数，则会返回一个 promise
    // 修改页面中确认按钮绑定的回调函数
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
         // updateArticle(tempData).then(() => { })
          const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
        }
      })
    },
    // 这个是删除按钮的回调函数
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },

    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },

    // 导出按钮的回调函数
    // 先不管我知道里面的信息做了
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    //   this.listQuery.sort = '+id'
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      // 返回升序和降序order
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
