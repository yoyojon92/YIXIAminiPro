export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '产品管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    })
  : {
      navigationBarTitleText: '产品管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    }
