import request from '@/utils/request'
// 通用上传请求
export function uploadImage(file) {
    return request({
        url: `http://9iugn5.natappfree.cc/travel/upLoadPhoto`,
        method: 'post',
        data: file
    })
}
