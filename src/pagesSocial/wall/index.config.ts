export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '创意墙' })
  : { navigationBarTitleText: '创意墙' }
