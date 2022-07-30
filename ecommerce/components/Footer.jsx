import React from 'react';
import {AiFillInstagram, AiOutlineTwitter} from 'react-icons/ai'

const Footer = () => {
  return (
    <div className='footer-container'>
      <p>2022 Lupel Store All rights reserverd</p>
      <p className='icons'>
        <a href='https://www.instagram.com/nch.exe' target='_black'><AiFillInstagram /></a>
        <a href='https://twitter.com/RasputinPte' target='_black'><AiOutlineTwitter /></a>
      </p>
    </div>
  )
}

export default Footer