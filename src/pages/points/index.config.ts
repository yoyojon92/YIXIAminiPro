export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的积分' })
  : { navigationBarTitleText: '我的积分' }
