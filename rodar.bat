@echo off
set PYTHONUTF8=1
echo Encerrando processos Streamlit anteriores...
taskkill /F /IM python.exe /T 2>nul
timeout /t 2 /nobreak >nul
echo Iniciando Raegis na porta 8515...
python -m streamlit run app.py --server.headless true --server.port 8515
pause
