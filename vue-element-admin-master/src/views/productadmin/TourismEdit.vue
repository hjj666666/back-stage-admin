<template>
  <div class="tourismedit">
    <div class="quillEditor" v-if="isShowquillEditor">
        <div>
            <quill-editor
            ref="myQuillEditor"
            :options="editorOption"
            v-model="uploadList[quillEditorType]"
        />
        <input type="file" @change="change" id="upload" style="display:none;" />
        </div>
        <br>
        <el-button type="primary" @click="quitEditor">保存并退出</el-button>
    </div>
    
    <el-button type="primary" plain @click="test">测试</el-button>
    <el-button type="primary" plain @click="isShowTravelEdit=!isShowTravelEdit">测试travaledit</el-button>
    <!-- 折叠编辑的部分 -->

    <div class="collapse-title-class box-class" title="图片上传" name="uploadPic">
        <div class="box-title-class">图片上传</div><hr>
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
                    :on-success="onSuccess"
                     action
                     :on-change="changeUpload"
                    :auto-upload="false"
                    :show-file-list="false"
                    :before-upload="beforePicUpload">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
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
    </div>
    
    <!-- 基础信息的输入 -->
    <div class="collapse-title-class box-class" title="基础信息" name="baseInf">
        <div class="box-title-class">基础信息</div><hr>
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
                <div class="uploadAmount upload">
                    <span class="span1">门票状态:</span>
                    <el-select v-model="uploadList.status" class="filter-item" placeholder="请选择一个状态">
                        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
                    </el-select>
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
                    <span class="beforeInput">房差:</span>
                    <el-input  placeholder="请输入房差"  v-model="uploadList.differPrice"></el-input>
                </div>
            </el-col>
        </el-row>
        <br>
        <!-- 添加四个新的属性 -->
            <el-row :gutter="20">
            <el-col :span="8">
                <div class="uploadIntro upload">
                    <span class="beforeInput">出发地:</span>
                    <el-tag
                        :key="tag"
                        v-for="tag in uploadList.departurePlace"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                        </el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="uploadDate upload">
                    <span class="beforeInput">成人价格:</span>
                    <el-input  v-model="uploadList.adultPrice" placeholder="请输入成人价格"></el-input>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="uploadAmount upload">
                    <span class="beforeInput">儿童价格:</span>
                    <el-input  placeholder="请输入儿童价格"  v-model="uploadList.childPrice"></el-input>
                </div>
            </el-col>
        </el-row>
    </div>

    <!-- 价格日历的编辑 -->
    <div class="collapse-title-class box-class" title="价格日历" name="datePrice">
        <div class="box-title-class">价格日历</div><hr>
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
    </div>

    <!-- 下面是产品亮点列表部分-->
    <div class="collapse-title-class box-class" title="产品亮点" name="features">
        <div class="box-title-class">产品亮点</div><hr>
        <div id="introitem" class="currencyBoder">
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
    </div>

    <div class="collapse-title-class box-class" title="图文详情" name="picAndText">
        <div class="box-title-class">图文详情
            <el-button type="primary" @click="enterEditor('imgAndText')">编辑</el-button>
        </div><hr>
        
        <div class="picAndText showHTML currencyBoder ql-editor" v-html="uploadList.imgAndText">
            
        </div>
    </div>

    <div class="collapse-title-class box-class" title="行程介绍" name="tourIntro">
        <div class="box-title-class">行程介绍
             <el-button @click="isShowTourListAdd = true" type="primary">增加</el-button>
        </div><hr>          
        <div class="tourList currencyBoder">
            <h4>行程列表</h4>
                <el-table
                :data="uploadList.tourList"
                border
                height="250"
                style="width: 100%">
                <el-table-column
                    label="序号"
                    width="50"
                    type="index">
                </el-table-column>
                <el-table-column
                    prop="focusPlace"
                    label="集合地点"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="focusTime"
                    label="集合时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="backPlace"
                    label="返回地点">
                </el-table-column>
                <el-table-column
                    prop="otherMeg"
                    label="其他">
                </el-table-column>
                <el-table-column
                    width="180"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleTourListDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-dialog title="行程增加" :visible.sync="isShowTourListAdd">
                <el-form>
                    <el-form-item label="集合地点" label-width="120px">
                    <el-input v-model="tourListAdd.focusPlace"></el-input>
                    </el-form-item>
                    <el-form-item label="集合时间" label-width="120px">
                    <el-date-picker v-model="tourListAdd.focusTime" type="datetime" placeholder="选择一个日期" />
                    </el-form-item>
                    <el-form-item label="返回地点" label-width="120px">
                    <el-input v-model="tourListAdd.backPlace"></el-input>
                    </el-form-item>
                    <el-form-item label="其他" label-width="120px">
                    <el-input v-model="tourListAdd.otherMeg"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="handleTourListAdd" type="primary">确定</el-button>
            </el-dialog>
        </div>
        <div class=" currencyBoder">
            <h4>沿途景点</h4>
            <!-- <el-tag
                style="margin-left:0.5em"
                :key="scenery"
                v-for="scenery in uploadList.sceneryList"
                closable
                :disable-transitions="false"
                @close="handleCloseOfScenery(scenery)">
                {{scenery}}
            </el-tag>
            <el-input
                style="width: 20em; margin-left: 10px; vertical-align: bottom;"
                v-if="isShowInputScenery"
                v-model="inputValueOfScenery"
                ref="saveSceneryInput"
                size="small"
                @keyup.enter.native="handleInputConfirmOfScenery"
                @blur="handleInputConfirmOfScenery">
            </el-input>
            <el-button 
                v-else 
                style="margin-left: 10px; height: 32px; line-height: 30px; padding-top: 0; padding-bottom: 0;" size="small" 
                @click="showInputOfScenery">
                增加沿途景点</el-button> -->

            <el-table
            :data="uploadList.sceneryList"
            style="width: 100%">
            <el-table-column
            label="序号"
            width="50"
            type="index">
            </el-table-column>

            <el-table-column
            label="沿途景点"
            prop="scenery">
            <template slot-scope="scope">
                <!-- <span v-if="scope.row.isshow"  v-html="scope.row.scenery"></span> -->
                <el-input v-model="scope.row"   :rows="1"></el-input>
                </template>   
            </el-table-column>
            
            <el-table-column
            align="right">
            <template slot="header">
                    <el-button type="primary"  @click="isShowSceneryAdd">增加</el-button>
            </template>
            <template slot-scope="scope">
                <el-button
                size="mini"
                v-if="scope.row.isshow"
                @click="handleSceneryEdit(scope.$index, scope.row)">编辑</el-button>

                <el-button
                size="mini"
                v-else
                @click=" handleSceneryEdit(scope.$index, scope.row)">确认</el-button>

                <el-button
                size="mini"
                type="danger"
                @click=" handleSceneryDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
            </el-table> 

            <div class="additem" v-if="isShowAddScenery">
                <el-input v-model="addSceneryTemp" 
                placeholder="请输入要添加的信息" 
                type="textarea" 
                :rows="2"
                style="width:80%"></el-input>
                <el-button type="primary" size="small" @click="handleSceneryAdd" style="margin:1em 1em">确认添加</el-button>
                <el-button type="danger" size="small" @click="isShowSceneryAdd">取消</el-button>
            </div>   
        </div>
    </div>

    <div class="collapse-title-class box-class" title="具体的行程介绍" name="exacttourIntro">
        <div class="box-title-class">具体的行程介绍
             <el-button @click="addExactTeavelEdit()" type="primary">增加</el-button>          
        </div><hr>          
        <div class="tourList currencyBoder">
            <h4>行程详情：</h4>
            <!-- 直接将列表中的数据使用v-for显示在下面 -->
            <div class="collapse-title-class-list">
                    <div class="traveledit"  v-for="(item,index) in uploadList.exactTourList" :key="index">
                    <!-- 先输入几个文本框控制其它数据的输入 -->
                    <div class="traveldiv1">
                        <!-- 这里是控制天数，起点，入住 -->
                        <div class="traveldiv2">
                            <div class="traveldiv4">
                                <span>第几天: </span>
                                <el-input placeholder="请输入第几天" v-model="item.nthdate"></el-input>
                            </div>
                            <div class="traveldiv4">
                                <span>起点: </span>
                                <el-input placeholder="请输入起点" v-model="item.startPlace"></el-input>
                            </div>
                            <div class="traveldiv4">
                                <span>终点: </span>
                                <el-input placeholder="请输入终点" v-model="item.endPlace"></el-input>
                            </div>
                            <div class="traveldiv4">
                                <span>入住: </span>
                                <el-input placeholder="请输入入住地点" v-model="item.hostel"></el-input>
                            </div>
                        </div>

                        <!-- 这里是控制早餐，午餐，晚餐 -->
                        <div class="traveldiv3">
                            <div class="traveldiv4">
                                <span>早餐: </span>
                                    <el-autocomplete
                                        class="inline-input"
                                        v-model="item.breakfast"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入早餐" 
                                        ></el-autocomplete>
                            </div>
                            <div class="traveldiv4">
                                <span>午餐: </span>
                                        <el-autocomplete
                                        class="inline-input"
                                        v-model="item.lunch"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入午餐" 
                                        ></el-autocomplete>
                            </div>
                            <div class="traveldiv4">
                                <span>晚餐: </span>
                                        <el-autocomplete
                                        class="inline-input"
                                        v-model="item.dinner"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入晚餐" 
                                        ></el-autocomplete>
                            </div>
                        </div> 
                    </div>

                    <!-- 这里是控制富文本控制具体的每一条数据 -->
                    <div class="traveldiv5">  
                        <div>
                        <quill-editor
                        ref="myQuillEditor"
                        :options="editorOption"
                        v-model="item.exactTravel"
                        />
                    </div>
                    </div>
                    <!-- 先编写一个按钮控制页面的显示 -->
                    <div class="lastdiv">
                        <el-button type="primary" @click="deleteExactTeavelEdit(index,item)">删除本数据</el-button>
                        <el-button @click="addExactTeavelEdit()" type="primary">增加数据</el-button>      
                    </div>
                </div>
            </div>
            <!-- 直接编辑页面显示到这里，不再另外开启一个编辑 -->
            <!-- 下面使新增数据的控制页面 -->
            <div class="collapse-title-class-div" v-if="isShowTravelEdit">
            <div>
                
            </div>
                <h4>增加数据：</h4>
                <div class="traveledit" >
                    <!-- 先输入几个文本框控制其它数据的输入 -->
                    <div class="traveldiv1">
                        <!-- 这里是控制天数，起点，入住 -->
                        <div class="traveldiv2">
                            <div class="traveldiv4">
                                <span>第几天: </span>
                                <el-input placeholder="请输入第几天" v-model="exactTravelTemp.nthdate"></el-input>
                            </div>
                            <div class="traveldiv4">
                                <span>起点: </span>
                                <el-input placeholder="请输入起点" v-model="exactTravelTemp.startPlace"></el-input>
                            </div>
                            <div class="traveldiv4">
                                <span>终点: </span>
                                <el-input placeholder="请输入终点" v-model="exactTravelTemp.endPlace"></el-input>
                            </div>
                            <div class="traveldiv4">
                                <span>入住: </span>
                                <el-input placeholder="请输入入住地点" v-model="exactTravelTemp.hostel"></el-input>
                            </div>
                        </div>

                        <!-- 这里是控制早餐，午餐，晚餐 -->
                        <div class="traveldiv3">
                            <div class="traveldiv4">
                                <span>早餐: </span>
                                        <el-autocomplete
                                        class="inline-input"
                                        v-model="exactTravelTemp.breakfast"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入早餐" 
                                        ></el-autocomplete>
                            </div>
                            <div class="traveldiv4">
                                <span>午餐: </span>
                                        <el-autocomplete
                                        class="inline-input"
                                        v-model="exactTravelTemp.lunch"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入午餐" 
                                        ></el-autocomplete>
                            </div>
                            <div class="traveldiv4">
                                <span>晚餐: </span>
                                        <el-autocomplete
                                        class="inline-input"
                                        v-model="exactTravelTemp.dinner"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入晚餐" 
                                        ></el-autocomplete>
                            </div>
                        </div> 
                    </div>

                    <!-- 这里是控制富文本控制具体的每一条数据 -->
                    <div class="traveldiv5">  
                        <div>
                        <quill-editor
                        ref="myQuillEditor"
                        :options="editorOption"
                        v-model="exactTravelTemp.exactTravel"
                        />
                    </div>
                    </div>
                    <!-- 先编写一个按钮控制页面的显示 -->
                    <div class="lastdiv">
                        <el-button type="primary" @click="isShowTravelEdit=!isShowTravelEdit">取消</el-button>
                        <el-button type="primary" @click="saveExactTeavelEdit">保存</el-button>
                    </div>
                </div>
            </div>
            <br>
        </div>
    </div>

    <div class="collapse-title-class box-class" title="费用说明" name="costIntro">
        <div class="box-title-class">费用说明
              <el-button type="primary" @click="enterEditor('costIntro')">编辑</el-button>
        </div><hr>
        <div class="picAndText showHTML currencyBoder ql-editor" v-html="uploadList.costIntro">

        </div>
    </div>

    <div class="picAndText showHTML currencyBoder  collapse-title-class  box-class  ql-editor" title="预订须知" name="bookNotice">
        <div class="box-title-class">预订须知
             <el-button type="primary" @click="enterEditor('bookNotice')">编辑</el-button>
        </div><hr>
        <div class="bookNotice showHTML currencyBoder" v-html="uploadList.bookNotice">

        </div>
    </div>

    <div class="bottomBtn">
        <el-button type="primary" @click="quitTourismEdit">保存</el-button><el-button type="danger" @click="quxiaoTourismEdit">取消编辑</el-button>
    </div>
  </div>
</template>

<script>
// 实现富文本基本引用
import '../../../node_modules/quill/dist/quill.core.css'
import '../../../node_modules/quill/dist/quill.snow.css'
import '../../../node_modules/quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { uploadImage } from "@/api/base";  //上传接口
import { container, ImageExtend } from 'quill-image-extend-module'
// 实现图片缩放编辑
import Quill from "quill";
Quill.register('modules/ImageExtend', ImageExtend)
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
    name: 'TourismEdit',
    components: {
      quillEditor
    },
    data() {
        return {
                      // 获取当前的盒子的滚动条的高度
             scrollTop:0,
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
                fixedNumber: [212, 132], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: false, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
            // 默认打开的折叠部分
            openList:['uploadPic','baseInf'],
            taken:{'token': takentemp},

            // 创建一个变量，保存可以选择的早餐
            meals:[
            {value:"自理"},
            {value:"肠粉"},
            {value:"面包"},
            {value:"白粥"},
          ],

           // 地点标签多需要的数据
            inputVisible: false,
            inputValue: '',

            // 创建一个变量保存目前行程详情编辑页面
            exactEditTravelType:"edit",
            // 创建一个变量保存编辑页面的状态
            methstatus:"",
            // 修改页面中的选择状态框
           statusOptions: ['售罄','可购买'],
            // 添加一条暂时的数据，用来保存行程详情里面的数据
            exactTravelTemp:{
                nthdate:1,
                startPlace:"广州",
                endPlace:"上海",
                exactTravel:"111",
                breakfast:"11",
                lunch:"111",
                dinner:"11",
                hostel:"111"
            },
            // 创建一个变量保存目前的编辑数据的index
            indexTemp:0,
            //输入的信息列表，到时直接提交这个玩意
            uploadList:{
                id:"",
                title:'',  //标题
                intro:'',  //简介
                amount:undefined,  //数量
                price: undefined,  //原价
                limitprice: undefined, //限时价格
                status: 1,
                departurePlace:[],
                adultPrice:999,
                childPrice:88,
                differPrice:88,

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
          
                //行程介绍   
                tourList:[],
                sceneryList:[],
                exactTourList:[
                    // {nthdate:1,startPlace:"广州",endPlace:"上海",exactTravel:"11",breakfast:"11",
                    // lunch:"111",dinner:"111",hostel:"111"
                    // },
                    // {nthdate:2,startPlace:"广州",endPlace:"上海",exactTravel:"222",breakfast:"22",
                    // lunch:"222",dinner:"",hostel:"222"
                    // },
                ],
               
                //费用说明
                costIntro:'',
                //预订须知
                bookNotice:'',
            },

            //这里存放开关某些v-if的临时状态
            datePriceVisible:false, //这是价格日历的对话框显示状态
            isShowAddFeatures:false,//显示产品亮点文本框的状态
            isShowquillEditor:false, //显示富文本编辑器的状态
            isShowTourListAdd:false, //显示行程介绍列表的状态
            isShowAddScenery:false, //显示行程沿途景点文本框的状态
            isShowTravelEdit:false,//是否显示行程的具体编辑页面

            //这里存放临时的值，基本上用完就不用的
            changeDate:'',     //选中的日期
            inputdatePrice:'', //选中日期的价格
            addFeaturesTemp:'', //产品亮点临时输入
            quillEditorType:'', //富文本编辑器正在编辑的类型
            tourListAdd:{focusPlace:'',focusTime:'',backPlace:'',otherMeg:''}, //行程介绍列表新添加的临时变量
            addSceneryTemp:'', //行程沿途景点临时输入

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
                    modules: ["Resize", "DisplaySize", "Toolbar"],
                    },
                    toolbar: {
                        container:toolbarOptions,
                        handlers: {
                    image: function(value) {
                        if (value) {
                        document.querySelector('#upload').click()  // 劫持原来的图片点击按钮事件
                        } else {
                        this.quill.format('image', false)
                        }
                    }
                    }
                    },
                     ImageExtend: {
                        loading: true,  // 可选参数 是否显示上传进度和提示语
                        name: 'img',  // 图片参数名
                        size: 3,  // 可选参数 图片大小，单位为M，1M = 1024kb
                        action: uploadImage,  // 服务器地址, 如果action为空，则采用base64插入图片
                        // response 为一个函数用来获取服务器返回的具体图片地址
                        // 例如服务器返回{code: 200; data:{ url: 'xxx.com'}}
                        // 则 return res.data.url
                        response: (res) => {
                            console.log(res);
                            return data.url
                        },
                        headers: (xhr) => {},  // 可选参数 设置请求头部
                        start: () => {},  // 可选参数 自定义开始上传触发事件
                        end: () => {},  // 可选参数 自定义上传结束触发的事件，无论成功或者失败
                        error: () => {},  // 可选参数 自定义网络错误触发的事件
                        change: (xhr, formData) => {} // 可选参数 选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
                    },
            },
           
            },
        }
    },
   activated(){
    //    根据路由传递过来的参数判断目前是编辑页面还是添加页面
    //    判断是否能接受到我们的create函数,可以输出,成功获取
    //console.log(this.$route.query.methstatus);
        // 一旦进入立马更新methstatus，方便后面判断是执行修改方法还是增加方法
    this.methstatus=this.$route.query.methstatus;
    // 如果methstatus==createdata，这经页面中的数据清空
    if(this.methstatus==="createdata"){
       // console.log("1111");
       this.resetAll();
    }
    // 对接受到的参数进行判断：如果this.$route.query.list!=undefined,则替换掉目前的list
    // 目前测试可行
    if(this.$route.query.list!=undefined){
        this.uploadList=this.$route.query.list;
    }

   },
    methods: {
            change(e) {
      let file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      uploadImage(formData)
        .then(res => {
          let quill = this.$refs.myQuillEditor.quill
          if (res.code === 2000) {
            //const formdata = _.extend({}, this.formdata)
            let length = quill.getSelection().index//光标位置
            // 插入图片  图片地址
            quill.insertEmbed(length, 'image', res.data)
            // 调整光标到最后
            quill.setSelection(length + 1)//光标后移一位
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
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
            url: `http://9iugn5.natappfree.cc/travel/upLoadPhoto`,
            method: 'post',
            data: formData,
            headers:{
                'Content-Type': 'multipart/form-data',
                'token': takentemp
            }
          }).then( res  => {
              console.log(res);
            if (res.data.code === 2000) {
                    let imgData={
                      url:res.data.data
                    }                  
                  this.uploadList.imglist.push(imgData);
                  this.dialogVisible = false
            } else {
            }
          })
        })
      },
        // 地点标签的相应方法
        handleClose(tag) {
         this.uploadList.departurePlace.splice(this.uploadList.departurePlace.indexOf(tag), 1);
      },
       
    //    早餐选择框的回调函数
        querySearch(queryString, cb) {
        var meals = this.meals;
        var results = queryString ? meals.filter(this.createFilter(queryString)) : meals;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (meal) => {
          return (meal.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.uploadList.departurePlace.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
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

    // 图片上传成功后，后台返回图片的路径
        onSuccess(res){
            console.log(res);
            if(res.code===2000){
                res.data.forEach((item)=>{
                    let imgData={
                      //ticketId:"",
                      //ticketPhotoId:"",
                      url:item
                    }                  
                  this.uploadList.imglist.push(imgData);
                })
            }else{

            }
        },


        //查看当前日期的价格（实在没有办法实现实时渲染了，丢人！所以这是一个委屈求全的方法）
        showDatePriceOfDialog(day){
            if(this.uploadList.priceCalendar.length>0)
            var obj=this.uploadList.priceCalendar.forEach(element => {
                 let timestamp = +new Date(day)//将时间字符串转化为时间撮
                 let timestamp2= +new Date(element.date)
                if( timestamp2=== timestamp){
                    this.$alert(day+"的价格为"+element.price, '查询价格', {
                        confirmButtonText: '关闭',
                    });
                }
            })
        },
        //修改当前日期的价格
        //点击修改价格并获取当前日期，让对话框显示
        changeDatePriceOfDialog(data){
            this.datePriceVisible = true
            this.changeDate=data.day

        },
        //确定函数
        changeDatePrice(){ 
            var pd=false;
            if(this.changeDate != '' && this.inputdatePrice != ''){
               pd=this.uploadList.priceCalendar.some((item,index)=>{
                if(item.date === this.changeDate){
                      let timestamp = +new Date(this.changeDate)//将时间字符串转化为时间撮
                    this.uploadList.priceCalendar.splice(index,1,{date:timestamp,price:this.inputdatePrice})
                }
                })
                if(pd===false){
                     let timestamp = +new Date(this.changeDate)//将时间字符串转化为时间撮
                     this.uploadList.priceCalendar.push({date:timestamp,price:this.inputdatePrice});
                }
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

        //行程介绍的函数
        //增加行程介绍列表的函数
        handleTourListAdd(){
            this.tourListAdd.focusTime= +new Date(this.tourListAdd.focusTime)
            this.uploadList.tourList.push(this.tourListAdd)
            this.tourListAdd={focusPlace:'',focusTime:'',backPlace:'',otherMeg:''}
            this.isShowTourListAdd=false
        },

        //删除行程介绍列表的函数
        handleTourListDelete(index, row){
            this.uploadList.tourList.splice(index,1);
        },

        //以下是沿途风景相关的函数（新的）
        isShowSceneryAdd(){
            this.isShowAddScenery=!this.isShowAddScenery;
        },
        handleSceneryAdd(){
            if(this.addSceneryTemp != ''){
                this.uploadList.sceneryList.push(this.addSceneryTemp);
                this.addSceneryTemp="";
                this.isShowAddScenery=false;
            }
            else{
                this.$message({
                    message: '数据不能为空',
                    type: 'warning'
                });
            }
        },
        handleSceneryEdit(index, row) {
            row.isshow=!row.isshow;
        },
        handleSceneryDelete(index, row) {
            this.uploadList.sceneryList.splice(index,1);
        },
        //以下是沿途风景相关的函数（旧的）
        // //展示沿途风景列表
        // showInputOfScenery() {
        // this.isShowInputScenery = true;
        // this.$nextTick(_ => {
        //   this.$refs.saveSceneryInput.$refs.input.focus();
        //     });
        // },

        // //新增沿途风景列表的方法
        // handleInputConfirmOfScenery() {
        // let inputValueOfScenery = this.inputValueOfScenery;
        // if (inputValueOfScenery) {
        //   this.uploadList.sceneryList.push(inputValueOfScenery);
        // }
        // this.isShowInputScenery = false;
        // this.inputValueOfScenery = '';
        // },

        // //这是删除沿途风景列表的方法
        // handleCloseOfScenery(Scenery) {
        //  this.uploadList.sceneryList.splice(this.uploadList.sceneryList.indexOf(Scenery), 1);
        // },

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
                // 并跳转到页面之前的高度
                window.scrollTo(0,this.scrollTop)
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
            
        },

        //进入文本编辑器
        enterEditor(type){
            // 获取当前的盒子的滚动条的高度
            this.scrollTop = document.querySelector('.tourismedit').scrollTop || window.pageYOffset || document.body.scrollTop;
            this.quillEditorType=type;
            this.isShowquillEditor=true;
            window.scrollTo(0,0)
        },

        // 保存并退出编辑页面
        // 并且需要在这里完成将数据发送到后端冰完成数据的更新
        quitTourismEdit(){
            this.$confirm('是否确定保存并退出', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                //首先判断当前页面的编辑状态时什么
                // 经状态字符串改为o-1
                //'售罄','可购买'
                if(this.uploadList.status==="售罄"){
                this.uploadList.status=0;
                }else{
                    this.uploadList.status=1;
                }
                if(this.methstatus==="createdata") {
                    // 首先触发事件总线中的busCreateTravelData
                    this.$bus.$emit("busCreateTravelData",this.uploadList);
                }else{
                    this.$bus.$emit("busUpdateTravelData",this.uploadList);
                }

                // 如果时编辑函数
               
                //返回原来的套餐列表
                this.$router.push({
                    path:"/productadmin/tourism-admin",
                });
                this.$message({
                    type: 'info',
                    message: '已保存'
                });  

                }).catch(() => {
                        
            }); 
        },

        // 为取消编辑绑定一个回调函数
        quxiaoTourismEdit(){
            //返回原来的套餐列表
            this.$router.push({
                 path:"/productadmin/tourism-admin",
            });
        },
        // 清空所有信息的函数
        resetAll(){
            this.uploadList.title=''  //标题
            this.uploadList.intro=''  //简介
            this.uploadList.amount=undefined  //数量
            this.uploadList.price= undefined  //原价
            this.uploadList.limitprice= undefined //限时价格
            this.uploadList.status=0
            this.uploadList.departurePlace=[],
            this.uploadList.adultPrice=undefined,
            this.uploadList.childPrice=undefined,
            this.uploadList.differPrice=undefined,
            //暂时的图片列表，到时运用函数获取后端的api
            this.uploadList.imglist=[
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'},
                {url:'https://my.wulvxinchen.cn/pictures/things/lighthouse.jpg'}
                ]
                            //对应的价格日历列表
            this.uploadList.priceCalendar=[
                ]

                //产品亮点列表
            this.uploadList.featuresList=[]

            //图文详情
            this.uploadList. imgAndText=''

            //行程介绍 
            this.uploadList. tourList=[]
            this.uploadList. sceneryList=[]
            this.uploadList. exactTourList=[]
                
            //费用说明
            this.uploadList.costIntro=''
            //预订须知
            this.uploadList.bookNotice=''
        },
        
        // 为编辑行程详情绑定一个回调函数
        handleExactTeavelEdit(index,list){
            // 首先要将编辑页面显示出来
            this.isShowTravelEdit=! this.isShowTravelEdit;
            this.exactEditTravelType="edit";
            // 其次需要在编辑页面中显示目前的数据
            // nthdate:1,
            // destination:"广州/上海",
            // exactTravel:"111",
            // breakfast:"11",
            // lunch:"111",
            // dinner:"11",
            // hostel:"111"
            this.exactTravelTemp.nthdate=this.uploadList.exactTourList[index].nthdate;
            this.exactTravelTemp.destination=this.uploadList.exactTourList[index].destination;
            this.exactTravelTemp.exactTravel=this.uploadList.exactTourList[index].exactTravel;
            this.exactTravelTemp.breakfast=this.uploadList.exactTourList[index].breakfast;
            this.exactTravelTemp.lunch=this.uploadList.exactTourList[index].lunch;
            this.exactTravelTemp.dinner=this.uploadList.exactTourList[index].dinner;
            this.exactTravelTemp.hostel=this.uploadList.exactTourList[index].hostel;
            // 保存当前编辑的数据
            this.indexTemp=index;
        }, 
         // 为编辑行程详情绑定一个回调函数
        saveExactTeavelEdit(){
            // 其次需要在编辑页面中显示目前的数据
            // nthdate:1,
            // destination:"广州/上海",
            // exactTravel:"111",
            // breakfast:"11",
            // lunch:"111",
            // dinner:"11",
            // hostel:"111"
            if(this.exactEditTravelType==="edit"){
                this.uploadList.exactTourList[this.indexTemp].nthdate=this.exactTravelTemp.nthdate;
                this.uploadList.exactTourList[this.indexTemp].destination=this.exactTravelTemp.destination;
                this.uploadList.exactTourList[this.indexTemp].exactTravel=this.exactTravelTemp.exactTravel;
                this.uploadList.exactTourList[this.indexTemp].breakfast=this.exactTravelTemp.breakfast;
                this.uploadList.exactTourList[this.indexTemp].lunch= this.exactTravelTemp.lunch;
                this.uploadList.exactTourList[this.indexTemp].dinner= this.exactTravelTemp.dinner;
                this.uploadList.exactTourList[this.indexTemp].hostel=this.exactTravelTemp.hostel;
            }
            if(this.exactEditTravelType==="add"){
                 const temp = Object.assign({}, this.exactTravelTemp)
                this.uploadList.exactTourList.push(temp);
            }  
            // 首先要将编辑页面显示出来
            this.isShowTravelEdit=! this.isShowTravelEdit;
        }, 
        // 为增加一个具体行程详情添加一个回调函数
        addExactTeavelEdit(){
            // 首先要将编辑页面显示出来
            this.isShowTravelEdit=! this.isShowTravelEdit;
            // 先将编辑页面清空
            this.exactTravelTemp.nthdate="";
            this.exactTravelTemp.startPlace="";
            this.exactTravelTemp.endPlace="";
            this.exactTravelTemp.exactTravel="";
            this.exactTravelTemp.breakfast="";
            this.exactTravelTemp.lunch="";
            this.exactTravelTemp.dinner="";
            this.exactTravelTemp.hostel="";
            this.exactEditTravelType="add";
        },
        // 为删除具体行程绑定一个回调函数
        deleteExactTeavelEdit(index,temp){
             this.uploadList.exactTourList.splice(index,1)
        },
        //测试函数
        test(){
            console.log(this.uploadList)       
        },
    }
}
</script>

<style>
/* 设置裁剪框样式 */
  .cropper-content .cropper{
      width: auto;
      height: 300px;
   }

    /* 整个组件的样式 */
    .tourismedit{
        background-color: #f0f2f5;
    }

    /* 块的样式 */
    .box-class{
        width:95%;
        margin: 2em auto;
        padding: 1em;
        background-color: #ffffff;
    }
    /* 块标题的样式 */
    .box-title-class{
        font-size: 1.5em;
        padding-right: 20px;
        font-weight: 600;
        color: #ff6d6d;
        display: flex;
        justify-content: space-between;
    }

    /* 标签输入框的样式 */
    .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
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
        margin: 1em;
        margin-top: 1.8em;
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
        font-size: 0.8em;
        width: 5em;
        background-color: #75baff;
        padding:0.3em 0.5em 0.3em;
        border-radius: 6px;
    }
    /* 富文本编辑后展示的区域的样式 */
    .tourismedit .collapse-title-class .showHTML{

    }
    /* 底部的两个按钮样式 */
    .tourismedit .bottomBtn{
        margin: 1em;
        text-align: center; 
    }

    /* 行程介绍的行程列表的样式 */
    .tourismedit .tourList{

    }

    /* 通用的边框样式 */
    .tourismedit .currencyBoder{
        margin: 0.5em;
        /* border: 2px solid #6d6d6da8; */
        padding: 0.5em;
    }
  /* 具体行程列表的样式 */
    .tourismedit   .collapse-title-class-list{
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

     .tourismedit .currencyBoder .collapse-title-class-list .traveledit{
       width: 100%;
       height: 100%;
       background-color:white;
       /* 控制布局 */
       display: flex;
       flex-direction: column;
       align-items: center;
       padding-bottom: 20px;
       border-bottom: 1px solid gray;
   }

    .tourismedit .currencyBoder .collapse-title-class-list .traveledit .traveldiv1{
       width: 90%;
       height: 200px;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: space-around;
   }

    .tourismedit .currencyBoder .collapse-title-class-list .traveledit .traveldiv1 .traveldiv2{
       width: 100%;
       display: flex;
       justify-content: space-between;
       align-items: center;
   }
      .tourismedit .currencyBoder .collapse-title-class-list .traveledit .traveldiv1 .traveldiv3{
       width: 100%;
       display: flex;
       justify-content: space-between;
       align-items: center;
   }
   /* 调整里面小的div的样式 */
       .tourismedit .currencyBoder .collapse-title-class-list .traveledit .traveldiv1  .traveldiv4{
       display: flex;
       justify-content: space-around;
       align-items: center;
    }

    .tourismedit .currencyBoder .collapse-title-class-list .traveledit .traveldiv1  .traveldiv4 span{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100px;
     }

     /* 调整富文本的样式 */
    .tourismedit .currencyBoder .collapse-title-class-list .traveledit .traveldiv5{
          width: 90%;         
     }
    .tourismedit .currencyBoder .collapse-title-class-list .traveledit .traveldiv5 .ql-container{
          height: 300px;
    }
    
    .tourismedit .lastdiv{
        width: 50%;
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

  /* 下面使具体行程的编程的样式 */
    .tourismedit .currencyBoder .collapse-title-class-div{
        width: 100%;
       /* 控制布局 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .tourismedit .currencyBoder .collapse-title-class-div .traveledit{
       width: 100%;
       height: 100%;
       background-color:white;
       /* 控制布局 */
       display: flex;
       flex-direction: column;
       align-items: center;
   }

    .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv1{
       width: 90%;
       height: 200px;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: space-around;
   }

    .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv1 .traveldiv2{
       width: 100%;
       display: flex;
       justify-content: space-between;
       align-items: center;
   }
      .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv1 .traveldiv3{
       width: 100%;
       display: flex;
       justify-content: space-between;
       align-items: center;
   }
   /* 调整里面小的div的样式 */
       .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv1  .traveldiv4{
       display: flex;
       justify-content: space-around;
       align-items: center;
    }

    .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv1  .traveldiv4 span{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100px;
     }

      .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv1  .traveldiv4  .el-autocomplete{
          z-index: 3;
      }
     

     /* 调整富文本的样式 */
    .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv5{
          width: 90%;
          
     }
    .tourismedit .currencyBoder .collapse-title-class-div .traveledit .traveldiv5 .ql-container{
          height: 300px;
    }

    .tourismedit .lastdiv{
        width: 50%;
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        align-items: center;
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