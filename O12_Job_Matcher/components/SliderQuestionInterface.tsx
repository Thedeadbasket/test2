// components/SliderQuestionInterface.tsx
import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/Button/Button';
import { Question, Config } from './types';
import styles from '../O12JobMatcher.module.scss';

interface SliderQuestionInterfaceProps {
    question: Question;
    selectedAnswers: Record<number, number>; // optionIndex -> sliderValue (0-5)
    onSliderChange: (optionIndex: number, value: number) => void;
    onInfoClick?: () => void;
    config: Config;
    className?: string;
}

// Konstanten für bessere Wartbarkeit
const SLIDER_CONFIG = {
    MIN_VALUE: 0,
    MAX_VALUE: 5,
    STEP: 1,
    OPTION_INDEX: 0, // Da nur eine Option pro Slider-Frage verwendet wird
} as const;

const SLIDER_LABELS = {
    0: 'Überhaupt nicht',
    1: 'Kaum',
    2: 'Wenig',
    3: 'Mittelmäßig',
    4: 'Gerne',
    5: 'Sehr gerne'
} as const;

const SLIDER_COLORS = {
    NEUTRAL: '#e2e8f0',
    NEGATIVE: '#ef4444',
    MODERATE: '#f59e0b',
    POSITIVE: '#10b981',
    TEXT_MUTED: '#64748b'
} as const;

const SliderQuestionInterface: React.FC<SliderQuestionInterfaceProps> = ({
                                                                             question,
                                                                             selectedAnswers,
                                                                             onSliderChange,
                                                                             onInfoClick,
                                                                             config,
                                                                             className = '',
                                                                         }) => {
    // Memoized current value
    const currentValue = useMemo(() =>
            selectedAnswers[SLIDER_CONFIG.OPTION_INDEX] || SLIDER_CONFIG.MIN_VALUE,
        [selectedAnswers]
    );

    // Memoized slider color calculation
    const sliderColor = useMemo(() => {
        if (currentValue === 0) return SLIDER_COLORS.NEUTRAL;
        if (currentValue <= 2) return SLIDER_COLORS.NEGATIVE;
        if (currentValue <= 3) return SLIDER_COLORS.MODERATE;
        return SLIDER_COLORS.POSITIVE;
    }, [currentValue]);

    // Memoized slider label
    const currentLabel = useMemo(() =>
            SLIDER_LABELS[currentValue as keyof typeof SLIDER_LABELS] || '',
        [currentValue]
    );

    // Memoized progress percentage
    const progressPercentage = useMemo(() =>
            (currentValue / SLIDER_CONFIG.MAX_VALUE) * 100,
        [currentValue]
    );

    // Optimized slider change handler
    const handleSliderChange = useCallback((value: number) => {
        onSliderChange(SLIDER_CONFIG.OPTION_INDEX, value);
    }, [onSliderChange]);

    // Optimized input change handler
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            handleSliderChange(value);
        }
    }, [handleSliderChange]);

    // Memoized value labels
    const valueLabels = useMemo(() => {
        return Array.from({ length: SLIDER_CONFIG.MAX_VALUE + 1 }, (_, index) => ({
            value: index,
            label: SLIDER_LABELS[index as keyof typeof SLIDER_LABELS],
            shortLabel: SLIDER_LABELS[index as keyof typeof SLIDER_LABELS].split(' ')[0]
        }));
    }, []);

    // Info icon SVG component
    const InfoIcon = useMemo(() => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ), []);

    return (
        <div className={className}>
            {/* Header mit Frage und Info Button */}
            <header className="d-flex justify-content-between align-items-start mb-4">
                <div className="flex-grow-1">
                    <h2 className="h4 fw-medium text-dark mb-3">
                        {question.question}
                    </h2>

                    <div className="alert alert-info py-2 px-3 mb-0" role="note">
                        <small>
                            Bewerte mit dem Slider, wie sehr das auf dich zutrifft
                            ({SLIDER_CONFIG.MIN_VALUE} = überhaupt nicht, {SLIDER_CONFIG.MAX_VALUE} = sehr gerne)
                        </small>
                    </div>
                </div>

                {onInfoClick && (
                    <Button
                        as="button"
                        onClick={onInfoClick}
                        hierarchy="secondary"
                        background="onWhite"
                        iconOnly={true}
                        className="ms-3 job-matcher-info-btn"
                        aria-label="Weitere Informationen zu dieser Frage"
                    >
                        {InfoIcon}
                    </Button>
                )}
            </header>

            {/* Hauptslider-Bereich */}
            <main className="row justify-content-center">
                <div className="col-lg-10">
                    <div className={`${styles.sliderOption} p-5`}>
                        {/* Aktueller Wert Display */}
                        <div className="text-center mb-5">
                            <div
                                className="d-inline-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: sliderColor,
                                    color: currentValue === 0 ? SLIDER_COLORS.TEXT_MUTED : 'white',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease'
                                }}
                                aria-label={`Aktueller Wert: ${currentValue}`}
                            >
                                {currentValue}
                            </div>
                            <h3
                                className="h4 fw-bold mb-2"
                                style={{
                                    color: sliderColor,
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                {currentLabel}
                            </h3>
                            {question.options[0]?.text && (
                                <p className="text-muted mb-0">
                                    {question.options[0].text}
                                </p>
                            )}
                        </div>

                        {/* Slider Container */}
                        <div className="position-relative mb-4 slider-container" style={{ padding: '20px 0' }}>
                            {/* Sichtbarer Slider Track */}
                            <div
                                className="custom-track"
                                style={{
                                    height: '12px',
                                    backgroundColor: '#e2e8f0',
                                    borderRadius: '6px',
                                    position: 'relative'
                                }}
                                aria-hidden="true"
                            >
                                <div
                                    className="custom-progress"
                                    style={{
                                        width: `${progressPercentage}%`,
                                        backgroundColor: sliderColor,
                                        height: '12px',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>

                            {/* Funktionaler Slider Input */}
                            <input
                                type="range"
                                min={SLIDER_CONFIG.MIN_VALUE}
                                max={SLIDER_CONFIG.MAX_VALUE}
                                step={SLIDER_CONFIG.STEP}
                                value={currentValue}
                                onChange={handleInputChange}
                                className="slider-input-custom"
                                aria-label={`Bewertung: ${currentLabel}`}
                                aria-describedby="slider-help"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '0',
                                    transform: 'translateY(-50%)',
                                    width: '100%',
                                    height: '32px',
                                    cursor: 'pointer',
                                    zIndex: 15,
                                    margin: 0,
                                    padding: 0,
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none',
                                    background: 'transparent',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Werte-Labels */}
                        <div className="d-flex justify-content-between" role="group" aria-label="Slider-Werte">
                            {valueLabels.map(({ value, label, shortLabel }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className="btn btn-link text-center p-1"
                                    style={{
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: 'none',
                                        textDecoration: 'none',
                                        minWidth: '60px'
                                    }}
                                    onClick={() => handleSliderChange(value)}
                                    aria-label={`Wert ${value}: ${label}`}
                                    aria-pressed={currentValue === value}
                                >
                                    <div
                                        className="small fw-bold mb-1"
                                        style={{
                                            color: currentValue === value ? sliderColor : '#6b7280',
                                            fontSize: currentValue === value ? '1.1rem' : '0.9rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {value}
                                    </div>
                                    <div
                                        className="small"
                                        style={{
                                            color: currentValue === value ? sliderColor : '#9ca3af',
                                            fontWeight: currentValue === value ? '600' : 'normal',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {shortLabel}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Versteckte Hilfe für Screenreader */}
            <div id="slider-help" className="visually-hidden">
                Verwende die Pfeiltasten oder klicke auf die Werte, um deine Bewertung zu ändern.
            </div>

            {/* CSS für isolierte Slider-Funktionalität */}
            <style jsx>{`
                .slider-input-custom {
                    -webkit-appearance: none !important;
                    -moz-appearance: none !important;
                    appearance: none !important;
                    background: transparent !important;
                    cursor: pointer !important;
                    outline: none !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                .slider-input-custom::-webkit-slider-track {
                    -webkit-appearance: none !important;
                    appearance: none !important;
                    background: transparent !important;
                    height: 12px !important;
                    cursor: pointer !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                .slider-input-custom::-webkit-slider-thumb {
                    -webkit-appearance: none !important;
                    appearance: none !important;
                    width: 24px !important;
                    height: 24px !important;
                    border-radius: 50% !important;
                    background: ${sliderColor} !important;
                    cursor: pointer !important;
                    border: 3px solid white !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                    transition: all 0.2s ease !important;
                    position: relative !important;
                    z-index: 2 !important;
                    margin-top: 0 !important;
                }

                .slider-input-custom::-webkit-slider-thumb:hover {
                    transform: scale(1.15) !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                }

                .slider-input-custom::-webkit-slider-thumb:active {
                    transform: scale(1.0) !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4) !important;
                }

                .slider-input-custom::-moz-range-track {
                    -moz-appearance: none !important;
                    appearance: none !important;
                    background: transparent !important;
                    height: 12px !important;
                    cursor: pointer !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                .slider-input-custom::-moz-range-thumb {
                    -moz-appearance: none !important;
                    appearance: none !important;
                    width: 24px !important;
                    height: 24px !important;
                    border-radius: 50% !important;
                    background: ${sliderColor} !important;
                    cursor: pointer !important;
                    border: 3px solid white !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                    transition: all 0.2s ease !important;
                    position: relative !important;
                    z-index: 2 !important;
                    margin: 0 !important;
                }

                .slider-input-custom::-moz-range-thumb:hover {
                    transform: scale(1.15) !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                }

                .slider-input-custom::-moz-range-thumb:active {
                    transform: scale(1.0) !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4) !important;
                }

                .slider-input-custom:focus {
                    outline: 2px solid ${sliderColor} !important;
                    outline-offset: 3px !important;
                }

                .slider-input-custom:focus::-webkit-slider-thumb {
                    box-shadow: 0 0 0 4px ${sliderColor}30, 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                }

                .slider-input-custom:focus::-moz-range-thumb {
                    box-shadow: 0 0 0 4px ${sliderColor}30, 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                }

                /* Zusätzliche Reset-Styles um alle SCSS-Interferenzen zu verhindern */
                .slider-container {
                    isolation: isolate !important;
                }

                .slider-container * {
                    box-sizing: border-box !important;
                }

                .custom-track {
                    pointer-events: none !important;
                    user-select: none !important;
                }

                .custom-progress {
                    pointer-events: none !important;
                    user-select: none !important;
                }
            `}</style>
        </div>
    );
};

export default SliderQuestionInterface;