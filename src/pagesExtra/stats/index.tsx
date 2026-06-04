import { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useProfileStore, trackProfileAction } from '@/store/profileStore'
import { USER_TAGS, TAG_CATEGORIES } from '@/data/userTags'
import './index.config'

export default function StatsPage() {
  const { profile, actions, userId, calculateProfile } = useProfileStore()
  
  useEffect(() => {
    calculateProfile()
    trackProfileAction('stats_view')
  }, [])
  
  // 按分类分组标签
  const tagsByCategory = TAG_CATEGORIES.map(cat => ({
    ...cat,
    tags: profile.tags
      .filter(tagId => USER_TAGS[tagId]?.category === cat.id)
      .map(tagId => USER_TAGS[tagId])
  })).filter(cat => cat.tags.length > 0)
  
  // 等级进度
  const levelProgress = ((profile.level / 5) * 100).toFixed(0)
  
  return (
    <View className="min-h-screen bg-gradient-to-b from-purple-900 via-slate-900 to-slate-900 pb-safe">
      {/* 顶部标题 */}
      <View className="px-4 pt-4 pb-2">
        <Text className="block text-2xl font-bold text-white text-center">我的画像</Text>
      </View>
      
      {/* 用户ID */}
      <View className="px-4 mb-4">
        <Text className="block text-xs text-gray-400 text-center">
          ID: {userId.slice(0, 12)}...
        </Text>
      </View>
      
      {/* 等级卡片 */}
      <View className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <Text className="text-3xl">
              {profile.level >= 5 ? '🏆' : profile.level >= 4 ? '🥇' : profile.level >= 3 ? '🥈' : profile.level >= 2 ? '🥉' : '🌱'}
            </Text>
            <View>
              <Text className="block text-lg font-bold text-white">{profile.title}</Text>
              <Text className="block text-sm text-white">Lv.{profile.level}</Text>
            </View>
          </View>
          <View className="text-right">
            <Text className="block text-sm text-white">活跃天数</Text>
            <Text className="block text-xl font-bold text-white">{actions.activeDays?.length || 0}</Text>
          </View>
        </View>
        
        {/* 等级进度条 */}
        <View className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <View 
            className="h-full bg-white rounded-full"
            style={{ width: `${levelProgress}%` }}
          />
        </View>
        <Text className="block text-xs text-white mt-1 text-right">
          {profile.level < 5 ? `再获得 ${5 - profile.level} 级即可升级` : '已满级！'}
        </Text>
      </View>
      
      {/* 画像摘要 */}
      <View className="mx-4 mb-4 p-4 rounded-2xl bg-white border border-purple-200" style={{ backgroundColor: '#F3E8FF' }}>
        <Text className="block text-sm text-gray-400 mb-2">📝 画像摘要</Text>
        <Text className="block text-base text-white leading-relaxed">{profile.summary}</Text>
      </View>
      
      {/* 标签展示 */}
      <View className="px-4">
        <Text className="block text-lg font-bold text-white mb-4">🏷️ 我的标签</Text>
        
        {tagsByCategory.length === 0 ? (
          <View className="p-6 rounded-2xl bg-white border border-purple-200 text-center" style={{ backgroundColor: '#F3E8FF' }}>
            <Text className="block text-4xl mb-2">🌱</Text>
            <Text className="block text-gray-400">暂无标签</Text>
            <Text className="block text-sm text-gray-500 mt-1">去体验更多功能，解锁专属标签~</Text>
          </View>
        ) : (
          tagsByCategory.map(category => (
            <View key={category.id} className="mb-4">
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-lg">{category.icon}</Text>
                <Text className="text-base font-semibold text-white">{category.name}</Text>
                <View className="px-2 py-1 rounded-full bg-slate-700">
                  <Text className="text-xs text-gray-400">{category.tags.length}个</Text>
                </View>
              </View>
              
              <View className="flex flex-wrap gap-2">
                {category.tags.map(tag => (
                  <View 
                    key={tag.name}
                    className="px-3 py-2 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: `${tag.color}20`, borderWidth: 1, borderColor: tag.color }}
                  >
                    <Text className="text-base">{tag.icon}</Text>
                    <Text className="text-sm font-medium" style={{ color: tag.color }}>{tag.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </View>
      
      {/* 行为数据统计 */}
      <View className="px-4 mt-6 pb-8">
        <Text className="block text-lg font-bold text-white mb-4">📊 行为数据</Text>
        
        <View className="grid grid-cols-3 gap-3">
          <View className="p-3 rounded-xl bg-white border border-purple-200 text-center" style={{ backgroundColor: '#F3E8FF' }}>
            <Text className="block text-2xl mb-1">🛒</Text>
            <Text className="block text-xl font-bold text-white">{actions.purchases.length}</Text>
            <Text className="block text-xs text-gray-400">购买</Text>
          </View>
          
          <View className="p-3 rounded-xl bg-white border border-purple-200 text-center" style={{ backgroundColor: '#F3E8FF' }}>
            <Text className="block text-2xl mb-1">✏️</Text>
            <Text className="block text-xl font-bold text-white">{actions.ugcPosts.length}</Text>
            <Text className="block text-xs text-gray-400">投稿</Text>
          </View>
          
          <View className="p-3 rounded-xl bg-white border border-purple-200 text-center" style={{ backgroundColor: '#F3E8FF' }}>
            <Text className="block text-2xl mb-1">🗳️</Text>
            <Text className="block text-xl font-bold text-white">{actions.votes.length}</Text>
            <Text className="block text-xs text-gray-400">投票</Text>
          </View>
          
          <View className="p-3 rounded-xl bg-white border border-purple-200 text-center" style={{ backgroundColor: '#F3E8FF' }}>
            <Text className="block text-2xl mb-1">🔗</Text>
            <Text className="block text-xl font-bold text-white">{actions.shares.length}</Text>
            <Text className="block text-xs text-gray-400">分享</Text>
          </View>
          
          <View className="p-3 rounded-xl bg-white border border-purple-200 text-center" style={{ backgroundColor: '#F3E8FF' }}>
            <Text className="block text-2xl mb-1">🎫</Text>
            <Text className="block text-xl font-bold text-white">{actions.couponUses}</Text>
            <Text className="block text-xs text-gray-400">用券</Text>
          </View>
          
          <View className="p-3 rounded-xl bg-white border border-purple-200 text-center" style={{ backgroundColor: '#F3E8FF' }}>
            <Text className="block text-2xl mb-1">💰</Text>
            <Text className="block text-xl font-bold text-white">{actions.totalSpend.toFixed(0)}</Text>
            <Text className="block text-xs text-gray-400">消费</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
