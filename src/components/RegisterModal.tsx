import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import { X, Camera } from 'lucide-react-taro'
import { useUserProfileStore } from '@/store/userProfileStore'
import { useUserStore } from '@/store/userStore'

interface RegisterModalProps {
  visible: boolean
  onClose: () => void
}

export function RegisterModal({ visible, onClose }: RegisterModalProps) {
  const { setUserInfo } = useUserProfileStore()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [nickName, setNickName] = useState('')
  const [tempAvatar, setTempAvatar] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const { setInviterCode } = useUserStore()

  if (!visible) return null

  // 微信选择头像回调
  const handleChooseAvatar = (e) => {
    const { avatarUrl: url } = e.detail
    if (url) {
      setTempAvatar(url)
    }
  }

  // 提交注册
  const handleConfirm = () => {
    const finalNickname = nickName.trim()
    if (!finalNickname) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    const finalAvatar = tempAvatar || avatarUrl

    setUserInfo({
      nickname: finalNickname,
      avatar: finalAvatar,
      school: '',
      college: '',
      age: 0,
    })

    // 保存邀请码（如有）
    if (inviteCode.trim()) {
      setInviterCode(inviteCode.trim().toUpperCase())
    }

    Taro.showToast({ title: '欢迎加入邑夏！', icon: 'success' })
    onClose()
  }

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <View style={{ backgroundColor: '#fff', borderRadius: '16px', width: '85%', maxWidth: '360px', overflow: 'hidden' }}>
        {/* 头部 */}
        <View style={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)', padding: '16px 24px', position: 'relative' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center', display: 'block' }}>
            微信一键授权
          </Text>
          <View style={{ position: 'absolute', right: '16px', top: '16px' }} onClick={onClose}>
            <X size={20} color="#fff" />
          </View>
        </View>

        {/* 内容 */}
        <View style={{ padding: '24px' }}>
          {/* 头像选择 - 使用微信button open-type */}
          <Text style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'block' }}>
            选择头像
          </Text>
          <View style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <View
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                border: '2px dashed #d1d5db', display: 'flex',
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* 微信 chooseAvatar 按钮 */}
              <button
                open-type="chooseAvatar"
                onChooseAvatar={handleChooseAvatar}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  opacity: 0, zIndex: 2, border: 'none', background: 'transparent'
                }}
              />
              {tempAvatar ? (
                <Image src={tempAvatar} style={{ width: '100%', height: '100%' }} mode="aspectFill" />
              ) : avatarUrl ? (
                <Image src={avatarUrl} style={{ width: '100%', height: '100%' }} mode="aspectFill" />
              ) : (
                <Camera size={32} color="#9ca3af" />
              )}
            </View>
          </View>

          {/* 昵称输入 - 使用微信 nickname input */}
          <Text style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'block' }}>
            昵称
          </Text>
          <View style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <Input
              type="nickname"
              placeholder="点击获取微信昵称"
              value={nickName}
              onInput={(e) => setNickName(e.detail.value)}
              maxlength={20}
              style={{ fontSize: '15px' }}
            />
          </View>

          {/* 邀请码（选填） */}
          <Text style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'block' }}>
            邀请码（选填）
          </Text>
          <View style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '12px 16px', marginBottom: '12px' }}>
            <Input
              placeholder="好友分享码"
              value={inviteCode}
              onInput={(e) => setInviteCode(e.detail.value.toUpperCase())}
              maxlength={12}
              style={{ fontSize: '15px' }}
            />
          </View>

          {/* 提示 */}
          <View style={{ backgroundColor: '#fffbeb', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <Text style={{ fontSize: '12px', color: '#b45309' }}>
              购买果酒类产品需年满18周岁，请确认您已成年
            </Text>
          </View>

          {/* 确认按钮 */}
          <View
            onClick={handleConfirm}
            style={{
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              borderRadius: '12px', padding: '14px 0', textAlign: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              授权并加入邑夏
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
