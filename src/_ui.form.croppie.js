"use strict";

import $ from 'jquery';

import Events from './_events';
import SpinnerUI from './_ui.spinner';

import Cropper from 'cropperjs/dist/cropper.js'; //'cropperjs/src/index.js';

const CroppieUI = (($) => {

  const NAME = 'jsCroppieUI';
  const DATA_KEY = NAME;

  const G = window;
  const D = document;
  const DEFAULTS = {
    aspectRatio: 16 / 9,
  };

  class CroppieUI {

    constructor(element) {
      console.log(`Initializing: ${NAME}`);

      const ui = this;

      ui._element = element;

      ui.$el = $(ui._element);
      ui.$form = ui.$el.parents('form');
      ui.$input = ui.$el.find('input[type="file"]');

      ui.$el.prepend('<img src="" alt="" class="cropping-image" />');
      ui.$image = ui.$el.find('img.cropping-image');
      ui.original_image = ui.$image[0];
      ui.mask_img = false;

      ui.name = ui.$input.attr('name');
      ui.width = ui.$input.data('width');
      ui.height = ui.$input.data('height');

      ui.options = DEFAULTS;
      ui.cropper = false;

      ui.$el.data(DATA_KEY, ui);

      ui.$el.prepend('<div class="remove-masks"></div>');
      ui.$removeBtns = ui.$el.find('.remove-masks');
      ui.masks = [];

      ui.$input.on('change', (e) => {
        const files = e.currentTarget.files;

        if (files && files.length) {
          ui.loadFile(files[0]);
        }
      });

      // actions
      ui.$el.append('<a href="/" class="btn act-crop">Crop it</a>');

      // crop
      ui.$el.find('.act-crop').on('click', (e) => {
        if (!ui.cropper) {
          return true;
        }

        e.preventDefault();

        const canvas = ui.cropper.getCroppedCanvas({
          width: ui.width,
          height: ui.height,
        });

        ui.$image[0].src = canvas.toDataURL();

        ui.original_image = new Image();
        ui.original_image.src = canvas.toDataURL();

        ui.cropper.destroy();
        ui.cropper = false;

        ui.$el.removeClass(`${NAME}-cropping`);
        ui.$el.addClass(`${NAME}-cropped`);
      });

      // mask
      ui.$el.find('.masks .mask-item').on('click', (e) => {
        e.preventDefault();
        ui.setMask($(e.currentTarget));
      });

      // submit
      ui.$form.on('submit', (e) => {
        if (!ui.cropper) {
          return true;
        }

        SpinnerUI.show();

        ui.saveImage();

        const canvas = ui.cropper.getCroppedCanvas({
          width: ui.width,
          height: ui.height,
        });

        ui.$image[0].src = canvas.toDataURL();
        canvas.toBlob((blob) => {
          ui.uploadFile(blob);
        });

        e.preventDefault();
      });
    }

    setMask = ($el) => {
      const ui = this;

      // add current mask
      if (ui.mask_img) {
        ui.addMask(ui.getMask());
      }

      // update image storage
      if (ui.cropper) {
        ui.cropper.destroy();
        ui.cropper = false;

        ui.saveImage();
      }

      // add new image
      ui.mask_img = new Image();
      ui.mask_img.src = $el.data('src');

      ui.mask_img.onload = () => {
        const img = ui.mask_img;

        ui.cropper = new Cropper(ui.$image[0], {
          aspectRatio: img.width / img.height,
          viewMode: 0,
          guides: true,
          center: true,
          highlight: true,
          cropBoxMovable: true,
          cropBoxResizable: true,
          movable: false,
          rotatable: false,
          zoomable: false,
          ready: () => {
            ui.$el.find('.cropper-face').css({
              'background-color': 'transparent',
              'background-image': `url(${ui.mask_img.src})`,
              'opacity': '0.8',
            });
            ui.$el.find('.cropper-face').data('current-mask', $el);
          }
        });
      };
    }

    // returns mask ID
    addMask = (mask) => {
      const ui = this;
      const id = Date.now();

      ui.masks[id] = mask;

      // draw removable button
      let $btn = $('<a class="remove-mask" href="#" data-id="' + id + '">Delete mask #' + id + '</a>');
      ui.$el.find('.masks').append($btn);

      /*ui.$removeBtns.prepend($btn);
      $btn = ui.$removeBtns.find('[data-id="' + id + '"]');

      $btn.css({
        left: 100 * mask.left / ui.width + '%',
        top: 100 * mask.top / ui.width + '%',
        width: 100 * mask.width / ui.width + '%',
        height: 100 * mask.height / ui.height + '%',
      });*/
      $btn.on('click', (e) => {
        e.preventDefault();

        const $btn = $(e.currentTarget);
        const id = $btn.data('id');

        ui.removeMask(id);
      });
      return id;
    }

    removeMask = (id) => {
      const ui = this;
      delete ui.masks[id];
      ui.$el.find('.masks [data-id="' + id + '"]').remove();

      ui.mask_img = false;
      ui.$el.find('.cropper-face').data('current-mask').click();
    }

    getMask = () => {
      const ui = this,
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        cropper = ui.cropper,
        maskWidth = cropper.getData().width,
        maskHeight = cropper.getData().height,
        maskTop = cropper.getData().y,
        maskLeft = cropper.getData().x,
        imageLeft = cropper.getImageData().left,
        imageTop = cropper.getImageData().top,
        imageAspect = cropper.getImageData().aspectRatio;

      canvas.width = ui.width;
      canvas.height = ui.height;
      context.imageSmoothingEnabled = true;

      return {
        img: ui.mask_img,
        left: maskLeft,
        top: maskTop,
        width: maskWidth,
        height: maskHeight
      };
    }

    saveImage = () => {
      const ui = this,
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

      canvas.width = ui.width;
      canvas.height = ui.height;
      context.imageSmoothingEnabled = true;

      context.drawImage(ui.original_image, 0, 0, ui.width, ui.height);

      for (let id in ui.masks) {
        const mask = ui.masks[id];
        console.log(mask);
        context.drawImage(mask.img, mask.left, mask.top, mask.width, mask.height);
      }

      ui.$image[0].src = canvas.toDataURL();

      return canvas;
    };

    loadFile = (file) => {
      const ui = this;

      if (/^image\/\w+/.test(file.type)) {

        ui.$image[0].src = URL.createObjectURL(file);

        if (ui.cropper) {
          ui.cropper.destroy();
        }

        ui.cropper = new Cropper(ui.$image[0], ui.options);
        ui.$input[0].value = null;

        ui.$el.addClass(`${NAME}-cropping`);
      } else {
        window.alert('Please choose an image file.');
      }
    };

    uploadFile = (blob) => {
      console.log('Initializing uploading sequence!');

      const ui = this;
      const data = new FormData(ui.$form[0]);

      data.delete('BackURL');
      data.delete(ui.name);
      data.append(ui.name, blob, ui.name + '-image.png');
      data.append('ajax', '1');

      $.ajax({
        url: ui.$form.attr('action'),
        data: data,
        processData: false,
        contentType: false,
        type: ui.$form.attr('method'),
        success: (data) => {
          console.log('UPLOAD SUCCESS!');

          SpinnerUI.hide();
          $(G).trigger(Events.AJAX);
        }
      });
    };

    static dispose() {
      console.log(`Destroying: ${NAME}`);
    }

    static _jQueryInterface() {
      return this.each((i, el) => {
        // attach functionality to element
        const $el = $(el);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new CroppieUI(el);
          $el.data(DATA_KEY, data);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = CroppieUI._jQueryInterface;
  $.fn[NAME].Constructor = CroppieUI;
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return CroppieUI._jQueryInterface;
  };

  // auto-apply
  $(window).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    $('.field.croppie').jsCroppieUI();
  });

  return CroppieUI;
})($);

export default CroppieUI;
