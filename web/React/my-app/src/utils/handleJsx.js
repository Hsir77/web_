import React from "react";

// **********注意*************
// 以下的语法适用React16以下

//遍历虚拟dom的函数（包括私有和symbol）
export function traverseVirtualDom(obj,callback){
    if(obj==null||typeof obj!='object'){
        return
    }
   let keys=Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj))
   keys.forEach(key=>{
    let val=obj[key]
    callback(key,val)
   })
}

//将virtualDOM转为真实DOM
export  function render(){}

//将Jsx语法转换成virtualDOM
export  function createElement(tagName,props,...children){
    // tagName为标签类型；props为标签内置属性；children为内容和子节点
    let virtualDOM={
        ref:null,
        key:null,
        type:null,
        $$typeof:Symbol(React.element),
        props:{}
    }
    virtualDOM.type=tagName;
    if (props != null) {
        virtualDOM.props = {
            ...props 
        };
    }
    if(children.length==1){
        virtualDOM.props.children=children[0] 
    }
    if(children.length>1){
        virtualDOM.props.children = children;
    }
    return virtualDOM     
}