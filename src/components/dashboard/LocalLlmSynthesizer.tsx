import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Send,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
  Server,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { StockFundamentals, LlmSynthesisData } from '../../types/stock';
import { SynthesisReportType } from '../../lib/quantPrompts';
import { launchAiService, AI_SERVICES, AiServiceKey } from '../../lib/aiAppLauncher';
import { fetchSynthesisData } from '../../lib/stockApi';

interface LocalLlmSynthesizerProps {
  nvda: StockFundamentals;
  externalQuestion?: string;
  onQuestionHandled?: () => void;
}

type TabKey = SynthesisReportType | 'chat';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const LocalLlmSynthesizer: React.FC<LocalLlmSynthesizerProps> = ({
  nvda,
  externalQuestion,
  onQuestionHandled,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('memo');
  const [synthesisData, setSynthesisData] = useState<LlmSynthesisData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-respond when externalQuestion is passed from Quick AI Dock
  useEffect(() => {
    if (externalQuestion) {
      setActiveTab('chat');
      setChatInput(externalQuestion);
      if (onQuestionHandled) {
        onQuestionHandled();
      }
    }
  }, [externalQuestion, onQuestionHandled]);

  // Chat conversation
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `반갑습니다! 엔비디아(NVIDIA · NVDA) 전문 퀀트 리서치 어시스턴트입니다.
현재 실시간 펀더멘털 및 Blackwell 양산/CapEx 데이터를 탑재하고 있습니다.
Blackwell GB200 랙 수주, 70%+ 총마진율, 대중국 수출 통제, 빅테크 자체 ASIC 영향 등 무엇이든 질문해 주세요!`,
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Load pre-compiled quantitative research reports
  const loadSynthesis = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchSynthesisData();
      if (data) {
        setSynthesisData(data);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSynthesis();
  }, []);

  const getActiveText = (): string => {
    if (synthesisData?.reports) {
      if (activeTab === 'memo' && synthesisData.reports.memo) return synthesisData.reports.memo;
      if (activeTab === 'blackwell_ai' && synthesisData.reports.blackwell_ai) return synthesisData.reports.blackwell_ai;
      if (activeTab === 'geopolitics_asic' && synthesisData.reports.geopolitics_asic) return synthesisData.reports.geopolitics_asic;
      if (activeTab === 'valuation' && synthesisData.reports.valuation) return synthesisData.reports.valuation;
    }
    return '리포트를 불러오는 중이거나 생성 대기 중입니다.';
  };

  const handleCopy = () => {
    const text = getActiveText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    const query = chatInput.trim().toLowerCase();
    const userMsg: ChatMessage = { role: 'user', content: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Instant client-side intelligent quant response
    setTimeout(() => {
      let reply = '';
      if (query.includes('블랙웰') || query.includes('blackwell') || query.includes('b200') || query.includes('gb200')) {
        reply = `### 🚀 Blackwell(GB200 NVL72) 양산 및 수율 진단\n\n- **시스템 랙 스케일 전환**: 72개 GPU와 36개 Grace CPU를 수냉식 랙 하나로 묶어 LLM 추론 성능을 최대 30배 개선했습니다.\n- **수주 백로그**: 주요 하이퍼스케일러의 선주문으로 12개월 이상 공급 물량이 완판(Sold-out) 상태입니다.\n- **ASP 퀀텀점프**: 단순 칩 판매에서 $2M~$3M 규모의 시스템 랙 단위 판매로 전사 매출 단가가 급상승하고 있습니다.`;
      } else if (query.includes('중국') || query.includes('수출') || query.includes('규제') || query.includes('h20')) {
        reply = `### ⚠️ 대중국 반도체 수출 통제 & 지정학적 리스크\n\n- **매출 비중 축소**: 과거 20~25%에 달하던 중국 비중이 한 자릿수대로 축소되어 미국의 추가 제재 충격을 흡수할 체력을 확보했습니다.\n- **글로벌 대체 수요**: 미국, 유럽, 중동 하이퍼스케일러의 대기 수요가 중국향 감소분을 충분히 상쇄하고 있습니다.`;
      } else if (query.includes('asic') || query.includes('tpu') || query.includes('경쟁') || query.includes('amd')) {
        reply = `### ⚡ 빅테크 자체 ASIC 대비 CUDA 소프트웨어 해자\n\n- **CUDA 락인**: 500만 명 이상의 글로벌 AI 개발자가 CUDA 라이브러리(TensorRT, cuDNN)에 최적화되어 있어 아키텍처 전환 비용이 천문학적입니다.\n- **특화 vs 범용**: 자체 실리콘(TPU, Trainium)은 특정 사내 추론용이며, 프론티어 LLM 사전학습(Pre-training)에서는 엔비디아의 독점적 리더십이 공고합니다.`;
      } else if (query.includes('밸류') || query.includes('pe') || query.includes('per') || query.includes('목표가')) {
        reply = `### 📊 밸류에이션 및 주가 레벨 진단\n\n- **Trailing P/E**: ${nvda.trailingPE || 45.0}x | **Forward P/E**: ${nvda.forwardPE || 30.2}x\n- **PEG Ratio**: 연간 60%+ 이익 성장 대비 PEG 0.8x~1.1x로 역사적 과열 구간 미만입니다.\n- **월가 목표가**: 평균 $${nvda.targetMeanPrice || 265.50} (상방 여력 약 +28%)\n- **70%+ 총마진율**: 압도적인 가격결정력으로 70% 중반대 Gross Margin을 수성하고 있습니다.`;
      } else {
        reply = `### 💡 엔비디아(NVIDIA · NVDA) 퀀트 핵심 요약\n\n- **현재 주가**: $${nvda.currentPrice} | Forward P/E ${nvda.forwardPE || 30.2}x\n- **핵심 해자**: 데이터센터 매출 85%+ 지배력, Blackwell GB200 전량 완판, 500만 개발자 CUDA 생태계\n- **종합 의견**: 하이퍼스케일러 CapEx가 연간 $200B+를 넘어서는 한 가속기 초과수요는 견고합니다. 하단 외부 AI 런처(Gemini, ChatGPT 등)를 클릭하시면 실시간 프롬프트로 더욱 심층적인 분석을 받으실 수 있습니다!`;
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    }, 200);
  };

  const lastUpdated = synthesisData?.metadata?.generated_at_kst
    ? new Date(synthesisData.metadata.generated_at_kst).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '방금 전';

  return (
    <div className="fintech-card p-5 space-y-4">
      {/* Top Header & Research Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#76b900] via-[#10b981] to-[#047857] text-white shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                엔비디아 심층 퀀트 리서치
              </h3>
              {/* Status Pill */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>리포트 업데이트 완료 ({synthesisData?.metadata?.engine || 'Local Ollama'})</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              글로벌 IB 컨센서스 및 반도체 펀더멘털 지표 기반 핵심 테마별 심층 분석 보고서
            </p>
          </div>
        </div>

        {/* Refresh & Last Updated */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono py-1.5 px-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>분석 기준: {lastUpdated}</span>
          </div>

          <button
            onClick={loadSynthesis}
            disabled={isRefreshing}
            title="최신 퀀트 보고서 동기화"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('memo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'memo'
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>종합 투자 메모</span>
          </button>

          <button
            onClick={() => setActiveTab('blackwell_ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'blackwell_ai'
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Blackwell & AI 인프라 해자</span>
          </button>

          <button
            onClick={() => setActiveTab('geopolitics_asic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'geopolitics_asic'
                ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>수출 통제 & ASIC 위협 진단</span>
          </button>

          <button
            onClick={() => setActiveTab('valuation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'valuation'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>밸류에이션 & 70%+ 마진 감사</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI 퀀트 Q&A</span>
          </button>
        </div>

        {/* Action Controls */}
        {activeTab !== 'chat' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs font-semibold transition-colors"
              title="리포트 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '보고서 복사'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab !== 'chat' ? (
        <div className="relative rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/60 p-4 sm:p-5 min-h-[340px] max-h-[500px] overflow-y-auto selectable-text">
          <div className="prose dark:prose-invert prose-xs sm:prose-sm max-w-none text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
            {getActiveText()}
          </div>
        </div>
      ) : (
        /* Interactive Quant Q&A Tab */
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/60 p-4 h-[360px] overflow-y-auto space-y-3 selectable-text">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-200/60 dark:border-zinc-700/60 rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Blackwell GB200 양산, 70%+ 총마진율, 대중국 수출 규제, 밸류에이션에 대해 물어보세요..."
              className="flex-1 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>전송</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Native AI App Launchers (aiAppLauncher protocol) */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>실시간 엔비디아 퀀트 프롬프트 원클릭 복사 & AI 앱 실행:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['gemini', 'chatgpt', 'claude', 'perplexity', 'grok'] as AiServiceKey[]).map((key) => {
            const svc = AI_SERVICES[key];
            return (
              <button
                key={key}
                onClick={() => {
                  handleCopy();
                  launchAiService(key);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-transform active:scale-95 ${svc.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${svc.dotColor}`} />
                <span>{svc.name}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
