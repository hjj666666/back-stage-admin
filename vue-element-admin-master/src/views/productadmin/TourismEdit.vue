<template>
  <div class="tourismedit">
    <div class="quillEditor" v-if="isShowquillEditor">
        <div>
            <quill-editor
            ref="myQuillEditor"
            :options="editorOption"
            v-model="uploadList[quillEditorType]"
        />
        </div>
        <br>
        <el-button type="primary" @click="quitEditor">保存并退出</el-button>
    </div>
    <el-button type="primary" plain @click="test">测试</el-button>
    <!-- 折叠编辑的部分 -->
    <el-collapse v-model="openList">
        <el-collapse-item class="collapse-title-class" title="图片上传" name="uploadPic">
                <!-- 展示已经上传的图片，在后端获取图片数据 -->
                <div class="showPic">
                    <div class="showPic-item" v-for="(item,index) in uploadList.imglist" :key="index">
                        <el-image
                            style="width: 10em; height: 10em; border-radius:1.5em;"
                            :src="item.url"
                            fit="cover">
                        </el-image>
                        <!-- 删除图片的按钮 -->
                        <div class="delPicBtn">
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteimg(index)"></el-button>
                        </div>
                    </div>
                </div>

                <!-- 上传图片的按钮 -->
                <div class="uploadPic">
                    <el-upload
                        class="uploadPicBtn"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :before-upload="beforePicUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
        </el-collapse-item>
        
        <!-- 基础信息的输入 -->
        <el-collapse-item class="collapse-title-class" title="基础信息" name="baseInf">
            <el-row :gutter="20">
                <el-col :span="23">
                    <div class="uploadTitle upload">
                        <span class="beforeInput">标题:</span>
                        <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入标题"
                            v-model="uploadList.title">
                        </el-input>
                </div>
                </el-col>
            </el-row>
            <br>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="uploadIntro upload">
                        <span class="beforeInput">简介:</span>
                        <el-input  v-model="uploadList.intro" placeholder="请输入内容"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="uploadDate upload">
                        <span class="beforeInput">结束时间:</span>
                        <el-date-picker v-model="uploadList.endTime" type="datetime" placeholder="选择一个日期" />
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="uploadAmount upload">
                        <span class="beforeInput">数量:</span>
                        <el-input  placeholder="请输入数量"  v-model="uploadList.amount"></el-input>
                    </div>
                </el-col>
            </el-row>
            <br>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="uploadPrice upload">
                        <span class="beforeInput">原价格:</span>
                        <el-input  v-model="uploadList.price" placeholder="请输入价格"><template slot="prepend">￥</template></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="uploaLimitPrice upload">
                        <span class="beforeInput">限定价格:</span>
                        <el-input  v-model="uploadList.limitprice" placeholder="请输入价格"><template slot="prepend">￥</template></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="uploadAmount upload">
                        <span class="beforeInput">类型:</span>
                        <el-select v-model="uploadList.options" placeholder="请选择">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.key" 
                                :label="item" 
                                :value="item">
                            </el-option>
                            <br>
                                <span style="margin-left:1em">
                                    <el-button v-if="ifCreateNewOptions" type="primary" plain @click="switchCreateNewOptions">自定义类型</el-button>
                                    <template v-else>
                                        <el-input v-model="inputCreateNewOptions" placeholder="请输入自定义类型" maxlength="4" style="width:12em;margin-right:1em"></el-input>
                                        <el-button type="primary" plain @click="createNewOptions">确认</el-button>
                                    </template>
                                    
                                </span>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
        </el-collapse-item>

        <!-- 价格日历的编辑 -->
        <el-collapse-item class="collapse-title-class" title="价格日历" name="datePrice">
            <el-calendar>
                <template
                    slot="dateCell"
                    slot-scope="{data}">
                    <p>
                    {{ data.day.split('-').slice(1).join('-') }}
                    </p>
                    <div @click="showDatePriceOfDialog(data.day)" class="calendarBtn">
                        查看价格
                    </div>
                    <div @click="changeDatePriceOfDialog(data)" class="calendarBtn" style="margin-left:0.5em">
                        修改价格
                    </div>
                </template>
            </el-calendar>
            <el-dialog
                title="设置价格"
                :visible.sync="datePriceVisible"
                width="30%"
                >
                <span>正在设置&nbsp;
                    <span style="color:#75baff">{{changeDate}}</span>
                    &nbsp;的价格
                </span>
                <el-input  v-model="inputdatePrice" placeholder="请输入价格"><template slot="prepend">￥</template></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="datePriceVisible = false;inputdatePrice=''">取 消</el-button>
                    <el-button type="primary" @click="changeDatePrice()">确 定</el-button>
                </span>
            </el-dialog>
        </el-collapse-item>

        <!-- 下面是产品亮点列表部分-->
        <el-collapse-item class="collapse-title-class" title="产品亮点" name="features">
            <div id="introitem">
                <el-table
                :data="uploadList.featuresList"
                style="width: 100%">
                <el-table-column
                label="序号"
                width="50"
                type="index">
                </el-table-column>

                <el-table-column
                label="产品亮点"
                prop="features">
                <template slot-scope="scope">
                    <span v-if="scope.row.isshow"  v-html="scope.row.features"></span>
                    <el-input v-model="scope.row.features"  v-else   type="textarea" :rows="3"></el-input>              
                 </template>   
                </el-table-column>
                
                <el-table-column
                align="right">
                <template slot="header">
                     <el-button type="primary"  @click="isShowFeaturesAdd">增加</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    v-if="scope.row.isshow"
                    @click="handleFeaturesEdit(scope.$index, scope.row)">编辑</el-button>

                    <el-button
                    size="mini"
                    v-else
                    @click=" handleFeaturesEdit(scope.$index, scope.row)">确认</el-button>

                    <el-button
                    size="mini"
                    type="danger"
                    @click=" handleFeaturesDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
                </el-table> 

                <div class="additem" v-if="isShowAddFeatures">
                    <el-input v-model="addFeaturesTemp" 
                    placeholder="请输入要添加的信息" 
                    type="textarea" 
                    :rows="2"
                    style="width:80%"></el-input>
                    <el-button type="primary" size="small" @click="handleFeaturesAdd" style="margin:1em 1em">确认添加</el-button>
                    <el-button type="danger" size="small" @click="isShowFeaturesAdd">取消</el-button>
                </div>   
            </div>
        </el-collapse-item>

        <el-collapse-item class="collapse-title-class" title="图文详情" name="picAndText">
            <el-button type="primary" @click="test(imgAndText)">编辑</el-button>
            <div class="picAndText" v-html="uploadList.imgAndText">

            </div>
        </el-collapse-item>

        <el-collapse-item class="collapse-title-class" title="行程介绍" name="tourIntro">

        </el-collapse-item>

        <el-collapse-item class="collapse-title-class" title="费用说明" name="costIntro">

        </el-collapse-item>

        <el-collapse-item class="collapse-title-class" title="预订须知" name="bookNotice">

        </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// 实现富文本基本引用
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
// 实现图片缩放编辑
import Quill from "quill";
import ImageResize from "quill-image-resize-module";
import { ImageDrop } from "quill-image-drop-module"
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize); // 注册

// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
  [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
  [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ["clean"], // 清除文本格式-----['clean']
  ["image", "video"] // 链接、图片、视频-----['link', 'image', 'video']
];
export default {
    name: 'TourismEdit',
    components: {
      quillEditor
    },
    data() {
        return {
            // 默认打开的折叠部分
            openList:['uploadPic','baseInf'],

            //可以选择的套餐类型
            typeOptions:["美食","约游","玩好","乐享","纯味"],

            //输入的信息列表，到时直接提交这个玩意
            uploadList:{
                title:'',  //标题
                intro:'',  //简介
                endTime:'', //结束时间
                amount:'',  //数量
                price: '',  //原价
                limitprice: '', //限时价格
                options:'',     //类型

                //暂时的图片列表，到时运用函数获取后端的api
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
            },

            //这里存放开关某些v-if的临时状态
            ifCreateNewOptions:true, //这个是套餐类型的新增类型的切换状态
            datePriceVisible:false, //这是价格日历的对话框显示状态
            isShowAddFeatures:false,//显示产品亮点文本框的状态
            isShowquillEditor:false, //显示富文本编辑器的状态

            //这里存放临时的值，基本上用完就不用的
            inputCreateNewOptions:'',  //这个是管理员写的新增的类型
            changeDate:'',     //选中的日期
            inputdatePrice:'', //选中日期的价格
            addFeaturesTemp:'', //产品亮点临时输入
            quillEditorType:'', //富文本编辑器正在编辑的类型

             //  富文本编辑器配置
            editorOption: {
                //  富文本编辑器配置
                theme: "snow",
                placeholder: "请输入正文",
                modules: {
                    imageDrop: true,
                    imageResize: {
                        displayStyles: {
                        backgroundColor: "black",
                        border: "none",
                        color: "white"
                    },
                    modules: ["Resize", "DisplaySize", "Toolbar"]
                },
                toolbar: toolbarOptions
                },
           
            },
        }
    },

    methods: {
        // 创建一个删除图片的回调函数
        deleteimg(index){
            // 如果删除成功，弹出一个消息框
            this.$notify({
                title: '删除成功',
                message: '已删除一张图片',
                type: 'success',
                duration: 2000
            })
             this.uploadList.imglist.splice(index,1);
        },

        //上传图片的尺寸和大小设置
        beforePicUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        //切换新增类型的函数
        switchCreateNewOptions(){
             this.ifCreateNewOptions=!this.ifCreateNewOptions;
        },

        //新增类型的函数
        createNewOptions(){
            if(this.inputCreateNewOptions!=''){
                this.uploadList.options=this.inputCreateNewOptions;
                this.ifCreateNewOptions=true;
            }
            else{
                this.$message({
                    message: '类型不能为空',
                    type: 'warning'
                });
            }
        },

        //查看当前日期的价格（实在没有办法实现实时渲染了，丢人！所以这是一个委屈求全的方法）
        showDatePriceOfDialog(day){
            var obj=this.uploadList.priceCalendar.find(function (obj) {
                return obj.date === day
            })
             this.$alert(day+"的价格为"+obj.price, '查询价格', {
                confirmButtonText: '关闭',
            });
        },
        //修改当前日期的价格
        //点击修改价格并获取当前日期，让对话框显示
        changeDatePriceOfDialog(data){
            this.datePriceVisible = true
            this.changeDate=data.day
        },
        //确定函数
        changeDatePrice(){
            if(this.changeDate != '' && this.inputdatePrice != ''){
                this.uploadList.priceCalendar.push({date:this.changeDate,price:this.inputdatePrice})
                this.datePriceVisible = false
                this.changeDate=''
                this.inputdatePrice=''
            }
            else{
                this.$message({
                    message: '数据不能为空',
                    type: 'warning'
                });
            }
        },

        // 产品亮点表单的方法
        isShowFeaturesAdd(){
            this.isShowAddFeatures=!this.isShowAddFeatures;
        },
        handleFeaturesAdd(){
            if(this.addFeaturesTemp != ''){
                this.uploadList.featuresList.push({features:this.addFeaturesTemp,isshow:true});
                this.addFeaturesTemp="";
                this.isShowAddFeatures=false;
            }
            else{
                this.$message({
                    message: '数据不能为空',
                    type: 'warning'
                });
            }
        },
        handleFeaturesEdit(index, row) {
            row.isshow=!row.isshow;
        },
        handleFeaturesDelete(index, row) {
            this.uploadList.featuresList.splice(index,1);
        },


        // 富文本编辑器的方法
        // 退出编辑器
        quitEditor(){
            this.$confirm('是否确定保存并退出', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                //富文本编辑器设定为隐藏
                this.isShowquillEditor=false

                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
            
        },
        //测试函数
        test(data){
            console.log(this.uploadList)
            this.quillEditorType="imgAndText"
        },
    },
}
</script>

<style >
    /* 富文本编辑器的样式 */
    .tourismedit .quillEditor{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;

        margin-top: 0px;
        margin-bottom: 20px;
    }
    .tourismedit .quillEditor .ql-editor{
        min-height: 500px;
    }
    /* 折叠的样式 */
    .tourismedit .el-collapse{
        margin-left: 1em;
        margin-right: 1em;
    }
    /* 折叠标题的样式 */
    /* 没有less暂时改不了 */

    /* 上传的图片样式 */
    .tourismedit .showPic .showPic-item{
        margin: 1em;
        float: left;
    }
    /* 删除图片的按钮样式 */
    .tourismedit .showPic .showPic-item .delPicBtn{
        position: relative;
        top:-11em;
        right:-8em;
    }

    /* 上传图片的按钮样式 */
    .tourismedit .uploadPic .uploadPicBtn .el-upload {
        margin-top: 1em;
        margin-left: 1em;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 4.7em;
        height: 4.7em;
        line-height: 4.7em;
        text-align: center;
    }

    /* 每个输入框前面的那几个字 */
    .beforeInput{
        width: 10em;
        align-items: center;
        margin-right: 2em;
    }

    /* 上传输入框的样式 */
    .tourismedit .upload{
        margin-left: 1em;
        justify-content: space-between;
        font-size: 1em;
        font-weight: 600;
    }
    .tourismedit .upload .el-input{
        width: 20em;
    }

    .tourismedit .calendarBtn{
        float:left;
        width: 5em;
        background-color: #75baff;
        padding-left:0.5em;
        border-radius: 6px;
    }
    
</style>