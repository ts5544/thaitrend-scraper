export interface TrendingItem {
  keyword: string;
  context: string;
  source: string;
  rank: number;
}

export interface AnalysisResult {
  trends: TrendingItem[];
  sources: string[];
  rawOutput: string;
}

export interface PythonScriptProps {
  isVisible: boolean;
  onClose: () => void;
}