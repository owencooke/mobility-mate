import Navbar from "./Navbar";
import { db } from "../../../../firebaseConfig";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const WorkoutPage = () => {
  const { patientID, practitionerID } = useParams();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        // Fetch patient details
        const patientRef = db
          .collection("practitioners")
          .doc(practitionerID)
          .collection("patients")
          .doc(patientID);

        const unsubscribePatient = patientRef.onSnapshot(async (doc) => {
          if (doc.exists) {
            const patientData = doc.data();

            if (!patientData.exerciseRoutine) return;

            // Fetch exercises
            const allExercises = (
              await db
                .collection("practitioners")
                .doc(practitionerID)
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
  }, [patientID, practitionerID]);

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar patientID={patientID} practitionerID={practitionerID} />
      {/* Exercise Details */}
      {exercises.length !== 0 && (
        <div className="flex-grow flex gap-2 items-center px-12">
          {/* Text */}
          <div className="w-1/2 flex flex-col gap-4">
            <div className="font-bold text-3xl">{exercises[0].title}</div>
            <div className="grid grid-cols-4 gap-2 text-2xl">
              <div className="font-medium">Sets</div>
              <div>{exercises[0].sets}</div>
              <div className="font-medium">Reps</div>
              <div>{exercises[0].reps}</div>
            </div>
            <div className="text-xl">{exercises[0].steps}</div>
            <div className="text-xl">
              <div className="text-xl font-medium">Note from Practitioner</div>
              {exercises[0].notes}
            </div>
          </div>
          {/* Image */}
          <div className="w-1/2 h-full relative">
            <img
              className="absolute h-full w-full object-contain"
              src={exercises[0].image}
              alt="Exercise"
            />
          </div>
        </div>
      )}
      {/* Bottom Bar */}
      <div className="flex justify-between p-4 border-2 bg-base-100 box-border ">
        <button
          className="btn"
          // onClick={() => handleEndWorkout()}
        >
          Previous
        </button>
        <div className="w-1/2 text-center">
          slow and steady wins the race 🐢
          <div className="flex items-center text-base gap-4">
            <progress className="progress" value={0} max="100" />
            <p className="mb-1 text-sm">0%</p>
          </div>
        </div>
        <button
          className="btn bg-light-teal text-white"
          // onClick={() => handleEndWorkout()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WorkoutPage;
