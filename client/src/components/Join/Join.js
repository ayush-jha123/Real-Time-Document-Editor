import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Join.css';

const Join = () => {
  const [name,setName]=useState('');
  const [room,setRoom]=useState('');
  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <h1 className='heading'>Join</h1>
        <div><input placeholder='Name' className='joinInput' type='text' onChange={e=>setName(e.target.value)}/></div>
        <div><input placeholder='Room' className='joinInput mt-20' type='text' onChange={e=>setRoom(e.target.value)}/></div>
        <Link onClick={event=>(!name || !room)? event.preventDefault():null} to={`/work?name=${name}&room=${room}`}>
          <button className='button mt-20'>Sign In</button>
        </Link>
      </div>
    </div>
  )
}

export default Join
