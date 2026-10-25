import React from 'react';
import { X, Sparkles, Sliders, Shield, Info, Check } from 'lucide-react';
import { SearchMode, SearchTone, TimeFilter } from '../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode: SearchMode;
  setDefaultMode: (m: SearchMode) => void;
  defaultTone: SearchTone;
  setDefaultTone: (t: SearchTone) => void;
  defaultTimeFilter: TimeFilter;
  setDefaultTimeFilter: (tf: TimeFilter) => void;
  useStreaming: boolean;
  setUseStreaming: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  defaultMode,
  setDefaultMode,
  defaultTone,
  setDefaultTone,
  defaultTimeFilter,
  setDefaultTimeFilter,
  useStreaming,
  setUseStreaming,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-semibold text-white">Engine Preferences</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 text-xs text-zinc-300">
            {/* Real-time Streaming Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-medium text-white text-sm">Real-time Stream Response</p>
                <p className="text-[11px] text-zinc-400">
                  Stream synthesized answer words progressively as they are generated
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUseStreaming(!useStreaming)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  useStreaming ? 'bg-cyan-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    useStreaming ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Default Search Mode */}
            <div>
              <label className="block font-medium text-zinc-200 mb-2">Default Focus Mode</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'All Web' },
                  { id: 'deep', label: 'Deep Research' },
                  { id: 'academic', label: 'Academic' },
                  { id: 'code', label: 'Code & Tech' },
                  { id: 'news', label: 'News' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDefaultMode(item.id as SearchMode)}
                    className={`px-3 py-2 rounded-xl text-left font-medium border transition-all flex items-center justify-between ${
                      defaultMode === item.id
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {defaultMode === item.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Synthesis Tone */}
            <div>
              <label className="block font-medium text-zinc-200 mb-2">Synthesis Depth & Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'concise', label: 'Concise' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'comprehensive', label: 'Comprehensive' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDefaultTone(item.id as SearchTone)}
                    className={`px-3 py-2 rounded-xl text-center font-medium border transition-all capitalize ${
                      defaultTone === item.id
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Engine Architecture Details */}
            <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <Info className="w-3.5 h-3.5" />
                <span>Engine Specification</span>
              </div>
              <ul className="space-y-1 text-zinc-400 text-[11px] list-disc list-inside">
                <li>Grounding: Real-time Google Search tool retrieval</li>
                <li>Model: Gemini 3.8 Flash with dynamic reasoning</li>
                <li>Audio: Gemini 3.8 Flash Lite TTS & Speech Synthesis</li>
                <li>Privacy: Queries executed server-side with zero telemetry tracking</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
