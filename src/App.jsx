import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./views/landing/Landing";
import PatientHome from "./views/patient/PatientHome";
import PractitionerDashboard from "./views/practitioner/PractitionerDashboard";
import PractitionerSignUp from "./views/practitioner/PractitionerSignUp";
import PractitionerLogin from "./views/practitioner/PractitionerLogin";
import WorkoutPage from "./views/patient/workout/WorkoutPage";
import TestAudio from "./audio/TestAudio";
import AudioProvider from "./audio/Audio";

const App = () => {
  return (
    <AudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/:practitionerID/patient/:patientID"
            element={<PatientHome />}
          />
          <Route
            path="/:practitionerID/patient/:patientID/workout"
            element={<WorkoutPage />}
          />
          <Route
            path="/practitioner/dashboard"
            element={<PractitionerDashboard />}
          />
          <Route path="/practitioner/signUp" element={<PractitionerSignUp />} />
          <Route path="/TestAudio" element={<TestAudio />} />
          <Route path="/practitioner/login" element={<PractitionerLogin />} />
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  );
};

export default App;
