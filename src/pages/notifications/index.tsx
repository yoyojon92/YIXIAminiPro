import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePushStore } from '@/store/pushStore'
import { formatRelativeTime } from '@/utils/time'
import './index.config'

export default function Notifications() {
  const { messages, unreadCount, markAsRead, markAllAsRead } = usePushStore()

  const handleNotificationClick = (id: string, url?: string) => {
    markAsRead(id)
    if (url) {
      // 解析路径参数
      const [path, query] = url.split('?')
      const fullPath = query ? `${path}?${query}` : path
      Taro.navigateTo({ url: fullPath })
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <View className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <View className="flex items-center gap-2">
          <Text className="text-lg font-bold text-gray-800">推送通知</Text>
          {unreadCount > 0 && (
            <View className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
              {unreadCount}
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Text
            className="text-sm text-purple-600"
            onClick={() => markAllAsRead()}
          >
            全部已读
          </Text>
        )}
      </View>

      {/* 推送列表 */}
      {messages.length === 0 ? (
        /* 空状态 */
        <View className="flex flex-col items-center justify-center py-20">
          <Text className="text-6xl mb-4">🔔</Text>
          <Text className="text-gray-400 text-sm">暂无推送通知</Text>
        </View>
      ) : (
        <ScrollView scrollY className="flex-1">
          <View className="p-4 space-y-3">
            {messages.map((msg) => (
              <View
                key={msg.id}
                className={`relative rounded-2xl p-4 ${
                  msg.isRead ? 'bg-gray-50' : 'bg-white'
                } ${!msg.isRead ? 'border-l-4 border-purple-500' : ''}`}
                onClick={() => handleNotificationClick(msg.id, msg.action?.url)}
              >
                <View className="flex items-start gap-3">
                  {/* 图标 */}
                  <View className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Text className="text-xl">{msg.icon || '📢'}</Text>
                  </View>

                  {/* 内容 */}
                  <View className="flex-1 min-w-0">
                    <View className="flex items-center justify-between mb-1">
                      <Text
                        className={`text-sm ${
                          msg.isRead ? 'text-gray-500' : 'text-gray-800 font-semibold'
                        }`}
                      >
                        {msg.title}
                      </Text>
                      <Text className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {formatRelativeTime(msg.timestamp)}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-500 leading-relaxed mb-2">
                      {msg.content}
                    </Text>
                    {msg.action && (
                      <View className="inline-block bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                        {msg.action.text}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}
