import Vue from 'vue'
// es6类 
let vm = new Vue({
  // el:'#app',
  el:document.getElementById('app'),
  data(){
    return{// Object.defineProperty
      msg:'hello',
      school:{name:'zf',age:12},
      arr:[[1],{a:1},1,2,3]
    }
  },
  computed:{

  },
  watch:{
    msg(newValue,oldValue){
      console.log('watch==>',newValue,oldValue)
    }
  }
})
// vm.msg = 100
// console.log('==>',vm.arr[0]['a'] = 100)

// 什么样的数组会被观测 
// 不能(这就是数据劫持的2个缺点)
// [0,1,2] observe 观测到数组的索引值 会直接返回  不能直接改变索引 不能被检查到
// [1,2,3].length 也是不能观测到的 没有监控
// 能
// [{a:1}] 内部会对数组里的对象进行监控
// [].push /shift unshfit 这些方法可以被监控 vm.$set 内部就是调用的数组的splice方法 

setTimeout(()=>{
  // console.log('start set value')
  // vm.msg = 1001
  // vm.msg = 1002
  // vm.msg = 1003
  // vm.msg = 1004;//最终vm.msg = 'xxx' 来更新就好了

  // vue的特点就是批量更新 防止重复渲染
  // --------------数组更新 更新数组中的对象的属性是可以的 因为做了拦截处理
  // vm.arr[2] = 1111
  // 数组的依赖收集
  // vm.arr[0].push(1111)
  // console.log(vm)

  // watch
  vm.msg = '100'
},1000)