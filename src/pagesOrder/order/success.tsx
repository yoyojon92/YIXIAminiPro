import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { CircleCheck, House, FileText } from 'lucide-react-taro'

export default function OrderSuccess() {
  const params = Taro.getCurrentInstance().router?.params || {}
  const orderNo = params.orderNo || ''
  const amount = params.amount || '0'

  return (
    <View className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      {/* 成功图标 */}
      <View className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
        <CircleCheck size={48} color="#fff" />
      </View>
      
      {/* 成功文案 */}
      <Text className="text-2xl font-bold text-white mb-2">下单成功</Text>
      <Text className="text-slate-400 text-sm mb-1">订单号：{orderNo}</Text>
      <Text className="text-violet-400 text-xl font-bold mb-2">¥{amount}</Text>
      <Text className="text-slate-500 text-xs mb-8">（测试版模拟支付，无需真实付款）</Text>
      
      {/* 操作按钮 */}
      <View className="flex gap-4 w-full max-w-sm">
        <Button 
          variant="outline"
          className="flex-1 border-slate-600"
          onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
        >
          <House size={18} color="#fff" className="mr-2" />
          <Text className="text-white">回到首页</Text>
        </Button>
        <Button 
          className="flex-1 bg-violet-600"
          onClick={() => Taro.redirectTo({ url: '/pagesOrder/orders/index' })}
        >
          <FileText size={18} color="#fff" className="mr-2" />
          <Text className="text-white">查看订单</Text>
        </Button>
      </View>
    </View>
  )
}
