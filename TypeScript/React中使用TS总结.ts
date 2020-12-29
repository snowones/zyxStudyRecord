
// <!-- TS在React中的应用 -->

// <!-- 常用 -->
// <!-- 1 基本类型 -->
type BasicProps = {
	message:string;
	count:number;
	disabled:boolean;
	// <!-- 数组类型 -->
	name:string[];
	// <!-- 联合类型 限制为下面两种字符串字面量类型 -->
	status:'waiting'|'success';
}

// <!-- 2 对象类型 -->
type ObjectOrArrayProps = {
	// <!-- 如果不需要用到具体的属性 可以模糊规定是一个对象 -->
	obj:object；
	obj2:{},//同上
	// <!-- 拥有具体属性的对象 -->
	obj3:{
		id:string;
		title:string;
	};
	// <!-- 对象数组 -->
	// <!-- [{id:1,title:'test'},{}] -->
	objArr:{
		id:number;
		title:string;
	}[];
	// <!-- key可以为任意string，限制为MyTypeHere类型 -->
	dict1:{
		[key:string]:MyTypeHere;
	};
	// <!-- 基本和dict1相同，用了ts内置的Record类型   这里不太懂 -->  
	dict2:Record<string,MyTypeHere>;
	
}


<!-- 函数类型 -->
type FunctionProps = {
	// <!-- 任意的函数类型 -->
	onSomething:Function;
	// 没有参数的函数 不需要返回值
	onClick:()=>void;
	//带参数的函数
	onChange:(id:number)=>void;
	//另一种函数语法 参数是React的按钮事件 非常常用
	onClick(event:React.MouseEvent<HtmlButtonElement>):void;
	//可选参数
	onClick(event?:string):void;
}


//React按钮事件的用法
const clickTest = (event:React.MouseEvent<HtmlButtonElement>) =>{
	console.log(event)
}
// <button
// 	onClck = {clickTest}
// ></button>


// React相关类型
export declare interface AppProps {
	children1:JSX.Element;//不推荐没有考虑数组
	children2:JSX.Element | JSX.Element[];//不推荐没有考虑字符串
	children3:React.ReactChild[];//稍微好点 但是没考虑null
	children:React.ReactNode;//包含所有children情况
	funtionChildren:(name:string) =>React.ReactNode;//函数返回React节点
	style?:React.CSSProperties;//内联style时使用
	//原生button标签自带的所有props类型
	//也可以在泛型的位置传入组件 提取组件的Props类型
	props:React.ComponentProps<"button">;
	//利用上一步的做法 在进一步的提取出原生的onclick函数类型
	//此时函数的第一个参数会自动推断为React的点击事件类型
	onclickButton:React.ComponentProps<"button">["onclick"];
}

//函数式组件
interface AppProps = { message:string };
const App = ({message}:AppProps) => <div>{message}</div>

//通用的解决办法 
//利用React.FC内置类型的话，不光会包含你定义的AppProps还会自动加上一个children类
//型，以及其他组件上会出现的类型

//等同于
AppProps && {
	children:React.Node
	propTypes?: WeakValidationMap<P>;
	contextTypes?: ValidationMap<any>;
	defaultProps?: Partial<P>;
	displayName?: string;
}

//使用
interface AppProps = {message:string};

const App:React.FC<AppProps> = ({message,children}) =>{
	return(
	<>
		{children}
		<div>{message}</div>
	<>
	)
}

 //typeof 变量符可以用来获取变量的类型并赋值
 //比如
 let typeofTest = {
	 name:'zyx',
	 age:1
 }
 
 type typeTest = typeof typeofTest;


//Hooks
//useState
//如果你的默认值已经可以说明类型，那么不用手动声明类型，交给TS自动推荐即可：
const [user,setUser] = React.useState(false);

//如果初始值是null或undefined，那么就要通过泛型手动传入你期望的类型
const [user,setUser] = React.UseState<IUser| null>(null);


//useReducer
//需要用Discriminated Unions 来标注Action的类型

const initialState = { count:0 };
 
 //其实没明白这个语法 总觉得会报错。。。。但实际就是这么写的
 type ACTIONTYPE = 
 |{ type:"increment"; payload:number }
 |{ type: "decrement"; payload: string };
 

 
 
function reducer(state:typeof initialState,action:ACTIONTYPE){
	switch(action.type) {
		case "increment":
			return {count:state.count + action.payload};
		case "decrement":
			return {count:state.count - Number(action.payload)}
		default:
			throw new Error();
	}
}

function Counter(){
	const [state,dispatch] = React.useReducer(reducer,initialState);
	return (
		<>
			Count:{state.count}
			<button onClick ={()=>dispatch({ type: "decrement", payload: "5" })}>
				-
			</button>
			<button onClick= { ()=>dispatch({type:increment,payload:5}) }>
				+
			</button>
		</>
	)
}

//『Discriminated Unions』一般是一个联合类型，其中每一个类型都需要通过类似type这种特定的字段来区分
// 当你传入特定的type时，剩下的类型payload就会自动匹配推断
// 这样当你写入的type匹配到decrement时，ts自动推断出相应的payload是string类型
// 当你写入的type 匹配到increment的时候，则payload应该是number类型
//这样在你 dispatch 的时候，输入对应的type，就会自动提示你剩余的参数类型了。


//useEffect
//这里需要注意的是，useEffect传入的函数，它的返回值要么是一个方法（清理函数），要么是undefined，其他情况都会报错
//比较常见的是我们的useEffect需要执行一个async函数

useEffect(async()=>{
	const user = await getUser();
	setUser(user);
},[])

//这种写法就会报错 因为async会默认返回一个Promise，这会导致TS的报错

//推荐改为这么写
useEffect(()=>{
	const getUser = async()=>{
		const user = await getUser()
		setUser(user)
	}
	 getUser();
},[])


//泛型变量
function identity<T>(arg:T):T{
	return arg;
}
identity<string>('testtset');


//useRef
//这个Hook在很多时候是没有初始值的，这样可以声明返回对象中的current属性的类型
const ref2 = useRef<HTMLElement>(null);

//以一个按钮场景为例
function textInputWithFocusButton(){
	const inputEl = React.useRef<HTMLInputElement>(null);
	const onButtonClick = () =>{
		//或是inputEl.current?.focus()
		if (inputEl && inputEl.currnet){
			inputEl.current.focus();
		}
	}
	return(
		<>
			<input ref={inputEl} type = "text">
			<button onclick={onButtonClick}>Focus the input</button>
		<>
	)
}

//自定义Hook
//如果你想仿照useState的形式，返回一个数组给用户使用，一定要记得在适当的时候使用as const，

// as count 解析

let x = 'x';// x has the type string
const x = 'x';//x has the type 'x'
//第一个为更通用的类型，并允许将其重新分配给其他该类型的值，而第二个只能具有'x'的值
//还可以
let x = 'x' as cont; x has the type 'x'
//还可以
<const>{a:'1',b:'2'};
//这样定义的a和b也是只读

//自定义Hook
export function useLoading(){
	const [isLoading,setState] = React.useState(flase);
	const Load = (aPromise:Promise<any>) =>{
		setState(true);
		return aPromise.finally(()=>setState(false));
	};
	return [isLoading,load] as const;[]
}


//forwardRef 这个是一个很重要的ReactAPI
//函数式组件默认不可以加ref，它不像类组件那样有自己的示例。 
//这个api一般是函数式组件用来接收父组件传来的ref
//所以需要标注好实例类型，也就是父组件通过ref可以拿到什么类型的值

//父组件
const App = () =>{
	const ref = useRef<HtmlButtonElement>();
	return (
		//这个就是一个函数组件
		<FancyButton ref = {ref} />
	)
}

//FancyButton
type Props = {};
type Ref = HtmlButtonElement;
export const FancyButton = React.forWardRef<Ref,Pros>((props,ref)=>(
	<button ref = {ref} className = "MyClassName">
		{props.children}
	</button>
))