import { useState } from 'react';
import { downloadReport, getAISummary } from '../services/api';
import { FileText, Download, Sparkles, Loader2, FileCheck2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [downloading, setDownloading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadReport();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LifeLink_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Report downloaded successfully');
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setDownloading(false);
    }
  };

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const data = await getAISummary();
      setAiSummary(data.summary);
      toast.success('Analysis complete');
    } catch (err) {
      toast.error('AI Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Health Reports & AI Insights</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Generate PDF reports and get AI-powered health analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Report Card */}
        <div className="glass-card p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
            <FileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Detailed PDF Report</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1">
            Download a comprehensive summary of your recent vitals, complete with charts and analysis, ready to share with your doctor.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary w-full max-w-xs flex items-center justify-center gap-2"
          >
            {downloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            {downloading ? 'Generating PDF...' : 'Download Report'}
          </button>
        </div>

        {/* AI Insights Card */}
        <div className="glass-card p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
            <Sparkles size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Health Analysis</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1">
            Get instant AI-driven insights based on your recent health trends, risk predictions, and lifestyle recommendations.
          </p>
          <button
            onClick={handleAIAnalysis}
            disabled={analyzing}
            className="w-full max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-6 py-3 transition-all shadow-lg shadow-purple-500/30 active:scale-95 disabled:opacity-60"
          >
            {analyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            {analyzing ? 'Analyzing Vitals...' : 'Generate Insights'}
          </button>
        </div>
      </div>

      {aiSummary && (
        <div className="glass-card p-8 animate-slide-up border-t-4 border-t-purple-500">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck2 className="text-purple-500" size={24} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Analysis Result</h3>
          </div>
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/5 rounded-xl p-6 border border-slate-100 dark:border-white/10">
            {aiSummary.split('\n').map((line, i) => (
              <p key={i} className="mb-2 last:mb-0">{line}</p>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 text-right italic">
            Disclaimer: AI insights are for informational purposes only. Do not use this as a substitute for professional medical advice.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
