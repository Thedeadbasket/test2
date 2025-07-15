// components/CharacterLoading.tsx
import React from 'react';
import { Config } from './types';
import styles from '../O12JobMatcher.module.scss';

interface CharacterLoadingProps {
    progress: number;
    config: Config;
    className?: string;
}

const CharacterLoading: React.FC<CharacterLoadingProps> = ({
                                                               progress,
                                                               config,
                                                               className = '',
                                                           }) => {
    return (
        <div className={`${styles.character} ${className}`}>
            <div className={styles.characterTitle}>
                <p>{config.texts.characterLoading}</p>
            </div>

            <div className={styles.characterFigure}>
                <svg viewBox="0 0 100 120">
                    <circle
                        cx="50"
                        cy="30"
                        r="15"
                        fill={progress > 0 ? config.colors.primary : '#e5e7eb'}
                    />
                    <rect
                        x="40"
                        y="45"
                        width="20"
                        height="35"
                        fill={progress > 33 ? config.colors.secondary : '#e5e7eb'}
                        rx="10"
                    />
                    <rect
                        x="25"
                        y="55"
                        width="12"
                        height="4"
                        fill={progress > 66 ? config.colors.secondary : '#e5e7eb'}
                        rx="2"
                    />
                    <rect
                        x="63"
                        y="55"
                        width="12"
                        height="4"
                        fill={progress > 66 ? config.colors.secondary : '#e5e7eb'}
                        rx="2"
                    />
                    <rect
                        x="43"
                        y="80"
                        width="6"
                        height="15"
                        fill={progress > 99 ? config.colors.accent : '#e5e7eb'}
                        rx="3"
                    />
                    <rect
                        x="51"
                        y="80"
                        width="6"
                        height="15"
                        fill={progress > 99 ? config.colors.accent : '#e5e7eb'}
                        rx="3"
                    />
                    {progress === 100 && (
                        <g>
                            <circle cx="44" cy="25" r="2" fill={config.colors.dark} />
                            <circle cx="56" cy="25" r="2" fill={config.colors.dark} />
                            <path
                                d="M 42 35 Q 50 40 58 35"
                                stroke={config.colors.dark}
                                strokeWidth="2"
                                fill="none"
                            />
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
};

export default CharacterLoading;