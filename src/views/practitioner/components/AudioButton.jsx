import React, { useContext } from 'react';
import { AudioContext } from './Audio';


const AudioButton = ({ target_text }) => {
    const { playAudio, audioText, isAudioActuallyPlaying, isAudioTryingToPlay, stopAudio, setAudioText } = useContext(AudioContext);

    const handleButtonClick = async () => {
        let text = '';
        if (isAudioTryingToPlay()) {
            text = audioText;
            stopAudio();
        }

        if (text != target_text) {
            try {
                setAudioText(target_text)
                const response = await fetch('http://127.0.0.1:5000/text_to_speech', {
                    method: 'POST',
                    body: JSON.stringify({ content: target_text }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    playAudio(audioUrl, target_text)
                } else {
                    console.error('Failed to fetch audio stream');
                    setAudioText('')
                }
            } catch (error) {
                console.error('Error:', error);
                setAudioText('')
            }
        }
    };
    return (
        <div>
            <button onClick={() => handleButtonClick()}>
                {isAudioActuallyPlaying() && target_text === audioText ? 'Stop Audio' : (target_text === audioText && isAudioTryingToPlay() ? 'Loading' : 'Play Audio')}
            </button>
        </div>
    );
};

export default AudioButton;