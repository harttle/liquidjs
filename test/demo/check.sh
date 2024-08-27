# npm run build before running this check
set -x

npm link

cd demo/webpack
npm link liquidjs
npm run build
if npm start | grep 'Webpack Demo for LiquidJS'; then
  echo [success] demo/webpack
else
  echo [fail] demo/webpack
  exit 1
fi
cd -


cd demo/nodejs
npm link liquidjs
if npm start | grep 'NodeJS Demo for LiquidJS'; then
  echo [success] demo/nodejs
else
  echo [fail] demo/nodejs
  exit 1
fi
cd -


cd demo/template
npm link liquidjs
if npm start | grep '\[11:8] {{ todo }}'; then
  echo [success] demo/template
else
  echo [fail] demo/template
  exit 1
fi
cd -


cd demo/typescript
npm link liquidjs
if npm start | grep 'TypeScript Demo for LiquidJS'; then
  echo [success] demo/typescript
else
  echo [fail] demo/typescript
  exit 1
fi
cd -


cd demo/esm
npm link liquidjs
if npm start | grep 'LiquidJS Demo'; then
  echo [success] demo/esm
else
  echo [fail] demo/esm
  exit 1
fi
cd -

cd demo/express
npm link liquidjs

LOG_FILE=$(mktemp)
npm start > $LOG_FILE 2>&1 &
SERVER_PID=$!
while ! grep -q "Express running" "$LOG_FILE"; do
  if ! kill -0 $SERVER_PID; then
    echo "Server exited unexpectedly."
    cat $LOG_FILE
    return 1
  fi
  sleep 1
done
curl http://127.0.0.1:3000 | grep -q 'Welcome to LiquidJS'
RESULT=$?
killall node
rm $LOG_FILE
if [ $RESULT = 0 ]; then
  echo [success] demo/express
else
  echo [fail] demo/express
  exit 1
fi
cd -
