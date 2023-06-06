import { useEffect, useState } from 'react';

import { getHistoryGames } from '../../api/game';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from '@mui/material';

import { styled } from '@mui/material/styles';

export default function HistoryGame({ user }: any) {
  const [games, setGames] = useState<any[]>([]);



  useEffect(() => {
    if (typeof user === 'undefined' || !user.id)
      return;
    async function fetchAndSetFriendsProfile() {
      const res = await getHistoryGames(user.id);
      // console.log('res get friends profile : ', res);
      if (res.error) {
        // console.log(res);
      } else {
        setGames(res);
      }
    }
    fetchAndSetFriendsProfile();
  }, [user]);


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const calculDuration = (dateStart: string, dateEnd: string) => {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const diff = Math.abs(end.getTime() - start.getTime());
    const minutes = Math.floor((diff / 1000) / 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return minutes + 'min ' + seconds + 's';
  };

  return (
    <>
      <h2 className="text-3xl text-center mb-5">Games</h2>
      <div className="flex items-center w-full pb-3">
      { games.length == 0 &&
        <div className="w-full h-full flex justify-center items-center text-2xl text-gray-500">
          No history games
        </div> }
      { games.length > 0 &&
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Id</StyledTableCell>
                <StyledTableCell align="right">Player1</StyledTableCell>
                <StyledTableCell align="right">Player2</StyledTableCell>
                <StyledTableCell align="right">Score P1</StyledTableCell>
                <StyledTableCell align="right">Score P2</StyledTableCell>
                <StyledTableCell align="right">Duration</StyledTableCell>
                <StyledTableCell align="right">Winner</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.player1.login}</StyledTableCell>
                  <StyledTableCell align="right">{row.player2.login}</StyledTableCell>
                  <StyledTableCell align="right">{row.scorePlayer1}</StyledTableCell>
                  <StyledTableCell align="right">{row.scorePlayer2}</StyledTableCell>
                  <StyledTableCell align="right">{row.status == 'finished' ? calculDuration(row.createdAt, row.finishAt) : row.status }</StyledTableCell>
                  <StyledTableCell align="right">{row.status == 'finished' ? row.winner.login : row.status}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> }
      </div>
    </>
  );
}