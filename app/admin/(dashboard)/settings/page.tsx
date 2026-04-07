import { getAllSettings } from "@/app/actions/settings";
import SettingsForm from "@/components/SettingsForm";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Settings | Admin Portal",
};

export default async function SettingsPage() {
  // Fetch settings securely on the server!
  // This ensures no API keys leak during initial client payload hydration,
  // except for what is explicitly sent to the authenticated admin panel form.
  const initialSettings = await getAllSettings();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Component matching previous dashboard styles */}
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4 mb-2">
          <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5">
            <Settings className="text-purple-600 dark:text-purple-400" size={32} />
          </div>
          Platform Configuration
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl leading-relaxed ml-[4.5rem]">
          Centralized control hub for analytics, ad algorithms, AI credentials, and cross-platform integrations. Ensure extreme care when modifying production API keys.
        </p>
      </header>

      {/* Main Security-bounded Form */}
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
