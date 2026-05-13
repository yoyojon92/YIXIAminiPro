export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '选择自提点' })
  : { navigationBarTitleText: '选择自提点' }
