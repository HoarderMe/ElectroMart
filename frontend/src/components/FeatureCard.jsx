import React from 'react';

const FeatureCard = ({ title, imageSrc, imageAlt }) => {
  return (
    <div className="flex flex-col items-center transition-transform duration-300 transform hover:scale-105">
      <img src={imageSrc} alt={imageAlt} className="h-24 w-24 object-contain mb-2" />
      <h3 className="text-lg font-medium text-gray-900 tracking-tight text-center">
        {title}
      </h3>
    </div>
  );
};

export default FeatureCard;