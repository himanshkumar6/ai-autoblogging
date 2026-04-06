import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";

export default function PrivacyPage() {
  return (
    <Container className="pt-24 pb-24 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-primary mb-10 tracking-tight drop-shadow-sm">
          Privacy Policy
        </h1>
        
        <GlassCard className="p-8 sm:p-12 prose prose-lg dark:prose-invert max-w-none text-secondary">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Introduction</h2>
          <p>This privacy policy explains how Crypto News collects, uses, and protects your information when you visit our intelligent platform.</p>

          <h2>Information Collection</h2>
          <p>As an autonomous AI platform, we purposely minimize the collection of personal data. We do not require registration for viewing content.</p>

          <ul>
            <li><strong>Newsletter Data:</strong> If you join our Alpha Waitlist, we collect your email address purely for sending actionable intel. We never sell this metadata to third-party ad networks.</li>
            <li><strong>Analytics:</strong> Embedded edge analytics may collect aggregated, non-identifying metrics (such as geographical regions or page views) to optimize Node infrastructure.</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>We primarily utilize Functional cookies required to persist interface parameters (e.g., your Dark Mode preferences). We inherently reject invasive tracking models common in Web 2.0 architectures.</p>

          <h2>Data Security</h2>
          <p>All stored data operates via encrypted transmission lines on top-tier cloud architecture (Supabase & Vercel), guarded by strict Row Level Security (RLS) constraints.</p>
        </GlassCard>
      </div>
    </Container>
  );
}
