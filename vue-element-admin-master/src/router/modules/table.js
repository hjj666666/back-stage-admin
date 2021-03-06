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
      meta: { title: '旅游管理' }
    },
    {
      path: 'ticket-admin',
      component: () => import('@/views/productadmin/ticket-admin'),
      name: 'TicketAdmin',
      meta: { title: '门票管理', noCache: false}
    },
    {
      path: 'table-ck',
      hidden: true,
      component: () => import('@/views/productadmin/table-ck'),
      name: 'TableCk',
      meta: { title: '参考模版' }
    },
    {
      path: 'tableedit',
      hidden: true,
      component: () => import('@/views/productadmin/TicketEdit'),
      name: 'TicketEdit',
      meta: { title: '门票编辑'}
    },
    {
      path: 'tableedit01',
      hidden: true,
      component: () => import('@/views/productadmin/TicketEdit01'),
      name: 'TicketEdit01',
      meta: { title: '门票编辑01'}
    },
    {
      path: 'tourismEdit',
      component: () => import('@/views/productadmin/TourismEdit'),
      name: 'TourismEdit',
      hidden: true,
      meta: { title: '旅游产品编辑'}
    }
  ]
}
export default tableRouter
