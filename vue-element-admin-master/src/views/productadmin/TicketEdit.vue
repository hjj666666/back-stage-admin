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
                        <el-date-picker
                        type="datetime"
                         v-model="list.timestamp"
                        placeholder="选择日期时间">
                        </el-date-picker>
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
                    <span v-if="scope.row.isshow">{{scope.row.intro}}</span>
                    <el-input v-model="scope.row.intro"  v-else></el-input>
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
                    <el-input v-model="addintrotemp" placeholder="请输入要添加的信息"></el-input>
                    <el-button type="success" size="small" @click=" handleintroAdd">确认添加</el-button>
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
                    <el-input v-model="scope.row.order"  v-else></el-input>
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
                    <el-input v-model="addintrotemp" placeholder="请输入要添加的信息"></el-input>
                    <el-button type="success" size="small" @click=" handleorderAdd">确认添加</el-button>
                    <el-button type="success" size="small" @click="isshoworderAdd">取消</el-button>
                </div>   
            </div>

            <!-- 下面是费用说明部分 -->
            <div id="costitem">
                <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                label="顺序"
                prop="date">
                </el-table-column>

                <el-table-column
                label="费用说明"
                prop="name">
                </el-table-column>
                
                <el-table-column
                align="right">
                <template slot="header" >
                     <el-button type="primary">增加</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">Edit</el-button>

                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
                </el-table-column>
            </el-table>  
            </div>

            <!-- 下面是取消和确认连个按钮 -->
            <div id="footer">
                <el-button type="primary">确认</el-button>
                <el-button type="success">取消</el-button>
            </div>
        </div>
   </div>
</template>

<script>
export default {
    data() {
        return {
            // 创建变量保存临时添加的数据
            addintrotemp:"",
            addordertemp:"",
            // 创建一个变量控制是否显示添加文本框
            isshowaddintro:false,
            isshowaddorder:false,
            list:{
                intro:"11",
                price: '11',
                limitprice: '11',
                timestamp:"2022-3-20 12:00:00",
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
                exactcost:["1111111111111","1111111111111","1111111111111","1111111111111"],                   
            },
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
           
        //    表单部分原来就有的数据
            tableData: [{
            date: '1',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
            }, {
            date: '3',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
            }, {
            date: '4',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
            }],
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
            this.list.exactintro.push({order:this.addordertemp,isshow:true});
        },
        handleorderEdit(index, row) {
            row.isshow=!row.isshow;
        },
        handleorderDelete(index, row) {
            this.list.exactorder.splice(index,1);
        }

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

/* 下面两个按钮的样式 */
#ticketedit #form #footer{
    margin-top: 10px;
    margin-bottom: 30px;
    width: 90%; 
}
</style>