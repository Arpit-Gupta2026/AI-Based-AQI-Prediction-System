@echo off
echo Starting AQI Prediction System...

echo Starting FastAPI Backend (using Pure Python fallback)...
start cmd /k "cd backend && .\venv\Scripts\python.exe app/raw_server.py"

echo Starting React Frontend...
start cmd /k "cd frontend && npm.cmd run dev"

echo Both servers are starting!
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
