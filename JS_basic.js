//JavaScript 基本语法合集
//JS按照编写顺序执行

//输出
document.write("......"+"<br>");     //换行
document.write("Hello World"+"<br>");
//window.alert(5 + 6);
document.write(Date()); //显示日期

//使用 console.log() 方法在浏览器中显示 JavaScript 值。
a = 5;
b = 6;
c = a + b;
console.log(c);

//值类型(基本类型)：字符串（String）、数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol。
//引用数据类型：对象(Object)、数组(Array)、函数(Function)。
//2 个不包含任何值的数据类型：null, undefined
document.write(typeof "john");   //查看数据类型


//对象 Object
var person={
	name:"Java",
	age:20,
	eat:function(){
		alert("EAT")
	}
}
document.write(person.age+"</br>");

//数组 Array
var cars=new Array();
cars[0]="Saab";
cars[1]="Volvo";
cars[2]="BMW";
//var cars=new Array("Saab","Volvo","BMW");


//函数 Function
function f1(a, b){
	return a+b;
}
document.write(f1(123, 321)+"<br>");

function myFunction()
{
	//如需从 JavaScript 访问某个 HTML 元素，您可以使用 document.getElementById(id) 方法。
	//请使用 "id" 属性来标识 HTML 元素，并 innerHTML 来获取或插入元素内容：
	//使用 innerHTML 写入到 HTML 元素。
	document.getElementById("demo").innerHTML="我的第一个 JavaScript 函数"; 
}


//在 HTML 中, 全局变量是 window 对象: 所有数据变量都属于 window 对象。
function winFunction(){
	varName = "window 对象";
}
winFunction();
document.write(window.varName +"<br>");

//事件
//HTML 元素中可以添加事件属性，使用 JavaScript 代码来添加 HTML 元素。
//<some-HTML-element some-event="JavaScript 代码">
//onchange	HTML 元素改变
//onclick	用户点击 HTML 元素
//onmouseover	用户在一个HTML元素上移动鼠标
//onmouseout	用户从一个HTML元素上移开鼠标
//onkeydown	用户按下键盘按键
//onload	浏览器已完成页面的加载

//正则表达式 Regular Expression
function reFunction() {
    var str = document.getElementById("demo").innerHTML; 
    var txt = str.replace(/没有感情/i,"真情实感");
    document.getElementById("demo").innerHTML = txt;
}