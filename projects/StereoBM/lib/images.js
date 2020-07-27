export const IMAGE_SETTINGS = {
    "LEFT_IMG_WIDTH": 600.,
    "LEFT_IMG_HEIGHT": 480.,
    "RIGHT_IMG_WIDTH": 600.,
    "RIGHT_IMG_HEIGHT": 480.,
    "OUTPUT_IMG_WIDTH": 600.,
    "OUTPUT_IMG_HEIGHT": 480.,
    "EDGE_THRESHOLD": 50000.,  //need to test
    "DISP_THRESHLOD": 10.,
    "KERNAL_GAUSSIAN3x3": [ [0.0625, 0.125, 0.0625],
                            [0.125,  0.25,  0.125 ],
                            [0.0625, 0.125, 0.0625] ],
    //add more constants here
    "EDGE_DETECTION_X": [ [-1, 0, 1],
                            [-2,  0,  2],
                            [-1, 0, 1] ],
    "EDGE_DETECTION_Y": [ [-1, -2, -1],
                            [0,  0,  0],
                            [1, 2, 1] ],
    "DILATION": [ [0, 1, 0],
                [1,  1,  1],
                [0, 1, 0] ],
}
export class Pixel{
    constructor(r,g,b,a){
        this.R = r || 0.;
        this.G = g || 0.;
        this.B = b || 0.;
        this.A = a || 0.;
        this.Gray = Math.round(0.299 * this.R +  0.587 * this.G + 0.114 * this.B) || 0.;
    }
    UpdateColor(r,g,b,a){
        this.R = r || 0.;
        this.G = g || 0.;
        this.B = b || 0.;
        this.A = a || 0.;
        this.Gray = Math.round(0.299 * this.R +  0.587 * this.G + 0.114 * this.B) || 0.;
    }
}
export class Picture{
    constructor(width, height){
        this.Width = width;
        this.Height = height;
        this.DataRows = new Array();
        for (let i = 0; i < height; i++) {
            this.DataRows.push(new Array());
        }
    }
    LoadImgData(imgdata, sourcewidth, sourceheight){
        let data = imgdata.data;
        let len = sourcewidth * sourceheight;
        if(sourcewidth != this.Width || sourceheight != this.Height) return;
        let pixelLength = len / 4;
        for (let j=0; j<this.Height; j++){
            for (let i = 0; i < this.Width; i++) {
                let _i = 4 * this.Width * j + i * 4;
                this.DataRows[j].push(new Pixel(data[_i],data[_i+1],data[_i+2],data[_i+3]))
            }
        }
    }
    Getpixel(x,y){
        return this.DataRows[y][x];
    }
    ToImgData(){
        var rt = new Array();
        for (let i = 0; i < this.Height; i++) {
            for (let j = 0; j < this.Width; j++) {
                let r = this.DataRows[i][j].R;
                let g = this.DataRows[i][j].G;
                let b = this.DataRows[i][j].B;
                //let gray = this.DataRows[i][j].Gray;
                rt.push(r);
                rt.push(g);
                rt.push(b);
                rt.push(255);
            }
        }
        //return new ImageData(rt, this.Width, this.Height);
        return new ImageData(new Uint8ClampedArray(rt), this.Width, this.Height);
    }
    PicGrayMatrix(i, j){
        var matrix;
        if (i>0 && i<this.Height-1 && j>0 && j<this.Width-1) {
            matrix = [[this.DataRows[i-1][j-1].Gray, this.DataRows[i-1][j].Gray, this.DataRows[i-1][j+1].Gray],
                      [this.DataRows[i][j-1].Gray,  this.DataRows[i][j].Gray,  this.DataRows[i][j+1].Gray],
                      [this.DataRows[i+1][j-1].Gray, this.DataRows[i+1][j].Gray, this.DataRows[i+1][j+1].Gray]];
        }
        else matrix = [[0,0,0],[0,0,0],[0,0,0]];
        return matrix;
        
    }
    //convert black white image into binary image
    binaryImg(i,j) {
        var matrix = this.PicGrayMatrix(i, j);
        for (let i=0; i<3; i++){
            for (let j=0; j<3; j++){
                if (matrix[i][j] == 255){
                    matrix[i][j] = 1;
                }
                else if (matrix[i][j] == 0) {
                    matrix[i][j] = 0;
                }
                else {
                    console.log("binaryImg error");
                }
            }
        }
        return matrix;
    }
}

export function dotProduct(mat1, mat2, dimension){
    var sum = 0;
    for (let i=0; i<dimension; i++){
        for (let j=0; j<dimension; j++){
            sum += mat1[i][j] * mat2[i][j];
        }
    }
    return sum;
}
export function xor(mat1, mat2, dimension) {
    var result = 0;
    for (let i=0; i<dimension; i++){
        for (let j=0; j<dimension; j++){
            result = mat1[i][j] ^ mat2[i][j];
            if(result == 1) {
                return 255;
            }
        }
    }
    return 0;
}
//input grayscale pic
export function GrayscaleDilation(pic) {
    var GDPic = new Picture(pic.Width, pic.Height);
    for (let i=0; i<pic.Height; i++){
        for (let j=0; j<pic.Width; j++){
            if(i==0||i==pic.Height-1||j==0||j==pic.Width-1){
                var temp = pic.DataRows[i][j].Gray;
                GDPic.DataRows[i].push(new Pixel(temp, temp, temp, 255));
            }
            else {
                var maxgray = Math.max(pic.DataRows[i-1][j].Gray, pic.DataRows[i+1][j].Gray, pic.DataRows[i][j-1].Gray, pic.DataRows[i][j+1].Gray);
            GDPic.DataRows[i].push(new Pixel(maxgray, maxgray, maxgray, 255));
            }
        }
    }
    return GDPic;
}
export function GrayscaleErosion(pic) {
    var GEPic = new Picture(pic.Width, pic.Height);
    for (let i=0; i<pic.Height; i++){
        for (let j=0; j<pic.Width; j++){
            if(i==0||i==pic.Height-1||j==0||j==pic.Width-1){
                var temp = pic.DataRows[i][j].Gray;
                GEPic.DataRows[i].push(new Pixel(temp, temp, temp, 255));
            }
            else {
                var mingray = Math.min(pic.DataRows[i-1][j].Gray, pic.DataRows[i+1][j].Gray, pic.DataRows[i][j-1].Gray, pic.DataRows[i][j+1].Gray);
                GEPic.DataRows[i].push(new Pixel(mingray, mingray, mingray, 255));
            } 
        }
    }
    return GEPic;
}
export function GrayscaleOpening(pic) {
    var GEpic = GrayscaleErosion(pic);
    var GDpic = GrayscaleDilation(GEpic);
    return GDpic;
}
export function GrayscaleClosing(pic) {
    var GDpic = GrayscaleDilation(pic);
    var GEpic = GrayscaleErosion(GDpic);
    return GEpic;
}
export function MorphologicalSmoothing(pic) {
    var GOpic = GrayscaleOpening(pic);
    var GCpic = GrayscaleClosing(GOpic);
    return GCpic;
}

export function BlackWhite(pic) {
    var sum = 0;
    for (let i=0; i<pic.Height; i++){
        for (let j=0; j<pic.Width; j++){
            sum += pic.DataRows[i][j].Gray;
        }
    }
    var average = Math.round(sum / (pic.Height * pic.Width));
    var BitPic = new Picture(pic.Width, pic.Height);
    for (let i=0; i<pic.Height; i++){
        for (let j=0; j<pic.Width; j++){
            if(pic.DataRows[i][j].Gray > average){
                BitPic.DataRows[i].push(new Pixel(255, 255, 255, 255));
            }
            else {
                BitPic.DataRows[i].push(new Pixel(0, 0, 0, 255));
            }
        }
    }
    return BitPic;
}

export function GaussianBlur(pic) {
    var BlurPic = new Picture(pic.Width, pic.Height);
    for (let i=0; i<pic.Height; i++){
        for (let j=0; j<pic.Width; j++){
            if(i==0||i==pic.Height-1||j==0||j==pic.Width-1){
                var edgeBlur = pic.DataRows[i][j].Gray;
                BlurPic.DataRows[i].push(new Pixel(edgeBlur, edgeBlur, edgeBlur, 255));
            }
            else{
                var blur = dotProduct(IMAGE_SETTINGS.KERNAL_GAUSSIAN3x3, pic.PicGrayMatrix(i, j), 3); 
                BlurPic.DataRows[i].push(new Pixel(blur, blur, blur, 255));
            }
        }
    }
    return BlurPic;
}


export function Dilation(pic) {
    //dilation for binary images
    var picDila = new Picture(pic.Height, pic.Width);
    for (let i=0; i<pic.Height; i++){
        for (let j=0; j<pic.Width; j++){
            if(i==0||i==pic.Width-1||j==0||j==pic.Width-1){
                var G = pic.DataRows[i][j].Gray;
                var temp = 0;
                if (G>0) temp = 255;
                picDila.DataRows[i].push(new Pixel(temp, temp, temp, 255));
            }
            else{
                var dila = xor(IMAGE_SETTINGS.KERNAL_GAUSSIAN3x3, pic.binaryImg(i, j), 3); 
                picDila.DataRows[i].push(new Pixel(dila, dila, dila, 255));
            }
        }
    }
    return picDila;
}






export class StereoProcessor{
    constructor(cOut, picLeft, picRight){
        this.OutputCanvas = cOut || {};
        this.OutputContext = cOut.getContext("2d") || {};
        this.LeftPic = picLeft || new Picture(IMAGE_SETTINGS.LEFT_IMG_WIDTH, IMAGE_SETTINGS.LEFT_IMG_HEIGHT);
        this.RightPic = picRight || new Picture(IMAGE_SETTINGS.RIGHT_IMG_WIDTH, IMAGE_SETTINGS.RIGHT_IMG_HEIGHT);
        this.Kernal = IMAGE_SETTINGS.KERNAL_GAUSSIAN3x3;
    }
    UpdateImages(picL, picR){
        this.LeftPic = picL || this.LeftPic;
        this.RightPic = picR || this.RightPic;
    }
    LoadImagesFromImgData(dataL, lw, lh, dataR, rw, rh){
        var picL = new Picture(lw, lh);
        picL.LoadImgData(dataL, lw, lh);
        var picR = new Picture(rw, rh);
        picR.LoadImgData(dataR, rw, rh);
        this.LeftPic = picL; 
        this.RightPic = picR;
    }
    LoadImagesFromCanvas(leftC, rightC){
        var cxtL = leftC.getContext("2d");
        var cxtR = rightC.getContext("2d");
        var dataL = cxtL.getImageData(0,0,leftC.width,leftC.height);  
        var dataR = cxtR.getImageData(0,0,rightC.width,rightC.height); 

        this.LoadImagesFromImgData(dataL,leftC.width,leftC.height,dataR,rightC.width,rightC.height);
    }
    SetKernal(kernal){
        this.Kernal = kernal || this.Kernal;
    }




    PreProcessing(pic){ 
        /*
        var BlurPic = new Picture(pic.Width, pic.Height);
        BlurPic = ImageProcessor.GaussianBlur(pic);
        var BWPic = new Picture(pic.Width, pic.Height);
        BWPic = ImageProcessor.BlackWhite(BlurPic);
        var DilaPic = new Picture(pic.Width, pic.Height);
        DilaPic = ImageProcessor.Dilation(BWPic);
        return BWPic;
        */

        var SmoothPic = new Picture(pic.Width, pic.Height);
        SmoothPic = MorphologicalSmoothing(pic);
        var Blur = GaussianBlur(SmoothPic);
        //return SmoothPic;
        return Blur;
    }
    Calmaxdisp(leftPic, i){  //maximum number of pixels search left
        var maxdisp;
        if (leftPic.Width-i > 10){
            var maxdisp = Math.round((leftPic.Width - i)/10);
        }
        else maxdisp = 0;
        return maxdisp;
    }
    CalThreshold(pic){ //calculate maximum pixel difference
        return Math.round(pic.Width/50);
    }
    CompareDiff(rtn, diff, i, j){
        var value = rtn.DataRows[j][i].Gray;
        if (value <= diff) return 1;
        else return 0;
    }
	/*
    disparity(leftPic, rightPic, startpos, maxdisp){
        var rtn = new Picture(leftPic.Width, leftPic.Height);
        var diff;
        var threshlod = this.CalThreshold(leftPic);
        var i;
        var count;
        for (let j=0; j<leftPic.Height; j++){
            for (i=0; i<leftPic.Width; i++){
                for (count=0; count<maxdisp; count++){
                    diff = Math.abs(leftPic.DataRows[j][i].Gray - rightPic.DataRows[j][i-count].Gray);
                    maxdisp = this.Calmaxdisp(leftPic,i);
                    if(diff<threshlod){
                        var anothermatch = this.disparity(leftPic, rightPic, i, maxdisp);  //recursion
                        if(this.CompareDiff(anothermatch, diff, i,j)) break;
                    if(count=m)
                    }
                }
            }
            if(i==maxdisp) rtn.DataRows[j].push(new Pixel(255,255,255,0));
            else rtn.DataRows[j].push(new Pixel(count, 0, 0 ,255));  //diff+
        }
        return rtn;
    }
    */
    
    disparity(leftPic, rightPic, startpos, maxdisp){
        var rtn = new Picture(IMAGE_SETTINGS.OUTPUT_IMG_WIDTH, IMAGE_SETTINGS.OUTPUT_IMG_HEIGHT);
        var threshlod = this.CalThreshold(leftPic);  //maximum pixel difference
        var count;
        
        for (let j=0; j<IMAGE_SETTINGS.OUTPUT_IMG_HEIGHT;j++){
            for (let i=startpos; i<IMAGE_SETTINGS.OUTPUT_IMG_WIDTH;i++){ 
                //for each pixel
                var diff = threshlod;
                for(count=0; count<=maxdisp; count++){ 
                    if(i-count>0){
                        diff = Math.abs(leftPic.DataRows[j][i].Gray - rightPic.DataRows[j][i-count].Gray);
                    }
                    if(diff<threshlod) {
                        break;
                    }
                }
                if(count == threshlod){ //can't find corresponding point
                    rtn.DataRows[j].push(new Pixel(255,255,255,0));
                }
                //else if(count == 0) rtn.DataRows[j].push(new Pixel(255,255,255,0));  //blue
                else {
                    rtn.DataRows[j].push(new Pixel(count, 0, 0 ,255)); 
                }
            }
        }
        return rtn;
    }
    

    GetDisparityMap(searchlen, tolerance){
        var left = this.PreProcessing(this.LeftPic);   
        var right = this.PreProcessing(this.RightPic);
        var maxdisp = this.Calmaxdisp(left, 0);  
		var dispPic = this.disparity(left, right, 0, maxdisp);
        return dispPic;
        //return left;
    }
       

    GetDepthMap(searchlen, tolerance,focus,base){
        var disparity = this.GetDisparityMap(searchlen, tolerance);
        var DepthPic = new Picture(disparity.Width, disparity.Height);
        for (let i=0; i<disparity.Height; i++){
            for (let j=0; j<disparity.Width; j++){

                var a = disparity.DataRows[i][j].A;
                if (a == 0){ //not found
                    DepthPic.DataRows[i].push(new Pixel(255,255,255,255)); //white
                }
                else {
                    var temp1 = Math.round(255/(disparity.DataRows[i][j].R+1));
                    var temp = Math.round(temp1/2);
                    //DepthPic.DataRows[i].push(new Pixel(temp, temp, temp, 255));
                    
                    if (temp<25) DepthPic.DataRows[i].push(new Pixel(232, 36, 0, 255));
                    else if (temp<50) DepthPic.DataRows[i].push(new Pixel(222, 55, 0, 255));
                    else if (temp<100) DepthPic.DataRows[i].push(new Pixel(203, 94, 0, 255));
                    else if (temp<150) DepthPic.DataRows[i].push(new Pixel(194, 114, 0, 255));
                    else if (temp<200) DepthPic.DataRows[i].push(new Pixel(185, 134, 0, 255));
                    else if (temp<250) DepthPic.DataRows[i].push(new Pixel(175, 153, 0, 255));
                    else if (temp<300) DepthPic.DataRows[i].push(new Pixel(166, 173, 0, 255));
                    else if (temp<350) DepthPic.DataRows[i].push(new Pixel(156, 192, 0, 255));
                    else if (temp<400) DepthPic.DataRows[i].push(new Pixel(147, 212, 0, 255));
                    else if (temp<450) DepthPic.DataRows[i].push(new Pixel(128, 231, 0, 255));
                    else DepthPic.DataRows[i].push(new Pixel(147, 250, 0, 255));
                    /*
                    if(temp<200){
                        DepthPic.DataRows[i].push(new Pixel(temp, 0, 0, 255));
                    }
                    else if (temp <255){
                        DepthPic.DataRows[i].push(new Pixel(0, temp, 0, 255));
                    }
                    else {
                        DepthPic.DataRows[i].push(new Pixel(0, 0, temp, 255));
                    }
                    */
                    //DepthPic.DataRows[i].push(new Pixel(r, g, b, 255));
                }
            }
        }
        return DepthPic;
    }
}











        //Edge detection
        /*
        var EDPic = new Picture(picDown.Width, picDown.Height);
        for (let i=0; i<picDown.Height; i++){
            for (let j=0; j<picDown.Width; j++){

                 var edgeX = this.dotProduct(EDGE_DETECTION_X, BlurPic.PicGrayMatrix(i, j), 3) || 0;
                 var edgeY = this.dotProduct(EDGE_DETECTION_Y, BlurPic.PicGrayMatrix(i, j), 3) || 0;
                 var edge = edgeX*edgeX + edgeY*edgeY;

                 if(edge > EDGE_THRESHOLD){ //black
                    EDPic.DataRows[i][j].push(new Pixel(0,0,0,255));
                 }
                 else { //white
                    EDPic.DataRows[i][j].push(new Pixel(255, 255, 255, 255));
                 } 
            }
        }
        return EDPic; //Picture
        */
///////////////
        //Estimation
        //var estArray = new Array();
        /*
        var min = 260;
        var d = 0; //disparity estimation for whole image
        for (let count=0; count<tolerance; count++){   //move i pixel right each time
            var dispSum = 0;
            for (let i=0; i<(left.Width - count); i++){
                for (let j=0; j<left.Height; j++){
                    dispSum += Math.abs(left.DataRows[i+count][j].Gray - right.DataRows[i][j].Gray);
                }
            }
            var dispSumAve = Math.round(dispSum / ((left.Width - count) * left.Height));
            //estArray[count] = dispSumAve;
            if(dispSumAve < min){
                min = dispSumAve;
                d = count;
            }
        }
*/
