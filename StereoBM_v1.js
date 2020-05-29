import {IMAGE_SETTINGS, StereoProcessor,Picture} from './lib/images.js';

"use strict";

class IO{
 constructor(cL, cR, cOut){
  this.CanvasLeft = cL || {};
  this.CanvasRight = cR || {};
  this.CanvasOut = cOut || ();
  this.ContextLeft = this.CanvasLeft.getContext("2d") || {};
  this.ContextRight = this.CanvasRight.getContext("2d") || {};
  this.ContextOut = this.CanvasOut.getContext("2d") || {};
  this.LoadButton = {};
  this.BMButton = {};
 }
 LoadPics(){
  var imgLeft = new Image();
  var imgRight = new Image();
  LoadImage(imgLeft, this.ContextLeft, 'LeftImg.png');
  LoadImage(imgRight, this.ContextRight, 'RightImg.png');
 }
 LoadImage(img, cxt, src){
  img.onLoad = function(){
   var _img_ = { _img: img, x: 0, y: 0 }
   cxt.drawImage(_img_._img, _img_.x, _img_.y)
  }
  img.src = src;
 }
 StereoBM()
 {   
  var sp = new StereoProcessor(this.CanvasOut);
  sp.LoadImagesFromCanvas(this.CanvasLeft, this.CanvasRight);
  var depthmap = sp.GetDepthMap(80, 0.5, 0.05, 0.10);
  sp.OutputContext.putImageData(depthmap.ToImgData(),0,0);
 }
 AddButtons(btn_load, btn_bm){
  this.LoadButton = btn_load;
  this.LoadButton.addEventListener("click", this.LoadPics, false);
  this.BMButton = btn_bm;
  this.BMButton.addEventListener("click", this.StereoBM, false);
 }
}

(function(){
 var cl=document.getElementById("Canvas_leftimg");     
 var cr=document.getElementById("Canvas_rightimg");     
 var c = document.getElementById("canvas");
 var buttonLoad = document.getElementById("btn_load");
 var buttonBM = document.getElementById("btn_bm");
 var myIO = new IO(cl, cr, c);
 myIO.AddButtons(buttonLoad, buttonBM);
})();



