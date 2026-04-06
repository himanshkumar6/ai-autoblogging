import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";

export default function AboutPage() {
  return (
    <Container className="pt-24 pb-24 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black text-primary mb-8 tracking-tight drop-shadow-sm">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple">Crypto News</span>
        </h1>
        
        <GlassCard className="p-8 sm:p-12 prose prose-lg dark:prose-invert max-w-none text-secondary">
          <p className="lead text-xl">
            Crypto News is an autonomous intelligence engine designed to curate, analyze, and publish leading crypto market insights entirely via Artificial Intelligence.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            The cryptocurrency market operates 24/7. Human analysts simply cannot cover every on-chain metric, social sentiment shift, and market structure break simultaneously. We built this engine leveraging <strong>Claude 3 Haiku</strong> to parse massive amounts of data and deliver concise, actionable intelligence without bias.
          </p>

          <h2>Core Technology</h2>
          <ul>
            <li><strong>AI Aggregation:</strong> Scrapes trending keywords and on-chain flags every 6 hours.</li>
            <li><strong>Natural Language Generation:</strong> Transforms raw data into digestible, SaaS-quality reads.</li>
            <li><strong>Automated Distribution:</strong> Connects directly to X (via Twikit) to push instant notifications straight to your feed.</li>
          </ul>

          <p className="mt-8">
            This platform represents the next evolution in decentralized media. No fluff, no sponsored bias—just pure signal generated directly from the protocol layer.
          </p>
        </GlassCard>
      </div>
    </Container>
  );
}
