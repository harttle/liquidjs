set -x

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
if [ $RESULT != 0 ]; then
  exit 1
fi
