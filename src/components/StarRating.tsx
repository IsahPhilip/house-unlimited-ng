import React from 'react';

interface StarRatingProps {
  rating: number;
  setRating?: (r: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  setRating, 
  interactive = false, 
  size = "sm" 
}) => {
  const iconSize = size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating?.(star)}
          className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
};
