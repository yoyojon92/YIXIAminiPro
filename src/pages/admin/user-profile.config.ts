export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '消费者画像',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    })
  : {
      navigationBarTitleText: '消费者画像',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#7c3aed'
    }
