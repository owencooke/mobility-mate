import { useState } from "react";

const id = "exercise_list_modal";
const defaultForm = {
  id: "",
  sets: "",
  reps: "",
  notes: "",
};

const ExerciseListModal = ({ availableExercises, onAddExercises }) => {
  const [formState, setFormState] = useState(defaultForm);

  const handleClose = () => {
    document.getElementById(id).close();
    setFormState(defaultForm);
  };

  const handleSubmit = () => {
    if (
      !formState.id ||
      isNaN(parseInt(formState.sets, 10)) ||
      isNaN(parseInt(formState.reps, 10))
    )
      return;
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
          <div className="font-bold">Title</div>
          <select
            name="id"
            className="select select-bordered w-full max-w-xs"
            onChange={onFormChange}
            value={formState.id}
          >
            <option disabled value="">
              Select Exercise
            </option>
            {availableExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
          <div className="font-bold">Sets</div>
          <input
            name="sets"
            type="number"
            min="1"
            className="w-full px-3 py-2 border rounded-md"
            onChange={onFormChange}
            value={formState.sets}
          />
          <div className="font-bold">Reps</div>
          <input
            name="reps"
            type="number"
            min="1"
            className="w-full px-3 py-2 border rounded-md"
            onChange={onFormChange}
            value={formState.reps}
          />
          <div className="col-span-2">
            <div className="font-bold">Additional Notes</div>
            <textarea
              name="notes"
              className="w-full px-3 py-2 border rounded-md"
              onChange={onFormChange}
              value={formState.notes}
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
