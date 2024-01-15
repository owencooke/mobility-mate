import { useState } from "react";

const id = "exercise_list_modal";

const ExerciseListModal = ({ exercises, onAddExercises }) => {
  const [formState, setFormState] = useState({
    title: "",
    sets: "",
    reps: "",
    additionalNotes: "",
  });

  const handleClose = () => {
    document.getElementById(id).close();
  };

  const handleSubmit = () => {
    onAddExercises(formState);
    handleClose();
  };

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Add Exercise</h3>
        <div className="grid grid-cols-2 gap-4 p-4 items-center">
          <div className="font-bold">Name</div>
          <select
            name="title"
            className="select select-bordered w-full max-w-xs"
            onChange={onFormChange}
            value={formState.title}
          >
            <option disabled selected>
              Select Exercise
            </option>
            {exercises.map((exercise) => (
              <option key={exercise.id}>{exercise.title}</option>
            ))}
          </select>
          <div className="font-bold">Sets</div>
          <input
            name="sets"
            type={"number"}
            className="w-full px-3 py-2 border rounded-md"
            onChange={onFormChange}
            value={formState.sets}
          />
          <div className="font-bold">Reps</div>
          <input
            name="reps"
            type={"number"}
            className="w-full px-3 py-2 border rounded-md"
            onChange={onFormChange}
            value={formState.reps}
          />
          <div className="col-span-2">
            <div className="font-bold">Additional Notes</div>
            <textarea
              name="additionalNotes"
              className="w-full px-3 py-2 border rounded-md"
              onChange={onFormChange}
              value={formState.additionalNotes}
            ></textarea>
          </div>
        </div>
        <div className="modal-action">
          <button
            onClick={handleSubmit}
            className="btn bg-gray-800 text-white hover:bg-gray-600"
          >
            Add to Routine
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ExerciseListModal;
