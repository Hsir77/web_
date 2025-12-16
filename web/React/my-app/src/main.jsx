import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  jsx  as  _jsx  } from "react/jsx-runtime" ;   
import { createElement } from '@/utils/handleJsx.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div class="first">
      <span>666</span>
      <span>
        <a href=""></a>
        </span>
    </div>
  </StrictMode>,
)
console.log(
 createElement(
  "div",
  { className: "first" },
  "333",
  createElement("span", null, "666"),
  createElement(
    "span",
    null,
    createElement("a", { href: "" })
  )
))
console.log(
 React.createElement(
  "div",
  { className: "first" },
  "333",
  React.createElement("span", null, "666"),
  React.createElement(
    "span",
    null,
    React.createElement("a", { href: "" })
  )
))

