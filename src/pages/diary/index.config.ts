export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '每日日记' })
  : { navigationBarTitleText: '每日日记' }
