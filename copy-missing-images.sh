#!/bin/bash

# Create directory structure
mkdir -p images/tours
mkdir -p images/western-mongolia
mkdir -p images/northern-mongolia
mkdir -p images/destination-images

# Copy some of the existing images to required locations
# Western Mongolia images
cp images/c0023t01*.jpg images/western-mongolia/main.jpg || true
cp images/c0022t01*.jpg images/western-mongolia/thumb-1.jpg || true
cp images/dsc00008*.jpg images/western-mongolia/thumb-2.jpg || true
cp images/c0096t01*.jpg images/western-mongolia/thumb-3.jpg || true
cp images/c0066t01*.jpg images/western-mongolia/thumb-4.jpg || true

# Tour images
cp images/c0014t01.jpg images/tours/tavan-bogd-main.jpg || true
cp images/c0020t01*.jpg images/tours/tavan-bogd-1.jpg || true
cp images/c0069t01*.jpg images/tours/tavan-bogd-2.jpg || true
cp images/c0086t01.jpg images/tours/tavan-bogd-3.jpg || true
cp images/c0096t01*.jpg images/tours/tavan-bogd-4.jpg || true
cp images/c0023t01*.jpg images/tours/gobi-expedition.jpg || true
cp images/dsc00008*.jpg images/tours/eagle-hunters.jpg || true
cp images/c0020t01*.jpg images/tours/horse-trek.jpg || true

# Copy basic image placeholder for other missing images
for i in {1..4}; do
  cp images/c0014t01.jpg images/tour-${i}.jpg || true
  cp images/c0020t01*.jpg images/destination-${i}.jpg || true
  cp images/c0069t01*.jpg images/rec-tour-${i}.jpg || true
  cp images/c0023t01*.jpg images/hero-${i}.jpg || true
done

# Northern Mongolia images
cp images/c0096t01*.jpg images/northern-mongolia/horse-trek.jpg || true

# Create missing payment icons
convert -size 300x50 xc:white -fill black -pointsize 20 -annotate +10+30 "Payment Icons" images/payment-icons.png || echo "Could not create payment icons (ImageMagick not installed)"

echo "Images copied successfully!" 