/**
 * "我为饭圈儿送酒"动态发布页
 */
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

export default function RunnerMomentPage() {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleChooseImage = () => {
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

  const handleSubmit = async () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      // 模拟发布动态
      await new Promise(resolve => setTimeout(resolve, 1000))
      Taro.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch {
      Taro.showToast({ title: '发布失败', icon: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 内容输入区 */}
      <View className="bg-white p-4">
        <Textarea
          className="w-full min-h-32 p-2 bg-gray-50 rounded-lg text-base"
          placeholder="分享你的送酒故事..."
          value={content}
          onInput={(e) => setContent(e.detail.value)}
          maxlength={500}
        />
        <View className="flex justify-end mt-2">
          <Text className="text-gray-400 text-sm">{content.length}/500</Text>
        </View>
      </View>

      {/* 图片选择 */}
      <View className="bg-white mt-3 p-4">
        <Text className="text-gray-600 mb-3 block">添加图片</Text>
        <View className="grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <View key={index} className="relative">
              <Image 
                className="w-16 h-16 rounded-lg"
                src={img}
                mode="aspectFill"
              />
              <View 
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                onClick={() => handleRemoveImage(index)}
              >
                <Text className="text-white text-xs">×</Text>
              </View>
            </View>
          ))}
          {images.length < 9 && (
            <View 
              className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
              onClick={handleChooseImage}
            >
              <Text className="text-2xl text-gray-400">+</Text>
            </View>
          )}
        </View>
      </View>

      {/* 提示 */}
      <View className="p-4">
        <Text className="text-gray-400 text-sm">
          提示：发布动态可获得积分奖励，优质内容将被精选展示
        </Text>
      </View>

      {/* 底部发布按钮 */}
      <View className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
        <View 
          className={`text-center py-3 rounded-lg font-medium ${
            submitting ? 'bg-gray-300' : 'bg-blue-500 active:bg-blue-600'
          }`}
          onClick={submitting ? undefined : handleSubmit}
        >
          <Text className="text-white">{submitting ? '发布中...' : '发布动态'}</Text>
        </View>
      </View>
    </View>
  )
}
