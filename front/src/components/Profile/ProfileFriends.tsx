import React, { useEffect, useState } from 'react';
import { getFriendProfile } from '../../api/relation';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, ButtonGroup, IconButton, Tooltip, Zoom } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { red } from '@mui/material/colors';

export interface AccountProps {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  is2FAEnabled: boolean;
  avatar: string;
  status: string;
}

export default function ProfileFriends(user: any) {
  console.log(user)
  const [friends, setFriends] = useState<AccountProps[]>([]);

  useEffect(() => {
    // if (typeof user === 'undefined')
    //   return;
    async function fetchAndSetFriendsProfile() {
      const res = await getFriendProfile(user.user.login)
      if (res.error) {
        console.log(res);
      }
      else {
        setFriends(res);
        console.log(res)
      }
    }
    fetchAndSetFriendsProfile();
  }, [user]);

  const handleBlockUser = (userIdToBlock: number) => async () => {
    console.log(userIdToBlock)
  }

  const handleDefi = (userIdToDefi: number) => async () => {
    console.log(userIdToDefi)
  }

  const handleRemoveFriend = (userIdToRemove: number) => async () => {
    console.log(userIdToRemove)
  }

  return (
    <div className="flex items-center w-full pb-3">
      {friends.map((friend) => {
        const description = friend.description ? friend.description.substring(0, 50) + "..." : "No description"
        return (
          <Card key={friend.login} sx={{ maxWidth: 150, margin: '10px' }}>
            <Link to={`/profile/${friend.login}`}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:3000/avatars/` + friend.avatar}
                  alt={friend.login}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "http://localhost:3000/avatars/defaultAvatar.png"
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {friend.login}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {friend.description ? description : "No description"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>

            <CardActions className='flex items-center justify-between'>
              <Tooltip
                title="Defier" arrow
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton aria-label="delete friend"
                  onClick={handleDefi(friend.id)}
                >
                  <SportsTennisIcon color='info' />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Delete friend" arrow
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton aria-label="delete friend"
                  onClick={handleRemoveFriend(friend.id)}
                >
                  <DeleteForeverIcon sx={{ color: red[800] }} />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Block user" arrow
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton aria-label="delete friend"
                  onClick={handleBlockUser(friend.id)}
                >
                  <RemoveCircleIcon sx={{ color: red[800] }} />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        )
      })}
    </div>
  )
}