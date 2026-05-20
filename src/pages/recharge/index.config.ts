export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '充值卡管理' })
  : { navigationBarTitleText: '充值卡管理' }
