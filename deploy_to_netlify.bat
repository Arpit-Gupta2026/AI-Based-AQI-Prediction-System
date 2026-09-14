@echo off
echo ===================================================
echo   Deploying AQI Prediction System to Netlify...
echo ===================================================
echo.
echo Make sure you have created your build first!
echo Running "npm run build" just in case...
cd frontend
call npm.cmd run build
echo.
echo Now launching Netlify CLI to deploy...
echo (If this is your first time, a browser window will open asking you to log in to Netlify)
echo.
call npx.cmd netlify-cli deploy --prod --dir=dist
echo.
echo Deployment finished! Check the URL provided above.
pause
