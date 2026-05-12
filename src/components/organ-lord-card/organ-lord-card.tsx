import { useState } from 'react';
import { Image, View, Text } from '@tarojs/components';
import { Sheet } from '@/components/ui/sheet';
import { Info, ArrowRight, X } from 'lucide-react-taro';
import { OrganLord } from '@/data/organLords';
import './organ-lord-card.scss';

interface OrganLordCardProps {
  lord: OrganLord;
  productId?: number;
}

export function OrganLordCard({ lord, productId }: OrganLordCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const handleClick = () => {
    // 埋点记录
    console.log('器官大人点击埋点:', {
      userId: 'user_' + Date.now(),
      productId: productId || lord.productId,
      organLordId: lord.id,
      action: 'organ_click',
      timestamp: Date.now(),
    });
    setShowDetail(true);
  };

  return (
    <>
      <View className="organ-lord-card" onClick={handleClick}>
        {/* 左侧立绘 */}
        <View className="organ-lord-card__portrait">
          <View className="organ-lord-card__portrait-frame">
            <Image
              src={lord.image}
              className="organ-lord-card__portrait-image"
              mode="aspectFill"
            />
          </View>
        </View>

        {/* 右侧内容 */}
        <View className="organ-lord-card__content">
          <View className="organ-lord-card__header">
            <Text className="organ-lord-card__name">{lord.name}</Text>
            <View className="organ-lord-card__badge">
              <Text className="organ-lord-card__badge-text">IP</Text>
            </View>
          </View>

          <Text className="organ-lord-card__title">{lord.title}</Text>

          <Text className="organ-lord-card__quote">&ldquo;{lord.quote}&rdquo;</Text>

          <View className="organ-lord-card__footer">
            <Text className="organ-lord-card__knowledge">{lord.knowledge}</Text>
            <View className="organ-lord-card__arrow">
              <ArrowRight size={16} color={lord.color} />
            </View>
          </View>

          <View className="organ-lord-card__product">
            <Text className="organ-lord-card__product-label">关联产品</Text>
            <Text className="organ-lord-card__product-name">{lord.productName}</Text>
          </View>
        </View>

        {/* 装饰线 */}
        <View
          className="organ-lord-card__accent"
          style={{ backgroundColor: lord.color }}
        />
      </View>

      {/* 详情弹窗 */}
      <Sheet
        open={showDetail}
        onOpenChange={(open) => !open && setShowDetail(false)}
      >
        <View className="organ-lord-sheet">
          {/* 标题栏 */}
          <View className="organ-lord-sheet__header">
            <View className="organ-lord-sheet__title-row">
              <Text className="organ-lord-sheet__name">{lord.name}</Text>
              <Text className="organ-lord-sheet__subtitle">{lord.title}</Text>
            </View>
            <View
              className="organ-lord-sheet__divider"
              style={{ backgroundColor: lord.color }}
            />
            <View className="organ-lord-sheet__close" onClick={() => setShowDetail(false)}>
              <X size={24} color="#666" />
            </View>
          </View>

          {/* 内容区 */}
          <View className="organ-lord-sheet__body">
            {/* 人物立绘 */}
            <View className="organ-lord-sheet__portrait">
              <Image
                src={lord.image}
                className="organ-lord-sheet__image"
                mode="aspectFill"
              />
            </View>

            {/* 漫剧古风知识介绍 */}
            <View className="organ-lord-sheet__section">
              <View className="organ-lord-sheet__section-header">
                <Info size={16} color={lord.color} />
                <Text className="organ-lord-sheet__section-title">中医知识</Text>
              </View>
              <Text className="organ-lord-sheet__knowledge">{lord.knowledge}</Text>
            </View>

            <View className="organ-lord-sheet__section">
              <View className="organ-lord-sheet__section-header">
                <Text className="organ-lord-sheet__section-icon">📜</Text>
                <Text className="organ-lord-sheet__section-title">漫剧古风知识</Text>
              </View>
              <Text className="organ-lord-sheet__detail">{lord.detail}</Text>
            </View>

            <View className="organ-lord-sheet__section">
              <View className="organ-lord-sheet__quote-box">
                <Text className="organ-lord-sheet__quote">{lord.quote}</Text>
              </View>
            </View>

            {/* 关联产品 */}
            <View className="organ-lord-sheet__product-card">
              <Image
                src={lord.image}
                className="organ-lord-sheet__product-image"
                mode="aspectFill"
              />
              <View className="organ-lord-sheet__product-info">
                <Text className="organ-lord-sheet__product-name">{lord.productName}</Text>
                <Text className="organ-lord-sheet__product-tip">立即选购</Text>
              </View>
              <ArrowRight size={20} color="#666" />
            </View>
          </View>
        </View>
      </Sheet>
    </>
  );
}

export default OrganLordCard;
