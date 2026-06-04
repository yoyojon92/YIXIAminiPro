export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/profile/index',
    'pages/product/index',
  ],
  subPackages: [
    {
      root: 'pagesOrder',
      pages: [
        'orders/index',
        'order/success',
        'payment/index',
        'shipping-address/index',
        'shipping/index',
        'tracking/index',
        'pickup/index',
        'dormitory/index',
        'redeem/index',
        'callDelivery/index',
      ],
    },
    {
      root: 'pagesDealer',
      pages: [
        'dealer/index',
        'agent/index',
      ],
    },
    {
      root: 'pagesMember',
      pages: [
        'membership/index',
        'points/index',
        'recharge/index',
        'withdraw/index',
        'coupons/index',
        'profile/index',
      ],
    },
    {
      root: 'pagesSocial',
      pages: [
        'wall/index',
        'wall/publish/index',
        'activity/index',
        'diary/index',
        'article/index',
        'notifications/index',
        'profile/user-profile/index',
      ],
    },
    {
      root: 'pagesAdmin',
      pages: [
        'admin/index',
        'admin/products',
        'admin/counselor',
        'admin/activity',
        'admin/ip-manage',
        'admin/user-profile',
        'admin/links',
      ],
    },
    {
      root: 'pagesExtra',
      pages: [
        'dashboard/index',
        'stats/index',
      ],
    },
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
