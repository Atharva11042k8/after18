import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

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
      .then(setRulebook);
  }, []);

  if (!rulebook) return null;

  return (
    <div className="glass-card rounded-2xl p-5 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-blue-400 text-xl">📘</span>
        <h2 className="text-lg font-semibold text-white">
          My Rulebook
        </h2>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {Object.entries(rulebook).map(([key, category]) => {
          const isOpen = openKey === key;

          return (
            <div key={key}>
              {/* Category Row (Life Checklist style) */}
              <button
                onClick={() => setOpenKey(isOpen ? null : key)}
                className="
                  w-full flex items-center justify-between
                  rounded-xl px-4 py-3
                  bg-white/5 hover:bg-white/10
                  transition
                "
              >
                <span className="text-white text-sm font-medium">
                  {category.title}
                </span>

                {isOpen ? (
                  <ChevronDown className="text-gray-400" size={18} />
                ) : (
                  <ChevronRight className="text-gray-400" size={18} />
                )}
              </button>

              {/* Expanded Rules */}
              {isOpen && (
                <div className="mt-2 ml-2 space-y-2">
                  {category.rules.map((rule, i) => (
                    <div
                      key={i}
                      className="
                        rounded-lg px-4 py-2
                        text-sm text-gray-300
                        bg-white/3
                        border border-white/5
                      "
                    >
                      {rule}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RuleBook;
