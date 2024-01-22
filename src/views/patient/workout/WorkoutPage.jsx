import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

const WorkoutPage = () => {
  const { patientID, practitionerID } = useParams();

  return (
    <div className="h-screen w-full">
      <Navbar patientID={patientID} practionerID={practitionerID} />
      <div></div>
    </div>
  );
};

export default WorkoutPage;
