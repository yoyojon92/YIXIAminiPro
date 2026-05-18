export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '选择送酒员' })
  : { navigationBarTitleText: '选择送酒员' }
