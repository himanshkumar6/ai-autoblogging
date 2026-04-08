import { getServerSupabase } from "../lib/supabase-core";

async function resetAds() {
  console.log("Starting Adsterra settings reset...");
  try {
    const supabase = getServerSupabase();
    
    // Delete the 'ads' key from the settings table
    const { error } = await supabase
      .from("settings")
      .delete()
      .eq("key", "ads");

    if (error) {
      console.error("Error deleting ads setting:", error);
    } else {
      console.log("Successfully wiped 'ads' configuration from Supabase.");
    }
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
  }
}

resetAds();
