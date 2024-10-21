@ECHO OFF

:SetDeployMode
cls
echo Choose number for corresponding deploy mode
echo 1 - Product Admin
echo 2 - Product User
echo 3 - UAT Admin
echo 4 - UAT User
echo 5 - Product Admin and User
echo 6 - UAT Admin and User
echo 7 - All
set /p deploymode=

if /i %deploymode%==1 (
    goto :ProdAdmin
) else if /i %deploymode%==2 (
    goto :ProdUser
) else if /i %deploymode%==3 (
    goto :UATAdmin
) else if /i %deploymode%==4 (
    goto :UATUser
) else if /i %deploymode%==5 (
    goto :AllProd
) else if /i %deploymode%==6 (
    goto :AllUAT
) else if /i %deploymode%==7 (
    goto :All
) else (
    goto :SetDeployMode
)

:ProdAdmin
docker compose up -d --build prod.admin
pause
goto :EOF

:ProdUser
docker compose up -d --build prod.user
pause
goto :EOF

:UATAdmin
docker compose up -d --build uat.admin
pause
goto :EOF

:UATUser
docker compose up -d --build uat.user
pause
goto :EOF

:AllProd
docker compose up -d --build prod.admin prod.user
pause
goto :EOF

:AllUAT
docker compose up -d --build uat.admin uat.user
pause
goto :EOF

:All
docker compose up -d --build prod.admin prod.user uat.admin uat.user
pause
goto :EOF

:EOF
