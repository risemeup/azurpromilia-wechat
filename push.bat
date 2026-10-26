@echo off
set "msg=%~1"

if "%msg%"=="" (
    echo 错误：请提供 commit message
    echo 用法: .\push.bat "你的提交信息"
    exit /b 1
)

echo 正在执行: git add .
git add .

echo 正在执行: git commit -m "%msg%"
git commit -m "%msg%"

echo 正在执行: git push origin main
git push origin main

echo 完成！
