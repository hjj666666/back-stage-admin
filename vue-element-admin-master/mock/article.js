// 引入mock.js,mock其实是一个插件
const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

// 使用循环构建出假的数据
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',//得到随机的id对象
    timestamp: +Mock.Random.date('T'),//生成随机事件撮
    author: '@first', //随机名字
    reviewer: '@first',
    title: '@title(5, 10)',//5个到10个的字符串长度
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)', //随机浮点数
    importance: '@integer(1, 3)',//一到随机整数
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],//status等于数组中的随机一个字符串
    display_time: '@datetime',//生成一个随机的事件
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',//生成300-500的一个随机整数
    image_uri,
    platforms: ['a-platform']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      // 经总数据根据返送过来的参数进行过滤，通过filter函数返回满足条件的数据
      // 这里的筛选参数就是指的是我们表格上面的参数
      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      // 控制返回的数据是正序还是逆序
      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      // 控制返回的对应页面的对应数据
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  // 创建数据的请求
  // 但是实际上时没有创建任何的数据，只是返回了一个成功的状态吗
  // 删除数据是在前端进行删除
  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

