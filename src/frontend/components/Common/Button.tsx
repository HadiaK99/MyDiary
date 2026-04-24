import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const StyledButton = styled.button<{ $variant?: string; $size?: string; $fullWidth?: boolean }>`
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  /* Size variants */
  padding: ${({ $size }) => {
    if ($size === 'small') return '8px 16px';
    if ($size === 'large') return '20px 32px';
    return '15px 24px';
  }};
  font-size: ${({ $size }) => {
    if ($size === 'small') return '0.9rem';
    if ($size === 'large') return '1.2rem';
    return '1rem';
  }};
  border-radius: ${({ $size }) => ($size === 'small' ? '12px' : '20px')};
  font-weight: ${({ $size }) => ($size === 'small' ? '600' : '800')};

  /* Full width */
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  /* Color variants */
  ${({ $variant }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: #e2e8f0;
          color: #475569;
          &:hover {
            background: #cbd5e1;
            transform: scale(1.02);
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
          &:hover {
            background: #dc2626;
            transform: scale(1.02);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: var(--primary);
          padding: 0;
          &:hover {
            text-decoration: underline;
          }
        `;
      case 'primary':
      default:
        return `
          background: var(--primary);
          color: white;
          box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2);
          &:hover {
            background: #db2777;
            transform: scale(1.02);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
};
