export interface Scenario {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  description: string;
  prompt: string;
  systemInstruction?: string;
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export interface ImageFile {
  data: string; // Base64
  mimeType: string;
}
