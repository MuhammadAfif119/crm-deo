import { useToast } from "@chakra-ui/react";
import React from "react";

export const CheckVideoResolution = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      const width = video.videoWidth;
      const height = video.videoHeight;
      const aspectRatio = width / height;
      const supportedAspectRatio = 9 / 16;

      if (
        width >= 1280 &&
        height >= 720 &&
        aspectRatio === supportedAspectRatio
      ) {
        resolve();
      } else {
        reject(
          new Error(
            "The video resolution or aspect ratio is not supported. Supported aspect ratio for reels and story is 9/16"
          )
        );
      }
    };
    video.onerror = function () {
      reject(new Error("failed to load the video"));
    };
  });
};

// export const CheckVideoResolution = (file) => {

// const reader = new FileReader();

// //Read the contents of Image File.
// reader.readAsDataURL(file.files[0]);
// reader.onload = function (e) {

//   //Initiate the JavaScript Image object.
//   var image = new Image();

//   //Set the Base64 string return from FileReader as source.
//   image.src = e.target.result;

//   //Validate the File Height and Width.
//   image.onload = function () {
//     var height = this.height;
//     var width = this.width;
//     if (height > 100 || width > 100) {
//       alert("Height and Width must not exceed 100px.");
//       return false;
//     }
//     alert("Uploaded image has valid Height and Width.");
//     return true;
//   };
// };
