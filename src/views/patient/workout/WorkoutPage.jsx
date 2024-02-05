import Navbar from "./Navbar";
import { db, getDateString } from "../../../../firebaseConfig";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import motivations from "./motivations.json";
import { StickyNote } from "lucide-react";

const pickPercentMessages = (messagesObject) => {
  const randomMessages = {};
  Object.keys(messagesObject).forEach((percentage) => {
    const messagesArray = messagesObject[percentage];
    randomMessages[percentage] =
      messagesArray[Math.floor(Math.random() * messagesArray.length)];
  });
  return randomMessages;
};

const motivationalMessages = pickPercentMessages(motivations);

const getMessageFromPercentage = (percentage) => {
  const closestLowerBound = Math.max(
    ...Object.keys(motivationalMessages).filter(
      (key) => percentage >= parseInt(key, 10)
    )
  );
  return motivationalMessages[closestLowerBound];
};

const WorkoutPage = () => {
  const { patientID, practitionerID } = useParams();
  const [practitionerName, setPractitionerName] = useState("your practitioner");
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkboxStates, setCheckboxStates] = useState([]);

  const exercise = exercises[currentIndex];
  const percentComplete =
    Math.round(
      (checkboxStates.flat().filter((b) => b).length /
        exercises.reduce(
          (total, exercise) => total + (exercise.sets || 0),
          0
        )) *
        100
    ) || 0;

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const practitionerDoc = await db
          .collection("practitioners")
          .doc(practitionerID)
          .get();
        setPractitionerName(practitionerDoc.get("name"));

        // Fetch patient details
        const patientRef = db
          .collection("practitioners")
          .doc(practitionerID)
          .collection("patients")
          .doc(patientID);

        const prevWorkout = await patientRef
          .collection("workoutLog")
          .doc(getDateString())
          .get();

        const completedSets = prevWorkout?.exists
          ? prevWorkout.data().completedSets
          : null;

        const unsubscribePatient = patientRef.onSnapshot(async (doc) => {
          if (doc.exists) {
            const patientData = doc.data();

            if (!patientData.exerciseRoutine) return;

            // Fetch exercises
            let allExercises = (
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
            allExercises = patientData.exerciseRoutine.map(
              (patientExercise) => {
                const matchingExercise = allExercises.find(
                  (exercise) => exercise.id === patientExercise.id
                );
                return {
                  ...matchingExercise,
                  ...patientExercise,
                  sets: parseInt(patientExercise.sets),
                };
              }
            );
            setExercises(allExercises);
            setCheckboxStates(
              allExercises.map((exercise) =>
                Array(exercise.sets || 0)
                  .fill(false)
                  .map((_, idx) => idx < (completedSets?.[exercise.id] || 0))
              )
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

  const handleCheckboxChange = (exerciseIndex, setIndex) => {
    setCheckboxStates((prevCheckboxStates) => {
      const newCheckboxStates = [...prevCheckboxStates];
      newCheckboxStates[exerciseIndex][setIndex] =
        !newCheckboxStates[exerciseIndex][setIndex];
      return newCheckboxStates;
    });
  };

  const postWorkoutResults = () => {
    if (!percentComplete) return;
    const date = getDateString();
    const patientRef = db
      .collection("practitioners")
      .doc(practitionerID)
      .collection("patients")
      .doc(patientID);
    patientRef
      .collection("workoutLog")
      .doc(date)
      .set({
        percentComplete,
        completedSets: exercises.reduce(
          (acc, exercise, idx) => (
            (acc[exercise.id] = checkboxStates[idx].reduce(
              (sum, value) => sum + value,
              0
            )),
            acc
          ),
          {}
        ),
      });
    if (percentComplete === 100) {
      patientRef.update({ lastCompletedWorkout: date });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar
        patientID={patientID}
        practitionerID={practitionerID}
        postWorkoutResults={postWorkoutResults}
      />
      {/* Main Exercise Section */}
      {exercises.length === 0 ? (
        <div className="flex flex-col items-center gap-1 font-medium text-2xl justify-center flex-grow">
          <span className="loading loading-ball w-24 bg-light-teal"></span>
          Warming up for your workout...
        </div>
      ) : (
        <>
          <div className="flex-grow flex gap-2 items-center p-12">
            {/* Exercise Details */}
            <div className="w-1/2 flex flex-col gap-4">
              <div className="font-bold text-3xl">{exercise.title}</div>
              <div className="flex gap-8 text-2xl">
                <div className="flex items-center gap-4 font-medium">
                  <div>Sets</div>
                  <div className="flex gap-2">
                    {checkboxStates[currentIndex].map((isChecked, setIndex) => (
                      <div key={setIndex} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            handleCheckboxChange(currentIndex, setIndex)
                          }
                          className="checkbox checkbox-l [--chkbg:theme(colors.dark-teal)] border-dark-teal border-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-medium">Reps</div>
                  <div>{exercise.reps}</div>
                </div>
              </div>
              <div className="text-xl">
                <ol className="list-decimal ml-6">
                  {exercise.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
              {exercise.notes && (
                <div className="text-xl">
                  <div className="flex gap-1 items-center text-xl font-medium">
                    <StickyNote size={20} />
                    from {practitionerName}
                  </div>
                  {exercise.notes}
                </div>
              )}
            </div>
            {/* Exercise Image */}
            <div className="w-1/2 h-full relative">
              <img
                className="absolute h-full w-full object-contain"
                src={exercise.image}
                alt="Exercise"
              />
            </div>
          </div>

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
              {getMessageFromPercentage(percentComplete)}
              <div className="flex items-center text-base gap-4">
                <progress
                  className="progress"
                  value={percentComplete}
                  max="100"
                />
                <p className="mb-1 text-sm">{percentComplete}%</p>
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
        </>
      )}
    </div>
  );
};

export default WorkoutPage;
