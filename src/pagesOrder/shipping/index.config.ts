export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '发货管理',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'white',
    })
  : {
      navigationBarTitleText: '发货管理',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'white',
    }
