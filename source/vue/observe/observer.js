import {observe} from './index'
import {arrayMethods,observerArrary} from './array'
export function defineReactive(data,key,value){// 定义响应式的数据变化
  // 不支持ie8 及ie8 以下的浏览器
  // {school:{name:'xx'}} 监控的value下还可能有对象,需要深度观察 
  observe(value)//递归观察
  Object.defineProperty(data,key,{
    get(){
      console.log('获取数据')
      return value;
    },
    set(newValue){
      if(newValue === value) return
      observe(newValue);//如果你设置的值是一个对象的话 应该在进行监控这个新增的对象
      console.log('设置数据')
      value = newValue
    }
  })
}
class Observer{
  constructor(data){
    // data就是我们刚才定义的vm._data
    if(Array.isArray(data)){
    // 重写push等方法
    // 只能拦截数组的方法 数组里的每一项 还需要去观测一下
      data.__proto__ = arrayMethods
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