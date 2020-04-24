// ?: 匹配不捕获
// + 至少一个  ? 尽可能少匹配
// 源码里的模板编译 也是基于正则的
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
  getValue(vm,expr){
    let keys = expr.split('.')
    return keys.reduce((memo,current)=>{
      memo = memo[current]
      return memo
    },vm)
  },
  compilerText(node,vm){
    // 编译文本 替换{{}} 替换{{school.name}}
    node.textContent = node.textContent.replace(defaultRE,function(...args){
      return util.getValue(vm,args[1])
    })
  }
}
export function compiler(node,vm){
  // node就是文档碎片
  let childNodes = node.childNodes;
  // 将类数组转换成数组
  [...childNodes].forEach(child =>{
    // 一种是元素 一种是文本
    if(child.nodeType == 1){
      // 1元素 3文本
      compiler(child,vm)//编译当前元素的孩子节点
    }else if(child.nodeType == 3){
      util.compilerText(child,vm)
    }
  })
}