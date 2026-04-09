"use client";

import { useState } from "react";
import { saveSettings } from "@/app/actions/settings";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Layout, 
  Activity, 
  Code, 
  Bot, 
  Twitter, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";
import GlassCard from "./GlassCard";

const tabs = [
  { id: "general", label: "General", icon: Layout },
  { id: "analytics", label: "Analytics & Scripts", icon: Activity },
  { id: "ads", label: "Ads Configuration", icon: Code },
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
    authorName: initialSettings.authorName || "Himanshu",
    authorDesignation: initialSettings.authorDesignation || "Crypto Analyst",
    authorImage: initialSettings.authorImage || "",
    ga4Id: initialSettings.ga4Id || "",
    customHeadScripts: initialSettings.customHeadScripts || "",
    ads: initialSettings.ads || {
      ad_top_banner: "",
      ad_mid_content: "",
      ad_bottom_banner: "",
      ad_sidebar: "",
      ad_social_bar: "",
    },
    aiApiKey: initialSettings.aiApiKey || "",
    aiProvider: initialSettings.aiProvider || "gemini",
    gemini_api_key: initialSettings.gemini_api_key || "",
    gemini_enabled: initialSettings.gemini_enabled === "true" || initialSettings.gemini_enabled === true,
    openai_api_key: initialSettings.openai_api_key || "",
    openai_enabled: initialSettings.openai_enabled === "true" || initialSettings.openai_enabled === true,
    claudeApiKey: initialSettings.claudeApiKey || "",
    claudeModel: initialSettings.claudeModel || "claude-3-haiku-20240307",
    claudeEnabled: initialSettings.claudeEnabled === "true" || initialSettings.claudeEnabled === true,
    xApiKey: initialSettings.xApiKey || "",
    xApiSecret: initialSettings.xApiSecret || "",
    xAccessToken: initialSettings.xAccessToken || "",
    xAutoThread: initialSettings.xAutoThread === "true" || initialSettings.xAutoThread === true,
    targetNiches: initialSettings.targetNiches || "Crypto, NASA, AI",
    globalNiche: initialSettings.globalNiche || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    
    if (target.name.includes('.')) {
      const [parent, child] = target.name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [target.name]: value }));
    }
    
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
    <div className="flex flex-col lg:flex-row gap-8 lg:items-start max-w-7xl mx-auto pb-24 md:pb-0">
      {/* Sidebar Tabs - Vertical List (Sidebar Style) */}
      <GlassCard className="w-full lg:w-72 p-3 flex flex-col gap-2 z-10 shrink-0 sticky top-16 md:top-6 lg:top-8 bg-white/60 dark:bg-[#050505]/60 backdrop-blur-2xl border-gray-200 dark:border-white/5 shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 w-full text-left
                ${isActive 
                  ? "bg-purple-600/10 dark:bg-white/10 text-purple-700 dark:text-white shadow-[0_4px_20px_rgba(124,58,237,0.1)] border border-purple-500/20 dark:border-white/10" 
                  : "text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-r-full" />
              )}
              
              <Icon size={18} className={`${isActive ? "text-purple-600 dark:text-purple-400" : "group-hover:text-purple-500 dark:group-hover:text-purple-300"} transition-colors shrink-0`} />
              
              <span className="flex-1 uppercase tracking-widest text-[10px]">{tab.label}</span>
              
              <ChevronRight size={14} className={`${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40 transition-opacity"}`} />
            </button>
          );
        })}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 px-2 pb-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 px-4 rounded-xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
          >
            {isSaving ? <Activity className="animate-spin" size={16} /> : <Save size={16} />}
            {isSaving ? "Deploying..." : "Save Config & Sync"}
          </button>
        </div>
      </GlassCard>

      {/* Content Area */}
      <GlassCard className="flex-1 p-6 md:p-8 lg:p-12 z-10 w-full min-h-[600px] border-gray-200 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl">
        {status.type && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-8 p-5 rounded-2xl flex items-center gap-4 border shadow-sm ${status.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'}`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-black">{status.msg}</span>
          </motion.div>
        )}

        <div className="space-y-10">
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="border-b border-gray-100 dark:border-white/5 pb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 leading-tight"><Layout size={28} className="text-purple-500"/> General Platform Settings</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-bold mt-2 ml-[40px]">Configure your site's core identity and branding.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Site Name</label>
                  <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Site Description</label>
                  <textarea name="siteDescription" rows={4} value={formData.siteDescription} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-sm leading-relaxed" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Site Favicon</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-black overflow-hidden shadow-inner shrink-0 scale-100 sm:scale-110">
                      {formData.faviconData ? (
                         <img src={formData.faviconData} alt="Favicon" className="w-10 h-10 object-contain" />
                      ) : (
                         <span className="text-gray-400 text-xs font-black">ICO</span>
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
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
                       <label htmlFor="favicon-upload" className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-xs font-black cursor-pointer transition-all text-gray-700 dark:text-gray-300 inline-block active:scale-95 shadow-sm uppercase tracking-widest">
                         Choose New Asset
                       </label>
                       <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 font-black uppercase tracking-widest">Replaces the globe icon on browser tabs.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                    <Bot size={18} className="text-purple-500"/> Niche & Topic Orchestration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Target Niches (Comma Separated)</label>
                      <input type="text" name="targetNiches" placeholder="Crypto, NASA, AI, Tech" value={formData.targetNiches} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Global Niche Override (Optional)</label>
                      <input type="text" name="globalNiche" placeholder="Leave empty for dynamic niches" value={formData.globalNiche} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-sm" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Author Name</label>
                    <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Author Designation</label>
                    <input type="text" name="authorDesignation" value={formData.authorDesignation} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Author Avatar Image</label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                      <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-black overflow-hidden shadow-inner shrink-0 scale-100 sm:scale-110">
                        {formData.authorImage ? (
                           <img src={formData.authorImage} alt="Author" className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-gray-400 text-xs font-black">IMG</span>
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                         <input 
                           type="file" 
                           accept=".png,.jpg,.jpeg,.webp" 
                           className="hidden" 
                           id="author-upload"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setFormData(prev => ({ ...prev, authorImage: reader.result }));
                               };
                               reader.readAsDataURL(file);
                             }
                           }} 
                         />
                         <label htmlFor="author-upload" className="px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-xs font-black cursor-pointer transition-all text-gray-700 dark:text-gray-300 inline-block active:scale-95 shadow-sm uppercase tracking-widest">
                           Upload Avatar
                         </label>
                         <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 font-black uppercase tracking-widest">Displays natively alongside articles.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="border-b border-gray-100 dark:border-white/5 pb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 leading-tight"><Activity size={28} className="text-purple-500"/> Tracking & Meta Engines</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-bold mt-2 ml-[40px]">Deploy analytics IDs and custom head scripts.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Google Analytics (GA4) ID</label>
                  <input type="text" name="ga4Id" placeholder="G-XXXXXXXXXX" value={formData.ga4Id} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Custom Head Scripts (HTML/Meta)</label>
                  <textarea name="customHeadScripts" rows={8} placeholder="<meta name='monetag' content='...'>" value={formData.customHeadScripts} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all leading-relaxed" />
                </div>
              </div>
            </motion.div>
          )}



          {activeTab === "ads" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="border-b border-gray-100 dark:border-white/5 pb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 leading-tight"><Code size={28} className="text-purple-500"/> Ads Configuration</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-bold mt-2 ml-[40px]">Manage your ad units with a clean, grid-based interface.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Banner Ads */}
                <div className="p-6 border border-purple-200 dark:border-purple-500/20 bg-purple-50/30 dark:bg-purple-500/5 rounded-3xl space-y-6">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-purple-700 dark:text-purple-400">Primary Banner Placements</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Top Banner (Hero)</label>
                      <textarea name="ads.ad_top_banner" rows={3} value={formData.ads.ad_top_banner} onChange={handleChange} placeholder="Paste ad code..." className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Bottom Banner (Footer)</label>
                      <textarea name="ads.ad_bottom_banner" rows={3} value={formData.ads.ad_bottom_banner} onChange={handleChange} placeholder="Paste ad code..." className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Sidebar & Special */}
                <div className="p-6 border border-blue-200 dark:border-blue-500/20 bg-blue-50/30 dark:bg-blue-500/5 rounded-3xl space-y-6">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-blue-700 dark:text-blue-400">Sidebar & Global Overlays</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Sidebar Slot</label>
                      <textarea name="ads.ad_sidebar" rows={3} value={formData.ads.ad_sidebar} onChange={handleChange} placeholder="Paste ad code..." className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Social Bar / Global Overlay</label>
                      <textarea name="ads.ad_social_bar" rows={3} value={formData.ads.ad_social_bar} onChange={handleChange} placeholder="Paste global script..." className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Article Specific */}
                <div className="md:col-span-2 p-6 border border-orange-200 dark:border-orange-500/20 bg-orange-50/30 dark:bg-orange-500/5 rounded-3xl space-y-6">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-orange-700 dark:text-orange-400">Article Content Injection</h3>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Mid-Content Ad (Appears between paragraphs)</label>
                    <textarea name="ads.ad_mid_content" rows={4} value={formData.ads.ad_mid_content} onChange={handleChange} placeholder="Paste native/mid-content ad code..." className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-orange-200 dark:border-orange-500/20 rounded-xl px-4 py-4 outline-none focus:border-orange-500 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="border-b border-gray-100 dark:border-white/5 pb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 leading-tight"><Bot size={28} className="text-purple-500"/> Neural Engine Orchestrator</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-bold mt-2 ml-[40px]">Configure LLM endpoints and autonomous fallback logic.</p>
              </div>
              
              <div className="space-y-10">
                {/* Google Gemini (PRIMARY) */}
                <div className="p-6 md:p-8 border border-blue-200 dark:border-blue-500/20 bg-blue-50/30 dark:bg-blue-500/5 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1 bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">Primary Engine</div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h3 className="font-black text-blue-900 dark:text-blue-100 flex items-center gap-4 uppercase tracking-widest text-xs"><Bot size={20}/> Google Gemini Pro</h3>
                    <div className="flex items-center gap-3 bg-white/60 dark:bg-black/40 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-500/10">
                      <input type="checkbox" name="gemini_enabled" checked={formData.gemini_enabled} onChange={handleChange} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                      <label className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Active State</label>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Gemini API Key</label>
                      <input type="password" name="gemini_api_key" placeholder="AIzaSy•••••••••••••••••••••••••••••" value={formData.gemini_api_key} onChange={handleChange} className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-blue-200 dark:border-blue-500/20 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all font-bold" />
                    </div>
                  </div>
                </div>

                {/* OpenAI (SECONDARY FALLBACK) */}
                <div className="p-6 md:p-8 border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5 rounded-3xl">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h3 className="font-black text-emerald-900 dark:text-emerald-100 flex items-center gap-4 uppercase tracking-widest text-xs"><Activity size={20}/> OpenAI GPT-4 Turbo</h3>
                    <div className="flex items-center gap-3 bg-white/60 dark:bg-black/40 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-500/10">
                      <input type="checkbox" name="openai_enabled" checked={formData.openai_enabled} onChange={handleChange} className="w-5 h-5 accent-emerald-600 rounded cursor-pointer" />
                      <label className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Fallback Active</label>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-2">OpenAI API Key</label>
                      <input type="password" name="openai_api_key" placeholder="sk-••••••••••••••••••••••••••••••••" value={formData.openai_api_key} onChange={handleChange} className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold" />
                    </div>
                  </div>
                </div>

                {/* Claude Integration (FINAL FALLBACK) */}
                <div className="p-6 md:p-8 border border-orange-200 dark:border-orange-500/20 bg-orange-50/30 dark:bg-orange-500/5 rounded-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h3 className="font-black text-orange-900 dark:text-orange-100 flex items-center gap-4 uppercase tracking-widest text-xs"><Bot size={20}/> Anthropic Claude (Final Fallback)</h3>
                    <div className="flex items-center gap-3 bg-white/60 dark:bg-black/40 px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-500/10">
                      <input type="checkbox" name="claudeEnabled" checked={formData.claudeEnabled} onChange={handleChange} className="w-5 h-5 accent-orange-600 rounded cursor-pointer" />
                      <label className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Active State</label>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-orange-700 dark:text-orange-400 uppercase tracking-[0.2em] mb-2">Claude API Key</label>
                      <input type="password" name="claudeApiKey" placeholder="sk-ant-api03-••••••••••••••••" value={formData.claudeApiKey} onChange={handleChange} className="w-full font-mono text-xs bg-white dark:bg-black/40 border border-orange-200 dark:border-orange-500/20 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-orange-500 transition-all font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-orange-700 dark:text-orange-400 uppercase tracking-[0.2em] mb-2">Intelligence Model Selection</label>
                      <select name="claudeModel" value={formData.claudeModel} onChange={handleChange} className="w-full bg-white dark:bg-black/40 border border-orange-200 dark:border-orange-500/20 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-orange-500 transition-all font-bold text-xs uppercase tracking-widest">
                        <option value="claude-3-opus-20240229">Claude 3 Opus (Most Intelligent)</option>
                        <option value="claude-Sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                        <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fastest / Default)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "social" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="border-b border-gray-100 dark:border-white/5 pb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 leading-tight"><Twitter size={28} className="text-purple-500"/> Neural Thread Automation (X)</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-bold mt-2 ml-[40px]">Configure social signals and auto-posting logic.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
                  <input type="checkbox" name="xAutoThread" checked={formData.xAutoThread} onChange={handleChange} className="w-6 h-6 accent-black dark:accent-white rounded-lg cursor-pointer" />
                  <label className="text-sm font-black text-gray-900 dark:text-white cursor-pointer select-none">Enable Automatic Thread Synthesis on new AI Vectors</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">X API Key</label>
                    <input type="password" name="xApiKey" placeholder="••••••••••••••••••" value={formData.xApiKey} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">X API Secret</label>
                    <input type="password" name="xApiSecret" placeholder="••••••••••••••••••" value={formData.xApiSecret} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">X Access Token</label>
                    <input type="password" name="xAccessToken" placeholder="••••••••••••••••••" value={formData.xAccessToken} onChange={handleChange} className="w-full font-mono text-sm bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>

      {/* Mobile Sticky Save Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-t border-gray-200 dark:border-white/5 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-xl shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
        >
          {isSaving ? <Activity className="animate-spin" size={20} /> : <Save size={20} />}
          {isSaving ? "Deploying Configuration..." : "Save Config & Sync"}
        </button>
      </div>
    </div>
  );
}
