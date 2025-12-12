import React, { useState } from 'react';
import { Scenario } from '../types';
import { SCENARIOS, getIconComponent } from '../constants';
import { Settings, ChevronDown, Check } from 'lucide-react';

interface Props {
  selectedScenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  onCustomPromptChange: (prompt: string) => void;
  isCustomizing: boolean;
  setIsCustomizing: (val: boolean) => void;
}

const ScenarioSelector: React.FC<Props> = ({ 
  selectedScenario, 
  onSelect, 
  onCustomPromptChange,
  isCustomizing,
  setIsCustomizing
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 relative z-20">
      <label className="block text-sm font-medium text-slate-400 mb-2">
        分析场景
      </label>
      
      {/* Dropdown Trigger */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 bg-surface border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-primary transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              {getIconComponent(selectedScenario.icon, "w-6 h-6")}
            </div>
            <div>
              <h3 className="font-semibold text-white">{selectedScenario.title}</h3>
              <p className="text-sm text-slate-400 truncate max-w-[200px] sm:max-w-md">
                {selectedScenario.description}
              </p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 w-20
            ${isCustomizing 
              ? 'bg-secondary/20 border-secondary text-secondary' 
              : 'bg-surface border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          title="自定义规则"
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">编辑</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  onSelect(scenario);
                  setIsOpen(false);
                  // Reset custom mode if switching scenarios to avoid confusion, 
                  // or keep it if you want to apply custom prompt to new icon. 
                  // Let's reset for clarity.
                  setIsCustomizing(false);
                }}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors text-left
                  ${selectedScenario.id === scenario.id 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'hover:bg-slate-700/50 border border-transparent'
                  }`}
              >
                <div className={`mt-1 ${selectedScenario.id === scenario.id ? 'text-primary' : 'text-slate-400'}`}>
                  {getIconComponent(scenario.icon, "w-5 h-5")}
                </div>
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {scenario.title}
                    {selectedScenario.id === scenario.id && <Check className="w-3 h-3 text-primary" />}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{scenario.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Prompt Editor */}
      {isCustomizing && (
        <div className="mt-4 p-4 bg-slate-800/50 border border-secondary/30 rounded-xl animate-in slide-in-from-top-2">
          <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
            自定义指令规则
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all placeholder-slate-600"
            rows={3}
            value={selectedScenario.prompt} // Note: Parent handles state update which reflects here
            onChange={(e) => onCustomPromptChange(e.target.value)}
            placeholder="告诉 AI 具体需要寻找什么..."
          />
          <p className="text-xs text-slate-500 mt-2">
            编辑上面的提示词，以微调 AI 从您的图像中提取的内容。
          </p>
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;