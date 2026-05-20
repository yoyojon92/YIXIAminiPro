export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '支付方式' })
  : { navigationBarTitleText: '支付方式' }
