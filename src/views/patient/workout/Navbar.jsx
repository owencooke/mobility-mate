import logo from "/images/mobilityMate-NoBg-lg.png";
import { useNavigate } from "react-router-dom";

const Navbar = ({ practitionerID, patientID }) => {
  const navigate = useNavigate();

  const handleEndWorkout = () => {
    navigate(`/${practitionerID}/patient/${patientID}`);
  };

  return (
    <div className="navbar h-16 border-b-2 px-6">
      <div className="flex gap-2 flex-grow">
        <img src={logo} alt="MobilityMate Logo" className="h-8" />
        <a className="font-medium text-xl">MobilityMate</a>
      </div>
      <div className="flex justify-end">
        <button
          className="btn bg-light-teal text-white"
          onClick={() => handleEndWorkout()}
        >
          End Workout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
