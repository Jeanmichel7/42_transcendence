import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/leaderBoard';
import { UserInterface } from '../types';

const LeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState<UserInterface[]>([]);
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      const resFatchLeaderBoard = await getLeaderboard(page, offset);
      if ('error' in resFatchLeaderBoard)
        return console.warn(resFatchLeaderBoard.error);
      setLeaderBoard(prev => [...prev, ...resFatchLeaderBoard]);
    };
    fetchLeaderBoard();
  }, []);

  return (
    <div className="bg-[var(--background-color)] ">
      <div className="flex items-center justify-around z-10">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 490 490"
          xmlSpace="preserve"
          className="relative w-1/12 top-0 left-0  pt-8"
        >
          <g>
            <g id="XMLID_47_">
              <g>
                <rect
                  x="220"
                  y="200"
                  style={{ fill: '#F9A845' }}
                  width="50"
                  height="180"
                />
                <rect
                  x="160"
                  y="415"
                  style={{ fill: '#E7ECED' }}
                  width="170"
                  height="65"
                />
                <path
                  style={{ fill: '#AFB6BB' }}
                  d="M365,400v80h-35v-65H160v65h-35v-80c0-10.996,9.004-20,20-20h75h50h75
				C355.996,380,365,389.004,365,400z"
                />
                <path
                  style={{ fill: '#FFD248' }}
                  d="M380,180c0,10.996-9.004,20-20,20h-90h-50h-90c-10.996,0-20-9.004-20-20V10h270V180z"
                />
              </g>
              <g>
                <rect
                  x="205"
                  y="440"
                  style={{ fill: '#231F20' }}
                  width="80"
                  height="20"
                />
                <path
                  style={{ fill: '#231F20' }}
                  d="M155,55h20V35h-30c-5.523,0-10,4.478-10,10v35h20V55z"
                />
                <rect
                  x="135"
                  y="95"
                  style={{ fill: '#231F20' }}
                  width="20"
                  height="20"
                />
                <path
                  style={{ fill: '#231F20' }}
                  d="M440,0H50c-5.522,0-10,4.477-10,10v105c0,0.474,0.033,0.945,0.101,1.414
				c0.173,1.213,1.98,12.157,11.946,22.891c13.055,14.058,31.857,18.984,47.953,20.294V180c0,16.542,13.458,30,30,30h80v160h-65
				c-16.542,0-30,13.458-30,30v70H90v20h310v-20h-25v-70c0-16.542-13.458-30-30-30h-65V210h80c16.542,0,30-13.458,30-30v-20.401
				c16.096-1.31,34.898-6.236,47.953-20.294c9.966-10.733,11.773-21.678,11.946-22.891c0.067-0.469,0.101-0.94,0.101-1.414V10
				C450,4.477,445.522,0,440,0z M67.484,126.509c-5.367-5.396-7.056-10.783-7.484-12.512V20h40v119.531
				C85.788,138.149,74.658,133.72,67.484,126.509z M320,470H170v-45h150V470z M355,400v70h-15v-55c0-5.522-4.478-10-10-10H160
				c-5.523,0-10,4.478-10,10v55h-15v-70c0-5.514,4.486-10,10-10h200C350.514,390,355,394.486,355,400z M230,370V210h30v160H230z
				 M370,180c0,5.514-4.486,10-10,10H130c-5.514,0-10-4.486-10-10V20h250V180z M430,113.997c-0.429,1.729-2.117,7.116-7.484,12.512
				c-7.174,7.211-18.304,11.641-32.516,13.022V20h40V113.997z"
                />
              </g>
            </g>
          </g>
        </svg>

        <div className="relative mb-5 mt-5">
          <h1 className="text-8xl border-2 border-black text-center   bg-blue-500 -skew-x-12 rounded-lg relative z-10 text-white">
            Leaderboard
          </h1>
          <div className="absolute top-2 left-2  w-full h-full bg-black  rounded-lg z-0 -skew-x-12"></div>
        </div>

        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 490 490"
          xmlSpace="preserve"
          className=" relative w-1/12 top-0 left-0  pt-8"
        >
          <g>
            <g id="XMLID_47_">
              <g>
                <rect
                  x="220"
                  y="200"
                  style={{ fill: '#F9A845' }}
                  width="50"
                  height="180"
                />
                <rect
                  x="160"
                  y="415"
                  style={{ fill: '#E7ECED' }}
                  width="170"
                  height="65"
                />
                <path
                  style={{ fill: '#AFB6BB' }}
                  d="M365,400v80h-35v-65H160v65h-35v-80c0-10.996,9.004-20,20-20h75h50h75
				C355.996,380,365,389.004,365,400z"
                />
                <path
                  style={{ fill: '#FFD248' }}
                  d="M380,180c0,10.996-9.004,20-20,20h-90h-50h-90c-10.996,0-20-9.004-20-20V10h270V180z"
                />
              </g>
              <g>
                <rect
                  x="205"
                  y="440"
                  style={{ fill: '#231F20' }}
                  width="80"
                  height="20"
                />
                <path
                  style={{ fill: '#231F20' }}
                  d="M155,55h20V35h-30c-5.523,0-10,4.478-10,10v35h20V55z"
                />
                <rect
                  x="135"
                  y="95"
                  style={{ fill: '#231F20' }}
                  width="20"
                  height="20"
                />
                <path
                  style={{ fill: '#231F20' }}
                  d="M440,0H50c-5.522,0-10,4.477-10,10v105c0,0.474,0.033,0.945,0.101,1.414
				c0.173,1.213,1.98,12.157,11.946,22.891c13.055,14.058,31.857,18.984,47.953,20.294V180c0,16.542,13.458,30,30,30h80v160h-65
				c-16.542,0-30,13.458-30,30v70H90v20h310v-20h-25v-70c0-16.542-13.458-30-30-30h-65V210h80c16.542,0,30-13.458,30-30v-20.401
				c16.096-1.31,34.898-6.236,47.953-20.294c9.966-10.733,11.773-21.678,11.946-22.891c0.067-0.469,0.101-0.94,0.101-1.414V10
				C450,4.477,445.522,0,440,0z M67.484,126.509c-5.367-5.396-7.056-10.783-7.484-12.512V20h40v119.531
				C85.788,138.149,74.658,133.72,67.484,126.509z M320,470H170v-45h150V470z M355,400v70h-15v-55c0-5.522-4.478-10-10-10H160
				c-5.523,0-10,4.478-10,10v55h-15v-70c0-5.514,4.486-10,10-10h200C350.514,390,355,394.486,355,400z M230,370V210h30v160H230z
				 M370,180c0,5.514-4.486,10-10,10H130c-5.514,0-10-4.486-10-10V20h250V180z M430,113.997c-0.429,1.729-2.117,7.116-7.484,12.512
				c-7.174,7.211-18.304,11.641-32.516,13.022V20h40V113.997z"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div className="overflow-x-auto bg-gray-100 shadow-xl rounded-xl p-3 ml-10 mr-10">
        <table className="min-w-full bg-yellow-400 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderBoard.map((user, index) => {
              let colorClass;
              if (index === 0) {
                colorClass = 'bg-yellow-400 text-black'; // Or
              } else if (index === 1) {
                colorClass = 'bg-gray-300 text-black'; // Argent
              } else if (index === 2) {
                colorClass = 'bg-orange-500 text-white'; // Bronze
              } else {
                colorClass = 'bg-yellow-900 text-white'; // Cuivre
              }

              return (
                <tr
                  key={index}
                  className={`${colorClass} transform hover:scale-105 transition-transform duration-200`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-2xl font-bold">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.firstName + ' ' + user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.score.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
