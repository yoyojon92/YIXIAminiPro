export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '社群活动' })
  : { navigationBarTitleText: '社群活动' }
