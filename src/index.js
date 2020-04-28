// import Vue from 'vue'
// // es6类 
// let vm = new Vue({
//   // el:'#app',
//   el:document.getElementById('app'),
//   data(){
//     return{// Object.defineProperty
//       msg:'hello',
//       school:{name:'zf',age:12},
//       arr:[[1],{a:1},1,2,3],
//       firstName:'song',
//       lastName:'ge'
//     }
//   },
//   // computed 其实也是一个watch
//   computed:{
//     fullName(){
//       return this.firstName+this.lastName
//     }
//   },
//   watch:{
//     // msg(newValue,oldValue){
//     //   console.log('watch==>',newValue,oldValue)
//     // }
//     msg:{
//       handler(newValue,oldValue){
//         console.log('watch==>',newValue,oldValue)
//       },
//       // 深度监控
//       immediate:true
//     }
//   }
// })
// // vm.msg = 100
// // console.log('==>',vm.arr[0]['a'] = 100)

// // 什么样的数组会被观测 
// // 不能(这就是数据劫持的2个缺点)
// // [0,1,2] observe 观测到数组的索引值 会直接返回  不能直接改变索引 不能被检查到
// // [1,2,3].length 也是不能观测到的 没有监控
// // 能
// // [{a:1}] 内部会对数组里的对象进行监控
// // [].push /shift unshfit 这些方法可以被监控 vm.$set 内部就是调用的数组的splice方法 

// setTimeout(()=>{
//   // console.log('start set value')
//   // vm.msg = 1001
//   // vm.msg = 1002
//   // vm.msg = 1003
//   // vm.msg = 1004;//最终vm.msg = 'xxx' 来更新就好了

//   // vue的特点就是批量更新 防止重复渲染
//   // --------------数组更新 更新数组中的对象的属性是可以的 因为做了拦截处理
//   // vm.arr[2] = 1111
//   // 数组的依赖收集
//   // vm.arr[0].push(1111)
//   // console.log(vm)

//   // watch
//   // vm.msg = '100'

//   // 更改计算属性
//   // 当前的
//   vm.firstName = '==='
// },1000)


// let app = document.getElementById('app')
// import {h,render,patch} from './vnode/index'
// // let oldVnode = h('div',{id:'container',style:{background:'red'}},
// //                h('span',{style:{color:'red',background:'yellow'},class:'my'},'hello'),
// //                'zf');
// let oldVnode = h('div',{id:'container',style:{background:'red'}},
//               h('li',{style:{background:'red'},key:'a'},'a'),
//               h('li',{style:{background:'yellow'},key:'b'},'b'),
//               h('li',{style:{background:'blue'},key:'c'},'c'),
//               h('li',{style:{background:'pink'},key:'d'},'d'),
// );

// // patchVnode 用新的虚拟节点 和老的虚拟节点做对比 更新真是dom节点

// let container = document.getElementById('app')
// render(oldVnode,container)

// // let newVode = h('div',{id:'aa',style:{background:'yellow'}},
// //   h('span',{style:{color:'green'}},'world'),
// //   'px'
// // )
// let newVode = h('div',{id:'a'},
// h('li',{style:{background:'pink'},key:'e'},'e'),
// h('li',{style:{background:'red'},key:'a'},'a'),
// h('li',{style:{background:'yellow'},key:'f'},'f'),
// h('li',{style:{background:'blue'},key:'c'},'c'),
// h('li',{style:{background:'yellow'},key:'n'},'n'),
// );

// setTimeout(()=>{
//   // console.log('123')
//   patch(oldVnode,newVode)
// },1000)

import Vue from 'vue';
let vm = new Vue({
  el:'#app',
  data(){
    return {msg:'hello zf'}
  },
  render(h){// 内部会调用此render方法 将render方法中的this 变成当前实例
    return h('p',{id:'a'},'hello',this.msg)
  }
})