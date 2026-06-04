import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Picker } from '@tarojs/components'
import { useMemberStore } from '@/store/memberStore'

export default function MemberProfile() {
  const { profileCompleted, profileName, profilePhone, birthdayDate, setProfileCompleted } = useMemberStore()
  const [name, setName] = useState(profileName || '')
  const [phone, setPhone] = useState(profilePhone || '')
  const [birthday, setBirthday] = useState(birthdayDate || '')

  const months = Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, '0')}月`)
  const days = Array.from({ length: 31 }, (_, i) => `${String(i + 1).padStart(2, '0')}日`)

  const [monthIdx, setMonthIdx] = useState(0)
  const [dayIdx, setDayIdx] = useState(0)

  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!phone.trim() || phone.length < 11) {
      Taro.showToast({ title: '请输入正确手机号', icon: 'none' })
      return
    }
    const bd = `${String(monthIdx + 1).padStart(2, '0')}-${String(dayIdx + 1).padStart(2, '0')}`
    setProfileCompleted(name.trim(), phone.trim(), bd)
    Taro.showToast({ title: '信息完善成功！', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1000)
  }

  return (
    <View style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px 16px' }}>
      <View style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px 20px' }}>
        <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', display: 'block', marginBottom: '6px' }}>
          完善个人信息
        </Text>
        <Text style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '24px' }}>
          完善信息后可解锁生日9折权益
        </Text>

        {/* 姓名 */}
        <Text style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>姓名</Text>
        <View style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
          <Input
            placeholder="请输入真实姓名"
            value={name}
            onInput={(e) => setName(e.detail.value)}
            maxlength={20}
          />
        </View>

        {/* 手机号 */}
        <Text style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>手机号</Text>
        <View style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
          <Input
            type="number"
            placeholder="请输入手机号"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxlength={11}
          />
        </View>

        {/* 生日 */}
        <Text style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>生日（月-日）</Text>
        <View style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '12px 16px' }}>
            <Picker mode="selector" range={months} onChange={(e) => setMonthIdx(Number(e.detail.value))}>
              <Text style={{ color: '#374151' }}>{months[monthIdx]}</Text>
            </Picker>
          </View>
          <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '12px 16px' }}>
            <Picker mode="selector" range={days} onChange={(e) => setDayIdx(Number(e.detail.value))}>
              <Text style={{ color: '#374151' }}>{days[dayIdx]}</Text>
            </Picker>
          </View>
        </View>

        {/* 已完善状态 */}
        {profileCompleted && (
          <View style={{ backgroundColor: '#ecfdf5', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
            <Text style={{ fontSize: '13px', color: '#059669' }}>✓ 信息已完善，生日权益已解锁</Text>
          </View>
        )}

        {/* 保存按钮 */}
        <View
          onClick={handleSave}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '12px', padding: '14px 0', textAlign: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
            {profileCompleted ? '更新信息' : '保存并解锁生日权益'}
          </Text>
        </View>
      </View>
    </View>
  )
}
