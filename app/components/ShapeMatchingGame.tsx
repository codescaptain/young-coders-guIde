import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '~/utils/isTouchDevice';

interface Item {
  id: string;
  image: string;
  shadow: string;
}

const initialItems: Item[] = [
  { id: '1', image: '/images/shape/d1.jpg', shadow: '/images/shape/d1-shadow.jpg' },
  { id: '2', image: '/images/shape/d2.jpg', shadow: '/images/shape/d2-shadow.jpg' },
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
      style={{backgroundColor: 'white'}}
      ref={drop}
      className={`shadow ${isOver ? 'over' : ''} ${isMatched ? 'matched' : ''}`}
    >
      <img src={item.shadow} alt="Shadow" />
    </div>
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
  const [items] = useState(initialItems);
  const [shadows, setShadows] = useState<Item[]>([]);
  const [matches, setMatches] = useState<string[]>([]);

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
    if (matches.length === items.length) {
      console.log('All items matched!');
    }
  }, [matches, items]);

  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <div className="shadow-matching-game">
        <h2>Gölge Eşleştirme</h2>
        <p>Resmi eşleşen gölgeye sürükleyip bırakın.</p>
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
        {matches.length === items.length && (
          <div className="success-message">Tebrikler! Tüm eşleştirmeleri başarıyla tamamladınız!</div>
        )}
      </div>
    </DndProvider>
  );
};

export default ShadowMatchingGame;