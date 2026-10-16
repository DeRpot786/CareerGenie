import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  Copy,
  Check
} from 'lucide-react';
import { sendCareerChatMessage } from '../../api/aiService';

const STARTER_PROMPTS = [
  'How can I improve my CV work experience bullets?',
  'Ask me a realistic technical interview question for my role.',
  'Draft a polite follow-up email after a job application.',
  'What key skills should I learn next to boost my ATS score?'
];

export const AIChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('careergenie_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}

    let candidateName = 'there';
    try {
      const p = JSON.parse(localStorage.getItem('careergenie_profile') || '{}');
      if (p.fullName) candidateName = p.fullName.split(' ')[0];
    } catch {}

    return [
      {
        role: 'assistant',
        content: `Hi **${candidateName}**! I'm your **CareerGenie AI Assistant**.\n\nI can help optimize your CV bullet points, run mock interview questions, draft recruiter emails, or guide your learning roadmap. How can I help today?`,
        suggestedFollowUps: STARTER_PROMPTS.slice(0, 3)
      }
    ];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('careergenie_chat_history', JSON.stringify(messages));
    } catch {}
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput('');

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Gather user profile context to ground AI honestly
      let profileContext = {
        name: 'Candidate',
        targetRole: 'Software Professional',
      };
      try {
        const savedProfile = localStorage.getItem('careergenie_profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          profileContext = {
            ...profileContext,
            skills: parsed.skills,
            summary: parsed.summary,
            projects: parsed.projects,
          };
        }
      } catch {}

      const res = await sendCareerChatMessage({
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        profile: profileContext
      });

      if (res && res.reply) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: res.reply,
            suggestedFollowUps: res.suggestedFollowUps || []
          }
        ]);
      } else {
        throw new Error('Empty AI response received.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **AI Service Notice**: ${err.message || 'Failed to generate response.'}\n\nPlease verify that your API key is configured or click **Retry** below.`,
          isError: true,
          failedText: text
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (failedText) => {
    if (!failedText) return;
    // Remove the error message and re-send
    setMessages(prev => prev.slice(0, prev.length - 1));
    handleSendMessage(failedText);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    const initialMsg = [
      {
        role: 'assistant',
        content: `Chat session reset. What career or CV challenge can I help you tackle next?`,
        suggestedFollowUps: STARTER_PROMPTS
      }
    ];
    setMessages(initialMsg);
    sessionStorage.removeItem('careergenie_chat_history');
    setError(null);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-chat-trigger-btn no-print"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.85rem 1.35rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-purple) 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4), 0 2px 6px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.01em',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(99, 102, 241, 0.55), 0 4px 10px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4), 0 2px 6px rgba(0,0,0,0.2)';
          }}
          aria-label="Open AI Career Assistant"
        >
          <Sparkles size={18} style={{ color: '#fed7aa', animation: 'spin 6s linear infinite' }} />
          <span>Ask CareerGenie AI</span>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className="ai-chat-drawer-container no-print"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '400px',
            maxWidth: 'calc(100vw - 32px)',
            height: '580px',
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 'var(--radius-xl, 18px)',
            background: 'var(--bg-surface, #18181b)',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
            boxShadow: '0 20px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
            overflow: 'hidden',
            animation: 'fadeInUp 0.22s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--accent-purple) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    CareerGenie AI
                  </h3>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      fontWeight: 600,
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    Gemini Live
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Career, CV & Interview Mentor
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '0.85rem 1rem',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isUser
                        ? 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)'
                        : msg.isError
                        ? 'rgba(239, 68, 68, 0.12)'
                        : 'var(--bg-card, rgba(255, 255, 255, 0.05))',
                      color: isUser ? '#ffffff' : 'var(--text-main)',
                      border: msg.isError
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : isUser
                        ? 'none'
                        : '1px solid var(--border-color)',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      position: 'relative',
                    }}
                  >
                    {msg.content}

                    {/* Copy text action for assistant messages */}
                    {!isUser && !msg.isError && (
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                        }}
                        title="Copy message"
                      >
                        {copiedIndex === idx ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                      </button>
                    )}

                    {/* Retry button for error states */}
                    {msg.isError && msg.failedText && (
                      <div style={{ marginTop: '0.65rem' }}>
                        <button
                          onClick={() => handleRetry(msg.failedText)}
                          style={{
                            background: 'var(--primary-600)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <RotateCcw size={12} /> Retry
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-ups */}
                  {!isUser && msg.suggestedFollowUps?.length > 0 && idx === messages.length - 1 && !loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px', width: '92%' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        Suggested topics:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {msg.suggestedFollowUps.map((chip, chipIdx) => (
                          <button
                            key={chipIdx}
                            onClick={() => handleSendMessage(chip)}
                            style={{
                              background: 'rgba(99, 102, 241, 0.1)',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                              color: 'var(--primary-300, #a5b4fc)',
                              borderRadius: '999px',
                              padding: '4px 10px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                              e.currentTarget.style.borderColor = 'var(--primary-500)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                            }}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <Bot size={16} />
                </div>
                <div
                  style={{
                    padding: '0.6rem 0.9rem',
                    borderRadius: '14px',
                    background: 'var(--bg-card, rgba(255, 255, 255, 0.05))',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CareerGenie is analyzing</span>
                  <span className="typing-dot" style={{ animation: 'blink 1.4s infinite 0.2s' }}>.</span>
                  <span className="typing-dot" style={{ animation: 'blink 1.4s infinite 0.4s' }}>.</span>
                  <span className="typing-dot" style={{ animation: 'blink 1.4s infinite 0.6s' }}>.</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask advice, interview prep, or CV tips..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  background: 'var(--bg-main, #09090b)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary-500)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md, 8px)',
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-purple) 100%)'
                    : 'var(--border-color)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.15s ease',
                  opacity: input.trim() && !loading ? 1 : 0.5,
                }}
              >
                <Send size={16} />
              </button>
            </form>
            <div style={{ marginTop: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                Powered by Gemini • Grounded in your profile • Never shares private data
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
