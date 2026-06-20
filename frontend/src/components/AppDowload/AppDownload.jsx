import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>For better Experience Dowload <br/> Snapbite App </p>
      <div className="app-dowload-platforms">

        <img src={assets.play_store} alt="" />
        <img src={assets.app_store } alt="" />
      </div>
      
    </div>
  )
}

export default AppDownload
