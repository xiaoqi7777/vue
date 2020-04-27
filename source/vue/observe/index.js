import Observer from './observer'
export function initState(vm){
  // 做不同的初始化工作
  let opts = vm.$options
  if(opts.data){
    initData(vm);//初始化数据
  }
  if(opts.computed){
    initComputed();//初始化计算属性
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

function initComputed(){

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