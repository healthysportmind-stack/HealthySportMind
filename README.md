# HealthySportMind

## Getting Started for Contributors

Welcome to the HealthySportMind repository! This project consists of a React Native (Expo) frontend and a Django backend. Follow these instructions to set up your local development environment.

### 1. Backend Setup (Django)

The backend uses Django and requires Python. The dependencies—including the ones needed for user profiles, check-ins, and performance logging—are defined in `requirements.txt`.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Run Database Migrations:** Before starting the server, you must apply the database schema (such as the `PerformanceLog` tables we use for charting):
   ```bash
   python manage.py makemigrations api
   python manage.py migrate
   ```
5. Start the backend development server:
   ```bash
   python manage.py runserver
   ```

---

### 2. Frontend Setup (React Native / Expo)

The frontend is an Expo project. Its dependencies (including our chart libraries like `react-native-gifted-charts`, `expo-linear-gradient`, and others) are tracked in `package.json`, **not** in `requirements.txt`.

1. Open a *new* terminal block and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node modules (this will pull in all the graph dependencies automatically):
   ```bash
   npm install
   ```
3. Start the Expo development server (we recommend clearing the cache on your first pull to ensure native modules like gradients load correctly):
   ```bash
   npx expo start -c
   ```

### Notes
- Ensure your backend server is running on `127.0.0.1:8000` so the frontend Axios API calls can successfully route data. If you are testing on a physical Android device, you may need to update the `API_URL` variables in the `frontend/services/api/` folders to your computer's local area network IP address.
