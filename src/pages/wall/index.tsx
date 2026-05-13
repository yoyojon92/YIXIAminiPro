import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUGCStore, UGCWork } from '@/store/ugcStore'
import { useMemberStore } from '@/store/memberStore'
import { MemberModal } from '@/components/member-modal'
import { trackProfileAction } from '@/store/profileStore'
import {
  Heart, Share2, ImagePlus, Camera, Trophy, Crown,
  TrendingUp, Star, Vote
} from 'lucide-react-taro'

const TABS = [
  { key: 'all', label: '全部', icon: TrendingUp },
  { key: 'official', label: '官方精选', icon: Star },
  { key: 'member', label: '会员投稿', icon: Crown },
  { key: 'ranking', label: '月度排行', icon: Trophy },
]

export default function Wall() {
  const [activeTab, setActiveTab] = useState('all')
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedWork, setSelectedWork] = useState<UGCWork | null>(null)
  const [showPublishGuide, setShowPublishGuide] = useState(false)

  const { works, voteWork, getOfficialWorks, getMemberWorks, getMonthlyRanking } = useUGCStore()
  const { isMember, setShowMemberModal: setGlobalMemberModal } = useMemberStore()

  // 埋点
  useEffect(() => {
    if (activeTab === 'ranking') {
      trackProfileAction('ranking_view')
    }
  }, [activeTab])

  const handleLike = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const handleShare = (work: UGCWork) => {
    useUGCStore.getState().shareWork(work.id)
    trackProfileAction('ugc_share_vote', { workId: work.id })
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: '分享成功，快去拉票吧', icon: 'success' })
  }

  const handleVoteClick = (work: UGCWork) => {
    setSelectedWork(work)
    setShowVoteModal(true)
  }

  const handleVoteConfirm = () => {
    if (selectedWork) {
      voteWork(selectedWork.id)
      trackProfileAction('ugc_vote', { workId: selectedWork.id })
      Taro.showToast({ title: '投票成功', icon: 'success' })
    }
    setShowVoteModal(false)
    setSelectedWork(null)
  }

  const handlePublish = () => {
    if (!isMember) {
      setShowPublishGuide(true)
    } else {
      Taro.navigateTo({ url: '/pages/wall/publish/index' })
    }
  }

  const getFilteredWorks = (): UGCWork[] => {
    switch (activeTab) {
      case 'official': return getOfficialWorks()
      case 'member': return getMemberWorks()
      case 'ranking': return getMonthlyRanking()
      default: return works
    }
  }

  const renderTypeBadge = (type: 'official' | 'member') => {
    if (type === 'official') {
      return (
        <View className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full">
          <Text className="text-xs text-amber-600">🏛 官方</Text>
        </View>
      )
    }
    return (
      <View className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
        <Text className="text-xs text-purple-600">👑 会员</Text>
      </View>
    )
  }

  const renderRankingBadge = (rank: number | null) => {
    if (rank === null) return null
    const medals = ['🥇', '🥈', '🥉']
    if (rank <= 3) {
      return <Text className="text-2xl">{medals[rank - 1]}</Text>
    }
    return (
      <View className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <Text className="text-sm font-bold text-gray-600">{rank}</Text>
      </View>
    )
  }

  const renderWorkCard = (work: UGCWork, isRanking = false) => {
    const isLiked = likedPosts[work.id]
    const displayLikes = isLiked ? work.likes + 1 : work.likes

    return (
      <Card key={work.id} className={`mb-3 overflow-hidden ${isRanking && work.rank && work.rank <= 3 ? 'border-2 border-amber-300' : ''}`}>
        <CardContent className="p-0">
          {/* 用户信息 + 排名标识 */}
          <View className="flex items-center justify-between px-4 py-3">
            <View className="flex items-center gap-3">
              {isRanking && renderRankingBadge(work.rank)}
              <View>
                <View className="flex items-center gap-2">
                  <Text className="text-sm font-medium text-gray-900">{work.author}</Text>
                  {renderTypeBadge(work.type)}
                </View>
                {work.school && (
                  <Text className="text-xs text-gray-500">{work.school}</Text>
                )}
              </View>
            </View>
            {work.productName && (
              <View className="px-2 py-1 bg-gray-100 rounded-full">
                <Text className="text-xs text-gray-600">{work.productName}</Text>
              </View>
            )}
          </View>

          {/* 作品图片 */}
          <View className="px-4">
            <Image
              src={work.image}
              mode="aspectFill"
              className="w-full h-48 rounded-xl"
            />
          </View>

          {/* 作品标题和描述 */}
          <View className="px-4 py-3">
            <Text className="text-base font-medium text-gray-900">{work.title}</Text>
            {work.description && (
              <Text className="text-sm text-gray-600 mt-1 line-clamp-2">{work.description}</Text>
            )}
            <View className="flex gap-2 mt-2 flex-wrap">
              {work.tags.map((tag) => (
                <Text key={tag} className="text-xs text-primary">{tag}</Text>
              ))}
            </View>
          </View>

          {/* 互动栏 */}
          <View className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <View className="flex items-center gap-4">
              {/* 点赞 */}
              <View className="flex items-center gap-1" onClick={() => handleLike(work.id)}>
                <Heart
                  size={18}
                  color={isLiked ? '#EF4444' : '#9CA3AF'}
                />
                <Text className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                  {displayLikes}
                </Text>
              </View>

              {/* 投票 */}
              {activeTab === 'ranking' && (
                <View
                  className="flex items-center gap-1"
                  onClick={() => handleVoteClick(work)}
                >
                  <Vote size={18} color={work.isVoted ? '#8B5CF6' : '#9CA3AF'} />
                  <Text className={`text-sm ${work.isVoted ? 'text-purple-600' : 'text-gray-500'}`}>
                    {work.votes}
                  </Text>
                </View>
              )}

              {/* 分享 */}
              <View className="flex items-center gap-1" onClick={() => handleShare(work)}>
                <Share2 size={18} color="#9CA3AF" />
                <Text className="text-sm text-gray-500">{work.shares}</Text>
              </View>
            </View>

            {/* 投票按钮（排行页） */}
            {activeTab === 'ranking' && (
              <Button
                size="sm"
                variant={work.isVoted ? 'outline' : 'default'}
                className={work.isVoted ? 'border-gray-300' : 'bg-purple-500'}
                onClick={() => handleVoteClick(work)}
              >
                <Text className={`text-xs ${work.isVoted ? 'text-gray-500' : 'text-white'}`}>
                  {work.isVoted ? '已投票' : '🗳 投票'}
                </Text>
              </Button>
            )}
          </View>
        </CardContent>
      </Card>
    )
  }

  const renderTopThree = () => {
    const rankingWorks = getMonthlyRanking().slice(0, 3)
    return (
      <View className="px-4 py-3">
        {/* 前三名特殊展示 */}
        <View className="flex justify-between items-end gap-2 mb-4">
          {rankingWorks.map((work, index) => {
            const heights = ['h-64', 'h-72', 'h-60']
            return (
              <View
                key={work.id}
                className="flex-1 relative"
                onClick={() => handleVoteClick(work)}
              >
                {/* 排名标识 */}
                <View className="absolute top-2 left-2 z-10 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Text className="text-white text-sm font-bold">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </Text>
                </View>
                {/* 图片 */}
                <Image
                  src={work.image}
                  mode="aspectFill"
                  className={`w-full ${heights[index]} rounded-2xl`}
                />
                {/* 信息 */}
                <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 rounded-b-2xl" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                  <Text className="text-white text-sm font-medium line-clamp-1">{work.title}</Text>
                  <View className="flex items-center justify-between mt-1">
                    <Text className="text-white text-xs opacity-80">{work.author}</Text>
                    <View className="flex items-center gap-1">
                      <Vote size={12} color="#fff" />
                      <Text className="text-white text-xs">{work.votes}</Text>
                    </View>
                  </View>
                </View>
                {/* 投票按钮 */}
                <View className="absolute bottom-2 right-2">
                  <Button
                    size="sm"
                    className={work.isVoted ? 'bg-gray-400' : 'bg-purple-500'}
                  >
                    <Text className="text-white text-xs">
                      {work.isVoted ? '已投票' : '投票'}
                    </Text>
                  </Button>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  const filteredWorks = getFilteredWorks()

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-50">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-lg font-bold text-gray-900">创意墙</Text>
          <Button size="sm" onClick={handlePublish}>
            <Camera size={16} color="#8B5CF6" />
            <Text>投稿</Text>
          </Button>
        </View>

        {/* Tab切换 */}
        <ScrollView scrollX showScrollbar={false}>
          <View className="flex gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <View
                  key={tab.key}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon size={14} color={activeTab === tab.key ? '#fff' : '#8B5CF6'} />
                  <Text>{tab.label}</Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>

      {/* 月度排行前3 */}
      {activeTab === 'ranking' && renderTopThree()}

      {/* 作品列表 */}
      <View className="px-4 py-3">
        {(activeTab === 'ranking'
          ? filteredWorks.slice(3) // 排行页排除前3
          : filteredWorks
        ).map((work) => renderWorkCard(work, activeTab === 'ranking'))}
      </View>

      {/* 投稿悬浮按钮 */}
      <View
        className="fixed bottom-6 right-4 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-50"
        onClick={handlePublish}
      >
        <ImagePlus size={24} color="white" />
      </View>

      {/* 投票确认弹窗 */}
      {showVoteModal && selectedWork && (
        <View
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowVoteModal(false)}
        >
          <View
            className="w-11/12 bg-white rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <View className="flex items-center gap-3 mb-4">
              <View className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Vote size={24} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">确认投票</Text>
                <Text className="text-sm text-gray-500">{selectedWork.title}</Text>
              </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-4 mb-4">
              <Text className="text-sm text-gray-600">
                🗳 每月每个作品仅可投1票
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                📅 本月剩余投票次数：{30 - useUGCStore.getState().myVotes.length} 次
              </Text>
            </View>

            <View className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowVoteModal(false)}
              >
                <Text>取消</Text>
              </Button>
              <Button className="flex-1 bg-purple-500" onClick={handleVoteConfirm}>
                <Text className="text-white">确认投票</Text>
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 非会员投稿引导 */}
      {showPublishGuide && (
        <View
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowPublishGuide(false)}
        >
          <View
            className="w-11/12 bg-white rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <View className="flex items-center justify-center mb-4">
              <View className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown size={32} color="#8B5CF6" />
              </View>
            </View>

            <Text className="text-lg font-bold text-gray-900 text-center mb-2">
              开通会员后可发布作品
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-4">
              邑夏会员可享受创意墙投稿权限，还有更多专属权益等你来享！
            </Text>

            <View className="bg-purple-50 rounded-xl p-4 mb-4">
              <Text className="text-sm text-purple-700 font-medium mb-2">会员专属权益</Text>
              <View className="flex flex-col gap-1">
                <Text className="text-xs text-purple-600">✏ 上传动漫OS作品</Text>
                <Text className="text-xs text-purple-600">💰 全场果酒享8.5折</Text>
                <Text className="text-xs text-purple-600">🎁 每月领3张代金券</Text>
              </View>
            </View>

            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => {
                setShowPublishGuide(false)
                setGlobalMemberModal(true)
              }}
            >
              <Text className="text-white font-medium">立即开通会员</Text>
            </Button>

            <Text
              className="text-sm text-gray-500 text-center mt-3"
              onClick={() => setShowPublishGuide(false)}
            >
              稍后再说
            </Text>
          </View>
        </View>
      )}

      {/* 会员弹窗 */}
      <MemberModal />
    </View>
  )
}
