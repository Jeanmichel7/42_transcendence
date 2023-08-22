import React, { useState, createRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setErrorSnackbar,
  setMsgSnackbar,
  setPersonalizedErrorSnackbar,
} from '../../store/snackbarSlice';
import { setLogged, setUser } from '../../store/userSlice';
import { Sticker } from '../../utils/StyledTitle';
import AccountItem from './AccountItem';

import { deleteAccount, patchUserAccount } from '../../api/user';
import { UserInterface, ApiErrorResponse } from '../../types';

import Box from '@mui/material/Box';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DisplayImg from '../../utils/displayImage';

interface AccountProfileProps {
  user: UserInterface;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openInputAvatar, setOpenInputAvatar] = useState<boolean>(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);
  const fileInputRef = createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification de la taille (e.g. 5MB ici)
    if (file.size > 5 * 1024 * 1024) {
      dispatch(
        setPersonalizedErrorSnackbar('File size should be less than 5MB'),
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const originalImage = new Image();
      originalImage.src = reader.result as string;

      originalImage.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = originalImage.width;
        let height = originalImage.height;

        if (width > 800 || height > 800) {
          if (width > height) {
            height = Math.round((height * 800) / width);
            width = 800;
          } else {
            width = Math.round((width * 800) / height);
            height = 800;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(originalImage, 0, 0, width, height);
        const compressedImage = canvas.toDataURL('image/jpeg', 0.8); // 0.8 est le taux de qualité

        setPreviewAvatar(compressedImage);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async () => {
    if (!previewAvatar) return;

    setIsLoading(true);

    // Convertir Data URL en Blob
    const fetchRes = await fetch(previewAvatar);
    const blob = await fetchRes.blob();

    const formData: FormData = new FormData();
    formData.append('avatar', blob, 'compressed_image.jpg'); // Nommez le fichier comme vous le souhaitez

    const updatedUser: UserInterface | ApiErrorResponse =
      await patchUserAccount(formData);
    if ('error' in updatedUser) {
      dispatch(setErrorSnackbar(updatedUser));
    } else {
      dispatch(setUser({ ...user, avatar: updatedUser.avatar }));
      setOpenInputAvatar(false);
      setPreviewAvatar(null);
      dispatch(setMsgSnackbar('Updated!'));
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const deletedUser: void | ApiErrorResponse = await deleteAccount();
    if (typeof deletedUser === 'object' && 'error' in deletedUser) {
      dispatch(setErrorSnackbar(deletedUser));
    } else {
      dispatch(setMsgSnackbar('Account successfully deleted!'));
      dispatch(
        setUser({
          id: -1,
          login: '',
          email: '',
          firstName: '',
          lastName: '',
          status: 'offline',
          avatar: '',
          role: 'user',
          description: '',
          is2FAEnabled: false,
          score: 1500,
          level: 0,
          experience: 0,
          rank: 'silver_2',
        }),
      );
      dispatch(setLogged(false));
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Sticker dataText={'Account'} />

      {user && (
        <Box className="flex flex-col md:flex-row justify-center">
          <div className="md:w-1/3 m-5 ">
            <Box className="flex flex-col items-center w-full h-full p-4 relative bg-white shadow-lg rounded-lg">
              <svg
                className="absolute top-0  -translate-y-2/4 -translate-x-2/4 left-0 w-1/3"
                viewBox="0 0 30 30 "
              >
                <path
                  className="fill-[var(--color-primary)]  "
                  d="M26.6,12.9l-2.9-0.3c-0.2-0.7-0.5-1.4-0.8-2l1.8-2.3c0.2-0.2,0.1-0.5,0-0.7l-2.2-2.2c-0.2-0.2-0.5-0.2-0.7,0  l-2.3,1.8c-0.6-0.4-1.3-0.6-2-0.8l-0.3-2.9C17,3.2,16.8,3,16.6,3h-3.1c-0.3,0-0.5,0.2-0.5,0.4l-0.3,2.9c-0.7,0.2-1.4,0.5-2,0.8  L8.3,5.4c-0.2-0.2-0.5-0.1-0.7,0L5.4,7.6c-0.2,0.2-0.2,0.5,0,0.7l1.8,2.3c-0.4,0.6-0.6,1.3-0.8,2l-2.9,0.3C3.2,13,3,13.2,3,13.4v3.1  c0,0.3,0.2,0.5,0.4,0.5l2.9,0.3c0.2,0.7,0.5,1.4,0.8,2l-1.8,2.3c-0.2,0.2-0.1,0.5,0,0.7l2.2,2.2c0.2,0.2,0.5,0.2,0.7,0l2.3-1.8  c0.6,0.4,1.3,0.6,2,0.8l0.3,2.9c0,0.3,0.2,0.4,0.5,0.4h3.1c0.3,0,0.5-0.2,0.5-0.4l0.3-2.9c0.7-0.2,1.4-0.5,2-0.8l2.3,1.8  c0.2,0.2,0.5,0.1,0.7,0l2.2-2.2c0.2-0.2,0.2-0.5,0-0.7l-1.8-2.3c0.4-0.6,0.6-1.3,0.8-2l2.9-0.3c0.3,0,0.4-0.2,0.4-0.5v-3.1  C27,13.2,26.8,13,26.6,12.9z M15,19c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C19,17.2,17.2,19,15,19z"
                />
              </svg>
              {previewAvatar && openInputAvatar ? (
                <img
                  src={previewAvatar}
                  alt="preview"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <DisplayImg
                  src={user.avatar}
                  alt={user.login + 'avatar'}
                  className="mb-2 w-auto rounded-lg max-h-[200px] border-2 border-blue-500"
                />
              )}

              <div className="mt-3 flex flex-col items-center">
                {openInputAvatar ? (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="mb-3"
                      onChange={handleFileChange}
                    />
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFileUpload}
                        disabled={isLoading}
                        sx={{ mr: 1 }}
                      >
                        Validate
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        className="mt-2"
                        onClick={() => setOpenInputAvatar(!openInputAvatar)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenInputAvatar(!openInputAvatar)}
                  >
                    Modify
                  </Button>
                )}
              </div>

              <div className="mt-5 w-full px-3">
                <p className="font-bold text-gray-700">Description :</p>
                <p className="text-gray-600">
                  {user.description ? user.description : 'No description'}
                </p>
              </div>
            </Box>
          </div>

          <div className="md:w-2/3 m-5 p-5 bg-white shadow-lg rounded-lg">
            <AccountItem keyName="login" value={user.login} />
            <AccountItem keyName="email" value={user.email} />
            <AccountItem keyName="firstName" value={user.firstName} />
            <AccountItem keyName="lastName" value={user.lastName} />
            <AccountItem keyName="password" value="********" />

            <AccountItem keyName="description" value={user.description} />

            {user.is2FAEnabled != null && user.is2FAEnabled != undefined && (
              <AccountItem keyName="Active 2FA" value={user.is2FAEnabled} />
            )}

            <div className="w-full text-center">
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Box>
      )}

      <Dialog open={openDialog} keepMounted onClose={handleCloseDialog}>
        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By deleting your account, all your data will be removed permanently.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleDeleteAccount();
              handleCloseDialog();
            }}
            color="error"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AccountProfile;
