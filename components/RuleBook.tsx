import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import rulebook from "/public/data/rulebook.json";

interface RuleCategory {
  title: string;
  rules: string[];
}

const RuleBook = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (key: string) => {
    setOpenCategory(prev => (prev === key ? null : key));
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        📘 My Rulebook
      </h2>

      {Object.entries(rulebook).map(([key, value]) => {
        const category = value as RuleCategory;
        const isOpen = openCategory === key;

        return (
          <div
            key={key}
            className="glass-card rounded-xl p-4 mb-3"
          >
            <button
              onClick={() => toggleCategory(key)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-white">
                {category.title}
              </h3>

              {isOpen ? (
                <ChevronDown className="text-gray-400" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-2 text-gray-300"
                >
                  {category.rules.map((rule, index) => (
                    <li
                      key={index}
                      className="pl-2 border-l border-white/10"
                    >
                      • {rule}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default RuleBook;
