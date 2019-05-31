# cropper-image-mask
Allows to crop image and cover some image areas with another images.

1) Select an image at your computer
2) Crop image at the browser
3) Select image mask and place it to the cropped image area u'd like to cover
4) Select an other image mask or click "Submit"

Resulted image (cropped and covered with image masks) will be sent to the server using AJAX.
Example of uploading processing at src/upload.php

## Usage
Install required modules using:
npm install

Start development server:
yarn start

Access development server at:
http://127.0.0.1:8001

Build your cropper script:
yarn build
