import { useState } from "react";
import { MoveLeft, MoveRight, Dot, PlayCircle, StopCircle } from "lucide-react";

const ExerciseComponent = ({ exercise, isWorkingOut }) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      <img
        className="object-contain border-[1px] rounded-box"
        src={exercise.image}
        alt="Exercise"
      />
      <div className="flex flex-col gap-2">
        <div className="font-bold">{exercise.title}</div>
        {!isWorkingOut && <div>{exercise.description}</div>}
        <div className="grid grid-cols-4 gap-2 w-48">
          <div className="font-medium">Sets</div>
          <div>{exercise.sets}</div>
          <div className="font-medium">Reps</div>
          <div>{exercise.reps}</div>
        </div>
        {isWorkingOut && (
          <div>
            <div className="font-medium">Steps</div>
            <ul>
              {exercise.steps.split("\n").map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            {exercise.notes && (
              <>
                <div className="font-medium mt-2">Additional Notes</div>
                <div>{exercise.notes}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Exercises({
  exercises,
  isWorkingOut,
  setIsWorkingOut,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkedSets, setCheckedSets] = useState(0);

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

  const handleToggle = () => setIsWorkingOut(!isWorkingOut);

  const handleCheckboxChange = (e) =>
    setCheckedSets(e.target.checked ? checkedSets + 1 : checkedSets - 1);

  const percentComplete = Math.round(
    (checkedSets /
      exercises.reduce(
        (total, exercise) => total + parseInt(exercise.sets),
        0
      )) *
      100
  );

  return (
    <div className={isWorkingOut ? "flex gap-8 h-full" : "flex flex-col"}>
      <div className={isWorkingOut ? "flex flex-col w-1/2" : "flex-shrink-0"}>
        <div className="shadow-[0_0_5px_0_rgba(0,0,0,0.2)] rounded-box flex flex-col">
          <div className="px-4 py-2 border-b-2 font-medium text-lg">
            Assigned Exercises
          </div>
          <ExerciseComponent
            exercise={exercises[currentIndex]}
            isWorkingOut={isWorkingOut}
          />
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
      </div>
      {/* Workout Progress component */}
      <div
        className={`${isWorkingOut ? "w-1/2" : "flex-grow"}
          shadow-[0_0_5px_0_rgba(0,0,0,0.2)] rounded-box p-4`}
      >
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {isWorkingOut
                ? "Workout Progress"
                : percentComplete
                ? "Resume Workout"
                : "Start Workout"}
            </h3>
            slow and steady wins the race 🐢
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
            className={`flex gap-2 ${
              isWorkingOut ? "text-red" : "text-light-teal"
            }`}
            onClick={() => handleToggle()}
          >
            {isWorkingOut ? <StopCircle size={48} /> : <PlayCircle size={48} />}
          </button>
        </div>
        {isWorkingOut && (
          <>
            <div className="grid grid-cols-2">
              <div className="font-medium">Exercise</div>
              <div className="font-medium">Completed Sets</div>
            </div>
            {exercises.map((exercise, idx) => (
              <div key={idx} className="grid grid-cols-2">
                <div>{exercise.title}</div>
                <div className="flex gap-2">
                  {Array.from({ length: exercise.sets }, (_, setIndex) => (
                    <div key={setIndex} className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(e)}
                        className="checkbox checkbox-sm [--chkbg:theme(colors.light-teal)]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
