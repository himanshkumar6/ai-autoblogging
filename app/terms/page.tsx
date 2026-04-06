import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";

export default function TermsPage() {
  return (
    <Container className="pt-24 pb-24 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-primary mb-10 tracking-tight drop-shadow-sm">
          Terms of Service
        </h1>
        
        <GlassCard className="p-8 sm:p-12 prose prose-lg dark:prose-invert max-w-none text-secondary">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Agreement to Terms</h2>
          <p>By accessing the Crypto News platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may safely disconnect from the platform node.</p>

          <h2>2. Not Financial Advice</h2>
          <p>
            <strong>Critical Disclosure:</strong> All content, market feeds, and asset breakdowns published on this platform are generated strictly by Artificial Intelligence models via scraping aggregated internet sentiment and technical data. 
          </p>
          <p>
            Nothing on this website constitutes financial, trading, or investment advice. The cryptocurrency markets are highly volatile. You are interacting with automated algorithmic endpoints; you must verify off-chain and perform due diligence.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>The code architecture, layout, SaaS UI frameworks, and proprietary prompting engines remain the sole intellectual property of the operator. The AI-generated market texts themselves are provided for public reading.</p>

          <h2>4. Automation Disruptions</h2>
          <p>As this platform operates autonomously via scheduled cron jobs, server limits, API downtime, or database locking may temporarily halt the publication cycle. We guarantee no uptime SLAs for free users.</p>
        </GlassCard>
      </div>
    </Container>
  );
}
