import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { OrganLord } from '@/data/organLords';

interface OrganLordCardProps {
  lord: OrganLord;
  productId?: string;
}

export function OrganLordCard({ lord, productId }: OrganLordCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    // 埋点记录
    console.log('器官大人点击埋点:', {
      userId: 'user_' + Date.now(),
      productId: productId || lord.productId,
      organLordId: lord.id,
      action: 'organ_click',
      timestamp: Date.now(),
    });
    // 弹出漫剧古风知识介绍
    Taro.showModal({
      title: `${lord.name} · ${lord.title}`,
      content: `【漫剧古风知识】\n\n${lord.name}乃${lord.title}，掌管人体要害。\n\n${lord.healthText}\n\n此角色关联产品：${lord.relatedProduct}\n\n（漫剧内容即将上线，敬请期待...）`,
      confirmText: '我知道了',
      showCancel: false,
    });
  };

  const handleImgError = () => {
    setImgError(true);
  };

  // 使用图片或 emoji fallback
  const showPortrait = !imgError && lord.image;

  return (
    <View
      className="mx-4 my-3 rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${lord.color}22, ${lord.colorEnd}22)`,
        borderLeft: `4px solid ${lord.color}`,
      }}
      onClick={handleClick}
    >
      <View className="flex items-center p-4">
        {/* 左侧立绘 */}
        <View
          className="flex-shrink-0 rounded-lg overflow-hidden"
          style={{
            width: '120px',
            height: '160px',
            border: `3px solid ${lord.color}`,
          }}
        >
          {showPortrait ? (
            <Image
              src={lord.image}
              className="w-full h-full"
              mode="aspectFill"
              onError={handleImgError}
            />
          ) : (
            <View className="w-full h-full flex items-center justify-center bg-gray-100">
              <Text className="text-6xl">{lord.emoji}</Text>
            </View>
          )}
        </View>

        {/* 右侧内容 */}
        <View className="flex-1 ml-4 flex flex-col justify-between h-40">
          {/* 名称 + 官职标签 */}
          <View className="flex items-center">
            <Text className="text-lg font-bold text-white">{lord.name}</Text>
            <View
              className="ml-2 px-2 py-1 rounded text-xs"
              style={{ backgroundColor: `${lord.color}44` }}
            >
              <Text className="text-white text-opacity-70">{lord.title}</Text>
            </View>
          </View>

          {/* 关联产品 */}
          <Text className="text-sm" style={{ color: '#F59E0B' }}>
            关联：{lord.relatedProduct}
          </Text>

          {/* 中医养生文案 */}
          <Text className="text-xs text-white text-opacity-70 leading-relaxed">
            {lord.healthText}
          </Text>

          {/* 底部提示 */}
          <View className="flex items-center">
            <Text className="text-xs" style={{ color: '#F59E0B' }}>
              点击了解漫剧知识 ▸
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
