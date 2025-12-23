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
export  function myRender(virtualDom,rootNode){
    let { type , props} = virtualDom
    if(typeof type==='string'){
        let ele=document.createElement(type)
        traverseVirtualDom(props,(key,val)=>{
            if(key=="className"){
                ele.setAttribute('class',val)
            }else if(key=='style'){
                for (const key in props["style"]) {
                     ele.style[key] = props["style"][key];
                }
            }else if(key=='children'){
                let children=props['children']
                if(!Array.isArray(children)){
                    children=[children]
                }
                children.forEach((child) => {
                if(typeof child === 'number' || typeof child === 'string'){  
                        ele.textContent=child
                    }else{
                        myRender(child,ele)
                    }
                })
            }

        })
        if(rootNode){
            rootNode.appendChild(ele)
        }
    }
}

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