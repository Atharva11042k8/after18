import React, { useState } from 'react';
import { Book, ChevronDown, Activity, BookOpen, Brain, Coins, Shield, Star } from 'lucide-react';
import { RuleCategory } from '../types';

interface RulebookProps {
  categories: RuleCategory[];
}

const iconMap: Record<string, React.ReactNode> = {
  'activity': <Activity size={18} />,
  'book-open': <BookOpen size={18} />,
  'brain': <Brain size={18} />,
  'coins': <Coins size={18} />,
  'shield': <Shield size={18} />,
  'star': <Star size={18} />,
};

const Rulebook: React.FC<RulebookProps> = ({ categories }) => {
  // Track which category index is currently open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
       {/* Background decoration */}
      <div className="absolute top-0 left-0 p-40 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Book className="text-orange-400" size={20} />
        <div>
            <h3 className="text-xl font-medium text-white">Rulebook</h3>
            <p className="text-sm text-gray-400">Principles & Life Lessons</p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {categories.map((cat, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className={`
                rounded-xl border transition-all duration-300 overflow-hidden
                ${isOpen 
                  ? 'bg-white/5 border-orange-500/20 shadow-lg' 
                  : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'}
              `}
            >
              <button
                onClick={() => toggleCategory(index)}
                className="w-full flex items-center justify-between p-4 text-left outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-colors duration-300
                    ${isOpen ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-400'}
                  `}>
                    {iconMap[cat.icon] || <Star size={18} />}
                  </div>
                  <span className={`font-medium transition-colors ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                    {cat.category}
                  </span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              <div 
                className={`
                  transition-[max-height,opacity] duration-300 ease-in-out
                  ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="px-4 pb-4 pt-0">
                  <ul className="space-y-2 pl-2">
                    {cat.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
                No rules defined yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default Rulebook;
