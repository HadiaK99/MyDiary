import React from 'react';
import styled from 'styled-components';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured' | 'quick' | 'pink' | 'blue' | 'green';
  padding?: string;
  minHeight?: string;
}

const StyledCard = styled.div<{ $variant?: string; $padding?: string; $minHeight?: string }>`
  border-radius: var(--radius-lg, 24px);
  padding: ${({ $padding }) => $padding || '30px'};
  min-height: ${({ $minHeight }) => $minHeight || 'auto'};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  ${({ $variant }) => {
    switch ($variant) {
      case 'featured':
        return `
          background: linear-gradient(135deg, #fde68a 0%, #facc15 100%);
          color: #854d0e;
          justify-content: center;
          align-items: center;
          text-align: center;
          margin-bottom: 40px;
        `;
      case 'quick':
        return `
          border-radius: var(--radius-md, 16px);
          padding: 24px;
          gap: 12px;
          background: white;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        `;
      case 'pink':
        return `
          background: #fecaca;
          color: #7f1d1d;
          border-radius: var(--radius-md, 16px);
          padding: 24px;
        `;
      case 'blue':
        return `
          background: #c7d2fe;
          color: #1e3a8a;
          border-radius: var(--radius-md, 16px);
          padding: 24px;
        `;
      case 'green':
        return `
          background: #bbf7d0;
          color: #064e3b;
          border-radius: var(--radius-md, 16px);
          padding: 24px;
        `;
      case 'default':
      default:
        return `
          background: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        `;
    }
  }}
`;

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding,
  minHeight,
  children,
  ...props
}) => {
  return (
    <StyledCard $variant={variant} $padding={padding} $minHeight={minHeight} {...props}>
      {children}
    </StyledCard>
  );
};
