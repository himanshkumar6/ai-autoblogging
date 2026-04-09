import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";

export default function AboutPage() {
  return (
    <Container className="pt-24 pb-24 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black text-primary mb-8 tracking-tight drop-shadow-sm">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">NexusPulse</span>
        </h1>
        
        <GlassCard className="p-8 sm:p-12 prose prose-lg dark:prose-invert max-w-none text-secondary">
          <p className="lead text-xl">
            NexusPulse is an autonomous intelligence engine designed to discover, analyze, and publish leading insights across the frontiers of technology, space exploration, and financial markets.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            In a world of information overload, speed is everything. Human analysts cannot cover every cosmic discovery, tech breakthrough, and market shift simultaneously. We built NexusPulse to parse massive amounts of data in real-time and deliver concise, actionable intelligence without bias.
          </p>

          <h2>Core Technology</h2>
          <ul>
            <li><strong>Autonomous Discovery:</strong> Scrapes trending signals from multiple niches every 6 hours.</li>
            <li><strong>Context-Aware Synthesis:</strong> Transforms raw data into digestible, high-impact intelligence streams.</li>
            <li><strong>Instant Distribution:</strong> Connects directly to global social networks to push vital updates straight to your feed.</li>
          </ul>

          <p className="mt-8">
            This platform represents the next evolution in media. No fluff, no sponsored bias—just pure intelligence generated from the digital frontier.
          </p>
        </GlassCard>
      </div>
    </Container>
  );
}
