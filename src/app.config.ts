export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/profile/index',
    'pages/product/index',
    'pages/orders/index',
    'pages/sprites/index',
    'pages/wall/index',
    'pages/wall/publish/index',
    'pages/activity/index',
    'pages/diary/index',
    'pages/article/index',
    'pages/coupons/index',
    'pages/stats/index',
    'pages/notifications/index',
    'pages/profile/user-profile/index',
    'pages/dashboard/index',
    'pages/pickup/index',
    'pages/dormitory/index',
    'pages/runner/home',
    'pages/runner/register',
    'pages/runner-list/index',
    'pages/runner-detail/index',
    'pages/runner-moment/index',
    'pages/shipping-address/index',
    'pages/shipping/index',
    'pages/tracking/index',
    'pages/runner-center/index',
    'pages/payment/index',
    'pages/points/index',
    'pages/recharge/index',
    'pages/withdraw/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B5CF6',
    navigationBarTitleText: '邑夏',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#8B5CF6',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: './assets/tabbar/category.png',
        selectedIconPath: './assets/tabbar/category-active.png'
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车',
        iconPath: './assets/tabbar/shopping-cart.png',
        selectedIconPath: './assets/tabbar/shopping-cart-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
