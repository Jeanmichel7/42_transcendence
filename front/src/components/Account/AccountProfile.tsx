import React, { useState, createRef } from "react";
import { useDispatch } from "react-redux";
import { setErrorSnackbar, setMsgSnackbar } from "../../store/snackbarSlice";
import { setUser } from "../../store/userSlice";
// import { RootState } from '../../store';

import AccountItem from "./AccountItem";

import { patchUserAccount } from "../../api/user";
import { UserInterface, ApiErrorResponse } from "../../types";

import Box from "@mui/material/Box";
import { Button } from "@mui/material";

interface AccountProfileProps {
  user: UserInterface;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ user }) => {
  // const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [openInputAvatar, setOpenInputAvatar] = useState<boolean>(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const dispatch = useDispatch();
  const fileInputRef = createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    const fileInput: HTMLInputElement | null = fileInputRef.current;
    const formData: FormData = new FormData();
    formData.append("avatar", fileInput?.files?.[0] as File);
    setIsLoading(true);
    const updatedUser: UserInterface | ApiErrorResponse =
      await patchUserAccount(formData);
    if ("error" in updatedUser) {
      dispatch(
        setErrorSnackbar(
          updatedUser.error + updatedUser.message
            ? ": " + updatedUser.message
            : ""
        )
      );
    } else {
      dispatch(setUser({ ...user, avatar: updatedUser.avatar }));
      setOpenInputAvatar(false);
      setPreviewAvatar(null);
      dispatch(setMsgSnackbar("Updated!"));
    }
    setIsLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl text-center mb-5">Account</h2>

      {user && (
        <Box className="flex justify-center">
          <div className="w-1/3 m-5">
            <Box className="flex flex-col items-center w-full p-4 bg-white shadow-lg rounded-lg">
              <img
                src={
                  previewAvatar && openInputAvatar ? previewAvatar : user.avatar
                }
                className="mb-2 w-auto rounded-full max-h-[200px] border-4 border-blue-500"
                alt="avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "http://localhost:3000/avatars/defaultAvatar.png";
                }}
              />

              <div className="mt-3 flex flex-col items-center">
                {openInputAvatar ? (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="mb-3"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFileUpload}
                      disabled={isLoading}
                    >
                      Upload File
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className="mt-2"
                      onClick={() => setOpenInputAvatar(!openInputAvatar)}
                    >
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenInputAvatar(!openInputAvatar)}
                  >
                    Change avatar
                  </Button>
                )}
              </div>

              <div className="mt-5">
                <p className="font-bold text-gray-700 mb-2"> Description : </p>
                <p className="text-gray-600 text-center">
                  {user.description ? user.description : "No description"}
                </p>
              </div>
            </Box>
          </div>

          <div className="w-1/2 m-5 p-5 bg-white shadow-lg rounded-lg">
            <AccountItem keyName="login" value={user.login} />

            <AccountItem keyName="email" value={user.email} />

            <AccountItem keyName="firstName" value={user.firstName} />

            <AccountItem keyName="lastName" value={user.lastName} />

            <AccountItem keyName="password" value="********" />

            {user.description && (
              <AccountItem keyName="description" value={user.description} />
            )}

            {user.is2FAEnabled != null && user.is2FAEnabled != undefined && (
              <AccountItem keyName="Active 2FA" value={user.is2FAEnabled} />
            )}
          </div>
        </Box>
      )}
    </>
  );
};
export default AccountProfile;
