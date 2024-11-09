# MobilityMate

Supporting senior patients through their exercise programs via an accessible AI voice assistant and summarizing key difficulties for their medical practitioner to help with.

![Screenshot (669) 1](https://github.com/mfdavies/mobility-mate-frontend/assets/90405643/f362e83f-d52f-427c-baca-9aa973228c8a)

### Winner of the Diversity in Engineering Prize at HackED 2024 🎉

For building a project that contributes to EDI (equity, diversity, and inclusion) and accessibility. See our [Devpost](https://devpost.com/software/mobility-mate-9fyp8v) here.

![Screenshot (690)](https://github.com/mfdavies/mobility-mate-frontend/assets/90405643/7fa21a2e-5994-4426-9c0e-5e4dc0984521)

## Key Features

- 🏋️‍♀️ Easy Exercise Tracking – Senior patients can quickly see their assigned exercises and chat with an AI assistant to report progress or discuss concerns.
- 👩‍⚕️ Therapist Dashboard – Therapists have a comprehensive dashboard where they can assign personalized exercise routines to each patient.
- 📊 Quick Patient Summaries – Therapists can view summaries of patients' conversations with the MobilityMate AI to stay up-to-date on their condition before appointments.
- 🔗 Hassle-Free Login – Senior-friendly login with a simple email link—no passwords needed!

## Installation

```bash
git clone git@github.com:mfdavies/mobility-mate-backend.git
git clone git@github.com:mfdavies/mobility-mate-frontend.git
```

### Frontend (React/Vite)

```bash
cd mobility-mate-frontend
npm install
npm run dev
```

Open your browser and navigate to http://localhost:5173

### Backend (Flask)

```bash
cd mobility-mate-backend
python3 -m venv venv
source venv/bin/activate
pip install -r server/requirements.txt
python3 server/src/main.py
```

Open your browser and navigate to http://localhost:5000 to verify that the backend is running.
