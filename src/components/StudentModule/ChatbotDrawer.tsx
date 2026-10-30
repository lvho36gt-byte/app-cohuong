import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, AlertCircle, BookOpen, MessageSquare } from 'lucide-react';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudentCode: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  'Giải thích giúp mình từ "mèn mén" và "thắng dền"',
  'Gợi ý cách mở bài tả cảnh Núi Đôi Cô Tiên',
  'Làm sao để phân biệt từ ghép và từ láy?',
  'Giúp mình tìm từ ngữ tả sương sớm Quản Bạ'
];

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  activeStudentCode
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: `Chào bạn! Mình là Bạn đồng hành VĂN SẮC của môn Ngữ văn 6 trường Quyết Tiến. Mình sẵn sàng giúp bạn giải thích từ ngữ khó, gợi ý dàn ý bài viết và tìm hiểu cảnh sắc Quản Bạ. Bạn đang cần trợ giúp điều gì nào? (Lưu ý: Mình sẽ không viết hộ bài đâu nhé, mà sẽ cùng bạn tự sáng tạo!)`,
      time: 'Vừa xong'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyPayload,
          message: text.trim(),
          studentContext: {
            studentCode: activeStudentCode,
            level: 'Lớp 6',
            currentTopic: 'Ngữ văn 6 – Kết nối tri thức với cuộc sống'
          }
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: data.reply || data.error || 'Mình đang lắng nghe bạn. Bạn hãy chia sẻ thêm suy nghĩ của mình nhé!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          sender: 'assistant',
          text: 'Rất tiếc, đường truyền mạng hoặc kết nối máy chủ đang bận. Bạn hãy thử gửi lại câu hỏi nhé!',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full flex flex-col shadow-2xl border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm tracking-wide text-amber-200">
                Bạn đồng hành VĂN SẮC
              </div>
              <div className="text-[11px] text-emerald-200">
                Trợ lý sư phạm Ngữ văn 6 · Quản Bạ
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            aria-label="Đóng bảng trò chuyện"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety & Educational Ethics Notice */}
        <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Gợi mở tư duy & sáng tạo · Tuyệt đối không viết hộ bài học sinh</span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map(msg => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                    isMe
                      ? 'bg-emerald-800 text-white rounded-tr-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-tl-xs font-serif'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isMe ? 'text-emerald-200/80' : 'text-stone-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-stone-500 italic">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Bạn đồng hành đang suy nghĩ câu trả lời gợi mở...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
          <div className="text-[10px] text-stone-500 mb-1 px-1">Gợi ý câu hỏi nhanh:</div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-full text-[11px] text-stone-700 dark:text-stone-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Đặt câu hỏi về bài học hoặc từ ngữ Quản Bạ..."
              className="flex-1 p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
