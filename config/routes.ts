export default [
  {
    path: '/',
    component: '@/wrappers/BaseLayout',
    routes: [
      {
        path: '/',
        redirect: '/home',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '首页',
        path: '/home',
        component: './index',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '权限演示',
        path: '/docs',
        component: './docs',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: ' CRUD 示例',
        path: '/table',
        component: './ComplexTable',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '工作台',
        path: '/dashboard',
        component: null,
        routes: [
          {
            name: '工作台',
            path: 'workplace',
            component: 'features/dashboard/workbench'
          }
        ]
      },
      {
        name: '系统管理',
        path: '/system',
        component: null,
        routes: [
          {
            name: '用户管理',
            path: 'user',
            component: 'features/system/pages/user'
          },
          {
            name: '菜单管理',
            path: 'role',
            component: 'features/system/pages/menu'
          },
          {
            name: '角色管理',
            path: 'role',
            component: 'features/system/pages/role'
          },
          {
            name: '字典管理',
            path: 'dictionary',
            component: '/features/system/pages/dictionary'
          }
        ]
      },
      {
        name: ' 页面丢失',
        path: '/*',
        component: './404'
      }
    ]
  },
  { path: '/login', component: 'Login', exact: true, layout: false }
];
