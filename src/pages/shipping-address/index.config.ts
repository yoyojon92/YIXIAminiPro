export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '填写收货地址' })
  : { navigationBarTitleText: '填写收货地址' }
