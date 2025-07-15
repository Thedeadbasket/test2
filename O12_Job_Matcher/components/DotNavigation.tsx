// components/DotNavigation.tsx
import React from 'react';
import { Button } from '@/components/Button/Button';
import { Config } from './types';
import styles from '../O12JobMatcher.module.scss';

interface DotNavigationProps {
    currentQuestion: number;
    totalQuestions: number;
    canGoNext: boolean;
    canGoBack: boolean;
    onNext: () => void;
    onPrevious: () => void;
    config: Config;
    className?: string;
}

const DotNavigation: React.FC<DotNavigationProps> = ({
                                                         currentQuestion,
                                                         totalQuestions,
                                                         canGoNext,
                                                         canGoBack,
                                                         onNext,
                                                         onPrevious,
                                                         config,
                                                         className = '',
                                                     }) => {
    return (
        <div className={`${styles.navigation} ${className}`}>
            <Button
                as="button"
                onClick={onPrevious}
                disabled={!canGoBack}
                hierarchy="secondary"
                background="onWhite"
                iconOnly={true}
                className={`${styles.navigationBtn}`}
                aria-label="Vorherige Frage"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </Button>

            {Array.from({ length: totalQuestions }, (_, index) => (
                <div
                    key={index}
                    className={`${styles.navigationDot} ${
                        index === currentQuestion ? styles.navigationDotActive : ''
                    }`}
                    style={{
                        backgroundColor: index === currentQuestion ? config.colors.primary : '#e5e7eb'
                    }}
                />
            ))}

            <Button
                as="button"
                onClick={onNext}
                disabled={!canGoNext}
                hierarchy="secondary"
                background="onWhite"
                iconOnly={true}
                className={`${styles.navigationBtn}`}
                aria-label="Nächste Frage"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </Button>
        </div>
    );
};

export default DotNavigation;