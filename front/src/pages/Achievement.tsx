import { useEffect, useState } from 'react';
import { TrophyInterface } from '../types/TrophiesTypes';
import { getAllTrophies, getUserIdTrophies } from '../api/trophies';
import { ApiErrorResponse, UserInterface } from '../types';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar } from '../store/snackbarSlice';
import { TrophyCard } from '../components/Profile/TrophyCard';
import { Sticker } from '../utils/StyledTitle';
import { useParams } from 'react-router-dom';
import { getTrophiesProgressByPseudo } from '../api/user';

const Achievement = () => {
  const dispatch = useDispatch();
  const { login } = useParams<{ login: string }>();
  const [allTrophies, setAllTrophies] = useState<TrophyInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof login === 'undefined') return;

      const fetchUserTrophies: TrophyInterface[] | ApiErrorResponse =
        await getUserIdTrophies(login ? login : null);
      if ('error' in fetchUserTrophies)
        return dispatch(setErrorSnackbar(fetchUserTrophies));

      const fetchAllTrophies: TrophyInterface[] | ApiErrorResponse =
        await getAllTrophies();
      if ('error' in fetchAllTrophies)
        dispatch(setErrorSnackbar(fetchAllTrophies));
      else {
        const profilesFetched: UserInterface | ApiErrorResponse =
          await getTrophiesProgressByPseudo(login);

        if ('error' in profilesFetched)
          dispatch(setErrorSnackbar(profilesFetched));
        else {
          const trophiesProgress = profilesFetched.trophiesProgress;
          const tmp: TrophyInterface[] = (fetchAllTrophies as TrophyInterface[])
            .map(t =>
              fetchUserTrophies.find(ut => ut.id === t.id)
                ? { ...t, isHeld: true }
                : { ...t, isHeld: false },
            )
            .map(t =>
              trophiesProgress?.find(tp => tp.trophy.id === t.id)
                ? {
                    ...t,
                    progress:
                      trophiesProgress.find(tp => tp.trophy.id === t.id)
                        ?.progress ?? 0,
                  }
                : { ...t, progress: 0 },
            )
            .sort((a, b) =>
              a.isHeld == true
                ? -1
                : b.isHeld == true
                ? 1
                : a.name.localeCompare(b.name),
            );
          setAllTrophies(tmp);
        }
      }
    };
    fetchData();
  }, [dispatch, login]);

  return (
    <>
      <p className="mt-2">
        <Sticker dataText={'Achievements'} />
      </p>
      <p className="text-center  text-4xl  font-bold mb-5 mt-5"> {login} </p>
      <div className="flex flex-wrap justify-center bg-inherit">
        {allTrophies.map(trophy => (
          <TrophyCard key={trophy.id} trophy={trophy} />
        ))}
      </div>
    </>
  );
};

export default Achievement;
