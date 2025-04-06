
import React from 'react';

interface AssetDisplayProps {
  symbol: string;
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ 
  symbol, 
  icon, 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base'
  };
  
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!imageError ? (
        <img 
          src={icon} 
          alt={symbol}
          className={`${sizeClasses[size]} rounded-full`}
          onError={handleImageError}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-bridge-purple to-bridge-teal flex items-center justify-center text-white font-bold`}>
          {symbol.charAt(0)}
        </div>
      )}
      <span>{symbol}</span>
    </div>
  );
};

export default AssetDisplay;
