import React, { useState, useCallback } from 'react';
import Card1 from '@/components/cards/1';
import Card2 from '@/components/cards/2';
import Card3 from '@/components/cards/3';
import Card4 from '@/components/cards/4';
import Card5 from '@/components/cards/5';
import Card6 from '@/components/cards/6';
import Card7 from '@/components/cards/7';
import Card8 from '@/components/cards/8';
import Card9 from '@/components/cards/9';
import Card10 from '@/components/cards/10';
import Card11 from '@/components/cards/11';

const CARDS = [
  Card1, Card2, Card3, Card4, Card5,
  Card6, Card7, Card8, Card9, Card10, Card11
];

function ExploreMode() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleCardClick = useCallback(() => {
    setCurrentCardIndex((prev) => (prev + 1) % CARDS.length);
  }, []);

  const CurrentCard = CARDS[currentCardIndex];

  return (
    <div className="flex-1 p-4 h-[calc(100vh-68px)]">
      <div 
        className="h-full w-full rounded-xl shadow-xl cursor-pointer overflow-hidden" 
        onClick={handleCardClick}
      >
        <div className="h-full w-full overflow-auto scrollbar-thin rounded-xl
          scrollbar-track-blue-50 scrollbar-thumb-blue-100 hover:scrollbar-thumb-blue-200 bg-white">
          <CurrentCard />
        </div>
      </div>
    </div>
  );
}

export default ExploreMode;