<template>
   <div id="ticketedit">
       <!-- 这部分是上面的图片部分 -->
       <div id="imgadmin">
           <div id="imgcontrol">
               <div id="item"  v-for="(fit,index) in fits" :key="index">
                    <!-- 显示图片 -->
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="url"
                        :fit="fit">
                    </el-image>
                    <!-- 显示删除按钮 -->
                    <div id="button">
                        <el-button type="danger" icon="el-icon-delete" circle></el-button>
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
           <div id="div1">
               <div id="inda">
                    <div id="intro">
                        <span class="span1">简介:</span>
                        <el-input  placeholder="请输入内容"></el-input>
                    </div>

                    <div id="date">
                        <span class="span1">结束时间:</span>
                        <el-date-picker
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
               </div>
     
                <div id="ptli">
                    <div id="price">
                        <span class="span1">原价格:</span>
                        <el-input  placeholder="请输入内容"></el-input>
                    </div>
                    <div id="limitprice">
                        <span class="span1">限时价格:</span>
                        <el-input  placeholder="请输入内容"></el-input>
                    </div>
                </div>
                    
           </div>     

            <!-- 下面是产品介绍列表部分-->
            <div id="introitem">
                <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                label="顺序"
                prop="date">
                </el-table-column>

                <el-table-column
                label="产品介绍详情"
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

           <!-- 下面是预定需知部分 -->
            <div id="orderitem">
                <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                label="顺序"
                prop="date">
                </el-table-column>

                <el-table-column
                label="预定须知"
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

            <!-- 下面是预定需知部分 -->
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
            // 这个是样式的显示数组，后期删掉
            fits: ['fill', 'fill','fill','fill','fill','fill'],
            // ui的自带图片
             url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            list:{
                intro:"11",
                price: '11',
                limitprice: '11',
                timestamp:"11",
                exactintro:["1111111111111","1111111111111","1111111111111","1111111111111"],
                exactorder:["1111111111111","1111111111111","1111111111111","1111111111111"],       
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

        // 表单的原有方法
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
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

/* 下面的是预定需知的样式*/
#ticketedit #form #orderitem{
    margin-top: 20px;
    width: 90%;
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