# npm run build before running this check
set -x
export CI=true

if [ ! -d dist ]; then
  echo >2 'build and link liquidjs before run test.sh'
  exit 1
fi

npm link

for demo in $(ls demo); do
  cd demo/$demo
  npm link liquidjs

  if npm test; then
    echo [success] demo/webpack
  else
    echo [fail] demo/webpack
    exit 1
  fi
  cd -
done
