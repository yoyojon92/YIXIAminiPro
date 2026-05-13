import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUGCStore } from '@/store/ugcStore'
import { useMemberStore } from '@/store/memberStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { trackProfileAction } from '@/store/profileStore'
import { ArrowLeft, ImagePlus, X } from 'lucide-react-taro'

const PRODUCT_OPTIONS = [
  { id: 'prod_peach_001', name: '🍑 桃你欢心' },
  { id: 'prod_hawthorn_001', name: '🍒 楂香四溢' },
  { id: 'prod_pear_001', name: '🍐 大吉大梨' },
  { id: 'prod_pomegranate_001', name: '🍎 似水榴年' },
  { id: 'prod_grape_001', name: '🍇 葡写浪漫' },
]

const TAGS = [
  '#期末庆祝', '#精灵陪伴', '#微醺时刻', '#宿舍聚会',
  '#送礼佳品', '#生日派对', '#好友小聚', '#独处时光',
  '#新品体验', '#低度酒推荐', '#包装精美', '#口感满分'
]

export default function Publish() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { submitWork, publishCount } = useUGCStore()
  const { memberLevel } = useMemberStore()
  const profileStore = useUserProfileStore()

  const maxPublish = memberLevel === 'annual' ? 10 : 5
  const remainingPublish = maxPublish - publishCount

  const handleChooseImage = () => {
    if (images.length >= 9) {
      Taro.showToast({ title: '最多上传9张图片', icon: 'none' })
      return
    }
    Taro.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths])
      }
    })
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    } else {
      Taro.showToast({ title: '最多选择5个标签', icon: 'none' })
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入作品标题', icon: 'none' })
      return
    }
    if (title.length > 30) {
      Taro.showToast({ title: '标题最多30个字', icon: 'none' })
      return
    }
    if (description.length > 200) {
      Taro.showToast({ title: '描述最多200个字', icon: 'none' })
      return
    }
    if (images.length === 0) {
      Taro.showToast({ title: '请至少上传1张图片', icon: 'none' })
      return
    }

    setIsSubmitting(true)

    const productName = PRODUCT_OPTIONS.find(p => p.id === selectedProduct)?.name.replace(/^[^\s]+\s/, '') || ''

    submitWork({
      title: title.trim(),
      description: description.trim(),
      image: images[0],
      author: '我',
      productId: selectedProduct,
      productName,
      tags: selectedTags,
      type: 'member',
    })

    // 埋点记录投稿
    trackProfileAction('ugc_publish', { 
      productId: selectedProduct, 
      productName,
      tags: selectedTags 
    })
    profileStore.recordUGCWork(selectedProduct)

    setTimeout(() => {
      setIsSubmitting(false)
      Taro.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }, 500)
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
        <View className="flex items-center gap-3" onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={20} color="#333" />
          <Text className="text-base font-medium text-gray-900">发布作品</Text>
        </View>
        <View className="flex items-center gap-2">
          <Text className="text-xs text-gray-500">
            本月剩余 {remainingPublish}/{maxPublish} 篇
          </Text>
        </View>
      </View>

      <ScrollView scrollY className="h-[calc(100vh-120px)]">
        {/* 作品标题 */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">作品标题 *</Text>
          <View className="bg-gray-50 rounded-xl px-4 py-3">
            <Input
              className="w-full text-base"
              placeholder="给你的作品起个名字..."
              maxlength={30}
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>
          <Text className="text-xs text-gray-400 text-right mt-1">{title.length}/30</Text>
        </View>

        {/* 作品描述 */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">作品描述</Text>
          <View className="bg-gray-50 rounded-xl px-4 py-3">
            <Textarea
              className="w-full text-base"
              placeholder="分享你的创作故事..."
              maxlength={200}
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              style={{ minHeight: '80px' }}
            />
          </View>
          <Text className="text-xs text-gray-400 text-right mt-1">{description.length}/200</Text>
        </View>

        {/* 图片上传 */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">作品图片 *（最多9张）</Text>
          <View className="flex flex-wrap gap-2">
            {images.map((img, index) => (
              <View key={index} className="relative w-24 h-24">
                <Image
                  src={img}
                  mode="aspectFill"
                  className="w-full h-full rounded-xl"
                />
                <View
                  className="absolute top-1 right-1 w-5 h-5 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X size={12} color="#fff" />
                </View>
                {index === 0 && (
                  <View className="absolute bottom-1 left-1 px-1 py-1 bg-purple-500 rounded text-white text-xs">
                    封面
                  </View>
                )}
              </View>
            ))}
            {images.length < 9 && (
              <View
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center"
                onClick={handleChooseImage}
              >
                <ImagePlus size={24} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 mt-1">添加图片</Text>
              </View>
            )}
          </View>
        </View>

        {/* 关联产品 */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">关联产品（选填）</Text>
          <View className="flex flex-wrap gap-2">
            {PRODUCT_OPTIONS.map((product) => (
              <View
                key={product.id}
                className={`px-3 py-2 rounded-full text-sm ${
                  selectedProduct === product.id
                    ? 'bg-purple-100 text-purple-600 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
                onClick={() => setSelectedProduct(selectedProduct === product.id ? '' : product.id)}
              >
                <Text>{product.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 标签选择 */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">标签（选择1-5个）</Text>
          <View className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <View
                key={tag}
                className={`px-3 py-2 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-100 text-purple-600 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 投稿规则 */}
        <View className="px-4 py-4 mb-20">
          <View className="bg-amber-50 rounded-xl p-4">
            <Text className="text-sm font-medium text-amber-700 mb-2">投稿规则</Text>
            <View className="flex flex-col gap-1">
              <Text className="text-xs text-amber-600">• 会员每月最多投稿{maxPublish}篇</Text>
              <Text className="text-xs text-amber-600">• 图片请勿包含水印、二维码</Text>
              <Text className="text-xs text-amber-600">• 内容需与果酒/精灵相关</Text>
              <Text className="text-xs text-amber-600">• 禁止上传违规、侵权内容</Text>
              <Text className="text-xs text-amber-600">• 优质作品有机会获得官方推荐</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部发布按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 border-t border-gray-100 pb-safe">
        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Text className="text-white font-medium">
            {isSubmitting ? '发布中...' : '发布作品'}
          </Text>
        </Button>
      </View>
    </View>
  )
}
