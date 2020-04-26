// 主要拦截用户调用 push shift unshift pop reverse sort splice 他们会改变原有数组

import { observe } from "./index";


// 先获取老的数组的方法 值改写这7个方法
let  oldArrayProtoMethods = Array.prototype;

// 拷贝的一个新的对象 可以查找到老的方法
export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods =[
  "push",
  "shift",
  "pop",
  "unshift",
  "reverse",
  "sort",
  "splice"
]
export function dependArray(value){// 递归收集数组中的依赖
  for(let i=0;i<value.length;i++){
    let currentItem = value[i];// 有可能也是一个数组
    currentItem.__ob__&&currentItem.__ob__.dep.depend();
    if(Array.isArray(currentItem)){
      dependArray(currentItem);// 不停的收集 数组中的依赖关系
    }
  }
}
export function observerArrary(inserted){
  // 要循环数组一次对数组中每一项进行观测
  for(let i=0;i<inserted.length;i++){
    observe(inserted[i])
  }
}
methods.forEach(method => {
  arrayMethods[method] = function(...args){
    // 函数劫持 切片编程
    let r = oldArrayProtoMethods[method].apply(this,args)
    let inserted;
    switch(method){
      case 'push':
        console.log('===========')
        break;
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }
    if(inserted) {
      observerArrary(inserted)
    }
    console.log('==============>调用了数组更新的方法了',method)
    // 数组方法操作的时候 通知视图更新 
    this.__ob__.dep.notify() 
    return r     
  }
})

