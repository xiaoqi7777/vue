let id = 0
import { pushTarget,popTarget } from './dep'
import { util } from '../util'
import Vue from '..';
class Watcher{ // 每次产生一个watcher 都要有一个唯一的标识
  /**
   * 
   * @param {*} vm 当前组件的实例 new Vue
   * @param {*} exprOrFn  用户可能传入的是一个表达式 也有可能传入的是一个函数
   * @param {*} cb  用户传入的回调函数 vm.$watch('msg',cb)
   * @param {*} opts 一些其他参数
   */
  // vm msg (newValue,oldValue)=>{} {user:true}
  // vm ()=>this.fullName+this.lastName ()=>{} lazy:true
  constructor(vm,exprOrFn,cb=()=>{},opts={}){
    this.vm = vm;
    this.exprOrFn = exprOrFn
    if(typeof exprOrFn === 'function'){
      this.getter = exprOrFn; // getter就是new Watcher传入的第二个函数
    }else{
      // 处理watch 获取到方法
      this.getter = function(){
        // 调用此方法 会将vm上对应的表达式取出来
        return util.getValue(vm,exprOrFn)
      }
    }
    if(opts.user){
      // 标识是用户自己写的watch
      this.user = true;
    }
    this.lazy = opts.lazy; // 为true 说明他是计算属性
    this.dirty = this.lazy;
    this.cb = cb
    this.deps = []
    this.depsId = new Set()
    this.opts = opts
    this.id = id++
    this.immediate = opts.immediate
    // 创建watcher的时候  先将表达式对应 值取出来(老值)
    // 如果当前我们是计算属性的话 不会默认调用get方法
    this.oldValue = this.lazy ? undefined : this.get();//默认创建一个watcher 会调用自身的get方法
    if(this.immediate){ // 如果有immediate 就直接运行用户定义的函数
      this.cb(this.oldValue)
    }
  }
  get(){
    //  Dep.target = 用户的watcher
    // this 就是当前的watcher 渲染用的 Dep.target = watcher
    // msg 变化了 需要让这个watcher重新执行
    pushTarget(this)
    // 默认创建watcher 会执行此方法
    // 这个函数调用时 就会将当前计算属性watcher 存起来
    let value = this.getter.call(this.vm);// 让这个当前传入的函数执行
    
    popTarget();

    return value
  }
  depend(){
    let i = this.deps.length;
    while(i--){
      this.deps[i].depend();
    }
  }
  evaluate(){
    this.value = this.get();
    this.dirty = false; // dirty:false 表示值求过了
  }
  addDep(dep){
    // 同一个watcher 不应该重复记录dep
    let id = dep.id; // msg 的dep
    if(!this.depsId.has(id)){
      this.depsId.add(dep);
      this.deps.push(dep);// 就让watcher 记住了当前的dep
      dep.addSub(this);
    }
  }
  update(){
    // 如果立即调用get 会导致页面刷新  需要异步来更新
    // vue的特点就是批量更新
    if(this.lazy){
      // 如果是计算属性值变化了 稍后取值时重新计算
      this.dirty = true 
    }else{
      queueWatcher(this)
     }
  }
  run(){
    let newValue = this.get();//新值
    if(this.oldValue !== newValue){
      this.cb(newValue,this.oldValue)
    }
  }
};
let has = {}
let queue = []
function flushQueue(){
    queue.forEach(watcher => watcher.run())
    has = {} // 恢复正常 下一轮继续更新使用 
    queue = []
}
function queueWatcher(watcher){
  // 对重复的watcher过滤操作
  let id = watcher.id
  if(has[id] == null){
    has[id] = true
    queue.push(watcher);//相同的watcher 他只会存一个到queue中 
    // 延迟情况队列
    nextTick(flushQueue)
  }
}
// 等待页面更新后再获取dom元素
let callbacks = []
function flushCallbacks(){
  callbacks.forEach(cb=>cb())
}
function nextTick(cb){
  callbacks.push(cb)
  // 要异步刷新这个callbacks 获取一个异步的方法
  // 异步是分执行顺序的 会先执行promise mutationObserver setImmediate setTimeout
  let timerFunc = ()=>{
    flushCallbacks();
  }
  if(Promise){
    Promise.resolve().then(timerFunc)
    return
  }
  // h5的api
  if(MutationObserver){
    let observe = new MutationObserver(timerFunc);
    let textNode = document.createTextNode(1)
    observe.observe(textNode,{characterData:true})
    textNode.textContent = 2
    return  
  }
  if(setImmediate){
    setImmediate(timerFunc)
    return
  }
  setTimeout(timerFunc,0)
}

// 渲染使用他 计算属性也要用它 vm.watcher也用它
export default Watcher

/*
  1、
    默认我会创建一个渲染 watcher  这个渲染watcher默认会执行 
  2、
    pushTarget(this) Dep.target = watcher
    this.getter(); 调用当前属性的get方法 给当前的属性加一个dep dep.addSub(watcher)
  3、
    当用户修改了属性的变化后  会调用set方法
    dep.notify() dep.subs.forEach(watcher=>watcher.update())
*/
