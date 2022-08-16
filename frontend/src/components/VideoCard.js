import { Avatar } from '@mui/material'
import React from 'react'
import "../css/videoCard.css"

const VideoCard = (props) => {
  console.log(props.user)
  return (
      <div className="video-card-container">
        <img  className='thumbnail' src={props.thumbnail} alt="thumbnail" />
        <div className="video-details">
          <div className="user">
            <Avatar className="user-avatar" src={require("../assets/images/onnorokom_logo.png")}/>
            <div className="video-creator">{props.user.fullName}</div>
          </div>
          <div className="video-values">
            <div className="video-title">{props.title}</div>
            <div className="views">{props.views} views</div>
          </div>
        </div>
      </div>
  )
}

export default VideoCard