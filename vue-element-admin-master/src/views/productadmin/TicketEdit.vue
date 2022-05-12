<template>
   <div id="ticketedit">
       <!-- 添加一个富文本编辑界面 -->
       <div class="editor" v-if="isshoweditor1">
              <div class="qeditor">
                 <quill-editor
                    ref="myQuillEditor"
                    :options="editorOption"
                    v-model="list[edittype]"
                    class="ql-editor"
                />   
              </div>
              <el-button type="success" @click="isshoweditor">取消文本编辑</el-button>
       </div>
       <!-- 这部分是上面的图片部分 -->
       <!-- 删除图片功能已经完善，但图片上传功能还未实现 -->
       <div id="imgadmin">
            <!-- 在后面防止一个上传图片的按钮 -->
           <div id="upload">
                <el-upload
                    class="upload-demo"
                    action
                    :before-remove="beforeRemove"
                    :on-success="onSuccess"
                    :on-change="changeUpload"
                    :auto-upload="false"
                     multiple
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>

                <!-- 图片裁剪框 -->
                <!-- vueCropper 剪裁图片实现-->
                <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
                    <div class="cropper-content">
                        <div class="cropper" style="text-align:center">
                        <vueCropper 
                            ref="cropper" 
                            :img="option.img" 
                            :outputSize="option.size" 
                            :outputType="option.outputType"
                            :info="true" 
                            :full="option.full" 
                            :canMove="option.canMove" 
                            :canMoveBox="option.canMoveBox"
                            :original="option.original" 
                            :autoCrop="option.autoCrop" 
                            :fixed="option.fixed"
                            :fixedNumber="option.fixedNumber" 
                            :centerBox="option.centerBox" 
                            :infoTrue="option.infoTrue"
                            :fixedBox="option.fixedBox"></vueCropper>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="finish" >确认</el-button>
                    </div>
                </el-dialog>
           </div>  

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
       </div>
        
        <!-- 完善下面的表单部分 -->
       <div id="form">
           <!-- 这部分是上面的四个输入框 -->
           <!-- 数据已经和v-modle中的数据进行双向绑定 -->
           <div id="div1">
               <div id="title">
                   <span>标题:</span>
                     <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入标题"
                        v-model="list.title">
                    </el-input>
               </div>
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
                  <div id="introitemtop">
                      <span>产品介绍</span>
                      <el-button type="primary" @click="handleintroedit">编辑</el-button>
                  </div>
                  <div id="introcontent" v-html="list.exactintro">

                  </div>
            </div>

           <!-- 下面是预定需知部分 -->
            <div id="orderitem">
                   <div id="orderitemtop">
                      <span>产品介绍</span>
                      <el-button type="primary" @click="handleorderedit">编辑</el-button>
                  </div>
                  <div id="ordercontent" v-html="list.exactorder">

                  </div>
            </div>

            <!-- 下面是费用说明部分 -->
            <div id="costitem">
                <div id="costitemtop">
                      <span>产品介绍</span>
                      <el-button type="primary" @click="handlecostedit">编辑</el-button>
                  </div>
                  <div id="costcontent" v-html="list.exactcost">

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
import { getToken } from '@/utils/auth'
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

var takentemp=getToken();

export default {
    name: 'TicketEdit',
    // 注册富文本组件
    components: {
      quillEditor
    },
    data() {
        return {
            // 裁剪插件的相关数据
            // 控制裁剪框是否显示
                dialogVisible: false,
            // 裁剪框的相关配置
                option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 1, // 裁剪生成图片的质量
                outputType: 'jpeg', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                // autoCropWidth: 300, // 默认生成截图框宽度
                // autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: true, // 是否开启截图框宽高固定比例
                fixedNumber: [1270, 622], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: false, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },

            taken:{'token': takentemp},
            // 创建一个状态点击确定后触发的是增加函数，修改函数
            methstatus:``,
            // 创建一个变量控制富本编辑器与谁进行绑定
            edittype:"",
            // 创建一个变量控制是否显示文本编辑器
            isshoweditor1:false,
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


            // 修改页面中的选择状态框
           statusOptions: ['售罄','可购买'],
            list:{
                intro:"11",
                title:"",
                price: 11,
                limitprice: 11,
                timestamp:"2022-3-20 12:00:00",
                // 列表那边需要有的数据
                amount:0,
                status:"",
                // 下面的图片是从网上搜索的图片，获取后端数据后，直接替换就行
                imglist:[
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', ticketId:"",
                ticketPhotoId:"",name:"1"},
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', ticketId:"",
                ticketPhotoId:"",name:"2"},
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', ticketId:"",
                  ticketPhotoId:"",name:"3"},
                    {img:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', ticketId:"",
                  ticketPhotoId:"",name:"4"},
                ],
                exactintro:"",
                exactorder:"",       
                exactcost:"",                   
            },
            // 这个数据是上传文本框的数据
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
             {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
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
        // 裁剪框的相应回调函数
        // 上传按钮   限制图片大小
      changeUpload(file, fileList) {
        //   限定上传图片的类型
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(file.raw.name)) {
		alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
		return false
           }
        //  限定上传图片的大小
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
		this.$message.error('上传文件大小不能超过 5MB!')
		return false
        }
        var files = file.raw;
        this.fileinfo = file; // 保存下当前文件的一些基本信息
        let reader = new FileReader(); // 创建文件读取对象
        reader.onload = async e => {
            let data;
            if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result])); 
            } else {
            data = e.target.result;
            }
            console.log(data);
            this.option.img = data; // 设置option的初始image
            this.dialogVisible = true;
        };
        reader.readAsArrayBuffer(files);
     },
         // 点击裁剪，这一步是可以拿到处理后的地址
      finish() {
        this.$refs.cropper.getCropBlob((data) => {
          let formData = new FormData();
            formData.append(
            'file',data,"DX.jpg"
            );
         this.$axios({
            //action="http://2uah4e.natappfree.cc/ticket/upLoadPhoto"
            url: `http://qzdsgu.natappfree.cc/ticket/upLoadPhoto`,
            method: 'post',
            data: formData,
            headers:{
                'Content-Type': 'multipart/form-data',
                'token': takentemp
            }
          }).then( res  => {
              console.log(res);
            if (res.data.code === 2000) {
                res.data.data.forEach((item)=>{
                    let imgData={
                      ticketId:"",
                      ticketPhotoId:"",
                      img:item
                    }                  
                  this.list.imglist.push(imgData);
                })
                 this.dialogVisible = false
            } else {
            }
          })
        })
      },
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
        // 创建是否显示编辑页面的方法
        isshoweditor(){
              this.isshoweditor1=!this.isshoweditor1;
        },
        // 创建一个清空页面的函数
        resetlist(){
            this.list.title=``;
            this.list.intro=``;
            this.list.price=``;
            this.list.limitprice=``;
            this.list.timestamp=``;
            this.list.amount=``;
            this.list.status=``;
            this.list.imglist=[];
            this.list.exactintro="";
            this.list.exactorder="";
            this.list.exactcost="";
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        // 图片上传成功后，后台返回图片的路径
        onSuccess(res){
            console.log(res);
            if(res.code===2000){
                res.data.forEach((item)=>{
                    let imgData={
                      ticketId:"",
                      ticketPhotoId:"",
                      img:item
                    }                  
                  console.log(imgData);
                  this.list.imglist.push(imgData);
                })
            }else{

            }
        },

        // 产品详情的方法
        //  首先为产品编辑绑定一个回调函数
        handleintroedit(){
            // 首先将edittype修改为exactintro，然后显示文本编辑器
            this.edittype="exactintro";
            this.isshoweditor1=!this.isshoweditor1;
        },
        // 须知详情表单的方法
        //  首先为产品编辑绑定一个回调函数
        handleorderedit(){
            // 首先将edittype修改为exactintro，然后显示文本编辑器
            this.edittype="exactorder";
            this.isshoweditor1=!this.isshoweditor1;
        },
   
        // 费用说明的方法
         //  首先为产品编辑绑定一个回调函数
        handlecostedit(){
            // 首先将edittype修改为exactintro，然后显示文本编辑器
            this.edittype="exactcost";
            this.isshoweditor1=!this.isshoweditor1;
        },   

        // 为整个表单的确认按钮绑定一个回调函数，用来触发我们接受过来的createData函数
        // 接受方法好像不太性，那么就使用全局事件总线，促发busCreateData
        nativecreateData(){
            // 经状态字符串改为o-1
            //'售罄','可购买'
            if(this.list.status==="售罄"){
               this.list.status=0;
            }else{
                 this.list.status=1;
            }
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
  /* 截图 */
  .cropper {
    width: auto;
    height: 300px;
  }
/* 先调整整个页面的布局 */
#ticketedit{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* 调整富文本编辑页面的样式 */
#ticketedit .editor{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
}
#ticketedit .editor .qeditor{
    margin-top: 10px;
    margin-bottom: 20px;
}

#ticketedit .editor .qeditor .ql-editor{
  min-height: 500px;
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
#ticketedit #form #div1 #title{
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
}
#ticketedit #form #div1 #title span{
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
}

#ticketedit #form #introitem #introitemtop{
     width: 100%;
     height: 50px;
     padding: 0 20px;
     color:rgb(144, 147, 153);
     font-size: 15px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     border-bottom: 1px solid rgb(144, 147, 153);
}

#ticketedit #form #introitem  #introcontent{
    width:100%;
    color:rgb(96, 98, 102);
    min-height: 50px;
    font-size:14px;
    font-family:"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB";
}


/* 下面的是预定需知的样式*/
#ticketedit #form #orderitem{
    margin-top: 20px;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
}

#ticketedit #form #orderitem #orderitemtop{
     width: 100%;
     height: 50px;
     padding: 0 20px;
     color:rgb(144, 147, 153);
     font-size: 15px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     border-bottom: 1px solid rgb(144, 147, 153);
}

#ticketedit #form #orderitem  #ordercontent{
    width:100%;
    color:rgb(96, 98, 102);
    min-height: 50px;
    font-size:14px;
    font-family:"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB";
}
/* 下面的是费用说明的样式*/
#ticketedit #form #costitem{
    margin-top: 20px;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
}

#ticketedit #form #costitem #costitemtop{
     width: 100%;
     height: 50px;
     padding: 0 20px;
     color:rgb(144, 147, 153);
     font-size: 15px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     border-bottom: 1px solid rgb(144, 147, 153);
}

#ticketedit #form #costitem  #costcontent{
    width:100%;
    color:rgb(96, 98, 102);
    min-height: 50px;
    font-size:14px;
    font-family:"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB";
}

/* 下面两个按钮的样式 */
#ticketedit #form #footer{
    margin-top: 10px;
    margin-bottom: 30px;
    width: 90%; 
}

/* 富文本汉化样式 */
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>