import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Sparkles, TrendingUp, Award, Heart, Users, MessageSquare, Share2, ShoppingCart } from 'lucide-react-taro'
import { useUserProfileStore } from '@/store/userProfileStore'
import { useMemberStore } from '@/store/memberStore'
import { USER_TAGS, TAG_CATEGORIES, type TagId } from '@/data/userTags'
import './index.config'

export default function UserProfile() {
  const [selectedTag, setSelectedTag] = useState<TagId | null>(null)
  const { tags, behaviorScore, purchases, ugcWorks, votes, shareCount } = useUserProfileStore()
  const { isMember } = useMemberStore()

  // 计算等级
  const getLevel = () => {
    if (behaviorScore >= 80) return { name: '铁粉', color: '#EF4444', icon: '❤' }
    if (behaviorScore >= 50) return { name: '达人', color: '#8B5CF6', icon: '⭐' }
    if (behaviorScore >= 20) return { name: '活跃', color: '#3B82F6', icon: '🌟' }
    return { name: '新手', color: '#10B981', icon: '🌱' }
  }

  const level = getLevel()

  // 标签说明（已移除消费行为标签，符合微信审核合规）
  const tagDescriptions: Record<TagId, string> = {
    peach_lover: '你最喜欢桃味果酒，甜蜜是你的主旋律~',
    hawthorn_fan: '山楂的酸甜是你的心头好，开胃解腻！',
    pear_lover: '清润的梨酒是你的首选，润肺养生派~',
    pomegranate_fan: '石榴的抗氧化属性吸引了你，精致养生达人！',
    grape_lover: '葡萄果酒让你沉醉，浪漫优雅~',
    social_butterfly: '社交达人，在邑夏找到志同道合的伙伴！',
    content_creator: '创作者，用作品表达你的态度！',
    voter: '投票积极分子，为喜欢的作品发声！',
    shy_observer: '安静观察者，默默关注也是一种支持~',
    tcm_fan: '中医养生派，关注身体的五行平衡！',
    organ_lord_follower: '藏府君粉丝，追随古法养生智慧！',
    sprite_collector: '精灵收集者，每只小可爱都值得被爱~',
    member: '邑夏会员，专属权益等你享~',
    new_user: '萌新一枚，欢迎来到邑夏大家庭！',
    loyal_customer: '铁粉认证，邑夏因你而精彩！',
    campus_ambassador: '校园管家，传播邑夏的快乐！',
  }

  // 按分类分组标签
  const groupedTags = TAG_CATEGORIES.map(cat => ({
    ...cat,
    tags: tags
      .filter(tagId => USER_TAGS[tagId]?.category === cat.id)
      .map(tagId => USER_TAGS[tagId])
  })).filter(cat => cat.tags.length > 0)

  // 统计行为数据
  const stats = [
    { icon: ShoppingCart, label: '购买次数', value: purchases.length, color: '#3B82F6' },
    { icon: MessageSquare, label: '投稿数', value: ugcWorks.length, color: '#8B5CF6' },
    { icon: Users, label: '投票数', value: votes.length, color: '#10B981' },
    { icon: Share2, label: '分享数', value: shareCount, color: '#F59E0B' },
  ]

  return (
    <View className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-safe">
      {/* 头部信息卡 */}
      <View className="px-4 pt-4">
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <View className="flex items-center gap-4">
            {/* 头像 */}
            <View className="relative">
              <View className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <Text className="text-2xl text-white">🍑</Text>
              </View>
              {isMember && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Text className="text-xs">👑</Text>
                </View>
              )}
            </View>

            {/* 活跃度 */}
            <View className="flex-1">
              <View className="flex items-center gap-2 mb-2">
                <Sparkles size={18} color="#8B5CF6" />
                <Text className="text-lg font-bold text-gray-800">我的画像</Text>
              </View>

              <View className="flex items-center gap-3">
                {/* 进度条 */}
                <View className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${behaviorScore}%`,
                      background: `linear-gradient(90deg, ${level.color}, #8B5CF6)`
                    }}
                  />
                </View>
                <Text className="text-sm font-medium text-gray-600">{behaviorScore}分</Text>
              </View>
            </View>
          </View>

          {/* 等级 */}
          <View className="mt-4 flex items-center justify-center">
            <View
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{ backgroundColor: `${level.color}15` }}
            >
              <Text>{level.icon}</Text>
              <Text className="font-medium" style={{ color: level.color }}>{level.name}</Text>
              <Text className="text-xs text-gray-500">活跃度 {behaviorScore}/100</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 标签云 */}
      <View className="px-4 mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex items-center gap-2 mb-4">
            <Award size={18} color="#8B5CF6" />
            <Text className="font-bold text-gray-800">我的标签</Text>
            <View className="ml-auto px-2 py-1 bg-purple-100 rounded-full">
              <Text className="text-xs text-purple-600">{tags.length} 个标签</Text>
            </View>
          </View>

          {groupedTags.map(cat => (
            <View key={cat.id} className="mb-4 last:mb-0">
              <View className="flex items-center gap-2 mb-2">
                <Text>{cat.icon}</Text>
                <Text className="text-sm font-medium text-gray-600">{cat.name}</Text>
              </View>
              <View className="flex flex-wrap gap-2">
                {cat.tags.map(tag => (
                  <View
                    key={tag.name}
                    onClick={() => setSelectedTag(tag.name as TagId)}
                    className="px-3 py-2 rounded-full flex items-center gap-1 cursor-pointer"
                    style={{ backgroundColor: `${tag.color}15` }}
                  >
                    <Text>{tag.icon}</Text>
                    <Text className="text-sm" style={{ color: tag.color }}>{tag.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {tags.length === 0 && (
            <View className="text-center py-6">
              <Text className="text-gray-400">还没有标签，开始探索邑夏吧~</Text>
            </View>
          )}
        </View>
      </View>

      {/* 行为统计 */}
      <View className="px-4 mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} color="#3B82F6" />
            <Text className="font-bold text-gray-800">行为统计</Text>
          </View>

          <View className="grid grid-cols-4 gap-2">
            {stats.map(stat => (
              <View key={stat.label} className="text-center">
                <View
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text className="text-lg font-bold text-gray-800">{stat.value}</Text>
                <Text className="text-xs text-gray-500">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 底部提示 */}
      <View className="px-4 mt-6 pb-8">
        <View className="bg-gray-50 rounded-xl p-4">
          <View className="flex items-start gap-3">
            <Heart size={16} color="#9CA3AF" className="mt-1" />
            <Text className="text-sm text-gray-500 leading-relaxed">
              你的画像会根据使用行为自动更新{'\n'}
              越活跃，标签越丰富哦~
            </Text>
          </View>
        </View>
      </View>

      {/* 标签说明弹窗 */}
      {selectedTag && (
        <View
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTag(null)}
        >
          <View
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <View
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full mb-4"
              style={{ backgroundColor: `${USER_TAGS[selectedTag]?.color}15` }}
            >
              <Text>{USER_TAGS[selectedTag]?.icon}</Text>
              <Text className="font-medium" style={{ color: USER_TAGS[selectedTag]?.color }}>
                {USER_TAGS[selectedTag]?.name}
              </Text>
            </View>
            <Text className="text-gray-700 leading-relaxed">
              {tagDescriptions[selectedTag]}
            </Text>
            <View
              className="mt-4 py-3 rounded-xl text-center"
              style={{ backgroundColor: USER_TAGS[selectedTag]?.color }}
              onClick={() => setSelectedTag(null)}
            >
              <Text className="text-white font-medium">知道了</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
