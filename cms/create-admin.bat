@echo off
echo ========================================
echo 创建 Directus 管理员账号
echo ========================================
echo.

REM 设置环境变量禁用 SSL 验证
set NODE_TLS_REJECT_UNAUTHORIZED=0

echo 正在创建管理员...
echo 邮箱: admin@example.com
echo 密码: admin123456
echo.

npx directus users create --email admin@example.com --password admin123456 --role 6324e66a-b336-4e05-9b95-7879625aab15

echo.
echo ========================================
pause
