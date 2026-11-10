// Mobile sticky bottom bar + floating Ask Relif assistant bubble

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Calendar, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES, APP_CONFIG } from '@/config/constants';

// ── Mobile Sticky Bottom Bar ─────────────────────────────────────────────
export function MobileBottomBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden bg-paper border-t border-sage-light"
      style={{ zIndex: 'var(--z-float)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-3">
        <a
          href={`tel:${APP_CONFIG.emergencyNumber}`}
          className="flex flex-col items-center gap-1 py-3 text-ink-soft hover:text-verdigris transition-colors"
          aria-label="Call Relif Hospital"
        >
          <Phone size={22} />
          <span className="text-xs font-medium">Call</span>
        </a>
        
        <a
          href="https://wa.me/91XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-ink-soft hover:text-verdigris transition-colors"
          aria-label="WhatsApp Relif Hospital"
        >
          <MessageCircle size={22} />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>
        
        <Link
          to={ROUTES.book}
          className="flex flex-col items-center gap-1 py-3 font-medium transition-colors"
          style={{ background: 'var(--saffron)', color: 'var(--ink)' }}
          aria-label="Book appointment"
        >
          <Calendar size={22} />
          <span className="text-xs font-medium">Book</span>
        </Link>
      </div>
    </div>
  );
}

// ── Ask Relif Assistant Bubble ────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  default: "Hi! I'm Relif's hospital guide. I can help you find departments, doctors, or explain how to book an appointment. What can I help you with?\n\n⚠ I provide information only — not medical advice. For emergencies, please call our emergency line.",
  book: "To book an appointment:\n1. Visit our **Book Appointment** page\n2. Select a department or doctor\n3. Choose your branch, date and slot\n4. Enter patient details and confirm\n\nYou'll receive an appointment ID and QR code for check-in.",
  department: "We have 20 departments including Cardiology, Neurology, Orthopedics, Pediatrics, and more. Would you like to find a specific department or doctor?",
  emergency: "🚨 For emergencies, please call our emergency line immediately: " + APP_CONFIG.emergencyNumber + " (Demo)\n\nOur Emergency Medicine department is open 24/7.",
  doctor: "You can browse all our doctors at /doctors, filter by department, specialty, language, or availability. Would you like help finding a specific type of doctor?",
};

export function AskRelifBubble() {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState<Message[]>([
    { id: '0', role: 'assistant', content: DEMO_RESPONSES.default }
  ]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);

  const getResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('book') || q.includes('appointment')) return DEMO_RESPONSES.book;
    if (q.includes('emergency') || q.includes('urgent')) return DEMO_RESPONSES.emergency;
    if (q.includes('doctor') || q.includes('specialist')) return DEMO_RESPONSES.doctor;
    if (q.includes('department') || q.includes('cardio') || q.includes('ortho')) return DEMO_RESPONSES.department;
    return "I can help with finding departments, doctors, booking appointments, or general hospital information. What would you like to know?\n\n⚠ For medical questions, please consult a qualified doctor.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // Simulated delay
    await new Promise(r => setTimeout(r, 800));
    
    const response = getResponse(input);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };
    
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Assistant chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-80 md:w-96"
            style={{ zIndex: 'var(--z-assistant)' }}
          >
            <div className="bg-paper border border-sage-light rounded-2xl shadow-warm-xl overflow-hidden flex flex-col"
                 style={{ maxHeight: '70vh' }}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-sage-light"
                   style={{ background: 'var(--verdigris-deep)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-mint flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
                      <path d="M4 20C10 12 16 8 20 8C24 8 30 12 36 20C30 28 24 32 20 32C16 32 10 28 4 20Z" stroke="var(--verdigris)" strokeWidth="2.5" fill="none"/>
                      <circle cx="20" cy="20" r="4" fill="var(--verdigris)"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Ask Relif</p>
                    <p className="text-xs" style={{ color: 'var(--sage)' }}>Hospital Guide · Not medical advice</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Close assistant"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Disclaimer */}
              <div className="px-4 py-2 text-xs font-medium border-b border-sage-light"
                   style={{ background: 'var(--bone)', color: 'var(--ink-soft)' }}>
                ℹ This assistant provides hospital information only. It does not diagnose or prescribe.
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                  >
                    <div
                      className="max-w-[85%] text-sm rounded-2xl px-4 py-2.5 leading-relaxed"
                      style={msg.role === 'user'
                        ? { background: 'var(--verdigris)', color: 'white', borderRadius: '20px 20px 4px 20px' }
                        : { background: 'var(--bone)', color: 'var(--ink)', border: '1px solid var(--sage-light)', borderRadius: '20px 20px 20px 4px' }
                      }
                    >
                      {msg.content.split('\n').map((line, i) => (
                        <span key={i}>{line}<br /></span>
                      ))}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--bone)', border: '1px solid var(--sage-light)' }}>
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: 'var(--sage)',
                              animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-sage-light">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about departments, doctors, booking…"
                    className="flex-1 text-sm px-3 py-2 rounded-pill border border-sage-light bg-bone focus:border-verdigris focus:outline-none focus:ring-2 focus:ring-verdigris/15 text-ink placeholder:text-ink-muted"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-2 rounded-full disabled:opacity-40 transition-colors"
                    style={{ background: 'var(--verdigris)', color: 'white' }}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full shadow-warm-lg flex items-center justify-center transition-transform"
        style={{
          background: isOpen ? 'var(--ink)' : 'var(--verdigris)',
          color: 'white',
          zIndex: 'var(--z-assistant)',
          boxShadow: 'var(--shadow-verdigris)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close Ask Relif assistant' : 'Open Ask Relif assistant'}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                <path d="M4 20C10 12 16 8 20 8C24 8 30 12 36 20C30 28 24 32 20 32C16 32 10 28 4 20Z" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="20" cy="20" r="4" fill="white"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

