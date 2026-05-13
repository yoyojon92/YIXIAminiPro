export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '推送通知' })
  : { navigationBarTitleText: '推送通知' }
