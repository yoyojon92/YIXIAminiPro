export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '跑腿员中心' })
  : { navigationBarTitleText: '跑腿员中心' }
