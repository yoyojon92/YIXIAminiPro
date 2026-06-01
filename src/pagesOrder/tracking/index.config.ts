export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '物流追踪' })
  : { navigationBarTitleText: '物流追踪' }
