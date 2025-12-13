import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface RuleCategory {
  title: string;
  rules: string[];
}

type RuleBookData = Record<string, RuleCategory>;

const RuleBook = () => {
  const [rulebook, setRulebook] = useState<RuleBookData | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/rulebook.json")
      .then(res => res.json())
      .then(setRulebook)
      .catch(err => console.error("Rulebook fetch error", err));
  }, []);

  if (!rulebook) {
    return (
      <div className="text-gray-400 p-4">
        Loading Rulebook...
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-2xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">
        📘 My Rulebook
      </h2>

      {Object.entries(rulebook).map(([key, category]) => {
        const isOpen = openKey === key;

        return (
          <div key={key} className="mb-3 bg-white/5 rounded-xl p-4">
            <button
              onClick={() => setOpenKey(isOpen ? null : key)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="text-white font-medium">
                {category.title}
              </span>
              {isOpen ? (
                <ChevronDown className="text-gray-400" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </button>

            {isOpen && (
              <ul className="mt-3 space-y-2 text-gray-300">
                {category.rules.map((rule, i) => (
                  <li key={i} className="pl-3 border-l border-white/10">
                    • {rule}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RuleBook;
