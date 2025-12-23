import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  jsx  as  _jsx  } from "react/jsx-runtime" ;   
import FunctionDemo from './components/functionDemo/index';
// import { createElement ,myRender} from '../utils/handleJsx/handleJsx.js';

// myRender(
// createElement(
//   "div",
//   { 
//     className: "first",
//     style: {
//       backgroundColor: "#f5f5f5",
//       padding: "20px",
//       borderRadius: "8px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       fontFamily: "Arial, sans-serif",
//       color: "#333",
//       minHeight: "100px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "10px"
//     }
//   },
//   "333",
//   React.createElement("span", null, "666"),
//   React.createElement(
//     "span",
//     null,
//     React.createElement("a", { href: "" })
//   )
// ),document.getElementById('root')
// )
// console.log(
//  createElement(
//   "div",
//   { className: "first" },
//   "333",
//   createElement("span", null, "666"),
//   createElement(
//     "span",
//     null,
//     createElement("a", { href: "" })
//   )
// ))

  let functionDemoobj={a:1,b:2}
    functionDemoobj.c=3;
    functionDemoobj.a=4;
    delete functionDemoobj.b;

createRoot(document.getElementById('root')).render(
  <>
    <div class="first">
      666
    </div>
    <FunctionDemo obj={functionDemoobj}></FunctionDemo> 
  </>
)

