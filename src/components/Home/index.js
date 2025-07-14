import React, { useState } from 'react'
import "./index.scss"
import chessImg from "../../media/chessImg.jpeg"
import { Link } from 'react-router-dom'
import StartScreen from '../StartScreen'

function Home() {
  let [openPrompt, setOpenPrompt] = useState("off")

  return (    


    <div className="homePage">
      <div className={`startScreenContainer ${openPrompt}`}>
              <StartScreen />
          </div>
          <h1>
            <svg width="48" height="69" viewBox="0 0 48 69" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="23.5" cy="14.5" r="14.5" fill="#FFFCFC"/>
            <ellipse cx="24.3478" cy="29.0543" rx="19.7826" ry="3.42391" fill="white"/>
            <ellipse cx="23.9674" cy="46.5543" rx="14.0761" ry="20.163" fill="white"/>
            <rect y="62.1522" width="47.9348" height="6.84783" rx="3.42391" fill="white"/>
            </svg>

              
              CHESSY</h1>
          <img src={chessImg} alt="chess img" />
          
              <button onClick={()=>setOpenPrompt("on")}>PLAY</button>
              
    </div>
  )
}

export default Home