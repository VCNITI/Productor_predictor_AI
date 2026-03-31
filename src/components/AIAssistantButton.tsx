import { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

const CUSTOM_GPT_URL = 'https://chatgpt.com/g/g-69cb74b1ffd4819181166360d6c61c71-vcniti-construction-materials-delivery-beta';

export default function AIAssistantButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isWebView, setIsWebView] = useState(false);

    useEffect(() => {
        // Detect if running inside Android/iOS WebView (app) — hide button in app
        const ua = navigator.userAgent || '';
        const androidWebView = /wv|WebView/.test(ua) || (ua.includes('Android') && !ua.includes('Chrome/'));
        const iosWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);
        if (androidWebView || iosWebView) {
            setIsWebView(true);
            return;
        }

        const showTimer = setTimeout(() => setIsVisible(true), 3000);
        const tooltipTimer = setTimeout(() => setShowTooltip(true), 8000);
        const hideTooltipTimer = setTimeout(() => setShowTooltip(false), 15000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(tooltipTimer);
            clearTimeout(hideTooltipTimer);
        };
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowTooltip(false);

        const ua = navigator.userAgent || '';
        const isAndroidWebView = /wv|WebView/.test(ua) || (ua.includes('Android') && !ua.includes('Chrome/'));
        const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);

        if (isAndroidWebView) {
            const intentUrl = `intent://${CUSTOM_GPT_URL.replace('https://', '')}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
            window.location.href = intentUrl;
        } else if (isIOSWebView) {
            try {
                if ((window as any).webkit?.messageHandlers?.openExternal) {
                    (window as any).webkit.messageHandlers.openExternal.postMessage(CUSTOM_GPT_URL);
                } else {
                    window.open(CUSTOM_GPT_URL, '_system');
                }
            } catch {
                window.open(CUSTOM_GPT_URL, '_blank');
            }
        } else {
            window.open(CUSTOM_GPT_URL, '_blank', 'noopener,noreferrer');
        }
    };

    if (isWebView || isDismissed || !isVisible) return null;

    return (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col items-end gap-3 animate-fade-in-up">
            {/* Tooltip bubble */}
            {showTooltip && (
                <div className="relative animate-fade-in-up">
                    <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl max-w-[230px] leading-snug border border-white/10">
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-200"
                            aria-label="Close tooltip"
                        >
                            <X size={10} className="text-white" />
                        </button>
                        <span className="flex items-center gap-1.5">
                            <Sparkles size={14} className="text-yellow-400 flex-shrink-0 animate-pulse" />
                            Need help with product predictions? Ask our AI!
                        </span>
                    </div>
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900/95 rotate-45 border-b border-r border-white/10" />
                </div>
            )}

            {/* Main floating button */}
            <button
                onClick={handleClick}
                className="group relative flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500 text-white w-14 h-14 sm:w-auto sm:h-auto sm:pl-4 sm:pr-5 sm:py-3 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Chat with AI Assistant"
            >
                <div className="w-7 h-7 rounded-full sm:bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                    <MessageCircle size={18} className="text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-bold tracking-wide whitespace-nowrap ml-2">
                    AI Assistant
                </span>
            </button>
        </div>
    );
}
