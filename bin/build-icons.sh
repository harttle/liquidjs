#!/usr/bin/env bash

# Prerequisites:
# 1.imagemagick. try brew install imagemagick
# 2. logo.png in size 512x512
# 3. this script should be run with cwd docs/source/icon/

echo creating apple touch icons...
apple=(57x57 60x60 72x72 76x76 114x114 120x120 144x144 152x152)
for size in "${apple[@]}"; do
    echo $size
    convert logo.png -resize $size apple-touch-icon-$size.png
done
cp logo.png apple-touch-icon.png
convert logo.png \
     \( +clone -alpha extract \
        -draw 'fill black polygon 0,0 0,80 80,0 fill white circle 80,80 80,0' \
        \( +clone -flip \) -compose Multiply -composite \
        \( +clone -flop \) -compose Multiply -composite \
     \) -alpha off -compose CopyOpacity -composite apple-touch-icon-precomposed.png

echo creating favicon...
convert logo.png -resize 48x48 ../favicon.ico
favicon=(16x16 32x32 96x96 160x160 196x196)
for size in "${favicon[@]}"; do
    echo $size
    convert logo.png -resize $size favicon-$size.png
done

echo creating mstile icons...
mstile=(70x70 144x144 150x150 310x310)
for size in "${mstile[@]}"; do
    echo $size
    convert logo.png -resize $size mstile-$size.png
done
convert mstile-150x150.png -gravity center -background white -extent 310x150 mstile-310x150.png