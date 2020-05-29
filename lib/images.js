export const IMAGE_SETTINGS = {
    "LEFT_IMG_WIDTH": 400.,
    "LEFT_IMG_HEIGHT": 300.,
    "RIGHT_IMG_WIDTH": 400.,
    "RIGHT_IMG_HEIGHT": 300.,
    "EDGE_THRESHOLD": 50000.,  //need to test
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
}
export class Pixel{
    constructor(r,g,b,a){
        this.R = r || 0.;
        this.G = g || 0.;
        this.B = b || 0.;
        this.A = a || 0.;
        this.Gray = 0.299 * this.R +  0.587 * this.G + 0.114 * this.B || 0.;
    }
    UpdateColor(r,g,b,a){
        this.R = r || 0.;
        this.G = g || 0.;
        this.B = b || 0.;
        this.A = a || 0.;
        this.Gray = 0.299 * this.R +  0.587 * this.G + 0.114 * this.B || 0.;
    }
}
export class Picture{
    constructor(width, height){
        this.Width = width;
        this.Height = height;
        this.DataRows = new Array(height);
        for (let i = 0; i < height; i++) {
            this.DataRows.push(new Array(width));
        }
    }
    LoadImgData(imgdata, sourcewidth, sourceheight){
        let len = sourcewidth * sourceheight;
        if(sourcewidth != this.Width || sourceheight != this.Height) return;
        let rc = 0, cc = 0;
        for (let i = 0; i < len; i+=4) {
            this.DataRows[rc][cc].push(new Pixel(imgdata[i],imgdata[i+1],imgdata[i+2],imgdata[i+3]));
            if(cc < width) cc++;
            else{cc -= width; rc++;}
        }
    }
    Getpixel(x,y){
        return this.DataRows[y][x];
    }
    ToImgData(){
        var rt = new Array();
        for (let i = 0; i < this.Height; i++) {
            for (let j = 0; j < this.Width; j++) {
                let gray = this.DataRows[i][j].Gray;
                rt.push(gray);
                rt.push(gray);
                rt.push(gray);
                rt.push(255);
            }
        }
        return rt;
    }
    PicGrayMatrix(i, j){
        var matrix = [[this.DataRows[i-1][j-1].Gray, this.DataRows[i-1][j].Gray0, this.DataRows[i-1][j+1].Gray],
                            [this.DataRows[i][j-1].Gray,  this.DataRows[i][j].Gray,  this.DataRows[i][j+1].Gray],
                            [this.DataRows[i+1][j-1].Gray, this.DataRows[i+1][j].Gray, this.DataRows[i+1][j+1].Gray]];
        return matrix;
        
    }
    /*
	GaussianBlur(){
		var BlurData = new Array();
		for (let i=0; i<this.Height; i++){
			for (let j=0; j<this.Width; j++){
				let Matrix = [[this.DataRows[i-1][j-1].Gray, this.DataRows[i-1][j].Gray0, this.DataRows[i-1][j+1].Gray],
                            [this.DataRows[i][j-1].Gray,  this.DataRows[i][j].Gray,  this.DataRows[i][j+1].Gray],
                            [this.DataRows[i+1][j-1].Gray, this.DataRows[i+1][j].Gray, this.DataRows[i+1][j+1].Gray]];
				let temp = Matrix.LMath.Vect2.prototype.Dot(KERNAL_GAUSSIAN3x3);
				BlurData.push(temp);
				BlurData.push(temp);
				BlurData.push(temp);
				BlurData.push(255);
			}
		}
		return BlurData;
	}
	EdgeDetection(){
		
	}*/
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

    dotProduct(mat1, mat2, dimension){
		var sum = 0;
		for (let i=0; i<dimension; i++){
			for (let j=0; j<dimension; j++){
				sum += mat1[i][j] * mat2[i][j];
			}
		}
		return sum;
	}



    PreProcessing(pic, searchlen){ 
        //Cut image
        var picDown = new Picture(100, 100);
        for (let m=0; m<100; m++){
            for (let n=0; n<100; n++){
                picDown.DataRows[m][n].push(pic.DataRows[Math.round(pic.Height/100)][Math.round(pic.Width/100)]);
            }
        }
        //Gaussian blur
        var BlurPic = new Picture(picDown.Width, picDown.Height);
        for (let i=0; i<picDown.Height; i++){
            for (let j=0; j<picDown.Width; j++){
                var blur = dotProduct(KERNAL_GAUSSIAN3x3, picDown.PicGrayMatrix(i, j), 3) || picDown.DataRows[i][j];
                BlurPic.DataRows[i][j].push(new Pixel(blur, blur, blur, 255));
            }
        }
        //Edge detection
        /*
        var EDPic = new Picture(picDown.Width, picDown.Height);
        for (let i=0; i<picDown.Height; i++){
            for (let j=0; j<picDown.Width; j++){

                 var edgeX = dotProduct(EDGE_DETECTION_X, BlurPic.PicGrayMatrix(i, j), 3) || 0;
                 var edgeY = dotProduct(EDGE_DETECTION_Y, BlurPic.PicGrayMatrix(i, j), 3) || 0;
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
        return BlurPic;
    }
	
    GetDisparityMap(searchlen, tolerance){
        var left = this.PreProcessing(this.LeftPic, searchlen);   
        var right = this.PreProcessing(this.rightPic, searchlen);

		

        //Estimation
        var estArray = new Array(tolerance);
        for (let count=0; count<tolerance; count++){   //move i pixel right each time
            var dispSum = 0;
            for (let i=0; i<(left.Width - count); i++){
                for (let j=0; j<left.Height; j++){
                    dispSum += Math.abs(left.DataRows[i+count][j].Gray - right.DataRows[i][j].Gray);

                }
            }
            var dispSumAve = Math.round(dispSum / ((left.Width - count) * left.Height));
            estArray[count] = dispSumAve;
        }

        var min = 260;
        var d = 0; //disparity estimation for whole image
        for (let k=0; k<tolerance; k++){
            if(estArray[k] < min){
                min = estArray[k];
                d = k;
            }
        } 

        //Calculate disparity value for each pixel in 100x100 image
        var DispPic = new Picture(left.Width, left.Height);
        for(let i=0; i<(left.Width); i++){
            for (let j=0; j<left.Height; j++){
                //pixel
                var coeff = 1.4;
                var sign = 1;
                var min = 256;
                var PixDisp = d;
                for (let count=0; count<9 count++){
                    var temp = coeff * Math.abs(left.DataRows[(i+d-4 || 0)][j].Gray - right.DataRows[(i-4 || 0)][j].Gray);
                    if(temp < min){
                        min = temp;
                        PixDisp = count;
                    }
                    if(coeff == 1.0) coeff = -1;
                    coeff = coeff - sign * 0.1;
                }
                if (PixDisp > 125){ //cannot find corresponding point
                    DispPic.DataRows[i][j].push(new Pixel(0, 0, 0, 0));
                }
                else {
                    DispPic.DataRows[i][j].push(new Pixel(Math.round(PixDisp*255/9), 0, 0, 255));
                }
                
            }
            return DispPic;
        }
       

    GetDepthMap(searchlen, tolerance,focus,base){
        var disparity = this.GetDisparityMap(searchlen, tolerance); //Picture
        var DepthPic = new Picture(disparity.Width, disparity.Height);
        for (let i=0; i<disparity.Width; i++){
            for (let j=0; j<disparity.Height; j++){
                //var relative_depth = Math.round((base*focus)/disparity.DataRows[i][j].R);
                DepthPic[i][j].push(new Pixel(Math.round(255/disparity.DataRows[i][j].R)||0, 0, 0, disparity.DataRows.A));
            }
        }
        //perform triangulation
        return DepthPic;
    }
}


