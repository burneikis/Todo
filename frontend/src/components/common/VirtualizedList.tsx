import React, { useState, useRef, useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  overflow: auto;
  position: relative;
`;

const InnerContainer = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  position: relative;
`;

const ItemContainer = styled.div<{ top: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: 0;
  right: 0;
`;

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  containerHeight: number;
  overscan?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  containerHeight,
  overscan = 5,
  className,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { visibleItems, totalHeight } = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visible = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        visible.push({
          index: i,
          item: items[i],
          top: i * itemHeight,
        });
      }
    }

    return {
      visibleItems: visible,
      totalHeight: items.length * itemHeight,
    };
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <Container
      ref={containerRef}
      onScroll={handleScroll}
      className={className}
      style={{ height: containerHeight }}
    >
      <InnerContainer height={totalHeight}>
        {visibleItems.map(({ index, item, top }) => (
          <ItemContainer key={index} top={top}>
            {renderItem(item, index)}
          </ItemContainer>
        ))}
      </InnerContainer>
    </Container>
  );
}