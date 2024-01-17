import { X } from "lucide-react";

const ExerciseCard = ({ exercise, editing, onClose }) => {
  return (
    <div
      key={exercise.id}
      className="relative bg-white rounded-lg shadow-md p-4 flex flex-col"
    >
      {editing && (
        <button
          className="absolute top-2 right-2 text-gray-800  hover:text-gray-500"
          onClick={onClose}
        >
          <X />
        </button>
      )}

      <img
        src={exercise.image}
        alt={exercise.title}
        className="object-fit rounded-t-lg max-h-64 w-auto"
      />
      <h3 className="mt-2 font-bold text-lg">{exercise.title}</h3>
      {exercise.sets ? (
        <>
          <div className="grid grid-cols-2 gap-2 p-2 w-28">
            <div className="font-bold">Sets</div>
            <div>{exercise.sets}</div>
            <div className="font-bold">Reps</div>
            <div>{exercise.reps}</div>
          </div>
          {exercise.notes && (
            <div className="px-2">
              <div className="font-bold">Additional Notes</div>
              <div
                style={{
                  maxHeight: "100px",
                  overflowY: "auto",
                  wordWrap: "break-word",
                }}
              >
                {exercise.notes}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-sm mt-1">{exercise.description}</p>
      )}
    </div>
  );
};

export default ExerciseCard;
