import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client with required aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface SearchRequest {
  query: string;
  mode?: 'all' | 'deep' | 'academic' | 'code' | 'news';
  tone?: 'concise' | 'balanced' | 'comprehensive';
  timeFilter?: 'all' | 'day' | 'week' | 'month' | 'year';
  conversation?: Array<{ role: 'user' | 'model'; text: string }>;
}

function formatErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const msg = error.message || String(error);
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
    return 'Gemini API quota rate limit reached (429). If you are using the default key, please wait a minute or connect your personal billing-enabled key in the Settings > Secrets panel for unlimited requests.';
  }
  if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('API_KEY_INVALID')) {
    return 'Permission denied or invalid API key. Please verify your GEMINI_API_KEY in the Settings > Secrets panel.';
  }
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.message) return parsed.error.message;
  } catch {}
  return msg;
}

function buildSystemInstruction(mode: string = 'all', tone: string = 'balanced', timeFilter: string = 'all'): string {
  let instructions = `You are Nexus Search, an elite, high-precision AI Search Engine designed to provide real-time, authoritative, synthesized knowledge backed by web grounding.
Current Year is 2026. Always retrieve and ground your answers with the latest real-time web facts.

Format your responses with clean, rich Markdown:
- Start with a clear, direct answer or executive summary.
- Use bold headings (##, ###) for structured sections.
- Use bullet points and formatted comparison tables when comparing items or detailing specifications.
- Highlight key takeaways, numbers, metrics, and dates with bolding.
- Include balanced perspectives and recent developments.
- At the very end of your response, ALWAYS append a dedicated section titled "### Related Questions" containing 3-4 short, intriguing follow-up search queries formatted as a bulleted list (e.g. "- Follow-up query 1").`;

  if (mode === 'academic') {
    instructions += `\nMode: ACADEMIC & RESEARCH. Emphasize empirical evidence, scholarly citations, methodology, published papers, scientific journals, and peer-reviewed consensus.`;
  } else if (mode === 'code') {
    instructions += `\nMode: CODE & TECH. Provide clean, production-ready code blocks with language identifiers, architectural trade-offs, library versions, and syntax examples.`;
  } else if (mode === 'news') {
    instructions += `\nMode: REAL-TIME NEWS. Prioritize breaking updates, chronological timeline, verified news outlets, quotes from official statements, and recent events.`;
  } else if (mode === 'deep') {
    instructions += `\nMode: DEEP RESEARCH & SYNTHESIS. Provide a multi-faceted exhaustive breakdown with deep dive analysis, historical context, underlying mechanisms, future outlook, and critical evaluation.`;
  }

  if (timeFilter !== 'all') {
    instructions += `\nTime Horizon: Prioritize sources and developments from the past ${timeFilter}.`;
  }

  if (tone === 'concise') {
    instructions += `\nTone: High density, concise, direct to the point. No fluff.`;
  } else if (tone === 'comprehensive') {
    instructions += `\nTone: In-depth, exhaustive, comprehensive coverage with rich explanations and background.`;
  }

  return instructions;
}

// POST /api/search - Full JSON synthesis
app.post('/api/search', async (req, res) => {
  try {
    const { query, mode = 'all', tone = 'balanced', timeFilter = 'all', conversation = [] } = req.body as SearchRequest;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const systemInstruction = buildSystemInstruction(mode, tone, timeFilter);

    // Build contents for multi-turn or single turn
    let contents: any[] = [];
    if (conversation && conversation.length > 0) {
      for (const msg of conversation) {
        contents.push({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: query }],
      });
    } else {
      contents = [
        {
          role: 'user',
          parts: [{ text: query }],
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const rawText = response.text || '';
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract sources
    const sources: Array<{ title: string; url: string; domain: string }> = [];
    const chunks = groundingMetadata?.groundingChunks || [];
    const seenUrls = new Set<string>();

    for (const chunk of chunks) {
      if (chunk.web?.uri) {
        const uri = chunk.web.uri;
        if (!seenUrls.has(uri)) {
          seenUrls.add(uri);
          let domain = '';
          try {
            domain = new URL(uri).hostname.replace(/^www\./, '');
          } catch {
            domain = uri;
          }
          sources.push({
            title: chunk.web.title || domain || 'Web Reference',
            url: uri,
            domain,
          });
        }
      }
    }

    const webSearchQueries = groundingMetadata?.webSearchQueries || [];

    // Extract suggested follow-up questions from text if present
    const followUps: string[] = [];
    const relatedMatch = rawText.match(/### Related Questions\s*([\s\S]*?)(?:$)/i);
    if (relatedMatch && relatedMatch[1]) {
      const lines = relatedMatch[1].split('\n');
      for (const line of lines) {
        const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
        if (cleaned.length > 3 && cleaned.length < 120 && !cleaned.startsWith('#')) {
          followUps.push(cleaned);
        }
      }
    }

    // Fallbacks if no follow-ups found
    if (followUps.length === 0) {
      followUps.push(`Explain the key mechanisms of ${query.slice(0, 40)}`);
      followUps.push(`What are the pros and cons related to ${query.slice(0, 40)}?`);
      followUps.push(`Latest research and trends in ${query.slice(0, 40)}`);
    }

    res.json({
      text: rawText,
      sources,
      webSearchQueries,
      groundingMetadata,
      followUps: followUps.slice(0, 4),
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    res.status(500).json({
      error: formatErrorMessage(error),
    });
  }
});

// POST /api/search/stream - Server-Sent Events stream for real-time typing
app.post('/api/search/stream', async (req, res) => {
  try {
    const { query, mode = 'all', tone = 'balanced', timeFilter = 'all', conversation = [] } = req.body as SearchRequest;

    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const systemInstruction = buildSystemInstruction(mode, tone, timeFilter);

    let contents: any[] = [];
    if (conversation && conversation.length > 0) {
      for (const msg of conversation) {
        contents.push({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: query }],
      });
    } else {
      contents = [
        {
          role: 'user',
          parts: [{ text: query }],
        },
      ];
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    let fullText = '';
    let lastGroundingMetadata: any = null;

    for await (const chunk of responseStream) {
      const chunkText = chunk.text || '';
      if (chunkText) {
        fullText += chunkText;
        res.write(`data: ${JSON.stringify({ type: 'text', content: chunkText })}\n\n`);
      }
      const metadata = chunk.candidates?.[0]?.groundingMetadata;
      if (metadata) {
        lastGroundingMetadata = metadata;
      }
    }

    // Extract sources
    const sources: Array<{ title: string; url: string; domain: string }> = [];
    const chunks = lastGroundingMetadata?.groundingChunks || [];
    const seenUrls = new Set<string>();

    for (const chunk of chunks) {
      if (chunk.web?.uri) {
        const uri = chunk.web.uri;
        if (!seenUrls.has(uri)) {
          seenUrls.add(uri);
          let domain = '';
          try {
            domain = new URL(uri).hostname.replace(/^www\./, '');
          } catch {
            domain = uri;
          }
          sources.push({
            title: chunk.web.title || domain || 'Web Reference',
            url: uri,
            domain,
          });
        }
      }
    }

    const webSearchQueries = lastGroundingMetadata?.webSearchQueries || [];

    // Follow-ups
    const followUps: string[] = [];
    const relatedMatch = fullText.match(/### Related Questions\s*([\s\S]*?)(?:$)/i);
    if (relatedMatch && relatedMatch[1]) {
      const lines = relatedMatch[1].split('\n');
      for (const line of lines) {
        const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
        if (cleaned.length > 3 && cleaned.length < 120 && !cleaned.startsWith('#')) {
          followUps.push(cleaned);
        }
      }
    }

    res.write(
      `data: ${JSON.stringify({
        type: 'done',
        sources,
        webSearchQueries,
        followUps: followUps.slice(0, 4),
      })}\n\n`
    );
    res.end();
  } catch (error: any) {
    console.error('Search stream API error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: formatErrorMessage(error) })}\n\n`);
    res.end();
  }
});

// POST /api/tts - Audio narration using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS' });
      return;
    }

    // Strip markdown formatting for cleaner speech narration
    const cleanText = text
      .replace(/#{1,6}\s+/g, '')
      .replace(/\[\^?\d+\]/g, '')
      .replace(/[*_`]/g, '')
      .slice(0, 1000); // narrate up to 1000 characters smoothly

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Clear, engaging, articulate tech news anchor',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      res.status(500).json({ error: 'No audio returned' });
      return;
    }

    res.json({
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message || 'Failed to synthesize speech' });
  }
});

// GET /api/trending - Curated intelligent topic seeds
app.get('/api/trending', (_req, res) => {
  res.json({
    topics: [
      {
        category: 'AI & Frontier Tech',
        query: 'What are the newest breakthroughs in reasoning models and autonomous agents in 2026?',
        icon: 'cpu',
      },
      {
        category: 'Science & Space',
        query: 'What is the current status of the Artemis lunar missions and Starship deep space flights?',
        icon: 'rocket',
      },
      {
        category: 'Clean Energy & Climate',
        query: 'Latest advancements in commercial nuclear fusion and next-gen solid-state batteries',
        icon: 'zap',
      },
      {
        category: 'Markets & Economy',
        query: 'Global semiconductor supply chain outlook and AI infrastructure investments',
        icon: 'trending-up',
      },
      {
        category: 'Medicine & Biotech',
        query: 'CRISPR gene therapy clinical milestones and AI-accelerated protein drug discovery',
        icon: 'dna',
      },
      {
        category: 'Developer Ecosystem',
        query: 'Best practices for WebGPU and WebAssembly performance in modern full-stack web applications',
        icon: 'code',
      },
    ],
  });
});

// In dev mode, mount Vite middleware. In production, serve dist static files.
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Nexus Search Engine running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
