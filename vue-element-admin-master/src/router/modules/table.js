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
      path: 'inline-edit-table',
      component: () => import('@/views/productadmin/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/productadmin/tourism-admin'),
      name: 'ComplexTable',
      meta: { title: '旅游套餐管理' }
    }
  ]
}
export default tableRouter
