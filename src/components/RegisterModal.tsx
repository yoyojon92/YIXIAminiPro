import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Image, Picker } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { X, Camera } from 'lucide-react-taro'
import { useUserProfileStore } from '@/store/userProfileStore'

interface RegisterModalProps {
  visible: boolean
  onClose: () => void
}

const COLLEGES = [
  '农学院', '园艺学院', '植物医学院', '动物科技学院', '机电工程学院',
  '建筑工程学院', '资源与环境学院', '食品科学与工程学院', '生命科学学院',
  '管理学院', '经济学院', '人文社会科学学院', '外国语学院', '理学与信息科学学院',
  '艺术学院', '动漫与传媒学院', '园林与林学院', '动物医学院', '海洋科学与工程学院',
  '草业学院', '齐鲁学堂', '国际教育学院', '巴瑟斯未来农业科技学院', '特拉华学院'
]

export function RegisterModal({ visible, onClose }: RegisterModalProps) {
  const { nickname: storeNickname, school: storeSchool, college: storeCollege, age: storeAge, avatar: storeAvatar, updateNickname, updateSchool, setUserInfo } = useUserProfileStore()
  
  const [nickname, setNickname] = useState(storeNickname || '')
  const [school, setSchool] = useState(storeSchool || '')
  const [college, setCollege] = useState(storeCollege || '')
  const [age, setAge] = useState(storeAge?.toString() || '')
  const [avatar, setAvatar] = useState(storeAvatar || '')
  const [step, setStep] = useState(1)

  if (!visible) return null

  const handleSubmit = () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    if (!school) {
      Taro.showToast({ title: '请选择学校', icon: 'none' })
      return
    }
    if (!college) {
      Taro.showToast({ title: '请选择学院', icon: 'none' })
      return
    }
    if (!age || parseInt(age) < 1 || parseInt(age) > 100) {
      Taro.showToast({ title: '请输入正确年龄', icon: 'none' })
      return
    }

    updateNickname(nickname.trim())
    updateSchool(school, college)
    setUserInfo({
      nickname: nickname.trim(),
      school,
      college,
      age: parseInt(age),
      avatar
    })
    
    Taro.showToast({ title: '注册成功', icon: 'success' })
    onClose()
  }

  const handlePickAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setAvatar(res.tempFilePaths[0])
      }
    })
  }

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <View className="bg-white rounded-2xl w-11/12 max-w-md overflow-hidden">
        {/* 头部 */}
        <View className="relative bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
          <Text className="text-xl font-bold text-white text-center">完善个人信息</Text>
          <View className="absolute right-4 top-4" onClick={onClose}>
            <X size={20} color="#fff" />
          </View>
        </View>

        {/* 步骤指示器 */}
        <View className="flex justify-center py-4 gap-2">
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </View>
          ))}
        </View>

        {/* 内容 */}
        <View className="px-6 pb-6">
          {/* 步骤1: 基本信息 */}
          {step === 1 && (
            <View>
              <Text className="text-gray-700 text-sm mb-2">上传头像（选填）</Text>
              <View className="flex justify-center mb-4">
                <View
                  className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
                  onClick={handlePickAvatar}
                >
                  {avatar ? (
                    <Image src={avatar} className="w-full h-full object-cover" mode="aspectFill" />
                  ) : (
                    <Camera size={32} color="#9ca3af" />
                  )}
                </View>
              </View>

              <Text className="text-gray-700 text-sm mb-2">昵称（必填）</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <Input
                  placeholder="请输入昵称"
                  value={nickname}
                  onInput={(e) => setNickname(e.detail.value)}
                  maxlength={20}
                />
              </View>

              <Button className="w-full" onClick={() => setStep(2)}>
                下一步
              </Button>
            </View>
          )}

          {/* 步骤2: 学校信息 */}
          {step === 2 && (
            <View>
              <Text className="text-gray-700 text-sm mb-2">选择学校（必填）</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <Picker
                  mode="selector"
                  range={['青岛农业大学']}
                  onChange={(_e) => {
                    setSchool('青岛农业大学')
                  }}
                >
                  <View className="py-2">
                    <Text className={school ? 'text-gray-800' : 'text-gray-400'}>
                      {school || '请选择学校'}
                    </Text>
                  </View>
                </Picker>
              </View>

              <Text className="text-gray-700 text-sm mb-2">选择学院（必填）</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <Picker
                  mode="selector"
                  range={COLLEGES}
                  onChange={(e) => {
                    setCollege(COLLEGES[e.detail.value])
                  }}
                >
                  <View className="py-2">
                    <Text className={college ? 'text-gray-800' : 'text-gray-400'}>
                      {college || '请选择学院'}
                    </Text>
                  </View>
                </Picker>
              </View>

              <View className="flex gap-3">
                <View className="flex-1">
                  <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                    上一步
                  </Button>
                </View>
                <View className="flex-1">
                  <Button className="w-full" onClick={() => setStep(3)}>
                    下一步
                  </Button>
                </View>
              </View>
            </View>
          )}

          {/* 步骤3: 年龄信息 */}
          {step === 3 && (
            <View>
              <Text className="text-gray-700 text-sm mb-2">年龄（必填）</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <Input
                  type="number"
                  placeholder="请输入年龄"
                  value={age}
                  onInput={(e) => setAge(e.detail.value)}
                  maxlength={3}
                />
              </View>

              <View className="bg-amber-50 rounded-xl px-4 py-3 mb-4">
                <Text className="text-amber-700 text-sm">
                  重要提示：购买果酒类产品需年满18周岁
                </Text>
              </View>

              <View className="flex gap-3">
                <View className="flex-1">
                  <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
                    上一步
                  </Button>
                </View>
                <View className="flex-1">
                  <Button className="w-full" onClick={handleSubmit}>
                    完成注册
                  </Button>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
