export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '管理控制中心',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    })
  : {
      navigationBarTitleText: '管理控制中心',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    }
