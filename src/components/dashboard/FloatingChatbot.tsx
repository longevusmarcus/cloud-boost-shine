import { useState, useEffect } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  { text: "Progressing well! Keep optimizing 💪", emoji: "🚀" },
  { text: "Your sperm value is rising! 📈", emoji: "💎" },
  { text: "Consistency is key! Great streak! 🔥", emoji: "⭐" },
  { text: "You're on track to donor status! 🏆", emoji: "👑" },
  { text: "Marketplace coming soon... 💰", emoji: "🎯" },
  { text: "Keep this up for premium results! ✨", emoji: "🌟" },
  { text: "Your swimmers are getting stronger! 💪", emoji: "🏊" },
  { text: "Donor list unlocked! Coming soon... 🎉", emoji: "🎊" }
];

interface FloatingChatbotProps {
  profile?: any;
}

export default function FloatingChatbot({ profile }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!bubbleDismissed) {
        setShowBubble(true);
        selectRandomMessage();
      }
    }, 2000);

    const interval = setInterval(() => {
      if (!isOpen && showBubble && !bubbleDismissed) {
        selectRandomMessage();
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, showBubble, bubbleDismissed]);

  const selectRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex]);
  };

  const closeBubble = () => {
    setShowBubble(false);
    setBubbleDismissed(true);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full bg-black hover:bg-gray-800 shadow-lg flex items-center justify-center transition-all duration-200 group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="mascot"
              initial={{ rotate: 0 }}
              animate={{ rotate: isOpen ? 0 : [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: isOpen ? 0 : Infinity, repeatDelay: 3 }}
              className="text-3xl"
            >
              💬
            </motion.div>
          </AnimatePresence>

          {showBubble && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            />
          )}

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Sparkles className="absolute top-0 right-0 w-4 h-4 text-yellow-400" />
          </motion.div>
        </button>

        {/* Message Bubble */}
        <AnimatePresence>
          {showBubble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 right-0 w-64"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4 relative">
                <button
                  onClick={closeBubble}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                  aria-label="Close message"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
                <div className="flex items-start gap-3 pr-4">
                  <div className="text-3xl flex-shrink-0">{currentMessage.emoji}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{currentMessage.text}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 md:bottom-24 md:right-8 w-80 md:w-96 z-40"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center gap-3">
                <div className="text-2xl">🤖</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">Sperm Coach AI</h3>
                  <p className="text-gray-300 text-xs">Your spermaxxing buddy</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="text-2xl">🎉</div>
                  <div className="bg-gray-100 rounded-2xl p-3 flex-1">
                    <p className="text-sm text-gray-900">
                      Hey! You're doing amazing! Your sperm value is ${profile?.sperm_value?.toLocaleString() || '0'} 💰
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-2"
                >
                  <div className="text-2xl">🚀</div>
                  <div className="bg-gray-100 rounded-2xl p-3 flex-1">
                    <p className="text-sm text-gray-900">
                      {currentMessage.text}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-2"
                >
                  <div className="text-2xl">💡</div>
                  <div className="bg-gray-100 rounded-2xl p-3 flex-1">
                    <p className="text-sm text-gray-900">
                      Keep logging daily to unlock premium features and donor status! 🏆
                    </p>
                  </div>
                </motion.div>

                {profile?.current_streak >= 7 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-2"
                  >
                    <div className="text-2xl">🔥</div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-3 flex-1">
                      <p className="text-sm text-gray-900 font-semibold">
                        {profile.current_streak} day streak! You're on fire! Keep it up! 🔥
                      </p>
                    </div>
                  </motion.div>
                )}

                {profile?.sperm_value >= 3000 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-start gap-2"
                  >
                    <div className="text-2xl">👑</div>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-3 flex-1">
                      <p className="text-sm text-gray-900 font-semibold">
                        Premium quality detected! Donor marketplace coming soon... 💎
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600 text-center">
                  AI-powered insights • More features coming soon
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
