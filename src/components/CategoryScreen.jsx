import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORIES } from '../utils/categories';

export default function CategoryScreen({ selected, onSelect }) {
  const { language, t } = useLanguage();

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C2C2C]">{t('categoryTitle')}</h2>
        <p className="text-[#6B6B6B] text-sm mt-1">{t('categorySubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          // Get the label based on current language
          const label = language === 'en' ? cat.labelEn : cat.labelHi;
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`
                card p-4 text-center transition-all duration-200
                hover:shadow-md active:scale-95
                ${isSelected 
                  ? 'border-2 border-accent shadow-md scale-[1.02]' 
                  : 'border border-secondary-dark/30 hover:border-primary/30'
                }
              `}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium text-[#2C2C2C]">
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}