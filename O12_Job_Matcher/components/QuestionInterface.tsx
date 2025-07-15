// components/QuestionInterface.tsx
import React from 'react';
import { Button } from '@/components/Button/Button';
import { Question, Config } from './types';

interface QuestionInterfaceProps {
    question: Question;
    selectedAnswers: number[];
    onAnswerChange: (optionIndex: number, isChecked: boolean) => void;
    onInfoClick?: () => void;
    config: Config;
    className?: string;
}

const QuestionInterface: React.FC<QuestionInterfaceProps> = ({
                                                                 question,
                                                                 selectedAnswers,
                                                                 onAnswerChange,
                                                                 onInfoClick,
                                                                 config,
                                                                 className = '',
                                                             }) => {
    const handleOptionClick = (optionIndex: number) => {
        const isSelected = selectedAnswers.includes(optionIndex);

        if (question.type === 'single') {
            onAnswerChange(optionIndex, true);
        } else {
            onAnswerChange(optionIndex, !isSelected);
        }
    };

    const isOptionDisabled = (optionIndex: number): boolean => {
        if (question.type !== 'multiple' || !question.maxSelections) {
            return false;
        }

        const isSelected = selectedAnswers.includes(optionIndex);
        return (
            selectedAnswers.length >= question.maxSelections && !isSelected
        );
    };

    return (
        <div className={className}>
            {/* Header mit Frage und Info Button */}
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="flex-grow-1">
                    <h2 className="h4 fw-medium text-dark mb-3">
                        {question.question}
                    </h2>

                    {/* Multiple Choice Hint */}
                    {question.type === 'multiple' && (
                        <div className="alert alert-info py-2 px-3 mb-0">
                            <small>
                                {question.minSelections && question.maxSelections
                                    ? `Wähle zwischen ${question.minSelections} und ${question.maxSelections} Optionen`
                                    : question.minSelections
                                        ? `Wähle mindestens ${question.minSelections} Option${
                                            question.minSelections > 1 ? 'en' : ''
                                        }`
                                        : question.maxSelections
                                            ? `Wähle maximal ${question.maxSelections} Option${
                                                question.maxSelections > 1 ? 'en' : ''
                                            }`
                                            : 'Mehrfachauswahl möglich'}
                            </small>
                        </div>
                    )}
                </div>

                {onInfoClick && (
                    <Button
                        as="button"
                        onClick={onInfoClick}
                        hierarchy="secondary"
                        background="onWhite"
                        iconOnly={true}
                        className="ms-3 job-matcher-info-btn"
                        aria-label="Weitere Informationen"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                )}
            </div>

            {/* Antwortoptionen Grid */}
            <div className="row g-3 mb-4">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswers.includes(index);
                    const isDisabled = isOptionDisabled(index);

                    return (
                        <div key={index} className="col-sm-6">
                            <Button
                                as="button"
                                onClick={() => !isDisabled && handleOptionClick(index)}
                                disabled={isDisabled}
                                hierarchy={isSelected ? "vibrant" : "secondary"}
                                background="onWhite"
                                className="w-100 text-start job-matcher-option-btn"
                                data-selected={isSelected}
                            >
                                {option.text}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionInterface;