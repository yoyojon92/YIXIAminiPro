export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的画像' })
  : { navigationBarTitleText: '我的画像' }
