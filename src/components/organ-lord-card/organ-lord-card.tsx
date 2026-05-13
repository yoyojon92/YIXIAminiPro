import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ArrowRight } from 'lucide-react-taro';
import { OrganLord } from '@/data/organLords';
import './organ-lord-card.scss';

interface OrganLordCardProps {
  lord: OrganLord;
  productId?: string;
}

export function OrganLordCard({ lord, productId }: OrganLordCardProps) {
  const [showDetail, setShowDetail] = useState(false);
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
    setShowDetail(true);
  };

  const handleImgError = () => {
    setImgError(true);
  };

  // 使用图片或 emoji fallback
  const showPortrait = !imgError && lord.image;

  return (
    <>
      <View className="organ-lord-card" onClick={handleClick}>
        {/* 左侧立绘/emoji */}
        <View className="organ-lord-card__portrait">
          <View 
            className={`organ-lord-card__portrait-frame ${showPortrait ? 'organ-lord-card__portrait-image' : 'organ-lord-card__portrait-emoji'}`}
            style={{ borderColor: lord.color }}
          >
            {showPortrait ? (
              <Image
                src={lord.image}
                className="organ-lord-card__portrait-img"
                mode="aspectFill"
                onError={handleImgError}
              />
            ) : (
              <Text className="organ-lord-card__emoji">{lord.emoji}</Text>
            )}
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

          <Text className="organ-lord-card__quote">&ldquo;{lord.healthText}&rdquo;</Text>

          <View className="organ-lord-card__footer">
            <Text className="organ-lord-card__knowledge">关联：{lord.relatedProduct}</Text>
            <View className="organ-lord-card__arrow">
              <ArrowRight size={16} color={lord.color} />
            </View>
          </View>
        </View>
      </View>

      {/* 详情弹窗 - 底部弹出 */}
      <Sheet open={showDetail} onOpenChange={(open) => !open && setShowDetail(false)}>
        <SheetContent side="bottom" className="organ-lord-detail-sheet">
          <View className="organ-lord-detail">
            {/* 弹窗头部 */}
            <View className="organ-lord-detail__header">
              <View className="organ-lord-detail__portrait">
                <View 
                  className={`organ-lord-detail__portrait-frame ${showPortrait ? 'organ-lord-detail__portrait-image' : 'organ-lord-detail__portrait-emoji'}`}
                  style={{ borderColor: lord.color }}
                >
                  {showPortrait ? (
                    <Image
                      src={lord.image}
                      className="organ-lord-detail__portrait-img"
                      mode="aspectFill"
                      onError={handleImgError}
                    />
                  ) : (
                    <Text className="organ-lord-detail__emoji">{lord.emoji}</Text>
                  )}
                </View>
              </View>
              <View className="organ-lord-detail__title-group">
                <Text className="organ-lord-detail__name">{lord.name}</Text>
                <Text className="organ-lord-detail__subtitle">{lord.title}</Text>
              </View>
            </View>

            {/* 漫剧古风知识介绍 */}
            <View className="organ-lord-detail__content">
              <View className="organ-lord-detail__quote-box" style={{ borderColor: lord.color }}>
                <Text className="organ-lord-detail__quote-label">名医说</Text>
                <Text className="organ-lord-detail__quote">&ldquo;{lord.healthText}&rdquo;</Text>
              </View>
              <Text className="organ-lord-detail__text">{lord.healthText}</Text>
            </View>

            {/* 关联产品 */}
            <View className="organ-lord-detail__product">
              <View className="organ-lord-detail__product-info">
                <Text className="organ-lord-detail__product-label">关联产品</Text>
                <Text className="organ-lord-detail__product-name">{lord.relatedProduct}</Text>
              </View>
              <View className="organ-lord-detail__product-btn">
                <Text className="organ-lord-detail__product-btn-text">查看详情</Text>
              </View>
            </View>
          </View>
        </SheetContent>
      </Sheet>
    </>
  );
}
