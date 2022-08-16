import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom"
import YouTube from "react-youtube";
import "../css/player.css"
import { getAllVideos, getVideoInfo, countView, addReaction } from "../services/videos.service";
import getVideoId from "get-video-id";
import VideoCard from "../components/VideoCard";
import { useNavigate } from "react-router-dom";
import {ThumbUpOutlined, ThumbDownOutlined} from '@mui/icons-material';
import { useLocation } from "react-router-dom";

const Player = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const params = useParams()
	const [signedIn, setSignedIn] = useState(JSON.parse(localStorage.getItem('signed_in')))
	const [allVideos, setAllVideos] = useState([]); 
	const [videoInfo, setVideoInfo] = useState(null)
	const [liked, setLiked] = useState(false); 
	const [disliked, setDisliked] = useState(false); 
	const [totalTime, setTotalTime] = useState(0);
	const [playing, setPlaying] = useState(false);
	


	useEffect(() => {
    (async() => {
      const res = await getAllVideos();
	  const videoInfoRes = await getVideoInfo(params.uuid)
      setAllVideos(res.data.payload.data);
      setVideoInfo(videoInfoRes.data.payload.data);
    })()
  }, [])


	console.log(videoInfo)

  	const reactionIdList = videoInfo?.userVideoReaction.map((data) => data.id);
	console.log(reactionIdList)
	// console.log(JSON.parse(localStorage.getItem('user_data'))?.userId in reactionIdList) 


	useEffect(() => {
		const timer  = setTimeout(() => {
			playing && setTotalTime(totalTime + 1);
		}, 1000)
		if(totalTime > 10){
			clearTimeout(timer);
			let res = null;
			(async () => {
				console.log("view count")
				if(!res)res = await countView(params.uuid);
			})()
		} 
	}, [totalTime, playing, params.uuid])

	useEffect(() => {
		setTotalTime(0)
	}, [location])

	const like = async () => {
		setLiked(!liked)
		if(!liked)setDisliked(false);
		await addReaction({
			"videoId": params.uuid,
			"reaction": 1
		  })		
	}

	const dislike = async() => {
		setDisliked(!disliked)
		if(dislike)setLiked(false)
		await addReaction({
			"videoId": params.uuid,
			"reaction": 2
		  })
	}

	const handleStateChange = () => {
		console.log("state change");
		
	}


	const handlePLay = () => {
		console.log("play")
		setPlaying(true)
	}
	const handlePause = () => {
		console.log("pause")
		setPlaying(false)
	}
	
	return (
		<div className="player-conatiner">
			<div
				className="player"
			>
				<YouTube
					videoId={params.id}
					opts={{
						playerVars: {
							autoplay: 1,
						},
					}}
					onPlay={handlePLay}
					onPause={handlePause}
					onStateChange={handleStateChange}
				/>
				<div
					className="info-bar"
				>
					{signedIn && <div className="react-container">
						<span onClick={() => like()} className={`react ${liked && 'active'}`} >
							{videoInfo?.likeCount}&nbsp; like &nbsp;
							<ThumbUpOutlined />
						</span>
						<span onClick={() => dislike()} className={`react ${disliked && 'active'}`} >
							{videoInfo?.disLikeCount} &nbsp;
							<ThumbDownOutlined />
							&nbsp;dislike
						</span>
					</div>}
					<span className="views">
						views&nbsp;<h4>{videoInfo?.viewCount}</h4>
					</span>

				</div>
			</div>
			<div className="suggestion">
				{allVideos.map((videoData, indx) => {
					const video_id = getVideoId(videoData.videoUrl).id;
					const uuid = videoData.id;
					return (
						<div
						key={indx}
						onClick={() => navigate(`/${video_id}/${uuid}`)}
						className="video-card-container"
						>
							{(params.id != video_id) && <VideoCard
								thumbnail = {videoData.thumbnail} 
								className="video-card"
								title={video_id}
								user={videoData.user}
								views={videoData.viewCount}
							/>}    
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Player;