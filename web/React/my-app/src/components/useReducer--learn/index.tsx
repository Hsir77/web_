import React from "react";
import { useReducer } from "react";



//一、阶段一代码有多个改变count的操作，+ -任何数值，而且目前内部的操作只有+ — 如果涉及到更复杂的操作呢，更复杂的数据呢
// 对于这种情况我们能不能，把操作封装起来，进行统一管理?

function UseReducerDemo() {
    const [count, setCount] = React.useState(0);
    return (
        <>
            <p style={{ color: "red", fontSize: 30 }}>{count}</p>
            <button onClick={() => setCount(count + 1)}>点我+1</button>
            <button onClick={() => setCount(count - 1)}>点我-1</button>
            <button onClick={() => setCount(count + 2)}>点我+2</button>
            <button onClick={() => setCount(count - 2)}>点我-2</button>
        </>
    );
}
export default UseReducerDemo;UseReducerDemo1;UseReducerDemo2;

//二、为什么要用useReducer,大部分是因为setState的handle函数散落代码各处，不利于集中管理，如果使用useReducer，可以更好地语义化

function UseReducerDemo1() {
  const initialState = 0;//初始值
  const [count ,dispatch] = useReducer(reducer, initialState);
  function reducer(state, action) {
      switch (action.type) {
          case "addone":
              return state + action.payload;
          case "subone":
              return state - action.payload;
          case "addtwo":
              return state + action.payload;
          case "subtwo":
              return state - action.payload;
          default:
              return state;
      }
  }
    return (
        <>
            <p style={{ color: "red", fontSize: 30 }}>{count}</p>
            <button onClick={() => dispatch({ type: "addone", payload: 1 })}>点我+1</button>
            <button onClick={() => dispatch({ type: "subone", payload: 1 })}>点我-1</button>
            <button onClick={() => dispatch({ type: "addtwo", payload: 2 })}>点我+2</button>
            <button onClick={() => dispatch({ type: "subtwo", payload: 2 })}>点我-2</button>
        </>
    );
}

//三、如果业务在复杂一点，变为一个表单


function UseReducerDemo2() {
    const initialState = {
        username: "",
        email: "",
        errors: {
            username: "",
            email: ""
        }
    };

    function reducer(state, action) {
        switch (action.type) {
            case "CHANGE":
                return {
                    ...state,
                    [action.field]: action.value,
                };
            case "RESET":
                return initialState;
            case "SET_ERROR":
                return {
                    ...state,
                    errors: {
                        ...state.errors,
                        [action.field]: action.error
                    }
                };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSubmit = (e) => {
        e.preventDefault();
        // 表单验证
        let hasError = false;
        
        if (!state.username) {
            dispatch({ type: "SET_ERROR", field: "username", error: "用户名不能为空" });
            hasError = true;
        } else {
            dispatch({ type: "SET_ERROR", field: "username", error: "" });
        }
        
        if (!state.email) {
            dispatch({ type: "SET_ERROR", field: "email", error: "邮箱不能为空" });
            hasError = true;
        } else if (!/\S+@\S+\.\S+/.test(state.email)) {
            dispatch({ type: "SET_ERROR", field: "email", error: "邮箱格式不正确" });
            hasError = true;
        } else {
            dispatch({ type: "SET_ERROR", field: "email", error: "" });
        }
        
        if (!hasError) {
            console.log("表单提交成功", state);
            // 这里可以执行提交逻辑
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="用户名"
                value={state.username}
                onChange={(e) => dispatch({ type: "CHANGE", field: "username", value: e.target.value })}
            />
            {state.errors.username && <div style={{ color: "red" }}>{state.errors.username}</div>}
            
            <input
                placeholder="邮箱"
                value={state.email}
                onChange={(e) => dispatch({ type: "CHANGE", field: "email", value: e.target.value })}
            />
            {state.errors.email && <div style={{ color: "red" }}>{state.errors.email}</div>}
            
            <button type="submit">提交</button>
            <button type="button" onClick={() => dispatch({ type: "RESET" })}>
                重置
            </button>
        </form>
    );
}