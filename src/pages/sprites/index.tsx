import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Star, Gift, Sparkles, Lock, LockOpen
} from 'lucide-react-taro'

interface Sprite {
  id: number
  name: string
  level: string
  levelName: string
  image: string
  fragmentCount: number
  collected: boolean
  fragmentOwned: number
  rarity: number
  story: string
}

const allSprites: Sprite[] = [
  { id: 1, name: '蜜桃精灵·小蜜', level: 'N', levelName: '普通', image: 'https://picsum.photos/200/200?random=101', fragmentCount: 3, collected: true, fragmentOwned: 0, rarity: 1, story: '来自桃花源的小蜜，喜欢在微风中翩翩起舞。' },
  { id: 2, name: '青梅精灵·小青', level: 'N', levelName: '普通', image: 'https://picsum.photos/200/200?random=102', fragmentCount: 3, collected: true, fragmentOwned: 0, rarity: 1, story: '守护青梅林的精灵，性格沉稳可靠。' },
  { id: 3, name: '蓝莓精灵·小紫', level: 'R', levelName: '稀有', image: 'https://picsum.photos/200/200?random=103', fragmentCount: 5, collected: true, fragmentOwned: 0, rarity: 2, story: '来自星空深处的神秘精灵，掌握时间的奥秘。' },
  { id: 4, name: '柠檬精灵·小柠', level: 'R', levelName: '稀有', image: 'https://picsum.photos/200/200?random=104', fragmentCount: 5, collected: false, fragmentOwned: 2, rarity: 2, story: '阳光开朗的精灵，给人们带来满满活力。' },
  { id: 5, name: '草莓精灵·小莓', level: 'R', levelName: '稀有', image: 'https://picsum.photos/200/200?random=105', fragmentCount: 5, collected: false, fragmentOwned: 0, rarity: 2, story: '甜蜜可爱的精灵，代表着幸福的滋味。' },
  { id: 6, name: '葡萄精灵·小葡', level: 'SR', levelName: '超稀有', image: 'https://picsum.photos/200/200?random=106', fragmentCount: 8, collected: false, fragmentOwned: 5, rarity: 3, story: '高贵优雅的精灵，沉醉于美好的梦境。' },
  { id: 7, name: '月光精灵·月儿', level: 'SSR', levelName: '超级稀有', image: 'https://picsum.photos/200/200?random=107', fragmentCount: 12, collected: false, fragmentOwned: 0, rarity: 4, story: '掌控月光的神秘精灵，只在满月之夜现身。' },
  { id: 8, name: '星辰公主', level: 'UR', levelName: '传说', image: 'https://picsum.photos/200/200?random=108', fragmentCount: 20, collected: false, fragmentOwned: 0, rarity: 5, story: '传说中的精灵王，守护着整个精灵世界的神秘存在。' }
]

const exchangeRewards = [
  { id: 1, name: '精灵限定徽章套装', price: 3, type: 'SSR×1', image: 'https://picsum.photos/200/200?random=201', stock: 50 },
  { id: 2, name: '精灵主题帆布包', price: 5, type: 'SR×2', image: 'https://picsum.photos/200/200?random=202', stock: 30 },
  { id: 3, name: '精灵限定果酒礼盒', price: 8, type: 'R×4', image: 'https://picsum.photos/200/200?random=203', stock: 20 }
]

const levelColors: Record<string, string> = {
  'N': 'bg-gray-400',
  'R': 'bg-blue-500',
  'SR': 'bg-purple-500',
  'SSR': 'bg-amber-500',
  'UR': 'bg-gradient-to-r from-purple-500 to-pink-500'
}

export default function Sprites() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedSprite, setSelectedSprite] = useState<Sprite | null>(null)

  const collectedCount = allSprites.filter(s => s.collected).length
  const totalCount = allSprites.length
  const progress = Math.round((collectedCount / totalCount) * 100)

  const fragmentStats = allSprites.reduce((acc, sprite) => {
    if (!sprite.collected) {
      acc[sprite.id] = sprite.fragmentOwned
    }
    return acc
  }, {} as Record<number, number>)

  const filteredSprites = allSprites.filter(sprite => {
    if (activeTab === 'all') return true
    if (activeTab === 'collected') return sprite.collected
    if (activeTab === 'fragment') return !sprite.collected && sprite.fragmentOwned > 0
    if (activeTab === 'uncollected') return !sprite.collected && sprite.fragmentOwned === 0
    return true
  })

  const getSpriteStars = (rarity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < rarity ? 'text-amber-400' : 'text-gray-300'}
        fill={i < rarity ? '#FBBF24' : '#D1D5DB'}
      />
    ))
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 收集进度 */}
      <View className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-6">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-white text-lg font-bold">精灵图鉴</Text>
          <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0">
            {collectedCount}/{totalCount}
          </Badge>
        </View>

        <View className="bg-white rounded-xl p-4">
          <View className="flex items-center justify-between mb-2">
            <Text className="text-sm text-gray-600">收集进度</Text>
            <Text className="text-sm font-bold text-purple-600">{progress}%</Text>
          </View>
          <Progress value={progress} className="h-2" />
          
          <View className="flex justify-between mt-3 text-xs">
            <View className="flex items-center gap-1">
              <View className="w-3 h-3 rounded-full bg-green-500" />
              <Text className="text-gray-600">已集齐 {collectedCount}</Text>
            </View>
            <View className="flex items-center gap-1">
              <View className="w-3 h-3 rounded-full bg-amber-500" />
              <Text className="text-gray-600">碎片中 {allSprites.filter(s => !s.collected && s.fragmentOwned > 0).length}</Text>
            </View>
            <View className="flex items-center gap-1">
              <View className="w-3 h-3 rounded-full bg-gray-300" />
              <Text className="text-gray-600">未发现 {allSprites.filter(s => !s.collected && s.fragmentOwned === 0).length}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 我的碎片 */}
      <View className="px-4 py-4 bg-white mt-2">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-sm font-medium text-gray-900">我的碎片</Text>
          <View className="flex items-center gap-1 text-sm text-gray-500">
            <Sparkles size={14} className="text-amber-500" />
            <Text>共 {Object.values(fragmentStats).reduce((a, b) => a + b, 0)} 片</Text>
          </View>
        </View>
        <ScrollView scrollX showScrollbar={false}>
          <View className="flex gap-3">
            {allSprites.filter(s => !s.collected).slice(0, 6).map((sprite) => (
              <View key={sprite.id} className="flex flex-col items-center">
                <View className="relative">
                  <Image src={sprite.image} mode="aspectFill" className="w-14 h-14 rounded-full opacity-60" />
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">{sprite.fragmentOwned}</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-500 mt-1">{sprite.name.split('·')[1]}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 筛选标签 */}
      <View className="px-4 py-3 bg-white mt-2">
        <ScrollView scrollX showScrollbar={false}>
          <View className="flex gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'collected', label: '已集齐' },
              { key: 'fragment', label: '碎片中' },
              { key: 'uncollected', label: '未发现' }
            ].map((tab) => (
              <View
                key={tab.key}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Text>{tab.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 精灵列表 */}
      <View className="px-4 py-4">
        <View className="grid grid-cols-2 gap-3">
          {filteredSprites.map((sprite) => (
            <Card 
              key={sprite.id} 
              className={`overflow-hidden ${!sprite.collected && sprite.fragmentOwned === 0 ? 'opacity-60' : ''}`}
              onClick={() => setSelectedSprite(sprite)}
            >
              <View className="relative">
                <Image 
                  src={sprite.image} 
                  mode="aspectFill" 
                  className={`w-full h-32 ${!sprite.collected ? 'grayscale' : ''}`} 
                />
                <View className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white font-bold ${levelColors[sprite.level]}`}>
                  {sprite.level}
                </View>
                {sprite.collected ? (
                  <View className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <LockOpen size={12} color="white" />
                  </View>
                ) : (
                  <View className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <Lock size={12} color="white" />
                  </View>
                )}
              </View>
              <CardContent className="p-3">
                <Text className="text-sm font-medium text-gray-900 line-clamp-1">{sprite.name}</Text>
                <View className="flex items-center gap-1 mt-1">
                  {getSpriteStars(sprite.rarity)}
                </View>
                
                {!sprite.collected && (
                  <View className="mt-2">
                    <View className="flex items-center justify-between text-xs mb-1">
                      <Text className="text-gray-500">碎片</Text>
                      <Text className="text-amber-500">{sprite.fragmentOwned}/{sprite.fragmentCount}</Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <View 
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${(sprite.fragmentOwned / sprite.fragmentCount) * 100}%` }}
                      />
                    </View>
                  </View>
                )}
                
                {sprite.collected && (
                  <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-600 border-0">
                    已集齐
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* 兑换中心 */}
      <View className="px-4 pb-6">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <Gift size={18} className="text-primary" />
            <Text className="text-sm font-medium text-gray-900">兑换中心</Text>
          </View>
        </View>
        
        <Card>
          <CardContent className="p-4">
            {exchangeRewards.map((reward, index) => (
              <View key={reward.id}>
                <View className="flex gap-3">
                  <Image src={reward.image} mode="aspectSquare" className="w-20 h-20 rounded-lg" />
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900">{reward.name}</Text>
                    <Text className="text-xs text-gray-500 mt-1">需要: {reward.type}</Text>
                    <View className="flex items-center justify-between mt-2">
                      <Badge variant="destructive" className="text-xs">
                        剩余 {reward.stock}
                      </Badge>
                      <Button size="sm" disabled>
                        <Text className="text-xs">立即兑换</Text>
                      </Button>
                    </View>
                  </View>
                </View>
                {index < exchangeRewards.length - 1 && <Separator className="my-3" />}
              </View>
            ))}
          </CardContent>
        </Card>
      </View>

      {/* 精灵详情弹窗 */}
      {selectedSprite && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50" onClick={() => setSelectedSprite(null)}>
          <View 
            className="w-full bg-white rounded-t-3xl p-6 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <View className="flex gap-4">
              <Image src={selectedSprite.image} mode="aspectFill" className="w-24 h-24 rounded-xl" />
              <View className="flex-1">
                <View className="flex items-center gap-2">
                  <Text className="text-lg font-bold text-gray-900">{selectedSprite.name}</Text>
                  <Badge className={`${levelColors[selectedSprite.level]} text-white border-0`}>
                    {selectedSprite.levelName}
                  </Badge>
                </View>
                <View className="flex items-center gap-1 mt-1">
                  {getSpriteStars(selectedSprite.rarity)}
                </View>
                <Text className="text-sm text-gray-600 mt-2">{selectedSprite.story}</Text>
              </View>
            </View>
            
            {!selectedSprite.collected && (
              <View className="mt-4 bg-purple-50 rounded-xl p-4">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">收集进度</Text>
                  <Text className="text-sm font-bold text-purple-600">
                    {selectedSprite.fragmentOwned}/{selectedSprite.fragmentCount} 碎片
                  </Text>
                </View>
                <Progress value={(selectedSprite.fragmentOwned / selectedSprite.fragmentCount) * 100} className="h-2" />
                <Text className="text-xs text-gray-500 mt-2">
                  还需 {selectedSprite.fragmentCount - selectedSprite.fragmentOwned} 片即可合成
                </Text>
              </View>
            )}
            
            {selectedSprite.collected && (
              <View className="mt-4 bg-green-50 rounded-xl p-4 flex items-center gap-3">
                <View className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <LockOpen size={20} color="white" />
                </View>
                <View>
                  <Text className="text-sm font-medium text-green-700">已集齐</Text>
                  <Text className="text-xs text-green-600">可兑换限定周边</Text>
                </View>
              </View>
            )}
            
            <View className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedSprite(null)}>
                <Text>关闭</Text>
              </Button>
              {!selectedSprite.collected && selectedSprite.fragmentOwned >= selectedSprite.fragmentCount && (
                <Button className="flex-1" onClick={() => {}}>
                  <Sparkles size={16} className="mr-1" />
                  <Text>立即合成</Text>
                </Button>
              )}
              {!selectedSprite.collected && selectedSprite.fragmentOwned < selectedSprite.fragmentCount && (
                <Button className="flex-1" onClick={() => router.switchTab({ url: '/pages/index/index' })}>
                  <Text>去购买收集</Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
