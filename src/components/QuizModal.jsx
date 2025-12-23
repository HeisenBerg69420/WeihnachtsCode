
import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, ArrowRight, GripHorizontal, Heart, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// Memoized sub-components with Premium/Romantic Styling
const ChoiceOption = memo(({ option, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative w-full p-5 md:p-6 text-left rounded-2xl text-lg transition-all duration-300 border-2 group overflow-hidden",
      isSelected 
        ? "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-200 scale-[1.02]" 
        : "bg-white border-rose-100 text-gray-600 hover:border-rose-300 hover:bg-rose-50/50 hover:shadow-md"
    )}
  >
    <div className="relative z-10 flex items-center justify-between">
      <span className={cn("font-medium tracking-wide", isSelected ? "text-white font-semibold" : "text-gray-700")}>
        {option}
      </span>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white/20 p-1.5 rounded-full"
        >
          <Heart size={18} fill="currentColor" className="text-white" />
        </motion.div>
      )}
    </div>
    {/* Decorative background element for selected state */}
    {isSelected && (
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-400 rounded-full opacity-20 blur-xl" />
    )}
  </button>
));

const ReorderItem = memo(({ item }) => (
  <Reorder.Item 
    value={item}
    className="bg-white/90 backdrop-blur-sm border-2 border-rose-100 rounded-2xl p-4 md:p-5 shadow-sm flex items-center justify-between cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-rose-300 transition-all duration-300 group"
  >
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-rose-200 group-hover:bg-rose-400 transition-colors" />
      <span className="text-lg text-gray-700 font-medium">{item.text}</span>
    </div>
    <div className="p-2 bg-rose-50 rounded-xl text-rose-300 group-hover:text-rose-500 transition-colors">
      <GripHorizontal size={20} />
    </div>
  </Reorder.Item>
));

const QuizModal = ({ quiz, onClose, onComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answerState, setAnswerState] = useState(null); 
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = quiz.questions[currentQuestionIdx];

  useEffect(() => {
    if (currentQ.type === 'reorder') {
      setAnswerState(currentQ.items);
    } else if (currentQ.type === 'slider') {
      setAnswerState(currentQ.defaultValue || 50);
    } else {
      setAnswerState(null);
    }
  }, [currentQ]);

  const handleNext = () => {
    if (answerState === null) return;

    let isCorrect = true;
    if (currentQ.type === 'choice') {
      isCorrect = answerState === currentQ.correct;
    } else if (currentQ.type === 'slider') {
      isCorrect = answerState >= (currentQ.correctMin || 0) && answerState <= (currentQ.correctMax || 100);
    }

    if (isCorrect) {
      if (currentQuestionIdx < quiz.questions.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        setIsCompleted(true);
        setTimeout(onComplete, 2000);
      }
    } else {
        // Shake effect or toast could go here
        alert("Try a different answer! ❤️");
    }
  };

  const isNextDisabled = () => {
    if (currentQ.type === 'choice') return answerState === null;
    return false;
  };

  const handleSliderChange = (val) => setAnswerState(val[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-rose-900/20 backdrop-blur-md"
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="relative w-full max-w-[520px] bg-[#fffbfb] rounded-[2.5rem] shadow-[0_20px_60px_-10px_rgba(225,29,72,0.15)] overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-100/50 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 -left-24 w-48 h-48 bg-purple-100/40 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 right-0 w-full h-24 bg-gradient-to-t from-rose-50/80 to-transparent" />
        </div>

        {!isCompleted ? (
          <div className="relative z-10 flex flex-col h-full min-h-[550px]">
            {/* Header */}
            <div className="px-8 pt-8 flex justify-between items-start">
              <div className="space-y-1">

                <h3 className="font-serif-art text-3xl md:text-4xl text-gray-800 mt-3 leading-tight drop-shadow-sm">
                  {currentQ.question}
                </h3>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 -mr-2 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 px-8 py-6 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  {/* --- CHOICE --- */}
                  {currentQ.type === 'choice' && (
                    <div className="grid grid-cols-1 gap-3">
                      {currentQ.options.map((option, idx) => (
                        <ChoiceOption 
                          key={idx} 
                          option={option} 
                          isSelected={answerState === idx} 
                          onClick={() => setAnswerState(idx)} 
                        />
                      ))}
                    </div>
                  )}

                  {/* --- SLIDER --- */}
                  {currentQ.type === 'slider' && (
                    <div className="py-8 px-4 bg-white/50 rounded-3xl border border-rose-50/50 backdrop-blur-sm">
                      <div className="text-center mb-10 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl -z-10" />
                        <span className="font-serif-art text-7xl md:text-8xl text-rose-500 tabular-nums leading-none">
                          {answerState}
                        </span>

                      </div>
                      <div className="px-2">
                         <Slider
                           value={[answerState]}
                           min={currentQ.min}
                           max={currentQ.max}
                           step={1}
                           onValueChange={handleSliderChange}
                           className="my-8 cursor-pointer"
                         />
                      </div>
                      <div className="flex justify-between text-xs font-bold text-rose-300 uppercase tracking-widest px-1">
                        <span>Min</span>
                        <span>Max</span>
                      </div>
                    </div>
                  )}

                  {/* --- REORDER --- */}
                  {currentQ.type === 'reorder' && answerState && (
                     <Reorder.Group 
                        axis="y" 
                        values={answerState} 
                        onReorder={setAnswerState}
                        className="space-y-3"
                     >
                       {answerState.map((item) => (
                         <ReorderItem key={item.id} item={item} />
                       ))}
                     </Reorder.Group>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 pt-2 flex justify-end items-center relative z-20">
              <Button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={cn(
                  "rounded-full h-16 w-16 md:w-auto md:px-8 shadow-xl shadow-rose-200 transition-all duration-300",
                  isNextDisabled() 
                    ? "bg-gray-100 text-gray-300"
                    : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white hover:scale-105 hover:shadow-rose-300"
                )}
              >
                <span className="hidden md:block mr-2 text-lg font-hand font-bold tracking-wider">Next Question</span>
                <ArrowRight size={24} />
              </Button>
            </div>

            {/* Artistic Progress Line */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-rose-50">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 shadow-[0_0_10px_rgba(251,113,133,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        ) : (
          /* Success State - Premium Animation */
          <div className="h-[550px] flex flex-col items-center justify-center p-12 text-center relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative w-40 h-40 flex items-center justify-center mb-8"
            >
               {/* Animated rings */}
               <div className="absolute inset-0 bg-rose-100 rounded-full animate-ping opacity-20" />
               <div className="absolute inset-4 bg-rose-200 rounded-full animate-pulse opacity-30" />
               <div className="relative w-32 h-32 bg-gradient-to-tr from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-rose-200">
                  <img src="public/Images/cat1.jpg" alt="23"/>
               </div>

               {/* Floating particles */}
               <motion.div
                 animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute -top-2 -right-2 text-2xl"
               >
                 JAAA
               </motion.div>
               <motion.div
                 animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute -bottom-2 -left-2 text-2xl"
               >
                 Liebst du mich
               </motion.div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif-art text-5xl text-gray-800 mb-3"
            >
              Legg aia!?
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-red-700-400 font-medium tracking-wide uppercase text-sm bg-rose-50 px-4 py-2 rounded-full border border-rose-100"
            >
              Judging you 😳
            </motion.p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default memo(QuizModal);
