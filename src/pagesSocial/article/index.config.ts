export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '软文详情' })
  : { navigationBarTitleText: '软文详情' }
