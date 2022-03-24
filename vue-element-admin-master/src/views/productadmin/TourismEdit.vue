<template>
  <div class="tourismedit">
    <!-- 折叠编辑的部分 -->
    <el-collapse v-model="openList">
        <el-collapse-item title="图片上传" name="uploadPic">
                <!-- 展示已经上传的图片，在后端获取图片数据 -->
                <div class="showPic">
                    <div class="showPic-item" v-for="(item,index) in imglist" :key="index">
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
        </el-collapse-item>

        <el-collapse-item title="" name="">

        </el-collapse-item>

        <el-collapse-item title="" name="">

        </el-collapse-item>

        <el-collapse-item title="" name="">

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

            //输入的信息列表，到时直接提交这个玩意
            uploadList:{
                intro:'',
                endTime:'',
                amount:'',
            },

            //暂时的图片列表，到时运用函数获取后端的api
            imglist:[
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'}
            ],

            
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
             this.imglist.splice(index,1);
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
        }



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

    上传输入框的样式
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