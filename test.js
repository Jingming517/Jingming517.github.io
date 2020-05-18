//JS按照编写顺序执行

document.write("......"+"<br>");     //换行
document.write("Hello World"+"</br>");

var person={
	name:"JS",
	age:20,
	eat:function(){
		alert("EAT")
	}
}

//Array
var cars=new Array();
cars[0]="Saab";
cars[1]="Volvo";
cars[2]="BMW";

document.write(person.age+"</br>");

function f1(a, b){
	return a+b;
}

document.write(f1(123, 321));