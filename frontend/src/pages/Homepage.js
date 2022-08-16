import React, { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'
import "../css/homepage.css"
import { getAllVideos } from '../services/videos.service'
import getVideoId from 'get-video-id'
import AddVideoModal from '../components/AddVideoModal'
import {useNavigate} from "react-router-dom"


function Homepage() {

  const navigate = useNavigate()

  const [allVideos, setAllVideos] = useState([]); 
  

  useEffect(() => {
    (async() =>{
      const res = await getAllVideos();
      setAllVideos(res.data.payload.data);
      console.log(allVideos)
    })()
  }, [])


  return (
    <div className="homepage-container">
      {allVideos?.map((videoData, indx) => {
        const video_id = getVideoId(videoData.videoUrl).id;
        const uuid = videoData.id;
        console.log(videoData)
        return (
          <div
            key={indx}
            onClick={() => navigate(`/${video_id}/${uuid}`)}
            className="video-card"
          >
            <VideoCard
              thumbnail={videoData.thumbnail}
              title={video_id}
              user={videoData.user}
              views={videoData.viewCount}
            />    
          </div>
        )
      })}
      
    </div>
  )
}

export default Homepage