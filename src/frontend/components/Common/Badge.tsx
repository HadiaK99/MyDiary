import React from 'react';
import styled from 'styled-components';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'primary';
  size?: 'small' | 'medium';
}

const StyledBadge = styled.span<{ $variant?: string; $size?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  font-weight: 700;
  
  /* Size variants */
  padding: ${({ $size }) => ($size === 'small' ? '4px 8px' : '6px 12px')};
  font-size: ${({ $size }) => ($size === 'small' ? '0.7rem' : '0.8rem')};

  /* Color variants */
  ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 'warning':
        return `
          background: #fef08a;
          color: #854d0e;
        `;
      case 'error':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'primary':
        return `
          background: var(--primary);
          color: white;
        `;
      case 'neutral':
      default:
        return `
          background: #f1f5f9;
          color: #475569;
        `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <StyledBadge $variant={variant} $size={size} {...props}>
      {children}
    </StyledBadge>
  );
};
