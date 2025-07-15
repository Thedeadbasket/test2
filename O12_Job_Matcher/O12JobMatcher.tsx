// O12JobMatcher.tsx
import React, { useState, useCallback, useEffect } from 'react';
import styles from './O12JobMatcher.module.scss';

// Import Components
import CharacterLoading from './components/CharacterLoading';
import DotNavigation from './components/DotNavigation';
import QuestionInterface from './components/QuestionInterface';
import SliderQuestionInterface from './components/SliderQuestionInterface';
import ResultsView from './components/ResultsView';

// Import Types
import {
    Question,
    Job,
    JobResult,
    Answers,
    Config,
    O12JobMatcherProps
} from './components/types';

// ============================================
// Configuration & Data
// ============================================
const CONFIG: Config = {
    texts: {
        title: 'Job Matcher',
        resultsTitle: 'Deine Job-Matches!',
        resultsSubtitle: 'Basierend auf deinen Antworten haben wir die passendsten Jobs für dich ermittelt:',
        characterLoading: 'Character Loading...',
        restartButton: 'Erneut starten',
        bestMatch: 'Beste Übereinstimmung!',
        questionCounter: 'Frage',
    },
    colors: {
        primary: '#8B5CF6',
        primaryLight: '#A78BFA',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        dark: '#1F2937',
        light: '#F8FAFC',
        success: '#10B981',
        warning: '#F59E0B',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
    }
};

const JOBS: Record<string, Job> = {
    creative: {
        name: 'Kreativ-Designer*in',
        description: 'Visuelle Gestaltung und kreative Konzepte',
        points: 0,
    },
    writer: {
        name: 'Content Creator*in',
        description: 'Texte und Inhalte erstellen',
        points: 0,
    },
    social: {
        name: 'Social Media Manager*in',
        description: 'Community Management und Online-Präsenz',
        points: 0,
    },
    organizer: {
        name: 'Event Manager*in',
        description: 'Planung und Organisation von Veranstaltungen',
        points: 0,
    },
    gamer: {
        name: 'Game Designer*in',
        description: 'Spieleentwicklung und Gaming-Content',
        points: 0,
    },
    maker: {
        name: 'Product Designer*in',
        description: 'DIY-Projekte und Produktentwicklung',
        points: 0,
    },
    photographer: {
        name: 'Fotograf*in/Videograf*in',
        description: 'Visuelle Medienproduktion',
        points: 0,
    },
    strategist: {
        name: 'Strategieberater*in',
        description: 'Strategische Planung und Beratung',
        points: 0,
    },
};

const QUESTIONS: Question[] = [
    {
        id: 1,
        question: 'Womit verbringst du am liebsten deine Freizeit?',
        type: 'multiple',
        required: true,
        minSelections: 1,
        maxSelections: 3,
        options: [
            {
                text: 'Zeichnen & Malen',
                points: { creative: 3, photographer: 1 },
            },
            {
                text: 'Texte schreiben',
                points: { writer: 3, social: 1 },
            },
            {
                text: 'Social Media',
                points: { social: 3, writer: 1 },
            },
            {
                text: 'Planen & Organisation',
                points: { organizer: 3, strategist: 2 },
            },
            {
                text: 'Gaming',
                points: { gamer: 3, strategist: 1 },
            },
            {
                text: 'DIY & Basteln',
                points: { maker: 3, creative: 1 },
            },
            {
                text: 'Fotos & Videos machen',
                points: { photographer: 3, social: 1 },
            },
            {
                text: 'Brett- & Strategiespiele',
                points: { strategist: 3, gamer: 1 },
            },
        ],
    },
    {
        id: 2,
        question: 'Welche Arbeitsumgebung motiviert dich am meisten?',
        type: 'single',
        required: true,
        options: [
            {
                text: 'Kreatives Atelier mit viel Inspiration',
                points: { creative: 3, photographer: 2 },
            },
            {
                text: 'Ruhiger Schreibplatz',
                points: { writer: 3 },
            },
            {
                text: 'Büro mit Team-Austausch',
                points: { social: 2, organizer: 3 },
            },
            {
                text: 'Flexibler Home-Office Platz',
                points: { gamer: 2, strategist: 2 },
            },
            {
                text: 'Werkstatt oder Labor',
                points: { maker: 3 },
            },
        ],
    },
    // 5 separate Slider-Fragen statt einer mit 5 Optionen
    {
        id: 3,
        question: 'Wie gerne arbeitest du mit Menschen und kommunizierst?',
        type: 'slider',
        required: true,
        options: [
            {
                text: 'Bewerte von 0 (überhaupt nicht) bis 5 (sehr gerne)',
                points: { social: 1, organizer: 1, writer: 0.5 },
            },
        ],
    },
    {
        id: 4,
        question: 'Wie gerne arbeitest du alleine und konzentriert?',
        type: 'slider',
        required: true,
        options: [
            {
                text: 'Bewerte von 0 (überhaupt nicht) bis 5 (sehr gerne)',
                points: { creative: 1, writer: 1, gamer: 0.5 },
            },
        ],
    },
    {
        id: 5,
        question: 'Wie gerne findest du kreative Problemlösungen?',
        type: 'slider',
        required: true,
        options: [
            {
                text: 'Bewerte von 0 (überhaupt nicht) bis 5 (sehr gerne)',
                points: { creative: 1, maker: 1, strategist: 0.5 },
            },
        ],
    },
    {
        id: 6,
        question: 'Wie gerne meisterst du technische Herausforderungen?',
        type: 'slider',
        required: true,
        options: [
            {
                text: 'Bewerte von 0 (überhaupt nicht) bis 5 (sehr gerne)',
                points: { gamer: 1, maker: 1, photographer: 0.5 },
            },
        ],
    },
    {
        id: 7,
        question: 'Wie gerne verfolgst du Trends und Neuigkeiten?',
        type: 'slider',
        required: true,
        options: [
            {
                text: 'Bewerte von 0 (überhaupt nicht) bis 5 (sehr gerne)',
                points: { social: 1, photographer: 1, organizer: 0.5 },
            },
        ],
    },
    {
        id: 8,
        question: 'Was motiviert dich bei der Arbeit am meisten?',
        type: 'single',
        required: true,
        options: [
            {
                text: 'Etwas Schönes erschaffen',
                points: { creative: 3, maker: 2 },
            },
            {
                text: 'Menschen informieren und bewegen',
                points: { writer: 3, social: 2 },
            },
            {
                text: 'Events zum Leben erwecken',
                points: { organizer: 3 },
            },
            {
                text: 'Momente festhalten',
                points: { photographer: 3 },
            },
            {
                text: 'Komplexe Probleme lösen',
                points: { strategist: 3, gamer: 1 },
            },
        ],
    },
];

// ============================================
// Main Component
// ============================================
export function O12JobMatcher({
                                  className = '',
                                  onComplete
                              }: O12JobMatcherProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [showResults, setShowResults] = useState(false);

    const currentQ = QUESTIONS[currentQuestion];
    const currentAnswers = currentQ?.type === 'slider'
        ? answers[currentQ?.id] as Record<number, number> || {}
        : answers[currentQ?.id] as number[] || [];
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    // Helper Functions
    const calculateResults = useCallback((): JobResult[] => {
        const jobsCopy: Record<string, Job> = JSON.parse(JSON.stringify(JOBS));
        Object.keys(jobsCopy).forEach(job => jobsCopy[job].points = 0);

        Object.entries(answers).forEach(([questionId, selectedOptions]) => {
            const question = QUESTIONS.find(q => q.id === parseInt(questionId));
            if (question) {
                if (question.type === 'slider') {
                    // Slider answers: Record<optionIndex, value>
                    const sliderAnswers = selectedOptions as Record<number, number>;
                    Object.entries(sliderAnswers).forEach(([optionIndex, sliderValue]) => {
                        const option = question.options[parseInt(optionIndex)];
                        if (option && option.points && sliderValue > 0) {
                            Object.entries(option.points).forEach(([job, pointsPerLevel]) => {
                                if (jobsCopy[job]) {
                                    // Multiply points by slider value (0-5)
                                    jobsCopy[job].points += pointsPerLevel * sliderValue;
                                }
                            });
                        }
                    });
                } else {
                    // Regular single/multiple choice answers
                    (selectedOptions as number[]).forEach((optionIndex: number) => {
                        const option = question.options[optionIndex];
                        if (option && option.points) {
                            Object.entries(option.points).forEach(([job, points]) => {
                                if (jobsCopy[job]) {
                                    jobsCopy[job].points += points;
                                }
                            });
                        }
                    });
                }
            }
        });

        const maxPoints = Math.max(...Object.values(jobsCopy).map((job: Job) => job.points));

        return Object.entries(jobsCopy)
            .map(([key, job]) => ({
                key,
                name: job.name,
                description: job.description,
                percentage: maxPoints > 0 ? Math.round((job.points / maxPoints) * 100) : 0,
                points: job.points
            }))
            .sort((a, b) => b.percentage - a.percentage);
    }, [answers]);

    const isAnswerValid = useCallback((): boolean => {
        if (!currentQ.required) return true;

        if (currentQ.type === 'slider') {
            const sliderAnswers = answers[currentQ.id] as Record<number, number> || {};
            // Für Slider-Fragen mit nur einer Option: Option 0 muss > 0 sein
            return sliderAnswers[0] > 0;
        }

        const currentAnswers = answers[currentQ?.id] as number[] || [];
        if (currentAnswers.length === 0) return false;

        if (currentQ.type === 'multiple' && currentQ.minSelections) {
            return currentAnswers.length >= currentQ.minSelections;
        }

        return true;
    }, [currentQ, answers]);

    // Event Handlers
    const handleAnswerChange = (optionIndex: number, isChecked: boolean = true) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };

            if (currentQ.type === 'single') {
                newAnswers[currentQ.id] = [optionIndex];
            } else if (currentQ.type === 'multiple') {
                if (!newAnswers[currentQ.id]) newAnswers[currentQ.id] = [];

                if (isChecked) {
                    if (!(newAnswers[currentQ.id] as number[]).includes(optionIndex)) {
                        const newSelections = [...(newAnswers[currentQ.id] as number[]), optionIndex];
                        if (currentQ.maxSelections && newSelections.length > currentQ.maxSelections) {
                            return prev;
                        }
                        newAnswers[currentQ.id] = newSelections;
                    }
                } else {
                    newAnswers[currentQ.id] = (newAnswers[currentQ.id] as number[]).filter(idx => idx !== optionIndex);
                }
            }

            return newAnswers;
        });
    };

    const handleSliderChange = (optionIndex: number, value: number) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            if (!newAnswers[currentQ.id]) {
                newAnswers[currentQ.id] = {};
            }
            (newAnswers[currentQ.id] as Record<number, number>)[optionIndex] = value;
            return newAnswers;
        });
    };

    const nextQuestion = () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const resetMatcher = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
    };

    const handleInfoClick = () => {
        console.log('Info clicked for question:', currentQ.question);
    };

    // Effects
    useEffect(() => {
        if (showResults && onComplete) {
            onComplete(calculateResults());
        }
    }, [showResults, onComplete, calculateResults]);

    // Results View
    if (showResults) {
        const results = calculateResults();

        return (
            <ResultsView
                results={results}
                onRestart={resetMatcher}
                config={CONFIG}
                className={className}
            />
        );
    }

    // Question View
    return (
        <div className={`${styles.jobMatcher} ${className}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-4 p-md-5">

                                {/* Content */}
                                <div className="row">
                                    {/* Question Interface */}
                                    <div className="col-lg-8">
                                        {currentQ?.type === 'slider' ? (
                                            <SliderQuestionInterface
                                                question={currentQ}
                                                selectedAnswers={currentAnswers as Record<number, number>}
                                                onSliderChange={handleSliderChange}
                                                onInfoClick={handleInfoClick}
                                                config={CONFIG}
                                            />
                                        ) : (
                                            <QuestionInterface
                                                question={currentQ}
                                                selectedAnswers={currentAnswers as number[]}
                                                onAnswerChange={handleAnswerChange}
                                                onInfoClick={handleInfoClick}
                                                config={CONFIG}
                                            />
                                        )}
                                    </div>

                                    {/* Character */}
                                    <div className="col-lg-4 d-flex justify-content-center">
                                        <CharacterLoading
                                            progress={progress}
                                            config={CONFIG}
                                        />
                                    </div>
                                </div>

                                {/* Navigation */}
                                <DotNavigation
                                    currentQuestion={currentQuestion}
                                    totalQuestions={QUESTIONS.length}
                                    canGoNext={isAnswerValid()}
                                    canGoBack={currentQuestion > 0}
                                    onNext={nextQuestion}
                                    onPrevious={prevQuestion}
                                    config={CONFIG}
                                />

                                {/* Counter */}
                                <div className="text-end mt-3">
                                    <small className="text-muted">
                                        {CONFIG.texts.questionCounter} {currentQuestion + 1}/{QUESTIONS.length}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}