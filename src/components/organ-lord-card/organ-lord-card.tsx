import { View, Text } from '@tarojs/components';
import { OrganLord } from '../../data/organLords';
import './organ-lord-card.scss';

interface OrganLordCardProps {
  lord: OrganLord;
  onClick?: (lord: OrganLord) => void;
}

export function OrganLordCard({ lord, onClick }: OrganLordCardProps) {
  const handleClick = () => {
    onClick?.(lord);
  };

  return (
    <View className="organ-lord-card" onClick={handleClick}>
      <View className={`organ-lord-card__avatar ${lord.bgColor}`}>
        <Text className="organ-lord-card__emoji">{lord.emoji}</Text>
      </View>
      <Text className={`organ-lord-card__name ${lord.color}`}>
        {lord.name}
      </Text>
      <Text className="organ-lord-card__title">{lord.title}</Text>
    </View>
  );
}
