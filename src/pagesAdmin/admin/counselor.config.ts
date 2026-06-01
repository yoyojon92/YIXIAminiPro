export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '辅导员管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    })
  : {
      navigationBarTitleText: '辅导员管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    }
