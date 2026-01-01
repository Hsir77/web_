import React from 'react'

export default function FunctionDemo(props) {
  props.obj=5
  const { obj }=props
  obj.b=5
  console.log(obj)
  return (
    <div>FunctionDemo</div>
  )
}
