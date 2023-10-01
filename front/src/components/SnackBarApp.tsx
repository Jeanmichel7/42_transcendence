import { Snackbar, SnackbarContent, IconButton, Alert } from '@mui/material';
import trophyImages from './Profile/TrophyImages';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { closeSnackbar } from '../store/snackbarSlice';
import DisplayImg from '../utils/displayImage';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://transcendence42.fr:3000';

const SnackBarApp = () => {
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (snackbar.link) {
      dispatch(closeSnackbar());
      navigate(snackbar.link);
    }
  };

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const handleClickSnackbar = () => {
    dispatch(closeSnackbar());
    if (snackbar.link) {
      navigate(snackbar.link);
    }
  };

  const InvitationSnackbar = (
    <SnackbarContent
      message={
        <div className="flex" onClick={handleClickSnackbar}>
          <DisplayImg
            src={snackbar.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover mr-2"
          />
          <div>
            <p>{snackbar.loginFrom}</p>
            {' ' + snackbar.message}
          </div>
        </div>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={e => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );

  const TrophySnackbar = (
    <SnackbarContent
      message={
        <div className="flex items-center" onClick={handleClickSnackbar}>
          <img
            className="w-10 h-10 rounded-full object-cover mr-2 "
            src={trophyImages[snackbar.trophyImg as keyof typeof trophyImages]}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = API_URL + '/avatars/defaultAvatar.png';
            }}
            alt="avatar"
          />
          <p>{snackbar.message}</p>
        </div>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={e => {
            e.stopPropagation();
            handleClose();
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );

  const ErrorSnackBack = (
    <Alert
      severity={snackbar.severity}
      sx={{
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #aaa',
      }}
    >
      <div>
        <p className="font-bold">{snackbar.error.error}</p>
        <p>{snackbar.error.message}</p>
      </div>
    </Alert>
  );

  const alertSnackbar = (
    <Alert
      severity={snackbar.severity}
      sx={{
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #aaa',
      }}
    >
      {snackbar.message}
    </Alert>
  );

  return (
    <Snackbar
      anchorOrigin={{
        vertical: snackbar.vertical,
        horizontal: snackbar.horizontal,
      }}
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      onClick={handleClick}
    >
      {snackbar.link
        ? InvitationSnackbar
        : snackbar.trophyImg
        ? TrophySnackbar
        : snackbar.error.error
        ? ErrorSnackBack
        : alertSnackbar}
    </Snackbar>
  );
};

export default SnackBarApp;
