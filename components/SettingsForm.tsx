"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/settings";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Layout, Activity, Code, Bot, Twitter, AlertCircle, CheckCircle2 
} from "lucide-react";
import GlassCard from "./GlassCard";

const tabs = [
  { id: "general", label: "General", icon: Layout },
  { id: "analytics", label: "Analytics & Scripts", icon: Activity },
  { id: "ads", label: "Ads Management", icon: Code },
  { id: "ai", label: "AI Config", icon: Bot },
  { id: "social", label: "Social Automation", icon: Twitter },
];

export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, any> }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null, msg: string }>({ type: null, msg: "" });

  const [formData, setFormData] = useState<Record<string, any>>({
    siteName: initialSettings.siteName || "",
    siteDescription: initialSettings.siteDescription || "",
    faviconData: initialSettings.faviconData || "",
    ga4Id: initialSettings.ga4Id || "",
    customHeadScripts: initialSettings.customHeadScripts || "",
    adsterraBanner: initialSettings.adsterraBanner || "",
    adsterraNative: initialSettings.adsterraNative || "",
    adsterraPopunder: initialSettings.adsterraPopunder === "true" || initialSettings.adsterraPopunder === true,
    googleAdSensePublisherId: initialSettings.googleAdSensePublisherId || "",
    adsenseEnabled: initialSettings.adsenseEnabled === "true" || initialSettings.adsenseEnabled === true,
    aiApiKey: initialSettings.aiApiKey || "",
    aiProvider: initialSettings.aiProvider || "gemini",
    claudeApiKey: initialSettings.claudeApiKey || "",
    claudeModel: initialSettings.claudeModel || "claude-3-haiku",
    claudeEnabled: initialSettings.claudeEnabled === "true" || initialSettings.claudeEnabled === true,
    xApiKey: initialSettings.xApiKey || "",
    xApiSecret: initialSettings.xApiSecret || "",
    xAccessToken: initialSettings.xAccessToken || "",
    xAutoThread: initialSettings.xAutoThread === "true" || initialSettings.xAutoThread === true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData(prev => ({ ...prev, [target.name]: value }));
    setStatus({ type: null, msg: "" });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus({ type: null, msg: "" });

    const result = await saveSettings(formData);
    if (result.success) {
      setStatus({ type: "success", msg: "Settings securely saved and deployed!" });
    } else {
      setStatus({ type: "error", msg: result.error || "Failed to save settings." });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-start max-w-6xl mx-auto">
      {/* Sidebar Tabs */}
      <GlassCard className="w-full lg:w-64 p-3 flex flex-col gap-1 z-10 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive ? "bg-purple-500/10 dark:bg-white/10 text-purple-600 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Icon size={18} className={isActive ? "text-purple-500 dark:text-purple-400" : ""} />
              {tab.label}
            </button>
          );
        })}

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-white/10">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Activity className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? "Deploying..." : "Save Config"}
          </button>
        </div>
      </GlassCard>

      {/* Content Area */}
      <GlassCard className="flex-1 p-6 lg:p-10 z-10 w-full min-h-[500px]">
        {status.type && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'}`}>
            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-semibold">{status.msg}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Layout size={24} className="text-purple-500"/> General Settings</h2>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Site Name</label>
                  <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Site Description</label>
                  <textarea name="siteDescription" rows={3} value={formData.siteDescription} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Site Favicon</label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-black overflow-hidden shadow-inner">
                      {formData.faviconData ? (
                         <img src={formData.faviconData} alt="Favicon" className="w-8 h-8 object-contain" />
                      ) : (
                         <span className="text-gray-400 text-xs font-bold">ICO</span>
                      )}
                    </div>
                    <div className="flex-1">
                       <input 
                         type="file" 
                         accept=".ico,.png,.svg,.jpg,.jpeg" 
                         className="hidden" 
                         id="favicon-upload"
                         onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => {
                               setFormData(prev => ({ ...prev, faviconData: reader.result }));
                             };
                             reader.readAsDataURL(file);
                           }
                         }} 
                       />
                       <label htmlFor="favicon-upload" className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-sm font-bold cursor-pointer transition-colors text-gray-700 dark:text-gray-300 inline-block active:scale-95 shadow-sm">
                         Upload Image
                       </label>
                       <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">Replaces the globe icon on browser tabs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Activity size={24} className="text-purple-500"/> Analytics & Scripts</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Google Analytics (GA4) ID</label>
                  <input type="text" name="ga4Id" placeholder="G-XXXXXXXXXX" value={formData.ga4Id} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Custom Head Scripts (HTML/Meta)</label>
                  <textarea name="customHeadScripts" rows={5} placeholder="<meta name='monetag' content='...'>" value={formData.customHeadScripts} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "ads" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Code size={24} className="text-purple-500"/> Ad Networks</h2>
              
              <div className="p-6 border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5 rounded-2xl mb-6">
                <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2"><Code size={18}/> Adsterra Integrations</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-1.5">Banner Code (HTML)</label>
                    <textarea name="adsterraBanner" rows={3} value={formData.adsterraBanner} onChange={handleChange} className="w-full font-mono text-sm bg-white dark:bg-[#050505] border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-1.5">Native Code (HTML)</label>
                    <textarea name="adsterraNative" rows={3} value={formData.adsterraNative} onChange={handleChange} className="w-full font-mono text-sm bg-white dark:bg-[#050505] border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 dark:bg-black/30 p-3 rounded-xl border border-purple-200 dark:border-purple-500/10">
                    <input type="checkbox" name="adsterraPopunder" checked={formData.adsterraPopunder} onChange={handleChange} className="w-5 h-5 accent-purple-600 rounded cursor-pointer" />
                    <label className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">Enable Adsterra Popunder Globally</label>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5 rounded-2xl">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2"><Code size={18}/> Google AdSense</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 bg-white/50 dark:bg-black/30 p-3 rounded-xl border border-blue-200 dark:border-blue-500/10">
                    <input type="checkbox" name="adsenseEnabled" checked={formData.adsenseEnabled} onChange={handleChange} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                    <label className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">Enable AdSense Sitewide</label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1.5">Publisher ID</label>
                    <input type="text" name="googleAdSensePublisherId" placeholder="pub-XXXXXXXXXXXXXXXX" value={formData.googleAdSensePublisherId} onChange={handleChange} className="w-full font-mono text-sm bg-white dark:bg-[#050505] border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Bot size={24} className="text-purple-500"/> AI Engine Configuration</h2>
              
              <div className="space-y-6 max-w-xl">
                {/* Claude Integration (PRIMARY) */}
                <div className="p-6 border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5 rounded-2xl">
                  <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2"><Bot size={18}/> Claude AI (Primary Engine)</h3>
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-black/30 p-3 rounded-xl border border-orange-200 dark:border-orange-500/10">
                      <input type="checkbox" name="claudeEnabled" checked={formData.claudeEnabled} onChange={handleChange} className="w-5 h-5 accent-orange-600 rounded cursor-pointer" />
                      <label className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">Enable Claude Orchestrator (Priority)</label>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-widest mb-1.5">Claude API Key</label>
                      <input type="password" name="claudeApiKey" placeholder="sk-ant-api03-••••••••••••••••" value={formData.claudeApiKey} onChange={handleChange} className="w-full font-mono text-sm bg-white dark:bg-[#050505] border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-orange-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-widest mb-1.5">Generation Model</label>
                      <select name="claudeModel" value={formData.claudeModel} onChange={handleChange} className="w-full bg-white dark:bg-[#050505] border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-orange-500 transition-colors">
                        <option value="claude-3-opus-20240229">Claude 3 Opus (Most Intelligent)</option>
                        <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                        <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fastest / Default)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Legacy / Fallback Engines */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Fallback Engines (Gemini & ChatGPT)</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Fallback Provider Format</label>
                      <select name="aiProvider" value={formData.aiProvider} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors">
                        <option value="gemini">Google Gemini (Default Fallback)</option>
                        <option value="openai">OpenAI ChatGPT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Fallback API Key</label>
                      <input type="password" name="aiApiKey" placeholder="•••••••••••••••••••••••••••••" value={formData.aiApiKey} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-cyan-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "social" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3"><Twitter size={24} className="text-purple-500"/> Social Automation (X)</h2>
              <div className="space-y-5 max-w-xl">
                <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <input type="checkbox" name="xAutoThread" checked={formData.xAutoThread} onChange={handleChange} className="w-5 h-5 accent-black dark:accent-white rounded cursor-pointer" />
                  <label className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">Enable Automatic Neural Thread Posting on new AI Articles</label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">X API Key</label>
                  <input type="password" name="xApiKey" placeholder="••••••••••••••••••" value={formData.xApiKey} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">X API Secret</label>
                  <input type="password" name="xApiSecret" placeholder="••••••••••••••••••" value={formData.xApiSecret} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">X Access Token</label>
                  <input type="password" name="xAccessToken" placeholder="••••••••••••••••••" value={formData.xAccessToken} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
