"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function getIsIOS() {
    if (typeof window === "undefined") return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

function getIsStandalone() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches;
}

function subscribeStandalone(callback: () => void) {
    if (typeof window === "undefined") return () => {};
    const media = window.matchMedia("(display-mode: standalone)");
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}

export default function InstallPrompt(): React.JSX.Element | null {
    const isIOS = useSyncExternalStore(emptySubscribe, getIsIOS, () => false);
    const isStandalone = useSyncExternalStore(subscribeStandalone, getIsStandalone, () => false);
    const [showPrompt, setShowPrompt] = useState(true);

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js", {
                scope: "/",
                updateViaCache: "none",
            }).catch((err) => {
                console.error("Service worker registration failed:", err);
            });
        }
    }, []);

    if (isStandalone || !showPrompt) {
        return null; // Don't show if already installed or dismissed
    }

    if (!isIOS) {
        return null; // Browsers handle native PWA install prompts automatically on Android/Desktop
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-9999 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-start justify-between text-white/90 shadow-2xl">
            <div>
                <h3 className="font-semibold text-white mb-1">Install Lumina</h3>
                <p className="text-sm text-white/70">
                    To install this app on your device, tap the share button <span role="img" aria-label="share icon" className="text-white">⎋</span> and then <strong>Add to Home Screen</strong> <span role="img" aria-label="plus icon" className="text-white">➕</span>.
                </p>
            </div>
            <button
                onClick={() => setShowPrompt(false)}
                className="ml-4 p-2 text-white/50 hover:text-white transition-colors shrink-0"
                aria-label="Close"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
