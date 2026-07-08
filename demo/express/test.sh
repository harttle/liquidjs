set -e

LOG_FILE=$(mktemp)
npm start > $LOG_FILE 2>&1 &
SERVER_PID=$!
while ! grep -q "Express running" "$LOG_FILE"; do
  if ! kill -0 $SERVER_PID; then
    echo "Server exited unexpectedly."
    cat $LOG_FILE
    exit 1
  fi
  sleep 1
done
curl http://127.0.0.1:3000 | grep -q 'Welcome to LiquidJS'
RESULT=$?
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true
rm $LOG_FILE
if [ $RESULT != 0 ]; then
  exit 1
fi
