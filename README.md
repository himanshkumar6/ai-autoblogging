# AI Autoblogging & Twitter Automation

An end-to-end autoblogging engine that uses Claude 3 Haiku to generate rich blog posts, stores them in Supabase, and uses Twikit (Python) to automatically post promotional tweets to X (Twitter).

## Architecture
- **Frontend/Backend APIs:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Anthropic Claude API 
- **Twitter Automation:** Python `twikit` (via Vercel Serverless `/api/post-tweet.py`)
- **Automation Scheduler:** Vercel Cron Jobs


## Step-by-Step Setup Instructions

### 1. Database Setup (Supabase)
1. Log into your Supabase account and create a new project.
2. Go to the **SQL Editor** tab.
3. Copy the contents of `supabase/schema.sql` and run it to create your `posts` table.
4. Go to **Project Settings -> API** and copy your `Project URL` and `anon public` key.

### 2. Environment Variables
1. Rename `.env.example` to `.env.local`
2. Fill in the keys:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL from step 1
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `CLAUDE_API_KEY`: Your Anthropic API Key (needs Claude 3 access)
   - `TWITTER_USERNAME`, `TWITTER_EMAIL`, `TWITTER_PASSWORD`: Your X account credentials (preferably a dedicated bot account to prevent your main from locking).

### 3. Local Development
Because this project utilizes both **Node.js** (Next.js) and **Python** (for Twikit) serverless functions, you must run it locally using the Vercel CLI to correctly simulate the Vercel edge environment.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
3. Run the development server using Vercel CLI (it will prompt you to link a Vercel project, just type `Y` and follow instructions):
   ```bash
   vercel dev
   ```

*Note: For the python backend to install correctly on your machine, you'll need Python installed system-wide. Vercel automatically creates a virtual environment during deployment based on `requirements.txt`.*

### 4. Running the Automation
The cron job automatically hits `/api/auto-run` every 6 hours in production (see `vercel.json`).
To test it locally, simply visit or trigger a GET/POST request to:
`http://localhost:3000/api/auto-run`

### 5. Production Deployment
1. Push this repository to GitHub.
2. Import it into Vercel.
3. Populate all Environment Variables inside the Vercel dashboard.
4. Deploy. The cron jobs will automatically activate.
"# ai-autoblogging" 
