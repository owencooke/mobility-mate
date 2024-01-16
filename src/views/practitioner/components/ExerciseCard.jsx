const ExerciseCard = ({ exercise }) => {
  return (
    <div
      key={exercise.id}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col"
    >
      <img
        src={exercise.image}
        alt={exercise.title}
        className="object-fit rounded-t-lg max-h-64 w-auto"
      />
      <h3 className="mt-2 font-bold text-lg">{exercise.title}</h3>
      {exercise.sets ? (
        <div className="grid grid-cols-2 gap-4 p-2">
          <div className="font-bold">Sets</div>
          <div>{exercise.sets}</div>
          <div className="font-bold">Reps</div>
          <div>{exercise.reps}</div>
          {exercise.notes && (
            <div className="col-span-2 w-full">
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
        </div>
      ) : (
        <p className="text-gray-600 text-sm mt-1">{exercise.description}</p>
      )}
    </div>
  );
};

export default ExerciseCard;
