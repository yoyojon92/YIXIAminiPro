export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '余额提现' })
  : { navigationBarTitleText: '余额提现' }
