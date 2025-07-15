// components/ResultsView.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button/Button';
import { JobResult, Config } from './types';
import styles from '../O12JobMatcher.module.scss';

interface ResultsViewProps {
    results: JobResult[];
    onRestart: () => void;
    config: Config;
    maxResults?: number;
    className?: string;
}

const ResultsView: React.FC<ResultsViewProps> = ({
                                                     results,
                                                     onRestart,
                                                     config,
                                                     maxResults = 3,
                                                     className = '',
                                                 }) => {
    const displayResults = results.slice(0, maxResults);
    const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([]);

    // FIXED: Animate progress bars on mount - No infinite loop
    useEffect(() => {
        // Start with 0%
        setAnimatedPercentages(new Array(results.length).fill(0));

        // Animate to real percentages after delay
        const timer = setTimeout(() => {
            setAnimatedPercentages(results.slice(0, maxResults).map(result => result.percentage));
        }, 500);

        return () => clearTimeout(timer);
    }, [results, maxResults]); // Use results instead of displayResults

    return (
        <div className={`${styles.jobMatcher} ${className}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h1 className="h2 fw-bold text-dark mb-3">{config.texts.resultsTitle}</h1>
                                    <p className="text-muted">{config.texts.resultsSubtitle}</p>
                                </div>

                                <div className={styles.resultsList}>
                                    {displayResults.map((result, index) => (
                                        <div
                                            key={result.key}
                                            className={`card mb-3 border-2 ${
                                                index === 0 ? 'border-success bg-success-subtle' : 'border-light'
                                            }`}
                                            style={index === 0 ? {
                                                borderColor: config.colors.success + ' !important',
                                                backgroundColor: config.colors.success + '1a'
                                            } : {}}
                                        >
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="flex-grow-1">
                                                        <h5 className={`card-title ${
                                                            index === 0 ? 'text-success-emphasis' : 'text-dark'
                                                        }`}>
                                                            {result.name}
                                                        </h5>
                                                        <p className="card-text text-muted small">
                                                            {result.description}
                                                        </p>
                                                    </div>
                                                    <span className={`fs-3 fw-bold ${
                                                        index === 0 ? 'text-success' : 'text-muted'
                                                    }`}>
                                                        {result.percentage}%
                                                    </span>
                                                </div>

                                                {/* FIXED: Progress Bar Animation */}
                                                <div className="progress mb-2" style={{ height: '8px' }}>
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${animatedPercentages[index] || 0}%`,
                                                            backgroundColor: index === 0 ? config.colors.success : config.colors.secondary,
                                                            transition: 'width 2s ease-out', // Längere, smoothere Transition
                                                            borderRadius: '6px'
                                                        }}
                                                        role="progressbar"
                                                        aria-valuenow={result.percentage}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>

                                                {index === 0 && (
                                                    <div className="d-flex align-items-center text-success-emphasis">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        <small className="fw-medium">{config.texts.bestMatch}</small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-4">
                                    <Button
                                        as="button"
                                        onClick={onRestart}
                                        hierarchy="vibrant"
                                        background="onWhite"
                                        className="job-matcher-restart-btn"
                                    >
                                        {config.texts.restartButton}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;