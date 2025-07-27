import React from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';

const GameWeekToggle = ({ gameWeeks, setGw, content }: any) => {
    const handlePreviousClick = () => {
        if (gameWeeks.previousGW > 0) {
            setGw(gameWeeks.previousGW);
        }
    };

    const handleNextClick = () => {
        if (gameWeeks.nextGW > 0) {
            setGw(gameWeeks.nextGW);
        }
    };

    return (
        <div className='round-container'>
            <div className='toggle-button left'>
                {gameWeeks.previousGW > 0 && (
                    <button onClick={handlePreviousClick}>
                        <ArrowBack />
                        <span>{content.General.gw} {gameWeeks.previousGW}</span>
                    </button>
                )}
            </div>
            <h2>{content.General.gw} {gameWeeks.currentGW}</h2>
            <div className='toggle-button right'>
                {gameWeeks.nextGW > 0 && (
                    <button onClick={handleNextClick}>
                        <span>{content.General.gw} {gameWeeks.nextGW}</span>
                        <ArrowForward />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GameWeekToggle;