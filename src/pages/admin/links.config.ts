export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '外部链接管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    })
  : {
      navigationBarTitleText: '外部链接管理',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    }
