let app = document.getElementById('app')


function h(target,props,...children){
  let key = props.key;
  delete props.key;// 属性中不包括key属性
  return {
    tag,  // 表示当前标签名
    props,// 表示当前标签上的属性
    key,   // 唯一表示用户可能传递
    children
  }
}
let oldVnode = h('div',{id:'container',key:1},
               h('span',{style:{color:'red'}}),
               'zf');

console.log(oldVnode)