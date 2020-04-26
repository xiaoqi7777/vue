import {observe} from './index'
import {arrayMethods,observerArrary,dependArray} from './array'
import Dep from './dep';
export function defineReactive(data,key,value){// 定义响应式的数据变化
  // 不支持ie8 及ie8 以下的浏览器
  // {school:{name:'xx'}} 监控的value下还可能有对象,需要深度观察 
  let childOb = observe(value)//递归观察
  let dep = new Dep();//dep 里面可以收集依赖 收集的是watcher

  Object.defineProperty(data,key,{
    get(){ // 只要对这个属性进行了取值操作,就会将当前的watcher存入进去
      if(Dep.target){ // 这次有值用的是渲染watcher
        // 我们希望存入的watcher 不能重复 如果重复会造成更新时多次渲染
        dep.depend();// 他让dep 中可以存watcher  我还虚妄让这个watcher中也存放dep,实现一个多对多的关系
        if(childOb){// 数组的依赖收集  
            childOb.dep.depend(); // 数组也收集了当前渲染 watcher
            dependArray(value);// 收集儿子的依赖
        }
      }
      return value;
    },
    set(newValue){
      if(newValue === value) return
      observe(newValue);//如果你设置的值是一个对象的话 应该在进行监控这个新增的对象
      value = newValue
      dep.notify()
    }
  })
}
class Observer{
  constructor(data){
    // data就是我们刚才定义的vm._data
    
    // 这个dep专门给数组设定 
    this.dep = new Dep();
    // 每个对象 包括数组都有一个__ob__ 属性 返回的是当前的observer实例 
    Object.defineProperty(data,'__ob__',{
      get:()=>this
    })

    if(Array.isArray(data)){
      // 重写push等方法
      // 只能拦截数组的方法 数组里的每一项 还需要去观测一下
      data.__proto__ = arrayMethods
      // 当调用数组的方法时 手动通知
      observerArrary(data)
    }else{
      this.walk(data)
    }
  }
  walk(data){
    let keys = Object.keys(data)
    for(let i = 0; i<keys.length;i++){
      let key = keys[i];// 用户传入的key
      let value = data[keys[i]];// 用户传入的值
      defineReactive(data,key,value);
    }
  }
}

export default Observer