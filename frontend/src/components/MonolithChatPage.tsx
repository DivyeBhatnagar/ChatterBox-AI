import { useState, useRef, useEffect } from 'react';
import { TopAppBar } from './shared/TopAppBar';
import { useAuth } from '../hooks/useAuth';
import { chatApi, parseApiError } from '../lib/api';
import type { ChatMessage, ChatHistoryItem } from '../types/chat';

export const MonolithChatPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isNewChatMode, setIsNewChatMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Load chat history on mount - don't open any chat by default
  useEffect(() => {
    const loadHistory = async () => {
      // Wait a bit to ensure auth is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        if (!user) {
          setChatHistory([]);
          setIsLoadingHistory(false);
          return;
        }
        setIsLoadingHistory(true);
        const history = await chatApi.getHistory('', false);
        setChatHistory(history.items || []);
      } catch (err) {
        console.error('Failed to load chat history:', err);
        // Silently fail for initial load, don't show error toast
        setChatHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (user) {
      loadHistory();
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Load a specific conversation
  const loadConversation = async (convId: string) => {
    try {
      setIsLoadingPage(true);
      setMessages([]);
      setIsNewChatMode(false);
      const loaded = await chatApi.loadConversation(convId);
      setConversationId(convId);
      setMessages(loaded.messages.map((msg, idx) => ({
        id: `${idx}-${msg.role}`,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString(),
      })));
      // Scroll to bottom after loading
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo(0, messagesContainerRef.current.scrollHeight);
      }, 200);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setIsLoadingPage(false);
    }
  };

  // Delete a conversation
  const handleDeleteChat = async (convId: string) => {
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) return;
    
    try {
      setDeletingId(convId);
      await chatApi.deleteConversation(convId);
      
      // Remove from history
      setChatHistory(prev => prev.filter(item => item.conversation_id !== convId));
      
      // If deleted chat is currently open, close it
      if (conversationId === convId) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete chat');
    } finally {
      setDeletingId(null);
    }
  };

  // Rename a conversation
  const handleRenameChat = async (convId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      await chatApi.updateConversationTitle(convId, newTitle);
      setChatHistory(prev =>
        prev.map(item =>
          item.conversation_id === convId
            ? { ...item, conversation_title: newTitle }
            : item
        )
      );
      setRenamingId(null);
      setRenameValue('');
    } catch (err) {
      console.error('Error renaming conversation:', err);
      setError('Failed to rename conversation');
    }
  };

  // Create new chat
  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput('');
    setError(null);
    setIsNewChatMode(true);
  };

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
        setIsNewChatMode(false);
        // Add new conversation to history
        const newHistoryItem: ChatHistoryItem = {
          conversation_id: response.conversation_id,
          conversation_title: prompt.substring(0, 50),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_archived: false,
          last_message_preview: prompt.substring(0, 100),
          message_count: 2,
        };
        setChatHistory(prev => [newHistoryItem, ...prev]);
      }

      // Clean the response - remove all numbers, symbols, and keep only natural text
      let cleanedContent = response.response;
      cleanedContent = cleanedContent.replace(/Architect Node\s*/gi, '');
      cleanedContent = cleanedContent.replace(/Computation complete\s*/gi, '');
      cleanedContent = cleanedContent.replace(/Analysis Results\s*/gi, '');
      
      // Remove markdown/html formatting
      cleanedContent = cleanedContent.replace(/^#{1,6}\s+/gm, '');
      cleanedContent = cleanedContent.replace(/<[^>]+>/g, '');
      cleanedContent = cleanedContent.replace(/[*_`|•\-]/g, '');
      
      // Remove parentheses, brackets with content
      cleanedContent = cleanedContent.replace(/\([^)]*\)/g, ' ');
      cleanedContent = cleanedContent.replace(/\[[^\]]*\]/g, ' ');
      
      // Remove numbers and statistics - they create clutter
      cleanedContent = cleanedContent.replace(/\d+[,.\d]*/g, '');
      
      // Remove arrow symbols and other special characters
      cleanedContent = cleanedContent.replace(/→|←|↑|↓|=>|::|<-|>/g, '');
      
      // Clean up extra spaces and newlines
      cleanedContent = cleanedContent.replace(/\s{2,}/g, ' ');
      cleanedContent = cleanedContent.replace(/\n{2,}/g, '\n');
      cleanedContent = cleanedContent.trim();
      
      // If content is empty after cleaning, show original (fallback)
      if (!cleanedContent.trim()) {
        cleanedContent = response.response.substring(0, 500);
      }

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: cleanedContent,
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
      <main className="mt-20 h-[calc(100vh-5rem)] flex flex-row relative bg-surface-container-lowest">
        {/* Chat History Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-neutral-900 border-r border-white/5 overflow-y-auto">
          <div className="px-6 py-6 border-b border-white/5">
            <h2 className="text-white font-black italic font-headline tracking-wider text-sm">CHATTERBOX</h2>
            <p className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mt-2">Chat History</p>
            <button
              onClick={handleNewChat}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-primary/80 hover:bg-primary text-white px-4 py-2.5 text-xs font-bold rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>New Chat</span>
            </button>
          </div>
          
          {isLoadingHistory ? (
            <div className="flex items-center justify-center flex-1 py-8">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex items-center justify-center flex-1 py-8 px-4 text-center">
              <p className="text-xs text-neutral-500">No chats yet. Start a new one!</p>
            </div>
          ) : (
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {chatHistory.map((item) => (
                <div
                  key={item.conversation_id}
                  className={`group flex items-center gap-2 p-3 rounded-sm transition-all duration-300 ${
                    conversationId === item.conversation_id
                      ? 'bg-white/10 text-white'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {renamingId === item.conversation_id ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameChat(item.conversation_id, renameValue)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameChat(item.conversation_id, renameValue);
                        } else if (e.key === 'Escape') {
                          setRenamingId(null);
                          setRenameValue('');
                        }
                      }}
                      autoFocus
                      className="flex-1 bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20 focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <button
                      onClick={() => loadConversation(item.conversation_id)}
                      className="flex-1 text-left text-xs truncate"
                    >
                      {item.conversation_title || 'Untitled Chat'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRenamingId(item.conversation_id);
                      setRenameValue(item.conversation_title || '');
                    }}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 hover:bg-white/10 rounded transition-all"
                    title="Rename chat"
                  >
                    <span className="material-symbols-outlined text-xs text-white/60 hover:text-white">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteChat(item.conversation_id)}
                    disabled={deletingId === item.conversation_id}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 hover:bg-red-500/20 rounded transition-all"
                    title="Delete chat"
                  >
                    {deletingId === item.conversation_id ? (
                      <span className="material-symbols-outlined text-xs animate-spin">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-xs text-red-400 hover:text-red-300">delete</span>
                    )}
                  </button>
                </div>
              ))}
            </nav>
          )}
          
          <div className="px-2 py-4 border-t border-white/5 space-y-1">
            <button className="w-full flex items-center gap-2 text-neutral-500 px-4 py-2 text-xs rounded-sm hover:bg-white/5 hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">help_outline</span>
              <span>Support</span>
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col overflow-hidden">
          {/* Show loading while checking authentication */}
          {authLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-on-surface-variant text-sm">Checking session...</p>
              </div>
            </div>
          )}

          {!authLoading && (
            <>
          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3 rounded-sm max-w-md">
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}

          {/* Node Active Indicator - Show only when a chat is selected */}
          {conversationId && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-3 px-4 py-1.5 glass-node rounded-full border border-white/10 shadow-2xl">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-white/80 font-headline">CHAT ACTIVE</span>
              </div>
            </div>
          )}

          {/* Chat Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!conversationId && !isNewChatMode ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-white/40">chat_bubble</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-white mb-2">Select a Chat</h2>
                    <p className="text-neutral-400 text-sm">Choose a conversation from the sidebar or start a new one</p>
                  </div>
                </div>
              </div>
            ) : isLoadingPage ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <p className="text-on-surface-variant text-sm">Loading conversation...</p>
                </div>
              </div>
            ) : (
              <>
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="w-full max-w-3xl mx-auto space-y-8">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-12">
                        <div className="flex flex-col items-start max-w-2xl">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-sm bg-surface-container-high flex items-center justify-center border border-white/5">
                              <span className="material-symbols-outlined text-xs text-on-surface-variant">chat_bubble</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-headline">
                              New Conversation
                            </span>
                          </div>
                          <p className="text-lg font-light text-white leading-relaxed tracking-tight pl-12">
                            This conversation is empty. Send a message to get started!
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="flex flex-col items-start">
                          {message.role === 'user' ? (
                            <div className="w-full">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="w-8 h-8 rounded-sm bg-surface-container-high flex items-center justify-center border border-white/5">
                                  <span className="material-symbols-outlined text-xs text-on-surface-variant">person</span>
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase font-headline">
                                  You
                                </span>
                              </div>
                              <p className="text-white font-light leading-relaxed pl-12">{message.content}</p>
                            </div>
                          ) : (
                            <div className="w-full">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                  <span className="material-symbols-outlined text-on-primary font-bold text-sm">smart_toy</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-black tracking-widest text-white uppercase font-headline">
                                    ChatterBox AI
                                  </span>
                                </div>
                              </div>
                              <div className="pl-14 bg-white text-black p-6 rounded-sm shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden max-w-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-neutral-200/50 pointer-events-none"></div>
                                <div className="relative z-10">
                                  <div className="font-body text-sm leading-relaxed text-black/85 break-words whitespace-normal">{message.content}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {isSending && (
                      <div className="flex flex-col items-start">
                        <div className="w-full">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                              <span className="material-symbols-outlined text-on-primary font-bold text-sm">smart_toy</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black tracking-widest text-white uppercase font-headline">
                                ChatterBox AI
                              </span>
                              <div className="flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Chat Footer */}
          {(conversationId || isNewChatMode) && (
            <footer className="w-full px-6 pb-6 pt-4 border-t border-white/5">
              <div className="relative group max-w-3xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-sm blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-end gap-4 p-4 glass-node rounded-sm border border-white/10">
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
                      placeholder="Type your message..."
                      rows={1}
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending}
                    className="group relative flex items-center justify-center w-12 h-12 bg-white rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-neutral-300 opacity-50"></div>
                    <span className="material-symbols-outlined text-black relative z-10 font-bold">
                      {isSending ? 'hourglass_bottom' : 'arrow_upward'}
                    </span>
                  </button>
                </div>
              </div>
            </footer>
          )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};
