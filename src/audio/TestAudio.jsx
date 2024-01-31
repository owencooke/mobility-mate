import AudioButton from './AudioButton';

const TestAudio = () => {
    const text1 = "This is a test. Hopefully the text to speech works correctly.";
    const text2 = "This is a second test. Hopefully the text to speech works correctly.";

    return (
        <div>
            <p>{text1}</p>
            <AudioButton target_text={text1} />
            <p>{text2}</p>
            <AudioButton target_text={text2} />
        </div>
    );
};

export default TestAudio;
