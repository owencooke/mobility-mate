import Navbar from "./Navbar";
import { db } from "../../../../firebaseConfig";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const WorkoutPage = () => {
  const { patientID, practitionerID } = useParams();
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const exercise = exercises[currentIndex];

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

  const handleToggleIndex = (inc) => {
    setCurrentIndex((prev) => prev + inc);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar patientID={patientID} practitionerID={practitionerID} />
      {/* Exercise Details */}
      {exercises.length !== 0 && (
        <div className="flex-grow flex gap-2 items-center px-12">
          {/* Text */}
          <div className="w-1/2 flex flex-col gap-4">
            <div className="font-bold text-3xl">{exercise.title}</div>
            <div className="grid grid-cols-4 gap-2 text-2xl">
              <div className="font-medium">Sets</div>
              <div>{exercise.sets}</div>
              <div className="font-medium">Reps</div>
              <div>{exercise.reps}</div>
            </div>
            <div className="text-xl">{exercise.steps}</div>
            <div className="text-xl">
              <div className="text-xl font-medium">Note from Practitioner</div>
              {exercise.notes}
            </div>
          </div>
          {/* Image */}
          <div className="w-1/2 h-full relative">
            <img
              className="absolute h-full w-full object-contain"
              src={exercise.image}
              alt="Exercise"
            />
          </div>
        </div>
      )}
      {/* Bottom Bar */}
      <div className="flex justify-between p-4 border-2 bg-base-100 box-border ">
        <div className="w-1/4">
          {currentIndex !== 0 && (
            <button className="btn" onClick={() => handleToggleIndex(-1)}>
              Previous
            </button>
          )}
        </div>
        <div className="w-1/2 text-center">
          slow and steady wins the race 🐢
          <div className="flex items-center text-base gap-4">
            <progress className="progress" value={0} max="100" />
            <p className="mb-1 text-sm">0%</p>
          </div>
        </div>
        <div className="w-1/4 flex justify-end">
          {currentIndex !== exercises.length - 1 && (
            <button
              className="btn bg-light-teal text-white"
              onClick={() => handleToggleIndex(1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
