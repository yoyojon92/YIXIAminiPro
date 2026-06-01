export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '发布作品' })
  : { navigationBarTitleText: '发布作品' }
