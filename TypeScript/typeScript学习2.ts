
//基础定义
interface People{
	name:string;
	age:number;
	type?:boolean
}

let allPeople:People[] = [
	{
		name:'zyx',
		age:23,
		type:true
	},
	{
		name:'cht',
		age:23,
	}
]

let animal:{
	name?:string;
	type:string;
	age?:number
} = {
	name:'gungun',
	type:'dog'
	
}

console.log('我是allPeople:'+JSON.stringify(allPeople));
console.log('我是animal:'+JSON.stringify(animal));
	

//ts 特殊类型
//any 、null、undefined、void

//any 表示任何类型 typeScript会把类型检查关闭
let  special:number  = 1;
console.log(special)

// null和undefined 可以为任何变量赋值

special = undefined;
console.log(special)
special = null;
console.log(special)

//void 表示函数没有返回值

function log(message:string):void{
	console.log(message)
}


//泛型 比如我们做一个数组的反向输出 传入的什么数组我们就反向输出什么 
//数组内部的变量类型我们并无法知道 但我们还是想去约束他
function reverse<T>(item:T[]):T[]{
	let temp = [];
	for(let i = items.length -1;i>=0;i--){
		temp.push(item[i])
	}
	return temp
}

console.log(reverse([1,2,3,4]));

//并且这样获取到的返回值的变量也直接被约束了
//比如 
let numberArr = reverse([1,2,3,4]);
numberArr.push('zyx');// error TS2345: Argument of type '"zyx"' is not assignable to parameter of type 'number'.
//这时numberArr 明确是 number[] 不能向里面添加字符串


//并且实际上 js数组本来就有reverse方法 ts也确实是用泛型来定义其结构的
interface Array<T>{
	reverse():T[];
}

//联合类型 用 | 来表示
//比如
let unitType:string|number;
unitType = 'zyx';
console.log(unitType);
unitType = 23;
console.log(unitType);


//交叉类型
//在js中extends是一种非常常见的模式。在这种模式下，你可以根据两个对象创建一个新对象，新对象拥有两个对象所有的属性。

//比如
interface animal{
	name:string
}
interface dog{
	eat:string
}

let dog1:(animal&dog) = {
   name:'xxx',
	eat:'xxxx',
}

console.log(dog1)//{name:'xxx',eat:'xxxx'}


function test<T,U>(first: T,second: U) : T & U {
	const result = <T & U>{};
	for(let id in first){
		//这里不太明白 上面已经设定result是交叉类型了为什么下面还要用(<T>result)包裹
		(<T>result)[id] = first[id];
	}
	console.log(result)
	for(let id in second){
		if(!result.hasOwnProperty(id)){
			(<U>result)[id] =second[id];
		}
	}
	console.log(result)
	return result
}

const x = test({a:'hello'},{b:42})
console.log(x)



//元组类型 就是一个数组 里面有不同类型的数据
//定于元组

let alltypeArr:[string,number,number[],boolean];
alltypeArr = ['123',1,[1,2,3],true]
console.log(alltypeArr) //正确
//但是元组内部顺序要相同
//比如
alltypeArr = ['123',true,[1,2,3],1] //报错 第二必须为number 第四个必须为boolean


//类型别名 与接口不同 你可以为任何的类型注释提供类型别名，比如联合类型和交叉类型，但是interface就不可以
//type关键字 例如
type Text = string | {text:string} //联合类型
type Coordinates = [number,number] //元祖
type Callback = (data:string) => void

//如果你需要使用类型注解的层次结构（这句话我也没明白什么意思），请使用接口。它能使用implements和extends。

//其实就是 interface无法去设定类似上面的类型 而我们又想去给联合类型交叉类型这种类型设定名字以便多处使用 我们就需要使用type


//当刚开始从js迁移到ts时 可用通过any 和 as(类型断言)来减少报错 但是这种不是一个好的方式
//比如
let a:number = 1;
let b:string = '123';
a = b as any;//这里我也不知道为什么只能用any  不能 b as number
console.log(typeof a)//string
console.log(a);//123

//并不是全部库都可以使用typeScript
//比如 jquery 这时我们可以 declare var $: any

//@types
//@types帮助我们声明好我们依赖的库的类型声明  这个东西平时就比较常见
//平时我们安装各种包的依赖的 node_modules里会有一个@types文件 里面有 react、react-dom、bable-core等等各种声明文件
//具体打开react 下的global.d.ts文件看看

//一般我们定义对JavaScript各种环境变量的声明 都在 lib.d.ts文件里

interface HTMLHeadElement extends HTMLElement { }
interface HTMLHRElement extends HTMLElement { }
interface HTMLHtmlElement extends HTMLElement { }
interface HTMLIFrameElement extends HTMLElement { }
interface HTMLImageElement extends HTMLElement { }
interface HTMLInputElement extends HTMLElement { }
interface HTMLModElement extends HTMLElement { }
interface HTMLLabelElement extends HTMLElement { }
interface HTMLLegendElement extends HTMLElement { }
interface HTMLLIElement extends HTMLElement { }
interface HTMLLinkElement extends HTMLElement { }

//extend继承 implement实现

//省略。。 等于其实已经帮我们声明好了很多react专有的类型 我们如果写ts直接拿来用就行

//interface 接口重复声明会合并 并且声明提前
interface Point {
	x:number,
	y:number
}

//比如再这里 我们就可以声明z 并且 必须声明z 否则会报错
const a:Point = {
	x:1,
	y:2,
	z:'zyx'
}
console.log(a)

interface Point {
	z:string,
}

//类实现接口
class MyPoint implements Point{
	x:number;
	y:number;
	z:string;
}

//因为interface的可扩展性 如果下面任何地方继续声明interface 都可能导致上面的代码报错
//定于constructor内的变量

interface Crazy{
	new(props:Point):{
		hello:number
	}
}

class CrazyClass implements Crazy extends MyPoint{
	constructor(props){
		return{ hello:123 }
	}
}


//枚举 enum
// 有数字枚举 字符串枚举 常见枚举
//比如
enum Color {
	a = 2,
	b,//3
	c//4
}

//但是常用的一般都是定义一些常量
//比如 这种
enum ReducerType{
	GET_DATA:'get_data',
	CHANGE_DATA:'change_data'
}

//java和oc我看还有给类方法传入变量 限制只能传入某些值 用枚举  但是js好像不用这么做 


//函数 函数的返回值不一定需要定义类型 ts是可以通过编译推断的
//比如
function foo(sample:{a:string}){
	return sample; //会直接被推断为{a:string}
}

//没有返回值时我们一般标准为:void,通常情况下我们可以删除void 让ts自己推导

//函数重载 这里没看出来多写的这几个有什么用处

function padding(all:number);
function padding(topAddBottom:number,leftAndRight:number);
function padding(top:number,right:number,bottom:number,left:number);
function padding(a:number,b?:number,c?:number,d?:number){
	
}

interface ReturnString {
	():string;
}

declare const foo:ReturnString;
const bar = foo();//bar被推断为一个字符串



//不明白为啥定义四个函数 不是只定义最后一个

//在没有提供函数实现的情况下，有两种声明函数类型的方式
type LongHand = {
	(a:number):number
};

type ShortHand = (a:number)=>number

//上述两个例子完全相同，但是，当你想使用函数重载时，只能使用第一种方式。
type LongHandAllowsOverLoadDeclarations = {
	(a:number):number;
	(a:string):string;
}
