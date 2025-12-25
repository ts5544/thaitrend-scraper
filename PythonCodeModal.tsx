import React from 'react';
import { PythonScriptProps } from '../types';

const PythonCodeModal: React.FC<PythonScriptProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const codeString = `# Python Script for Termux (Android)
# Requires: pip install requests beautifulsoup4 rich

import requests
from bs4 import BeautifulSoup
from collections import Counter
from rich.console import Console
from rich.table import Table

console = Console()

def get_trends():
    # URLs of popular Thai news sites
    urls = [
        "https://www.thairath.co.th/home",
        "https://www.sanook.com/news/",
        "https://www.matichon.co.th/"
    ]
    
    all_text = ""
    
    console.print("[yellow]Scanning websites...[/yellow]")
    
    for url in urls:
        try:
            console.print(f"Fetching {url}...")
            headers = {'User-Agent': 'Mozilla/5.0'}
            r = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(r.content, 'html.parser')
            
            # Extract headlines (h1, h2, h3 tags usually contain titles)
            for tag in soup.find_all(['h1', 'h2', 'h3']):
                all_text += " " + tag.get_text()
        except Exception as e:
            console.print(f"[red]Error fetching {url}: {e}[/red]")

    # Simple word frequency (Thai requires a dedicated tokenizer like PyThaiNLP, 
    # but for simplicity we split by spaces for demo)
    # Note: In real production, use PyThaiNLP for accurate Thai word segmentation.
    words = all_text.split()
    # Filter short words/garbage
    clean_words = [w for w in words if len(w) > 3]
    
    count = Counter(clean_words)
    top_3 = count.most_common(3)
    
    table = Table(title="Top 3 Trending Words")
    table.add_column("Rank", style="cyan")
    table.add_column("Word", style="magenta")
    table.add_column("Frequency", style="green")
    
    for i, (word, freq) in enumerate(top_3, 1):
        table.add_row(str(i), word, str(freq))
        
    console.print(table)

if __name__ == "__main__":
    get_trends()
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-3 text-slate-200 font-mono text-sm">termux_script.py</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-0 overflow-auto flex-1 bg-[#0d1117]">
          <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-400 leading-relaxed overflow-x-auto selection:bg-emerald-900 selection:text-white">
            <code>{codeString}</code>
          </pre>
        </div>
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end">
           <button 
            onClick={() => {
                navigator.clipboard.writeText(codeString);
                alert('Copied to clipboard!');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
           >
             Copy Code
           </button>
        </div>
      </div>
    </div>
  );
};

export default PythonCodeModal;