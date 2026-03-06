@echo off
chcp 65001 >nul
echo ===================================
echo 重启所有服务
echo ===================================
echo.

REM 停止后端服务
echo [1/4] 停止后端服务...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
    if !errorlevel! equ 0 (
        echo 已停止后端服务 (PID: %%a)
    )
)

REM 停止前端服务
echo [2/4] 停止前端服务...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
    if !errorlevel! equ 0 (
        echo 已停止前端服务 (PID: %%a)
    )
)

echo.
echo [3/4] 启动后端服务...
cd /d d:/aimi/BackProgram
start "后端服务" cmd /k "npm run dev"

echo 等待后端服务启动...
timeout /t 3 /nobreak >nul

echo.
echo [4/4] 启动前端服务...
cd /d d:/aimi/FrontProgram
start "前端服务" cmd /k "npm run dev"

echo.
echo ===================================
echo 服务重启完成！
echo ===================================
echo.
echo 后端服务: http://localhost:3000
echo 前端服务: http://localhost:5173
echo.
echo 按任意键关闭此窗口...
pause >nul
