@echo off
echo ========================================
echo 启动 Directus CMS
echo ========================================
echo.

REM 设置环境变量禁用 SSL 验证
set NODE_TLS_REJECT_UNAUTHORIZED=0

echo 正在启动 Directus...
echo 访问: http://localhost:8055
echo.
echo 登录信息:
echo   邮箱: admin@example.com
echo   密码: admin123456
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

npx directus start

