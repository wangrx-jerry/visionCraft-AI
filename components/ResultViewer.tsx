import React, { useState, useEffect } from 'react';
import { Copy, Check, Edit2, Save } from 'lucide-react';

interface Props {
  text: string;
  onUpdate: (newText: string) => void;
  isLoading: boolean;
}

const ResultViewer: React.FC<Props> = ({ text, onUpdate, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(localText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onUpdate(localText);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-surface rounded-xl p-6 border border-slate-700/50 min-h-[200px] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-slate-400 animate-pulse">AI 正在分析视觉数据...</p>
      </div>
    );
  }

  if (!text && !isLoading) return null;

  return (
    <div className="w-full bg-surface rounded-xl overflow-hidden border border-slate-700 shadow-xl mt-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          分析结果
        </h3>
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
              title="编辑文本"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="p-2 hover:bg-green-500/20 rounded-lg text-green-400 transition"
              title="保存更改"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
          
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
            title="复制到剪贴板"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-0">
        {isEditing ? (
          <textarea
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            className="w-full h-[300px] bg-slate-900 p-6 text-slate-200 focus:outline-none focus:bg-slate-900/50 resize-y font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="w-full min-h-[200px] max-h-[500px] overflow-y-auto p-6 bg-slate-900/30 text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed selection:bg-primary/30">
            {localText}
          </div>
        )}
      </div>
      
      {/* Footer Status */}
      <div className="px-6 py-2 bg-slate-950/30 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
        <span>由 Gemini 2.5 Flash 生成</span>
        <span>{localText.length} 字符</span>
      </div>
    </div>
  );
};

export default ResultViewer;