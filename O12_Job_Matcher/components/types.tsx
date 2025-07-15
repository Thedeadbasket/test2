// components/types.tsx
export interface JobPoints {
    [jobKey: string]: number;
}

export interface AnswerOption {
    text: string;
    points: JobPoints;
}

export interface Question {
    id: number;
    question: string;
    type: 'single' | 'multiple';
    required: boolean;
    minSelections?: number;
    maxSelections?: number;
    options: AnswerOption[];
}

export interface Job {
    name: string;
    description: string;
    points: number;
}

export interface JobResult {
    key: string;
    name: string;
    description: string;
    percentage: number;
    points: number;
}

export interface Answers {
    [questionId: number]: number[];
}

export interface Config {
    texts: {
        title: string;
        resultsTitle: string;
        resultsSubtitle: string;
        characterLoading: string;
        restartButton: string;
        bestMatch: string;
        questionCounter: string;
    };
    colors: {
        primary: string;
        primaryLight: string;
        secondary: string;
        accent: string;
        dark: string;
        light: string;
        success: string;
        warning: string;
        gradient: string;
    };
}

export interface O12JobMatcherProps {
    className?: string;
    onComplete?: (results: JobResult[]) => void;
}