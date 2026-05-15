import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react-taro'
import './index.scss'

// 精灵数据：包含图片、名称、描述、对应产品ID
const SPRITES_DATA = [
  {
    id: 'sprite_taoyao',
    name: '桃夭',
    title: '桃花精灵',
    description: '"桃花灼灼，宜室宜家。我是桃花精灵桃夭，每一滴桃酒都承载着春日的浪漫。愿你的人生如桃花般绚烂芬芳~"',
    image: '/assets/images/spirits/taoyao.jpg',
    productId: 'prod_peach_001',
    productName: '桃你欢心',
    color: '#FFB6C1',
  },
  {
    id: 'sprite_zhazha',
    name: '楂楂',
    title: '山楂精灵',
    description: '"红宝石般的山楂，蕴含着酸甜的滋味。我是山楂精灵楂楂，愿你的生活如山楂酒般酸甜可口~"',
    image: '/assets/images/spirits/zhazha.jpg',
    productId: 'prod_hawthorn_001',
    productName: '楂香四溢',
    color: '#DC143C',
  },
  {
    id: 'sprite_lili',
    name: '梨梨',
    title: '梨子精灵',
    description: '"清甜爽口的梨汁，滋润心田。我是梨子精灵梨梨，愿你的每一天都清新美好~"',
    image: '/assets/images/spirits/lili.jpg',
    productId: 'prod_pear_001',
    productName: '大吉大梨',
    color: '#98FB98',
  },
  {
    id: 'sprite_liuliu',
    name: '榴榴',
    title: '石榴精灵',
    description: '"红宝石般的果实，蕴含着四季的阳光。我是石榴精灵榴榴，每一滴酒都是生命的馈赠。愿与你分享这份红彤彤的喜悦。"',
    image: '/assets/images/spirits/liuliu.jpg',
    productId: 'prod_pomegranate_001',
    productName: '似水榴年',
    color: '#FF6347',
  },
  {
    id: 'sprite_pupu',
    name: '葡葡',
    title: '葡萄精灵',
    description: '"紫水晶般的葡萄，凝结了阳光的温度。我是葡萄精灵葡葡，每一瓶酒都是我对美好生活的诠释。愿与你共享这份紫色的浪漫。"',
    image: '/assets/images/spirits/pupu.jpg',
    productId: 'prod_grape_001',
    productName: '葡写浪漫',
    color: '#8B008B',
  },
]

export default function SpritesPage() {
  const [selectedSprite, setSelectedSprite] = useState<typeof SPRITES_DATA[0] | null>(null)

  // 点击精灵跳转到产品详情页
  const handleSpriteClick = (sprite: typeof SPRITES_DATA[0]) => {
    Taro.navigateTo({
      url: `/pages/product/index?id=${sprite.productId}`,
    })
  }

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className="sprites-page">
      {/* 顶部导航栏 */}
      <View className="navbar">
        <View className="navbar-back" onClick={handleBack}>
          <ArrowLeft size={20} color="#fff" />
        </View>
        <Text className="navbar-title">邑夏精灵</Text>
        <View className="navbar-placeholder" />
      </View>

      {/* 页面标题区域 */}
      <View className="header">
        <Text className="header-title">探索邑夏精灵世界</Text>
        <Text className="header-desc">每一款美酒背后，都有一位守护精灵</Text>
      </View>

      {/* 精灵网格 */}
      <View className="sprites-grid">
        {SPRITES_DATA.map(sprite => (
          <View
            key={sprite.id}
            className="sprite-card"
            onClick={() => handleSpriteClick(sprite)}
          >
            <View className="sprite-image-wrapper">
              <Image
                className="sprite-image"
                src={sprite.image}
                mode="aspectFill"
              />
            </View>
            <View className="sprite-info">
              <Text className="sprite-title">{sprite.title}</Text>
              <Text className="sprite-name">{sprite.name}</Text>
              <Text className="sprite-product">对应产品：{sprite.productName}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 底部说明 */}
      <View className="footer">
        <Text className="footer-text">点击精灵查看对应产品详情</Text>
      </View>
    </View>
  )
}
