import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { ageVerify } from '@/utils/ageVerify'
import { useRunnerStore } from '@/store/runnerStore'
import { User, Phone, GraduationCap, CreditCard, CircleCheck, ArrowLeft } from 'lucide-react-taro'
import "./register.config"

const SCHOOLS = [
  '青岛农业大学',
  '青岛大学',
  '山东大学（青岛）',
  '青岛科技大学',
  '青岛理工大学'
]

export default function RunnerRegister() {
  const runnerStore = useRunnerStore()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    school: '',
    studentId: '',
    ageVerified: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 输入处理
  const handleInput = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  // 验证手机号
  const validatePhone = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  // 年龄验证
  const handleAgeVerify = async () => {
    const verified = await ageVerify()
    if (verified) {
      setForm({ ...form, ageVerified: true })
      Taro.showToast({ title: "验证通过", icon: "success" })
    }
  }

  // 提交注册
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = '请输入姓名'
    }
    if (!form.phone.trim()) {
      newErrors.phone = '请输入手机号'
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = '手机号格式不正确'
    }
    if (!form.school) {
      newErrors.school = '请选择学校'
    }
    if (!form.studentId.trim()) {
      newErrors.studentId = '请输入学生证号'
    }
    if (!form.ageVerified) {
      newErrors.ageVerified = '请先完成年龄验证'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 注册跑腿员
    runnerStore.register({
      name: form.name.trim(),
      phone: form.phone.trim(),
      school: form.school,
      studentId: form.studentId.trim()
    })

    // 埋点
    console.log("[埋点] 跑腿员注册", {
      userId: "user_001",
      name: form.name,
      school: form.school,
      action: "runner_register",
      timestamp: Date.now()
    })

    Taro.showToast({ title: "注册成功", icon: "success" })
    setTimeout(() => {
      Taro.redirectTo({ url: '/pages/runner/home' })
    }, 1500)
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-8">
      {/* 顶部标题 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex items-center">
        <View onClick={() => Taro.navigateBack()} className="mr-3">
          <ArrowLeft size={20} color="#8B5CF6" />
        </View>
        <Text className="text-lg font-semibold text-gray-900">跑腿员注册</Text>
      </View>

      <ScrollView>
        <View className="p-4 space-y-4">
          {/* 注册条件说明 */}
          <Alert variant="default" className="bg-purple-50 border-purple-200">
            <View className="flex items-start gap-2">
              <CircleCheck size={16} color="#8B5CF6" className="mt-1" />
              <View className="flex-1">
                <Text className="text-sm text-purple-700 font-medium">注册条件</Text>
                <Text className="text-xs text-purple-600 mt-1">
                  仅限在校大学生，年满18周岁即可申请成为邑夏跑腿员
                </Text>
              </View>
            </View>
          </Alert>

          {/* 姓名 */}
          <Card>
            <CardContent className="p-4">
              <View className="flex items-center gap-3">
                <User size={20} color="#9CA3AF" />
                <Input
                  className="flex-1"
                  placeholder="请输入真实姓名"
                  value={form.name}
                  onInput={(e) => handleInput('name', e.detail.value)}
                />
              </View>
              {errors.name && (
                <Text className="text-xs text-red-500 mt-2">{errors.name}</Text>
              )}
            </CardContent>
          </Card>

          {/* 手机号 */}
          <Card>
            <CardContent className="p-4">
              <View className="flex items-center gap-3">
                <Phone size={20} color="#9CA3AF" />
                <Input
                  className="flex-1"
                  type="number"
                  placeholder="请输入手机号"
                  maxlength={11}
                  value={form.phone}
                  onInput={(e) => handleInput('phone', e.detail.value)}
                />
              </View>
              {errors.phone && (
                <Text className="text-xs text-red-500 mt-2">{errors.phone}</Text>
              )}
            </CardContent>
          </Card>

          {/* 学校 */}
          <Card>
            <CardContent className="p-4">
              <View className="flex items-center gap-3">
                <GraduationCap size={20} color="#9CA3AF" />
                <View 
                  className="flex-1 flex items-center justify-between"
                  onClick={() => {
                    Taro.showActionSheet({
                      itemList: SCHOOLS,
                      success: (res) => {
                        handleInput('school', SCHOOLS[res.tapIndex])
                      }
                    })
                  }}
                >
                  <Text className={form.school ? 'text-gray-900' : 'text-gray-400'}>
                    {form.school || '请选择学校'}
                  </Text>
                  <Text className="text-gray-400">›</Text>
                </View>
              </View>
              {errors.school && (
                <Text className="text-xs text-red-500 mt-2">{errors.school}</Text>
              )}
            </CardContent>
          </Card>

          {/* 学生证号 */}
          <Card>
            <CardContent className="p-4">
              <View className="flex items-center gap-3">
                <CreditCard size={20} color="#9CA3AF" />
                <Input
                  className="flex-1"
                  placeholder="请输入学生证号"
                  value={form.studentId}
                  onInput={(e) => handleInput('studentId', e.detail.value)}
                />
              </View>
              {errors.studentId && (
                <Text className="text-xs text-red-500 mt-2">{errors.studentId}</Text>
              )}
            </CardContent>
          </Card>

          {/* 年龄验证 */}
          <Card>
            <CardContent className="p-4">
              <View className="flex items-center justify-between">
                <View className="flex items-center gap-2">
                  <Text className="text-sm text-gray-700">年龄验证</Text>
                  {form.ageVerified && (
                    <CircleCheck size={16} color="#10B981" />
                  )}
                </View>
                <Button
                  variant={form.ageVerified ? "outline" : "default"}
                  size="sm"
                  onClick={handleAgeVerify}
                  disabled={form.ageVerified}
                >
                  <Text className="text-sm">
                    {form.ageVerified ? '已验证' : '点击验证'}
                  </Text>
                </Button>
              </View>
              {errors.ageVerified && (
                <Text className="text-xs text-red-500 mt-2">{errors.ageVerified}</Text>
              )}
            </CardContent>
          </Card>

          {/* 提交按钮 */}
          <Button 
            className="w-full mt-4" 
            size="lg"
            onClick={handleSubmit}
          >
            <Text>立即注册成为跑腿员</Text>
          </Button>

          {/* 收益说明 */}
          <View className="bg-gray-50 rounded-xl p-4 mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">收益说明</Text>
            <View className="space-y-1">
              <View className="flex items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <Text className="text-xs text-gray-500">每单配送费 ¥1 起</Text>
              </View>
              <View className="flex items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <Text className="text-xs text-gray-500">订单完成即时到账</Text>
              </View>
              <View className="flex items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <Text className="text-xs text-gray-500">高峰期补贴更多</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
