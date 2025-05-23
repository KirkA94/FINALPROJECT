import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  bgColor?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, bgColor = '#007bff', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: disabled ? '#ccc' : bgColor,
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
};

export default Button;