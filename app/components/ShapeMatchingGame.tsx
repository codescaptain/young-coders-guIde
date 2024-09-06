import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '~/utils/isTouchDevice';
import { useTranslation } from 'react-i18next'; // Çeviri hook'unu ekledik

interface Item {
  id: string;
  image: string;
  shadow: string;
  category: string;
}

const initialItems: Item[] = [
  { id: '1', image: '/images/shape/d1.jpg', shadow: '/images/shape/d1-shadow.jpg', category: 'animal' },
  { id: '2', image: '/images/shape/d2.jpg', shadow: '/images/shape/d2-shadow.jpg', category: 'animal' },
  { id: '3', image: '/images/shape/banana.jpg', shadow: '/images/shape/banana_shadow.jpg', category: 'fruit' },
  { id: '4', image: '/images/shape/strawberry.jpg', shadow: '/images/shape/strawberry_shadow.jpg', category: 'fruit' },
  { id: '5', image: '/images/shape/chair.jpg', shadow: '/images/shape/chair_shadow.jpg', category: 'object' },
  { id: '6', image: '/images/shape/pencil.jpg', shadow: '/images/shape/pencil_shadow.jpg', category: 'object' },
];

const DraggableItem: React.FC<{ item: Item; isMatched: boolean }> = ({ item, isMatched }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'item',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isMatched,
  }));

  return (
    <div
      ref={drag}
      className={`item ${isDragging ? 'dragging' : ''} ${isMatched ? 'matched' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1, touchAction: 'none' }}
    >
      <img src={item.image} alt="Item" />
    </div>
  );
};

const ShadowTarget: React.FC<{ item: Item; onDrop: (id: string) => void; isMatched: boolean }> = ({ item, onDrop, isMatched }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'item',
    drop: (droppedItem: { id: string }) => onDrop(droppedItem.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    canDrop: () => !isMatched,
  }));

  return (
    <div
      style={{ backgroundColor: 'white' }}
      ref={drop}
      className={`shadow ${isOver ? 'over' : ''} ${isMatched ? 'matched' : ''}`}
    >
      <img src={item.shadow} alt="Shadow" />
    </div>
  );
};


const CategoryButton: React.FC<{ category: string; onClick: () => void }> = ({ category, onClick }) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (category) {
      case 'animal':
        return '🐘';
      case 'fruit':
        return '🍎';
      case 'object':
        return '🪑';
      default:
        return '❓';
    }
  };

  return (
    <button className={`category-button ${category}`} onClick={onClick}>
      <span className="category-icon">{getIcon()}</span>
      <span className="category-label">{t(`categories.${category}`, { defaultValue: t('categories.unknown') })}</span>
    </button>
  );
};

const shuffleArray = <T extends any>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ShadowMatchingGame: React.FC = () => {
  const { t } = useTranslation(); // Çeviri hook'unu kullandık
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [shadows, setShadows] = useState<Item[]>([]);
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      const filteredItems = initialItems.filter(item => item.category === selectedCategory);
      setItems(shuffleArray(filteredItems));
    } else {
      setItems([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setShadows(shuffleArray([...items]));
  }, [items]);

  const handleDrop = useCallback((shadowId: string, droppedItemId: string) => {
    if (shadowId === droppedItemId) {
      setMatches(prevMatches => {
        const newMatches = [...prevMatches, shadowId];
        console.log('Updated matches:', newMatches);
        return newMatches;
      });
    }
  }, []);

  const isMatched = useCallback((id: string) => matches.includes(id), [matches]);

  useEffect(() => {
    console.log('Current matches:', matches);
    if (matches.length === items.length && items.length > 0) {
      console.log('All items matched!');
    }
  }, [matches, items]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setMatches([]);
  };

  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  console.log(selectedCategory);


  return (
    <DndProvider backend={backendForDND}>
      <div className="shadow-matching-game">
        <h2>{t('shadow_matching')}</h2>
        {!selectedCategory ? (
          <div className="category-selection">
            <h3>{t('please_select_category')}</h3>
            <div className="category-buttons">
              <CategoryButton category="animal" onClick={() => handleCategorySelect('animal')} />
              <CategoryButton category="fruit" onClick={() => handleCategorySelect('fruit')} />
              <CategoryButton category="object" onClick={() => handleCategorySelect('object')} />
            </div>
          </div>
        ) : (
          <>
            <p>{t('drag_and_drop')}</p>
            <p>{t('category')}: {t(`categories.${selectedCategory}`)}</p>
            <div className="game-container">
              <div className="items-column">
                {items.map(item => (
                  <DraggableItem key={item.id} item={item} isMatched={isMatched(item.id)} />
                ))}
              </div>
              <div className="shadows-column">
                {shadows.map(shadow => (
                  <ShadowTarget
                    key={shadow.id}
                    item={shadow}
                    onDrop={(droppedItemId) => handleDrop(shadow.id, droppedItemId)}
                    isMatched={isMatched(shadow.id)}
                  />
                ))}
              </div>
            </div>
            {matches.length === items.length && items.length > 0 && (
              <div className="success-message">
                {t('congratulations')}
                <button onClick={() => setSelectedCategory(null)}>{t('select_new_category')}</button>
              </div>
            )}
          </>
        )}
      </div>
    </DndProvider>
  );
};

export default ShadowMatchingGame;
