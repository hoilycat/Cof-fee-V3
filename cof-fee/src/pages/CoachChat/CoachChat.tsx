import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CoachChat.css';
import coachKong from '../../assets/characters/coach_kong.png';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
}

export const CoachChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "안녕하세요! 저는 당신의 AI 카페인 코치, 콩이입니다. 오늘 컨디션은 어떠신가요? ☕️", sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = { 
        id: Date.now() + 1, 
        text: "현재 카페인 섭취량이 적절하네요! 남은 하루도 활기차게 보내시길 응원할게요. 👍", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
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
            />
            <button className="send-button" onClick={handleSend}>
              <div className="send-triangle"></div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
