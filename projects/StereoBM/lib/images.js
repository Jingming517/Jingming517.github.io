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
                    //console.log("Input image is not balck white image");
                }
            }
        }
        return matrix;
    }
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
        this.LeftPic = picL; //check - correct data
        this.RightPic = picR;
        //LeftPic RightPic values correct
    }
    LoadImagesFromCanvas(leftC, rightC){
        var cxtL = leftC.getContext("2d");
        var cxtR = rightC.getContext("2d");
        var dataL = cxtL.getImageData(0,0,leftC.width,leftC.height);  //correct data
        var dataR = cxtR.getImageData(0,0,rightC.width,rightC.height);  //correct data

        this.LoadImagesFromImgData(dataL,leftC.width,leftC.height,dataR,rightC.width,rightC.height);
    }
    SetKernal(kernal){
        this.Kernal = kernal || this.Kernal;
    }

    dotProduct(mat1, mat2, dimension){
		var sum = 0;
		for (let i=0; i<dimension; i++){
			for (let j=0; j<dimension; j++){
				sum += mat1[i][j] * mat2[i][j];
			}
		}
		return sum;
    }
    xor(mat1, mat2, dimension) {
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
    BlackWhite(pic) {
        var sum = 0;
        var average;
        for (let i=0; i<pic.Height; i++){
            for (let j=0; j<pic.Width; j++){
                sum += pic.DataRows[i][j].Gray;
            }
        }
        average = Math.round(sum / (pic.Height * pic.Width));
        var BitPic = new Picture(pic.Width, pic.Height);
        for (let i=0; i<pic.Height; i++){
            for (let j=0; j<pic.Width; j++){
                if(pic.DataRows[i][j] > average){
                    BlurPic.DataRows[i].push(new Pixel(255, 255, 255, 255));
                }
                else {
                    BlurPic.DataRows[i].push(new Pixel(0, 0, 0, 255));
                }
            }
        }
        return BitPic;
    }
    GaussianBlur(pic) {
        var BlurPic = new Picture(pic.Width, pic.Height);
        for (let i=0; i<pic.Height; i++){
            for (let j=0; j<pic.Width; j++){
                if(i==0||i==pic.Width-1||j==0||j==pic.Width-1){
                    var edgeBlur = pic.DataRows[i][j].Gray;
                    BlurPic.DataRows[i].push(new Pixel(edgeBlur, edgeBlur, edgeBlur, 255));
                }
                else{
                    var blur = this.dotProduct(IMAGE_SETTINGS.KERNAL_GAUSSIAN3x3, pic.PicGrayMatrix(i, j), 3); 
                    BlurPic.DataRows[i].push(new Pixel(blur, blur, blur, 255));
                }
            }
        }
        return BlurPic;
    }
    Dilation(pic) {
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
                    var dila = this.xor(IMAGE_SETTINGS.KERNAL_GAUSSIAN3x3, pic.binaryImg(i, j), 3); 
                    picDila.DataRows[i].push(new Pixel(dila, dila, dila, 255));
                }
            }
        }
        return picDila;
    }
    PreProcessing(pic, searchlen){ 
        //Cut image
        /*
        var picDown = new Picture(IMAGE_SETTINGS.OUTPUT_IMG_HEIGHT, IMAGE_SETTINGS.OUTPUT_IMG_WIDTH);
        for (let m=0; m<IMAGE_SETTINGS.OUTPUT_IMG_HEIGHT; m++){
            for (let n=0; n<IMAGE_SETTINGS.OUTPUT_IMG_WIDTH; n++){
                var row = Math.floor(m*(pic.Height-1)/IMAGE_SETTINGS.OUTPUT_IMG_HEIGHT) || (pic.Height-1); //
                var col = Math.floor(n*(pic.Width-1)/IMAGE_SETTINGS.OUTPUT_IMG_WIDTH) || (pic.Width-1);
                picDown.DataRows[m][n] = pic.DataRows[row][col];
            }
        }
        */

        var BlurPic = new Picture(pic.Width, pic.Height);
        BlurPic = this.GaussianBlur(pic);
        var BWPic = new Picture(pic.Width, pic.Height);
        BWPic = this.BlackWhite(BlurPic);
        var DilaPic = new Picture(pic.Width, pic.Height);
        DilaPic = this.Dilation(BlurPic);
        return DilaPic;
    }
    Calmaxdisp(leftPic, i){  //maximum number of pixels search left
        var maxdisp;
        if (leftPic.Width-i > 50){
            var maxdisp = Math.round((leftPic.Width - i)/50);
        }
        else maxdisp = 0;
        return maxdisp;
    }
    CalThreshold(pic){ //calculate maximum pixel difference
        return Math.round(pic.Width/100);
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
        var left = this.PreProcessing(this.LeftPic, searchlen);   
        var right = this.PreProcessing(this.RightPic, searchlen);
        var maxdisp = this.Calmaxdisp(left, 0);  
		var dispPic = this.disparity(left, right, 0, maxdisp);
        return dispPic;
        
    }
       

    GetDepthMap(searchlen, tolerance,focus,base){
        var disparity = this.GetDisparityMap(searchlen, tolerance);
        var DepthPic = new Picture(disparity.Width, disparity.Height);
        for (let i=0; i<disparity.Height; i++){
            for (let j=0; j<disparity.Width; j++){

                var a = disparity.DataRows[i][j].A;
                if (a == 0){ //not found
                    DepthPic.DataRows[i].push(new Pixel(0,0,0,255));
                }
                else {
                    var temp = Math.round(255/(disparity.DataRows[i][j].R+1));
                    //DepthPic.DataRows[i].push(new Pixel(r, g, b, 255));
                    DepthPic.DataRows[i].push(new Pixel(temp, temp, temp, 255));
                }
                
            }
        }
        return DepthPic;
    }
}


//








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


        var DispPic = new Picture(left.Width, left.Height);
        for(let i=0; i<(left.Width); i++){
            for (let j=0; j<left.Height; j++){
                //pixel
                var coeff = 1.4;
                var sign = 1;
                var min = 256;
                var PixDisp = d;
                for (let count=0; count<9; count++){
                    if(i-4<0||i+d-4>=left.Width){
                        PixDisp = 255;
                    }
                    else {
                        var temp = coeff * Math.abs(left.DataRows[(i+d-4)][j].Gray - right.DataRows[(i-4)][j].Gray);
                        if(temp < min){
                            min = temp;
                            PixDisp = count;
                        }
                        if(coeff == 1.0) sign = -1;
                        coeff = coeff - sign * 0.1;
                    }
                    
                }
                if (PixDisp > 100){ //cannot find corresponding point
                    DispPic.DataRows[i].push(new Pixel(0, 0, 0, 0));
                }
                else {
                    DispPic.DataRows[i].push(new Pixel(Math.round(PixDisp*255/100), 0, 0, 255));
                }                
            }
        }
        return DispPic;


