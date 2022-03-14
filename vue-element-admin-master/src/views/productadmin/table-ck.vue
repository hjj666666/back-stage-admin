<template>
<!-- 尽量不要改动本页面，这个组件用来参考 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- 上面的根据标题进行收索搜索框 -->
      <!-- 当回车按键弹起的时候触发handleFilter方法，native阻止input默认事情--> -->
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

       <!-- 星级选择框 -->
        <!--饿了么的select 组件 v-model  双向绑定 当listQuery.importance的值等于 el-option的key值时默认选中 -->
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>

       <!-- 类型选择框 -->
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>

      <!-- 根据id进行升降处理 -->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>

      <!-- 搜索按钮 -->
      <!--饿了么的button 组件   v-waves使用水波纹特效 type设置样式  icon设置图标 @click触发方法 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>

      <!-- 添加按钮 -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>

      <!-- 导出按钮 -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>

      <!-- 是否显示审稿人 -->
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
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
    <el-table
      :key="tableKey"
      v-loading="listLoading"
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

      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>

        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>

        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>

        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
 <!--@click="dialogStatus==='create'?createData():updateData()"  如果 vue的变量dialogStatus为create就执行新增方法，
       否则执行修改 -->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

<!-- 这一部分是修改已经存在的表单 -->
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 // 从api中引入与后台交互的请求方法
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
    // 引入水波纹
import waves from '@/directive/waves' // waves directive
    // 格式化时间
import { parseTime } from '@/utils'
   // 分页组件
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

 // calendarTypeOptions  选择框中的下拉数组
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'TableCk',
     // 引用的组件
  components: { Pagination },
     // 自定义组件引入水波纹特效
  directives: { waves },
  filters: {
         //状态转换器
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
    // 定义基础数据
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      // 指的是我们切换数据时页面的空白效果
      listLoading: true,
      // 这个时我们发送fetchList需要携带的参数
      listQuery: {
        // 请求的是第几页的数据
        page: 1,
        // 请求数据的多少
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
       // 新增与修改界面使用的缓存数据
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      // 对话框展示控制属性
      dialogFormVisible: false,
      dialogStatus: '',
       // 对话框标题数组
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
        // 新增修改界面前端校验规则
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  // 钩子函数，当界面创建的时候调用.getList() 获取列表数据
  created() {
    this.getList()
  },
  methods: {
     // 获取列表数据
    getList() {
        // 将table设置 载入效果
      this.listLoading = true
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
       // 重置temp缓存数据 在每次点击新增和修改时调用，避免数据出错
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },


    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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

       // 创建数据方法
    createData() {
       // 饿了么form表单前端校验的固定写法，当点击确定新增数据时，再校验一遍数据是否符合rules
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
             //设置基础数据
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
            // 到后端请求新增数据
          createArticle(this.temp).then(() => {
            // 删除list中的数据
            this.list.unshift(this.temp)
            // 将dialog对话框隐藏
            this.dialogFormVisible = false
             // 将dialog对话框隐藏
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
      // 点击修改执行的方法  显示修改界面
    handleUpdate(row) {
         // 将table中的row数据深拷贝到temp 中
      this.temp = Object.assign({}, row) // copy obj
         //设置dialog基础数据
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
       // 当下一次vue的dom元素更新时执行
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
