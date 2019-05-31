# cropper-image-mask
Allows to crop image and cover some image areas with another images.

1) Select an image at your computer
2) Crop image at the browser
3) Select image mask and place it to the cropped image area u'd like to cover
4) Select an other image mask or click "Submit"

Resulted image (cropped and merged with image masks) will be sent to the server using AJAX.

Example of uploading processing at src/upload.php

# Demo
https://rawcdn.githack.com/a2nt/cropper-image-mask/master/dist/index.html

## Usage
Install required modules using:
npm install

Start development server:
yarn start

Access development server at:
http://127.0.0.1:8001

Build your cropper script:
yarn build

## Directory structure
src/ - your sources

-- src/app.scss - specific app style

-- src/_events.js - app events definitions

-- src/_ui.spinner.js - spinner example

-- src/_ui.form.croppie.scss - cropper-image-mask field style

-- src/_ui.form.croppie.js - cropper-image-mask field js

-- src/index.html - HTML example

-- src/img - some example images 

-- src/upload.php - example of server-side processing


dist/ - compiled scipts after "yarn build"

You can open dist/index.html to see demo
