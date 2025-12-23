import React, { useState, useCallback, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import StartPage from '@/components/StartPage';
import LoginPage from '@/components/LoginPage';
import { Toaster } from '@/components/ui/toaster';
import { Heart } from 'lucide-react';

const MapPage = lazy(() => import('@/components/MapPage'));
const GoalPage = lazy(() => import('@/components/GoalPage'));

const LoadingScreen = () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fff0f3]">
        <Heart className="w-12 h-12 text-rose-500 animate-pulse" fill="currentColor" />
    </div>
);

function App() {
    const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem("isAuthed") === "1");
    const [currentPage, setCurrentPage] = useState('start');
    const [completedQuizzes, setCompletedQuizzes] = useState([]);

    const onLoginSuccess = useCallback(() => {
        setIsAuthed(true);
    }, []);

    const navigateToMap = useCallback(() => setCurrentPage('map'), []);
    const navigateToGoal = useCallback(() => setCurrentPage('goal'), []);

    const completeQuiz = useCallback((quizId) => {
        setCompletedQuizzes(prev => (prev.includes(quizId) ? prev : [...prev, quizId]));
    }, []);

    // ✅ LOGIN-GATE: zuerst Login anzeigen
    if (!isAuthed) {
        return <LoginPage onSuccess={onLoginSuccess} />;
    }

    return (
        <>
            <Helmet>
                <title>Ich Lieb dich mehr...</title>
                <meta name="description" content="lieb dich soso" />
            </Helmet>

            <div className="min-h-screen w-full overflow-x-hidden">
                {currentPage === 'start' && <StartPage onStart={navigateToMap} />}

                <Suspense fallback={<LoadingScreen />}>
                    {currentPage === 'map' && (
                        <MapPage
                            completedQuizzes={completedQuizzes}
                            onCompleteQuiz={completeQuiz}
                            onReachGoal={navigateToGoal}
                        />
                    )}
                    {currentPage === 'goal' && <GoalPage />}
                </Suspense>

                <Toaster />
            </div>
        </>
    );
}

export default App;
