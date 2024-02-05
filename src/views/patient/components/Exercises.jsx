import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, MoveRight, Dot, PlayCircle } from "lucide-react";
import { db, getDateString } from "../../../../firebaseConfig";

const ExerciseComponent = ({ exercise }) => {
  return (
    <div className="flex-col flex gap-2 p-4 h-full">
      <div className="flex-grow relative">
        <img
          className="absolute h-full w-full object-contain border-[1px] rounded-box"
          src={exercise.image}
          alt="Exercise"
        />
      </div>

      <div className=" flex flex-col gap-2">
        <>
          <div className="font-bold">{exercise.title}</div>
          <div>{exercise.description}</div>
        </>
        <div className="grid grid-cols-4 gap-2 w-48">
          <div className="font-medium">Sets</div>
          <div>{exercise.sets}</div>
          <div className="font-medium">Reps</div>
          <div>{exercise.reps}</div>
        </div>
      </div>
    </div>
  );
};

const getStatusObject = (percentComplete) => {
  if (percentComplete === 100) {
    return {
      title: "Workout Complete",
      subtitle: "Fantastic job, you crushed it! 🏆",
    };
  } else if (percentComplete > 0) {
    return {
      title: "Resume Workout",
      subtitle: "You're on the right track! 🏃‍♂️",
    };
  }
  return {
    title: "Start Workout",
    subtitle: "slow and steady wins the race! 🐢",
  };
};

export default function Exercises({ exercises, practitionerID, patientID }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);

  useEffect(() => {
    const fetchWorkoutProgress = async () => {
      const workoutLogRef = db
        .collection("practitioners")
        .doc(practitionerID)
        .collection("patients")
        .doc(patientID)
        .collection("workoutLog")
        .doc(getDateString());
      const workoutLog = (await workoutLogRef.get()).data();
      setPercentComplete(workoutLog.percentComplete);
    };

    fetchWorkoutProgress();
  }, [patientID, practitionerID]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? exercises.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === exercises.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => setCurrentIndex(slideIndex);

  const handleStartWorkout = () => {
    navigate(`/${practitionerID}/patient/${patientID}/workout`);
  };

  const workoutStatus = getStatusObject(percentComplete);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="shadow-[0_0_5px_0_rgba(0,0,0,0.2)] rounded-box  flex-grow flex flex-col">
        <div className="px-4 py-2 border-b-2 font-medium text-lg">
          Assigned Exercises
        </div>
        <ExerciseComponent exercise={exercises[currentIndex]} />
      </div>
      <div className="flex justify-evenly py-3">
        <div className="text-2xl rounded-full cursor-pointer">
          <MoveLeft onClick={prevSlide} size={20} />
        </div>
        <div className="flex items-center justify-center">
          {exercises.map((_, i) => (
            <Dot
              size={20}
              key={i}
              onClick={() => goToSlide(i)}
              className={`cursor-pointer rounded-full ${
                currentIndex === i ? "border-2" : ""
              }`}
            />
          ))}
        </div>
        <div className="text-2xl rounded-full cursor-pointer">
          <MoveRight onClick={nextSlide} size={20} />
        </div>
      </div>

      {/* Workout Progress component */}
      <div className="shadow-[0_0_5px_0_rgba(0,0,0,0.2)] rounded-box p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium">{workoutStatus.title}</h3>
            {workoutStatus.subtitle}
            <div className="flex items-center text-base gap-4">
              <progress
                className="progress w-56"
                value={percentComplete}
                max="100"
              />
              <p className="mb-1 text-sm">{percentComplete}%</p>
            </div>
          </div>
          <button
            className="flex gap-2 text-light-teal"
            onClick={() => handleStartWorkout()}
          >
            <PlayCircle size={48} />
          </button>
        </div>
      </div>
    </div>
  );
}
