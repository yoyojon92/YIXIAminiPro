export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: 'IP管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    })
  : {
      navigationBarTitleText: 'IP管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    }
