
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Check, Heart, Stars, Music, Sparkles, Lock, Image} from 'lucide-react';
import QuizModal from '@/components/QuizModal';
import { cn } from '@/lib/utils';
import IntroAnimation from "@/components/ui/Intro.tsx";
import ChristmasBauble from "@/components/ui/ChristmasBauble.jsx";

// --- CONFIGURATION ---
// Static configuration outside component to prevent recreation
const POINTS = {
  start: { x: 20, y: 15 },
  p2:    { x: 80, y: 40 },
  p3:    { x: 20, y: 65 },
  goal:  { x: 50, y: 90 }
};


const PATH_DATA = `
  M ${POINTS.start.x} ${POINTS.start.y}
  C 50 ${POINTS.start.y}, 80 25, ${POINTS.p2.x} ${POINTS.p2.y}
  C 80 55, 50 ${POINTS.p3.y}, ${POINTS.p3.x} ${POINTS.p3.y}
  C 5 ${POINTS.p3.y}, 50 75, ${POINTS.goal.x} ${POINTS.goal.y}
`;

const QUIZZES = [
  {
    id: 1,
    title: "Beninging",
    x: POINTS.start.x, 
    y: POINTS.start.y,
    icon: Stars,
    color: 'bg-rose-100',
    questions: [
      {
        type: 'choice',
        question: "For how long are we a couple in minutes?",
        options: ["1267220", "309492", "2706840", "1828032"],
        correct: 2
      },
      {
        type: 'slider',
        question: "On a scale of 0 to 10, how pretty are you?",
        min: 0,
        max: 100,
        defaultValue: 5,
        correctMin: 100
      }
    ]
  },
  {
    id: 2,
    title: "So jetzt würds ernst",
    x: POINTS.p2.x,
    y: POINTS.p2.y,
    icon: Music,
    color: 'bg-violet-100',
    questions: [
      {
        type: 'reorder',
        question: "Ranke die Dates von '😳' zu '😚'",
        items: [
          { id: 'a', text: "All you can eat Sushi" },
          { id: 'b', text: "Mcs" },
          { id: 'c', text: "Mit Zimt?!" },
          { id: 'd', text: "Wellness & Massage" }
        ],
        allowAnyOrder: true
      },
      {
        type: 'choice',
        question: "Wer Liebt mehr (ein für alle mal)!!!",
        options: ["ich", "ich+1", "ich+4", "du"],
        correct: 2
      }
    ]
  },
  {
    id: 3,
    title: "Wein achten 💁",
    x: POINTS.p3.x,
    y: POINTS.p3.y,
    icon: Sparkles,
    color: 'bg-sky-100',
    questions: [
      {
        type: 'slider',
        question: "funny?",
        min: 1,
        max: 100,
        defaultValue: 2,
        correctMin: 67
      },
      {
        type: 'choice',
        question: "Wie cool war das??",
        options: ["Cool, ich liebe dich", "naja ok", "Bin schon nackt", "Philipp, ich habe mehr erwartet, warum bist du seine eine schande, alles was du machst wird nie erfolgreich und du bleibst ein kleiner loser "],
        correct: 2
      }
    ]
  }
];

// Memoized Background Ambience to prevent re-renders of heavy blur elements
const BackgroundAmbience = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden translate-z-0">
    <motion.div 
      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[20%] w-[60vw] h-[60vw] bg-rose-200/30 rounded-full blur-[80px] will-change-transform"
    />
    <motion.div 
      animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[40%] -right-[20%] w-[50vw] h-[50vw] bg-purple-200/30 rounded-full blur-[80px] will-change-transform"
    />
  </div>
));

// Memoized Intro Animation HIER BILD EINFÜGEN FÜR ANIMATION


// Memoized Node Component
const MapNode = memo(({ quiz, unlocked, completed, index, onClick }) => {
  const Icon = quiz.icon;
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${quiz.x}%`, top: `${quiz.y}%` }}
    >
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.15 }}
        onClick={() => onClick(quiz)}
        disabled={!unlocked || completed}
        className="group relative outline-none"
        aria-label={`Open quiz: ${quiz.title}`}
      >
        {/* Node Circle */}
        <div className={cn(
          "w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg border-4 relative overflow-hidden",
          completed 
            ? "bg-rose-500 border-white text-white scale-100" 
            : unlocked 
              ? "bg-white border-rose-200 text-rose-500 hover:scale-110 hover:border-rose-300 hover:shadow-rose-200/50 cursor-pointer" 
              : "bg-gray-100 border-gray-200 text-gray-300 grayscale"
        )}>
          {completed ? (
            <Check size={28} strokeWidth={3} />
          ) : unlocked ? (
            <Icon size={28} strokeWidth={2} />
          ) : (
            <Lock size={20} />
          )}
          
          {/* Shine effect for unlocked */}
          {unlocked && !completed && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
        </div>

        {/* Floating Label */}
        <div className={cn(
          "absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none",
          unlocked ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        )}>
          <span className="px-3 py-1 rounded-full bg-white/90 shadow-md border border-rose-100 text-xs font-bold text-gray-600 tracking-wide backdrop-blur-sm">
            {quiz.title}
          </span>
        </div>

        {/* Pulse Ring for Current Task */}
        {unlocked && !completed && (
          <span className="absolute -inset-2 rounded-full border-2 border-rose-400 opacity-20 animate-ping pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
});

// Memoized Goal Node
const GoalNode = memo(({ allQuizzesCompleted, onReachGoal }) => (
  <div 
    className="absolute transform -translate-x-1/2 -translate-y-1/2"
    style={{ left: `${POINTS.goal.x}%`, top: `${POINTS.goal.y}%` }}
  >
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.6 }}
      onClick={() => allQuizzesCompleted && onReachGoal()}
      disabled={!allQuizzesCompleted}
      className={cn(
        "relative group transition-all duration-500",
        allQuizzesCompleted ? "cursor-pointer" : "cursor-not-allowed grayscale opacity-60"
      )}
    >
      <div className={cn(
        "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all duration-300",
        allQuizzesCompleted 
          ? "bg-gradient-to-br from-red-500 to-rose-600 scale-110 shadow-rose-500/30 animate-pulse-slow" 
          : "bg-gray-200"
      )}>
        <Heart 
          className={cn(
            "transition-all duration-300",
            allQuizzesCompleted ? "text-white fill-white" : "text-gray-400"
          )} 
          size={36} 
        />
      </div>
      
      {/* Completion Celebration Particles */}
      {allQuizzesCompleted && (
        <>
          <div className="absolute -top-2 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100" />
          <div className="absolute top-0 -right-2 w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-300" />
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500" />
        </>
      )}
    </motion.button>
  </div>
));

const MapPage = ({ completedQuizzes, onCompleteQuiz, onReachGoal }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isKissing, setIsKissing] = useState(true); // Start true to show initially

  useEffect(() => {
    // Shorter timeout and clear cleanup
    const timer = setTimeout(() => {
      setIsKissing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const isQuizUnlocked = useCallback((quizId) => {
    if (quizId === 1) return true;
    return completedQuizzes.includes(quizId - 1);
  }, [completedQuizzes]);

  const isQuizCompleted = useCallback((quizId) => {
    return completedQuizzes.includes(quizId);
  }, [completedQuizzes]);

  // Derived state
  const allQuizzesCompleted = useMemo(() => completedQuizzes.length === 3, [completedQuizzes]);
  const progress = useMemo(() => completedQuizzes.length / 3, [completedQuizzes]);

  const handleQuizClick = useCallback((quiz) => {
    // Recalculate unlocking here to ensure freshness, though props are updated
    // We can reuse the callback logic
    const unlocked = quiz.id === 1 || completedQuizzes.includes(quiz.id - 1);
    const completed = completedQuizzes.includes(quiz.id);

    if (unlocked && !completed) {
      setSelectedQuiz(quiz);
    }
  }, [completedQuizzes]);

  const handleCloseModal = useCallback(() => {
    setSelectedQuiz(null);
  }, []);

  const handleCompleteModal = useCallback(() => {
    if (selectedQuiz) {
      onCompleteQuiz(selectedQuiz.id);
      setSelectedQuiz(null);
    }
  }, [selectedQuiz, onCompleteQuiz]);


    const slideshowImages = useMemo(() => (["public/images/Sop1.jpg", "public/images/Sop2.png", "public/images/Sop3.png", "public/images/dia1.jpg", "public/images/dia2.jpg",
    "public/images/dia3.jpg", "public/images/dia4.jpg","public/images/dia5.jpg","public/images/dia6.jpg", "public/images/dia7.jpg", "public/images/dia8.jpg", "public/images/dia9.jpg", "public/images/dia10.png",
        "public/images/dia11.jpg", "public/images/dia12.jpg"]), [selectedQuiz]);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (isKissing) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [isKissing, slideshowImages.length]);




    return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#fff0f3] paper-texture flex flex-col items-center">
      <BackgroundAmbience />

      {/* Header Section */}
      <div className="relative z-10 pt-12 pb-4 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="will-change-transform"
        >

          <h2 className="font-serif-art md:text-6xl font-bold  text-red-800 drop-shadow-sm">
            Das pupsi quiz
          </h2>
          <p className="font-hand text-gray-500 font-medium max-w-xs mx-auto text-sm md:text-base">
              Quiz that decides if u r worthy of getting a present 🎁
          </p>
        </motion.div>
      </div>



      {/* Map Container */}
      <div className="relative w-full max-w-md flex-1 flex items-center justify-center p-6">
        <div className="relative w-full aspect-[3/4] max-h-[600px]">
          
          {/* SVG Path Layer */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Background Path (Static) */}
            <path
              d={PATH_DATA}
              stroke="#fecdd3" 
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="drop-shadow-sm"
              vectorEffect="non-scaling-stroke"
            />
            
            {/* Progress Path (Animated) */}
            <motion.path
              d={PATH_DATA}
              stroke="#fb7185"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>

          {/* Interactive Nodes Layer */}
          <div className="absolute inset-0 z-10">
            {QUIZZES.map((quiz, index) => (
              <MapNode
                key={quiz.id}
                quiz={quiz}
                index={index}
                unlocked={isQuizUnlocked(quiz.id)}
                completed={isQuizCompleted(quiz.id)}
                onClick={handleQuizClick}
              />
            ))}

            <GoalNode 
              allQuizzesCompleted={allQuizzesCompleted}
              onReachGoal={onReachGoal}
            />
          </div>
        </div>
      </div>

      {/* Floating Animations (Static Image, transform handled by CSS or separate simple animation) */}
      <motion.div 
        className="fixed top-[15%] right-[5%] w-20 opacity-60 pointer-events-none hidden md:block will-change-transform"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
          <ChristmasBauble
              src="/images/car2.jpg"
              size={110}
              ringColor="#0f766e"
              ribbonColor="#991b1b"
          />

      </motion.div>

        <motion.div
            className="fixed bottom-[60%] left-[20%] w-20 opacity-60 pointer-events-none hidden md:block will-change-transform"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
            <ChristmasBauble
                src="/images/Meme2.jpg"
                size={110}
                ringColor="#0f766e"
                ribbonColor="#991b1b"
            />

        </motion.div>


        <motion.div
            className="fixed top-[50%] right-[30%] w-20 opacity-60 pointer-events-none hidden md:block will-change-transform"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
            <ChristmasBauble
                src="/images/Meme1.jpg"
                size={110}
                ringColor="#0f766e"
                ribbonColor="#991b1b"
            />

        </motion.div>


        <motion.div className="fixed bottom-[15%] left-[5%] w-20 opacity-60 pointer-events-none hidden md:block will-change-transform">
            <AnimatePresence mode="wait">
                <ChristmasBauble
                    key={currentIndex}
                    src={slideshowImages[
                    (currentIndex + Math.floor(slideshowImages.length / 2)) %
                    slideshowImages.length
                        ]}
                    size={240}
                />
            </AnimatePresence>
        </motion.div>

        <motion.div className="fixed bottom-[5%] right-[20%] w-20 opacity-60 pointer-events-none hidden md:block will-change-transform">
            <AnimatePresence mode="wait">
                <ChristmasBauble
                    key={currentIndex}
                    src={slideshowImages[currentIndex]}
                    size={240}
                />
            </AnimatePresence>
        </motion.div>

        {/* Christmas lights */}
        <div className="absolute top-0 left-0 w-full h-16 z-0 pointer-events-none">
            <div className="flex justify-around items-center h-full">
                {Array.from({ length: 14 }).map((_, i) => (
                    <motion.span
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{
                            backgroundColor: i % 3 === 0 ? "#facc15" : i % 3 === 1 ? "#ef4444" : "#22c55e",
                            boxShadow: "0 0 12px currentColor",
                        }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 2 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-64 bg-gradient-to-t from-amber-200/40 via-rose-200/20 to-transparent blur-2xl pointer-events-none z-0" />

      {/* Intro Animation Modal */}
      <AnimatePresence>
        {isKissing && <IntroAnimation
            leftSrc="/images/Subject.png"
            rightSrc="/images/Subject 2.png"
            duration={1.8}
        />}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {selectedQuiz && (
          <QuizModal
            quiz={selectedQuiz}
            onClose={handleCloseModal}
            onComplete={handleCompleteModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(MapPage);
