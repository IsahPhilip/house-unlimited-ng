import React, { useState } from 'react';

declare global {
  interface Window {
    aistudio?: {
      openSelectKey: () => Promise<void>;
    };
  }
}

const Banner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const handleSelectKeyClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
      }
    };
    if (!isVisible) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md text-white py-3 px-4 z-50 flex justify-between items-center border-t border-slate-700 text-sm">
            <p className="hidden md:block">Powered by Gemini API. Explore the potential of AI in Real Estate.</p>
            <div className="flex space-x-4 items-center mx-auto md:mx-0">
                <a href="#" onClick={handleSelectKeyClick} className="bg-blue-600 px-4 py-1.5 rounded-full font-bold hover:bg-blue-500 transition-all">Add API Key</a>
                <button onClick={() => setIsVisible(false)} className="opacity-50 hover:opacity-100">✕</button>
            </div>
        </div>
    );
};

export default Banner;
