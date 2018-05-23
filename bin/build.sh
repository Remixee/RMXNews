rm -rf build/*
pug app/templates --out app/ --pretty
node-sass app/styles/index.scss -o app/
cp app/assets/icons/icon.png build/icon.png
cp app/assets/icons/icon.ico build/icon.ico
cp app/assets/icons/background.png build/background.png