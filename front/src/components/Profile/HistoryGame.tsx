import { useEffect, useState } from "react";

import { getHistoryGames } from "../../api/game";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  DataGrid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Sticker } from "../../utils/StyledTitle.tsx";

import { UserInterface } from "../../types";
import { GameInterface } from "../../types/GameTypes";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "player1", headerName: "Player1", width: 130 },
  { field: "player2", headerName: "Player2", width: 130 },
  { field: "scoreP1", headerName: "Score P1", width: 130 },
  { field: "scoreP2", headerName: "Score P2", width: 130 },
  { field: "duration", headerName: "Duration", width: 130 },
  { field: "winner", headerName: "Winner", width: 130 },
  { field: "date", headerName: "Date", width: 200 },
];

export default function HistoryGame({ user }: { user: UserInterface }) {
  const [games, setGames] = useState<GameInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGames = games.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (typeof user === "undefined" || !user.id) return;
    async function fetchAndSetFriendsProfile() {
      const gamesFetched = await getHistoryGames(user.id);
      // console.log(gamesFetched);
      if ("error" in gamesFetched) {
        // console.log(res);
      } else {
        setGames(gamesFetched);
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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const calculDuration = (dateStart: Date, dateEnd: Date) => {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const diff = Math.abs(end.getTime() - start.getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return minutes + "min " + seconds + "s";
  };

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return (
    <>
      <Sticker dataText="Games" />
      <div className="flex justify-center items-center w-full pb-3 px-4 md:px-0  ">
        {games && games.length == 0 && (
          <div className="w-full h-full flex justify-center items-center text-2xl text-gray-500">
            No history games
          </div>
        )}
        {games && games.length > 0 && (
          <div className="overflow-x-auto overflow-auto  w-full m-5  shadow-custom">
            {" "}
            <div className="align-middle text-xs inline-block min-w-full bg-white  rounded-lg">
              <table className="min-w-full">
                <thead className="h-16">
                  <tr>
                    <th className="px-6 py-3  hidden md:table-cell border-t-2 border-r-2 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Id
                    </th>
                    <th className="px-6 py-3 border-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Status
                    </th>
                    <th className="px-6 w-8 py-3 border-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Player1
                    </th>
                    <th className="px-6 py-3 border-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Player2
                    </th>
                    <th className="px-6 py-3 border-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Score P1
                    </th>
                    <th className="px-6 py-3 border-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Score P2
                    </th>
                    <th className="px-6 py-3 border-2 hidden md:table-cell border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 border-2 hidden md:table-cell  border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Winner
                    </th>
                    <th className="px-6 py-3 border-b-2 border-l-2 border-t-2 hidden md:table-cell border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white shadow-custom overflow-y-auto h-[560px]">
                  {currentGames.map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                    >
                      <td className="px-6 py-4 hidden md:table-cell whitespace-nowrap border-t border-r border-b border-gray-200">
                        {row.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border whitespace-no-wrap border-gray-200">
                        {row.status}
                      </td>
                      <td className="px-6 w-8 py-4 whitespace-nowrap border whitespace-no-wrap border-gray-200">
                        {row.player1 ? row.player1.login : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border whitespace-no-wrap border-gray-200">
                        {row.player2 ? row.player2.login : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border whitespace-no-wrap border-gray-200">
                        {row.scorePlayer1 ? row.scorePlayer1 : "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border whitespace-no-wrap border-gray-200">
                        {row.scorePlayer2 ? row.scorePlayer2 : "0"}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell  whitespace-nowrap border whitespace-no-wrap border-gray-200">
                        {row.finishAt
                          ? calculDuration(row.createdAt, row.finishAt)
                          : row.status}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell  whitespace-nowrap  border border-gray-200">
                        {row.winner ? row.winner.login : row.status}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell  border-l border-b border-t border-gray-200">
                        {new Date(row.createdAt).toLocaleString(
                          "fr-FR",
                          options
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 mx-2 border border-gray-300 cursor-pointer hover:bg-[var(--color-tertiary)] rounded-full transition duration-300 ease-in-out text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary)]"
        >
          «
        </button>
        {Array.from(
          { length: Math.ceil(games.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`w-10 h-10 mx-2 border border-gray-300 cursor-pointer hover:bg-[var(--color-tertiary)] rounded-full transition duration-300 ease-in-out ${
                currentPage === index + 1
                  ? "bg-[var(--color-primary)] text-gray-800"
                  : "bg-[var(--background-color)]"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(games.length / itemsPerPage)}
          className="w-10 h-10 mx-2 border border-gray-300 cursor-pointer hover:bg-[var(--color-tertiary)] rounded-full transition duration-300 ease-in-out text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary)]"
        >
          »
        </button>
      </div>
    </>
  );
}
