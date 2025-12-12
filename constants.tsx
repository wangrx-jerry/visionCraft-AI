import { Scenario } from './types';
import { 
  FileText, 
  Camera, 
  Receipt, 
  MapPin, 
  Code, 
  Edit3 
} from 'lucide-react';
import React from 'react';

export const SCENARIOS: Scenario[] = [
  {
    id: 'general',
    title: '通用描述',
    icon: 'FileText',
    description: '获取图像内容的详细描述。',
    prompt: '分析这张图片并提供视觉内容的全面描述，包括物体、颜色、环境以及任何可见的文字。请用中文回答。',
    systemInstruction: '你是一个乐于助人的视觉助手。清晰、简洁地描述图像。请用中文回答。'
  },
  {
    id: 'receipt',
    title: '收据/小票提取',
    icon: 'Receipt',
    description: '提取商家、日期、总金额和明细项目。',
    prompt: '分析这张收据图片。提取商家名称、日期、总金额以及购买项目的列表和价格。将输出格式化为清晰易读的列表。请用中文回答。',
    systemInstruction: '你是一个数据录入自动化机器人。对数字和货币要精确。'
  },
  {
    id: 'handwriting',
    title: '手写 OCR',
    icon: 'Edit3',
    description: '将手写笔记转换为数字文本。',
    prompt: '准确转录这张图片中的手写文字。尽可能保留换行符。如果单词难以辨认，请标记为 [无法辨认]。',
    systemInstruction: '你是一个专业的转录员。不要总结，要逐字转录。'
  },
  {
    id: 'landmark',
    title: '旅行向导',
    icon: 'MapPin',
    description: '识别地标并提供历史背景。',
    prompt: '识别照片中的地标或地点。提供它的名称、位置，以及关于它的简短 3 句话历史摘要或有趣的事实。请用中文回答。',
    systemInstruction: '你是一个知识渊博的导游。'
  },
  {
    id: 'code',
    title: '代码扫描',
    icon: 'Code',
    description: '从屏幕截图中提取代码片段。',
    prompt: '从这张图片中提取代码。仅返回格式正确的代码块，并使用适当的语言（如 Python、JavaScript、HTML）。不要添加对话填充词。',
    systemInstruction: '你是一个编码助手。输出有效的代码。'
  }
];

export const getIconComponent = (iconName: string, className?: string) => {
  const icons: Record<string, React.FC<{ className?: string }>> = {
    FileText,
    Camera,
    Receipt,
    MapPin,
    Code,
    Edit3
  };
  const Icon = icons[iconName] || FileText;
  return <Icon className={className} />;
};