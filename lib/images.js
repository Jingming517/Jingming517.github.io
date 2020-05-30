export const IMAGE_SETTINGS = {
    "LEFT_IMG_WIDTH": 400.,
    "LEFT_IMG_HEIGHT": 300.,
    "RIGHT_IMG_WIDTH": 400.,
    "RIGHT_IMG_HEIGHT": 300.,
    "OUTPUT_IMG_WIDTH": 100.,
    "OUTPUT_IMG_HEIGHT": 100.,
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
        this.DataRows = new Array();
        for (let i = 0; i < height; i++) {
            this.DataRows.push(new Array());
        }
    }
    /*
    initialise(){
        for(let i=0; i<this.Height; i++){

        }
    }
    */
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
                let gray = this.DataRows[i][j].Gray;
                rt.push(gray);
                rt.push(gray);
                rt.push(gray);
                rt.push(255);
            }
        }
        //return new ImageData(rt, this.Width, this.Height);
        return new ImageData(new Uint8ClampedArray(rt), this.Width, this.Height);
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
        var picDown = new Picture(IMAGE_SETTINGS.OUTPUT_IMG_HEIGHT, IMAGE_SETTINGS.OUTPUT_IMG_WIDTH);
        for (let m=0; m<IMAGE_SETTINGS.OUTPUT_IMG_HEIGHT; m++){
            for (let n=0; n<IMAGE_SETTINGS.OUTPUT_IMG_WIDTH; n++){
                picDown.DataRows[m][n] = pic.DataRows[m*Math.floor((pic.Height-1)/100)][n*Math.floor((pic.Width-1)/100)];
            }
        }
        //Gaussian blur
        var BlurPic = new Picture(picDown.Width, picDown.Height);
        for (let i=0; i<picDown.Height; i++){
            for (let j=0; j<picDown.Width; j++){
                if(i==0||i==picDown.Width-1||j==0||j==picDown.Width-1){
                    var edgeBlur = picDown.DataRows[i][j].Gray;
                    BlurPic.DataRows[j].push(new Pixel(edgeBlur, edgeBlur, edgeBlur, 255));
                }
                else{
                    var blur = this.dotProduct(IMAGE_SETTINGS.KERNAL_GAUSSIAN3x3, picDown.PicGrayMatrix(i, j), 3) || picDown.DataRows[i][j];
                    BlurPic.DataRows[i].push(new Pixel(blur, blur, blur, 255));
                }
            }
        }

        return BlurPic;
    }
    Calmaxdisp(leftPic, i){
        var maxdisp;
        if (leftPic.Width-i >= 120){
            var maxdisp = Math.round(leftPic.Width - i)/120
        }
        else maxdisp = 0;
        return maxdisp;
    }
    CalThreshold(pic){
        return Math.round(pic.Width/20);
    }
    CompareDiff(rtn, diff, i, j){
        var value = rtn.DataRows[j][i].Gray;
        if (value <= diff) return 1;
        else return 0;
    }
	
    disparity(leftPic, rightPic, startpos, maxdisp){
        var rtn = new Picture(leftPic.Width, leftPic.Height);
        var diff;
        var threshlod = this.CalThreshold(leftPic);
        var i;
        for (let j=0; j<leftPic.Height; j++){
            for (i=startpos; i<maxdisp; i++){
                
                diff = Math.abs(leftPic.DataRows[j][i].Gray - rightPic.DataRows[j][i].Gray);
                var disp = this.Calmaxdisp(leftPic,i);
                if(diff<threshlod && disp>0){
                    var anothermatch = this.disparity(leftPic, rightPic, i, disp);
                    if(this.CompareDiff(anothermatch, diff, i,j)) break;
                }
            }
            if(i==maxdisp) rtn.DataRows[i].push(new Pixel(50,0,0,0));
            else rtn.DataRows[i].push(new Pixel(diff, 0, 0 ,255));
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
        var disparity = this.GetDisparityMap(searchlen, tolerance); //Picture
        var DepthPic = new Picture(disparity.Width, disparity.Height);
        for (let i=0; i<disparity.Width; i++){
            for (let j=0; j<disparity.Height; j++){
                var temp = Math.round(256/(disparity.DataRows[i][j]+1));

                DepthPic.DataRows[i].push(new Pixel(temp, 0, 0, 255));
            }
        }
        //perform triangulation
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
        */

