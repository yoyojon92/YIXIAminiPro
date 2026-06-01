export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '优惠券' })
  : { navigationBarTitleText: '优惠券' }
