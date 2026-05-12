import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { RefreshCw } from 'lucide-react-taro'
import { ORGAN_LORDS } from '@/data/organLords'
import './organ-lord-detail.scss'

// 产品到器官大人的映射
const PRODUCT_ORGAN_LORD_MAP: Record<string, { lordId: string; tip: string }> = {
  '桃你欢心': { lordId: 'pi-generals', tip: '桃子甘温养脾，一杯桃酒暖胃安神' },
  '楂香四溢': { lordId: 'kidney-sage', tip: '山楂消食化积，佐酒一杯肾气自充' },
  '大吉大梨': { lordId: 'lung-prime', tip: '秋燥伤肺，来杯梨酒润一润' },
  '似水榴年': { lordId: 'heart-monarch', tip: '石榴养心安神，一杯入喉心自宁' },
  '葡写浪漫': { lordId: 'liver-strategist', tip: '葡萄入肝经，微醺一杯肝气舒' },
}

interface OrganLordDetailProps {
  productName: string
}

export function OrganLordDetail({ productName }: OrganLordDetailProps) {
  const mapping = PRODUCT_ORGAN_LORD_MAP[productName]

  if (!mapping) return null

  const lord = ORGAN_LORDS.find(l => l.id === mapping.lordId)
  if (!lord) return null

  const handleRefresh = () => {
    Taro.showToast({ title: '即将上线', icon: 'none' })
  }

  return (
    <View className="organ-lord-detail" style={{ borderColor: lord.color }}>
      {/* 标题栏 */}
      <View className="detail-header">
        <Text className="detail-title">🏛️ 器官大人说养生</Text>
        <View className="detail-lord-name" style={{ color: lord.color }}>
          <Text>—— {lord.name}</Text>
        </View>
      </View>

      {/* 内容区 */}
      <View className="detail-content">
        {/* 左侧角色图 */}
        <View className="detail-avatar-wrap" style={{ borderColor: lord.color }}>
          <View className="detail-avatar" style={{ backgroundColor: lord.bgColor }}>
            <Text style={{ fontSize: '48rpx' }}>{lord.emoji}</Text>
          </View>
        </View>

        {/* 右侧文案 */}
        <View className="detail-text">
          <Text className="detail-tip">{mapping.tip}</Text>
        </View>
      </View>

      {/* 换一张按钮 */}
      <View className="detail-footer" onClick={handleRefresh}>
        <RefreshCw size={14} color="#F59E0B" />
        <Text className="refresh-text">换一张</Text>
      </View>
    </View>
  )
}
