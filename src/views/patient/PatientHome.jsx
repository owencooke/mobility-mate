import Navbar from "./components/Navbar";
import Exercises from "./components/Exercises";
import { useState, useEffect, useCallback } from "react";
import VoiceAI from "./components/VoiceAI";
import { db, getCurrentUser } from "../../../firebaseConfig";
import axios from "axios";
import apiUrl from "../../config";
import { useParams } from "react-router-dom";
import Conversation from "./components/Conversation";

const PatientHome = () => {
  const { patientID, practitionerID } = useParams();
  const [patient, setPatient] = useState(null);
  const [convo, setConvo] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const currentUser = await getCurrentUser();

        // Fetch patient details
        const patientRef = db
          .collection("practitioners")
          .doc(currentUser.uid)
          .collection("patients")
          .doc(patientID);

        const unsubscribePatient = patientRef.onSnapshot(async (doc) => {
          if (doc.exists) {
            const patientData = doc.data();
            setPatient(patientData);

            if (!patientData.exerciseRoutine) return;

            // Fetch exercises
            const allExercises = (
              await db
                .collection("practitioners")
                .doc(currentUser.uid)
                .collection("exercises")
                .get()
            ).docs.map((exerciseDoc) => ({
              id: exerciseDoc.id,
              ...exerciseDoc.data(),
            }));

            // Combine patient-specific data to each exercise
            setExercises(
              patientData.exerciseRoutine.map((patientExercise) => {
                const matchingExercise = allExercises.find(
                  (exercise) => exercise.id === patientExercise.id
                );
                return { ...matchingExercise, ...patientExercise };
              })
            );
          } else {
            console.error("Patient not found");
          }
        });

        return () => {
          unsubscribePatient();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientDetails();
  }, [patientID]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    updateUserMessage(userInput);
    const queryParams = new URLSearchParams({
      patient: patientID,
      practitioner: practitionerID,
    });
    try {
      const response = await axios.post(
        `${apiUrl}/conversation/send_text_message?${queryParams.toString()}`,
        { message: userInput }
      );
      updateGptResponse(response.data.reply);
      setUserInput("");
    } catch (error) {
      console.error("Error fetching conversation start:", error);
    }
  };

  const updateUserMessage = useCallback((newMessage) => {
    if (!newMessage) {
      return;
    }
    setConvo((prevConvo) => {
      const lastMessage = prevConvo[prevConvo.length - 1];
      if (!lastMessage || lastMessage.type === "gpt") {
        return [...prevConvo, { type: "user", text: newMessage }];
      }
      return prevConvo.map((message, index) =>
        index === prevConvo.length - 1
          ? { ...message, text: newMessage }
          : message
      );
    });
  }, []);

  const updateGptResponse = useCallback((newResponse) => {
    if (!newResponse) {
      return;
    }
    setConvo((prevConvo) => {
      const lastMessage = prevConvo[prevConvo.length - 1];
      if (!lastMessage || lastMessage.type === "user") {
        return [...prevConvo, { type: "gpt", text: newResponse }];
      }
      return prevConvo;
    });
  }, []);

  useEffect(() => {
    const startConversation = async () => {
      // const queryParams = new URLSearchParams({
      //   patient: patientID,
      //   practitioner: practitionerID,
      // });
      // try {
      //   const response = await axios.get(
      //     `${apiUrl}/conversation/start?${queryParams.toString()}`
      //   );
      //   updateGptResponse(response.data.reply);
      // } catch (error) {
      //   console.error("Error fetching conversation start:", error);
      // }
    };
    startConversation();
  }, [patientID, practitionerID, updateGptResponse]);

  useEffect(() => {
    const handleEndSession = async () => {
      try {
        await axios.post(
          `${apiUrl}/conversation/end`,
          {},
          {
            params: new URLSearchParams({
              patient: patientID,
              practitioner: practitionerID,
            }),
          }
        );
      } catch (error) {
        console.error("Error ending conversation:", error);
      }
    };
    window.addEventListener("beforeunload", handleEndSession);
    return () => window.removeEventListener("beforeunload", handleEndSession);
  }, [patientID, practitionerID]);

  return (
    <div className="flex flex-col border-2 bg-base-100 rounded-xl h-[calc(100vh-32px)] overflow-hidden box-border m-[16px] text-dark-teal ">
      <Navbar patient={patient} />
      <main className="p-6 h-full flex">
        <div className="w-1/3 flex flex-col justify-between">
          <Conversation
            convo={convo}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
          <form className="flex items-center" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="You can also type here..."
              className="input input-bordered w-full max-w-xs mr-2"
              value={userInput}
              onChange={handleInputChange}
            />
            <button className="btn bg-dark-teal text-white">Prompt</button>
          </form>
        </div>
        <div className="w-1/3 flex flex-col justify-between items-center">
          <VoiceAI
            patientID={patientID}
            practitionerID={practitionerID}
            updateUserMessage={updateUserMessage}
            updateGptResponse={updateGptResponse}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </div>
        <div className="w-1/3">
          {exercises.length > 0 ? (
            <Exercises
              exercises={exercises}
              patientID={patientID}
              practitionerID={practitionerID}
            />
          ) : (
            <div className="skeleton h-full w-full mb-6"></div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientHome;
