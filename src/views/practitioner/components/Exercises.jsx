import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { db, getCurrentUser } from "../../../../firebaseConfig";
import ExerciseModal from "./ExerciseModal";
import ExerciseCard from "./ExerciseCard";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      try {
        const exercisesRef = db
          .collection("practitioners")
          .doc(currentUser.uid)
          .collection("exercises");

        const unsubscribe = exercisesRef.onSnapshot((snapshot) => {
          setExercises(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Exercises</h1>
        <button
          className="btn bg-dark-teal text-white"
          onClick={() =>
            document.getElementById("new_exercise_modal").showModal()
          }
        >
          <Plus />
          New Exercise
        </button>
      </div>
      <div className="w-full bg-gray-50 rounded-lg">
        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-4 p-5">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <div className="text-left p-3 mt-4">No exercises in collection.</div>
        )}
      </div>
      <ExerciseModal />
    </div>
  );
};

export default Exercises;
