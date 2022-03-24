<template>
  <div class="tourismedit">
    <!-- 折叠编辑的部分 -->
    <el-collapse v-model="openList">
        <el-collapse-item title="图片上传" name="uploadPic">
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
        <el-collapse-item title="基础信息" name="baseInf">
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
                        <span class="beforeInput">剩余数量:</span>
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
                                        <el-input v-model="inputCreateNewOptions" placeholder="请输入自定义类型" @blur="createNewOptions" maxlength="4" style="width:12em;margin-right:1em"></el-input>
                                        <el-button type="primary" plain @click="createNewOptions">确认</el-button>
                                    </template>
                                    
                                </span>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
        </el-collapse-item>

        <!-- 价格日历的编辑 -->
        <el-collapse-item title="价格日历" name="datePrice">
            <el-calendar>
                <template
                    slot="dateCell"
                    slot-scope="{data}">
                    <p>
                    {{ data.day.split('-').slice(1).join('-') }}
                    </p>
                    <div @click="changeDatePriceOfDialog(data)" style="background-color: #75baff">
                        修改价格
                    </div>
                </template>
            </el-calendar>
            <el-button type="primary" plain @click="test">测试</el-button>
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

        <el-collapse-item title="产品亮点" name="">

        </el-collapse-item>

        <el-collapse-item title="图文详情" name="">

        </el-collapse-item>

        <el-collapse-item title="行程介绍" name="">

        </el-collapse-item>

        <el-collapse-item title="费用说明" name="">

        </el-collapse-item>

        <el-collapse-item title="预订须知" name="">

        </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 默认打开的折叠部分
            openList:['uploadPic','baseInf'],

            //可以选择的套餐类型
            typeOptions:["美食","约游","玩好","乐享","纯味"],

            //输入的信息列表，到时直接提交这个玩意
            uploadList:{
                intro:'',
                endTime:'',
                amount:'',
                price: '',
                limitprice: '',
                options:'',

                //暂时的图片列表，到时运用函数获取后端的api
                imglist:[
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'}
                ],

                //对应的价格日历列表
                priceCalendar:[
                ]
            },

            //这里存放开关某些v-if的临时状态
            ifCreateNewOptions:true, //这个是套餐类型的新增类型的切换状态
            datePriceVisible:false, //这是价格日历的对话框显示状态

            //这里存放临时的值，基本上用完就不用的
            inputCreateNewOptions:'',  //这个是管理员写的新增的类型
            changeDate:'',     //选中的日期
            inputdatePrice:'', //选中日期的价格

            
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

        //测试函数
        test(date,data){
            console.log(this.uploadList.priceCalendar)
        },
    },
}
</script>

<style>
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

</style>