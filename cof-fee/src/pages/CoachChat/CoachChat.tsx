import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import './CoachChat.css';
import coachKong from '../../assets/characters/coach_kong.png';
import { fetchYIEInsight } from '../../lib/yieClient';
import { useCaffeine } from '../../hooks/useCaffeine';
import { caffeineLogsAtom } from '../../hooks/useCaffeineStore';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  isTyping?: boolean;
}

const CoachChat: React.FC = () => {
  const navigate = useNavigate();
  const { totalCaffeine } = useCaffeine();
  const logs = useAtomValue(caffeineLogsAtom);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "안녕하세요! 저는 당신의 AI 카페인 코치, 콩이입니다. 오늘 컨디션은 어떠신가요? ☕️", sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 최근 7일 평균 카페인 계산
  const avgCaffeine = Math.round(
    logs.slice(-7 * 10).reduce((sum, l) => sum + l.caffeineAmount, 0) / Math.max(7, 1)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const question = inputText;
    const newUserMsg: Message = { id: Date.now(), text: question, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    setIsLoading(true);

    // 타이핑 인디케이터 추가
    const typingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: typingId, text: '...', sender: 'ai', isTyping: true }]);

    const yieResponse = await fetchYIEInsight(question, { totalCaffeine, avgCaffeine });

    // 타이핑 인디케이터 제거 후 실제 응답 추가
    setMessages(prev => prev.filter(m => m.id !== typingId));

    const responseText = yieResponse
      ? (yieResponse.sections.recommendation ?? yieResponse.sections.summary ?? yieResponse.answer)
      : "지금은 YIE 서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요. 🙏";

    setMessages(prev => [...prev, { id: Date.now() + 2, text: responseText ?? yieResponse?.answer ?? "응답을 받지 못했어요.", sender: 'ai' }]);
    setIsLoading(false);
  };

  // 성운 배경 설정 (Dashboard와 유사한 감성)
  const nebulaColors = ['#E57B3E', '#526fd6', '#F3EAD8'];

  return (
    <div className="chat-shell">
      {/* 프리미엄 성운 배경 레이어 */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {nebulaColors.map((color, idx) => (
          <motion.div
            key={`nebula-${idx}`}
            className="absolute rounded-full"
            style={{
              backgroundColor: color,
              width: `${70 + idx * 20}%`,
              height: `${70 + idx * 20}%`,
              top: idx % 2 === 0 ? '-20%' : '30%',
              left: idx % 2 === 0 ? '20%' : '-20%',
              filter: 'blur(100px)',
              opacity: 0.15
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -60, 60, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 15 + idx * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="chat-frame"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 헤더 */}
        <header className="chat-header">
          <ChevronLeft 
            className="back-button" 
            size={28} 
            onClick={() => navigate('/')} 
          />
          <div className="header-coach-thumb">
            <img src={coachKong} alt="Coach Kong" />
          </div>
          <div className="header-title-container">
            <h1 className="header-title">AI 코치 콩이</h1>
            <span className="header-status">Online • Coaching</span>
          </div>
        </header>

        {/* 메시지 리스트 */}
        <div className="messages-container no-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`message ${msg.sender}`}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                {msg.isTyping ? (
                  <span className="typing-dots">
                    <span>•</span><span>•</span><span>•</span>
                  </span>
                ) : msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="h-10" /> {/* 추가적인 하단 여백 공간 */}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className="chat-bottom">
          <div className="chat-input-container">
            <input 
              type="text" 
              className="chat-input-field"
              placeholder="코치에게 메시지 보내기..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button className="send-button" onClick={handleSend} disabled={isLoading}>
              <div className="send-triangle"></div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachChat;