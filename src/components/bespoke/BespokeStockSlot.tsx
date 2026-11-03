import React from 'react';
import { StockFundamentals } from '../../types/stock';
import { SingleStockProfile } from '../../types/stockConfig';
import { AlphabetBespokeView } from './AlphabetBespokeView';
import { NvidiaBespokeView } from './NvidiaBespokeView';
import { TeslaBespokeView } from './TeslaBespokeView';
import { SpaceXBespokeView } from './SpaceXBespokeView';

interface BespokeStockSlotProps {
  profile: SingleStockProfile;
  fundamentals: StockFundamentals;
}

/**
 * BespokeStockSlot:
 * 개별 주식마다 획일적인 템플릿에서 벗어나, 해당 기업의 핵심 투자 논점(Thesis)·단위 경제학·독자 조사 데이터를
 * 자유로운 전용 UI로 구현하는 플러그인 슬롯입니다.
 */
export const BespokeStockSlot: React.FC<BespokeStockSlotProps> = ({
  profile,
  fundamentals,
}) => {
  const sym = profile.symbol.toUpperCase();

  if (sym === 'GOOGL' || sym === 'GOOG') {
    return <AlphabetBespokeView fundamentals={fundamentals} />;
  }

  if (sym === 'NVDA') {
    return <NvidiaBespokeView fundamentals={fundamentals} />;
  }

  if (sym === 'TSLA') {
    return <TeslaBespokeView fundamentals={fundamentals} />;
  }

  if (sym === 'SPCX' || sym === 'SPACEX') {
    return <SpaceXBespokeView fundamentals={fundamentals} />;
  }

  return null;
};
