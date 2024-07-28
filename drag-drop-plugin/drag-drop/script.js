/*!
 * jQuery DragDrop FileUpload v1.0.0
 * https://www.linkedin.com/in/priyan-ethi-062713104/
 *
 * Copyright 2024 Priyan
 * Released under the MIT license
 *
 * Developed for customized personal usage and published for public users.
 */

(function ($) {
  $.fn.dragDropUpload = function (options) {
    var settings = $.extend(
      {
        fileInputId: null,
        maxFileCount: Infinity,
        maxFileSize: Infinity,
        dropZoneText: "Drop files here", // Default text for drop zone
      },
      options
    );

    var selectedFiles = [];
    const dragDropIconImg = window.dragDropImg;
    const deleteIconImg = window.deleteIcon;
    const videoIconImg = window.videoIcon;
    const audioIconImg = window.audioIcon;
    const pdfIconImg = window.pdfIcon;
    const imageIconImg = window.imageIcon;
    const fileIconImg = window.fileIcon;

    this.each(function () {
      var $wrapper = $('<div class="upload-wrapper"></div>').appendTo($(this));
      var $dropZone = $('<div class="upload-container"></div>').appendTo(
        $wrapper
      );
      var $dropText = $('<div class="upload-text"></div>')
        .append(`<img src="${dragDropIconImg}" class="upload-img">`)
        .append(settings.dropZoneText)
        .appendTo($dropZone);
      var $fileInput = $('<input type="file" multiple hidden>')
        .attr("id", settings.fileInputId || "file-input")
        .appendTo($wrapper);
      var $fileList = $('<ul id="file-list"></ul>').appendTo($wrapper);

      $dropZone.on("dragover", function (e) {
        e.preventDefault();
        $dropZone.addClass("drag-over");
      });

      $dropZone.on("dragleave", function (e) {
        $dropZone.removeClass("drag-over");
      });

      $dropZone.on("drop", function (e) {
        e.preventDefault();
        $dropZone.removeClass("drag-over");
        var files = e.originalEvent.dataTransfer.files;
        handleFiles(files);
      });

      $dropZone.on("click", function () {
        $fileInput.click();
      });

      $fileInput.on("change", function () {
        var files = $fileInput[0].files;
        handleFiles(files);
      });

      function handleFiles(files) {
        if (selectedFiles.length + files.length > settings.maxFileCount) {
          alert(
            "You can only upload up to " + settings.maxFileCount + " files."
          );
          return;
        }

        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (file.size > settings.maxFileSize) {
            alert(
              file.name +
                " exceeds the maximum file size of " +
                settings.maxFileSize / (1024 * 1024) +
                " MB."
            );
            continue;
          }

          selectedFiles.push(file);

          var listItem = $("<li></li>");
          var fileIcon = $('<img class="file-icon" alt="file icon">');
          var fileName = $('<span class="file-name"></span>').text(file.name);
          var fileSize = $('<span class="file-size"></span>').text(
            (file.size / 1024).toFixed(2) + " KB"
          );
          var removeButton = $(
            `<img class="remove-file" src="${deleteIconImg}">`
          );

          // Assign appropriate icon based on file type
          if (file.type.startsWith("image/")) {
            fileIcon.attr("src", imageIconImg);
          } else if (file.type.startsWith("video/")) {
            fileIcon.attr("src", videoIconImg);
          } else if (file.type.startsWith("audio/")) {
            fileIcon.attr("src", audioIconImg);
          } else if (file.type === "application/pdf") {
            fileIcon.attr("src", pdfIconImg);
          } else {
            fileIcon.attr("src", fileIconImg);
          }

          listItem
            .append(fileIcon)
            .append(fileName)
            .append(fileSize)
            .append(removeButton);
          $fileList.append(listItem);

          removeButton.on(
            "click",
            (function (file, listItem) {
              return function () {
                selectedFiles = selectedFiles.filter((f) => f !== file);
                listItem.remove();
              };
            })(file, listItem)
          );
        }
      }
    });

    this.data("dragDropUpload", {
      getFiles: function () {
        return selectedFiles;
      },
    });

    return this;
  };
})(jQuery);
