import { useState } from "react";
import { MoveLeft, MoveRight, Dot, PlayCircle, StopCircle } from "lucide-react";

const ExerciseComponent = ({ exercise, showDetails }) => {
  return (
    <div className="flex flex-col gap-2">
      <img
        className="object-contain border-[1px] rounded-box"
        src={exercise.image}
        alt="Exercise"
      />
      <div className="flex flex-col gap-2 items-start">
        <div className="font-medium">
          {showDetails ? "Steps" : exercise.title}
        </div>
        {showDetails ? (
          <ul className="overflow-y-scroll line-clamp-3">
            {exercise.steps.split("\n").map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        ) : (
          <div>{exercise.description}</div>
        )}
        {showDetails && (
          <>
            <div className="font-medium mt-2">Additional Notes</div>
            <div>{exercise.notes}</div>
          </>
        )}
      </div>
      {!showDetails && (
        <div className="grid grid-cols-4 gap-2 w-48">
          <div className="font-bold">Sets</div>
          <div>{exercise.sets}</div>
          <div className="font-bold">Reps</div>
          <div>{exercise.reps}</div>
        </div>
      )}
    </div>
  );
};

const WorkoutComponent = ({ exercises, totalSets }) => {
  const [inProgress, setInProgress] = useState(false);
  const [checkedSets, setCheckedSets] = useState(0);

  const handleToggle = () => {
    setInProgress((prev) => !prev);
  };

  const handleCheckboxChange = (e) => {
    setCheckedSets(e.target.checked ? checkedSets + 1 : checkedSets - 1);
  };

  const percentComplete = Math.round((checkedSets / totalSets) * 100);

  return (
    <div className="shadow-[0_0_5px_0_rgba(0,0,0,0.2)] rounded-box w-full p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {inProgress
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
            inProgress ? "text-red" : "text-light-teal"
          }`}
          onClick={() => handleToggle()}
        >
          {inProgress ? <StopCircle size={48} /> : <PlayCircle size={48} />}
        </button>
      </div>
      {inProgress && (
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
  );
};

export default function Exercises({ exercises }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? exercises.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setShowDetails(false);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === exercises.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setShowDetails(false);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <>
      <div className="h-full w-full max-h-4/5 shadow-[0_0_5px_0_rgba(0,0,0,0.2)] rounded-box flex flex-col">
        <div className="px-4 py-2 border-b-2 font-medium text-lg">
          Assigned Exercises
        </div>
        <div className="flex flex-col h-full justify-between p-3 gap-2">
          <ExerciseComponent
            exercise={exercises[currentIndex]}
            showDetails={showDetails}
          />
          <div className="px-6 flex justify-center">
            <button
              onClick={() => {
                setShowDetails(!showDetails);
              }}
              className="btn bg-light-teal text-white"
            >
              {showDetails ? "Back" : "View"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-evenly w-full py-3">
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
      <WorkoutComponent
        exercises={exercises}
        totalSets={exercises.reduce(
          (total, exercise) => total + parseInt(exercise.sets),
          0
        )}
      />
    </>
  );
}
