//类型
let isDone : boolean = true;
let num : number = 1;
let name : string = 'zyx';
//数组有两种定义方式
//1 元素类型 + []
let array1 : number[] = [1,2,3];
// 2 数组泛型 Array<元素类型>
let array2 : Array<number> = [1,2,3];
//除了数组外还有元组
//用于定义一个已知长度和类型的数组
let array3 : [string,number] = ['zyx',22];//元组长度为2  第一个元素为string 第二个元素为number
//当访问元组越界元素时，回使用联合类型代替 string|number

//枚举类型
enum Color { Red = 2, Green, Blue}
let C:Color = Color.Red;
let D:Color = Color.Green;
console.log(C); //2
console.log(D); //输出3
//默认情况下输入元素下标 比如Red 不指定就是0

let ColorName : string = Color[2];
console.log(ColorName);//输入Red 因为上面Red赋值为2

//Any 不清楚其类型时使用 使用any后编译时就不会对其进行类型检查
let notSure : any = 4;
console.log(notSure);
notSure = 'zyx';
console.log(notSure);

//同时定义数组时我们也可以使用any
let list : any[] = [1,true,'zyx'];//表示一个我们不清楚其内部数据类型的数组

//Void 它表示没有任何类型 通常我们用于函数
function noReturn() : void {
	console.log('我没有任何return值');
}
noReturn();

//当我们的函数不返回任何值时就可以这么定义

//定义变量并没有任何用 声明一个void变量时只能给他赋值undefined或是null
let unusable : void = undefined;
console.log(unusable);

//null 和 undefined
//在TypeScript中undefined和null分别有自己的数据类型 叫undefined和null 本身用处不大 跟void相似

let u : undefined = undefined;
let n : null = null;
console.log(u);
console.log(n);

//默认情况下null和undefined是任何数据类型的子类型，也就是说我们可以把null

//never 类型表示那些用不存在值得类型 （大部分为错误时得情况） 他是任何类型的子类型
//函数
function error(message:string):never {
	throw new Error(message);
}
function fail():never{
	return error('Something failed');
}
fail()
//返回never的函数必须存在无法到达的终点
function infiniteLoop():never {
	while (true){
		
	}
}

//object 非原始类型 
declare function create(o:object | null ) :void;
create({prop:0});

//类型断言 这种方式可以告诉编译器 相信我，我知道自己再干什么
//他有两种表现形式 1 <> 2 as
//因为我这里定义someValue是any类型
let someValue:any ='this is a string';
//所以这里我直接断言这是string类型
let strLength:number = (<string>someValue).length;
let strLengthOther:number = (someValue as string).length;
console.log(strLength);//16
console.log(strLengthOther);//16

//接口的存在是为了做类型检查，是为类型命名和为你的代码或是第三方代码定义契约
interface LabelledValue {
	label:string;
}

function printLabel(LabelledObj:LabelledValue){
	//规定传入的参数LabelledObj的类型必须包含一个label的属性且类型为string 	
	//当然也可以写为labelledObj: { label: string } 
	//这里我们用接口来描述类型规定
	console.log(LabelledObj.label);
}

let myObj:{number,string} = {size:10,label:"size 10 Object"};
printLabel(myObj);

//接口里的属性如果不是全部必须的情况下，有些是可选属性的情况下，可选属性可以应用"option bags"模式
interface squareConfig {
	color?:string;//这样定义后 这个属性就是可传入可不传入
	width?:number;
}

//规定了传参类型是squareConfig定义的接口类型，返回类型是一个包含一个字符串和一个数字类型的对象
function creatSquare(config:squareConfig) : {color:string;area:number} {
	let newSquare = {color:"white",area:100};
	if(config.color) {
		newSquare.color = config.color;
	}
	if(config.width) {
		newSquare.area = config.width * config.width;
	}
	return newSquare;
}

let mySquare = creatSquare({color:"black"})
console.log(mySquare);//{area:100,color:"black"}

//接口还可以定义参数为只读 可以再属性名前用readonly来指定只读属性
interface Point {
	readonly x:number;
	readonly y:number;
}
let p1:point = {x:10,y:20};
p1.x = 5;//error! 这里的x为只读 不允许修改

//typeScript 还可以定义不允许修改的数组类型
//ReadonlyArray<T>类型，它和Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后就不可修改了

let ro1:Array<number> = [1,2,3,4];//或是 :number[]
let ro2:ReadonlyArray<number> = [5,6,7,8];
//首先对ro2的各种操作和赋值操作都是报错
//其次我们把ro2赋值给ro1也回报错
ro1 = ro2;//这里写代码时会提示爆红 但是输出时没报错 我也不知道咋回事
console.log(ro1);
//除非我进行断言重写
ro1 = ro2 as number[];
console.log(ro1);

//readonly 和 const 都可以定义不可改变的变量
//正常我们定义普通类型的变量的时候直接用const进行约束就行了，如果定义复杂类型的变量时就需要使用readonly进行约束


//类型检查的特殊情况

//这些事上面定义的一些代码
interface squareConfig {
	color?:string;//这样定义后 这个属性就是可传入可不传入
	width?:number;
}
function createSquare(config:squareConfig):{color:string;area:number}{
	..
}

//理论上我们此时传入的参数是没问题的 虽然colour不是color 但是因为我们上面定义的color是可选可不选的 
let mySquare = creatSquare({colour:"red",width:100}); //而此时这里会报错

//有三种处理方式
//第一种比较暴力 我们直接强制类型断言
let mySquare = creatSquare({colour:"red",width:100} as squareConfig);
//第二种 修改接口 添加一个字符串索引签名 表示这个接口除了能接受color和width还能接受任意数量的其他属性

interface squareConfig {
	color?:string;
	width?:number;
	[propName:string]:any,
}
//这样定义完的接口 我们通过上面的操作就不会报错

//第三种赋值的方式绕过检查
let squareOptions = {colour:"red",width:100};
let mySquare = creatSquare(squareOptions);//这里我不明白为什么会绕过类型检查

//函数类型的接口
//这个接口的意思是 要求传入的参数 一个是source 类型为string 一个是subString 类型为string 返回值类型为boolean
interface SearchFunc{
	(source:string,subString:string) : boolean
}

let mySearch :SearchFunc;//这样定义出来的变量就是一个函数类型的变量
mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}

//索引类型的接口
interface StringArray {
	[index:number]:string
}

let myArray : StringArray;
myArray = ['zyx','zxx'];

//索引类型我有些不明白 先跳过
//还可以把索引类型设为只读的
interface ReadonlyStringArray {
	readonly [index : number]:string;
}
//定义完就不能再修改了
let myArray: ReadonlyArray = ['zyx','zxx']; 


// 类接口
interface ClockInterface {
	currentTime:Date;
	setTime(d:Date)
}

class Clock implements ClockInterface {
	currentTime:Date;
	setTime(d:Date) {
		this.currentTime =d;
	}
}


//接口的继承
interface Shape {
	color:string;
}

interface Square extends Shape {
	length:number
}

let square = <Square>{};
square.color = "blue";
square.length = 20;

//同时一个接口还可以继承多个接口
interface PersonName{
	name:string
}

interface PersonAge{
	age:number
}

interface PersonHeight{
	height:number
}

interface PerSon extends PersonName,PersonAge,PersonHeight{
	wight:number
}

let zyx = <PerSon>{};
zyx.age = 22;
zyx.name = "zyx";
zyx.wight = 140;
zyx.height = 175; 

//混合类型有点看不懂

interface Counter {
	(start:number):string;
	interval:number;
	reset():void;
}

function getCounter():Counter {
	let counter = <Counter> function (start:number){ };
	counter.interval = 123;
	counter.reset = function() {};
	return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;


//接口继承类完全没看懂
class Control {
	private state:any;
}

interface SelectableControl extends Control {
	select():void;
}

//BUtton类继承了Control类 实现了SelectableControl类
class Button extends Control implements SelectableControl{
	select() {}
}


//类
class Animal {
	name : string;
	constructor(theName: string){this.name = theName}
	move(disMeters:number = 0){
		console.log('我是Animal类的move'+this.name + 'move' + disMeters);
	}
}

class Snake extends Animal{
	constructor(name:string){
		super(name);
	}
	move(disMeters:number = 5){
		console.log('我是Snake类的move方法');
		super.move(disMeters);
	}
}

class Horse extends Animal{
	constructor(name:string){
		super(name)
	}
	move(disMeters:number = 10){
		console.log('我是Horse类的move');
		super.move(disMeters);
	}
}

let zhangsan = new Snake('zhangsan');
zhangsan.move();

//私有变量 好像是typeScript可以这么定义 我也不清楚 三种成员定义方式 跟java没什么区别
//private 
class Animal{
	private name:string;
	constructor(theName:string){this.name = theName}
}

//protected 虽然外部访问不到 但是在他的派生类中仍能访问到

class Animal{
	protected name:string;
	constructor(name : string){this.name = name}
}

class Dog extends Animal{
	constructor(name : string){
		super(name)
	}
	getProtectedParam(){
		console.log(this.name);
	}
}

let dog1 = new Dog('zhangsan');
dog1.getProtectedParam();

//同时class内的成员也可以被定义为readonly ，只读属性必须在声明时或是构造函数里被初始化
class Octpus{
	readonly name:string;//在构造函数里初始化
	readonly num:number = 2;//声明时初始化
	constructor(name:string){
		this.name = name;
	}
}

//存取器
//在不设置存取器的时候我们可以直接修改public的成员变量
class Employee {
	name:string;
}

let employee1 = new Employee();
//这里我们可以随意设置name的值
employee1.name = 'zyx';

//typeScript支持getters/setters来截取对对象成员的访问。 它能帮助你有效的控制对对象成员的访问。

class Employee {
	private name:string;
	get name():string {
		return this.name;
	}
	set name(newName:string) {
		this.name = newName;
	} 
}

//上面定义的都是实例的对象成员 同时我们可以定义静态的成员
class Grid{
	static origin = {x:0,y:0}
	jisuan(point:{x:number,y:number}){
		let xDist = (point.x - Grid.origin.x);//使用静态成员变量时 用类名.静态变量名 而不是this.
		let yDist = (point.y - Grid.origin.y)
	}
}

//抽象类
abstract class Department {
	constructor(name:string){
		
	}
	printName():void{
		console.log('Department name：' + this.name);
	}
	
	abstract printMeeting():void;//定义抽象类中的抽象方法
}
//  抽象类中的抽象方法必须在派生类中实现 
//	不能创建抽象类的实现

class AccountingDepartment extends Department {
	constructor(){
		super('zhangyingxiang');//在派生类的构造函数中必须调用super()
	}
	printMeeting():void{
		console.log('我实现了抽象的方法')
	}
}

//把类当作接口使用 我也不知道有什么意思
class Point{
	x:number;
	y:number;
}

interface Point3d extends Point{
	z:number;
}

let point3d:Point3d ={x:1,y:2,z:3};
//函数

//typeScript 中的函数 每个参数都是要传的 如果是可传可不传的参数 我们需要用？来定义
function buildName(firstName:string,lastName?:string){
	if(lastName){
		return firstName + lastName;
	}else{
		return firstName
	}
}

//还有就是 如果参数带有默认值得话，这个参数也是可传可不传
//firstName:string = 'zyx'
//同时 带有默认值得参数不是一定要放在参数列表得末尾得 如果放在前面 我们需要传入undefined来表示让参数调用默认值
function buildName(firstName:string = "will",lastName:string){
	...
}

let result = buildName(undefined,'zyx'); //只传入一个zyx会报错

//ts里不能多传入参数 如果想同时传入更多的参数 我们需要把所有参数都收集到一个变量里
function buildName(firstName:string,...restOfName:string[]){
	return firstName + " " + restOfName.join(" ");
}

//还有一个问题 因为js是动态类型，有一种常见的情况  有得函数可以传入任何类型的参数，然后返回任何类型的参数

function type(anyType){
	return anyType;
}
//用ts 写就是

function type(anyType:any):any {
	return anyType;
}

//这样写又一个我呢提 就是我们丢失了一些信息 我们无法控制传入的参数和返回的值是相同类型的
//只能让他们是任意类型
//解决方案 使用类型变量
//定义一个类型变量T 让 传入的参数类型是T 返回的参数类型也是T
function type<T>(anyType:T):T{
	return anyType;
}

//此时type是一个泛型函数
//我们有两种方式调用他
//1 明确T类型
let output = type<string>("myType");
//2 类型推论 就是编译器会根据传入的参数自动地帮我们确定T的类型
let output = type("myType");

//数字枚举
enum Direction {
	Up = 1;
	Down,
	left,
	PersonHeight
}
//如上，我们定义了一个数字枚举，Up使用初始化为1，其余的成员会从1开始自动增长。也就是UP =1， Down = 2， left = 3  personHeight = 4
//可以通过枚举的属性或是名字来访问枚举成员
Direction.UP;
Direction[1];

//字符串枚举
//再一个字符串枚举里 ，每个成员都必须用字符串字面量或另一个字符串枚举成员进行初始化

//枚举在java里一般用于定义常量 枚举里的内容外部是不能修改的
enum Direction {
	UP  = "UP",
	Down = "Down",
	Left = "Left",
	Right = "RIGHT"
}

//同时定义常量枚举时 我们经常使用const定义
const enum Direction{
	
}

//异构枚举 就是同时有数字类型的和字符串类型的 但是正常情况下我们不会这么去做
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}

//声明合并
interface Cloner{
	name:string;
}
interface Cloner{
	age:num;
}

let zyx:Cloner 
zyx.age = 12;
zyx.name = "zyx";
console.log(zyx);



