@echo off
echo ================================================
echo   Deeply Rooted - Setup and Deploy
echo ================================================
echo.

echo [1/3] Copying hero background image...
copy "C:\Users\huawei\.gemini\antigravity\brain\0d0d767a-87b5-44b9-930f-972860940dd4\hero_bg_botanical_1777059111757.png" "C:\Users\huawei\.gemini\antigravity\scratch\deeply-rooted\assets\images\hero-bg.png"
if %errorlevel% equ 0 (
    echo      SUCCESS: hero-bg.png copied!
) else (
    echo      WARNING: Could not copy image. Continuing...
)

echo.
echo [2/3] Staging all changes...
cd /d "C:\Users\huawei\.gemini\antigravity\scratch\deeply-rooted"
git add .

echo.
echo [3/3] Committing and pushing to Netlify...
git commit -m "Redesign: botanical hero background, ingredient pills, reference layout"
git push

echo.
echo ================================================
echo   DONE! Check https://deeplyrooted.netlify.app
echo   (Wait ~1 minute for Netlify to rebuild)
echo ================================================
echo.
pause
