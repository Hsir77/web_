import React from "react";
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