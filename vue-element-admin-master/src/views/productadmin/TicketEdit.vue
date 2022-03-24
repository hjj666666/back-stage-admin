<template>
   <div id="ticketedit">
       <!-- 这部分是上面的图片部分 -->
       <!-- 删除图片功能已经完善，但图片上传功能还未实现 -->
       <div id="imgadmin">
           <div id="imgcontrol">
               <div id="item"  v-for="(item,index) in list.imglist" :key="index">
                    <!-- 显示图片 -->
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="item.img"
                        fit="fill">
                    </el-image>
                    <!-- 显示删除按钮 -->
                    <div id="button">
                        <el-button type="danger" icon="el-icon-delete" circle @click="deleteimg(index)"></el-button>
                    </div>
               </div>
           </div>

           <!-- 在后面防止一个上传图片的按钮 -->
           <div id="upload">
                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
           </div>       
       </div>
        
        <!-- 完善下面的表单部分 -->
       <div id="form">
           <!-- 这部分是上面的四个输入框 -->
           <!-- 数据已经和v-modle中的数据进行双向绑定 -->
           <div id="div1">
               <div id="inda">
                    <div id="intro">
                        <span class="span1">简介:</span>
                        <el-input  v-model="list.intro" placeholder="请输入内容"></el-input>
                    </div>

                    <div id="date">
                        <span class="span1">结束时间:</span>
                        <el-date-picker v-model="list.timestamp" type="datetime" placeholder="选择一个日期" />
                    </div>

                     <div>
                        <span class="span1">剩余数量:</span>
                        <el-input  placeholder="请输入数量"  v-model="list.amount"></el-input>
                    </div>
               </div>
     
                <div id="ptli">
                    <div id="price">
                        <span class="span1">原价格:</span>
                        <el-input  placeholder="请输入内容"  v-model="list.price"></el-input>
                    </div>
                    <div id="limitprice">
                        <span class="span1">限时价格:</span>
                        <el-input  placeholder="请输入内容"  v-model="list.limitprice"></el-input>
                    </div>
                    <div>
                         <span class="span1">门票状态:</span>
                        <el-select v-model="list.status" class="filter-item" placeholder="请选择一个状态">
                            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
                       </el-select>
                    </div>
                </div>   
           </div>   

            <!-- 下面是产品介绍列表部分-->
            <div id="introitem">
                <el-table
                :data="list.exactintro"
                style="width: 100%">
                <el-table-column
                label="顺序"
                width="50"
                type="index">
                </el-table-column>

                <el-table-column
                label="产品介绍详情"
                prop="intro">
                <template slot-scope="scope">
                    <span v-if="scope.row.isshow"  v-html="scope.row.intro"></span>
                    <el-input v-model="scope.row.intro"  v-else   type="textarea" :rows="3"></el-input>              
                 </template>   
                </el-table-column>
                
                <el-table-column
                align="right">
                <template slot="header">
                     <el-button type="primary"  @click="isshowintroAdd">增加</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    v-if="scope.row.isshow"
                    @click="handleintroEdit(scope.$index, scope.row)">编辑</el-button>

                    <el-button
                    size="mini"
                    v-else
                    @click=" handleintroEdit(scope.$index, scope.row)">确认</el-button>

                    <el-button
                    size="mini"
                    type="danger"
                    @click=" handleintroDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
                </el-table> 

                <div class="additem" v-if="isshowaddintro">
                    <el-input v-model="addintrotemp" placeholder="请输入要添加的信息"  type="textarea" :rows="2"></el-input>
                    <el-button type="success" size="small" @click="handleintroleAdd">确认添加</el-button>
                    <el-button type="success" size="small" @click="isshowintroAdd">取消</el-button>
                </div>   
            </div>

           <!-- 下面是预定需知部分 -->
            <div id="orderitem">
                <el-table
                :data="list.exactorder"
                style="width: 100%">
                <el-table-column
                label="顺序"
                width="50"
                type="index">
                </el-table-column>

                <el-table-column
                label="预定须知"
                prop="intro">
                <template slot-scope="scope">
                    <span v-if="scope.row.isshow">{{scope.row.order}}</span>
                    <el-input v-model="scope.row.order"  v-else  type="textarea" :rows="3"></el-input>
                 </template>   
                </el-table-column>
                
                <el-table-column
                align="right">
                <template slot="header">
                     <el-button type="primary"  @click="isshoworderAdd">增加</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    v-if="scope.row.isshow"
                    @click="handleintroEdit(scope.$index, scope.row)">编辑</el-button>

                    <el-button
                    size="mini"
                    v-else
                    @click=" handleorderEdit(scope.$index, scope.row)">确认</el-button>

                    <el-button
                    size="mini"
                    type="danger"
                    @click=" handleorderDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
                </el-table> 

                <div class="additem" v-if="isshowaddorder">
                    <el-input v-model="addordertemp" placeholder="请输入要添加的信息"  type="textarea" :rows="2"></el-input>
                    <el-button type="success" size="small" @click=" handleorderAdd">确认添加</el-button>
                    <el-button type="success" size="small" @click="isshoworderAdd">取消</el-button>
                </div>   
            </div>

            <!-- 下面是费用说明部分 -->
            <div id="costitem">
                <el-table
                :data="list.exactcost"
                style="width: 100%">
                <el-table-column
                label="顺序"
                width="50"
                type="index">
                </el-table-column>

                <el-table-column
                label="费用说明"
                prop="intro">
                <template slot-scope="scope">
                    <span v-if="scope.row.isshow">{{scope.row.cost}}</span>
                    <el-input v-model="scope.row.cost"  v-else  type="textarea" :rows="3"></el-input>
                 </template>   
                </el-table-column>
                
                <el-table-column
                align="right">
                <template slot="header">
                     <el-button type="primary"  @click="isshowcostAdd">增加</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    v-if="scope.row.isshow"
                    @click="handleintroEdit(scope.$index, scope.row)">编辑</el-button>

                    <el-button
                    size="mini"
                    v-else
                    @click=" handlecostEdit(scope.$index, scope.row)">确认</el-button>

                    <el-button
                    size="mini"
                    type="danger"
                    @click=" handlecostDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
                </el-table> 

                <div class="additem" v-if="isshowaddcost">
                    <el-input v-model="addcosttemp" placeholder="请输入要添加的信息"  type="textarea" :rows="2"></el-input>
                    <el-button type="success" size="small" @click="handlecostAdd">确认添加</el-button>
                    <el-button type="success" size="small" @click="isshowcostAdd">取消</el-button>
                </div>   
            </div>

            <!-- 下面是取消和确认连个按钮 -->
            <div id="footer">
                <!-- 通过methstatus来判断执行那个方法 -->
                <el-button type="primary" @click='nativemeth'>确认</el-button>
                <el-button type="success" @click="cancel">取消</el-button>
            </div>
        </div>
   </div>
</template>

<script>
export default {
    name: 'TicketEdit',
    data() {
        return {
            // 创建一个状态点击确定后触发的是增加函数，修改函数
            methstatus:``,
            // 创建变量保存临时添加的数据
            addintrotemp:``,
            addordertemp:``,
            addcosttemp:``,
            // 创建一个变量控制是否显示添加文本框
            isshowaddintro:false,
            isshowaddorder:false,
            isshowaddcost:false,
            // 创建一个变量控制是否显示文本编辑器
            isshoweditor1:false,

            // 修改页面中的选择状态框
           statusOptions: ['售罄','可购买'],

            list:{
                intro:"11",
                price: '11',
                limitprice: '11',
                timestamp:"2022-3-20 12:00:00",
                // 列表那边需要有的数据
                type:["默认套餐"],
                amount:0,
                status:"可购买",
                // 下面的图片是从网上搜索的图片，获取后端数据后，直接替换就行
                imglist:[
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
                ],
                exactintro:[
                    {intro:`大岭山风景好`,isshow:true},
                    {intro:`大岭山风景秒`,isshow:true},
                    {intro:`大岭山风景呱呱叫`,isshow:true},
                    {intro:`大岭山风景棒`,isshow:true},
                ],
                exactorder:[         
                    {order:`记得看车`,isshow:true},
                    {order:`记得买票`,isshow:true},
                    {order:`记得看人`,isshow:true},
                    {order:`记得带伞`,isshow:true},
                ],       
                exactcost:[
                    {cost:`门票费用`,isshow:true},
                    {cost:`游玩项目费用`,isshow:true},
                    {cost:`吃饭费用`,isshow:true},
                    {cost:`其他费用`,isshow:true},
                    ],                   
            },
            // 这个数据是上传文本框的数据
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],

        }
    },
    activated(){
    //    判断是否能接受到我们的create函数,可以输出,成功获取
     // console.log(this.$route.query.methstatus);

    // 一旦进入立马更新methstatus，方便后面判断是执行修改方法还是增加方法
    this.methstatus=this.$route.query.methstatus;
    // 如果methstatus==createdata，这经页面中的数据清空
    if(this.methstatus==="createdata"){
       // console.log("1111");
       this.resetlist();
    }
    // 对接受到的参数进行判断：如果this.$route.query.list!=undefined,则替换掉目前的list
    // 目前测试可行
    if(this.$route.query.list!=undefined){
        this.list=this.$route.query.list;
    }
   },
    methods: {
        // 创建一个删除图片的回调函数
        deleteimg(index){
            // 如果删除成功，弹出一个消息框
            this.$notify({
                title: 'Success',
                message: '删除成功',
                type: 'success',
                duration: 2000
            })
             this.list.imglist.splice(index,1);
        },
        // 创建以恶搞是否显示编辑页面的方法
        isshoweditor(){
              this.isshoweditor1=!this.isshoweditor1;
        },
        // 创建一个清空页面的函数
        resetlist(){
            this.list.intro=``;
            this.list.price=``;
            this.list.limitprice=``;
            this.list.timestamp=``;
            this.list.amount=``;
            this.list.status=``;
            this.list.imglist=[];
            this.list.exactintro=[];
            this.list.exactorder=[];
            this.list.exactcost=[];
        },
        // 下面的是上传文件的自带方法
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },

        // 产品详情表单的方法
        isshowintroAdd(){
            this.isshowaddintro=!this.isshowaddintro;
        },
        handleintroleAdd(){
            this.list.exactintro.push({intro:this.addintrotemp,isshow:true});
            this.addintrotemp="";
        },
        handleintroEdit(index, row) {
            row.isshow=!row.isshow;
        },
        handleintroDelete(index, row) {
            this.list.exactintro.splice(index,1);
        },

        // 须知详情表单的方法
        isshoworderAdd(){
            this.isshowaddorder=!this.isshowaddorder;
        },
        handleorderAdd(){
            this.list.exactorder.push({order:this.addordertemp,isshow:true});
            this.addordertemp="";
        },
        handleorderEdit(index, row) {
            row.isshow=!row.isshow;
        },
        handleorderDelete(index, row) {
            this.list.exactorder.splice(index,1);
        },
        // 费用说明的方法
        isshowcostAdd(){
            this.isshowaddcost=!this.isshowaddcost;
        },
        handlecostAdd(){
            this.list.exactcost.push({cost:this.addcosttemp,isshow:true});
            this.addcosttemp="";
        },
        handlecostEdit(index, row) {
            row.isshow=!row.isshow;
        },
        handlecostDelete(index, row) {
            this.list.exactcost.splice(index,1);
        },    
        // 为整个表单的确认按钮绑定一个回调函数，用来触发我们接受过来的createData函数
        // 接受方法好像不太性，那么就使用全局事件总线，促发busCreateData
        nativecreateData(){
         this.$bus.$emit("busCreateData",this.list);
           this.$router.push({
               path:"/productadmin/ticket-admin"
           });
        },
        nativeupData(){
           this.$bus.$emit("busupData",this.list);
           this.$router.push({
               path:"/productadmin/ticket-admin"
           });
        },
        // 为取消按钮绑定一个回调函数
        cancel(){
             this.$router.push({
               path:"/productadmin/ticket-admin"
           });
        },
        // 创建一个方法根据我们目前表单的methstatus执行相应的方法
        nativemeth(){
            if(this.methstatus==="createdata"){
                this.nativecreateData();
            }else{
                this.nativeupData();
            }
        },
    }
}
</script>

<style>
/* 先调整整个页面的布局 */
#ticketedit{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}


/* 下面是调整上面的图片的样式 */
/* 调整图片外层边框的样式 */
#ticketedit #imgadmin{
    padding: 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background-color: #ecf0f1;
}

#ticketedit #imgadmin #imgcontrol{
    display: flex;
    width: 70%;
    justify-content:space-around;
    align-items: center;
}

#ticketedit #imgadmin #imgcontrol #item{
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#ticketedit #imgadmin #imgcontrol #item #button{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}
/* 调整上传边框的样式 */
#ticketedit #imgadmin #upload{
    width: 30%;
    display: flex;
    justify-content: center;  
}

/* 下面的是上面的输入输入框的样式 */
#ticketedit #form{
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ecf0f1;
}
#ticketedit #form #div1{
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}
#ticketedit #form #div1 #inda{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
}
#ticketedit #form #div1 #ptli{
    margin-top: 20px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
}
#ticketedit #form #div1 .span1{
    width: 100px;
    margin-right: 20px;
    display: flex;
    align-items: center;
     justify-content:flex-end;
}
#ticketedit #form #div1 #inda div{
    display: flex;  
}
#ticketedit #form #div1 #ptli div{
    display: flex;
    
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-city {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-city{
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

/* 下面的是列表部分的样式*/
#ticketedit #form #introitem{
    margin-top: 20px;
    width: 90%;
}
#ticketedit #form #introitem .additem{
    display: flex;
}
/* 下面的是预定需知的样式*/
#ticketedit #form #orderitem{
    margin-top: 20px;
    width: 90%;
}
#ticketedit #form #orderitem .additem{
    display: flex;
}
/* 下面的是费用说明的样式*/
#ticketedit #form #costitem{
    margin-top: 20px;
    width: 90%;
}
#ticketedit #form #costitem .additem{
    display: flex;
}

/* 下面两个按钮的样式 */
#ticketedit #form #footer{
    margin-top: 10px;
    margin-bottom: 30px;
    width: 90%; 
}
</style>