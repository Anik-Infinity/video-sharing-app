import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addNewVideo } from '../services/videos.service';

export default function AddVideoModal(props) {

	const [videoUrl, setVideoUrl] = React.useState("")

  const handleClose = () => {
    props.setAddModal(false);
  };
	const handleAdd = async() => {
		const res = await addNewVideo({
			"videoUrl":	videoUrl,
			"uploadedBy": JSON.parse(localStorage.getItem('user_data')).userId
		}) 
		console.log(res.data)
		handleClose()
		setVideoUrl('')
	}

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>Add new Video</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Enter Youtube link of your video
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="link"
            label="Youtube Video Link"
            type="url"
            fullWidth
            variant="standard"
						value={videoUrl}
						onChange={(e) => setVideoUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
