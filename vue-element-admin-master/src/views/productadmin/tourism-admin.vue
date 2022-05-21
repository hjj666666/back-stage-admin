<template>
  <div class="app-container">
     <!-- 增加一个预览界面 -->
     <div class="tourism-preview-div" v-if="showTourismPreview">
          <div class="preview-main">
              <!-- 首先是轮播图部分 -->
              <div class="broadcast">
                   <el-carousel height="250px" indicator-position="none">
                      <el-carousel-item v-for="(item,index) in templist.imglist" :key="index">
                        <img :src="item.url" alt="">
                      </el-carousel-item>
                    </el-carousel>
              </div>

              <!-- 其次标题部分 -->
              <div class="introdiv">
                  <div class="introdivtop">
                      {{templist.title}}
                  </div>
              </div>

              <!-- 限时抢购价格以及倒计时 -->
              <div class="pricedatadiv">
                    <div class="pricediv">
                       <div class="limitprice">{{templist.limitprice}}</div><span>人起</span>
                       <div class="price">{{templist.price}}</div>
                    </div>
              </div>

               <!-- 旅游顾问部分 -->
              <div class="tourismman">
                    <div class="manimg">
                        <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt="">
                    </div>
                    <div class="phone">
                      <span>旅游顾问</span>
                       <span>电话:0769-22106666</span>
                    </div>
                    <div class="twobutton">
                         <div>
                            联系顾问
                         </div>
                          <div>
                            进店逛逛
                         </div>
                    </div>
              </div>

              <!-- 套餐部分 -->
              <div class="setmeal">
                <!-- 可选套餐部分 -->
                <div class="mealmain">
                    <span>选择套餐</span>
                    <div class="meallist">
                          <div>默认套餐</div>
                    </div>
                </div>

                <!-- 出发日期 -->
                <div class="starttime">
                    <span>出发日期 以下均为起价</span>
                    <div class="meallist">
                         <div v-for="(item,index) in templist.priceCalendar" :key="index">
                             <span>{{item.date}} 周日</span>
                             <span>{{item.price}}</span>
                         </div>
                    </div>
                </div>
              </div>

              <!-- 产品亮点的样式 -->
              <div class="advantage">
                    <span>产品亮点</span>
                    <div class="advantagelist">
                         <div v-for="(item,index) in templist.featuresList" :key="index">{{item.features}}</div>
                    </div>
              </div>

                <!-- 图文详情部分的样式 -->
                <div class="previewimgAndText">
                      <span>图文详情</span>
                      <div v-html="templist.imgAndText">
                      </div>
                </div>

                <!-- 行程介绍部分样式 -->
                <div class="previewtravelintro">
                    <span>行程介绍</span>
                    <!-- 集合时间，集合地点部分 -->
                    <div class="previewtourlist">
                    <el-table
                        :data="templist.tourList"
                        border
                        style="width: 100%">
                          <el-table-column
                            prop="focusPlace"
                            label="集合地点"
                            width="80">
                          </el-table-column>
                          <el-table-column
                            prop="focusTime"
                            label="集合时间"
                            width="80">
                          </el-table-column>
                          <el-table-column
                            prop="backPlace"
                            width="80"
                            label="返回地点">
                          </el-table-column>
                            <el-table-column
                            prop="otherMeg"
                            width="55"
                            label="其他">
                          </el-table-column>
                        </el-table>
                    </div>
                    <!-- 沿途景点部分 -->
                    <div class="previewscenerylist">
                       <span>沿途景点</span>
                        <div class="exactscenerylist">
                            <span v-for="(item,index) in templist.sceneryList" :key="index">{{item}}</span>
                        </div>
                    </div>

                    <!-- 具体的每一天的行程部分 -->
                    <div class="previewexacttourism">
                          <div class="exactlist" v-for="(item,index) in templist.exactTourList" :key="index">
                                <span class="nthdate">第{{item.nthdate}}天</span>
                                <div class="startAndend">
                                    <span>{{item.startPlace}}</span>
                                    <span>{{item.endPlace}}</span>
                                </div>
                                <div class="exacttravel" v-html="item.exactTravel">
                                     
                                </div>
                                <div class="eat">
                                      <span>早餐: {{item.breakfast}}</span>
                                      <span>午餐：{{item.lunch}}</span>
                                      <span>晚餐：{{item.dinner}}</span>
                                </div>
                                <div class="live">
                                      <span>入住：{{item.hostel}}</span>
                                </div>
                          </div>
                    </div>
                </div>

                     <!-- 最后费用说明和预定须知-->
                <div class="tourismcost">
                     <span>费用说明</span>
                     <div  v-html="templist.costIntro">

                     </div>
                </div>
                <div class="orderexact"  >
                      <span>预定须知</span>
                     <div  v-html="templist.bookNotice">

                     </div>
                </div>
          </div>
            <el-button type="primary" @click="showTourismPreview=!showTourismPreview">取消预览</el-button>
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toTourismEdit">
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
          <span>{{ row.travelId}}</span>
        </template>
      </el-table-column>

     <!-- 套餐没有结束时间 -->
      <!-- <el-table-column label="截止日期" prop="time" width="150px" align="center" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" >{{ row.title}}</span>
        </template>
      </el-table-column>
<!-- 这里绑定了一个修改数据的回调函数，和edit的是一样 -->
      <el-table-column label="简介" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.intro}}</span>
        </template>
      </el-table-column>

       
      <el-table-column label="限时价格" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.limitprice}}</span>
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
            {{  statusOptions[row.status ] }}
          </el-tag>
        </template>
      </el-table-column>


        <!-- 这里是我们的操作栏 -->
      <el-table-column label="Actions" align="center" width="290" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- 已经完善 -->
          <el-button v-if="row.status!=0" size="mini" type="success" @click="handleModifyStatus(row,0)">
            售罄
          </el-button>
          <el-button v-if="row.status!=1" size="mini" @click="handleModifyStatus(row,1)">
           可购买
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="previewDate(row)">
            预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>

<!-- 这里是下面的分页器 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 // 从api中引入与后台交互的请求方法
import { fetchList, createArticle, updateArticle,deleteArticle,changeStatus} from '@/api/travel'
    // 引入水波纹
import waves from '@/directive/waves' // waves directive
    // 格式化时间
import { parseTime } from '@/utils'
   // 分页组件
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


const typeOptions=["美食","约游","玩好","乐享","纯味"]

export default {
  name: 'TourismAdmin',
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
      // 创建一个变量来控制预览界面是否限时
      showTourismPreview:false,
      // 创建一个临时变量来控制预览界面中的数据‘
      templist:{
        title:"【玩好】惠州2日1晚上跟团游|【美食专场直通车】惠州富力岭南花园无限次温泉,五星谢顿顿自助早晚餐2日游",
        amount:1,
        intro:111,
        price:999,
        limitprice:888,
        status:1,  //改为数字0  1
        // 添加一个类型选型方便进行搜索
        // 乐品，美食，纯味，玩好，约游
        departurePlace:["深圳","上海","广州"],
        adultPrice:999,
        childPrice:88,
        differPrice:88,
        imglist:[
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'}
        ],
        //对应的价格日历列表
        priceCalendar:[
          {date:"2022-05-01",price:200}
        ],
        //产品亮点列表
        featuresList:[{features:"11111111111111111111111111111111111111111111"},{features:"11111111111111111"}],
        //图文详情
        imgAndText:`<p>预定须知</p>
                      <p>1.每张门票只限单人游玩，网上预定成功后凭借短信通知请凭借二维码到前台兑换</p>
                      <p>2.自然学校开放时间为每天的09:30-18:00(17:00停止检票)</p>
                      <p>3.户外运动请注意防嗮以及蚊子叮咬,以下人员不允许参加项目：<br>
                          (1)穿高跟鞋、凉鞋以及裙子等服饰<br>
                          (2)患有高血压等疾病<br>
                          (3)身高一米一下体重100斤以上<br>
                          #隐瞒身体状况,在活动过程中出现意外由自己负责</p>
                      <p>
                          4.项目过程中请勿携带手机,钥匙等尖锐物品,已满造成损伤或者损坏，体验项目是严禁嬉闹
                          互相推搡故意晃动，拍照留念时，须在保证自身安全的同时进行</p>
                      <p>
                           5.项目受到天气影响雷雨天气不能进行，活动中与到雷雨天气,活动等课程将不能正常进行，
                          可在学校前台做具体活动变更
                      </p>
          `,
        //行程介绍
       
        // 把下面这两个提出去
          tourList:[{
            backPlace:"东莞",
            focusPlace:"东莞",
            focusTime:"2022-05-13 00:00:00",
            otherMeg:"111111"
          }],
          sceneryList:["东莞","东莞","东莞"],
          exactTourList:[
            // 把地点分开
              {nthdate:1,destination:"广州/上海",exactTravel:"11",breakfast:"11",
              lunch:"111",dinner:"111",hostel:"111"
              },
              {nthdate:2,destination:"222/222",exactTravel:"222",breakfast:"22",
              lunch:"222",dinner:"",hostel:"222"
              },
          ],
      
        //费用说明
        costIntro:'',
        //预订须知
        bookNotice:'',
      },
      tableKey: 0,
      // 获取过来的数据
      // 先让页面显示这些静态的数据
      list: [
        {
        id:1,
        title:"111",
        amount:1,
        intro:111,
        price:999,
        limitprice:888,
        status:1,  //改为数字0  1
        // 添加一个类型选型方便进行搜索
        // 乐品，美食，纯味，玩好，约游
         departurePlace:["深圳","上海","广州"],
        adultPrice:999,
        childPrice:88,
        differPrice:88,
        imglist:[
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'}
        ],
        //对应的价格日历列表
        priceCalendar:[
        ],
        //产品亮点列表
        featuresList:[],
        //图文详情
        imgAndText:'',
        //行程介绍
       
          // 把下面这两个提出去
            tourList:[],
            sceneryList:[],
            exactTourList:[
              {nthdate:1,startPlace:"广州",endPlace:"上海",exactTravel:
                    `<p>丛林穿越线A线</p>
                      <p> 线路长度:<br>120米项目数量13关<br>难度系数:***</p>
                      <p> 适合人群:<br>身高一米以上体重50公斤身体健康,心理素质良好的儿童</p>
                      <p> 安全保护装备的穿戴<br>安全头盔</p>
                       <p>  项目介绍：<br>丛林穿越市一条设在小溪边的封闭网道,线路全长120米,平均高度3米，通过
                       爬,抓,握等动作通过障碍,让孩子在半空不断前行</p>               
                     `,
               breakfast:"自理",
               lunch:"自理",dinner:"自理",hostel:"告庄酒店参考；亿城阳光 告庄那排来度假酒店"
              },
              {nthdate:2,startPlace:"广州",endPlace:"上海",exactTravel:
                    `<p>丛林穿越线A线</p>
                      <p> 线路长度:<br>120米项目数量13关<br>难度系数:***</p>
                      <p> 适合人群:<br>身高一米以上体重50公斤身体健康,心理素质良好的儿童</p>
                      <p> 安全保护装备的穿戴<br>安全头盔</p>
                       <p>  项目介绍：<br>丛林穿越市一条设在小溪边的封闭网道,线路全长120米,平均高度3米，通过
                       爬,抓,握等动作通过障碍,让孩子在半空不断前行</p>               
                     `,
               breakfast:"自理",
               lunch:"自理",dinner:"自理",hostel:"告庄酒店参考；亿城阳光 告庄那排来度假酒店"
              },
          ],  
        //费用说明
        costIntro:  `<p>丛林穿越线A线</p>
                      <p> 线路长度:<br>120米项目数量13关<br>难度系数:***</p>
                      <p> 适合人群:<br>身高一米以上体重50公斤身体健康,心理素质良好的儿童</p>
                      <p> 安全保护装备的穿戴<br>安全头盔</p>
                       <p>  项目介绍：<br>丛林穿越市一条设在小溪边的封闭网道,线路全长120米,平均高度3米，通过
                       爬,抓,握等动作通过障碍,让孩子在半空不断前行</p>               
                     `,
        //预订须知
        bookNotice:  `<p>丛林穿越线A线</p>
                      <p> 线路长度:<br>120米项目数量13关<br>难度系数:***</p>
                      <p> 适合人群:<br>身高一米以上体重50公斤身体健康,心理素质良好的儿童</p>
                      <p> 安全保护装备的穿戴<br>安全头盔</p>
                       <p>  项目介绍：<br>丛林穿越市一条设在小溪边的封闭网道,线路全长120米,平均高度3米，通过
                       爬,抓,握等动作通过障碍,让孩子在半空不断前行</p>               
                     `,
      },
      {
        id:2,
        title:"222",
        amount:2,
        intro:222,
        price:5555,
        limitprice:55,
        status:1,
        // 添加一个类型选型方便进行搜索
        // 乐品，美食，纯味，玩好，约游
        departurePlace:["深圳","上海","广州"],
        adultPrice:999,
        childPrice:88,
        differPrice:88,
        imglist:[
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
          {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'}
        ],
        //对应的价格日历列表
        priceCalendar:[
        ],
        //产品亮点列表
        featuresList:[],
        //图文详情
        imgAndText:'',
        //行程介绍
        tourList:[],
        sceneryList:[],
        exactTourList:[
              {nthdate:1,startPlace:"广州",endPlace:"上海",exactTravel:
                    `<p>丛林穿越线A线</p>
                      <p> 线路长度:<br>120米项目数量13关<br>难度系数:***</p>
                      <p> 适合人群:<br>身高一米以上体重50公斤身体健康,心理素质良好的儿童</p>
                      <p> 安全保护装备的穿戴<br>安全头盔</p>
                       <p>  项目介绍：<br>丛林穿越市一条设在小溪边的封闭网道,线路全长120米,平均高度3米，通过
                       爬,抓,握等动作通过障碍,让孩子在半空不断前行</p>               
                     `,
               breakfast:"自理",
               lunch:"自理",dinner:"自理",hostel:"告庄酒店参考；亿城阳光 告庄那排来度假酒店"
              },
              {nthdate:2,startPlace:"广州",endPlace:"上海",exactTravel:
                    `<p>丛林穿越线A线</p>
                      <p> 线路长度:<br>120米项目数量13关<br>难度系数:***</p>
                      <p> 适合人群:<br>身高一米以上体重50公斤身体健康,心理素质良好的儿童</p>
                      <p> 安全保护装备的穿戴<br>安全头盔</p>
                       <p>  项目介绍：<br>丛林穿越市一条设在小溪边的封闭网道,线路全长120米,平均高度3米，通过
                       爬,抓,握等动作通过障碍,让孩子在半空不断前行</p>               
                     `,
               breakfast:"自理",
               lunch:"自理",dinner:"自理",hostel:"告庄酒店参考；亿城阳光 告庄那排来度假酒店"
              },
          ],
        //费用说明
        costIntro:'',
        //预订须知
        bookNotice:'',
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
      },
      // 这部分数据是控制列表中的升降序
      // label组件的显示名，每个选项的key
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      // 修改页面中的选择状态框
      statusOptions: ['售罄','可购买'],
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
    this.getList()
  },
  // 同样一旦挂载就在全局事件总线中添加一个自定义函数
  mounted() {
      // 触发createData(temp)
     this.$bus.$on("busCreateTravelData",this.createData);
       // updateData(temp)
     this.$bus.$on("busUpdateTravelData",this.updateData);
  },
  // 在销毁总线之前进行解绑
  beforeDestroy() {
       this.$bus.$off("busCreateTravelData");
       this.$bus.$off("busUpdateTravelData");
  },
  methods: {
    // 为预览按钮绑定一个回调函数
      previewDate(row){
         this.showTourismPreview=!this.showTourismPreview
         this.templist=row
    },
     // 接口不知到为什么错了先不使用mock中的数据
     // 获取列表数据
    getList() {
        // 将table设置 载入效果
      // this.listLoading = true
           //从后台请求数据
      fetchList(this.listQuery).then(response => {
           // 将获取到的数据替换data中的数据
        this.list = response.data.list
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
      this.getList(this.listQuery)
    },


// 处理我们的状态
async  handleModifyStatus(row, status) {
  let res =await changeStatus(row.id);
  if(res.code===2000){
       this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
  }
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
    // sortByTime(order){
    //     //按照降序排序
    //     if(order == "descending"){
    //       // 这里需要将时间转化为时间撮
    //         this.list = this.list.sort((a, b) => new Date(b.endTime)*1 - new Date(a.endTime)*1);
    //     }
    //     //按照升序排序
    //     else{
    //         this.list = this.list.sort((a, b) => new Date(a.endTime)*1- new Date(b.endTime)*1);
    //     }
    // },


    //点击新增然后跳转到新增页面
    toTourismEdit(){
      this.$router.push({
             path:"/productadmin/TourismEdit",
             query:{
                methstatus:"createdata"
             }
          });
    },

       //出现添加页面后，创建数据方法
 async  createData(temp) {
       // 饿了么form表单前端校验的固定写法，当点击确定新增数据时，再校验一遍数据是否符合rules
         //this.$refs['dataForm'].validate((valid) => {if (valid) {}})
         // 将字符串转化为整数
         const tempData = Object.assign({}, temp)
          tempData.price=parseInt(tempData.price)
          tempData.adultPrice=parseInt(tempData.adultPrice)
          tempData.childPrice=parseInt(tempData.childPrice)
          tempData.differPrice=parseInt(tempData.differPrice)
          tempData.limitprice=parseInt(tempData.limitprice)
          tempData.amount=parseInt(tempData.amount)
          //设置基础数据
          tempData.id = parseInt(Math.random() * 100) + 1024 // mock a id
            // 到后端请求新增数据
          //createArticle(this.temp).then(() => {})
            // 删除list中的数据
            let res= await createArticle(tempData);
           if(res.code===2000){
              this.list.push(tempData)
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
    },

      // 点击修改执行的方法  显示修改界面
      // 点击编辑后我们需要跳转到编辑页面并将这一行的数据传递过去
    handleUpdate(row) {
          // 将table中的row数据深拷贝到temp 中
      const temp = Object.assign({}, row) // copy obj
      temp.timestamp = +new Date(temp.timestamp)
      // 在跳转路由的同时将这行数据通过query传递过去
      this.$router.push({
           path:"/productadmin/TourismEdit",
           query:{
              list:temp,
              methstatus:"updata"
           }
      });
    },

//validate：

//对整个表单进行校验的方法，参数为一个回调函数。
//该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
//若不传入回调函数，则会返回一个 promise
    // 修改页面中确认按钮绑定的回调函数
 async  updateData(temp) {
  //   this.$refs['dataForm'].validate((valid) => {if (valid) {  })
          const tempData = Object.assign({}, temp)
          tempData.price=parseInt(tempData.price)
          tempData.adultPrice=parseInt(tempData.adultPrice)
          tempData.childPrice=parseInt(tempData.childPrice)
          tempData.differPrice=parseInt(tempData.differPrice)
          tempData.limitprice=parseInt(tempData.limitprice)
          tempData.amount=parseInt(tempData.amount)
         // updateArticle(tempData).then(() => { })
         let res =await updateArticle(tempData);
         if(res.code===2000){
            // const index = this.list.findIndex(v => v.id === temp.id)
            // this.list.splice(index,1,tempData)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
            title: 'Success',
            message: '更新成功',
            type: 'success',
            duration: 2000
            })
         }
           
    },
    // 这个是删除按钮的回调函数
 async  handleDelete(row,index) {
      let res=await deleteArticle(row.id);
      if(res.code===2000){
        this.$notify({
        title: 'Success',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
      }
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
        if (j === 'endTime') {
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
/* 控制预览界面的样式 */
.app-container .tourism-preview-div{
     position:absolute;
     background-color:#bdc3c7;
     z-index: 2;
     width: 100%;
     height: 100%;
     display: flex;
     flex-direction: column;
     align-items:center;
}

 .app-container .tourism-preview-div .preview-main{
   width: 360px;
   height: 90%;
   background-color:white;
   display: flex;
   flex-direction: column;
   align-items:center;
   overflow-y: auto;
 }

  /* 有关轮播图的样式 */
 .app-container .tourism-preview-div .preview-main .broadcast{
   width: 100%;
 }
    /* 调整图片的大小 */
  .app-container .tourism-preview-div .preview-main .broadcast img{
      width: 100%;
      height: 100%;
  }

  /* 调整简介和标题部分的样式 */
 .app-container .tourism-preview-div .preview-main  .introdiv{
       padding-top:10px;
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
 }

  .app-container .tourism-preview-div .preview-main .introdivtop{
       width: 90%;
       display: flex;
       align-items: center;
       font-size: 15px;
       line-height: 20px;
       font-weight: bold;
 }

/* 调整限时抢购价格部分的样式 */
 .app-container .tourism-preview-div  .preview-main .pricedatadiv{
       width: 90%;
       display: flex;
       align-items: center;
       height: 40px;
       margin-top: 5px;
       flex-shrink: 0; 
 }

 /* 调整里面pricediv的样式 */
  .app-container .tourism-preview-div  .preview-main .pricedatadiv .pricediv{
       width: 60%;
       height: 100%;
       display: flex;
       align-items: center;
       font-size: 14px;
       padding-left: 10px;
  }

  .app-container .tourism-preview-div  .preview-main .pricedatadiv .pricediv .limitprice{
      font-size: 20px;
      font-weight: bold;
      color: #e67e22;
      margin-right: 5px;
  }

  
   .app-container .tourism-preview-div .preview-main .pricedatadiv .pricediv .price{
      position: relative;
   }

    .app-container .tourism-preview-div .preview-main .pricedatadiv .pricediv .price::after{
      content: "";
      display: block;
      height: 1px;
      position:absolute;
      width: 100%;
      background-color: black;
      top: 50%;
    }

    /* 旅游顾问部分的样式 */
  .app-container .tourism-preview-div .preview-main .tourismman{
    width: 90%;
    height: 70px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 10px;
     flex-shrink: 0; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .07)

  }

  .app-container .tourism-preview-div.preview-main .tourismman .manimg{
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .app-container .tourism-preview-div .preview-main .tourismman .manimg img{
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
 
  .app-container .tourism-preview-div .preview-main .tourismman .phone{
    display: flex;
    flex-direction: column;
  }

  .app-container .tourism-preview-div .preview-main .tourismman  .twobutton{
   display: flex;
  }
  .app-container .tourism-preview-div .preview-main .tourismman  .twobutton div{   
      border: 1px solid black;
      padding: 2px;
      margin: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  /* 套餐部分 */
   .app-container .tourism-preview-div .setmeal{
       width: 90%;
       height: 300px;
       display: flex;
       flex-direction: column;
       align-items:flex-start;
       margin-top: 20px;
       padding: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .07)
   }

    .app-container .tourism-preview-div .setmeal .mealmain{
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items:flex-start;
       font-size: 16px;
   }

   .app-container .tourism-preview-div .setmeal .mealmain .meallist{
       display: flex;
       justify-content: space-around;
       align-items: center;
       height: 60px;
   }
    .app-container .tourism-preview-div .setmeal .mealmain .meallist div{
       border: 1px solid orange;
       padding: 3px;
       color: coral;
       font-size: 13px;
    }

    /* 出发地点部分 */
    .app-container .tourism-preview-div .starttime{
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items:flex-start;
       font-size: 16px;
    }

    .app-container .tourism-preview-div .starttime .meallist{
       width: 100%;
       margin-bottom: 10px;
       display: flex;
    }

    .app-container .tourism-preview-div .starttime .meallist div{
      width: 120px;
      height: 50px;
      font-size: 14px;
      flex-wrap: wrap;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #bdc3c7;
      margin-left: 5px;
    }

    /* 产品亮点部分样式 */
    .app-container .tourism-preview-div .advantage{
         width: 90%;
         flex-shrink: 0;
         display: flex;
         flex-direction: column;
         margin-top: 10px;
         padding: 5px;
         box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .07)
    }

     .app-container .tourism-preview-div .advantage .advantagelist{
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: flex-start;
     }

      .app-container .tourism-preview-div .advantage .advantagelist div{
          font-size: 14px;
          margin-top: 10px;
       }

       /* 图文详情部分的样式 */
      .app-container .tourism-preview-div  .previewimgAndText{
          width: 90%;
          padding: 5px;
          margin-top: 10px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .07)
      }
       .app-container .tourism-preview-div  .previewimgAndText div{
           flex-shrink: 0;
           font-size: 14px;
       }

       /* 行程介绍部分样式 */
       .app-container .tourism-preview-div  .previewtravelintro{
          width: 90%;
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
          align-items: flex-start;
          padding: 5px;
          margin-top: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .07)
       }
       .app-container .tourism-preview-div  .previewtravelintro .previewtourlist{
          width: 100%;
          font-size: 12px;
       }

       /* 沿途景点部分 */
        .app-container .tourism-preview-div  .previewtravelintro .previewscenerylist{
          width: 100%;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .app-container .tourism-preview-div  .previewtravelintro .previewscenerylist .exactscenerylist{
          display: flex;
          width: 100%;
          justify-content: space-around;
        }
        .app-container .tourism-preview-div  .previewtravelintro .previewscenerylist .exactscenerylist span{
           border: 1px solid;
           font-size: 14px;
           padding: 2px;
        }
        /* 具体的每一天的行程 */
        .app-container .tourism-preview-div .previewexacttourism{
          width: 100%;
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
         .app-container .tourism-preview-div .previewexacttourism .exactlist{
          width: 100%;
          display: flex;
          border-top: 1px solid gray ;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin-bottom: 20px;
          padding-bottom: 10px;
         }
         
         .app-container .tourism-preview-div .previewexacttourism .exactlist .nthdate{
           position: absolute;
           background-color: aqua;
           left: 50%;
           transform: translate(-50%,-50%);
           width: 80px;
           height: 30px;
           display: flex;
           justify-content: center;
           align-items: center;
         }

          .app-container .tourism-preview-div .previewexacttourism .exactlist .startAndend{
            margin-top: 30px;
            width: 100%;
            display: flex;
            justify-content: space-around;
          }
           .app-container .tourism-preview-div .previewexacttourism .exactlist .exacttravel{
              margin: 15px 0;
              padding-top: 5px;
              border-top: 1px solid gainsboro;
           }

           .app-container .tourism-preview-div .previewexacttourism .exactlist .eat{
              display: flex;
              width: 100%;
              align-items: center;
              justify-content:space-between;
           }

           .app-container .tourism-preview-div .previewexacttourism .exactlist .live{
             margin-top: 20px;
             width: 100%;
             display: flex;
             align-items: center;
             justify-content: flex-start;
           }

           /* 最后预定须知和费用说明的样式 */
           .app-container .tourism-preview-div .tourismcost{
              padding-top: 20px;
              width: 90%;
              display: flex;
              flex-direction: column;
              
              box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .07)
           }
            .app-container .tourism-preview-div .orderexact{
              width: 90%;
                padding-top: 20px;
              display: flex;
              flex-direction: column;
               box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .07)
            }
</style>