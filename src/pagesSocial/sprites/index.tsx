import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ArrowLeft } from 'lucide-react-taro'
import './index.scss'

// 精灵数据：包含图片、名称、描述、对应产品ID
const SPRITES_DATA = [
  {
    id: 'sprite_xinxin',
    name: '欣欣',
    title: '石榴精灵',
    description: '"红宝石般的果实，蕴含着四季的阳光。我是石榴精灵欣欣，每一滴酒都是生命的馈赠。愿与你分享这份红彤彤的喜悦。"',
    image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@9556998/src/assets/images/spirits/liuliu.jpg',
    productId: 'prod_pomegranate_new',
    productName: '榴红心事',
    color: '#FF6347',
  },
  {
    id: 'sprite_feifei',
    name: '霏霏',
    title: '苹果精灵',
    description: '"清甜爽口的苹果，滋润心田。我是苹果精灵霏霏，愿你的每一天都清新美好，清肺润喉~"',
    image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@9556998/src/assets/images/spirits/lili.jpg',
    productId: 'prod_apple_wine',
    productName: '清苹微醉',
    color: '#98FB98',
  },
  {
    id: 'sprite_fanhong',
    name: '番红',
    title: '番石榴精灵',
    description: '"热带红宝石般的番石榴，蕴含着阳光的热情。我是番石榴精灵番红，愿你的生活如热带阳光般热情洋溢~"',
    image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@9556998/src/assets/images/spirits/zhazha.jpg',
    productId: 'prod_guava_wine',
    productName: '番红暗许',
    color: '#DC143C',
  },
]

export default function SpritesPage() {
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
