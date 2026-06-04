import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { ScanLine, CheckCircle, XCircle, Shield } from 'lucide-react-taro'
import { useMemberStore } from '@/store/memberStore'

/** 自提点核销页 - 店员扫码核验客户取货码 */
export default function RedeemPage() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<'idle' | 'success' | 'fail' | 'used'>('idle')
  const [scannedCode, setScannedCode] = useState('')

  const handleScan = () => {
    setScanning(true)
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        const code = res.result || ''
        setScannedCode(code)
        verifyCode(code)
      },
      fail: () => {
        Taro.showToast({ title: '扫码取消', icon: 'none' })
      },
      complete: () => {
        setScanning(false)
      }
    })
  }

  /** 手动输入核销码 */
  const handleManualInput = () => {
    Taro.showModal({
      title: '手动输入取货码',
      editable: true,
      placeholderText: '请输入取货码（如YXXXXX）',
      success: (res) => {
        if (res.confirm && res.content) {
          setScannedCode(res.content.trim())
          verifyCode(res.content.trim())
        }
      }
    })
  }

  /** 核验核销码 */
  const verifyCode = (code: string) => {
    // 格式校验：YX开头 + 8位
    if (!code.startsWith('YX') || code.length < 6) {
      setResult('fail')
      return
    }
    // 检查是否已核销
    const store = useMemberStore.getState()
    if (store.welcomeGiftRedeemCode === code) {
      if (store.welcomeGiftRedeemed) {
        setResult('used')
      } else {
        // 核销成功
        useMemberStore.getState().redeemWelcomeGift()
        setResult('success')
        // 核销后自动触发评价邀请（1元小酒票激励真实反馈）
        setTimeout(() => {
          Taro.showModal({
            title: '🎁 评价赢1元小酒票',
            content: '分享您的品饮体验，真实评价即可获得1元小酒票一张！',
            confirmText: '去评价',
            confirmColor: '#7C3AED',
            cancelText: '稍后',
            success: (res) => {
              if (res.confirm) Taro.showToast({ title: '评价页面开发中', icon: 'none' })
            }
          })
        }, 1500)
      }
    } else {
      setResult('fail')
    }
  }

  const resetState = () => {
    setResult('idle')
    setScannedCode('')
  }

  return (
    <View className="min-h-screen bg-purple-50 flex flex-col">
      {/* 顶部 */}
      <View className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 pt-4 pb-6">
        <View className="flex items-center gap-2">
          <Shield size={24} color="white" />
          <Text className="text-xl font-bold text-white">核销台</Text>
        </View>
        <Text className="text-sm text-white mt-1">自提点专用 · 扫码核验客户取货码</Text>
      </View>

      <View className="flex-1 px-4 pt-6">
        {result === 'idle' && (
          <View className="text-center">
            <View className="w-32 h-32 mx-auto bg-white rounded-3xl flex items-center justify-center mb-6">
              <ScanLine size={56} color="#A855F7" />
            </View>
            <Text className="text-lg text-white font-medium mb-2">扫描客户取货码</Text>
            <Text className="text-sm text-gray-400 mb-8">客户展示取货码 → 你扫码核销 → 交付酒水</Text>
            <View className="rounded-xl overflow-hidden py-4 text-center mb-4" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }} onClick={handleScan}>
              <Text className="text-white font-semibold text-lg">扫一扫</Text>
            </View>
            <View className="rounded-xl bg-white py-3 text-center" onClick={handleManualInput}>
              <Text className="text-purple-400 text-sm">手动输入取货码</Text>
            </View>
          </View>
        )}

        {result === 'success' && (
          <View className="text-center">
            <View className="w-24 h-24 mx-auto bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={56} color="#22C55E" />
            </View>
            <Text className="text-2xl font-bold text-white mb-2">核销成功</Text>
            <Text className="text-sm text-gray-400 mb-1">取货码：{scannedCode}</Text>
            <Text className="text-sm text-green-400">可以交付酒水了</Text>
            <View className="mt-8 rounded-xl bg-white py-3 text-center" onClick={resetState}>
              <Text className="text-gray-600 text-sm">继续核销</Text>
            </View>
          </View>
        )}

        {result === 'fail' && (
          <View className="text-center">
            <View className="w-24 h-24 mx-auto bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <XCircle size={56} color="#EF4444" />
            </View>
            <Text className="text-2xl font-bold text-white mb-2">核销失败</Text>
            <Text className="text-sm text-gray-400 mb-1">取货码：{scannedCode}</Text>
            <Text className="text-sm text-red-400">无效的取货码，请确认后重试</Text>
            <View className="mt-8 rounded-xl bg-white py-3 text-center" onClick={resetState}>
              <Text className="text-gray-600 text-sm">重新扫码</Text>
            </View>
          </View>
        )}

        {result === 'used' && (
          <View className="text-center">
            <View className="w-24 h-24 mx-auto bg-amber-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <XCircle size={56} color="#FBBF24" />
            </View>
            <Text className="text-2xl font-bold text-white mb-2">已核销</Text>
            <Text className="text-sm text-gray-400 mb-1">取货码：{scannedCode}</Text>
            <Text className="text-sm text-amber-400">此取货码已使用过，不可重复核销</Text>
            <View className="mt-8 rounded-xl bg-white py-3 text-center" onClick={resetState}>
              <Text className="text-gray-600 text-sm">重新扫码</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
