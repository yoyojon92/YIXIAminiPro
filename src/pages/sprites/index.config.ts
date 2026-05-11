export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '精灵图鉴' })
  : { navigationBarTitleText: '精灵图鉴' }
