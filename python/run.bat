@echo off
set PYTHONUTF8=1
echo Terminating previous Streamlit processes...
taskkill /F /FI "WINDOWTITLE eq Raegis Dashboard" /T 2>nul
timeout /t 2 /nobreak >nul
echo Starting Raegis on port 8515...
python -m streamlit run app.py --server.headless true --server.port 8515
pause
