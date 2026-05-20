export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '发货管理',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black',
    })
  : {
      navigationBarTitleText: '发货管理',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black',
    }
