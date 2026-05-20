/**
 * 邑夏小程序 · 发货页面
 * 创建快递订单并获取电子面单
 */
import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Truck, MapPin, Package, Phone, User, FileText, ChevronRight } from 'lucide-react-taro'
import {
  getCompanies,
  createOrder,
  chooseAddress,
  previewWaybillImage,
  type ExpressCompany,
  type Receiver,
  type Cargo,
} from '@/utils/expressApi'
import './index.css'

export default function ShippingPage() {
  const [companies, setCompanies] = useState<ExpressCompany[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('JDL')
  const [receiver, setReceiver] = useState<Receiver>({
    name: '',
    mobile: '',
    province: '',
    city: '',
    area: '',
    address: '',
  })
  const [cargo, setCargo] = useState<Cargo>({
    name: '果酒',
    count: 1,
    weight: 1.0,
  })
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [waybillId, setWaybillId] = useState('')
  const [waybillImage, setWaybillImage] = useState('')

  // 加载快递公司列表
  useDidShow(() => {
    loadCompanies()
    generateOrderId()
  })

  const loadCompanies = async () => {
    try {
      const list = await getCompanies()
      setCompanies(list)
      // 默认选择已绑定的快递公司
      const boundCompany = list.find((c) => c.bound)
      if (boundCompany) {
        setSelectedCompany(boundCompany.id)
      }
    } catch {
      // 使用默认配置
      setCompanies([
        { id: 'JDL', name: '京东快递', serviceType: 0, serviceName: '特惠送', mode: '直营', bound: true },
      ])
    }
  }

  const generateOrderId = () => {
    const now = new Date()
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0')
    setOrderId(`YX${timestamp}`)
  }

  // 选择收件地址
  const handleChooseAddress = async () => {
    const address = await chooseAddress()
    if (address) {
      setReceiver(address)
    }
  }

  // 创建快递订单
  const handleCreateOrder = async () => {
    // 验证收件人信息
    if (!receiver.name || !receiver.mobile || !receiver.province || !receiver.city || !receiver.area || !receiver.address) {
      Taro.showToast({ title: '请填写完整收件信息', icon: 'none' })
      return
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(receiver.mobile)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const result = await createOrder({
        orderId,
        expressCompany: selectedCompany,
        receiver,
        cargo,
        remark,
        getPrintData: true,
      })

      setWaybillId(result.waybillId)

      // 提取面单图片
      const imageData = result.waybillData.find((d) => d.type === 'image' || d.type === 'IMAGE')
      if (imageData) {
        setWaybillImage(imageData.content)
      }

      Taro.showModal({
        title: '发货成功',
        content: `运单号：${result.waybillId}\n快递公司：${result.expressCompanyName}`,
        showCancel: false,
      })
    } catch {
      Taro.showToast({ title: '发货失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 预览面单
  const handlePreviewWaybill = useCallback(() => {
    if (waybillImage) {
      previewWaybillImage(waybillImage)
    }
  }, [waybillImage])

  // 复制运单号
  const handleCopyWaybill = useCallback(() => {
    if (waybillId) {
      Taro.setClipboardData({ data: waybillId })
      Taro.showToast({ title: '已复制运单号', icon: 'success' })
    }
  }, [waybillId])

  const selectedCompanyInfo = companies.find((c) => c.id === selectedCompany)

  return (
    <View className="shipping-page">
      {/* 顶部导航 */}
      <View className="header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={20} color="#333" />
        </View>
        <Text className="title">发货管理</Text>
        <View className="placeholder" />
      </View>

      {/* 订单号 */}
      <Card className="card">
        <CardContent className="card-content">
          <View className="section-title">
            <FileText size={18} color="#f97316" />
            <Text className="title-text">订单信息</Text>
          </View>
          <View className="order-id-row">
            <Text className="label">订单号：</Text>
            <Text className="value">{orderId}</Text>
          </View>
        </CardContent>
      </Card>

      {/* 快递公司选择 */}
      <Card className="card">
        <CardContent className="card-content">
          <View className="section-title">
            <Truck size={18} color="#f97316" />
            <Text className="title-text">快递公司</Text>
          </View>
          <View className="company-list">
            {companies.map((company) => (
              <View
                key={company.id}
                className={`company-item ${selectedCompany === company.id ? 'active' : ''}`}
                onClick={() => setSelectedCompany(company.id)}
              >
                <Text className="company-name">{company.name}</Text>
                {selectedCompany === company.id && (
                  <Text className="check-mark">✓</Text>
                )}
              </View>
            ))}
          </View>
          {selectedCompanyInfo && (
            <Text className="service-name">服务：{selectedCompanyInfo.serviceName}</Text>
          )}
        </CardContent>
      </Card>

      {/* 收件人信息 */}
      <Card className="card" onClick={handleChooseAddress}>
        <CardContent className="card-content">
          <View className="section-title">
            <MapPin size={18} color="#f97316" />
            <Text className="title-text">收件人</Text>
            <ChevronRight size={18} color="#999" className="chevron" />
          </View>
          {receiver.name ? (
            <View className="receiver-info">
              <View className="receiver-row">
                <User size={16} color="#666" />
                <Text className="receiver-name">{receiver.name}</Text>
                <Phone size={16} color="#666" />
                <Text className="receiver-mobile">{receiver.mobile}</Text>
              </View>
              <Text className="receiver-address">
                {receiver.province}{receiver.city}{receiver.area}{receiver.address}
              </Text>
            </View>
          ) : (
            <Text className="placeholder-text">点击选择收件地址</Text>
          )}
        </CardContent>
      </Card>

      {/* 货物信息 */}
      <Card className="card">
        <CardContent className="card-content">
          <View className="section-title">
            <Package size={18} color="#f97316" />
            <Text className="title-text">货物信息</Text>
          </View>
          <View className="cargo-form">
            <View className="form-row">
              <Text className="label">物品名称</Text>
              <View className="input-wrapper">
                <Input
                  value={cargo.name}
                  onInput={(e) => setCargo({ ...cargo, name: e.detail.value })}
                  placeholder="请输入物品名称"
                  className="input"
                />
              </View>
            </View>
            <View className="form-row">
              <Text className="label">数量</Text>
              <View className="stepper">
                <View
                  className="stepper-btn"
                  onClick={() => setCargo({ ...cargo, count: Math.max(1, cargo.count - 1) })}
                >
                  <Text>-</Text>
                </View>
                <Text className="stepper-value">{cargo.count}</Text>
                <View
                  className="stepper-btn"
                  onClick={() => setCargo({ ...cargo, count: cargo.count + 1 })}
                >
                  <Text>+</Text>
                </View>
              </View>
            </View>
            <View className="form-row">
              <Text className="label">重量(kg)</Text>
              <View className="input-wrapper small">
                <Input
                  type="digit"
                  value={cargo.weight.toString()}
                  onInput={(e) => setCargo({ ...cargo, weight: parseFloat(e.detail.value) || 1 })}
                  className="input"
                />
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 备注 */}
      <Card className="card">
        <CardContent className="card-content">
          <View className="section-title">
            <Text className="title-text">备注</Text>
          </View>
          <View className="input-wrapper full">
            <Input
              value={remark}
              onInput={(e) => setRemark(e.detail.value)}
              placeholder="易碎品、轻拿轻放等"
              className="input"
            />
          </View>
        </CardContent>
      </Card>

      {/* 面单展示 */}
      {waybillId && (
        <Card className="card">
          <CardContent className="card-content">
            <View className="section-title">
              <Text className="title-text">电子面单</Text>
            </View>
            <View className="waybill-info">
              <Text className="waybill-label">运单号：</Text>
              <Text className="waybill-id">{waybillId}</Text>
              <View className="copy-btn" onClick={handleCopyWaybill}>
                <Text className="copy-text">复制</Text>
              </View>
            </View>
            {waybillImage && (
              <View className="waybill-image" onClick={handlePreviewWaybill}>
                <Image src={waybillImage} mode="widthFix" className="image" />
              </View>
            )}
          </CardContent>
        </Card>
      )}

      {/* 底部按钮 */}
      <View className="footer">
        <Button
          className="submit-btn"
          onClick={handleCreateOrder}
          disabled={loading}
        >
          {loading ? '发货中...' : '确认发货'}
        </Button>
      </View>
    </View>
  )
}
