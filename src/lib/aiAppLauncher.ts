/**
 * AI Native App Deep-Linker & Universal Fallback Launcher
 * - Priority native app launch on Android (intent://) and iOS (custom scheme)
 * - Desktop and mobile fallback to official web apps
 */

export type AiServiceKey = 'gemini' | 'chatgpt' | 'claude' | 'perplexity' | 'grok';
export type PlatformType = 'android' | 'ios' | 'desktop';

export interface AiServiceConfig {
  key: AiServiceKey;
  name: string;
  dotColor: string;
  color: string;
  webUrl: string;
  iosUniversalLink: string;
  iosScheme: string;
  androidPackage: string;
  androidIntentUrl: string;
}

export function buildAndroidIntentUrl(webUrl: string, androidPackage: string): string {
  const parsed = new URL(webUrl);
  const hostAndPath = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  const encodedFallback = encodeURIComponent(webUrl);
  return `intent://${hostAndPath}#Intent;scheme=https;package=${androidPackage};S.browser_fallback_url=${encodedFallback};end`;
}

export const AI_SERVICES: Record<AiServiceKey, AiServiceConfig> = {
  gemini: {
    key: 'gemini',
    name: 'Gemini',
    dotColor: 'bg-blue-400',
    color: 'bg-blue-600 hover:bg-blue-500 text-white',
    webUrl: 'https://gemini.google.com/app',
    iosUniversalLink: 'https://gemini.google.com/app?target=spark',
    iosScheme: 'googlegemini://',
    androidPackage: 'com.google.android.apps.bard',
    androidIntentUrl: buildAndroidIntentUrl('https://gemini.google.com/app', 'com.google.android.apps.bard'),
  },
  chatgpt: {
    key: 'chatgpt',
    name: 'ChatGPT',
    dotColor: 'bg-emerald-400',
    color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    webUrl: 'https://chatgpt.com/',
    iosUniversalLink: 'https://chatgpt.com/#native',
    iosScheme: 'chatgpt://',
    androidPackage: 'com.openai.chatgpt',
    androidIntentUrl: buildAndroidIntentUrl('https://chatgpt.com/', 'com.openai.chatgpt'),
  },
  claude: {
    key: 'claude',
    name: 'Claude',
    dotColor: 'bg-purple-400',
    color: 'bg-purple-600 hover:bg-purple-500 text-white',
    webUrl: 'https://claude.ai/new',
    iosUniversalLink: 'https://claude.ai/new',
    iosScheme: 'claude://',
    androidPackage: 'com.anthropic.claude',
    androidIntentUrl: buildAndroidIntentUrl('https://claude.ai/new', 'com.anthropic.claude'),
  },
  perplexity: {
    key: 'perplexity',
    name: 'Perplexity',
    dotColor: 'bg-cyan-400',
    color: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    webUrl: 'https://www.perplexity.ai/',
    iosUniversalLink: 'https://www.perplexity.ai/search',
    iosScheme: 'perplexity://',
    androidPackage: 'ai.perplexity.app.android',
    androidIntentUrl: buildAndroidIntentUrl('https://www.perplexity.ai/', 'ai.perplexity.app.android'),
  },
  grok: {
    key: 'grok',
    name: 'Grok',
    dotColor: 'bg-zinc-400',
    color: 'bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600',
    webUrl: 'https://grok.com/',
    iosUniversalLink: 'https://grok.com/',
    iosScheme: 'grok://',
    androidPackage: 'ai.x.grok',
    androidIntentUrl: buildAndroidIntentUrl('https://grok.com/', 'ai.x.grok'),
  },
};

export const AI_SERVICE_KEYS: AiServiceKey[] = ['gemini', 'chatgpt', 'claude', 'perplexity', 'grok'];

export function detectPlatform(): PlatformType {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  const touchPoints = navigator.maxTouchPoints || 0;

  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && touchPoints > 1)) return 'ios';
  return 'desktop';
}

export function launchAiService(serviceKey: AiServiceKey): void {
  if (typeof window === 'undefined') return;
  const service = AI_SERVICES[serviceKey] || AI_SERVICES.gemini;
  const platform = detectPlatform();

  if (platform === 'android') {
    window.location.href = service.androidIntentUrl;
    return;
  }

  if (platform === 'ios') {
    let appOpened = false;
    const markAppOpened = () => {
      if (document.hidden) appOpened = true;
    };
    document.addEventListener('visibilitychange', markAppOpened);
    window.addEventListener('pagehide', () => { appOpened = true; });

    const fallbackTimer = window.setTimeout(() => {
      document.removeEventListener('visibilitychange', markAppOpened);
      if (!appOpened && !document.hidden) {
        window.location.href = service.iosUniversalLink || service.webUrl;
      }
    }, 1200);

    window.location.href = service.iosScheme;
    return;
  }

  const openedWindow = window.open(service.webUrl, '_blank', 'noopener,noreferrer');
  if (!openedWindow) {
    window.location.href = service.webUrl;
  }
}
