import todo from '../views/todo/todo.vue'
import login from '../views/login.vue'
export default [
  {
    path: '/',
    redirect: '/todo'
  },
  {
    path: '/login',
    component: login,
    name: 'login',
    meta: {
      title: '登录页',
      description: "这是一个登录页"
    },
    children: [
      {
        path: '/test',
        component: login,
      }
    ]
  },
  {
    path: '/todo',
    name: 'todo',
    component: () => import('../views/todo/todo.vue')
  },
  {
    path: '/todo/exact',
    component: todo
  }
]
