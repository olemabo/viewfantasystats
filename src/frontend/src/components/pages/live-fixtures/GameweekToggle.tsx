
import React from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';

const GameWeekToggle = ({ gameWeeks, setGw, gwName }: any) => {
    console.log(gameWeeks, "gameWeeks", gwName)
    
    const handlePreviousClick = () => {
        if (gameWeeks.previous > 0) {
            setGw(gameWeeks.previous);
        }
    };

    const handleNextClick = () => {
        if (gameWeeks.next > 0) {
            setGw(gameWeeks.next);
        }
    };

    return (
        <div className='round-container'>
            <div className='toggle-button left'>
                {gameWeeks.previous > 0 && (
                    <button onClick={handlePreviousClick}>
                        <ArrowBack />
                        <span>{gwName} {gameWeeks.previous}</span>
                    </button>
                )}
            </div>
            <h2>{gwName} {gameWeeks.current}</h2>
            <div className='toggle-button right'>
                {gameWeeks.next > 0 && (
                    <button onClick={handleNextClick}>
                        <span>{gwName} {gameWeeks.next}</span>
                        <ArrowForward />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GameWeekToggle;