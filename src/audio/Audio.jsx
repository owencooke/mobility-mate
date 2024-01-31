import React, { createContext, useState } from 'react';

// Create the context
export const AudioContext = createContext();

// Create a provider component
export const AudioProvider = ({ children }) => {
    const [audio, setAudio] = useState(null);
    const [audioText, setAudioText] = useState('');

    const setAudioAndText = (newAudio, newAudioText) => {
        setAudio(newAudio);
        setAudioText(newAudioText);
    };

    const isAudioTryingToPlay = () => {
        return isAudioActuallyPlaying() || (audioText !== '');
    };

    const isAudioActuallyPlaying = () => {
        return (audio && !audio.paused) || (audio && !audio.ended);
    };

    const stopAudio = () => {
        if (isAudioActuallyPlaying()) {
            audio.pause();
            setAudioAndText(null, '');
        }
    };

    const playAudio = (audioUrl) => {
        const newAudio = new Audio(audioUrl);
        newAudio.play();
        newAudio.addEventListener('ended', () => {
            setAudioAndText(null, '');
        });
        setAudio(newAudio);

    };

    return (
        <AudioContext.Provider value={{ audio, setAudio, audioText, setAudioText, setAudioAndText, isAudioTryingToPlay, isAudioActuallyPlaying, stopAudio, playAudio }}>
            {children}
        </AudioContext.Provider>
    );
};

export default AudioProvider;