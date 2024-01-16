import { useState, useEffect } from "react";
import { db, getCurrentUser } from "../../../../firebaseConfig";

const id = "exercise_list_modal";
const defaultForm = {
  title: "Select Exercise",
  sets: "",
  reps: "",
  notes: "",
};

const ExerciseListModal = ({ onAddExercises, takenExercises }) => {
  const [formState, setFormState] = useState(defaultForm);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const currentUser = await getCurrentUser();

      // Fetch exercises
      const exercisesRef = db
        .collection("practitioners")
        .doc(currentUser.uid)
        .collection("exercises");

      const unsubscribeExercises = exercisesRef.onSnapshot((snapshot) => {
        setExercises(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((e) => !takenExercises.includes(e.id))
        );
      });

      return () => unsubscribeExercises();
    };

    fetchPatientDetails();
  }, [takenExercises]);

  const handleClose = () => {
    document.getElementById(id).close();
    setFormState(defaultForm);
  };

  const handleSubmit = () => {
    if (
      formState.title === defaultForm.title ||
      isNaN(parseInt(formState.sets, 10)) ||
      isNaN(parseInt(formState.reps, 10))
    )
      return;

    const exercise = exercises.find((e) => e.title === formState.title);
    onAddExercises({ ...formState, id: exercise.id, image: exercise.image });
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
            name="title"
            className="select select-bordered w-full max-w-xs"
            onChange={onFormChange}
            value={formState.title}
          >
            <option disabled>Select Exercise</option>
            {exercises.map((exercise) => (
              <option key={exercise.id}>{exercise.title}</option>
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
