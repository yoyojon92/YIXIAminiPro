export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '线下活动管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    })
  : {
      navigationBarTitleText: '线下活动管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    }
