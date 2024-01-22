import React from 'react';

const TestAudio = () => {
    const handleButtonClick = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/text_to_speech', {
                method: 'POST',
                body: JSON.stringify({ content: 'This is a test. Hopefully the text to speach works correctly.' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play(); // Automatically play the audio stream
                // setAudioStream(audio);
            } else {
                console.error('Failed to fetch audio stream');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Play Audio</button>
        </div>
    );
};

export default TestAudio;
