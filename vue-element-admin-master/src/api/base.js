import request from '@/utils/request'
// 通用上传请求
export function uploadImage(file) {
    return request({
        url: `http://nwx4it.natappfree.cc/travel/upLoadPhoto`,
        method: 'post',
        data: file
    })
}
