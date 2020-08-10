// LMath.js by TomLBZ for vector and matrix calculations
var LMath = window.LMath || {};//namespace
LMath.extend = function(Child, Parent){//inheritence
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.uber = Parent.prototype;
};
LMath.Constants = {//enums
	"DEBUG": 1,
	"SUCCESS": 0,
	"ERROR": -1,
	"SUBMAT3_TL": 10,//use topleft = remove col 4 and row 4 
	"SUBMAT3_BL": 11,//use btmleft = remove col 4 and row 1
	"SUBMAT3_TR": 12,//use topright = remove col 1 and row 4
	"SUBMAT3_BR": 13,//use btmright = remove col 1 and row 1
	"SUBMAT3R_C1R2": 14,//remove col 1 and row 2 for det
	"SUBMAT3R_C1R3": 15,//remove col 1 and row 3 for det
	"SUBMAT3R_C2R1": 16,//remove col 2 and row 1 for det
	"SUBMAT3R_C3R1": 17,//remove col 3 and row 1 for det
	"DROP_X": 20,
	"DROP_Y": 21,
	"DROP_Z": 22,
	"DROP_W":23,
};
LMath.Methods = function(){};
(function(){
	LMath.Methods.DegToRad = function(degrees){
		return degrees / 180.0 * Math.PI;
	};
	LMath.Methods.RadToDeg = function(radians){
		return radians / Math.PI * 180.0;
	};
})();
LMath.Vect2 = function(x,y){//properties
	x = x || 0;
	y = y || 0;
	this.X = x || 0;
	this.Y = y || 0;
};
(function(){//member methods
	LMath.Vect2.UnitX = function(){
		return new LMath.Vect2(1,0);
	};
	LMath.Vect2.UnitY = function(){
		return new LMath.Vect2(0,1);
	};
	LMath.Vect2.prototype.Add = function(v2){
		return new LMath.Vect2(v2.X + this.X, v2.Y + this.Y);
	};
	LMath.Vect2.prototype.Subtract = function(v2){
		return new LMath.Vect2(this.X - v2.X, this.Y - v2.Y);
	};
	LMath.Vect2.prototype.Dot = function(v2){
		return this.X * v2.X + this.Y * v2.Y;
	};
	LMath.Vect2.prototype.Cross = function(v2){
		return this.X * v2.Y - this.Y * v2.X;
	};
	LMath.Vect2.prototype.AngleBetween = function(v2){
		var len1 = this.Length(), len2 = v2.Length();
		if(len1 && len2){
			return Math.acos(this.Dot(v2)/(len1 * len2));	
		}else{
			return Math.PI;
		}
	};
	LMath.Vect2.prototype.Scale = function(s){
		return new LMath.Vect2(this.X * s, this.Y * s);
	};
	LMath.Vect2.prototype.ChangeAtIndex = function(i, val){
		i = i || 0;
		val = val || 0;
		if(i == 0){this.X = val;}else{this.Y = val;}
	};
	LMath.Vect2.prototype.GetAtIndex = function(i){
		i = i || 0;
		return i == 0 ? this.X : this.Y;
	};
	LMath.Vect2.prototype.Rotate = function(angle){
		var x = this.X, y = this.Y, s = Math.sin(angle), c = Math.cos(angle);
		return new LMath.Vect2(x * c - y * s, x * s + y * c);
	};
	LMath.Vect2.prototype.Negate = function(){
		return new LMath.Vect2(-this.X, -this.Y);
	};
	LMath.Vect2.prototype.Length = function(){
		return Math.sqrt(this.SquareLength());
	};
	LMath.Vect2.prototype.SquareLength = function(){
		return this.X * this.X + this.Y * this.Y;
	};
	LMath.Vect2.prototype.Normalize = function(){
		var len = this.Length();
		if(len){
			return this.Scale(1.0/len);
		}else{
			return this;
		}
	};
	LMath.Vect2.prototype.GoLeft = function(d){
		return new LMath.Vect2(this.X - d, this.Y);
	};
	LMath.Vect2.prototype.GoRight = function(d){
		return new LMath.Vect2(this.X + d, this.Y);
	};
	LMath.Vect2.prototype.GoUp = function(d){
		return new LMath.Vect2(this.X, this.Y + d);
	};
	LMath.Vect2.prototype.GoDown = function(d){
		return new LMath.Vect2(this.X, this.Y - d);
	};
	LMath.Vect2.prototype.GoDiagTL = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect2(this.X - step, this.Y + step);
	};
	LMath.Vect2.prototype.GoDiagBL = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect2(this.X - step, this.Y - step);
	};
	LMath.Vect2.prototype.GoDiagTR = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect2(this.X + step, this.Y + step);
	};
	LMath.Vect2.prototype.GoDiagBR = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect2(this.X + step, this.Y - step);
	};
	LMath.Vect2.prototype.ToPoint2D = function(){
		return new window.Geometry.Point2D(this.X, this.Y);
	};
	LMath.Vect2.prototype.ToString = function(){
		return "(" + this.X + ", " + this.Y + ")";
	};
	LMath.Vect2.prototype.Equals = function(v2){
		return (this.X == v2.X && this.Y == v2.Y);
	};
	LMath.Vect2.prototype.Clone = function(){
		return new LMath.Vect2(this.X, this.Y);
	};
})();
LMath.Vect3 = function(x,y,z){//properties
	x = x || 0;
	y = y || 0;
	z = z || 0;
	this.X = x || 0;
	this.Y = y || 0;
	this.Z = z || 0;
};
(function(){//member methods
	LMath.Vect3.UnitX = function(){
		return new LMath.Vect3(1,0,0);
	};
	LMath.Vect3.UnitY = function(){
		return new LMath.Vect3(0,1,0);
	};
	LMath.Vect3.UnitZ = function(){
		return new LMath.Vect3(0,0,1);
	};
	LMath.Vect3.prototype.Add = function(v3){
		return new LMath.Vect3(v3.X + this.X, v3.Y + this.Y, v3.Z + this.Z);
	};
	LMath.Vect3.prototype.Subtract = function(v3){
		return new LMath.Vect3(this.X - v3.X, this.Y - v3.Y, this.Z - v3.Z);
	};
	LMath.Vect3.prototype.Dot = function(v3){
		return this.X * v3.X + this.Y * v3.Y + this.Z * v3.Z;
	};
	LMath.Vect3.prototype.Cross = function(v3){
		var newx = this.Y * v3.Z - this.Z * v3.Y;
		var newy = this.Z * v3.X - this.X * v3.Z;
		var newz = this.X * v3.Y - this.Y * v3.X;
		return new LMath.Vect3(newx, newy, newz);
	};
	LMath.Vect3.prototype.AngleBetween = function(v3){
		var len1 = this.Length(), len2 = v3.Length();
		if(len1 && len2){
			return Math.acos(this.Dot(v3).Length()/(len1 * len2));	
		}else{
			return Math.PI;
		}
	};
	LMath.Vect3.prototype.Scale = function(s){
		return new LMath.Vect3(this.X * s, this.Y * s, this.Z * s);
	};
	LMath.Vect3.prototype.ChangeAtIndex = function(i, val){
		i = i || 0;
		val = val || 0;
		switch(i){
			case 1:
				this.Y = val;
				break;
			case 2:
				this.Z = val;
				break;
			default://0
				this.X = val;
				break;
		}
	};
	LMath.Vect3.prototype.GetAtIndex = function(i){
		i = i || 0;
		switch(i){
			case 1: return this.Y;
			case 2: return this.Z;
			default: return this.X;//0
		}
	};
	LMath.Vect3.prototype.Rotate = function(mat3){
		var rows = mat3.Rows || [];
		return new LMath.Vect3(this.Dot(rows[0]), this.Dot(rows[1]), this.Dot(rows[2]));
	};
	LMath.Vect3.prototype.Negate = function(){
		return new LMath.Vect3(-this.X, -this.Y, -this.Z);
	};
	LMath.Vect3.prototype.ForcePositive = function(){
		return new LMath.Vect3(Math.abs(this.X), Math.abs(this.Y), Math.abs(this.Z));
	};
	LMath.Vect3.prototype.TrimPositive = function(){
		return new LMath.Vect3(Math.min(this.X, 0.0), Math.min(this.Y, 0.0), Math.min(this.Z, 0.0));
	};
	LMath.Vect3.prototype.TrimNegative = function(){
		return new LMath.Vect3(Math.max(this.X, 0.0), Math.max(this.Y, 0.0), Math.max(this.Z, 0.0));
	};
	LMath.Vect3.prototype.MaxComponent = function(){
		return Math.max(this.X, Math.max(this.Y, this.Z));
	}
	LMath.Vect3.prototype.Length = function(){
		return Math.sqrt(this.SquareLength());
	};
	LMath.Vect3.prototype.SquareLength = function(){
		return this.Dot(this);
	};
	LMath.Vect3.prototype.Normalize = function(){
		var len = this.Length();
		if(len){
			return this.Scale(1.0/len);
		}else{
			return this;
		}
	};
	LMath.Vect3.prototype.GoX = function(d){
		return new LMath.Vect3(this.X + d, this.Y, this.Z);
	};
	LMath.Vect3.prototype.GoY = function(d){
		return new LMath.Vect3(this.X, this.Y + d, this.Z);
	};
	LMath.Vect3.prototype.GoZ = function(d){
		return new LMath.Vect3(this.X, this.Y, this.Z + d);
	};
	LMath.Vect3.prototype.GoXYpos = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect3(this.X + step, this.Y + step, this.Z);
	};
	LMath.Vect3.prototype.GoXYneg = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect3(this.X + step, this.Y - step, this.Z);
	};
	LMath.Vect3.prototype.GoXZpos = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect3(this.X + step, this.Y, this.Z + step);
	};
	LMath.Vect3.prototype.GoXZneg = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect3(this.X + step, this.Y, this.Z - step);
	};
	LMath.Vect3.prototype.GoYZpos = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect3(this.X, this.Y + step, this.Z + step);
	};
	LMath.Vect3.prototype.GoYZneg = function(d){
		var step = Math.SQRT1_2 * d;
		return new LMath.Vect3(this.X, this.Y + step, this.Z - step);
	};
	LMath.Vect3.prototype.GoXYZq1 = function(d){
		var step = Math.sqrt(1.0 / 3.0) * d;
		return new LMath.Vect3(this.X + step, this.Y + step, this.Z + step);
	};
	LMath.Vect3.prototype.GoXYZq2 = function(d){
		var step = Math.sqrt(1.0 / 3.0) * d;
		return new LMath.Vect3(this.X - step, this.Y + step, this.Z + step);
	};
	LMath.Vect3.prototype.GoXYZq3 = function(d){
		var step = Math.sqrt(1.0 / 3.0) * d;
		return new LMath.Vect3(this.X - step, this.Y - step, this.Z + step);
	};
	LMath.Vect3.prototype.GoXYZq4 = function(d){
		var step = Math.sqrt(1.0 / 3.0) * d;
		return new LMath.Vect3(this.X + step, this.Y - step, this.Z + step);
	};
	LMath.Vect3.prototype.ToPoint3D = function(){
		return new window.Geometry.Point3D(this.X, this.Y, this.Z);
	};
	LMath.Vect3.prototype.ToString = function(){
		return "(" + this.X + ", " + this.Y + ", " + this.Z + ")";
	};
	LMath.Vect3.prototype.Equals = function(v3){
		return (this.X == v3.X && this.Y == v3.Y && this.Z == v3.Z);
	};
	LMath.Vect3.prototype.Clone = function(){
		return new LMath.Vect3(this.X, this.Y, this.Z);
	};
})();
LMath.Vect4 = function(x,y,z,w){//properties
	x = x || 0;
	y = y || 0;
	z = z || 0;
	w = w || 0;
	this.X = x || 0;
	this.Y = y || 0;
	this.Z = z || 0;
	this.W = w || 0;
};
(function(){//member methods
	LMath.Vect4.UnitX = function(){
		return new LMath.Vect4(1,0,0,0);
	};
	LMath.Vect4.UnitY = function(){
		return new LMath.Vect4(0,1,0,0);
	};
	LMath.Vect4.UnitZ = function(){
		return new LMath.Vect4(0,0,1,0);
	};
	LMath.Vect4.UnitW = function(){
		return new LMath.Vect4(0,0,0,1);
	};
	LMath.Vect4.FromVect3 = function(v3, appendvalue){
		return new LMath.Vect4(v3.X, v3.Y, v3.Z, appendvalue);
	};
	LMath.Vect4.prototype.Add = function(v4){
		return new LMath.Vect4(v4.X + this.X, v4.Y + this.Y, v4.Z + this.Z, v4.W + this.W);
	};
	LMath.Vect4.prototype.Subtract = function(v4){
		return new LMath.Vect4(this.X - v4.X, this.Y - v4.Y, this.Z - v4.Z, this.W - v4.W);
	};
	LMath.Vect4.prototype.Dot = function(v4){
		return this.X * v4.X + this.Y * v4.Y + this.Z * v4.Z + this.W * v4.W;
	};
	LMath.Vect4.prototype.TernaryCross = function(v41, v42){
		var x1 = this.X, x2 = this.Y, x3 = this.Z, x4 = this.W;
		var y1 = v41.X, y2 = v41.Y, y3 = v41.Z, y4 = v41.W;
		var z1 = v42.X, z2 = v42.Y, z3 = v42.Z, z4 = v42.W;
		var Mi = new LMath.Mat3(x2, y2, z2, x3, y3, z3, x4, y4, z4);
		var Mj = new LMath.Mat3(x1, y1, z1, x3, y3, z3, x4, y4, z4);
		var Mk = new LMath.Mat3(x1, y1, z1, x2, y2, z2, x4, y4, z4);
		var Ml = new LMath.Mat3(x1, y1, z1, x2, y2, z2, x3, y3, z3);
		return new LMath.Vect4(Mi.Determinant(), -Mj.Determinant(), Mk.Determinant(), -Ml.Determinant());
	};
	LMath.Vect4.prototype.AngleBetween = function(v4){
		var len1 = this.Length(), len2 = v4.Length();
		if(len1 && len2){
			return Math.acos(this.Dot(v4).Length()/(len1 * len2));	
		}else{
			return Math.PI;
		}
	};
	LMath.Vect4.prototype.Scale = function(s){
		return new LMath.Vect4(this.X * s, this.Y * s, this.Z * s, this.W * s);
	};
	LMath.Vect4.prototype.ChangeAtIndex = function(i, val){
		i = i || 0;
		val = val || 0;
		switch(i){
			case 1:
				this.Y = val;
				break;
			case 2:
				this.Z = val;
				break;
			case 3:
				this.W = val;
				break;
			default://0
				this.X = val;
				break;
		}
	};
	LMath.Vect4.prototype.GetAtIndex = function(i){
		i = i || 0;
		switch(i){
			case 1: return this.Y;
			case 2: return this.Z;
			case 3: return this.W;
			default: return this.X;//0
		}
	};
	LMath.Vect4.prototype.Transform = function(mat4){
		var rows = mat4.Rows || [];
		return new LMath.Vect4(this.Dot(rows[0]), this.Dot(rows[1]), this.Dot(rows[2]), this.Dot(rows[3]));
	};
	LMath.Vect4.prototype.Negate = function(){
		return new LMath.Vect4(-this.X, -this.Y, -this.Z, -this.W);
	};
	LMath.Vect4.prototype.ForcePositive = function(){
		return new LMath.Vect4(Math.abs(this.X), Math.abs(this.Y), Math.abs(this.Z), Math.abs(this.W));
	};
	LMath.Vect4.prototype.TrimPositive = function(){
		return new LMath.Vect4(Math.min(this.X, 0.0), Math.min(this.Y, 0.0), Math.min(this.Z, 0.0), Math.min(this.W, 0.0));
	};
	LMath.Vect4.prototype.TrimNegative = function(){
		return new LMath.Vect4(Math.max(this.X, 0.0), Math.max(this.Y, 0.0), Math.max(this.Z, 0.0), Math.max(this.W, 0.0));
	};
	LMath.Vect4.prototype.MaxComponent = function(){
		return Math.max(Math.max(this.X, this.Y), Math.max(this.Z, this.W));
	}
	LMath.Vect4.prototype.Length = function(){
		return Math.sqrt(this.SquareLength());
	};
	LMath.Vect4.prototype.SquareLength = function(){
		return this.Dot(this);
	};
	LMath.Vect4.prototype.Normalize = function(){
		var len = this.Length();
		if(len){
			return this.Scale(1.0/len);
		}else{
			return this;
		}
	};
	LMath.Vect4.prototype.GoX = function(d){
		return new LMath.Vect4(this.X + d, this.Y, this.Z, this.W);
	};
	LMath.Vect4.prototype.GoY = function(d){
		return new LMath.Vect4(this.X, this.Y + d, this.Z, this.W);
	};
	LMath.Vect4.prototype.GoZ = function(d){
		return new LMath.Vect4(this.X, this.Y, this.Z + d, this.W);
	};
	LMath.Vect4.prototype.GoW = function(d){
		return new LMath.Vect4(this.X, this.Y, this.Z, this.W + d);
	};
	LMath.Vect4.prototype.ToVect3 = function(DROP_OPTN){
		DROP_OPTN = DROP_OPTN || LMath.Constants.DROP_W;
		switch(DROP_OPTN){
			case LMath.Constants.DROP_X:
				return new LMath.Vect3(this.Y, this.Z, this.W);
			case LMath.Constants.DROP_Y:
				return new LMath.Vect3(this.X, this.Z, this.W);
			case LMath.Constants.DROP_Z:
				return new LMath.Vect3(this.X, this.Y, this.W);
			default: //LMath.Constants.DROP_W
				return new LMath.Vect3(this.X, this.Y, this.Z);
		}
	};
	LMath.Vect4.prototype.ToPoint4D = function(){
		return new window.Geometry.Point4D(this.X, this.Y, this.Z, this.W);
	};
	LMath.Vect4.prototype.ToString = function(){
		return "(" + this.X + ", " + this.Y + ", " + this.Z + ", " + this.W + ")";
	};
	LMath.Vect4.prototype.Equals = function(v4){
		return (this.X == v4.X && this.Y == v4.Y && this.Z == v4.Z && this.W == v4.W);
	};
	LMath.Vect4.prototype.Clone = function(){
		return new LMath.Vect4(this.X, this.Y, this.Z, this.W);
	};
})();
LMath.Mat3 = function(a11,a12,a13,a21,a22,a23,a31,a32,a33){//properties
	a11 = a11 || 0;
	a12 = a12 || 0;
	a13 = a13 || 0;
	a21 = a21 || 0;
	a22 = a22 || 0;
	a23 = a23 || 0;
	a31 = a31 || 0;
	a32 = a32 || 0;
	a33 = a33 || 0;
	var rows = new Array();
	rows.push(new LMath.Vect3(a11,a12,a13));
	rows.push(new LMath.Vect3(a21,a22,a23));
	rows.push(new LMath.Vect3(a31,a32,a33));
	var cols = new Array();
	cols.push(new LMath.Vect3(a11,a21,a31));
	cols.push(new LMath.Vect3(a12,a22,a32));
	cols.push(new LMath.Vect3(a13,a23,a33));
	this.Rows = rows || [];
	this.Cols = cols || [];
	this.Elements = [a11,a12,a13,a21,a22,a23,a31,a21,a33] || [];
};
(function(){//member methods
	LMath.Mat3.FromRows = function(rows){
		return new LMath.Mat3(rows[0].X, rows[0].Y, rows[0].Z, rows[1].X, rows[1].Y, rows[1].Z, rows[2].X, rows[2].Y, rows[2].Z);
	};
	LMath.Mat3.FromCols = function(cols){
		return new LMath.Mat3(cols[0].X, cols[1].X, cols[2].X, cols[0].Y, cols[1].Y, cols[2].Y, cols[0].Z, cols[1].Z, cols[2].Z);
	};
	LMath.Mat3.From2DArray = function(arr2d3x3){
		return new LMath.Mat3(arr2d3x3[0][0], arr2d3x3[0][1], arr2d3x3[0][2], arr2d3x3[1][0], arr2d3x3[1][1], arr2d3x3[1][2], arr2d3x3[2][0], arr2d3x3[2][1], arr2d3x3[2][2]);
	}
	LMath.Mat3.Identity = function(){
		return new LMath.Mat3(1,0,0,0,1,0,0,0,1);
	};
	LMath.Mat3.prototype.SetRowVect = function(index, v3){
		this.Cols[0].ChangeAtIndex(index, v3.X);
		this.Cols[1].ChangeAtIndex(index, v3.Y);
		this.Cols[2].ChangeAtIndex(index, v3.Z);
		this.Rows[index] = v3 || {};
		this.Elements[index * 3] = v3.X;
		this.Elements[index * 3 + 1] = v3.Y;
		this.Elements[index * 3 + 2] = v3.Z;		
	};
	LMath.Mat3.prototype.SetColVect = function(index, v3){
		this.Rows[0].ChangeAtIndex(index, v3.X);
		this.Rows[1].ChangeAtIndex(index, v3.Y);
		this.Rows[2].ChangeAtIndex(index, v3.Z);
		this.Cols[index] = v3 || {};
		this.Elements[index] = v3.X;
		this.Elements[index + 3] = v3.Y;
		this.Elements[index + 6] = v3.Z;
	};
	LMath.Mat3.prototype.ChangeElement = function(row, col, val){
		this.Rows[row].ChangeAtIndex(col, val);
		this.Cols[col].ChangeAtIndex(row, val);
		this.Elements[row * 3 + col] = val;
	};
	LMath.Mat3.prototype.Add = function(m3){
		var r1 = this.Rows[0].Add(m3.Rows[0]) || {};
		var r2 = this.Rows[1].Add(m3.Rows[1]) || {};
		var r3 = this.Rows[2].Add(m3.Rows[2]) || {};
		return LMath.Mat3.FromRows([r1, r2, r3]);
	};
	LMath.Mat3.prototype.Subtract = function(m3){
		var r1 = this.Rows[0].Subtract(m3.Rows[0]) || {};
		var r2 = this.Rows[1].Subtract(m3.Rows[1]) || {};
		var r3 = this.Rows[2].Subtract(m3.Rows[2]) || {};
		return LMath.Mat3.FromRows([r1, r2, r3]);
	};
	LMath.Mat3.prototype.MultV = function(v3){
		var x = this.Rows[0].Dot(v3) || 0;
		var y = this.Rows[1].Dot(v3) || 0;
		var z = this.Rows[2].Dot(v3) || 0;		
		return new LMath.Vect3(x, y, z);
	};
	LMath.Mat3.prototype.MultM = function(m3){
		var col1 = this.MultV(m3.Cols[0]) || {};
		var col2 = this.MultV(m3.Cols[1]) || {};
		var col3 = this.MultV(m3.Cols[2]) || {};
		return LMath.Mat3.FromCols([col1, col2, col3]);
	};
	LMath.Mat3.prototype.Scale = function(s){
		var r1 = this.Rows[0].Scale(s) || {};
		var r2 = this.Rows[1].Scale(s) || {};
		var r3 = this.Rows[2].Scale(s) || {};
		return LMath.Mat3.FromRows([r1, r2, r3]);
	};
	LMath.Mat3.prototype.Transpose = function(){
		var rows = this.Rows || [];
		return LMath.Mat3.FromCols(rows);
	};
	LMath.Mat3.prototype.Negate = function(){
		var r1 = this.Rows[0].Negate() || {};
		var r2 = this.Rows[1].Negate() || {};
		var r3 = this.Rows[2].Negate() || {};
		return LMath.Mat3.FromRows([r1, r2, r3]);
	};
	LMath.Mat3.prototype.Clone = function(){
		return LMath.Mat3.FromRows(this.Rows);
	};
	LMath.Mat3.prototype.Determinant = function(){
		var a11 = this.Rows[0].X, a12 = this.Rows[0].Y, a13 = this.Rows[0].Z || 0;
		var a21 = this.Rows[1].X, a22 = this.Rows[1].Y, a23 = this.Rows[1].Z || 0;
		var a31 = this.Rows[2].X, a32 = this.Rows[2].Y, a33 = this.Rows[2].Z || 0;
		var n1 = a11 * (a22 * a33 - a23 * a32);
		var n2 = a12 * (a21 * a33 - a23 * a31);
		var n3 = a13 * (a21 * a32 - a22 * a31);
		return n1 - n2 + n3;
	};
	LMath.Mat3.prototype.To2DArray = function(){
		var r1 = [this.Rows[0].X, this.Rows[0].Y, this.Rows[0].Z];
		var r2 = [this.Rows[1].X, this.Rows[1].Y, this.Rows[1].Z];
		var r3 = [this.Rows[2].X, this.Rows[2].Y, this.Rows[2].Z];
		return [r1, r2, r3];
	};
	LMath.Mat3.prototype.Inverse = function(){
		if(this.Determinant() == 0){
			return new LMath.Mat3(0,0,0,0,0,0,0,0,0);
		}else{
			var I = new LMath.Mat3.Identity().To2DArray();
			var rt = this.Clone().To2DArray();
			var i = 0, ii = 0, j = 0, dim = 3, e = 0;
			for(i = 0; i < dim; i++){
				e = rt[i][i];
				if(e == 0){
					for(ii = 0; ii < dim; ii++){
						if(rt[ii][i] != 0){
							for(j = 0; j < dim; j++){
								e = rt[i][j];
								rt[i][j] = rt[ii][j];
								rt[ii][j] = e;
								e = I[i][j];
								I[i][j] = I[ii][j];
								I[ii][j] = e;
							}
							break;
						}
					}
					e = rt[i][i];
					if(e == 0){return new LMath.Mat3();}
				}
				for(j = 0; j < dim; j++){
					rt[i][j] /= e;
					I[i][j] /= e;
				}
				for(ii = 0; ii < dim; ii++){
					if(ii == i){continue;}
					e = rt[ii][i];
					for(j = 0; j < dim; j++){
						rt[ii][j] -= e * rt[i][j];
						I[ii][j] -= e * I[i][j];
					}
				}
			}
			return LMath.Mat3.From2DArray(I);
		}
	};
	LMath.Mat3.prototype.RREF = function(){
		var rt = this.Clone().To2DArray();
		var i = 0, ii = 0, j = 0, dim = 3, e = 0;
		for(i = 0; i < dim; i++){
			e = rt[i][i];
			if(e == 0){
				for(ii = 0; ii < dim; ii++){
					if(rt[ii][i] != 0){
						for(j = 0; j < dim; j++){
							e = rt[i][j];
							rt[i][j] = rt[ii][j];
							rt[ii][j] = e;
						}
						break;
					}
				}
				e = rt[i][i];
				if(e == 0){continue;}
			}
			for(j = 0; j < dim; j++){
				rt[i][j] /= e;
			}
			for(ii = 0; ii < dim; ii++){
				if(ii == i){continue;}
				e = rt[ii][i];
				for(j = 0; j < dim; j++){
					rt[ii][j] -= e * rt[i][j];
				}
			}
		}
		return LMath.Mat3.From2DArray(rt);
	};
	LMath.Mat3.prototype.ToString = function(){
		var s1 = this.Rows[0].ToString();
		var s2 = this.Rows[1].ToString();
		var s3 = this.Rows[2].ToString();
		return "[" + s1 + "; " + s2 + "; " + s3 + "]";
	};
	LMath.Mat3.prototype.Equals = function(m3){
		var e1 = this.Rows[0].Equals(m3.Rows[0]);
		var e2 = this.Rows[1].Equals(m3.Rows[1]);
		var e3 = this.Rows[2].Equals(m3.Rows[2]);
		return (e1 && e2 && e3);
	};
})();
LMath.Mat4 = function(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44){//properties
	a11 = a11 || 0;
	a12 = a12 || 0;
	a13 = a13 || 0;
	a14 = a14 || 0;
	a21 = a21 || 0;
	a22 = a22 || 0;
	a23 = a23 || 0;
	a24 = a24 || 0;
	a31 = a31 || 0;
	a32 = a32 || 0;
	a33 = a33 || 0;
	a34 = a34 || 0;
	a41 = a41 || 0;
	a42 = a42 || 0;
	a43 = a43 || 0;
	a44 = a44 || 0;
	var rows = new Array();
	rows.push(new LMath.Vect4(a11,a12,a13,a14));
	rows.push(new LMath.Vect4(a21,a22,a23,a24));
	rows.push(new LMath.Vect4(a31,a32,a33,a34));
	rows.push(new LMath.Vect4(a41,a42,a43,a44));
	var cols = new Array();
	cols.push(new LMath.Vect4(a11,a21,a31,a41));
	cols.push(new LMath.Vect4(a12,a22,a32,a42));
	cols.push(new LMath.Vect4(a13,a23,a33,a43));
	cols.push(new LMath.Vect4(a14,a24,a34,a44));
	this.Rows = rows || [];
	this.Cols = cols || [];
	this.Elements = [a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44] || [];
};
(function(){//member methods
	LMath.Mat4.FromRows = function(rows){
		return new LMath.Mat4(rows[0].X, rows[0].Y, rows[0].Z, rows[0].W, rows[1].X, rows[1].Y, rows[1].Z, rows[1].W, rows[2].X, rows[2].Y, rows[2].Z, rows[2].W, rows[3].X, rows[3].Y, rows[3].Z, rows[3].W);
	};
	LMath.Mat4.FromCols = function(cols){
		return new LMath.Mat4(cols[0].X, cols[1].X, cols[2].X, cols[3].X, cols[0].Y, cols[1].Y, cols[2].Y, cols[3].Y, cols[0].Z, cols[1].Z, cols[2].Z, cols[3].Z, cols[0].W, cols[1].W, cols[2].W, cols[3].W);
	};
	LMath.Mat4.From2DArray = function(arr2d4x4){
		return new LMath.Mat4(arr2d4x4[0][0], arr2d4x4[0][1], arr2d4x4[0][2], arr2d4x4[0][3], arr2d4x4[1][0], arr2d4x4[1][1], arr2d4x4[1][2], arr2d4x4[1][3], arr2d4x4[2][0], arr2d4x4[2][1], arr2d4x4[2][2], arr2d4x4[2][3], arr2d4x4[3][0], arr2d4x4[3][1], arr2d4x4[3][2], arr2d4x4[3][3]);
	}
	LMath.Mat4.Identity = function(){
		return new LMath.Mat4(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
	};
	LMath.Mat4.TranslationMat4 = function(vtrans3){
		return new LMath.Mat4(1,0,0,-vtrans3.X,0,1,0,-vtrans3.Y,0,0,1,-vtrans3.Z,0,0,0,1);
	};
	LMath.Mat4.RotationMat4 = function(radvect3){
		var rx = new LMath.Mat4(1,0,0,0,0,Math.cos(radvect3.X),-Math.sin(radvect3.X),0,0,Math.sin(radvect3.X),Math.cos(radvect3.X),0,0,0,0,1);
		var ry = new LMath.Mat4(Math.cos(radvect3.Y),0,Math.sin(radvect3.Y),0,0,1,0,0,-Math.sin(radvect3.Y),0,Math.cos(radvect3.Y),0,0,0,0,1);
		var rz = new LMath.Mat4(Math.cos(radvect3.Z),-Math.sin(radvect3.Z),0,0,Math.sin(radvect3.Z),Math.cos(radvect3.Z),0,0,0,0,1,0,0,0,0,1);
		return rz.MultM(ry.MultM(rx));
	};
	LMath.Mat4.ScaleMat4 = function(v3){
		return new LMath.Mat4(v3.X,0,0,0,0,v3.Y,0,0,0,0,v3.Z,0,0,0,0,1);
	};
	LMath.Mat4.prototype.SetRowVect = function(index, v4){
		this.Cols[0].ChangeAtIndex(index, v4.X);
		this.Cols[1].ChangeAtIndex(index, v4.Y);
		this.Cols[2].ChangeAtIndex(index, v4.Z);
		this.Cols[3].ChangeAtIndex(index, v4.W);
		this.Rows[index] = v4 || {};
		this.Elements[index * 4] = v4.X;
		this.Elements[index * 4 + 1] = v4.Y;
		this.Elements[index * 4 + 2] = v4.Z;
		this.Elements[index * 4 + 3] = v4.W;
	};
	LMath.Mat4.prototype.SetColVect = function(index, v4){
		this.Rows[0].ChangeAtIndex(index, v4.X);
		this.Rows[1].ChangeAtIndex(index, v4.Y);
		this.Rows[2].ChangeAtIndex(index, v4.Z);
		this.Rows[3].ChangeAtIndex(index, v4.W);
		this.Cols[index] = v4 || {};
		this.Elements[index] = v4.X;
		this.Elements[index + 4] = v4.Y;
		this.Elements[index + 8] = v4.Z;
		this.Elements[index + 12] = v4.W;
	};
	LMath.Mat4.prototype.ChangeElement = function(row, col, val){
		this.Rows[row].ChangeAtIndex(col, val);
		this.Cols[col].ChangeAtIndex(row, val);
		this.Elements[row * 4 + col] = val;
	};
	LMath.Mat4.prototype.Add = function(m4){
		var r1 = this.Rows[0].Add(m4.Rows[0]) || {};
		var r2 = this.Rows[1].Add(m4.Rows[1]) || {};
		var r3 = this.Rows[2].Add(m4.Rows[2]) || {};
		var r4 = this.Rows[3].Add(m4.Rows[3]) || {};
		return LMath.Mat4.FromRows([r1, r2, r3, r4]);
	};
	LMath.Mat4.prototype.Subtract = function(m4){
		var r1 = this.Rows[0].Subtract(m4.Rows[0]) || {};
		var r2 = this.Rows[1].Subtract(m4.Rows[1]) || {};
		var r3 = this.Rows[2].Subtract(m4.Rows[2]) || {};
		var r4 = this.Rows[3].Subtract(m4.Rows[3]) || {};
		return LMath.Mat4.FromRows([r1, r2, r3, r4]);
	};
	LMath.Mat4.prototype.MultV = function(v4){
		var x = this.Rows[0].Dot(v4) || 0;
		var y = this.Rows[1].Dot(v4) || 0;
		var z = this.Rows[2].Dot(v4) || 0;
		var w = this.Rows[3].Dot(v4) || 0;
		return new LMath.Vect4(x, y, z, w);
	};
	LMath.Mat4.prototype.MultM = function(m4){
		var col1 = this.MultV(m4.Cols[0]) || {};
		var col2 = this.MultV(m4.Cols[1]) || {};
		var col3 = this.MultV(m4.Cols[2]) || {};
		var col4 = this.MultV(m4.Cols[3]) || {};
		return LMath.Mat4.FromCols([col1, col2, col3, col4]);
	};
	LMath.Mat4.prototype.Scale = function(s){
		var r1 = this.Rows[0].Scale(s) || {};
		var r2 = this.Rows[1].Scale(s) || {};
		var r3 = this.Rows[2].Scale(s) || {};
		var r4 = this.Rows[3].Scale(s) || {};
		return LMath.Mat4.FromRows([r1, r2, r3, r4]);
	};
	LMath.Mat4.prototype.Transpose = function(){
		var rows = this.Rows || [];
		return LMath.Mat4.FromCols(rows);
	};
	LMath.Mat4.prototype.Negate = function(){
		var r1 = this.Rows[0].Negate() || {};
		var r2 = this.Rows[1].Negate() || {};
		var r3 = this.Rows[2].Negate() || {};
		var r4 = this.Rows[3].Negate() || {};
		return LMath.Mat4.FromRows([r1, r2, r3, r4]);
	};
	LMath.Mat4.prototype.Clone = function(){
		return LMath.Mat4.FromRows(this.Rows);
	};
	LMath.Mat4.prototype.SubMat3x3 = function(SUBMAT_OPTN){
		SUBMAT_OPTN = SUBMAT_OPTN || LMath.Constants.SUBMAT3_TL;
		var r1, r2, r3;
		switch(SUBMAT_OPTN){
			case LMath.Constants.SUBMAT3_BL:
				r1 = this.Rows[1].ToVect3(LMath.Constants.DROP_W);
				r2 = this.Rows[2].ToVect3(LMath.Constants.DROP_W);
				r3 = this.Rows[3].ToVect3(LMath.Constants.DROP_W);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
			case LMath.Constants.SUBMAT3_TR:
				r1 = this.Rows[0].ToVect3(LMath.Constants.DROP_X);
				r2 = this.Rows[1].ToVect3(LMath.Constants.DROP_X);
				r3 = this.Rows[2].ToVect3(LMath.Constants.DROP_X);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
			case LMath.Constants.SUBMAT3_BR:
				r1 = this.Rows[1].ToVect3(LMath.Constants.DROP_X);
				r2 = this.Rows[2].ToVect3(LMath.Constants.DROP_X);
				r3 = this.Rows[3].ToVect3(LMath.Constants.DROP_X);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
			case LMath.Constants.SUBMAT3R_C1R2:
				r1 = this.Rows[0].ToVect3(LMath.Constants.DROP_X);
				r2 = this.Rows[2].ToVect3(LMath.Constants.DROP_X);
				r3 = this.Rows[3].ToVect3(LMath.Constants.DROP_X);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
			case LMath.Constants.SUBMAT3R_C1R3:
				r1 = this.Rows[0].ToVect3(LMath.Constants.DROP_X);
				r2 = this.Rows[1].ToVect3(LMath.Constants.DROP_X);
				r3 = this.Rows[3].ToVect3(LMath.Constants.DROP_X);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
			case LMath.Constants.SUBMAT3R_C2R1:
				r1 = this.Rows[1].ToVect3(LMath.Constants.DROP_Y);
				r2 = this.Rows[2].ToVect3(LMath.Constants.DROP_Y);
				r3 = this.Rows[3].ToVect3(LMath.Constants.DROP_Y);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
			case LMath.Constants.SUBMAT3R_C3R1:
				r1 = this.Rows[1].ToVect3(LMath.Constants.DROP_Z);
				r2 = this.Rows[2].ToVect3(LMath.Constants.DROP_Z);
				r3 = this.Rows[3].ToVect3(LMath.Constants.DROP_Z);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
			default:// LMath.Constants.SUBMAT3_TL
				r1 = this.Rows[0].ToVect3(LMath.Constants.DROP_W);
				r2 = this.Rows[1].ToVect3(LMath.Constants.DROP_W);
				r3 = this.Rows[2].ToVect3(LMath.Constants.DROP_W);
				return new LMath.Mat3.FromRows([r1, r2, r3]);
		}
	};
	LMath.Mat4.prototype.Determinant = function(){
		var d1 = this.SubMat3x3(LMath.Constants.SUBMAT3_BR).Determinant();
		var d2 = this.SubMat3x3(LMath.Constants.SUBMAT3R_C1R2).Determinant();
		var d3 = this.SubMat3x3(LMath.Constants.SUBMAT3R_C1R3).Determinant();
		var d4 = this.SubMat3x3(LMath.Constants.SUBMAT3_TR).Determinant();
		return this.Elements[0] * d1 - this.Elements[4] * d2 + this.Elements[8] * d3 - this.Elements[12] * d4;
	};
	LMath.Mat4.prototype.To2DArray = function(){
		var r1 = [this.Rows[0].X, this.Rows[0].Y, this.Rows[0].Z, this.Rows[0].W];
		var r2 = [this.Rows[1].X, this.Rows[1].Y, this.Rows[1].Z, this.Rows[1].W];
		var r3 = [this.Rows[2].X, this.Rows[2].Y, this.Rows[2].Z, this.Rows[2].W];
		var r4 = [this.Rows[3].X, this.Rows[3].Y, this.Rows[3].Z, this.Rows[3].W];
		return [r1, r2, r3, r4];
	};
	LMath.Mat4.prototype.Inverse = function(){
		if(this.Determinant() == 0){
			return new LMath.Mat4();
		}else{
			var I = new LMath.Mat4.Identity().To2DArray();
			var rt = this.Clone().To2DArray();
			var i = 0, ii = 0, j = 0, dim = 4, e = 0;
			for(i = 0; i < dim; i++){
				e = rt[i][i];
				if(e == 0){
					for(ii = 0; ii < dim; ii++){
						if(rt[ii][i] != 0){
							for(j = 0; j < dim; j++){
								e = rt[i][j];
								rt[i][j] = rt[ii][j];
								rt[ii][j] = e;
								e = I[i][j];
								I[i][j] = I[ii][j];
								I[ii][j] = e;
							}
							break;
						}
					}
					e = rt[i][i];
					if(e == 0){return new LMath.Mat4();}
				}
				for(j = 0; j < dim; j++){
					rt[i][j] /= e;
					I[i][j] /= e;
				}
				for(ii = 0; ii < dim; ii++){
					if(ii == i){continue;}
					e = rt[ii][i];
					for(j = 0; j < dim; j++){
						rt[ii][j] -= e * rt[i][j];
						I[ii][j] -= e * I[i][j];
					}
				}
			}
			return LMath.Mat4.From2DArray(I);
		}
	};
	LMath.Mat4.prototype.RREF = function(){
		var rt = this.Clone().To2DArray();
		var i = 0, ii = 0, j = 0, dim = 4, e = 0;
		for(i = 0; i < dim; i++){
			e = rt[i][i];
			if(e == 0){
				for(ii = 0; ii < dim; ii++){
					if(rt[ii][i] != 0){
						for(j = 0; j < dim; j++){
							e = rt[i][j];
							rt[i][j] = rt[ii][j];
							rt[ii][j] = e;
						}
						break;
					}
				}
				e = rt[i][i];
				if(e == 0){continue;}
			}
			for(j = 0; j < dim; j++){
				rt[i][j] /= e;
			}
			for(ii = 0; ii < dim; ii++){
				if(ii == i){continue;}
				e = rt[ii][i];
				for(j = 0; j < dim; j++){
					rt[ii][j] -= e * rt[i][j];
				}
			}
		}
		return LMath.Mat4.From2DArray(rt);
	};
	LMath.Mat4.prototype.ToString = function(){
		var s1 = this.Rows[0].ToString();
		var s2 = this.Rows[1].ToString();
		var s3 = this.Rows[2].ToString();
		var s4 = this.Rows[3].ToString();
		return "[" + s1 + "; " + s2 + "; " + s3 + "; " + s4 + "]";
	};
	LMath.Mat4.prototype.Equals = function(m4){
		var e1 = this.Rows[0].Equals(m4.Rows[0]);
		var e2 = this.Rows[1].Equals(m4.Rows[1]);
		var e3 = this.Rows[2].Equals(m4.Rows[2]);
		var e4 = this.Rows[3].Equals(m4.Rows[3]);
		return (e1 && e2 && e3 && e4);
	};
})();