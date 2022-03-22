<template>
  <div class="app-container">
      <!-- 添加一个预览界面 -->
      <div class="preview" v-if="idshowpreview" >
        <p>这里是预览界面</p>
          <el-button type="danger" plain @click="controlpreview">危险按钮</el-button>
      </div>
      <div class="filter-container">
        <!-- 上面的根据标题进行收索搜索框 -->
        <!-- 当回车按键弹起的时候触发handleFilter方法，native阻止input默认事情--> 
        <el-input v-model="listQuery.intro" placeholder="根据简介搜索" style="width: 200px;margin-right:20px" class="filter-item" @keyup.enter.native="handleFilter" />
        
        <!-- 搜索按钮 -->
        <!--饿了么的button 组件   v-waves使用水波纹特效 type设置样式  icon设置图标 @click触发方法 -->
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" >
          搜索
        </el-button>

        <!-- 添加按钮 -->
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="totickeditedit">
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

      <el-table-column label="抢购结束日期" prop="time" width="150px" align="center" sortable="custom">
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
       
      
      <el-table-column label="原价格" prop="price" :sortable="'custom'" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="限时价格" prop="limitprice" :sortable="'custom'" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.limitprice}}</span>
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

       <!-- 数量栏 -->
      <el-table-column label="剩余数量" class-name="status-col" width="100">
        <template slot-scope="{row}">
            {{ row.amount }}
        </template>
      </el-table-column>


        <!-- 这里是我们的操作栏 -->
      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="controlpreview" >
              预览
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
 
  </div>
  
</template>

<script>
 // 从api中引入与后台交互的请求方法
import { fetchList} from '@/api/travel'
    // 引入水波纹
import waves from '@/directive/waves' // waves directive
    // 格式化时间
import { parseTime } from '@/utils'
   // 分页组件
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: 'TicketAdmin',
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
      //ElemenUI的切换菜单首先显示的
      activeName: 'basedata',

      //ElementUI的上传图片的URL列表
      picFileList: [
        {name: 'demo.gif',
         url: 'https://my.wulvxinchen.cn/pictures/things/hutaoloading.gif'
         },
      ],
      tableKey: 0,
      // 创建一个变量控制预览页面的显示
      idshowpreview:false,
      // 获取过来的数据
      // 先让页面显示这些静态的数据
      list: [
       {  
          id:1,
          intro:"12",
          price: '13',
          limitprice: '14',
          timestamp:"2022-3-20 12:00:00",
          amount:0,
          status:"可购买",
          schedu:"行程的详情介绍可通过点击简介进行观看",
          // 下面的图片是从网上搜索的图片，获取后端数据后，直接替换就行
          imglist:[
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
          ],
          exactintro:[
              {intro:"大岭山风景好",isshow:true},
              {intro:"大岭山风景秒",isshow:true},
              {intro:"大岭山风景呱呱叫",isshow:true},
              {intro:"大岭山风景棒",isshow:true},
          ],
          exactorder:[         
              {order:"记得看车",isshow:true},
              {order:"记得买票",isshow:true},
              {order:"记得看人",isshow:true},
              {order:"记得带伞",isshow:true},
          ],       
          exactcost:[
              {cost:"门票费用",isshow:true},
              {cost:"游玩项目费用",isshow:true},
              {cost:"吃饭费用",isshow:true},
              {cost:"其他费用",isshow:true},
              ],                   
      },
      {
        id:2,
        intro:"15",
          price: '16',
          limitprice: '17',
          timestamp:"2022-3-20 12:00:00",
          // 列表那边需要有的数据
          type:["默认套餐"],
          amount:0,
          status:"可购买",
          schedu:"行程的详情介绍可通过点击简介进行观看",
          // 下面的图片是从网上搜索的图片，获取后端数据后，直接替换就行
          imglist:[
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
              {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
          ],
          exactintro:[
              {intro:"大岭山风景好",isshow:true},
              {intro:"大岭山风景秒",isshow:true},
              {intro:"大岭山风景呱呱叫",isshow:true},
              {intro:"大岭山风景棒",isshow:true},
          ],
          exactorder:[         
              {order:"记得看车",isshow:true},
              {order:"记得买票",isshow:true},
              {order:"记得看人",isshow:true},
              {order:"记得带伞",isshow:true},
          ],       
          exactcost:[
              {cost:"门票费用",isshow:true},
              {cost:"游玩项目费用",isshow:true},
              {cost:"吃饭费用",isshow:true},
              {cost:"其他费用",isshow:true},
              ],      
      },
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
        // 控制后端发送过来的数据的升降
        sort: '+id'
      },
      // 这部分数据是控制列表中的升降序
      // label组件的显示名，每个选项的key
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      // 修改页面中的选择状态框
      statusOptions: ['售罄','可购买'],

      // 控制导出按钮的loing?
      downloadLoading: false,
    }
  },
  // 钩子函数，当界面创建的时候调用.getList() 获取列表数据
  created() {
    // this.getList()
  },
  mounted() {
     // 为$bus添加一个回调函数用于触发createData(temp)
    this.$bus.$on("busCreateData",this.createData);
     // 为$bus添加一个回调函数用于触发 updateData(temp)
     this.$bus.$on("busupData",this.updateData);
  },
       // 在切换路由的时候解绑避免重复触发
   beforeDestroy() {
      this.$bus.$off("busCreateData");
  },
  methods: {
      // 创建一个点击登陆按钮跳转到增加页面的回调函数
      totickeditedit(){
          this.$router.push({
             path:"/productadmin/tableedit",
             query:{
                methstatus:"createdata"
             }
          });
      },
      // 创建一个变量控制预览页面能否显示
      controlpreview(){
           this.idshowpreview=! this.idshowpreview;
      },
     // 接口不知到为什么错了先不使用mock中的数据
     //解决了接口的问题，创建js文件后需要在index中注册文件
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
      if (prop === 'limitprice') {
        this.sortByLimitPrice(order)
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
            this.list = this.list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() );
        }
        //按照升序排序
        else{
            this.list = this.list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() );
        }
    },
    sortByLimitPrice(order){
         //按照降序排序
        if(order == "descending"){
            this.list = this.list.sort((a, b) => b.limitprice - a.limitprice);
        }
        //按照升序排序
        else{
            this.list = this.list.sort((a, b) => a.limitprice - b.limitprice);
        }

    },

/*
  // 重置temp缓存数据 在每次点击新增和修改时调用，避免数据出错
    resetTemp() {
      this.temp = {
        id: undefined,
        intro:"",
        price: '',
        type:[],
        timestamp: new Date(),
        schedu: '',
        status: '可购买'
      }
    },
  */
   
   
/*
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
*/

    //出现添加页面后，创建数据方法
    createData(temp) {
       // 饿了么form表单前端校验的固定写法，当点击确定新增数据时，再校验一遍数据是否符合rules
       //this.$refs['dataForm'].validate((valid) => {if (valid) {}})
            // 到后端请求新增数据
          //createArticle(this.temp).then(() => {})
            const tempData = Object.assign({}, temp)
            //设置基础数据
           tempData.id = parseInt(Math.random() * 100) + 1024 // mock a id
            // 增加list中的数据
            this.list.push(tempData)
            console.log(tempData);
            // 将dialog对话框隐藏
            this.dialogFormVisible = false,
            // 强制渲染函数
            this.$forceUpdate();
             // 这里添加成功后弹出一个消息窗口
            this.$notify({
              title: '成功',
              message: '成功添加数据',
              type: 'success',
              duration: 2000
            })
    },

/*
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
*/
//validate：
// 重写handleUpdate方法：
// 跳转路由后将我们的数据带过去，方便进行修改
handleUpdate(row){
      // 将table中的row数据深拷贝到temp 中
      const temp = Object.assign({}, row) // copy obj
      temp.timestamp = +new Date(temp.timestamp)
      // 在跳转路由的同时将这行数据通过query传递过去
      this.$router.push({
           path:"/productadmin/tableedit",
           query:{
              list:temp,
              methstatus:"updata"
           }
      });
},

//对整个表单进行校验的方法，参数为一个回调函数。
//该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
//若不传入回调函数，则会返回一个 promise
    // 修改页面中确认按钮绑定的回调函数
    updateData(temp) {
      //this.$refs['dataForm'].validate((valid) => {if (valid) {}})
        const tempData = Object.assign({}, temp)
         // updateArticle(tempData).then(() => { })
        //  这句代码是用来转换时间格式的，没有会出错
        tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        const index = this.list.findIndex(v => v.id === tempData.id)
        this.list.splice(index, 1, tempData)
        this.$notify({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 2000
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

<style>
   .app-container .preview{
     position:absolute;
     background-color: white;
     z-index: 2;
     height: 100%;
     width: 100%;
   }
</style>