import React, { useState, useCallback } from 'react';
import { SCENARIOS } from './constants';
import { Scenario, ImageFile } from './types';
import ScenarioSelector from './components/ScenarioSelector';
import ImageInput from './components/ImageInput';
import ResultViewer from './components/ResultViewer';
import { analyzeImage } from './services/geminiService';
import { Sparkles, ScanLine } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [currentImage, setCurrentImage] = useState<ImageFile | null>(null);
  const [resultText, setResultText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  // Custom prompt handling (local override of scenario prompt)
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // When scenario changes, update the prompt to default
  const handleScenarioChange = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCustomPrompt(''); 
    setResultText(''); // Clear previous result on scenario change
  };

  const handleCustomPromptChange = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  const handleAnalyze = async () => {
    if (!currentImage) return;

    setIsAnalyzing(true);
    setResultText('');

    try {
      // Use custom prompt if actively editing, otherwise undefined (service uses default)
      const promptToUse = isCustomizing && customPrompt.trim() !== '' 
        ? customPrompt 
        : (customPrompt || selectedScenario.prompt);

      const text = await analyzeImage(
        currentImage.data,
        currentImage.mimeType,
        selectedScenario,
        promptToUse
      );
      setResultText(text);
    } catch (error) {
      console.error(error);
      setResultText("错误：无法分析图片。请检查网络或尝试其他图片。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper to sync custom prompt display
  const currentDisplayScenario = {
    ...selectedScenario,
    prompt: customPrompt || selectedScenario.prompt
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans selection:bg-primary/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg shadow-lg shadow-primary/20">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              VisionCraft AI
            </span>
          </div>
          <div className="text-[10px] sm:text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            Gemini 2.5 Flash
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8 relative z-10">
        
        {/* Intro Text */}
        <div className="text-center space-y-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            视觉内容 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">智能洞察</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            上传图片，定义规则，秒级提取精准数据。
          </p>
        </div>

        {/* Step 1: Scenario Selection */}
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          <ScenarioSelector 
            selectedScenario={currentDisplayScenario} 
            onSelect={handleScenarioChange}
            onCustomPromptChange={handleCustomPromptChange}
            isCustomizing={isCustomizing}
            setIsCustomizing={setIsCustomizing}
          />
        </div>

        {/* Step 2: Image Upload */}
        <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <ImageInput 
            currentImage={currentImage}
            onImageSelected={(img) => {
              setCurrentImage(img);
              setResultText(''); // Clear old results on new image
            }}
            onClear={() => {
              setCurrentImage(null);
              setResultText('');
            }}
          />
          
          {/* Analyze Button (Floating over the image container) */}
          {currentImage && !isAnalyzing && !resultText && (
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center z-30">
              <button
                onClick={handleAnalyze}
                className="group flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-primary/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ring-4 ring-slate-950"
              >
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                <span className="tracking-wide">开始智能分析</span>
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Result */}
        {(resultText || isAnalyzing) && (
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ResultViewer 
              text={resultText} 
              isLoading={isAnalyzing}
              onUpdate={setResultText}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;