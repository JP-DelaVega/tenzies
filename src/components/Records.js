import React from 'react'

export default function Records(props) {

  
  return (
    
    <div className='top-10' >
        {props.top > 9 ? props.top : "0" + props.top }&emsp;&emsp;
        {props.rollCount > 9 ? props.rollCount : "0" +props.rollCount }&emsp;&emsp;
        {props.totalTime}
        
    </div>
  )
}
