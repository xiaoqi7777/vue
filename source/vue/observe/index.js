import Observer from './observer'
import Watcher from './watcher';
import Dep from './dep';
export function initState(vm){
  // 做不同的初始化工作
  let opts = vm.$options
  if(opts.data){
    initData(vm);//初始化数据
  }
  if(opts.computed){
    initComputed(vm,opts.computed);//初始化计算属性
  }
  if(opts.watch){
    initWatch(vm);// 初始化watch
  }
}

export function observe(data){
  if(typeof data !== 'object' || data === null){
    return // 不是对象或者是null 我就不用执行后续逻辑了
  }
  if(data.__ob__){// 已经被监控过了
    return data.__ob__
  }
  return new Observer(data)
}
function proxy(vm,source,key){
  // 代理数据 vm.msg = vm._data.msg
  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key]
    },  
    set(newValue){
      vm[source][key] = newValue
    }
  })
}
function initData(vm){
  // 将用户插入的数据 通过object.defineProperty重新定义
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm):data||[]
  for(let key in data){
    // 会将对vm上的取值操作和赋值操作代理给vm._data 属性 因为vm._data里面的数据才是响应式的
    proxy(vm,'_data',key)
  }
  observe(vm._data);// 观察数据
}
function createComputedGetter(vm,key){
  let watcher = vm._watchersComputed[key];// 这个watcher 就是我们定义的计算属性watcher
  // 用户取值是会执行此方法
  return function(){
    if(watcher){
      if(watcher.dirty){
        // 如果页面取值 而且dirty是true 就会去调用watcher的get方法
        watcher.evaluate()
      }
      if(Dep.target){// watcher 就是计算属性的watcher dep = [firstName.dep,lastName.Dep]
        watcher.depend()
      }
      return watcher.value
    }
  }
}
function initComputed(vm,computed){
  // 将计算属性的配置 放到vm上
  let watchers = vm._watchersComputed = Object.create(null);// 创建存储计算属性的watcher的对象
  for(let key in computed){// {fullName:()=>{this.firstName+lastName}}
    let userDef = computed[key]
    // new Watcher此时什么都不会做 配置了lazy dirt 
    watchers[key] = new Watcher(vm,userDef,()=>{},{lazy:true})// lazy 表示计算属性 watcher 默认刚开始这个方法不会执行
    // vm.fullName
    //将这个属性 定义到vm上
    Object.defineProperty(vm,key,{
      get:createComputedGetter(vm,key)
    })
  }
}
function createWatcher(vm,key,handler,opts){
  // 内部最终也会使用$watch方法
  return vm.$watch(key,handler,opts);
}
function initWatch(vm){
  let watch = vm.$options.watch;// 获取用户传入的watch属性
  for(let key in watch){ //msg:(){},msg:[(){},(){}] 可能是对象 可能是数组
  console.log('key',key)
    let userDef = watch[key];
    let handler = userDef
    if(userDef.handler){
      handler = userDef.handler
    }
    createWatcher(vm,key,handler,{immediate:userDef.immediate})
  }
}