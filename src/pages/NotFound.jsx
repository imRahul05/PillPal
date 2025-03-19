import React from 'react'
import Card from '../components/Card'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
   <>
   <Link to="/"> 
     <button className="bg-green-700 hover:bg-green-950 text-white font-bold py-2 px-4 rounded-b-full transition-transform transform hover:scale-110 border-2 border-green-700 cursor-pointer">
       Wanna Go to Home Page? Click Here
     </button>
   </Link>
   <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
     <Card/>
   </div>
   </>
  )
}

export default NotFound