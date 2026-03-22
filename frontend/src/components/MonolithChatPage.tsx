import { useState, useRef, useEffect } from 'react';
import { TopAppBar } from './shared/TopAppBar';
import { SideNavBar } from './shared/SideNavBar';
import { useAuth } from '../hooks/useAuth';
import { chatApi, parseApiError } from '../lib/api';
import type { ChatMessage } from '../types/chat';

export const MonolithChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load conversation history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const history = await chatApi.getHistory('', false);
        if (history.items.length > 0) {
          const latestConversation = history.items[0];
          setConversationId(latestConversation.conversation_id);
          const loaded = await chatApi.loadConversation(latestConversation.conversation_id);
          setMessages(loaded.messages.map((msg, idx) => ({
            id: `${idx}-${msg.role}`,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: msg.timestamp || new Date().toISOString(),
          })));
        } else {
          // New conversation
          setConversationId('');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load conversation history:', err);
        setError('Failed to load conversation history');
        setIsLoading(false);
      }
    };

    if (user) {
      loadHistory();
    }
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || isSending || !user) return;

    setIsSending(true);
    setError(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chatApi.sendMessage({
        message: prompt,
        history: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
        conversation_id: conversationId || undefined,
      });

      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        model: response.model,
        usage: response.usage,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = parseApiError(err);
      setError(errorMsg);
      console.error('Chat error:', err);
      
      // Remove the user message if sending failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body h-screen overflow-hidden">
      <TopAppBar />
      <SideNavBar active="nexus" />
      <main className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col relative bg-surface-container-lowest">
        {/* Node Active Indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-3 px-4 py-1.5 glass-node rounded-full border border-white/10 shadow-2xl">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/80 font-headline">CHAT 01 ACTIVE</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3 rounded-sm max-w-md">
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-300"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        {/* Chat Content Area */}
        <section className="flex-1 overflow-y-auto px-6 py-24 w-full max-w-4xl mx-auto space-y-16">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-on-surface-variant">Loading conversation history...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-start max-w-2xl group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-sm bg-surface-container-high flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-xs text-on-surface-variant">person</span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-headline">
                  Start Conversation
                </span>
              </div>
              <p className="text-xl md:text-2xl font-light text-white leading-relaxed tracking-tight pl-12">
                Hello! I'm ChatterBox AI. Ask me anything—I'm here to help with questions, brainstorming, learning, or just having an interesting conversation.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex flex-col items-start max-w-2xl">
                {message.role === 'user' ? (
                  <div className="flex items-center gap-4 mb-4 w-full">
                    <div className="w-8 h-8 rounded-sm bg-surface-container-high flex items-center justify-center border border-white/5">
                      <span className="material-symbols-outlined text-xs text-on-surface-variant">person</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-headline">
                      User Query
                    </span>
                  </div>
                ) : (
                  <div className="relative pl-12 w-full">
                    <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent"></div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <span className="material-symbols-outlined text-on-primary font-bold text-sm">token</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-white uppercase font-headline">
                          Architect Node
                        </span>
                        <p className="text-[9px] text-neutral-500 uppercase tracking-tighter">Computation complete</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className={message.role === 'assistant' ? 'pl-12' : ''}>
                  {message.role === 'assistant' ? (
                    <div className="bg-white text-black p-10 rounded-sm shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden max-w-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-neutral-200/50 pointer-events-none"></div>
                      <div className="relative z-10">
                        <h3 className="font-headline font-extrabold text-2xl mb-6 tracking-tighter uppercase border-b border-black/10 pb-4">
                          Analysis Results
                        </h3>
                        <p className="font-body text-sm leading-relaxed text-black/80">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg font-light text-white leading-relaxed tracking-tight">{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Chat Footer */}
        <footer className="w-full max-w-4xl mx-auto px-6 pb-12 pt-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-sm blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-end gap-4 p-4 glass-node rounded-sm border border-white/10">
              <button className="mb-2 p-2 text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">attachment</span>
              </button>
              <div className="flex-1 min-h-[48px] flex items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-600 font-body text-base resize-none py-2"
                  placeholder="Enter command for Architect Node 01..."
                  rows={1}
                ></textarea>
              </div>
              <button
                onClick={handleSendMessage}
                className="group relative flex items-center justify-center w-12 h-12 bg-white rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-neutral-300 opacity-50"></div>
                <span className="material-symbols-outlined text-black relative z-10 font-bold">arrow_upward</span>
              </button>
            </div>
            <div className="mt-4 flex justify-between items-center px-2">
              <div className="flex gap-4">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-600 uppercase">Latency: 12ms</span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-600 uppercase">Token Rate: 140/s</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-600 uppercase">
                  Model: Architect-V4
                </span>
                <div className="w-2 h-2 rounded-full border border-neutral-600"></div>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Sphere */}
        <div className="fixed bottom-32 right-12 w-32 h-32 opacity-20 pointer-events-none hidden xl:block">
          <div className="absolute inset-0 bg-white blur-[60px] rounded-full"></div>
          <img
            alt="3D Glass Sphere"
            className="w-full h-full object-contain mix-blend-screen animate-pulse"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAErisuiHO8VxZuIEg3C_xCw98dUN51_24PzQjcydTexR21dGV7Z5cl6l0QoA9o22BxW8EHVKJmnOL4Ahkmdd0-xiH9SCzfjcQRejCe4NwDP6LWslKs6ykAeMUJuKNBCDZO4C00Y6spxrbxaaGVFwpTSS1-TAeYQv3L70T4OY_xcerNsrr-x3CmHEF2He9v8fBMHCIsVJrmN9PWdJRdfr61xZiFhpjjLY5YdHy5Ys8om9tjU098wkbHq2nXLyyDvZgPu9vInlHlKXM"
          />
        </div>
      </main>
    </div>
  );
};
