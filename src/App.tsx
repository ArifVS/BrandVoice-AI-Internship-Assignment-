/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Sparkles, 
  Send, 
  Twitter, 
  Target, 
  Briefcase, 
  Package, 
  Loader2, 
  Copy, 
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface BrandVoiceSummary {
  tone: string;
  audience: string;
  themes: string[];
}

interface Tweet {
  content: string;
  type: 'conversational' | 'promotional' | 'witty' | 'informative';
}

interface AnalysisResult {
  summary: BrandVoiceSummary;
  tweets: Tweet[];
}

export default function App() {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [objective, setObjective] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !industry || !objective || !productDetails) return;

    setLoading(true);
    try {
      const model = "gemini-3.1-pro-preview";
      const prompt = `
        You are a social media strategist and brand voice expert.
        Analyze the following brand and generate tweets that match its tone, personality, and communication style.

        Input:
        Brand Name: ${brandName}
        Industry: ${industry}
        Campaign Objective: ${objective}
        Product Details: ${productDetails}

        Step 1 – Analyse Brand Voice
        Provide a short summary including:
        - Tone of the brand (witty, premium, humorous, informative, bold, minimal etc.)
        - Target audience
        - Typical content themes

        Step 2 – Generate Tweets
        Generate 10 tweets that match the brand's tone and communication style.
        Include a mix of:
        - engaging / conversational tweets
        - promotional tweets
        - witty or meme-style tweets
        - informative / value-driven tweets

        Output the result in JSON format with the following structure:
        {
          "summary": {
            "tone": "string describing the tone",
            "audience": "string describing the target audience",
            "themes": ["theme 1", "theme 2", "theme 3"]
          },
          "tweets": [
            { "content": "tweet text", "type": "conversational | promotional | witty | informative" }
          ]
        }
      `;

      const response = await genAI.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.OBJECT,
                properties: {
                  tone: { type: Type.STRING },
                  audience: { type: Type.STRING },
                  themes: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["tone", "audience", "themes"]
              },
              tweets: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING },
                    type: { type: Type.STRING }
                  },
                  required: ["content", "type"]
                }
              }
            },
            required: ["summary", "tweets"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (error) {
      console.error("Error generating strategy:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">BrandVoice AI</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="hidden sm:inline">Social Media Strategist</span>
            <div className="h-4 w-px bg-gray-200" />
            <Twitter className="w-4 h-4" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-3">Define Your Brand</h2>
                <p className="text-gray-500 leading-relaxed">
                  Provide your brand details and our AI strategist will craft a voice profile and high-engagement content strategy.
                </p>
              </div>

              <form onSubmit={generateStrategy} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Brand Name
                  </label>
                  <input
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., Zomato, Tesla, Nike"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Industry
                  </label>
                  <input
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Food Delivery, Tech, Fashion"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Target className="w-3 h-3" /> Campaign Objective
                  </label>
                  <input
                    required
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g., Engagement, Brand Awareness, Sales"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Package className="w-3 h-3" /> Product Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    placeholder="Describe your product or service in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Brand...
                    </>
                  ) : (
                    <>
                      Generate Strategy
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full min-h-[500px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to strategize?</h3>
                  <p className="text-gray-500 max-w-xs">
                    Fill out the form to see your brand voice analysis and generated tweets.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-gray-500 font-medium animate-pulse">Consulting the AI strategist...</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Brand Voice Summary Card */}
                  <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold">Brand Voice Summary</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Tone</h4>
                          <p className="text-lg font-medium text-gray-800">{result.summary.tone}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Target Audience</h4>
                          <p className="text-gray-600 leading-relaxed">{result.summary.audience}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Content Themes</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.summary.themes.map((theme, i) => (
                            <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Tweets List */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl font-bold">Generated Tweets</h3>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">10 Drafts</span>
                    </div>

                    <div className="space-y-4">
                      {result.tweets.map((tweet, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                                  tweet.type === 'witty' ? 'bg-amber-100 text-amber-700' :
                                  tweet.type === 'promotional' ? 'bg-rose-100 text-rose-700' :
                                  tweet.type === 'informative' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {tweet.type}
                                </span>
                              </div>
                              <p className="text-gray-800 leading-relaxed text-lg">
                                {tweet.content}
                              </p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(tweet.content, index)}
                              className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-indigo-600"
                              title="Copy to clipboard"
                            >
                              {copiedIndex === index ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Powered by Gemini AI</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API Status</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
