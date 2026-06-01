export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '选择宿舍地址' })
  : { navigationBarTitleText: '选择宿舍地址' }
