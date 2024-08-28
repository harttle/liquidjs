set -ex

npm run build
npm start | grep 'Webpack Demo for LiquidJS'
