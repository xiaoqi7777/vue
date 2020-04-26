import {initState} from './observe'
import Watcher from './observe/watcher'
import { compiler,util } from './util'
function Vue(options){// vue中元素用户 传入的数据
  this._init(options) // 初始化vue 并且将用户选项传入
}  

Vue.prototype._init = function(options){
  // vue中初始化
  let vm = this;
  vm.$options = options
  // MVVM 原理 需要数据重新初始化
  initState(vm)// data computed watch
  if(vm.$options.el){
    vm.$mount();// 挂载
  }
}
function query(el){
  if(typeof el === 'string'){
    return document.querySelector(el)
  }
  return el
}


Vue.prototype._update = function (){
  // 用户传入的数据 去更新视图
  let vm = this
  let el = vm.$el;
  // ------------------- 这里后面会用虚拟dom来重写
  // 要循环这个元素  将里面的内容  换成我们的数据
  let node = document.createDocumentFragment();
  let firstChild;
  while(firstChild = el.firstChild){// 每次拿到第一个元素 就将这个元素放到文档碎片中
    node.appendChild(firstChild); // appendChild 是具有移动功能
  }
  // todo 对文本进行替换
  compiler(node,vm);
  el.appendChild(node)
  // 需要匹配{{}}的方式 来进行替换
  
  // 依赖手机 属性变化了 需要重新渲染 watcher 和 dep
}
Vue.prototype.$mount = function(){
  let vm = this;
  let el = vm.$options.el;// 获取元素
  el = vm.$el = query(el);// 获取当前挂载的节点 vm.$el就是我要挂载的一个元素

  // 渲染是通过 watcher来渲染的
  // 渲染watcher 用于渲染的watcher
  // vue2.0 组件级别更新 new Vue产生的一个组件

  let updateComponent = ()=>{// 更新组件、渲染的逻辑
    vm._update();// 更新组件
  }
  new Watcher(vm,updateComponent);// 渲染watcher,默认会调用 updateComponent 这个方法
  // 如果数据更新了

}

export default Vue

