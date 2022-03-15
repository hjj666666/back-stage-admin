/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/productadmin',
  component: Layout,
  redirect: '/productadmin/complex-table',
  name: 'ProductAdmin',
  meta: {
    title: '产品管理',
    icon: 'table'
  },
  children: [
    {
      path: 'tourism-admin',
      component: () => import('@/views/productadmin/tourism-admin'),
      name: 'TourismAdmin',
      meta: { title: '旅游套餐管理' }
    },
    {
      path: 'ticket-admin',
      component: () => import('@/views/productadmin/ticket-admin'),
      name: 'TicketAdmin',
      meta: { title: '门票管理' }
    },
    {
      path: 'table-ck',
      component: () => import('@/views/productadmin/table-ck'),
      name: 'TableCk',
      meta: { title: '参考模版' }
    }
  ]
}
export default tableRouter
