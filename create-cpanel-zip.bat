@echo off
echo ========================================================
echo   TREC KL FASHION SHOW - CPANEL DEPLOY BUNDLER
echo ========================================================
echo 1. Memulai build Next.js production...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build gagal! Periksa error di atas.
    pause
    exit /b %errorlevel%
)

echo 2. Menghapus zip lama jika ada...
if exist cpanel-deploy.zip del /f /q cpanel-deploy.zip
if exist temp_deploy rmdir /s /q temp_deploy

echo 3. Menyiapkan file untuk cPanel...
mkdir temp_deploy
mkdir temp_deploy\.next
mkdir temp_deploy\public

xcopy /E /I /Y .next temp_deploy\.next
xcopy /E /I /Y public temp_deploy\public
copy /Y server.js temp_deploy\server.js
copy /Y package.json temp_deploy\package.json
copy /Y package-lock.json temp_deploy\package-lock.json
copy /Y next.config.ts temp_deploy\next.config.ts
copy /Y ecosystem.config.js temp_deploy\ecosystem.config.js
if exist .env.local copy /Y .env.local temp_deploy\.env.local

echo 4. Mengompresi menjadi cpanel-deploy.zip...
powershell -Command "Compress-Archive -Path 'temp_deploy\*' -DestinationPath 'cpanel-deploy.zip' -Force"

echo 5. Membersihkan file sementara...
rmdir /s /q temp_deploy

echo ========================================================
echo   SUKSES! File 'cpanel-deploy.zip' siap diunggah ke cPanel Dewaweb!
echo ========================================================
pause
