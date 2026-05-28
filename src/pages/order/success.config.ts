export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '下单成功',
      navigationBarBackgroundColor: '#0f172a',
      navigationBarTextStyle: 'white'
    })
  : {
      navigationBarTitleText: '下单成功',
      navigationBarBackgroundColor: '#0f172a',
      navigationBarTextStyle: 'white'
    }
