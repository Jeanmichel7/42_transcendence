--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    id bigint NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "ownerUserId" bigint,
    "roomId" bigint
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_messages_id_seq OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: chat_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms (
    id bigint NOT NULL,
    type text DEFAULT 'public'::text NOT NULL,
    name text DEFAULT 'room'::text NOT NULL,
    password text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "ownerUserId" bigint,
    "isProtected" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.chat_rooms OWNER TO postgres;

--
-- Name: chat_rooms_accepted_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms_accepted_users_users (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public.chat_rooms_accepted_users_users OWNER TO postgres;

--
-- Name: chat_rooms_admins_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms_admins_users (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public.chat_rooms_admins_users OWNER TO postgres;

--
-- Name: chat_rooms_banned_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms_banned_users_users (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public.chat_rooms_banned_users_users OWNER TO postgres;

--
-- Name: chat_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_rooms_id_seq OWNER TO postgres;

--
-- Name: chat_rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_rooms_id_seq OWNED BY public.chat_rooms.id;


--
-- Name: chat_rooms_muted_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms_muted_users_users (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public.chat_rooms_muted_users_users OWNER TO postgres;

--
-- Name: chat_rooms_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms_users_users (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public.chat_rooms_users_users OWNER TO postgres;

--
-- Name: games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.games (
    id bigint NOT NULL,
    status text DEFAULT 'in progress'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "finishAt" timestamp without time zone DEFAULT now(),
    "abortedAt" timestamp without time zone DEFAULT now(),
    "scorePlayer1" integer DEFAULT 0,
    "scorePlayer2" integer DEFAULT 0,
    "player1Id" bigint,
    "player2Id" bigint,
    "winnerId" bigint,
    "updatedAt" timestamp without time zone DEFAULT now(),
    "eloScorePlayer1" integer DEFAULT 1500 NOT NULL,
    "eloScorePlayer2" integer DEFAULT 1500 NOT NULL,
    "levelPlayer1" integer DEFAULT 1 NOT NULL,
    "levelPlayer2" integer DEFAULT 1 NOT NULL,
    "expPlayer1" integer DEFAULT 0 NOT NULL,
    "expPlayer2" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.games OWNER TO postgres;

--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_id_seq OWNER TO postgres;

--
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "ownerUserId" bigint,
    "destUserId" bigint
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "senderId" bigint,
    "receiverId" bigint,
    "invitationLink" text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: trophies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trophies (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    "imagePath" text NOT NULL,
    total integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.trophies OWNER TO postgres;

--
-- Name: trophies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trophies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trophies_id_seq OWNER TO postgres;

--
-- Name: trophies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trophies_id_seq OWNED BY public.trophies.id;


--
-- Name: trophies_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trophies_progress (
    id integer NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    total integer NOT NULL,
    "userId" bigint,
    "trophyId" integer
);


ALTER TABLE public.trophies_progress OWNER TO postgres;

--
-- Name: trophies_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trophies_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trophies_progress_id_seq OWNER TO postgres;

--
-- Name: trophies_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trophies_progress_id_seq OWNED BY public.trophies_progress.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    login text NOT NULL,
    email text NOT NULL,
    password text,
    role text DEFAULT 'user'::text NOT NULL,
    avatar text,
    description text,
    "is2FAEnabled" boolean DEFAULT false,
    status text DEFAULT 'offline'::text,
    "secret2FA" text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "lastActivity" timestamp without time zone DEFAULT now(),
    score double precision DEFAULT '1500'::double precision NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    experience integer DEFAULT 0 NOT NULL,
    "gamesPlayed" integer DEFAULT 0 NOT NULL,
    "consecutiveWin" integer DEFAULT 0 NOT NULL,
    "laserKill" integer DEFAULT 0 NOT NULL,
    "bonusUsed" integer DEFAULT 0 NOT NULL,
    "numberOfConsecutiveWins" integer DEFAULT 0 NOT NULL,
    "numberOfEnemiesKilledWithLaser" integer DEFAULT 0 NOT NULL,
    "numberOfGamesPlayed" integer DEFAULT 0 NOT NULL,
    "numberOfGamesWonWithoutMissingBall" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_relation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."users_relation" (
    id integer NOT NULL,
    "relationType" text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "userRelationId" bigint,
    "mutuelBlocked" boolean DEFAULT false NOT NULL,
    "userInitiateurId" bigint
);


ALTER TABLE public."users_relation" OWNER TO postgres;

--
-- Name: users_relation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."users_relation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."users_relation_id_seq" OWNER TO postgres;

--
-- Name: users_relation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."users_relation_id_seq" OWNED BY public."users_relation".id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_trophies_trophies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_trophies_trophies (
    "usersId" bigint NOT NULL,
    "trophiesId" integer NOT NULL
);


ALTER TABLE public.users_trophies_trophies OWNER TO postgres;

--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: chat_rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms ALTER COLUMN id SET DEFAULT nextval('public.chat_rooms_id_seq'::regclass);


--
-- Name: games id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: trophies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trophies ALTER COLUMN id SET DEFAULT nextval('public.trophies_id_seq'::regclass);


--
-- Name: trophies_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trophies_progress ALTER COLUMN id SET DEFAULT nextval('public.trophies_progress_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_relation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users_relation" ALTER COLUMN id SET DEFAULT nextval('public."users_relation_id_seq"'::regclass);


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, text, "createdAt", "updatedAt", "ownerUserId", "roomId") FROM stdin;
236	Invitation link http://localhost:3006/chat/channel/invitation/59/Private	2023-06-19 18:25:17.004831	2023-06-19 18:25:17.004831	0	59
268	22	2023-06-19 18:55:12.375071	2023-06-19 18:55:12.375071	25	59
237	salut	2023-06-19 18:25:22.320812	2023-06-19 18:25:22.320812	25	59
238	aaaah	2023-06-19 18:25:27.619965	2023-06-19 18:25:27.619965	25	59
290	14	2023-06-19 18:55:45.013792	2023-06-19 18:55:45.013792	29	59
239	jrasser has join the room	2023-06-19 18:25:45.948864	2023-06-19 18:25:45.948864	0	59
269	23	2023-06-19 18:55:13.037022	2023-06-19 18:55:13.037022	25	59
366	Invitation link http://localhost:3006/chat/channel/invitation/61/zxcvbnm	2023-06-20 17:01:34.259329	2023-06-20 17:01:34.259329	0	61
242	et toi ?	2023-06-19 18:26:05.094693	2023-06-19 18:26:05.094693	25	59
270	24	2023-06-19 18:55:13.661339	2023-06-19 18:55:13.661339	25	59
372	Grayce_Dach has been kicked	2023-06-20 17:20:43.544218	2023-06-20 17:20:43.544218	0	62
244	Laron76 has join the room	2023-06-19 18:27:39.227585	2023-06-19 18:27:39.227585	0	59
245	hello	2023-06-19 18:27:44.956499	2023-06-19 18:27:44.956499	29	59
271	25	2023-06-19 18:55:14.219712	2023-06-19 18:55:14.219712	25	59
246	grrrrr	2023-06-19 18:27:52.089065	2023-06-19 18:27:52.089065	29	59
247	1	2023-06-19 18:54:58.587237	2023-06-19 18:54:58.587237	25	59
291	15	2023-06-19 18:55:45.676477	2023-06-19 18:55:45.676477	29	59
248	2	2023-06-19 18:54:59.245851	2023-06-19 18:54:59.245851	25	59
272	26	2023-06-19 18:55:14.719977	2023-06-19 18:55:14.719977	25	59
249	3	2023-06-19 18:54:59.734324	2023-06-19 18:54:59.734324	25	59
250	4	2023-06-19 18:55:00.196378	2023-06-19 18:55:00.196378	25	59
251	5	2023-06-19 18:55:00.653943	2023-06-19 18:55:00.653943	25	59
273	27	2023-06-19 18:55:15.335207	2023-06-19 18:55:15.335207	25	59
252	6	2023-06-19 18:55:01.14358	2023-06-19 18:55:01.14358	25	59
253	7	2023-06-19 18:55:01.540822	2023-06-19 18:55:01.540822	25	59
367	Grayce_Dach has join the room	2023-06-20 17:02:37.3697	2023-06-20 17:02:37.3697	0	61
254	8	2023-06-19 18:55:01.909726	2023-06-19 18:55:01.909726	25	59
274	28	2023-06-19 18:55:15.806459	2023-06-19 18:55:15.806459	25	59
255	9	2023-06-19 18:55:02.302008	2023-06-19 18:55:02.302008	25	59
256	10	2023-06-19 18:55:03.064366	2023-06-19 18:55:03.064366	25	59
292	16	2023-06-19 18:55:46.340417	2023-06-19 18:55:46.340417	29	59
257	11	2023-06-19 18:55:03.769767	2023-06-19 18:55:03.769767	25	59
275	29	2023-06-19 18:55:16.357202	2023-06-19 18:55:16.357202	25	59
258	12	2023-06-19 18:55:04.31731	2023-06-19 18:55:04.31731	25	59
259	13	2023-06-19 18:55:04.909535	2023-06-19 18:55:04.909535	25	59
260	14	2023-06-19 18:55:05.502448	2023-06-19 18:55:05.502448	25	59
276	30	2023-06-19 18:55:17.118492	2023-06-19 18:55:17.118492	25	59
261	15	2023-06-19 18:55:06.037428	2023-06-19 18:55:06.037428	25	59
262	16	2023-06-19 18:55:06.604627	2023-06-19 18:55:06.604627	25	59
263	17	2023-06-19 18:55:09.377271	2023-06-19 18:55:09.377271	25	59
277	1	2023-06-19 18:55:37.341952	2023-06-19 18:55:37.341952	29	59
264	18	2023-06-19 18:55:09.958845	2023-06-19 18:55:09.958845	25	59
265	19	2023-06-19 18:55:10.621424	2023-06-19 18:55:10.621424	25	59
293	17	2023-06-19 18:55:47.021307	2023-06-19 18:55:47.021307	29	59
266	20	2023-06-19 18:55:11.213136	2023-06-19 18:55:11.213136	25	59
278	2	2023-06-19 18:55:37.807755	2023-06-19 18:55:37.807755	29	59
267	21	2023-06-19 18:55:11.781727	2023-06-19 18:55:11.781727	25	59
279	3	2023-06-19 18:55:38.279167	2023-06-19 18:55:38.279167	29	59
280	4	2023-06-19 18:55:38.860595	2023-06-19 18:55:38.860595	29	59
294	18	2023-06-19 18:55:49.266604	2023-06-19 18:55:49.266604	29	59
281	5	2023-06-19 18:55:39.429659	2023-06-19 18:55:39.429659	29	59
282	6	2023-06-19 18:55:39.942824	2023-06-19 18:55:39.942824	29	59
283	7	2023-06-19 18:55:40.485346	2023-06-19 18:55:40.485346	29	59
295	19	2023-06-19 18:55:49.936366	2023-06-19 18:55:49.936366	29	59
284	8	2023-06-19 18:55:40.998573	2023-06-19 18:55:40.998573	29	59
285	9	2023-06-19 18:55:41.501649	2023-06-19 18:55:41.501649	29	59
286	10	2023-06-19 18:55:42.260309	2023-06-19 18:55:42.260309	29	59
296	20	2023-06-19 18:55:50.578832	2023-06-19 18:55:50.578832	29	59
287	11	2023-06-19 18:55:42.963526	2023-06-19 18:55:42.963526	29	59
288	12	2023-06-19 18:55:43.653793	2023-06-19 18:55:43.653793	29	59
289	13	2023-06-19 18:55:44.358478	2023-06-19 18:55:44.358478	29	59
368	Invitation link http://localhost:3006/chat/channel/invitation/62/ffffffffffffffffffffffffffffffffffff	2023-06-20 17:04:01.423801	2023-06-20 17:04:01.423801	0	62
316	1	2023-06-19 18:56:52.660877	2023-06-19 18:56:52.660877	25	59
369	Grayce_Dach has join the room	2023-06-20 17:15:52.003972	2023-06-20 17:15:52.003972	0	62
373	Invitation link http://localhost:3006/chat/channel/invitation/63/aaaaaaaaaaaa	2023-06-20 17:21:26.218225	2023-06-20 17:21:26.218225	0	63
370	Laron76 has join the room	2023-06-20 17:20:05.660834	2023-06-20 17:20:05.660834	0	62
371	Laron76 has been kicked	2023-06-20 17:20:31.546723	2023-06-20 17:20:31.546723	0	62
376	Grayce_Dach has join the room	2023-06-20 17:25:39.889105	2023-06-20 17:25:39.889105	0	63
374	Laron76 has join the room	2023-06-20 17:21:34.86028	2023-06-20 17:21:34.86028	0	63
319	4	2023-06-19 18:56:54.457385	2023-06-19 18:56:54.457385	25	59
317	2	2023-06-19 18:56:53.319441	2023-06-19 18:56:53.319441	25	59
321	6	2023-06-19 18:57:11.06218	2023-06-19 18:57:11.06218	29	59
318	3	2023-06-19 18:56:53.896979	2023-06-19 18:56:53.896979	25	59
320	5	2023-06-19 18:56:55.040122	2023-06-19 18:56:55.040122	25	59
322	7	2023-06-19 18:57:11.618265	2023-06-19 18:57:11.618265	29	59
323	8	2023-06-19 18:57:12.250869	2023-06-19 18:57:12.250869	29	59
324	9	2023-06-19 18:57:12.875549	2023-06-19 18:57:12.875549	29	59
325	10	2023-06-19 18:57:13.880995	2023-06-19 18:57:13.880995	29	59
375	Invitation link http://localhost:3006/chat/channel/invitation/64/bbbbbbbbbb	2023-06-20 17:23:57.263584	2023-06-20 17:23:57.263584	0	64
377	dsfsdsfd	2023-06-20 17:28:54.051256	2023-06-20 17:28:54.051256	35	64
379	Laron76 has join the room	2023-06-20 17:29:08.096698	2023-06-20 17:29:08.096698	0	65
378	Invitation link http://localhost:3006/chat/channel/invitation/65/ZZZZZZZZZ	2023-06-20 17:29:03.561083	2023-06-20 17:29:03.561083	0	65
380	Grayce_Dach has join the room	2023-06-20 17:29:14.327666	2023-06-20 17:29:14.327666	0	65
381	Invitation link http://localhost:3006/chat/channel/invitation/66/SSSSSSSSSS	2023-06-20 17:30:42.997129	2023-06-20 17:30:42.997129	0	66
382	Laron76 has join the room	2023-06-20 17:30:46.853643	2023-06-20 17:30:46.853643	0	66
383	jrasser has join the room	2023-06-20 17:30:54.106462	2023-06-20 17:30:54.106462	0	66
384	Invitation link http://localhost:3006/chat/channel/invitation/67/VVVVVVVVVV	2023-06-20 17:32:20.180852	2023-06-20 17:32:20.180852	0	67
385	jrasser has join the room	2023-06-20 17:32:24.506705	2023-06-20 17:32:24.506705	0	67
386	slt	2023-06-20 17:32:28.995395	2023-06-20 17:32:28.995395	35	67
387	Laron76 has join the room	2023-06-20 17:32:48.8318	2023-06-20 17:32:48.8318	0	67
392	jrasser has left the room	2023-06-20 17:35:47.614686	2023-06-20 17:35:47.614686	0	69
417	asds	2023-06-20 18:31:00.504198	2023-06-20 18:31:00.504198	29	76
388	Invitation link http://localhost:3006/chat/channel/invitation/68/pUBLIC	2023-06-20 17:33:56.921844	2023-06-20 17:33:56.921844	0	68
389	Invitation link http://localhost:3006/chat/channel/invitation/69/DFDFSFDSF	2023-06-20 17:34:05.499708	2023-06-20 17:34:05.499708	0	69
390	jrasser has join the room	2023-06-20 17:34:09.135562	2023-06-20 17:34:09.135562	0	69
431	Laron76 has join the room	2023-06-20 18:55:42.420504	2023-06-20 18:55:42.420504	0	78
391	jrasser has join the room	2023-06-20 17:34:11.342082	2023-06-20 17:34:11.342082	0	68
438	Grayce_Dach has been unmuted	2023-06-20 19:08:12.079363	2023-06-20 19:08:12.079363	0	78
473	Grayce_Dach has join the room	2023-06-20 19:33:13.673984	2023-06-20 19:33:13.673984	0	78
444	Laron76 has left the room	2023-06-20 19:18:09.248009	2023-06-20 19:18:09.248009	0	78
446	bah	2023-06-20 19:18:30.413845	2023-06-20 19:18:30.413845	29	78
447	Laron76 has left the room	2023-06-20 19:18:35.193496	2023-06-20 19:18:35.193496	0	78
483	Invitation link http://localhost:3006/chat/channel/invitation/79/BLABLA	2023-06-20 20:00:44.369331	2023-06-20 20:00:44.369331	0	79
452	Grayce_Dach has left the room	2023-06-20 19:23:00.956443	2023-06-20 19:23:00.956443	0	78
460	bla	2023-06-20 19:32:16.098524	2023-06-20 19:32:16.098524	32	78
519	Randi.Bruen-Lakin has join the room	2023-06-20 21:27:34.175358	2023-06-20 21:27:34.175358	0	80
461	Grayce_Dach has left the room	2023-06-20 19:32:18.587697	2023-06-20 19:32:18.587697	0	78
484	Laron76 has join the room	2023-06-20 20:00:51.083513	2023-06-20 20:00:51.083513	0	79
485	Grayce_Dach has join the room	2023-06-20 20:00:51.980306	2023-06-20 20:00:51.980306	0	79
499	Laron76 has left the room	2023-06-20 20:08:55.013037	2023-06-20 20:08:55.013037	0	79
525	Grayce_Dach has join the room	2023-06-20 21:30:44.801879	2023-06-20 21:30:44.801879	0	80
505	Randi.Bruen-Lakin has left the room	2023-06-20 20:48:18.48782	2023-06-20 20:48:18.48782	0	79
515	fgdfdgfdgf dgfdgfddg	2023-06-20 20:57:30.372708	2023-06-20 20:57:30.372708	27	80
594	Invitation link http://localhost:3006/chat/channel/invitation/83/ouiiiiiiiiiiiiiiiiiiiiiiiiiii	2023-06-20 22:42:14.980816	2023-06-20 22:42:14.980816	0	83
516	dg fdgfdg	2023-06-20 20:57:33.436236	2023-06-20 20:57:33.436236	35	80
535	Randi.Bruen-Lakin has join the room	2023-06-20 22:04:44.265835	2023-06-20 22:04:44.265835	0	80
547	ssdfdsdf	2023-06-20 22:22:15.431892	2023-06-20 22:22:15.431892	27	80
575	Grayce_Dach has been kicked	2023-06-20 22:26:14.707489	2023-06-20 22:26:14.707489	0	80
606	gggg	2023-06-20 23:40:13.395104	2023-06-20 23:40:13.395104	32	70
582	Randi.Bruen-Lakin has join the room	2023-06-20 22:29:02.707021	2023-06-20 22:29:02.707021	0	82
593	Randi.Bruen-Lakin has join the room	2023-06-20 22:41:41.33696	2023-06-20 22:41:41.33696	0	82
733	Laron76 has join the room	2023-06-21 13:01:52.931154	2023-06-21 13:01:52.931154	0	84
615	f dsf sdf f	2023-06-20 23:45:26.768209	2023-06-20 23:45:26.768209	29	83
631	dds fs sdf fsdf f	2023-06-20 23:49:18.990013	2023-06-20 23:49:18.990013	29	68
815	Grayce_Dach has join the room	2023-06-21 14:19:56.023244	2023-06-21 14:19:56.023244	0	85
632	fdfddfdfdffdf	2023-06-20 23:49:20.961895	2023-06-20 23:49:20.961895	29	68
734	sad sadsad	2023-06-21 13:01:55.435349	2023-06-21 13:01:55.435349	29	84
657	oiudfgh	2023-06-21 00:28:07.766485	2023-06-21 00:28:07.766485	29	68
658	kjhgfdcdfghjkl	2023-06-21 00:28:12.263713	2023-06-21 00:28:12.263713	35	78
744	ok	2023-06-21 13:23:49.270443	2023-06-21 13:23:49.270443	29	68
690	fgds dg sdgs	2023-06-21 00:47:36.578783	2023-06-21 00:47:36.578783	32	69
692	sdf	2023-06-21 00:47:48.393077	2023-06-21 00:47:48.393077	29	68
779	Grayce_Dach has join the room	2023-06-21 13:51:00.904709	2023-06-21 13:51:00.904709	0	85
693	sdf	2023-06-21 00:47:50.76871	2023-06-21 00:47:50.76871	32	68
745	Grayce_Dach has join the room	2023-06-21 13:23:53.723941	2023-06-21 13:23:53.723941	0	84
707	Grayce_Dach has join the room	2023-06-21 00:49:14.340912	2023-06-21 00:49:14.340912	0	68
708	Grayce_Dach has left the room	2023-06-21 00:49:21.778871	2023-06-21 00:49:21.778871	0	68
709	Grayce_Dach has join the room	2023-06-21 00:49:23.409063	2023-06-21 00:49:23.409063	0	68
751	Grayce_Dach has join the room	2023-06-21 13:25:57.599905	2023-06-21 13:25:57.599905	0	84
710	Grayce_Dach has left the room	2023-06-21 00:49:24.956367	2023-06-21 00:49:24.956367	0	68
711	Grayce_Dach has join the room	2023-06-21 00:49:26.077567	2023-06-21 00:49:26.077567	0	68
792	ffhfh	2023-06-21 14:10:43.662946	2023-06-21 14:10:43.662946	35	69
721	jrasser has been kicked	2023-06-21 00:51:57.645987	2023-06-21 00:51:57.645987	0	68
755	Grayce_Dach has join the room	2023-06-21 13:44:04.970748	2023-06-21 13:44:04.970748	0	84
726	rg gfgdfg 	2023-06-21 12:25:40.028907	2023-06-21 12:25:40.028907	35	66
730	Invitation link http://localhost:3006/chat/channel/invitation/84/sdsaddd	2023-06-21 13:01:38.57539	2023-06-21 13:01:38.57539	0	84
780	Grayce_Dach has left the room	2023-06-21 13:51:02.894989	2023-06-21 13:51:02.894989	0	85
764	Invitation link http://localhost:3006/chat/channel/invitation/85/ttttttttttttttttttttttttttt	2023-06-21 13:45:39.876057	2023-06-21 13:45:39.876057	0	85
766	Grayce_Dach has join the room	2023-06-21 13:45:47.426792	2023-06-21 13:45:47.426792	0	85
771	sfres fesf 	2023-06-21 13:48:16.580304	2023-06-21 13:48:16.580304	35	85
781	Grayce_Dach has join the room	2023-06-21 13:51:04.416158	2023-06-21 13:51:04.416158	0	85
772	e fsef ef esf	2023-06-21 13:48:18.724258	2023-06-21 13:48:18.724258	29	85
782	Grayce_Dach has left the room	2023-06-21 13:51:05.781124	2023-06-21 13:51:05.781124	0	85
799	ok	2023-06-21 14:16:35.972477	2023-06-21 14:16:35.972477	35	68
783	Grayce_Dach has join the room	2023-06-21 13:51:07.271228	2023-06-21 13:51:07.271228	0	85
787	dfsdfsfdf	2023-06-21 13:53:18.738789	2023-06-21 13:53:18.738789	29	85
836	mm	2023-06-21 14:28:25.480788	2023-06-21 14:28:25.480788	35	84
800	nice	2023-06-21 14:16:38.45569	2023-06-21 14:16:38.45569	29	68
824	ffff	2023-06-21 14:21:28.670806	2023-06-21 14:21:28.670806	29	68
805	Laron76 has join the room	2023-06-21 14:17:59.295285	2023-06-21 14:17:59.295285	0	85
826	Grayce_Dach has join the room	2023-06-21 14:21:32.192139	2023-06-21 14:21:32.192139	0	68
825	Grayce_Dach has left the room	2023-06-21 14:21:30.527598	2023-06-21 14:21:30.527598	0	68
840	fgfdgdgfdg	2023-06-21 15:01:00.051376	2023-06-21 15:01:00.051376	29	85
844	dfgfdgfd	2023-06-21 15:08:47.959942	2023-06-21 15:08:47.959942	35	69
849	sdfds sdf sdf	2023-06-21 15:16:38.579804	2023-06-21 15:16:38.579804	29	69
850	dsf dsf sdfsdf sfd	2023-06-21 15:16:50.730143	2023-06-21 15:16:50.730143	35	69
851	ffffffff	2023-06-21 15:16:54.15089	2023-06-21 15:16:54.15089	32	69
858	fgffhgfhg gf hfgh	2023-06-21 15:18:29.361758	2023-06-21 15:18:29.361758	32	68
859	gggggg	2023-06-21 15:18:31.560705	2023-06-21 15:18:31.560705	29	68
860	Grayce_Dach has left the room	2023-06-21 15:18:33.686897	2023-06-21 15:18:33.686897	0	68
873	Grayce_Dach has left the room	2023-06-21 15:20:11.77374	2023-06-21 15:20:11.77374	0	85
876	Grayce_Dach has join the room	2023-06-21 15:20:42.858431	2023-06-21 15:20:42.858431	0	68
2027	1	2023-06-22 02:06:25.189327	2023-06-22 02:06:25.189327	35	85
393	jrasser has left the room	2023-06-20 17:35:49.215027	2023-06-20 17:35:49.215027	0	68
394	jrasser has join the room	2023-06-20 17:35:52.354396	2023-06-20 17:35:52.354396	0	68
395	jrasser has join the room	2023-06-20 17:35:54.137012	2023-06-20 17:35:54.137012	0	69
432	Grayce_Dach has left the room	2023-06-20 18:57:35.566295	2023-06-20 18:57:35.566295	0	78
1548	1	2023-06-22 01:19:04.761	2023-06-22 01:19:04.761	\N	89
396	jrasser has left the room	2023-06-20 17:36:23.561755	2023-06-20 17:36:23.561755	0	69
397	jrasser has join the room	2023-06-20 17:36:25.366039	2023-06-20 17:36:25.366039	0	69
398	Invitation link http://localhost:3006/chat/channel/invitation/70/PPPPPPPPPPPPPPPPPPPPPPP	2023-06-20 17:36:49.061022	2023-06-20 17:36:49.061022	0	70
439	Grayce_Dach has left the room	2023-06-20 19:13:56.800888	2023-06-20 19:13:56.800888	0	78
399	jrasser has join the room	2023-06-20 17:36:53.259654	2023-06-20 17:36:53.259654	0	70
400	cc	2023-06-20 17:36:57.346601	2023-06-20 17:36:57.346601	35	70
474	re	2023-06-20 19:33:16.996438	2023-06-20 19:33:16.996438	32	78
401	Grayce_Dach has join the room	2023-06-20 17:37:03.083881	2023-06-20 17:37:03.083881	0	70
445	Laron76 has join the room	2023-06-20 19:18:23.690999	2023-06-20 19:18:23.690999	0	78
453	Grayce_Dach has join the room	2023-06-20 19:24:15.327746	2023-06-20 19:24:15.327746	0	78
462	Grayce_Dach has join the room	2023-06-20 19:32:30.612062	2023-06-20 19:32:30.612062	0	78
475	c;est bon la ?	2023-06-20 19:33:21.173133	2023-06-20 19:33:21.173133	29	78
463	sdfsdfsdfsdf	2023-06-20 19:32:35.164634	2023-06-20 19:32:35.164634	29	78
464	dfdsfdsfds dsfd	2023-06-20 19:32:37.447935	2023-06-20 19:32:37.447935	35	78
520	Grayce_Dach has left the room	2023-06-20 21:28:01.129935	2023-06-20 21:28:01.129935	0	80
465	ffffff	2023-06-20 19:32:41.633426	2023-06-20 19:32:41.633426	35	78
476	Laron76 has left the room	2023-06-20 19:33:23.971066	2023-06-20 19:33:23.971066	0	78
466	ok	2023-06-20 19:32:46.922458	2023-06-20 19:32:46.922458	29	78
467	oue	2023-06-20 19:32:48.554257	2023-06-20 19:32:48.554257	29	78
486	hrllo	2023-06-20 20:01:01.202245	2023-06-20 20:01:01.202245	35	79
487	tchao	2023-06-20 20:01:04.404287	2023-06-20 20:01:04.404287	32	79
526	Randi.Bruen-Lakin has left the room	2023-06-20 21:32:04.861161	2023-06-20 21:32:04.861161	0	80
488	Grayce_Dach has left the room	2023-06-20 20:01:06.189972	2023-06-20 20:01:06.189972	0	79
500	Laron76 has join the room	2023-06-20 20:10:09.690749	2023-06-20 20:10:09.690749	0	79
595	Randi.Bruen-Lakin has join the room	2023-06-20 22:42:21.965937	2023-06-20 22:42:21.965937	0	83
506	Randi.Bruen-Lakin has join the room	2023-06-20 20:49:34.405872	2023-06-20 20:49:34.405872	0	79
527	Grayce_Dach has left the room	2023-06-20 21:32:07.191544	2023-06-20 21:32:07.191544	0	80
517	Laron76 has join the room	2023-06-20 20:58:35.992678	2023-06-20 20:58:35.992678	0	80
528	Laron76 has left the room	2023-06-20 21:32:08.569362	2023-06-20 21:32:08.569362	0	80
634	Grayce_Dach has join the room	2023-06-20 23:49:35.618528	2023-06-20 23:49:35.618528	0	68
536	Randi.Bruen-Lakin has left the room	2023-06-20 22:05:15.87953	2023-06-20 22:05:15.87953	0	80
597	Grayce_Dach has join the room	2023-06-20 22:42:45.900339	2023-06-20 22:42:45.900339	0	83
548	sdfsdffdsf	2023-06-20 22:23:47.038905	2023-06-20 22:23:47.038905	35	65
576	Invitation link http://localhost:3006/chat/channel/invitation/81/bnbnnbbnbnbbbn	2023-06-20 22:27:25.25437	2023-06-20 22:27:25.25437	0	81
578	Grayce_Dach has join the room	2023-06-20 22:27:42.165656	2023-06-20 22:27:42.165656	0	81
598	Randi.Bruen-Lakin has been muted this idiot	2023-06-20 22:42:50.447434	2023-06-20 22:42:50.447434	0	83
583	Grayce_Dach has been kicked	2023-06-20 22:29:37.467615	2023-06-20 22:29:37.467615	0	82
584	Laron76 has join the room	2023-06-20 22:30:00.705055	2023-06-20 22:30:00.705055	0	82
672	ll	2023-06-21 00:28:42.094132	2023-06-21 00:28:42.094132	32	68
585	Grayce_Dach has join the room	2023-06-20 22:30:01.945778	2023-06-20 22:30:01.945778	0	82
599	Randi.Bruen-Lakin has been kicked	2023-06-20 22:43:07.536149	2023-06-20 22:43:07.536149	0	83
635	Grayce_Dach has left the room	2023-06-20 23:49:37.518415	2023-06-20 23:49:37.518415	0	68
600	Randi.Bruen-Lakin has been unmuted	2023-06-20 22:43:10.53527	2023-06-20 22:43:10.53527	0	83
601	Grayce_Dach has been banned	2023-06-20 22:43:24.54625	2023-06-20 22:43:24.54625	0	83
660	lkjhgvghjkl]\\1	2023-06-21 00:28:25.552699	2023-06-21 00:28:25.552699	32	68
607	fgfd gdg 	2023-06-20 23:40:39.077083	2023-06-20 23:40:39.077083	29	83
636	Grayce_Dach has join the room	2023-06-20 23:49:38.60606	2023-06-20 23:49:38.60606	0	68
608	 fdgfd g dfg	2023-06-20 23:40:41.382278	2023-06-20 23:40:41.382278	32	70
609	d gdf gfdg fdg gfdg	2023-06-20 23:40:43.861647	2023-06-20 23:40:43.861647	35	69
616	Grayce_Dach has join the room	2023-06-20 23:46:16.672882	2023-06-20 23:46:16.672882	0	68
637	Grayce_Dach has left the room	2023-06-20 23:49:39.876259	2023-06-20 23:49:39.876259	0	68
617	Grayce_Dach has join the room	2023-06-20 23:46:17.805519	2023-06-20 23:46:17.805519	0	69
633	Grayce_Dach has left the room	2023-06-20 23:49:32.032708	2023-06-20 23:49:32.032708	0	68
666	l	2023-06-21 00:28:40.265796	2023-06-21 00:28:40.265796	32	68
638	Grayce_Dach has join the room	2023-06-20 23:49:41.329815	2023-06-20 23:49:41.329815	0	68
661	kf,jhv,jhv	2023-06-21 00:28:34.675997	2023-06-21 00:28:34.675997	32	68
639	Grayce_Dach has left the room	2023-06-20 23:49:46.558026	2023-06-20 23:49:46.558026	0	68
640	Grayce_Dach has join the room	2023-06-20 23:49:56.724069	2023-06-20 23:49:56.724069	0	68
659	kjhgfdsfghjkl;'	2023-06-21 00:28:17.787089	2023-06-21 00:28:17.787089	35	68
662	kjbkjbkjb	2023-06-21 00:28:37.603888	2023-06-21 00:28:37.603888	32	68
670	l	2023-06-21 00:28:41.411796	2023-06-21 00:28:41.411796	32	68
663	l	2023-06-21 00:28:39.479165	2023-06-21 00:28:39.479165	32	68
667	l	2023-06-21 00:28:40.764455	2023-06-21 00:28:40.764455	32	68
664	l	2023-06-21 00:28:39.767703	2023-06-21 00:28:39.767703	32	68
665	l	2023-06-21 00:28:40.029118	2023-06-21 00:28:40.029118	32	68
668	l	2023-06-21 00:28:40.955676	2023-06-21 00:28:40.955676	32	68
669	l	2023-06-21 00:28:41.201823	2023-06-21 00:28:41.201823	32	68
671	l	2023-06-21 00:28:41.873419	2023-06-21 00:28:41.873419	32	68
673	l	2023-06-21 00:28:42.342045	2023-06-21 00:28:42.342045	32	68
674	l	2023-06-21 00:28:42.558536	2023-06-21 00:28:42.558536	32	68
675	l	2023-06-21 00:28:42.8118	2023-06-21 00:28:42.8118	32	68
676	l	2023-06-21 00:28:43.04001	2023-06-21 00:28:43.04001	32	68
677	l	2023-06-21 00:28:43.275974	2023-06-21 00:28:43.275974	32	68
678	l	2023-06-21 00:28:43.694684	2023-06-21 00:28:43.694684	32	68
679	l	2023-06-21 00:28:43.920593	2023-06-21 00:28:43.920593	32	68
680	l	2023-06-21 00:28:44.145924	2023-06-21 00:28:44.145924	32	68
681	l	2023-06-21 00:28:44.411153	2023-06-21 00:28:44.411153	32	68
682	l	2023-06-21 00:28:44.66524	2023-06-21 00:28:44.66524	32	68
683	l	2023-06-21 00:28:44.919116	2023-06-21 00:28:44.919116	32	68
2028	1	2023-06-22 02:06:25.189	2023-06-22 02:06:25.189	35	85
684	l	2023-06-21 00:28:45.331432	2023-06-21 00:28:45.331432	32	68
402	sdfsdsdfdff	2023-06-20 17:37:06.528336	2023-06-20 17:37:06.528336	32	70
403	Invitation link http://localhost:3006/chat/channel/invitation/71/qweewqewqeqeqwe	2023-06-20 17:38:02.370585	2023-06-20 17:38:02.370585	0	71
404	Grayce_Dach has join the room	2023-06-20 17:38:24.070481	2023-06-20 17:38:24.070481	0	71
433	Grayce_Dach has join the room	2023-06-20 19:06:32.85378	2023-06-20 19:06:32.85378	0	78
405	Invitation link http://localhost:3006/chat/channel/invitation/72/DDDDDDDDDD	2023-06-20 17:52:38.383449	2023-06-20 17:52:38.383449	0	72
406	jrasser has join the room	2023-06-20 17:52:46.992809	2023-06-20 17:52:46.992809	0	72
2244	7	2023-06-22 02:27:10.8602	2023-06-22 02:27:10.8602	\N	\N
407	Invitation link http://localhost:3006/chat/channel/invitation/73/QWERTYUIO	2023-06-20 17:57:07.430458	2023-06-20 17:57:07.430458	0	73
440	Laron76 has left the room	2023-06-20 19:16:28.923586	2023-06-20 19:16:28.923586	0	78
408	jrasser has join the room	2023-06-20 17:57:12.479326	2023-06-20 17:57:12.479326	0	73
409	Invitation link http://localhost:3006/chat/channel/invitation/74/vvvvvvv	2023-06-20 18:00:37.184049	2023-06-20 18:00:37.184049	0	74
477	Laron76 has join the room	2023-06-20 19:37:17.492161	2023-06-20 19:37:17.492161	0	78
410	jrasser has join the room	2023-06-20 18:00:41.355702	2023-06-20 18:00:41.355702	0	74
448	Grayce_Dach has join the room	2023-06-20 19:18:47.233843	2023-06-20 19:18:47.233843	0	78
454	Grayce_Dach has left the room	2023-06-20 19:25:20.229763	2023-06-20 19:25:20.229763	0	78
468	bien	2023-06-20 19:32:55.255707	2023-06-20 19:32:55.255707	32	78
489	Grayce_Dach has join the room	2023-06-20 20:07:16.773699	2023-06-20 20:07:16.773699	0	79
469	bien bien	2023-06-20 19:32:58.115106	2023-06-20 19:32:58.115106	32	78
470	Grayce_Dach has left the room	2023-06-20 19:32:59.891059	2023-06-20 19:32:59.891059	0	78
521	Grayce_Dach has join the room	2023-06-20 21:28:19.367027	2023-06-20 21:28:19.367027	0	80
471	ah	2023-06-20 19:33:02.411843	2023-06-20 19:33:02.411843	29	78
490	Grayce_Dach has left the room	2023-06-20 20:07:19.661177	2023-06-20 20:07:19.661177	0	79
472	ok	2023-06-20 19:33:04.87667	2023-06-20 19:33:04.87667	35	78
491	Grayce_Dach has join the room	2023-06-20 20:07:26.876057	2023-06-20 20:07:26.876057	0	79
700	Grayce_Dach has left the room	2023-06-21 00:48:19.047995	2023-06-21 00:48:19.047995	0	68
501	Grayce_Dach has left the room	2023-06-20 20:10:42.092018	2023-06-20 20:10:42.092018	0	79
529	Grayce_Dach has join the room	2023-06-20 21:32:32.832063	2023-06-20 21:32:32.832063	0	80
507	Randi.Bruen-Lakin has left the room	2023-06-20 20:52:08.744592	2023-06-20 20:52:08.744592	0	79
518	Randi.Bruen-Lakin has left the room	2023-06-20 21:26:45.135194	2023-06-20 21:26:45.135194	0	80
596	Laron76 has join the room	2023-06-20 22:42:33.59463	2023-06-20 22:42:33.59463	0	83
531	Randi.Bruen-Lakin has join the room	2023-06-20 21:32:41.815858	2023-06-20 21:32:41.815858	0	80
532	aaaaaaaaah	2023-06-20 21:32:47.70485	2023-06-20 21:32:47.70485	35	80
537	Randi.Bruen-Lakin has join the room	2023-06-20 22:18:54.377046	2023-06-20 22:18:54.377046	0	80
610	fssdf ds sf	2023-06-20 23:41:31.881749	2023-06-20 23:41:31.881749	35	63
549	fdgf gffd gfd gfd gddfg	2023-06-20 22:23:53.019384	2023-06-20 22:23:53.019384	35	65
550	ghfh gf hgf fghfg hfghfgh	2023-06-20 22:23:57.142257	2023-06-20 22:23:57.142257	29	80
551	gf hgf gf hgfhgf hgfh	2023-06-20 22:24:00.803742	2023-06-20 22:24:00.803742	29	80
618	df s fsdf sf	2023-06-20 23:46:30.860832	2023-06-20 23:46:30.860832	35	68
552	hhhh h h h h h h h  hhh	2023-06-20 22:24:05.09385	2023-06-20 22:24:05.09385	32	80
553	Randi.Bruen-Lakin has left the room	2023-06-20 22:24:07.687289	2023-06-20 22:24:07.687289	0	80
701	Grayce_Dach has join the room	2023-06-21 00:48:19.943678	2023-06-21 00:48:19.943678	0	68
577	Randi.Bruen-Lakin has join the room	2023-06-20 22:27:34.9859	2023-06-20 22:27:34.9859	0	81
641	Grayce_Dach has left the room	2023-06-20 23:57:47.067795	2023-06-20 23:57:47.067795	0	68
586	Laron76 has been muted this idiot	2023-06-20 22:31:15.72406	2023-06-20 22:31:15.72406	0	82
642	Grayce_Dach has join the room	2023-06-20 23:57:50.156587	2023-06-20 23:57:50.156587	0	68
685	l	2023-06-21 00:28:45.569153	2023-06-21 00:28:45.569153	32	68
748	ok nice	2023-06-21 13:24:12.589724	2023-06-21 13:24:12.589724	35	84
686	l	2023-06-21 00:28:47.825113	2023-06-21 00:28:47.825113	32	68
712	Grayce_Dach has left the room	2023-06-21 00:49:36.785179	2023-06-21 00:49:36.785179	0	68
694	Grayce_Dach has left the room	2023-06-21 00:48:05.853569	2023-06-21 00:48:05.853569	0	68
695	Grayce_Dach has join the room	2023-06-21 00:48:08.936649	2023-06-21 00:48:08.936649	0	68
696	Grayce_Dach has left the room	2023-06-21 00:48:14.443261	2023-06-21 00:48:14.443261	0	68
713	Grayce_Dach has join the room	2023-06-21 00:49:38.195059	2023-06-21 00:49:38.195059	0	68
697	Grayce_Dach has join the room	2023-06-21 00:48:15.596276	2023-06-21 00:48:15.596276	0	68
698	Grayce_Dach has left the room	2023-06-21 00:48:17.124655	2023-06-21 00:48:17.124655	0	68
793	sdf dsf sdf f	2023-06-21 14:10:52.262456	2023-06-21 14:10:52.262456	35	85
699	Grayce_Dach has join the room	2023-06-21 00:48:18.101557	2023-06-21 00:48:18.101557	0	68
752	Grayce_Dach has left the room	2023-06-21 13:27:14.546657	2023-06-21 13:27:14.546657	0	84
722	Grayce_Dach has left the room	2023-06-21 00:53:01.220145	2023-06-21 00:53:01.220145	0	68
731	Laron76 has join the room	2023-06-21 13:01:42.166507	2023-06-21 13:01:42.166507	0	84
773	fdg fdgfg	2023-06-21 13:50:00.837552	2023-06-21 13:50:00.837552	29	84
746	Grayce_Dach has left the room	2023-06-21 13:24:01.574427	2023-06-21 13:24:01.574427	0	84
756	Grayce_Dach has left the room	2023-06-21 13:44:20.687127	2023-06-21 13:44:20.687127	0	84
747	mouahahaha	2023-06-21 13:24:09.118089	2023-06-21 13:24:09.118089	29	84
757	Grayce_Dach has join the room	2023-06-21 13:44:33.407384	2023-06-21 13:44:33.407384	0	84
765	Laron76 has join the room	2023-06-21 13:45:42.347252	2023-06-21 13:45:42.347252	0	85
784	fesfe ef	2023-06-21 13:51:11.401585	2023-06-21 13:51:11.401585	32	85
788	Grayce_Dach has join the room	2023-06-21 13:54:12.903813	2023-06-21 13:54:12.903813	0	85
801	ccccc	2023-06-21 14:16:44.107578	2023-06-21 14:16:44.107578	35	85
807	sdf	2023-06-21 14:19:18.854806	2023-06-21 14:19:18.854806	29	85
806	slt	2023-06-21 14:19:16.248243	2023-06-21 14:19:16.248243	35	85
812	fsdfsdfdsfsfsfsfsdf	2023-06-21 14:19:43.677193	2023-06-21 14:19:43.677193	35	84
816	Grayce_Dach has left the room	2023-06-21 14:20:35.346272	2023-06-21 14:20:35.346272	0	85
817	Grayce_Dach has join the room	2023-06-21 14:20:42.626665	2023-06-21 14:20:42.626665	0	85
827	dgdf dfgdf dgfdgdfg	2023-06-21 14:24:06.581364	2023-06-21 14:24:06.581364	29	85
828	fgfd gdf gfdg	2023-06-21 14:24:11.3674	2023-06-21 14:24:11.3674	35	85
829	fg dfgfdgg	2023-06-21 14:24:14.21496	2023-06-21 14:24:14.21496	32	85
837	zzd	2023-06-21 14:29:50.799029	2023-06-21 14:29:50.799029	35	85
841	f	2023-06-21 15:02:11.892988	2023-06-21 15:02:11.892988	35	85
845	gggggg	2023-06-21 15:12:34.61693	2023-06-21 15:12:34.61693	35	68
2029	11	2023-06-22 02:06:26.707259	2023-06-22 02:06:26.707259	35	85
852	heu	2023-06-21 15:18:04.662526	2023-06-21 15:18:04.662526	32	68
411	sadsaasasd	2023-06-20 18:00:44.501158	2023-06-20 18:00:44.501158	35	74
412	Invitation link http://localhost:3006/chat/channel/invitation/75/sdfffdsf	2023-06-20 18:01:47.415217	2023-06-20 18:01:47.415217	0	75
413	Invitation link http://localhost:3006/chat/channel/invitation/76/EFGEFSDFSDFSFD	2023-06-20 18:02:52.44189	2023-06-20 18:02:52.44189	0	76
434	Grayce_Dach has left the room	2023-06-20 19:06:37.144174	2023-06-20 19:06:37.144174	0	78
414	jrasser has join the room	2023-06-20 18:02:55.448551	2023-06-20 18:02:55.448551	0	76
415	zczxfdfsdfdfd	2023-06-20 18:02:58.593303	2023-06-20 18:02:58.593303	35	76
441	Laron76 has join the room	2023-06-20 19:16:53.68544	2023-06-20 19:16:53.68544	0	78
478	Grayce_Dach has left the room	2023-06-20 19:45:32.592471	2023-06-20 19:45:32.592471	0	78
449	Laron76 has join the room	2023-06-20 19:19:07.408043	2023-06-20 19:19:07.408043	0	78
455	Grayce_Dach has join the room	2023-06-20 19:25:35.432461	2023-06-20 19:25:35.432461	0	78
492	ggg	2023-06-20 20:07:30.152872	2023-06-20 20:07:30.152872	32	79
522	Grayce_Dach has left the room	2023-06-20 21:28:32.079246	2023-06-20 21:28:32.079246	0	80
493	sdf	2023-06-20 20:07:31.934736	2023-06-20 20:07:31.934736	29	79
494	sdfsdfsfdf	2023-06-20 20:07:34.195077	2023-06-20 20:07:34.195077	35	79
495	Grayce_Dach has left the room	2023-06-20 20:07:37.32139	2023-06-20 20:07:37.32139	0	79
530	Laron76 has join the room	2023-06-20 21:32:38.198374	2023-06-20 21:32:38.198374	0	80
502	Randi.Bruen-Lakin has left the room	2023-06-20 20:11:13.463243	2023-06-20 20:11:13.463243	0	79
508	Randi.Bruen-Lakin has join the room	2023-06-20 20:52:48.155448	2023-06-20 20:52:48.155448	0	79
602	ffdgfdgdfgd	2023-06-20 22:43:52.455163	2023-06-20 22:43:52.455163	29	83
538	fddsfdsf dsf sdfsf	2023-06-20 22:19:10.179128	2023-06-20 22:19:10.179128	27	80
539	sdf sdf	2023-06-20 22:19:11.947122	2023-06-20 22:19:11.947122	32	80
794	fdg dfg	2023-06-21 14:15:51.802394	2023-06-21 14:15:51.802394	35	84
540	sdf sdf f	2023-06-20 22:19:13.386337	2023-06-20 22:19:13.386337	29	80
611	fffffff	2023-06-20 23:43:00.602023	2023-06-20 23:43:00.602023	29	83
541	sdf sd sdfsd sfsd sd fdsfs sfd sd sd fsdfdffs	2023-06-20 22:19:16.951917	2023-06-20 22:19:16.951917	35	80
542	sdf dsf	2023-06-20 22:19:20.221452	2023-06-20 22:19:20.221452	27	80
749	Grayce_Dach has join the room	2023-06-21 13:24:46.548202	2023-06-21 13:24:46.548202	0	84
543	sdfsd f sdfdfsdfdsf dsf sdf	2023-06-20 22:19:23.533863	2023-06-20 22:19:23.533863	29	80
619	ffdsffds fsdf dfs fsf ds sd f sdf	2023-06-20 23:46:35.323646	2023-06-20 23:46:35.323646	29	68
544	dfdddfdfdfdfdddffdf	2023-06-20 22:19:27.155422	2023-06-20 22:19:27.155422	32	80
554	Randi.Bruen-Lakin has join the room	2023-06-20 22:24:23.474798	2023-06-20 22:24:23.474798	0	65
555	Randi.Bruen-Lakin has join the room	2023-06-20 22:25:07.780035	2023-06-20 22:25:07.780035	0	80
579	coucou	2023-06-20 22:27:47.450195	2023-06-20 22:27:47.450195	32	81
620	fffff	2023-06-20 23:46:37.060218	2023-06-20 23:46:39.911	32	68
587	Laron76 has been unmuted	2023-06-20 22:31:35.831662	2023-06-20 22:31:35.831662	0	82
753	Grayce_Dach has join the room	2023-06-21 13:28:42.863377	2023-06-21 13:28:42.863377	0	84
643	Grayce_Dach has left the room	2023-06-20 23:58:39.038961	2023-06-20 23:58:39.038961	0	68
644	jrasser has left the room	2023-06-20 23:58:45.778767	2023-06-20 23:58:45.778767	0	68
645	jrasser has join the room	2023-06-20 23:58:50.302028	2023-06-20 23:58:50.302028	0	68
758	Grayce_Dach has join the room	2023-06-21 13:44:51.427937	2023-06-21 13:44:51.427937	0	69
687	Grayce_Dach has left the room	2023-06-21 00:43:08.124264	2023-06-21 00:43:08.124264	0	68
702	Grayce_Dach has left the room	2023-06-21 00:48:24.354892	2023-06-21 00:48:24.354892	0	68
802	Grayce_Dach has left the room	2023-06-21 14:17:29.902155	2023-06-21 14:17:29.902155	0	85
703	Grayce_Dach has join the room	2023-06-21 00:48:28.281345	2023-06-21 00:48:28.281345	0	68
759	Grayce_Dach has join the room	2023-06-21 13:44:52.025572	2023-06-21 13:44:52.025572	0	68
714	Grayce_Dach has left the room	2023-06-21 00:50:53.581939	2023-06-21 00:50:53.581939	0	68
715	sdfsdf dsf s	2023-06-21 00:50:59.195829	2023-06-21 00:50:59.195829	29	68
716	Grayce_Dach has join the room	2023-06-21 00:51:02.238509	2023-06-21 00:51:02.238509	0	68
767	Grayce_Dach has left the room	2023-06-21 13:46:27.500276	2023-06-21 13:46:27.500276	0	85
723	Grayce_Dach has join the room	2023-06-21 00:53:03.44062	2023-06-21 00:53:03.44062	0	68
727	sdfghjkl;'	2023-06-21 12:47:50.772152	2023-06-21 12:47:50.772152	29	68
728	fgfd dgfdg	2023-06-21 12:47:53.193443	2023-06-21 12:47:53.193443	35	68
774	fg fdgfdg	2023-06-21 13:50:10.342064	2023-06-21 13:50:10.342064	32	85
732	Laron76 has left the room	2023-06-21 13:01:47.073729	2023-06-21 13:01:47.073729	0	84
803	Grayce_Dach has join the room	2023-06-21 14:17:37.017693	2023-06-21 14:17:37.017693	0	85
775	Grayce_Dach has left the room	2023-06-21 13:50:12.269822	2023-06-21 13:50:12.269822	0	85
776	Grayce_Dach has join the room	2023-06-21 13:50:16.108114	2023-06-21 13:50:16.108114	0	85
819	Grayce_Dach has left the room	2023-06-21 14:20:53.466198	2023-06-21 14:20:53.466198	0	85
785	Grayce_Dach has left the room	2023-06-21 13:52:30.5601	2023-06-21 13:52:30.5601	0	85
808	fffffff	2023-06-21 14:19:24.276834	2023-06-21 14:19:24.276834	35	85
789	dfsdfdff	2023-06-21 14:05:52.774496	2023-06-21 14:05:52.774496	35	84
834	Grayce_Dach has left the room	2023-06-21 14:24:48.695093	2023-06-21 14:24:48.695093	0	85
809	sdfsdfsdf	2023-06-21 14:19:26.732713	2023-06-21 14:19:26.732713	29	85
820	ds fsdf sdfs ff	2023-06-21 14:20:56.150838	2023-06-21 14:20:56.150838	29	85
810	blabla	2023-06-21 14:19:35.220726	2023-06-21 14:19:35.220726	32	85
811	sdf sd sdfdf	2023-06-21 14:19:39.441031	2023-06-21 14:19:39.441031	29	85
830	bla	2023-06-21 14:24:29.496235	2023-06-21 14:24:29.496235	32	85
818	alalalalala	2023-06-21 14:20:51.551538	2023-06-21 14:20:51.551538	32	85
821	Grayce_Dach has join the room	2023-06-21 14:20:59.749735	2023-06-21 14:20:59.749735	0	85
822	r asf sdf	2023-06-21 14:21:04.247304	2023-06-21 14:21:04.247304	35	85
833	hjgfdsadfghjgfdsa	2023-06-21 14:24:45.567273	2023-06-21 14:24:45.567273	32	85
835	Grayce_Dach has join the room	2023-06-21 14:24:51.302684	2023-06-21 14:24:51.302684	0	85
838	wtf	2023-06-21 14:29:55.906928	2023-06-21 14:29:55.906928	35	69
842	dfvfdvfdvdf	2023-06-21 15:02:47.127802	2023-06-21 15:02:47.127802	35	68
846	Grayce_Dach has left the room	2023-06-21 15:13:14.919065	2023-06-21 15:13:14.919065	0	68
847	Grayce_Dach has join the room	2023-06-21 15:13:19.340702	2023-06-21 15:13:19.340702	0	68
853	ok	2023-06-21 15:18:06.915012	2023-06-21 15:18:06.915012	32	68
854	chelou	2023-06-21 15:18:08.32596	2023-06-21 15:18:08.32596	32	68
855	sdfsddsf	2023-06-21 15:18:10.676182	2023-06-21 15:18:10.676182	29	68
856	sdfsdf	2023-06-21 15:18:13.169899	2023-06-21 15:18:13.169899	35	68
871	fds fd sf sfdsf	2023-06-21 15:19:01.095639	2023-06-21 15:19:01.095639	32	68
874	Grayce_Dach has join the room	2023-06-21 15:20:25.699166	2023-06-21 15:20:25.699166	0	85
879	dsf	2023-06-21 15:28:09.094875	2023-06-21 15:28:09.094875	35	68
416	dsfdssdf	2023-06-20 18:03:21.898865	2023-06-20 18:03:21.898865	29	76
435	Grayce_Dach has join the room	2023-06-20 19:07:00.080344	2023-06-20 19:07:00.080344	0	78
436	blabla	2023-06-20 19:07:23.342517	2023-06-20 19:07:23.342517	32	78
479	Grayce_Dach has join the room	2023-06-20 19:46:37.873691	2023-06-20 19:46:37.873691	0	78
442	Laron76 has left the room	2023-06-20 19:17:21.686891	2023-06-20 19:17:21.686891	0	78
450	Grayce_Dach has left the room	2023-06-20 19:20:09.032189	2023-06-20 19:20:09.032189	0	78
456	Grayce_Dach has left the room	2023-06-20 19:30:55.95503	2023-06-20 19:30:55.95503	0	78
480	Grayce_Dach has left the room	2023-06-20 19:46:47.390756	2023-06-20 19:46:47.390756	0	78
523	Grayce_Dach has join the room	2023-06-20 21:29:45.723224	2023-06-20 21:29:45.723224	0	80
481	Grayce_Dach has join the room	2023-06-20 19:46:57.430982	2023-06-20 19:46:57.430982	0	78
496	Grayce_Dach has join the room	2023-06-20 20:07:50.734121	2023-06-20 20:07:50.734121	0	79
497	dgfdgfdgfdg	2023-06-20 20:07:53.770111	2023-06-20 20:07:53.770111	29	79
533	asdasddd	2023-06-20 22:03:31.304955	2023-06-20 22:03:31.304955	35	80
503	Grayce_Dach has join the room	2023-06-20 20:34:28.820712	2023-06-20 20:34:28.820712	0	79
509	Randi.Bruen-Lakin has left the room	2023-06-20 20:55:49.620626	2023-06-20 20:55:49.620626	0	79
603	bla	2023-06-20 23:39:20.874102	2023-06-20 23:39:20.874102	35	83
545	Randi.Bruen-Lakin has left the room	2023-06-20 22:21:32.97119	2023-06-20 22:21:32.97119	0	80
556	jhgfdsa	2023-06-20 22:25:12.32548	2023-06-20 22:25:12.32548	27	80
814	Grayce_Dach has left the room	2023-06-21 14:19:50.421987	2023-06-21 14:19:50.421987	0	85
557	f f b gf bgfb fgbfg bgfb	2023-06-20 22:25:22.059241	2023-06-20 22:25:22.059241	32	80
604	asdasd	2023-06-20 23:39:36.608555	2023-06-20 23:39:36.608555	35	83
558	fgdfgfgfdggfdgdfgfgfdgfgg df gfdgd	2023-06-20 22:25:26.409551	2023-06-20 22:25:26.409551	29	80
580	Invitation link http://localhost:3006/chat/channel/invitation/82/nmnmmnmnmnmn	2023-06-20 22:28:50.788183	2023-06-20 22:28:50.788183	0	82
754	Grayce_Dach has left the room	2023-06-21 13:28:51.472719	2023-06-21 13:28:51.472719	0	84
588	Grayce_Dach has been kicked	2023-06-20 22:40:54.374684	2023-06-20 22:40:54.374684	0	82
612	sss	2023-06-20 23:43:25.641483	2023-06-20 23:43:25.641483	35	83
589	Randi.Bruen-Lakin has been kicked	2023-06-20 22:40:59.774592	2023-06-20 22:40:59.774592	0	82
613	dddd	2023-06-20 23:43:27.709165	2023-06-20 23:43:27.709165	29	83
791	fdsfd sdf	2023-06-21 14:10:16.436196	2023-06-21 14:10:16.436196	35	69
621	Grayce_Dach has left the room	2023-06-20 23:47:12.435639	2023-06-20 23:47:12.435639	0	68
760	gdfg dfg	2023-06-21 13:45:09.288378	2023-06-21 13:45:09.288378	32	68
646	jrasser has left the room	2023-06-21 00:25:41.585991	2023-06-21 00:25:41.585991	0	68
688	Grayce_Dach has join the room	2023-06-21 00:43:21.548471	2023-06-21 00:43:21.548471	0	68
704	Grayce_Dach has left the room	2023-06-21 00:48:56.468784	2023-06-21 00:48:56.468784	0	68
761	dfg df gdfgd	2023-06-21 13:45:10.973773	2023-06-21 13:45:10.973773	29	68
705	Grayce_Dach has join the room	2023-06-21 00:48:59.396564	2023-06-21 00:48:59.396564	0	68
717	dfsfs sfsdf	2023-06-21 00:51:08.620559	2023-06-21 00:51:08.620559	32	68
724	jrasser has join the room	2023-06-21 00:54:24.259282	2023-06-21 00:54:24.259282	0	68
762	df gdfg dfgd gd df dgdgfdgdf	2023-06-21 13:45:13.64103	2023-06-21 13:45:13.64103	35	68
729	sdfghjgfdsa	2023-06-21 12:50:30.223629	2023-06-21 12:50:30.223629	35	69
735	dsf ds fsdf	2023-06-21 13:19:34.664659	2023-06-21 13:19:34.664659	35	68
795	coucou	2023-06-21 14:16:10.366326	2023-06-21 14:16:10.366326	32	85
736	df sdf sdfs fs fsdd sf dfds sdf sdf ds fds sd fdssdf sd sfdsf	2023-06-21 13:19:38.883894	2023-06-21 13:19:38.883894	35	68
763	Grayce_Dach has left the room	2023-06-21 13:45:16.900979	2023-06-21 13:45:16.900979	0	68
737	dsf df sdf ds fsdf	2023-06-21 13:19:40.2676	2023-06-21 13:19:40.2676	35	68
738	sd f	2023-06-21 13:19:40.584472	2023-06-21 13:19:40.584472	35	68
739	sd	2023-06-21 13:19:40.87492	2023-06-21 13:19:40.87492	35	68
768	Grayce_Dach has join the room	2023-06-21 13:46:38.925902	2023-06-21 13:46:38.925902	0	85
740	ds f	2023-06-21 13:19:41.209183	2023-06-21 13:19:41.209183	35	68
741	sd	2023-06-21 13:19:41.516465	2023-06-21 13:19:41.516465	35	68
843	sdfssfdf	2023-06-21 15:04:25.665063	2023-06-21 15:04:25.665063	35	69
742	dsfdsfdsfdsfsdf sfsd sdf dsf	2023-06-21 13:19:43.537222	2023-06-21 13:19:43.537222	35	68
769	Grayce_Dach has left the room	2023-06-21 13:46:47.838325	2023-06-21 13:46:47.838325	0	85
750	Grayce_Dach has left the room	2023-06-21 13:24:50.485366	2023-06-21 13:24:50.485366	0	84
796	Grayce_Dach has left the room	2023-06-21 14:16:12.288528	2023-06-21 14:16:12.288528	0	85
770	Grayce_Dach has join the room	2023-06-21 13:46:51.076409	2023-06-21 13:46:51.076409	0	85
777	Grayce_Dach has left the room	2023-06-21 13:50:53.523036	2023-06-21 13:50:53.523036	0	85
823	Grayce_Dach has join the room	2023-06-21 14:21:23.188116	2023-06-21 14:21:23.188116	0	68
778	fdsf dssf	2023-06-21 13:50:57.524777	2023-06-21 13:50:57.524777	29	85
797	Grayce_Dach has join the room	2023-06-21 14:16:19.445888	2023-06-21 14:16:19.445888	0	85
786	Grayce_Dach has left the room	2023-06-21 13:52:50.869576	2023-06-21 13:52:50.869576	0	69
790	fdgfgdg	2023-06-21 14:09:48.897931	2023-06-21 14:09:48.897931	35	84
798	blabla	2023-06-21 14:16:31.183826	2023-06-21 14:16:31.183826	29	68
804	Laron76 has left the room	2023-06-21 14:17:53.059217	2023-06-21 14:17:53.059217	0	85
831	fdgdffdgf	2023-06-21 14:24:36.492877	2023-06-21 14:24:36.492877	29	85
813	sd fsdf sfsd fsdfsd df fsdsdfds sf	2023-06-21 14:19:47.777882	2023-06-21 14:19:47.777882	35	85
861	Grayce_Dach has join the room	2023-06-21 15:18:39.356469	2023-06-21 15:18:39.356469	0	68
848	Grayce_Dach has join the room	2023-06-21 15:13:31.238023	2023-06-21 15:13:31.238023	0	69
832	 fgdf gfd gfg df	2023-06-21 14:24:39.189713	2023-06-21 14:24:39.189713	32	68
839	bla	2023-06-21 15:00:09.360455	2023-06-21 15:00:09.360455	35	85
857	sdfsdf sfs sdf f df	2023-06-21 15:18:17.996744	2023-06-21 15:18:17.996744	32	68
863	Grayce_Dach has join the room	2023-06-21 15:18:44.6905	2023-06-21 15:18:44.6905	0	68
862	Grayce_Dach has left the room	2023-06-21 15:18:42.778735	2023-06-21 15:18:42.778735	0	68
864	Grayce_Dach has left the room	2023-06-21 15:18:46.518311	2023-06-21 15:18:46.518311	0	68
865	Grayce_Dach has join the room	2023-06-21 15:18:47.814402	2023-06-21 15:18:47.814402	0	68
866	Grayce_Dach has left the room	2023-06-21 15:18:48.922391	2023-06-21 15:18:48.922391	0	68
867	Grayce_Dach has join the room	2023-06-21 15:18:49.743287	2023-06-21 15:18:49.743287	0	68
868	Grayce_Dach has left the room	2023-06-21 15:18:50.621319	2023-06-21 15:18:50.621319	0	68
869	Grayce_Dach has join the room	2023-06-21 15:18:51.446515	2023-06-21 15:18:51.446515	0	68
870	ghfghg ffghgh	2023-06-21 15:18:56.319584	2023-06-21 15:18:56.319584	29	68
872	Grayce_Dach has left the room	2023-06-21 15:19:24.264065	2023-06-21 15:19:24.264065	0	68
875	Grayce_Dach has left the room	2023-06-21 15:20:37.073428	2023-06-21 15:20:37.073428	0	85
418	asdasd	2023-06-20 18:31:02.334096	2023-06-20 18:31:02.334096	35	76
419	Grayce_Dach has join the room	2023-06-20 18:31:13.669205	2023-06-20 18:31:13.669205	0	76
420	coucou	2023-06-20 18:31:17.043265	2023-06-20 18:31:17.043265	32	76
437	Grayce_Dach has been muted this idiot	2023-06-20 19:07:52.026364	2023-06-20 19:07:52.026364	0	78
421	Invitation link http://localhost:3006/chat/channel/invitation/77/XXXXXXXXXXXXX	2023-06-20 18:38:48.017484	2023-06-20 18:38:48.017484	0	77
422	hello	2023-06-20 18:38:53.670439	2023-06-20 18:38:53.670439	29	77
423	jrasser has join the room	2023-06-20 18:39:04.323634	2023-06-20 18:39:04.323634	0	77
443	Laron76 has join the room	2023-06-20 19:17:53.559198	2023-06-20 19:17:53.559198	0	78
424	bliblib	2023-06-20 18:39:17.231486	2023-06-20 18:39:17.231486	35	77
425	blabla	2023-06-20 18:39:28.255307	2023-06-20 18:39:28.255307	29	77
482	Grayce_Dach has left the room	2023-06-20 19:47:02.149251	2023-06-20 19:47:02.149251	0	78
426	Grayce_Dach has join the room	2023-06-20 18:50:35.829352	2023-06-20 18:50:35.829352	0	77
451	Grayce_Dach has join the room	2023-06-20 19:22:28.208886	2023-06-20 19:22:28.208886	0	78
427	Grayce_Dach has left the room	2023-06-20 18:50:55.227009	2023-06-20 18:50:55.227009	0	77
428	Grayce_Dach has join the room	2023-06-20 18:54:01.167449	2023-06-20 18:54:01.167449	0	77
429	Invitation link http://localhost:3006/chat/channel/invitation/78/EEEEEEEEEEE	2023-06-20 18:54:42.135528	2023-06-20 18:54:42.135528	0	78
457	Grayce_Dach has join the room	2023-06-20 19:31:35.398633	2023-06-20 19:31:35.398633	0	78
430	Grayce_Dach has join the room	2023-06-20 18:54:48.372719	2023-06-20 18:54:48.372719	0	78
574	bien le bonjour a tous et bla bla bli et bla bla bla	2023-06-20 22:25:50.730778	2023-06-20 22:25:50.730778	29	80
458	Grayce_Dach has left the room	2023-06-20 19:31:40.77214	2023-06-20 19:31:40.77214	0	78
498	Randi.Bruen-Lakin has join the room	2023-06-20 20:08:34.257714	2023-06-20 20:08:34.257714	0	79
459	Grayce_Dach has join the room	2023-06-20 19:31:58.717022	2023-06-20 19:31:58.717022	0	78
524	Grayce_Dach has left the room	2023-06-20 21:30:06.694983	2023-06-20 21:30:06.694983	0	80
504	Randi.Bruen-Lakin has join the room	2023-06-20 20:37:55.396867	2023-06-20 20:37:55.396867	0	79
510	Invitation link http://localhost:3006/chat/channel/invitation/80/mnbvmnm	2023-06-20 20:56:44.768755	2023-06-20 20:56:44.768755	0	80
511	Grayce_Dach has join the room	2023-06-20 20:56:52.021328	2023-06-20 20:56:52.021328	0	80
534	Randi.Bruen-Lakin has left the room	2023-06-20 22:04:00.819509	2023-06-20 22:04:00.819509	0	80
512	Randi.Bruen-Lakin has join the room	2023-06-20 20:56:54.847286	2023-06-20 20:56:54.847286	0	80
513	coucou	2023-06-20 20:57:09.917734	2023-06-20 20:57:09.917734	27	80
514	hello	2023-06-20 20:57:13.685953	2023-06-20 20:57:13.685953	32	80
546	Randi.Bruen-Lakin has join the room	2023-06-20 22:21:41.896329	2023-06-20 22:21:41.896329	0	80
581	Grayce_Dach has join the room	2023-06-20 22:28:56.061155	2023-06-20 22:28:56.061155	0	82
559	 gfdg fd gfg dg gf dg fg gdf dfgfd dg fgfdg fdgdf	2023-06-20 22:25:32.081977	2023-06-20 22:25:32.081977	29	80
560	 g	2023-06-20 22:25:32.405019	2023-06-20 22:25:32.405019	29	80
628	Grayce_Dach has join the room	2023-06-20 23:47:32.280045	2023-06-20 23:47:32.280045	0	68
561	 gfdg fd gdfg 	2023-06-20 22:25:32.874857	2023-06-20 22:25:32.874857	29	80
590	Randi.Bruen-Lakin has join the room	2023-06-20 22:41:14.291008	2023-06-20 22:41:14.291008	0	82
562	fd g	2023-06-20 22:25:33.11973	2023-06-20 22:25:33.11973	29	80
563	fd gfdg fd	2023-06-20 22:25:33.415434	2023-06-20 22:25:33.415434	29	80
605	szddsaas s	2023-06-20 23:39:46.38465	2023-06-20 23:39:46.38465	35	69
564	fd gfdg fdg fd	2023-06-20 22:25:33.577694	2023-06-20 22:25:33.577694	29	80
591	Grayce_Dach has join the room	2023-06-20 22:41:19.544203	2023-06-20 22:41:19.544203	0	82
565	fd	2023-06-20 22:25:33.905641	2023-06-20 22:25:33.905641	29	80
566	fdg fd	2023-06-20 22:25:34.121405	2023-06-20 22:25:34.121405	29	80
567	fdg fdg fd	2023-06-20 22:25:34.305538	2023-06-20 22:25:34.305538	29	80
592	Randi.Bruen-Lakin has left the room	2023-06-20 22:41:32.928507	2023-06-20 22:41:32.928507	0	82
568	fd 	2023-06-20 22:25:34.557532	2023-06-20 22:25:34.557532	29	80
569	fd dfg 	2023-06-20 22:25:34.804216	2023-06-20 22:25:34.804216	29	80
614	Grayce_Dach has been kicked	2023-06-20 23:44:23.991356	2023-06-20 23:44:23.991356	0	83
570	fd dfg fd 	2023-06-20 22:25:34.963715	2023-06-20 22:25:34.963715	29	80
571	fd dfg fd gfd	2023-06-20 22:25:35.129748	2023-06-20 22:25:35.129748	29	80
649	Grayce_Dach has join the room	2023-06-21 00:25:56.882515	2023-06-21 00:25:56.882515	0	68
572	fd dfg fd gfdg 	2023-06-20 22:25:35.231858	2023-06-20 22:25:35.231858	29	80
622	Grayce_Dach has join the room	2023-06-20 23:47:18.091886	2023-06-20 23:47:18.091886	0	68
573	gfdg fdgfd gdf gfdg fd gfd ggg fgdfgfd gdf fd ggdf gfdgg	2023-06-20 22:25:41.952197	2023-06-20 22:25:41.952197	29	80
629	Grayce_Dach has left the room	2023-06-20 23:47:33.848421	2023-06-20 23:47:33.848421	0	68
623	Grayce_Dach has left the room	2023-06-20 23:47:25.51766	2023-06-20 23:47:25.51766	0	68
624	Grayce_Dach has join the room	2023-06-20 23:47:27.214408	2023-06-20 23:47:27.214408	0	68
625	Grayce_Dach has left the room	2023-06-20 23:47:28.786781	2023-06-20 23:47:28.786781	0	68
630	Grayce_Dach has join the room	2023-06-20 23:47:34.854079	2023-06-20 23:47:34.854079	0	68
626	Grayce_Dach has join the room	2023-06-20 23:47:29.647227	2023-06-20 23:47:29.647227	0	68
627	Grayce_Dach has left the room	2023-06-20 23:47:31.37777	2023-06-20 23:47:31.37777	0	68
650	Grayce_Dach has left the room	2023-06-21 00:25:58.448323	2023-06-21 00:25:58.448323	0	68
647	Grayce_Dach has join the room	2023-06-21 00:25:51.837501	2023-06-21 00:25:51.837501	0	68
648	Grayce_Dach has left the room	2023-06-21 00:25:55.799188	2023-06-21 00:25:55.799188	0	68
653	Grayce_Dach has join the room	2023-06-21 00:26:02.116861	2023-06-21 00:26:02.116861	0	68
651	Grayce_Dach has join the room	2023-06-21 00:25:59.536536	2023-06-21 00:25:59.536536	0	68
652	Grayce_Dach has left the room	2023-06-21 00:26:00.876632	2023-06-21 00:26:00.876632	0	68
654	jrasser has join the room	2023-06-21 00:26:04.085462	2023-06-21 00:26:04.085462	0	68
655	Grayce_Dach has left the room	2023-06-21 00:26:06.812672	2023-06-21 00:26:06.812672	0	68
656	Grayce_Dach has join the room	2023-06-21 00:26:08.065559	2023-06-21 00:26:08.065559	0	68
689	Grayce_Dach has left the room	2023-06-21 00:47:13.039295	2023-06-21 00:47:13.039295	0	68
691	Grayce_Dach has join the room	2023-06-21 00:47:41.224722	2023-06-21 00:47:41.224722	0	68
706	Grayce_Dach has left the room	2023-06-21 00:49:11.474346	2023-06-21 00:49:11.474346	0	68
718	Grayce_Dach has left the room	2023-06-21 00:51:25.863528	2023-06-21 00:51:25.863528	0	68
719	Grayce_Dach has left the room	2023-06-21 00:51:26.806449	2023-06-21 00:51:26.806449	0	69
720	Grayce_Dach has join the room	2023-06-21 00:51:28.529483	2023-06-21 00:51:28.529483	0	68
2030	11	2023-06-22 02:06:26.707	2023-06-22 02:06:26.707	35	85
725	Grayce_Dach has been kicked	2023-06-21 00:54:42.895399	2023-06-21 00:54:42.895399	0	68
743	coucou	2023-06-21 13:23:46.687363	2023-06-21 13:23:46.687363	29	68
1691	Invitation link http://localhost:3006/chat/channel/invitation/90/dddd	2023-06-22 01:26:38.514839	2023-06-22 01:26:38.514839	0	90
877	Invitation link http://localhost:3006/chat/channel/invitation/86/bbbbbbbbbbbbbbb	2023-06-21 15:21:53.343824	2023-06-21 15:21:53.343824	0	86
1694	naaaaaa	2023-06-22 01:26:43.051	2023-06-22 01:26:43.051	35	90
2031	1	2023-06-22 02:06:28.354412	2023-06-22 02:06:28.354412	35	85
2033	1	2023-06-22 02:06:29.899833	2023-06-22 02:06:29.899833	35	85
2035	1	2023-06-22 02:06:31.273019	2023-06-22 02:06:31.273019	35	85
2037	1	2023-06-22 02:06:32.655106	2023-06-22 02:06:32.655106	35	85
2039	1	2023-06-22 02:06:34.02339	2023-06-22 02:06:34.02339	35	85
2343	5	2023-06-22 02:43:19.124156	2023-06-22 02:43:19.124156	35	85
2344	4	2023-06-22 02:43:20.889487	2023-06-22 02:43:20.889487	35	85
2345	2	2023-06-22 02:43:22.624775	2023-06-22 02:43:22.624775	35	85
2346	3	2023-06-22 02:43:24.294027	2023-06-22 02:43:24.294027	35	85
2347	1	2023-06-22 02:43:25.967057	2023-06-22 02:43:25.967057	35	85
2220	1	2023-06-22 02:23:45.51	2023-06-22 02:23:45.51	35	85
2348	2	2023-06-22 02:43:27.706137	2023-06-22 02:43:27.706137	35	85
2349	1	2023-06-22 02:43:31.802194	2023-06-22 02:43:31.802194	35	85
2350	2	2023-06-22 02:43:33.500611	2023-06-22 02:43:33.500611	35	85
2351	3	2023-06-22 02:43:35.285462	2023-06-22 02:43:35.285462	35	85
2352	4	2023-06-22 02:43:37.037768	2023-06-22 02:43:37.037768	35	85
2353	5	2023-06-22 02:43:38.778605	2023-06-22 02:43:38.778605	35	85
2354	6	2023-06-22 02:43:40.501968	2023-06-22 02:43:40.501968	35	85
2355	7	2023-06-22 02:43:42.227288	2023-06-22 02:43:42.227288	35	85
2223	2	2023-06-22 02:23:47.288	2023-06-22 02:23:47.288	\N	\N
2231	7	2023-06-22 02:23:50.29	2023-06-22 02:23:50.29	35	\N
2271	4	2023-06-22 02:28:55.147445	2023-06-22 02:28:55.147445	35	85
2356	8	2023-06-22 02:43:43.967242	2023-06-22 02:43:43.967242	35	85
2357	9	2023-06-22 02:43:45.671112	2023-06-22 02:43:45.671112	35	85
2401	1	2023-06-22 03:14:31.021524	2023-06-22 03:14:31.021524	35	89
2402	2	2023-06-22 03:14:34.226564	2023-06-22 03:14:34.226564	35	89
2407	8	2023-06-22 03:14:42.889732	2023-06-22 03:14:42.889732	35	\N
2465	0	2023-06-22 03:39:48.664473	2023-06-22 03:39:48.664473	35	91
2466	1	2023-06-22 03:39:51.974595	2023-06-22 03:39:51.974595	35	91
2283	f	2023-06-22 02:29:05.646256	2023-06-22 02:29:05.646256	29	85
2280	ffff	2023-06-22 02:29:05.200785	2023-06-22 02:29:05.200785	\N	\N
2331	5	2023-06-22 02:37:32.422788	2023-06-22 02:37:32.422788	35	85
2472	7	2023-06-22 03:40:03.048711	2023-06-22 03:40:03.048711	35	\N
2629	7	2023-06-22 03:46:16.235632	2023-06-22 03:46:16.235632	\N	91
2631	9	2023-06-22 03:46:16.661155	2023-06-22 03:46:16.661155	29	91
2627	2	2023-06-22 03:46:13.191096	2023-06-22 03:46:13.191096	\N	91
2785	1	2023-06-22 13:02:27.272692	2023-06-22 13:02:27.272692	29	93
2787	2	2023-06-22 13:02:28.79367	2023-06-22 13:02:28.79367	35	93
2788	3	2023-06-22 13:02:28.976991	2023-06-22 13:02:28.976991	35	93
2789	4	2023-06-22 13:02:29.209642	2023-06-22 13:02:29.209642	35	93
2790	5	2023-06-22 13:02:29.410318	2023-06-22 13:02:29.410318	35	93
2791	6	2023-06-22 13:02:29.61888	2023-06-22 13:02:29.61888	35	93
2792	7	2023-06-22 13:02:29.842641	2023-06-22 13:02:29.842641	35	93
2793	8	2023-06-22 13:02:30.053443	2023-06-22 13:02:30.053443	35	93
2794	9	2023-06-22 13:02:30.225517	2023-06-22 13:02:30.225517	35	93
2795	1	2023-06-22 13:02:33.073025	2023-06-22 13:02:33.073025	29	93
2796	2	2023-06-22 13:02:33.27525	2023-06-22 13:02:33.27525	29	93
2797	3	2023-06-22 13:02:33.459807	2023-06-22 13:02:33.459807	29	93
2798	4	2023-06-22 13:02:33.683246	2023-06-22 13:02:33.683246	29	93
2799	5	2023-06-22 13:02:33.88331	2023-06-22 13:02:33.88331	29	93
2800	6	2023-06-22 13:02:34.083393	2023-06-22 13:02:34.083393	29	93
2801	sdg g ds sdg sd gsd gs gd gds gds sd g	2023-06-22 13:02:40.931071	2023-06-22 13:02:40.931071	29	93
878	jrasser has join the room	2023-06-21 15:21:57.84513	2023-06-21 15:21:57.84513	0	86
1692	Invitation link http://localhost:3006/chat/channel/invitation/90/dddd	2023-06-22 01:26:38.514	2023-06-22 01:26:38.514	0	90
1693	naaaaaa	2023-06-22 01:26:43.0519	2023-06-22 01:26:43.0519	35	90
2032	1	2023-06-22 02:06:28.354	2023-06-22 02:06:28.354	35	85
2034	1	2023-06-22 02:06:29.899	2023-06-22 02:06:29.899	35	85
2036	1	2023-06-22 02:06:31.273	2023-06-22 02:06:31.273	35	85
2038	1	2023-06-22 02:06:32.655	2023-06-22 02:06:32.655	35	85
2040	1	2023-06-22 02:06:34.023	2023-06-22 02:06:34.023	35	85
2230	6	2023-06-22 02:23:49.775	2023-06-22 02:23:49.775	35	85
2358	12313321321321	2023-06-22 02:46:33.724228	2023-06-22 02:46:33.724228	35	90
2403	4	2023-06-22 03:14:35.993489	2023-06-22 03:14:35.993489	\N	89
2221	2	2023-06-22 02:23:47.288943	2023-06-22 02:23:47.288943	\N	\N
2236	9	2023-06-22 02:23:59.618	2023-06-22 02:23:59.618	35	85
2222	3	2023-06-22 02:23:47.320037	2023-06-22 02:23:47.320037	35	85
2272	6	2023-06-22 02:28:56.84366	2023-06-22 02:28:56.84366	\N	\N
2332	5	2023-06-22 02:37:34.135876	2023-06-22 02:37:34.135876	\N	\N
2474	8	2023-06-22 03:40:08.276869	2023-06-22 03:40:08.276869	35	\N
2467	2	2023-06-22 03:39:54.301604	2023-06-22 03:39:54.301604	35	\N
2637	00000000	2023-06-22 03:47:08.8246	2023-06-22 03:47:08.8246	29	91
2638	1	2023-06-22 03:47:09.941323	2023-06-22 03:47:09.941323	29	91
2639	1	2023-06-22 03:47:11.221817	2023-06-22 03:47:11.221817	29	91
2640	2	2023-06-22 03:47:11.624656	2023-06-22 03:47:11.624656	29	91
2641	3	2023-06-22 03:47:11.925456	2023-06-22 03:47:11.925456	29	91
2642	4	2023-06-22 03:47:12.19992	2023-06-22 03:47:12.19992	29	91
2643	5	2023-06-22 03:47:12.461807	2023-06-22 03:47:12.461807	29	91
2644	6	2023-06-22 03:47:12.726645	2023-06-22 03:47:12.726645	29	91
2645	7	2023-06-22 03:47:13.017593	2023-06-22 03:47:13.017593	29	91
2646	8	2023-06-22 03:47:13.292498	2023-06-22 03:47:13.292498	29	91
2647	9	2023-06-22 03:47:13.593063	2023-06-22 03:47:13.593063	29	91
880	fffffff	2023-06-21 15:37:36.702307	2023-06-21 15:37:36.702307	29	84
911	Grayce_Dach has left the room	2023-06-21 15:50:57.453602	2023-06-21 15:50:57.453602	0	68
881	ffffff	2023-06-21 15:37:45.63518	2023-06-21 15:37:45.63518	32	68
882	gfdgdfdfdg	2023-06-21 15:37:47.767724	2023-06-21 15:37:47.767724	32	68
928	jrasser has join the room	2023-06-21 16:03:48.793556	2023-06-21 16:03:48.793556	0	68
883	dfg	2023-06-21 15:37:53.379078	2023-06-21 15:37:53.379078	32	69
912	Grayce_Dach has join the room	2023-06-21 15:50:58.653004	2023-06-21 15:50:58.653004	0	68
884	dfgdfdg	2023-06-21 15:37:58.083049	2023-06-21 15:37:58.083049	35	68
885	dfgdfdg	2023-06-21 15:38:01.710892	2023-06-21 15:38:01.710892	35	69
886	grrrrrrr	2023-06-21 15:38:08.898523	2023-06-21 15:38:08.898523	29	69
913	bli	2023-06-21 15:52:02.29544	2023-06-21 15:52:02.29544	32	84
887	mue	2023-06-21 15:40:16.046757	2023-06-21 15:40:16.046757	29	85
888	dfgdfgdfg	2023-06-21 15:40:44.774013	2023-06-21 15:40:44.774013	29	84
889	olool	2023-06-21 15:42:13.663959	2023-06-21 15:42:13.663959	29	85
914	Grayce_Dach has left the room	2023-06-21 15:52:04.406017	2023-06-21 15:52:04.406017	0	69
890	hfghffhfgh	2023-06-21 15:42:17.423892	2023-06-21 15:42:17.423892	29	68
891	sdfsdf	2023-06-21 15:42:21.635736	2023-06-21 15:42:21.635736	29	69
929	sdfdsff	2023-06-21 16:03:58.488515	2023-06-21 16:03:58.488515	29	68
892	dfgdffdg	2023-06-21 15:43:02.086013	2023-06-21 15:43:02.086013	29	69
915	Grayce_Dach has left the room	2023-06-21 15:52:49.527981	2023-06-21 15:52:49.527981	0	84
893	asd	2023-06-21 15:43:16.509083	2023-06-21 15:43:16.509083	29	69
894	Grayce_Dach has left the room	2023-06-21 15:43:45.103947	2023-06-21 15:43:45.103947	0	69
895	Grayce_Dach has join the room	2023-06-21 15:43:49.851003	2023-06-21 15:43:49.851003	0	69
916	Grayce_Dach has left the room	2023-06-21 15:52:50.713631	2023-06-21 15:52:50.713631	0	68
896	cocuou	2023-06-21 15:47:18.664277	2023-06-21 15:47:18.664277	35	69
897	bla	2023-06-21 15:47:31.738251	2023-06-21 15:47:31.738251	35	69
898	ok	2023-06-21 15:47:47.874379	2023-06-21 15:47:47.874379	29	84
917	Grayce_Dach has join the room	2023-06-21 15:53:07.128354	2023-06-21 15:53:07.128354	0	68
899	sdfghjkl;'	2023-06-21 15:48:10.314956	2023-06-21 15:48:10.314956	32	69
900	Grayce_Dach has left the room	2023-06-21 15:48:14.885201	2023-06-21 15:48:14.885201	0	69
930	sdfsdf	2023-06-21 16:13:49.225637	2023-06-21 16:13:49.225637	35	69
901	Grayce_Dach has join the room	2023-06-21 15:48:23.352692	2023-06-21 15:48:23.352692	0	69
918	bon	2023-06-21 16:02:46.13514	2023-06-21 16:02:46.13514	35	68
902	Grayce_Dach has left the room	2023-06-21 15:49:02.165646	2023-06-21 15:49:02.165646	0	68
903	Grayce_Dach has join the room	2023-06-21 15:49:13.617513	2023-06-21 15:49:13.617513	0	68
904	sfdf sdfsdfdf	2023-06-21 15:50:22.871731	2023-06-21 15:50:22.871731	32	68
919	Grayce_Dach has left the room	2023-06-21 16:02:56.977566	2023-06-21 16:02:56.977566	0	68
905	sdf sdfdsds fsddf	2023-06-21 15:50:28.690733	2023-06-21 15:50:28.690733	32	68
906	fffff	2023-06-21 15:50:30.375842	2023-06-21 15:50:30.375842	32	68
941	gggggggg	2023-06-21 16:52:12.752283	2023-06-21 16:52:12.752283	29	85
907	Grayce_Dach has left the room	2023-06-21 15:50:35.659634	2023-06-21 15:50:35.659634	0	68
920	jrasser has left the room	2023-06-21 16:03:11.224777	2023-06-21 16:03:11.224777	0	68
908	Grayce_Dach has join the room	2023-06-21 15:50:48.337393	2023-06-21 15:50:48.337393	0	68
909	Grayce_Dach has left the room	2023-06-21 15:50:54.160689	2023-06-21 15:50:54.160689	0	68
931	xvxcvxvcv	2023-06-21 16:44:15.967187	2023-06-21 16:44:15.967187	32	68
910	Grayce_Dach has join the room	2023-06-21 15:50:55.731475	2023-06-21 15:50:55.731475	0	68
921	jrasser has join the room	2023-06-21 16:03:18.961281	2023-06-21 16:03:18.961281	0	68
922	Grayce_Dach has join the room	2023-06-21 16:03:24.256446	2023-06-21 16:03:24.256446	0	68
932	dfgdggfdg	2023-06-21 16:44:18.433592	2023-06-21 16:44:18.433592	29	85
923	Grayce_Dach has left the room	2023-06-21 16:03:31.406571	2023-06-21 16:03:31.406571	0	68
924	Grayce_Dach has join the room	2023-06-21 16:03:33.384941	2023-06-21 16:03:33.384941	0	68
954	Grayce_Dach has left the room	2023-06-21 16:53:20.604332	2023-06-21 16:53:20.604332	0	85
925	Grayce_Dach has left the room	2023-06-21 16:03:35.163229	2023-06-21 16:03:35.163229	0	68
933	sdf	2023-06-21 16:46:21.70606	2023-06-21 16:46:21.70606	29	85
926	Grayce_Dach has join the room	2023-06-21 16:03:36.271822	2023-06-21 16:03:36.271822	0	68
927	jrasser has left the room	2023-06-21 16:03:45.511154	2023-06-21 16:03:45.511154	0	68
942	fdgdggf	2023-06-21 16:52:15.10064	2023-06-21 16:52:15.10064	32	85
934	Grayce_Dach has join the room	2023-06-21 16:46:26.458345	2023-06-21 16:46:26.458345	0	85
948	olooooolol	2023-06-21 16:53:01.688038	2023-06-21 16:53:01.688038	32	85
935	sdfsfsfssfd	2023-06-21 16:46:31.39313	2023-06-21 16:46:31.39313	32	85
943	Grayce_Dach has left the room	2023-06-21 16:52:17.794039	2023-06-21 16:52:17.794039	0	85
936	sdfsdsfd	2023-06-21 16:46:38.748044	2023-06-21 16:46:38.748044	29	85
937	xvxcvcv	2023-06-21 16:48:56.745808	2023-06-21 16:48:56.745808	35	85
938	sdfghjk	2023-06-21 16:51:53.532879	2023-06-21 16:51:53.532879	32	85
944	Grayce_Dach has join the room	2023-06-21 16:52:29.936046	2023-06-21 16:52:29.936046	0	85
939	dfgdfgfg	2023-06-21 16:51:56.116575	2023-06-21 16:51:56.116575	29	85
940	dfgdfggdfdg	2023-06-21 16:52:07.867898	2023-06-21 16:52:07.867898	29	68
952	Grayce_Dach has left the room	2023-06-21 16:53:15.657673	2023-06-21 16:53:15.657673	0	85
945	Grayce_Dach has left the room	2023-06-21 16:52:37.633483	2023-06-21 16:52:37.633483	0	85
949	Grayce_Dach has left the room	2023-06-21 16:53:03.29406	2023-06-21 16:53:03.29406	0	85
946	Grayce_Dach has join the room	2023-06-21 16:52:48.039121	2023-06-21 16:52:48.039121	0	85
947	ffffffffff	2023-06-21 16:52:54.291482	2023-06-21 16:52:54.291482	29	85
950	Grayce_Dach has join the room	2023-06-21 16:53:07.989331	2023-06-21 16:53:07.989331	0	85
951	ok	2023-06-21 16:53:14.022299	2023-06-21 16:53:14.022299	32	85
953	Grayce_Dach has join the room	2023-06-21 16:53:18.839359	2023-06-21 16:53:18.839359	0	85
955	Grayce_Dach has join the room	2023-06-21 16:53:21.766483	2023-06-21 16:53:21.766483	0	85
956	Grayce_Dach has left the room	2023-06-21 16:53:23.841982	2023-06-21 16:53:23.841982	0	85
957	Grayce_Dach has join the room	2023-06-21 16:53:24.980429	2023-06-21 16:53:24.980429	0	85
958	dfggdgdgfg f gdfg	2023-06-21 16:53:29.354462	2023-06-21 16:53:29.354462	35	85
959	 dfg fdg fd gdf gdfg	2023-06-21 16:53:32.534938	2023-06-21 16:53:32.534938	29	85
960	fffffff	2023-06-21 16:53:46.83679	2023-06-21 16:53:46.83679	29	85
961	Grayce_Dach has left the room	2023-06-21 16:53:48.932268	2023-06-21 16:53:48.932268	0	85
962	Grayce_Dach has join the room	2023-06-21 16:53:53.544753	2023-06-21 16:53:53.544753	0	85
963	Grayce_Dach has left the room	2023-06-21 16:54:00.331443	2023-06-21 16:54:00.331443	0	85
1695	klkllk	2023-06-22 01:45:27.329118	2023-06-22 01:45:27.329118	35	90
964	Grayce_Dach has join the room	2023-06-21 16:54:02.56396	2023-06-21 16:54:02.56396	0	85
1697	1	2023-06-22 01:45:29.880961	2023-06-22 01:45:29.880961	35	90
965	ddssfsddsf	2023-06-21 17:02:03.0428	2023-06-21 17:02:03.0428	29	85
994	ok	2023-06-21 17:06:26.537672	2023-06-21 17:06:26.537672	29	85
966	ffffffff	2023-06-21 17:02:08.478859	2023-06-21 17:02:08.478859	35	85
967	Grayce_Dach has left the room	2023-06-21 17:02:14.273924	2023-06-21 17:02:14.273924	0	85
1012	ffffff	2023-06-21 17:10:51.68871	2023-06-21 17:10:51.68871	29	85
968	Grayce_Dach has join the room	2023-06-21 17:02:19.321122	2023-06-21 17:02:19.321122	0	85
995	nice	2023-06-21 17:06:31.198764	2023-06-21 17:06:31.198764	32	85
969	Grayce_Dach has left the room	2023-06-21 17:02:21.579615	2023-06-21 17:02:21.579615	0	85
970	Grayce_Dach has join the room	2023-06-21 17:02:22.887848	2023-06-21 17:02:22.887848	0	85
971	Grayce_Dach has left the room	2023-06-21 17:02:24.226409	2023-06-21 17:02:24.226409	0	85
996	Grayce_Dach has left the room	2023-06-21 17:06:36.948625	2023-06-21 17:06:36.948625	0	85
972	Grayce_Dach has join the room	2023-06-21 17:02:25.385907	2023-06-21 17:02:25.385907	0	85
973	Grayce_Dach has left the room	2023-06-21 17:02:27.189246	2023-06-21 17:02:27.189246	0	85
974	ghjghj	2023-06-21 17:03:14.359948	2023-06-21 17:03:14.359948	29	85
997	Grayce_Dach has join the room	2023-06-21 17:06:48.316011	2023-06-21 17:06:48.316011	0	85
975	jjjjj	2023-06-21 17:04:11.868803	2023-06-21 17:04:11.868803	29	85
976	fghfgfghfhfghfhhfgh	2023-06-21 17:04:18.068387	2023-06-21 17:04:18.068387	35	85
1013	ffffffffff	2023-06-21 17:10:58.382215	2023-06-21 17:10:58.382215	32	85
977	hhh	2023-06-21 17:04:22.93609	2023-06-21 17:04:22.93609	35	85
998	fffff	2023-06-21 17:06:52.885176	2023-06-21 17:06:52.885176	29	85
978	dfgdfgfdgfgdfgfgdfgf	2023-06-21 17:04:25.961846	2023-06-21 17:04:25.961846	29	85
979	ggggggggg	2023-06-21 17:04:44.630531	2023-06-21 17:04:44.630531	29	85
980	ggggg	2023-06-21 17:05:37.670091	2023-06-21 17:05:37.670091	32	68
999	ddsfsdfdsfdsfsfsdfsdf	2023-06-21 17:06:54.914316	2023-06-21 17:06:54.914316	29	85
981	fdgfdg fg gddfgf	2023-06-21 17:05:41.078114	2023-06-21 17:05:41.078114	29	85
982	Grayce_Dach has left the room	2023-06-21 17:05:44.40475	2023-06-21 17:05:44.40475	0	68
983	Grayce_Dach has join the room	2023-06-21 17:05:48.170075	2023-06-21 17:05:48.170075	0	85
1000	Grayce_Dach has been muted this idiot	2023-06-21 17:07:21.962872	2023-06-21 17:07:21.962872	0	85
984	Grayce_Dach has left the room	2023-06-21 17:05:50.590661	2023-06-21 17:05:50.590661	0	85
985	Grayce_Dach has join the room	2023-06-21 17:05:52.063111	2023-06-21 17:05:52.063111	0	85
1014	Grayce_Dach has left the room	2023-06-21 17:11:01.236559	2023-06-21 17:11:01.236559	0	85
986	Grayce_Dach has left the room	2023-06-21 17:05:53.245368	2023-06-21 17:05:53.245368	0	85
1001	Grayce_Dach has been unmuted	2023-06-21 17:07:42.284988	2023-06-21 17:07:42.284988	0	85
987	Grayce_Dach has join the room	2023-06-21 17:05:54.282325	2023-06-21 17:05:54.282325	0	85
988	Grayce_Dach has left the room	2023-06-21 17:05:55.481177	2023-06-21 17:05:55.481177	0	85
989	Grayce_Dach has join the room	2023-06-21 17:05:56.440441	2023-06-21 17:05:56.440441	0	85
1002	rtyuiolp[	2023-06-21 17:07:46.950914	2023-06-21 17:07:46.950914	32	85
990	fffffff	2023-06-21 17:06:00.326404	2023-06-21 17:06:00.326404	29	85
991	sfdsfsfdsfsdf	2023-06-21 17:06:05.099067	2023-06-21 17:06:05.099067	32	85
1024	hhhh	2023-06-21 17:17:22.312189	2023-06-21 17:17:22.312189	35	84
992	Grayce_Dach has left the room	2023-06-21 17:06:18.046779	2023-06-21 17:06:18.046779	0	85
1003	Grayce_Dach has join the room	2023-06-21 17:09:31.18688	2023-06-21 17:09:31.18688	0	68
993	Grayce_Dach has join the room	2023-06-21 17:06:23.420077	2023-06-21 17:06:23.420077	0	85
1015	Grayce_Dach has join the room	2023-06-21 17:11:04.055795	2023-06-21 17:11:04.055795	0	85
1004	Grayce_Dach has join the room	2023-06-21 17:09:32.125154	2023-06-21 17:09:32.125154	0	69
1005	Grayce_Dach has join the room	2023-06-21 17:09:33.851569	2023-06-21 17:09:33.851569	0	86
1016	Grayce_Dach has left the room	2023-06-21 17:11:05.660198	2023-06-21 17:11:05.660198	0	85
1006	bliblbi	2023-06-21 17:09:39.331688	2023-06-21 17:09:39.331688	32	85
1007	dsfds dsf df	2023-06-21 17:09:42.876428	2023-06-21 17:09:42.876428	29	85
1035	adasdsa ds sadas sad	2023-06-21 17:19:47.443109	2023-06-21 17:19:47.443109	32	86
1008	Grayce_Dach has left the room	2023-06-21 17:09:47.504369	2023-06-21 17:09:47.504369	0	85
1017	Grayce_Dach has join the room	2023-06-21 17:11:08.017417	2023-06-21 17:11:08.017417	0	85
1009	Grayce_Dach has join the room	2023-06-21 17:09:51.942392	2023-06-21 17:09:51.942392	0	85
1010	fdfsfsdf	2023-06-21 17:10:44.80555	2023-06-21 17:10:44.80555	32	85
1025	sdfsdsdfssdf	2023-06-21 17:17:40.817029	2023-06-21 17:17:40.817029	32	85
1011	sdfsdfsdfsdf sdf sdf	2023-06-21 17:10:49.374795	2023-06-21 17:10:49.374795	29	85
1018	Grayce_Dach has left the room	2023-06-21 17:11:10.049109	2023-06-21 17:11:10.049109	0	85
1031	sdf	2023-06-21 17:18:58.543655	2023-06-21 17:18:58.543655	32	85
1019	Grayce_Dach has join the room	2023-06-21 17:11:15.079152	2023-06-21 17:11:15.079152	0	85
1026	ffffffffffffff	2023-06-21 17:17:43.862958	2023-06-21 17:17:43.862958	32	85
1020	dsfssf	2023-06-21 17:15:04.169947	2023-06-21 17:15:04.169947	35	84
1021	ok	2023-06-21 17:15:50.15682	2023-06-21 17:15:50.15682	32	85
1022	sfsdfdsfsfdsfdsf	2023-06-21 17:15:52.163968	2023-06-21 17:15:52.163968	32	85
1027	sdf	2023-06-21 17:17:49.593845	2023-06-21 17:17:49.593845	35	85
1023	fffff	2023-06-21 17:15:56.780417	2023-06-21 17:15:56.780417	32	85
1028	sdfsdfdfsfsdssdf	2023-06-21 17:17:53.785368	2023-06-21 17:17:53.785368	32	85
1032	loloololololoololol	2023-06-21 17:19:28.709103	2023-06-21 17:19:28.709103	32	85
1029	dsfsfdsfsdfsffsfsfdsf sd fsf fsdfds sdf dsf sdf sf dsfsdfdsfds f	2023-06-21 17:18:49.127493	2023-06-21 17:18:49.127493	29	85
1030	ffff	2023-06-21 17:18:53.38051	2023-06-21 17:18:53.38051	32	85
1033	aaaaaaaa	2023-06-21 17:19:34.864567	2023-06-21 17:19:34.864567	32	85
1036	Grayce_Dach has left the room	2023-06-21 17:19:52.804355	2023-06-21 17:19:52.804355	0	85
1034	ssssssss	2023-06-21 17:19:43.823089	2023-06-21 17:19:43.823089	32	68
1038	tchao	2023-06-21 17:20:00.268961	2023-06-21 17:20:00.268961	29	85
1037	ok	2023-06-21 17:19:56.503961	2023-06-21 17:19:56.503961	35	85
1039	Grayce_Dach has join the room	2023-06-21 17:20:04.099938	2023-06-21 17:20:04.099938	0	85
1040	sdsa ds adsadad	2023-06-21 17:20:08.783796	2023-06-21 17:20:08.783796	32	85
1041	ddddddd	2023-06-21 17:20:17.001606	2023-06-21 17:20:17.001606	32	85
1042	sadsadsad sa sasad sdsa	2023-06-21 17:20:19.288502	2023-06-21 17:20:19.288502	32	85
1043	ggggg	2023-06-21 17:20:24.334885	2023-06-21 17:20:24.334885	29	85
1044	mmmmmm	2023-06-21 17:20:37.33371	2023-06-21 17:20:37.33371	32	85
1045	sdasdsadasdsadsad	2023-06-21 17:20:39.595093	2023-06-21 17:20:39.595093	32	85
1046	dsfsfdssf	2023-06-21 17:21:52.933077	2023-06-21 17:21:52.933077	32	85
1047	sdfsddfdf	2023-06-21 17:21:57.372699	2023-06-21 17:21:57.372699	32	85
1048	dsfssddssdf	2023-06-21 17:21:59.676444	2023-06-21 17:21:59.676444	35	85
1049	ddddd	2023-06-21 17:22:20.298559	2023-06-21 17:22:20.298559	29	85
1050	gfgfgffgfgf	2023-06-21 17:22:27.605029	2023-06-21 17:22:27.605029	32	85
1051	sdfdsfsfsdsdfd	2023-06-21 17:22:34.346999	2023-06-21 17:22:34.346999	35	84
1082	dddddddsdas asd sad sa dsad	2023-06-21 17:26:35.278837	2023-06-21 17:26:38.219	32	85
1052	df	2023-06-21 17:22:36.116319	2023-06-21 17:22:36.116319	29	85
1053	gfgfffgf fgfffgfg	2023-06-21 17:22:51.05746	2023-06-21 17:22:51.05746	32	85
1054	Grayce_Dach has left the room	2023-06-21 17:22:54.875138	2023-06-21 17:22:54.875138	0	85
1083	Grayce_Dach has left the room	2023-06-21 17:26:41.868192	2023-06-21 17:26:41.868192	0	85
1055	Grayce_Dach has join the room	2023-06-21 17:22:58.807536	2023-06-21 17:22:58.807536	0	85
1056	iiiiii	2023-06-21 17:23:03.041673	2023-06-21 17:23:03.041673	32	85
1057	dddddd	2023-06-21 17:23:05.276129	2023-06-21 17:23:05.276129	29	85
1084	Grayce_Dach has join the room	2023-06-21 17:26:51.399814	2023-06-21 17:26:51.399814	0	85
1058	Laron76 has left the room	2023-06-21 17:23:07.398549	2023-06-21 17:23:07.398549	0	85
1059	ah ?	2023-06-21 17:23:13.998411	2023-06-21 17:23:13.998411	35	85
1102	mouahahaa	2023-06-21 17:56:22.162613	2023-06-21 17:56:22.162613	32	84
1060	Laron76 has join the room	2023-06-21 17:23:18.993561	2023-06-21 17:23:18.993561	0	85
1085	ddddddd	2023-06-21 17:26:55.28477	2023-06-21 17:26:55.28477	32	85
1061	ouf	2023-06-21 17:23:21.826084	2023-06-21 17:23:21.826084	35	85
1062	yes	2023-06-21 17:23:24.821706	2023-06-21 17:23:24.821706	32	85
1063	yeah	2023-06-21 17:23:28.762504	2023-06-21 17:23:28.762504	29	85
1086	asdasadssad	2023-06-21 17:26:58.334419	2023-06-21 17:26:58.334419	29	85
1064	Laron76 has been muted this idiot	2023-06-21 17:23:58.024511	2023-06-21 17:23:58.024511	0	85
1065	Laron76 has been kicked	2023-06-21 17:24:08.697569	2023-06-21 17:24:08.697569	0	85
1066	Laron76 has join the room	2023-06-21 17:24:14.414625	2023-06-21 17:24:14.414625	0	85
1087	sdasd sa s dsasd	2023-06-21 17:27:01.529493	2023-06-21 17:27:01.529493	35	85
1067	Laron76 has been unmuted	2023-06-21 17:24:18.355508	2023-06-21 17:24:18.355508	0	85
1068	asd	2023-06-21 17:24:21.329466	2023-06-21 17:24:21.329466	29	85
1103	aaaa	2023-06-21 17:56:37.759104	2023-06-21 17:56:37.759104	29	84
1069	sdfdssfsdfdfs	2023-06-21 17:24:43.083626	2023-06-21 17:24:43.083626	29	85
1088	fgdfgdfgdffg	2023-06-21 17:36:18.649669	2023-06-21 17:36:18.649669	35	84
1070	sdfsddsfsdfsdf	2023-06-21 17:24:45.659037	2023-06-21 17:24:45.659037	32	85
1071	fffffffff	2023-06-21 17:24:52.467667	2023-06-21 17:24:52.467667	32	85
1072	sdfsdfsfdf	2023-06-21 17:24:54.617773	2023-06-21 17:24:54.617773	32	85
1089	fgdfgfdgf dfg	2023-06-21 17:36:24.76412	2023-06-21 17:36:24.76412	35	85
1073	dddddd	2023-06-21 17:24:58.944165	2023-06-21 17:24:58.944165	32	85
1074	ggggg	2023-06-21 17:25:10.43738	2023-06-21 17:25:10.43738	32	85
1114	jrasser has join the room	2023-06-21 18:06:57.184452	2023-06-21 18:06:57.184452	0	68
1075	fgfgffg	2023-06-21 17:26:07.544384	2023-06-21 17:26:07.544384	32	85
1090	gfdgdfg	2023-06-21 17:36:27.862983	2023-06-21 17:36:27.862983	35	68
1076	sdasdasdasd	2023-06-21 17:26:09.488863	2023-06-21 17:26:09.488863	32	85
1077	fffff	2023-06-21 17:26:12.108631	2023-06-21 17:26:12.108631	29	85
1104	aaaaa	2023-06-21 17:56:40.432338	2023-06-21 17:56:40.432338	29	68
1078	ddddddd	2023-06-21 17:26:14.396813	2023-06-21 17:26:14.396813	29	85
1091	gggggg	2023-06-21 17:36:47.993565	2023-06-21 17:36:47.993565	35	85
1079	dfdfdfdff	2023-06-21 17:26:20.288521	2023-06-21 17:26:20.288521	29	85
1080	jujujuujuuuuj	2023-06-21 17:26:30.944074	2023-06-21 17:26:30.944074	29	85
1081	sadasdsdasdsd	2023-06-21 17:26:32.818367	2023-06-21 17:26:32.818367	29	85
1092	szdxfghj	2023-06-21 17:37:37.634895	2023-06-21 17:37:37.634895	35	86
1105	hihihihihi	2023-06-21 17:57:55.099528	2023-06-21 17:57:55.099528	35	85
1093	hgfdsa	2023-06-21 17:38:38.281793	2023-06-21 17:38:38.281793	35	85
1094	sdfghjkl	2023-06-21 17:52:03.384123	2023-06-21 17:52:03.384123	35	85
1120	Grayce_Dach has left the room	2023-06-21 18:07:19.789015	2023-06-21 18:07:19.789015	0	68
1095	sdsssd	2023-06-21 17:55:35.806253	2023-06-21 17:55:35.806253	35	84
1106	dfgdfgfdgg	2023-06-21 17:57:57.950931	2023-06-21 17:57:57.950931	32	84
1096	coucou	2023-06-21 17:55:40.882961	2023-06-21 17:55:40.882961	29	84
1097	Grayce_Dach has join the room	2023-06-21 17:55:53.346076	2023-06-21 17:55:53.346076	0	84
1115	Grayce_Dach has join the room	2023-06-21 18:06:59.761599	2023-06-21 18:06:59.761599	0	68
1098	ffffff	2023-06-21 17:55:56.825382	2023-06-21 17:55:56.825382	32	84
1107	blabla	2023-06-21 17:59:39.116552	2023-06-21 17:59:39.116552	32	68
1099	sdfdsdsfdf	2023-06-21 17:55:58.160806	2023-06-21 17:55:58.160806	32	84
1100	Grayce_Dach has left the room	2023-06-21 17:56:09.014575	2023-06-21 17:56:09.014575	0	84
1101	Grayce_Dach has join the room	2023-06-21 17:56:17.882209	2023-06-21 17:56:17.882209	0	84
1108	sdfdsdf	2023-06-21 18:06:16.627334	2023-06-21 18:06:16.627334	29	68
1109	fffff	2023-06-21 18:06:21.580201	2023-06-21 18:06:21.580201	35	68
1116	Grayce_Dach has left the room	2023-06-21 18:07:01.333503	2023-06-21 18:07:01.333503	0	68
1110	Grayce_Dach has left the room	2023-06-21 18:06:28.867765	2023-06-21 18:06:28.867765	0	84
1111	Grayce_Dach has join the room	2023-06-21 18:06:40.469047	2023-06-21 18:06:40.469047	0	84
1126	fffffffsdfdsdsfsdf	2023-06-21 18:18:50.749371	2023-06-21 18:18:53.88	35	85
1112	Grayce_Dach has left the room	2023-06-21 18:06:50.507194	2023-06-21 18:06:50.507194	0	68
1117	Grayce_Dach has join the room	2023-06-21 18:07:02.252041	2023-06-21 18:07:02.252041	0	68
1113	jrasser has left the room	2023-06-21 18:06:54.737015	2023-06-21 18:06:54.737015	0	68
1121	Grayce_Dach has left the room	2023-06-21 18:10:16.754018	2023-06-21 18:10:16.754018	0	85
1118	Grayce_Dach has left the room	2023-06-21 18:07:03.169839	2023-06-21 18:07:03.169839	0	68
1119	Grayce_Dach has join the room	2023-06-21 18:07:04.144997	2023-06-21 18:07:04.144997	0	68
1124	Grayce_Dach has left the room	2023-06-21 18:10:35.373602	2023-06-21 18:10:35.373602	0	85
1122	Grayce_Dach has join the room	2023-06-21 18:10:20.065925	2023-06-21 18:10:20.065925	0	68
1123	Grayce_Dach has join the room	2023-06-21 18:10:22.330263	2023-06-21 18:10:22.330263	0	85
1125	dfddfdf	2023-06-21 18:18:47.416518	2023-06-21 18:18:47.416518	29	85
1696	klkllk	2023-06-22 01:45:27.329	2023-06-22 01:45:27.329	35	90
1698	1	2023-06-22 01:45:29.88	2023-06-22 01:45:29.88	35	90
1127	dddddd	2023-06-21 18:18:59.515597	2023-06-21 18:18:59.515597	32	68
2041	1	2023-06-22 02:06:51.729944	2023-06-22 02:06:51.729944	35	85
2043	2	2023-06-22 02:06:53.21123	2023-06-22 02:06:53.21123	35	85
1716	1	2023-06-22 01:45:33.985	2023-06-22 01:45:33.985	35	90
1708	1	2023-06-22 01:45:31.981247	2023-06-22 01:45:31.981247	\N	90
1717	1	2023-06-22 01:45:34.429903	2023-06-22 01:45:34.429903	35	90
2045	3	2023-06-22 02:06:54.772081	2023-06-22 02:06:54.772081	35	85
1701	1	2023-06-22 01:45:30.806196	2023-06-22 01:45:30.806196	35	90
2047	4	2023-06-22 02:06:56.348716	2023-06-22 02:06:56.348716	35	85
2049	5	2023-06-22 02:06:57.797081	2023-06-22 02:06:57.797081	35	85
2051	6	2023-06-22 02:06:59.196416	2023-06-22 02:06:59.196416	35	85
2359	1111111111111	2023-06-22 02:47:22.182762	2023-06-22 02:47:22.182762	35	90
2333	5	2023-06-22 02:37:34.188286	2023-06-22 02:37:34.188286	35	\N
1699	1	2023-06-22 01:45:30.351935	2023-06-22 01:45:30.351935	35	90
2360	1	2023-06-22 02:47:26.242419	2023-06-22 02:47:26.242419	35	90
2361	g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  g d gdg g dg dg d fg fdg fg  	2023-06-22 02:47:37.356238	2023-06-22 02:47:37.356238	35	90
2404	6	2023-06-22 03:14:36.003281	2023-06-22 03:14:36.003281	\N	89
1702	1	2023-06-22 01:45:30.806	2023-06-22 01:45:30.806	\N	90
2042	1	2023-06-22 02:06:51.729	2023-06-22 02:06:51.729	35	85
2044	2	2023-06-22 02:06:53.211	2023-06-22 02:06:53.211	35	85
2046	3	2023-06-22 02:06:54.772	2023-06-22 02:06:54.772	35	85
2048	4	2023-06-22 02:06:56.348	2023-06-22 02:06:56.348	35	85
2050	5	2023-06-22 02:06:57.797	2023-06-22 02:06:57.797	35	85
2052	6	2023-06-22 02:06:59.196	2023-06-22 02:06:59.196	35	85
2235	9	2023-06-22 02:23:59.61874	2023-06-22 02:23:59.61874	35	85
2224	5	2023-06-22 02:23:47.42556	2023-06-22 02:23:47.42556	35	\N
2284	ff	2023-06-22 02:29:05.859778	2023-06-22 02:29:05.859778	29	85
2473	9	2023-06-22 03:40:07.458163	2023-06-22 03:40:07.458163	35	91
2468	3	2023-06-22 03:39:54.30395	2023-06-22 03:39:54.30395	\N	\N
2273	5	2023-06-22 02:28:56.915957	2023-06-22 02:28:56.915957	\N	85
2274	9	2023-06-22 02:28:57.459276	2023-06-22 02:28:57.459276	\N	85
2279	f	2023-06-22 02:29:05.122312	2023-06-22 02:29:05.122312	\N	\N
2285	1	2023-06-22 02:29:12.174141	2023-06-22 02:29:12.174141	29	85
2286	1	2023-06-22 02:29:12.418031	2023-06-22 02:29:12.418031	29	85
2287	1	2023-06-22 02:29:12.670019	2023-06-22 02:29:12.670019	29	85
2288	1	2023-06-22 02:29:12.900202	2023-06-22 02:29:12.900202	29	85
2289	1	2023-06-22 02:29:13.144745	2023-06-22 02:29:13.144745	29	85
2290	1	2023-06-22 02:29:13.369145	2023-06-22 02:29:13.369145	29	85
2291	1	2023-06-22 02:29:13.654147	2023-06-22 02:29:13.654147	29	85
2292	1	2023-06-22 02:29:13.87795	2023-06-22 02:29:13.87795	29	85
2293	1	2023-06-22 02:29:15.148314	2023-06-22 02:29:15.148314	29	85
2294	5	2023-06-22 02:29:16.357529	2023-06-22 02:29:16.357529	29	85
2295	6	2023-06-22 02:29:16.571018	2023-06-22 02:29:16.571018	29	85
2296	7	2023-06-22 02:29:16.808268	2023-06-22 02:29:16.808268	29	85
2297	8	2023-06-22 02:29:17.055806	2023-06-22 02:29:17.055806	29	85
2298	9	2023-06-22 02:29:17.291895	2023-06-22 02:29:17.291895	29	85
2299	1	2023-06-22 02:29:19.401398	2023-06-22 02:29:19.401398	35	85
2648	gjhghjhgj ggghhgghghj	2023-06-22 03:47:24.171587	2023-06-22 03:47:24.171587	29	91
2649	1	2023-06-22 03:47:25.401243	2023-06-22 03:47:25.401243	29	91
2650	2	2023-06-22 03:47:25.596936	2023-06-22 03:47:25.596936	29	91
2652	4	2023-06-22 03:47:26.036524	2023-06-22 03:47:26.036524	29	91
2654	6	2023-06-22 03:47:26.483141	2023-06-22 03:47:26.483141	29	91
2655	7	2023-06-22 03:47:27.089959	2023-06-22 03:47:27.089959	29	91
2656	8	2023-06-22 03:47:27.40375	2023-06-22 03:47:27.40375	29	91
2659	1	2023-06-22 03:47:32.545177	2023-06-22 03:47:32.545177	29	91
2302	7	2023-06-22 02:29:22.811256	2023-06-22 02:29:22.811256	\N	85
2310	9	2023-06-22 02:29:33.116023	2023-06-22 02:29:33.116023	35	\N
2334	1	2023-06-22 02:37:49.63014	2023-06-22 02:37:49.63014	35	85
2661	1	2023-06-22 03:47:32.988218	2023-06-22 03:47:32.988218	29	91
1700	1	2023-06-22 01:45:30.351	2023-06-22 01:45:30.351	35	90
1705	1	2023-06-22 01:45:31.777289	2023-06-22 01:45:31.777289	35	90
1139	sdfsdfdsfsfsfsdfsdffsdfdsffsfsfsf	2023-06-21 18:19:07.494929	2023-06-21 18:19:07.494929	32	68
2053	1	2023-06-22 02:07:11.093768	2023-06-22 02:07:11.093768	35	85
1141	f	2023-06-21 18:19:07.760781	2023-06-21 18:19:07.760781	32	68
2055	1	2023-06-22 02:07:12.541932	2023-06-22 02:07:12.541932	35	85
2057	1	2023-06-22 02:07:13.979698	2023-06-22 02:07:13.979698	35	85
2059	1	2023-06-22 02:07:15.605203	2023-06-22 02:07:15.605203	35	85
2061	1	2023-06-22 02:07:17.103559	2023-06-22 02:07:17.103559	35	85
2063	1	2023-06-22 02:07:18.682986	2023-06-22 02:07:18.682986	35	85
2065	15	2023-06-22 02:07:28.518632	2023-06-22 02:07:28.518632	35	85
2067	5	2023-06-22 02:07:30.077276	2023-06-22 02:07:30.077276	35	85
2069	5	2023-06-22 02:07:31.638067	2023-06-22 02:07:31.638067	35	85
2071	5	2023-06-22 02:07:33.284096	2023-06-22 02:07:33.284096	35	85
2073	5	2023-06-22 02:07:34.817974	2023-06-22 02:07:34.817974	35	85
2075	5	2023-06-22 02:07:36.367158	2023-06-22 02:07:36.367158	35	85
2077	5	2023-06-22 02:07:37.889642	2023-06-22 02:07:37.889642	35	85
2225	4	2023-06-22 02:23:48.581301	2023-06-22 02:23:48.581301	35	85
2362	g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg g d gdg g dg dg d fg fdg fg	2023-06-22 02:47:57.248312	2023-06-22 02:47:57.248312	35	90
2363	2	2023-06-22 02:48:01.172647	2023-06-22 02:48:01.172647	35	90
2275	8	2023-06-22 02:28:57.988726	2023-06-22 02:28:57.988726	\N	85
2405	5	2023-06-22 03:14:36.034506	2023-06-22 03:14:36.034506	35	\N
2335	2	2023-06-22 02:37:51.251179	2023-06-22 02:37:51.251179	\N	\N
2341	8	2023-06-22 02:37:59.198266	2023-06-22 02:37:59.198266	\N	\N
2469	4	2023-06-22 03:39:55.752568	2023-06-22 03:39:55.752568	\N	\N
2651	3	2023-06-22 03:47:25.809342	2023-06-22 03:47:25.809342	29	91
2653	5	2023-06-22 03:47:26.259236	2023-06-22 03:47:26.259236	29	91
2657	9	2023-06-22 03:47:27.605775	2023-06-22 03:47:27.605775	29	91
2658	1	2023-06-22 03:47:32.312759	2023-06-22 03:47:32.312759	29	91
2660	1	2023-06-22 03:47:32.770227	2023-06-22 03:47:32.770227	29	91
2662	11	2023-06-22 03:47:33.200657	2023-06-22 03:47:33.200657	29	91
1138	sdfsdfdsfsfsfsdfsdffsdfdsf	2023-06-21 18:19:06.337705	2023-06-21 18:19:06.337705	32	68
2364	e	2023-06-22 02:50:57.663056	2023-06-22 02:50:57.663056	35	90
1143	d	2023-06-21 18:19:12.817839	2023-06-21 18:19:12.817839	32	68
2365	r	2023-06-22 02:51:00.386732	2023-06-22 02:51:00.386732	35	90
1144	f	2023-06-21 18:19:13.614325	2023-06-21 18:19:13.614325	32	68
2366	r	2023-06-22 02:51:02.14532	2023-06-22 02:51:02.14532	35	90
1145	d	2023-06-21 18:19:14.190968	2023-06-21 18:19:14.190968	32	68
2367	r	2023-06-22 02:51:03.848086	2023-06-22 02:51:03.848086	35	90
1146	s	2023-06-21 18:19:14.653774	2023-06-21 18:19:14.653774	32	68
2368	r	2023-06-22 02:51:05.49779	2023-06-22 02:51:05.49779	35	90
1147	a	2023-06-21 18:19:15.110812	2023-06-21 18:19:15.110812	32	68
2369	r	2023-06-22 02:51:07.242985	2023-06-22 02:51:07.242985	35	90
1148	s	2023-06-21 18:19:15.501414	2023-06-21 18:19:15.501414	32	68
1703	1	2023-06-22 01:45:30.826118	2023-06-22 01:45:30.826118	\N	\N
1149	d	2023-06-21 18:19:15.851335	2023-06-21 18:19:15.851335	32	68
2054	1	2023-06-22 02:07:11.093	2023-06-22 02:07:11.093	35	85
1150	f	2023-06-21 18:19:16.193056	2023-06-21 18:19:16.193056	32	68
2056	1	2023-06-22 02:07:12.541	2023-06-22 02:07:12.541	35	85
1151	g	2023-06-21 18:19:16.536941	2023-06-21 18:19:16.536941	32	68
2058	1	2023-06-22 02:07:13.979	2023-06-22 02:07:13.979	35	85
1152	r	2023-06-21 18:19:17.223362	2023-06-21 18:19:17.223362	32	68
2060	1	2023-06-22 02:07:15.605	2023-06-22 02:07:15.605	35	85
1153	w	2023-06-21 18:19:17.837902	2023-06-21 18:19:17.837902	32	68
2062	1	2023-06-22 02:07:17.103	2023-06-22 02:07:17.103	35	85
1154	q	2023-06-21 18:19:18.264377	2023-06-21 18:19:18.264377	32	68
2064	1	2023-06-22 02:07:18.682	2023-06-22 02:07:18.682	35	85
1155	ddddd	2023-06-21 18:19:20.014789	2023-06-21 18:19:20.014789	32	68
2066	15	2023-06-22 02:07:28.518	2023-06-22 02:07:28.518	35	85
1156	dfsdf df sd fsd dsf f dsf sdf sf	2023-06-21 18:19:23.27392	2023-06-21 18:19:23.27392	32	68
2068	5	2023-06-22 02:07:30.077	2023-06-22 02:07:30.077	35	85
2070	5	2023-06-22 02:07:31.638	2023-06-22 02:07:31.638	35	85
2072	5	2023-06-22 02:07:33.284	2023-06-22 02:07:33.284	35	85
2074	5	2023-06-22 02:07:34.817	2023-06-22 02:07:34.817	35	85
2076	5	2023-06-22 02:07:36.367	2023-06-22 02:07:36.367	35	85
2078	5	2023-06-22 02:07:37.889	2023-06-22 02:07:37.889	35	85
2370	r	2023-06-22 02:51:08.898589	2023-06-22 02:51:08.898589	35	90
2227	6	2023-06-22 02:23:49.775963	2023-06-22 02:23:49.775963	\N	\N
2371	rr	2023-06-22 02:51:10.67543	2023-06-22 02:51:10.67543	35	90
2372	r	2023-06-22 02:51:12.336349	2023-06-22 02:51:12.336349	35	90
2276	7	2023-06-22 02:29:00.628298	2023-06-22 02:29:00.628298	\N	85
2406	7	2023-06-22 03:14:39.952037	2023-06-22 03:14:39.952037	\N	89
2413	1	2023-06-22 03:18:58.559459	2023-06-22 03:18:58.559459	35	89
2336	5	2023-06-22 02:37:51.303665	2023-06-22 02:37:51.303665	\N	\N
2342	9	2023-06-22 02:38:00.211376	2023-06-22 02:38:00.211376	\N	\N
2470	5	2023-06-22 03:39:55.75599	2023-06-22 03:39:55.75599	\N	\N
2663	Grayce_Dach has join the room	2023-06-22 03:48:29.384318	2023-06-22 03:48:29.384318	0	91
2664	1	2023-06-22 03:48:33.624421	2023-06-22 03:48:33.624421	32	91
2665	2	2023-06-22 03:48:33.854789	2023-06-22 03:48:33.854789	32	91
2666	3	2023-06-22 03:48:34.064037	2023-06-22 03:48:34.064037	32	91
2667	4	2023-06-22 03:48:34.315669	2023-06-22 03:48:34.315669	32	91
2668	5	2023-06-22 03:48:34.555517	2023-06-22 03:48:34.555517	32	91
2669	6	2023-06-22 03:48:34.796355	2023-06-22 03:48:34.796355	32	91
2670	7	2023-06-22 03:48:35.074345	2023-06-22 03:48:35.074345	32	91
2671	8	2023-06-22 03:48:35.322929	2023-06-22 03:48:35.322929	32	91
2672	9	2023-06-22 03:48:35.594715	2023-06-22 03:48:35.594715	32	91
2673	10	2023-06-22 03:48:36.066745	2023-06-22 03:48:36.066745	32	91
2674	11	2023-06-22 03:48:36.505553	2023-06-22 03:48:36.505553	32	91
2675	12	2023-06-22 03:48:36.925426	2023-06-22 03:48:36.925426	32	91
2676	13	2023-06-22 03:48:37.356287	2023-06-22 03:48:37.356287	32	91
2677	14	2023-06-22 03:48:37.710788	2023-06-22 03:48:37.710788	32	91
2678	15	2023-06-22 03:48:38.107028	2023-06-22 03:48:38.107028	32	91
2679	16	2023-06-22 03:48:38.493239	2023-06-22 03:48:38.493239	32	91
2680	17	2023-06-22 03:48:38.974795	2023-06-22 03:48:38.974795	32	91
2681	18	2023-06-22 03:48:39.386581	2023-06-22 03:48:39.386581	32	91
2682	19	2023-06-22 03:48:39.835075	2023-06-22 03:48:39.835075	32	91
2683	20	2023-06-22 03:48:40.227963	2023-06-22 03:48:40.227963	32	91
2684	21	2023-06-22 03:48:40.740364	2023-06-22 03:48:40.740364	32	91
2685	22	2023-06-22 03:48:41.116351	2023-06-22 03:48:41.116351	32	91
2686	23	2023-06-22 03:48:41.510804	2023-06-22 03:48:41.510804	32	91
2687	24	2023-06-22 03:48:41.893441	2023-06-22 03:48:41.893441	32	91
2688	25	2023-06-22 03:48:42.255194	2023-06-22 03:48:42.255194	32	91
2689	26	2023-06-22 03:48:42.611795	2023-06-22 03:48:42.611795	32	91
2690	27	2023-06-22 03:48:43.019429	2023-06-22 03:48:43.019429	32	91
2691	28	2023-06-22 03:48:43.579594	2023-06-22 03:48:43.579594	32	91
2692	29	2023-06-22 03:48:43.992308	2023-06-22 03:48:43.992308	32	91
2693	30	2023-06-22 03:48:44.557308	2023-06-22 03:48:44.557308	32	91
2373	1	2023-06-22 02:55:52.305368	2023-06-22 02:55:52.305368	35	90
1704	1	2023-06-22 01:45:30.826	2023-06-22 01:45:30.826	35	90
2374	2	2023-06-22 02:55:54.225359	2023-06-22 02:55:54.225359	35	90
2375	3	2023-06-22 02:55:56.001012	2023-06-22 02:55:56.001012	35	90
1712	1	2023-06-22 01:45:31.981	2023-06-22 01:45:31.981	35	\N
2079	1	2023-06-22 02:10:39.795701	2023-06-22 02:10:39.795701	35	85
2081	1	2023-06-22 02:10:41.285078	2023-06-22 02:10:41.285078	35	85
2083	1	2023-06-22 02:10:43.231349	2023-06-22 02:10:43.231349	35	85
2085	1	2023-06-22 02:10:44.838201	2023-06-22 02:10:44.838201	35	85
2087	11	2023-06-22 02:10:46.468586	2023-06-22 02:10:46.468586	35	85
2408	9	2023-06-22 03:14:44.550326	2023-06-22 03:14:44.550326	35	89
2234	8	2023-06-22 02:23:57.736	2023-06-22 02:23:57.736	35	85
1137	aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa	2023-06-21 18:19:06.280241	2023-06-21 23:20:20.645	32	68
2228	3	2023-06-22 02:23:47.32	2023-06-22 02:23:47.32	35	\N
2414	3	2023-06-22 03:19:00.658774	2023-06-22 03:19:00.658774	35	\N
2277	vd dfs fdf sdf	2023-06-22 02:29:04.99016	2023-06-22 02:29:04.99016	\N	85
2422	3	2023-06-22 03:19:29.232676	2023-06-22 03:19:29.232676	\N	\N
2281	f	2023-06-22 02:29:05.233919	2023-06-22 02:29:05.233919	\N	\N
2471	6	2023-06-22 03:40:03.044676	2023-06-22 03:40:03.044676	35	\N
2337	4	2023-06-22 02:37:53.266827	2023-06-22 02:37:53.266827	35	\N
2694	ok	2023-06-22 03:48:58.226005	2023-06-22 03:48:58.226005	32	91
2695	nive	2023-06-22 03:49:00.23755	2023-06-22 03:49:00.23755	32	91
1706	1	2023-06-22 01:45:31.812811	2023-06-22 01:45:31.812811	35	90
2080	1	2023-06-22 02:10:39.795	2023-06-22 02:10:39.795	35	85
2082	1	2023-06-22 02:10:41.285	2023-06-22 02:10:41.285	35	85
1142	s	2023-06-21 18:19:08.755365	2023-06-21 18:19:08.755365	32	68
2084	1	2023-06-22 02:10:43.231	2023-06-22 02:10:43.231	35	85
2086	1	2023-06-22 02:10:44.838	2023-06-22 02:10:44.838	35	85
2088	11	2023-06-22 02:10:46.468	2023-06-22 02:10:46.468	35	85
2376	1	2023-06-22 02:58:21.571457	2023-06-22 02:58:21.571457	35	90
2381	6	2023-06-22 02:58:29.93644	2023-06-22 02:58:29.93644	35	90
2409	q	2023-06-22 03:15:43.549354	2023-06-22 03:15:43.549354	35	89
2411	8	2023-06-22 03:16:04.864934	2023-06-22 03:16:04.864934	\N	89
2229	5	2023-06-22 02:23:47.425	2023-06-22 02:23:47.425	\N	\N
2419	123	2023-06-22 03:19:10.031005	2023-06-22 03:19:10.031005	35	\N
2415	2	2023-06-22 03:19:00.692963	2023-06-22 03:19:00.692963	35	89
2475	bbcbcvbvcbcbvcbvcbcvbvcbc	2023-06-22 03:40:24.61082	2023-06-22 03:40:24.61082	35	91
2477	2	2023-06-22 03:40:29.162842	2023-06-22 03:40:29.162842	35	91
2483	8	2023-06-22 03:40:44.408866	2023-06-22 03:40:44.408866	\N	\N
2696	Grayce_Dach has left the room	2023-06-22 03:50:29.28815	2023-06-22 03:50:29.28815	0	91
2278	f	2023-06-22 02:29:05.080732	2023-06-22 02:29:05.080732	\N	\N
2282	f	2023-06-22 02:29:05.273133	2023-06-22 02:29:05.273133	\N	\N
2338	6	2023-06-22 02:37:54.352724	2023-06-22 02:37:54.352724	\N	\N
1140	sdfsdfdsfsfsfsdfsdffsdfdsffsfsf	2023-06-21 18:19:07.533131	2023-06-21 18:19:07.533131	32	68
1211	iii	2023-06-21 19:29:09.529686	2023-06-21 19:29:09.529686	35	85
1157	Grayce_Dach has join the room	2023-06-21 18:19:44.673281	2023-06-21 18:19:44.673281	0	85
1183	Laron76 has join the room	2023-06-21 18:57:08.385144	2023-06-21 18:57:08.385144	0	88
1158	Grayce_Dach has left the room	2023-06-21 18:19:54.80524	2023-06-21 18:19:54.80524	0	85
1159	dfgdfg	2023-06-21 18:26:58.07667	2023-06-21 18:26:58.07667	35	68
1201	aaaaa	2023-06-21 19:15:32.582919	2023-06-21 19:15:32.582919	29	84
1160	ggggg	2023-06-21 18:26:59.992421	2023-06-21 18:26:59.992421	29	68
1184	Grayce_Dach has join the room	2023-06-21 18:57:27.103917	2023-06-21 18:57:27.103917	0	88
1161	ffffff	2023-06-21 18:27:01.731122	2023-06-21 18:27:01.731122	32	68
1162	jrasser has left the room	2023-06-21 18:27:07.115483	2023-06-21 18:27:07.115483	0	68
1163	roooh	2023-06-21 18:27:12.770623	2023-06-21 18:27:12.770623	32	68
1185	Grayce_Dach has left the room	2023-06-21 18:58:26.466805	2023-06-21 18:58:26.466805	0	88
1164	jrasser has join the room	2023-06-21 18:28:18.907766	2023-06-21 18:28:18.907766	0	68
1165	Laron76 has left the room	2023-06-21 18:35:42.641125	2023-06-21 18:35:42.641125	0	85
1166	Laron76 has join the room	2023-06-21 18:36:09.074632	2023-06-21 18:36:09.074632	0	85
1186	Grayce_Dach has join the room	2023-06-21 19:02:07.145506	2023-06-21 19:02:07.145506	0	88
1167	Laron76 has left the room	2023-06-21 18:36:22.767822	2023-06-21 18:36:22.767822	0	85
1168	Laron76 has join the room	2023-06-21 18:36:32.158848	2023-06-21 18:36:32.158848	0	85
1202	ssss	2023-06-21 19:15:46.406421	2023-06-21 19:15:46.406421	35	84
1169	Grayce_Dach has join the room	2023-06-21 18:39:24.866242	2023-06-21 18:39:24.866242	0	85
1187	sdfsdsf dsf	2023-06-21 19:04:43.629446	2023-06-21 19:04:43.629446	35	88
1170	Grayce_Dach has left the room	2023-06-21 18:43:03.007914	2023-06-21 18:43:03.007914	0	85
1171	Grayce_Dach has join the room	2023-06-21 18:44:46.145805	2023-06-21 18:44:46.145805	0	85
1172	Grayce_Dach has left the room	2023-06-21 18:52:03.202631	2023-06-21 18:52:03.202631	0	85
1188	fsddfsdffdsdfd	2023-06-21 19:04:54.325262	2023-06-21 19:04:54.325262	29	88
1173	Invitation link http://localhost:3006/chat/channel/invitation/87/TEST	2023-06-21 18:54:02.588367	2023-06-21 18:54:02.588367	0	87
1174	Laron76 has join the room	2023-06-21 18:54:07.925063	2023-06-21 18:54:07.925063	0	87
1175	Grayce_Dach has join the room	2023-06-21 18:54:17.384729	2023-06-21 18:54:17.384729	0	87
1203	ssss	2023-06-21 19:15:49.603287	2023-06-21 19:15:49.603287	35	86
1176	Laron76 has left the room	2023-06-21 18:55:29.321436	2023-06-21 18:55:29.321436	0	87
1189	ffffffffdsffdf	2023-06-21 19:04:59.022291	2023-06-21 19:05:02.882	29	88
1177	Grayce_Dach has left the room	2023-06-21 18:55:31.910983	2023-06-21 18:55:31.910983	0	87
1178	Laron76 has join the room	2023-06-21 18:55:41.450079	2023-06-21 18:55:41.450079	0	87
1179	Grayce_Dach has join the room	2023-06-21 18:56:03.654589	2023-06-21 18:56:03.654589	0	87
1190	Grayce_Dach has left the room	2023-06-21 19:05:07.751015	2023-06-21 19:05:07.751015	0	88
1180	Grayce_Dach has left the room	2023-06-21 18:56:47.866608	2023-06-21 18:56:47.866608	0	87
1181	Laron76 has left the room	2023-06-21 18:56:49.209271	2023-06-21 18:56:49.209271	0	87
1212	dfd dsf	2023-06-21 19:29:53.113162	2023-06-21 19:29:53.113162	35	85
1182	Invitation link http://localhost:3006/chat/channel/invitation/88/TEEST	2023-06-21 18:56:56.091538	2023-06-21 18:56:56.091538	0	88
1191	Grayce_Dach has join the room	2023-06-21 19:05:40.988692	2023-06-21 19:05:40.988692	0	88
1204	adasasdsdasdd	2023-06-21 19:15:52.788375	2023-06-21 19:15:52.788375	35	88
1192	dfdf	2023-06-21 19:05:45.701057	2023-06-21 19:05:45.701057	32	88
1205	yfdsaASDFGHJKGFDS	2023-06-21 19:20:01.671266	2023-06-21 19:20:01.671266	35	68
1194	fffff	2023-06-21 19:05:49.263872	2023-06-21 19:05:49.263872	35	88
1193	fffffffsdf	2023-06-21 19:05:47.244222	2023-06-21 19:05:52.4	29	88
1195	Grayce_Dach has left the room	2023-06-21 19:05:56.394025	2023-06-21 19:05:56.394025	0	88
1196	Grayce_Dach has join the room	2023-06-21 19:06:00.145974	2023-06-21 19:06:00.145974	0	88
1206	rdtfyguiohbvkjh l ljhb	2023-06-21 19:21:27.163102	2023-06-21 19:21:27.163102	35	85
1197	xcvxcv	2023-06-21 19:06:17.22829	2023-06-21 19:06:17.22829	29	84
1198	xcvxccvxcv	2023-06-21 19:06:24.825636	2023-06-21 19:06:24.825636	35	69
1213	1	2023-06-21 19:29:54.267148	2023-06-21 19:29:54.267148	35	85
1199	dddddddd	2023-06-21 19:15:20.933874	2023-06-21 19:15:20.933874	35	84
1207	asdfghjkl;wertyuiopuytrdfghl,;.'kdr'\\][pofdwsasdfghjkl;'	2023-06-21 19:21:39.207069	2023-06-21 19:21:39.207069	35	85
1200	aaaaa	2023-06-21 19:15:24.150814	2023-06-21 19:15:24.150814	29	84
1208	ASDFGHJKL;'	2023-06-21 19:21:42.079491	2023-06-21 19:21:42.079491	35	85
1219	ftfse f sef sf\n\n	2023-06-21 19:41:36.623758	2023-06-21 19:41:36.623758	35	85
1209	asdfghjkl;'	2023-06-21 19:21:43.905235	2023-06-21 19:21:43.905235	35	85
1214	2	2023-06-21 19:29:55.119762	2023-06-21 19:29:55.119762	35	85
1210	asdfghjkl; gfgf dfg fd fg fdgf dfg fg f f fg fdg fgf fg dgfdfd f fdg f gfdg fg fg fdfdg gf g fgfgdfg fdg fg fdg fg fdg g dfg gfdg	2023-06-21 19:21:55.012584	2023-06-21 19:21:55.012584	35	85
1223	dddddsdsds\n\n\n\n\n\n\n\n\n\n\n\n\n\n	2023-06-21 19:47:56.280141	2023-06-21 19:47:56.280141	35	85
1215	24	2023-06-21 19:29:55.52928	2023-06-21 19:29:55.52928	35	85
1220	ththt h fh fth fth	2023-06-21 19:42:32.882946	2023-06-21 19:42:32.882946	35	85
1216	fffff	2023-06-21 19:30:40.739374	2023-06-21 19:30:40.739374	35	85
1309	2	2023-06-22 00:15:31.704338	2023-06-22 00:15:31.704338	35	68
1217	aaaaaaaaaaaaaasdfghjkghkckygv ouy luv lh 	2023-06-21 19:31:11.799272	2023-06-21 19:31:11.799272	35	85
1218	fgb f b  dfb dfb fbdf bfdb fdbf dbdf bdbfdb fdbdfbdf bdfb dfbd fbdf bfd bdfb dbfd bfdb f bdfb dfb fb dfb dfbd	2023-06-21 19:33:19.250048	2023-06-21 19:33:19.250048	35	85
1221	d fsd sfsdfsd sdfs fs f sdf sdfsffsd f\n	2023-06-21 19:42:40.390589	2023-06-21 19:42:40.390589	35	85
1225	ffdfdfddfdfdfgfdgfgdgdgdfggfdgfgdfgfdgdfgdfgdfgfdgfdgggfgdfgdfg gd dgf dgf fdgdggfdg gdfg fg fdg fdg dfgdfgfd g dgf dfgfdgggg fg dfg ffd dgd g df ggd dgdf	2023-06-21 20:34:01.555043	2023-06-21 20:34:01.555043	35	85
1222	sssssss\n	2023-06-21 19:44:54.541611	2023-06-21 19:44:54.541611	35	85
1224	dfgdg	2023-06-21 19:47:58.678383	2023-06-21 19:47:58.678383	35	85
1226	g sfsdfd ds fsd sdfd	2023-06-21 20:38:57.291305	2023-06-21 20:38:57.291305	35	85
1227	ffffff f f f f f	2023-06-21 20:39:00.085156	2023-06-21 20:39:00.085156	35	85
1228	dgsd fsd sd fsdf ds sdf  dsf sdf f sdf ssd fsf	2023-06-21 20:39:12.013939	2023-06-21 20:39:12.013939	35	85
1229	df fsdfsdf ds fsd fdsf sd fsd fs fs fsd fds fs f sd f f sf sfsfsd fdfsd fsdfsd fsd fdsfdsf dssf	2023-06-21 20:39:36.795302	2023-06-21 20:39:36.795302	35	85
1230	abc dg df gfd g dfg gdf g df ggfg	2023-06-21 20:40:15.43963	2023-06-21 20:40:15.43963	35	85
1231	gfggggggggggg	2023-06-21 20:47:03.346156	2023-06-21 20:47:03.346156	35	85
1232	ddddddd	2023-06-21 21:00:29.374258	2023-06-21 21:00:29.374258	35	85
1233	sdfsdfdsfsdfdsfsdf  sdf fsdf sfd fsfd	2023-06-21 22:41:11.20185	2023-06-21 22:41:11.20185	35	84
1707	1	2023-06-22 01:45:31.820159	2023-06-22 01:45:31.820159	35	90
1234	ertyuiytetui	2023-06-21 22:46:04.797728	2023-06-21 22:46:04.797728	35	84
1262	12	2023-06-22 00:12:44.477834	2023-06-22 00:12:44.477834	35	68
1235	fgd fddfg gfd fdgffd ddfgfgfgfdg fdgfdgdf g fdgfg fd gfd gfd gdfgfdgdf gdf gfgdf gdf gfd g dfg gf dg	2023-06-21 22:52:49.812256	2023-06-21 22:52:49.812256	35	84
1236	fsd sdf sdfsd fsdf sd sd sdfds sd dsfsdffdsfdsfdfdsfsfsdfddsfsdf sdf dsfsdfsdf sdf sdf sdf sd fsd fds fds fsd fsd f sdf sd f	2023-06-21 22:53:09.453982	2023-06-21 22:53:09.453982	35	84
1237	dfdsfd sdff	2023-06-21 22:53:22.906282	2023-06-21 22:53:22.906282	35	84
1263	fdgdfg	2023-06-22 00:13:48.218568	2023-06-22 00:13:48.218568	35	68
1238	rewrer w wer ewr ewr ewr ewre ewr ere wrwe werweewrewrewrwe rewrew ewr erewr	2023-06-21 22:53:36.119095	2023-06-21 22:53:36.119095	35	84
1239	sdsad sad	2023-06-21 22:56:53.956093	2023-06-21 22:56:53.956093	35	84
1311	4	2023-06-22 00:15:32.020491	2023-06-22 00:15:32.020491	35	68
1240	sadsadad	2023-06-21 23:00:39.04749	2023-06-21 23:00:39.04749	35	68
1264	dfsdffdf	2023-06-22 00:15:06.482968	2023-06-22 00:15:06.482968	35	68
1241	sadaasd	2023-06-21 23:01:09.236932	2023-06-21 23:01:09.236932	35	85
1242	ddddddd	2023-06-21 23:01:11.73757	2023-06-21 23:01:11.73757	35	85
1285	4	2023-06-22 00:15:16.099186	2023-06-22 00:15:16.099186	35	68
1243	xzXZxZX	2023-06-21 23:03:38.017587	2023-06-21 23:03:38.017587	35	84
1265	fffff	2023-06-22 00:15:07.520051	2023-06-22 00:15:07.520051	35	68
1244	sdfdfdsf	2023-06-21 23:06:44.90015	2023-06-21 23:06:44.90015	35	84
1245	fsdf sdf sdfd fsd sdf df	2023-06-21 23:08:44.55711	2023-06-21 23:08:44.55711	35	84
1246	sdasdadassdsadsadadsas d sadsadsaasd	2023-06-21 23:15:04.993772	2023-06-21 23:15:04.993772	35	68
1266	f	2023-06-22 00:15:07.707728	2023-06-22 00:15:07.707728	35	68
1247	fffffff	2023-06-21 23:18:37.718779	2023-06-21 23:18:37.718779	32	88
1248	dddddd	2023-06-21 23:18:44.317775	2023-06-21 23:18:44.317775	35	88
1298	89	2023-06-22 00:15:22.812706	2023-06-22 00:15:22.812706	35	68
1249	dfsddf	2023-06-21 23:19:43.56531	2023-06-21 23:19:43.56531	35	68
1267	f	2023-06-22 00:15:07.854718	2023-06-22 00:15:07.854718	35	68
1250	fsdd s dsfd fs sdfsdf sd df sdf sf fsdfs sdf	2023-06-21 23:46:18.823288	2023-06-21 23:46:18.823288	35	68
1251	asdfghjklpoiuytresaZxcvghjklnjhbgrtceszdfcvyui;nkvljda dsf sdf sdf ds sdf dsf dsfd sf s sdf sdf sdf sdf ds fsdf sd fds fsd fds fds fsd fsd fsd fds fds f 	2023-06-21 23:46:26.899668	2023-06-21 23:46:26.899668	35	68
1286	5	2023-06-22 00:15:16.231375	2023-06-22 00:15:16.231375	35	68
1252	dfsd sd fsd f	2023-06-22 00:12:24.448378	2023-06-22 00:12:24.448378	35	68
1268	fffff	2023-06-22 00:15:09.603804	2023-06-22 00:15:09.603804	35	68
1253	1	2023-06-22 00:12:26.111214	2023-06-22 00:12:26.111214	35	68
1254	2	2023-06-22 00:12:27.580034	2023-06-22 00:12:27.580034	35	68
1255	4	2023-06-22 00:12:28.342758	2023-06-22 00:12:28.342758	35	68
1269	1	2023-06-22 00:15:09.84045	2023-06-22 00:15:09.84045	35	68
1256	45	2023-06-22 00:12:28.78207	2023-06-22 00:12:28.78207	35	68
1257	6	2023-06-22 00:12:29.148128	2023-06-22 00:12:29.148128	35	68
1258	8	2023-06-22 00:12:29.553364	2023-06-22 00:12:29.553364	35	68
1270	2	2023-06-22 00:15:10.065827	2023-06-22 00:15:10.065827	35	68
1259	9	2023-06-22 00:12:32.29906	2023-06-22 00:12:32.29906	35	68
1260	10	2023-06-22 00:12:33.254027	2023-06-22 00:12:33.254027	35	68
1287	6	2023-06-22 00:15:16.463228	2023-06-22 00:15:16.463228	35	68
1261	11	2023-06-22 00:12:43.384708	2023-06-22 00:12:43.384708	35	68
1271	3	2023-06-22 00:15:10.258576	2023-06-22 00:15:10.258576	35	68
1306	8	2023-06-22 00:15:26.214483	2023-06-22 00:15:26.214483	35	68
1272	1	2023-06-22 00:15:12.009427	2023-06-22 00:15:12.009427	35	68
1288	7	2023-06-22 00:15:16.698536	2023-06-22 00:15:16.698536	35	68
1273	2	2023-06-22 00:15:12.227912	2023-06-22 00:15:12.227912	35	68
1274	3	2023-06-22 00:15:12.426547	2023-06-22 00:15:12.426547	35	68
1299	1	2023-06-22 00:15:24.923057	2023-06-22 00:15:24.923057	35	68
1275	4	2023-06-22 00:15:12.640124	2023-06-22 00:15:12.640124	35	68
1289	8	2023-06-22 00:15:16.934877	2023-06-22 00:15:16.934877	35	68
1276	5	2023-06-22 00:15:12.855971	2023-06-22 00:15:12.855971	35	68
1277	6	2023-06-22 00:15:13.063541	2023-06-22 00:15:13.063541	35	68
1278	7	2023-06-22 00:15:13.27404	2023-06-22 00:15:13.27404	35	68
1290	9	2023-06-22 00:15:17.166495	2023-06-22 00:15:17.166495	35	68
1279	8	2023-06-22 00:15:13.477556	2023-06-22 00:15:13.477556	35	68
1280	9	2023-06-22 00:15:13.684745	2023-06-22 00:15:13.684745	35	68
1281	10	2023-06-22 00:15:14.623406	2023-06-22 00:15:14.623406	35	68
1291	1	2023-06-22 00:15:21.366581	2023-06-22 00:15:21.366581	35	68
1282	1	2023-06-22 00:15:15.36269	2023-06-22 00:15:15.36269	35	68
1283	2	2023-06-22 00:15:15.581888	2023-06-22 00:15:15.581888	35	68
1300	2	2023-06-22 00:15:25.177642	2023-06-22 00:15:25.177642	35	68
1284	3	2023-06-22 00:15:15.812162	2023-06-22 00:15:15.812162	35	68
1293	3	2023-06-22 00:15:21.829925	2023-06-22 00:15:21.829925	35	68
1301	3	2023-06-22 00:15:25.311631	2023-06-22 00:15:25.311631	35	68
1294	4	2023-06-22 00:15:22.010481	2023-06-22 00:15:22.010481	35	68
2089	1	2023-06-22 02:11:07.629809	2023-06-22 02:11:07.629809	35	85
1295	5	2023-06-22 00:15:22.15671	2023-06-22 00:15:22.15671	35	68
1307	9	2023-06-22 00:15:29.816515	2023-06-22 00:15:29.816515	35	68
1296	6	2023-06-22 00:15:22.408856	2023-06-22 00:15:22.408856	35	68
1297	7	2023-06-22 00:15:22.541029	2023-06-22 00:15:22.541029	35	68
1303	5	2023-06-22 00:15:25.731732	2023-06-22 00:15:25.731732	35	68
2091	1	2023-06-22 02:11:09.270869	2023-06-22 02:11:09.270869	35	85
1308	1	2023-06-22 00:15:31.491276	2023-06-22 00:15:31.491276	35	68
1304	6	2023-06-22 00:15:25.918846	2023-06-22 00:15:25.918846	35	68
1305	7	2023-06-22 00:15:26.062146	2023-06-22 00:15:26.062146	35	68
1312	5	2023-06-22 00:15:32.218025	2023-06-22 00:15:32.218025	35	68
1310	3	2023-06-22 00:15:31.854281	2023-06-22 00:15:31.854281	35	68
1315	89	2023-06-22 00:15:32.856945	2023-06-22 00:15:32.856945	35	68
1313	6	2023-06-22 00:15:32.377404	2023-06-22 00:15:32.377404	35	68
1314	7	2023-06-22 00:15:32.711463	2023-06-22 00:15:32.711463	35	68
1316	0	2023-06-22 00:15:33.046704	2023-06-22 00:15:33.046704	35	68
1317	1	2023-06-22 00:15:33.22462	2023-06-22 00:15:33.22462	35	68
1318	2	2023-06-22 00:15:33.400318	2023-06-22 00:15:33.400318	35	68
1709	1	2023-06-22 01:45:31.777	2023-06-22 01:45:31.777	\N	\N
1319	3	2023-06-22 00:15:33.582726	2023-06-22 00:15:33.582726	35	68
1321	5	2023-06-22 00:15:34.06159	2023-06-22 00:15:34.06159	35	68
1323	7	2023-06-22 00:15:34.377802	2023-06-22 00:15:34.377802	35	68
2093	11	2023-06-22 02:11:11.140848	2023-06-22 02:11:11.140848	35	85
1324	8	2023-06-22 00:15:34.603275	2023-06-22 00:15:34.603275	35	68
1325	9	2023-06-22 00:15:34.797523	2023-06-22 00:15:34.797523	35	68
1326	0	2023-06-22 00:15:34.994199	2023-06-22 00:15:34.994199	35	68
1327	1	2023-06-22 00:15:35.183	2023-06-22 00:15:35.183	35	68
1329	3	2023-06-22 00:15:35.531823	2023-06-22 00:15:35.531823	35	68
1711	1	2023-06-22 01:45:31.812	2023-06-22 01:45:31.812	35	\N
1720	1	2023-06-22 01:45:37.618	2023-06-22 01:45:37.618	35	90
1722	1	2023-06-22 01:45:38.661	2023-06-22 01:45:38.661	35	90
1724	1	2023-06-22 01:45:39.482	2023-06-22 01:45:39.482	35	90
1726	1	2023-06-22 01:45:40.264	2023-06-22 01:45:40.264	35	90
1331	5	2023-06-22 00:15:35.867116	2023-06-22 00:15:35.867116	35	68
1728	1	2023-06-22 01:45:41.063	2023-06-22 01:45:41.063	35	90
1730	1	2023-06-22 01:45:41.896	2023-06-22 01:45:41.896	35	90
1732	1	2023-06-22 01:45:42.657	2023-06-22 01:45:42.657	35	90
1332	6	2023-06-22 00:15:36.036978	2023-06-22 00:15:36.036978	35	68
2090	1	2023-06-22 02:11:07.629	2023-06-22 02:11:07.629	35	85
2092	1	2023-06-22 02:11:09.27	2023-06-22 02:11:09.27	35	85
2094	11	2023-06-22 02:11:11.14	2023-06-22 02:11:11.14	35	85
2096	1	2023-06-22 02:11:12.861	2023-06-22 02:11:12.861	35	85
2233	8	2023-06-22 02:23:57.736653	2023-06-22 02:23:57.736653	35	\N
2232	4	2023-06-22 02:23:48.581	2023-06-22 02:23:48.581	35	\N
2306	8	2023-06-22 02:29:30.977965	2023-06-22 02:29:30.977965	35	85
1337	1	2023-06-22 00:15:36.972715	2023-06-22 00:15:36.972715	35	68
2300	3	2023-06-22 02:29:21.111818	2023-06-22 02:29:21.111818	\N	85
1338	1	2023-06-22 00:15:39.667061	2023-06-22 00:15:39.667061	35	68
1339	2	2023-06-22 00:15:39.84134	2023-06-22 00:15:39.84134	35	68
1340	3	2023-06-22 00:15:40.045488	2023-06-22 00:15:40.045488	35	68
1341	4	2023-06-22 00:15:40.256913	2023-06-22 00:15:40.256913	35	68
2339	3	2023-06-22 02:37:55.94487	2023-06-22 02:37:55.94487	35	\N
1346	3	2023-06-22 00:15:44.004359	2023-06-22 00:15:44.004359	35	68
2384	8	2023-06-22 02:58:33.798364	2023-06-22 02:58:33.798364	35	\N
1347	4	2023-06-22 00:15:44.249693	2023-06-22 00:15:44.249693	35	68
2377	3	2023-06-22 02:58:23.307261	2023-06-22 02:58:23.307261	\N	90
1348	56+	2023-06-22 00:15:44.467322	2023-06-22 00:15:44.467322	35	68
2410	7	2023-06-22 03:16:03.033934	2023-06-22 03:16:03.033934	35	89
2416	5	2023-06-22 03:19:04.346803	2023-06-22 03:19:04.346803	35	89
2421	2	2023-06-22 03:19:29.069287	2023-06-22 03:19:29.069287	\N	\N
2476	1	2023-06-22 03:40:26.873617	2023-06-22 03:40:26.873617	35	91
2481	7	2023-06-22 03:40:35.715797	2023-06-22 03:40:35.715797	\N	91
2697	fghf	2023-06-22 03:50:53.039698	2023-06-22 03:50:53.039698	35	90
2698	g g 	2023-06-22 03:50:55.597142	2023-06-22 03:50:55.597142	35	90
2700	 gh	2023-06-22 03:51:00.492066	2023-06-22 03:51:00.492066	35	90
1374	3	2023-06-22 00:25:58.887523	2023-06-22 00:25:58.887523	35	89
1440	0	2023-06-22 01:14:19.401	2023-06-22 01:14:19.401	35	89
1343	6	2023-06-22 00:15:40.691164	2023-06-22 00:15:40.691164	35	68
1441	0	2023-06-22 01:14:19.667333	2023-06-22 01:14:19.667333	35	89
1344	1	2023-06-22 00:15:43.492147	2023-06-22 00:15:43.492147	35	68
1375	4	2023-06-22 00:25:59.129687	2023-06-22 00:25:59.129687	35	89
1345	2	2023-06-22 00:15:43.865881	2023-06-22 00:15:43.865881	35	68
1349	1	2023-06-22 00:16:01.881461	2023-06-22 00:16:01.881461	35	68
1442	0	2023-06-22 01:14:19.667	2023-06-22 01:14:19.667	35	89
1376	5	2023-06-22 00:25:59.336443	2023-06-22 00:25:59.336443	35	89
1443	0	2023-06-22 01:14:19.872424	2023-06-22 01:14:19.872424	35	89
1377	6	2023-06-22 00:25:59.543223	2023-06-22 00:25:59.543223	35	89
1410	11	2023-06-22 00:49:24.468938	2023-06-22 00:49:24.468938	35	89
1378	7	2023-06-22 00:25:59.774019	2023-06-22 00:25:59.774019	35	89
1444	0	2023-06-22 01:14:19.872	2023-06-22 01:14:19.872	35	89
1379	8	2023-06-22 00:25:59.989924	2023-06-22 00:25:59.989924	35	89
1351	3	2023-06-22 00:16:02.450369	2023-06-22 00:16:02.450369	35	68
1353	5	2023-06-22 00:16:02.809226	2023-06-22 00:16:02.809226	35	68
1411	1	2023-06-22 01:13:51.769763	2023-06-22 01:13:51.769763	35	89
1412	1	2023-06-22 01:13:51.769	2023-06-22 01:13:51.769	35	89
1354	6	2023-06-22 00:16:03.083681	2023-06-22 00:16:03.083681	35	68
1413	2	2023-06-22 01:13:52.914126	2023-06-22 01:13:52.914126	35	89
1355	7	2023-06-22 00:16:03.433716	2023-06-22 00:16:03.433716	35	68
1380	9	2023-06-22 00:26:00.20757	2023-06-22 00:26:00.20757	35	89
1356	1	2023-06-22 00:16:22.113823	2023-06-22 00:16:22.113823	35	68
1357	2	2023-06-22 00:16:22.300366	2023-06-22 00:16:22.300366	35	68
1414	2	2023-06-22 01:13:52.914	2023-06-22 01:13:52.914	35	89
1358	3	2023-06-22 00:16:22.541915	2023-06-22 00:16:22.541915	35	68
1381	mouahahaha	2023-06-22 00:40:47.408359	2023-06-22 00:40:47.408359	35	89
1359	4	2023-06-22 00:16:22.850185	2023-06-22 00:16:22.850185	35	68
1415	4	2023-06-22 01:13:53.907331	2023-06-22 01:13:53.907331	35	89
1382	ok	2023-06-22 00:40:50.097683	2023-06-22 00:40:50.097683	35	89
1361	6	2023-06-22 00:16:23.293215	2023-06-22 00:16:23.293215	35	68
1416	4	2023-06-22 01:13:53.907	2023-06-22 01:13:53.907	35	89
1417	4444444	2023-06-22 01:13:55.690279	2023-06-22 01:13:55.690279	35	89
1362	7	2023-06-22 00:16:23.553987	2023-06-22 00:16:23.553987	35	68
1383	d	2023-06-22 00:40:50.703752	2023-06-22 00:40:50.703752	35	89
1418	4444444	2023-06-22 01:13:55.69	2023-06-22 01:13:55.69	35	89
1384	d	2023-06-22 00:40:50.91108	2023-06-22 00:40:50.91108	35	89
1419	10	2023-06-22 01:14:02.954553	2023-06-22 01:14:02.954553	35	89
1385	d	2023-06-22 00:40:51.144363	2023-06-22 00:40:51.144363	35	89
1420	10	2023-06-22 01:14:02.954	2023-06-22 01:14:02.954	35	89
1386	d	2023-06-22 00:40:51.407894	2023-06-22 00:40:51.407894	35	89
1364	9	2023-06-22 00:16:24.011313	2023-06-22 00:16:24.011313	35	68
1366	0	2023-06-22 00:16:24.412086	2023-06-22 00:16:24.412086	35	68
1421	5	2023-06-22 01:14:04.729702	2023-06-22 01:14:04.729702	35	89
1422	5	2023-06-22 01:14:04.729	2023-06-22 01:14:04.729	35	89
1423	123	2023-06-22 01:14:10.005594	2023-06-22 01:14:10.005594	35	89
1367	1	2023-06-22 00:16:24.639937	2023-06-22 00:16:24.639937	35	68
1387	d	2023-06-22 00:40:51.656522	2023-06-22 00:40:51.656522	35	89
1368	2	2023-06-22 00:16:24.908305	2023-06-22 00:16:24.908305	35	68
1369	\n\n\n\nok\n\n\n\n	2023-06-22 00:17:00.56487	2023-06-22 00:17:00.56487	35	68
1424	123	2023-06-22 01:14:10.005	2023-06-22 01:14:10.005	35	89
2707	4	2023-06-22 03:55:04.491255	2023-06-22 03:55:04.491255	\N	91
1370	Invitation link http://localhost:3006/chat/channel/invitation/89/ddddd	2023-06-22 00:17:22.031677	2023-06-22 00:17:22.031677	0	89
1388	d	2023-06-22 00:40:51.87519	2023-06-22 00:40:51.87519	35	89
1371	sdfsdsddsf	2023-06-22 00:17:25.986733	2023-06-22 00:17:25.986733	35	89
1372	1	2023-06-22 00:25:58.471265	2023-06-22 00:25:58.471265	35	89
1425	5	2023-06-22 01:14:10.754934	2023-06-22 01:14:10.754934	35	89
1373	2	2023-06-22 00:25:58.672511	2023-06-22 00:25:58.672511	35	89
1426	5	2023-06-22 01:14:10.754	2023-06-22 01:14:10.754	35	89
1389	d	2023-06-22 00:40:52.099344	2023-06-22 00:40:52.099344	35	89
1427	4	2023-06-22 01:14:11.242565	2023-06-22 01:14:11.242565	35	89
1390	d	2023-06-22 00:40:52.306657	2023-06-22 00:40:52.306657	35	89
1391	v	2023-06-22 00:48:38.146916	2023-06-22 00:48:38.146916	35	89
1392	fds	2023-06-22 00:49:00.579385	2023-06-22 00:49:00.579385	35	89
1393	f	2023-06-22 00:49:02.25304	2023-06-22 00:49:02.25304	35	89
1394	d	2023-06-22 00:49:03.180712	2023-06-22 00:49:03.180712	35	89
1395	s	2023-06-22 00:49:03.903102	2023-06-22 00:49:03.903102	35	89
1396	1g	2023-06-22 00:49:20.490093	2023-06-22 00:49:20.490093	35	89
1397	1	2023-06-22 00:49:21.794863	2023-06-22 00:49:21.794863	35	89
1398	1	2023-06-22 00:49:22.010089	2023-06-22 00:49:22.010089	35	89
1399	1	2023-06-22 00:49:22.185775	2023-06-22 00:49:22.185775	35	89
1400	1	2023-06-22 00:49:22.465132	2023-06-22 00:49:22.465132	35	89
1401	1	2023-06-22 00:49:22.662291	2023-06-22 00:49:22.662291	35	89
1402	1	2023-06-22 00:49:22.836325	2023-06-22 00:49:22.836325	35	89
1403	1	2023-06-22 00:49:23.009432	2023-06-22 00:49:23.009432	35	89
1404	1	2023-06-22 00:49:23.186682	2023-06-22 00:49:23.186682	35	89
1405	1	2023-06-22 00:49:23.528066	2023-06-22 00:49:23.528066	35	89
1428	4	2023-06-22 01:14:11.242	2023-06-22 01:14:11.242	35	89
1445	0	2023-06-22 01:14:20.1376	2023-06-22 01:14:20.1376	35	89
1429	1	2023-06-22 01:14:11.665053	2023-06-22 01:14:11.665053	35	89
1430	1	2023-06-22 01:14:11.665	2023-06-22 01:14:11.665	35	89
1431	2	2023-06-22 01:14:13.266588	2023-06-22 01:14:13.266588	35	89
1432	2	2023-06-22 01:14:13.266	2023-06-22 01:14:13.266	35	89
1433	0	2023-06-22 01:14:18.630273	2023-06-22 01:14:18.630273	35	89
1434	0	2023-06-22 01:14:18.63	2023-06-22 01:14:18.63	35	89
1435	0	2023-06-22 01:14:18.89758	2023-06-22 01:14:18.89758	35	89
1436	0	2023-06-22 01:14:18.897	2023-06-22 01:14:18.897	35	89
1437	0	2023-06-22 01:14:19.149614	2023-06-22 01:14:19.149614	35	89
1438	0	2023-06-22 01:14:19.149	2023-06-22 01:14:19.149	35	89
1439	0	2023-06-22 01:14:19.401823	2023-06-22 01:14:19.401823	35	89
1446	0	2023-06-22 01:14:20.137	2023-06-22 01:14:20.137	35	89
1447	0	2023-06-22 01:14:20.324186	2023-06-22 01:14:20.324186	35	89
1448	0	2023-06-22 01:14:20.324	2023-06-22 01:14:20.324	35	89
1449	0	2023-06-22 01:14:20.52652	2023-06-22 01:14:20.52652	35	89
1450	0	2023-06-22 01:14:20.526	2023-06-22 01:14:20.526	35	89
1451	0	2023-06-22 01:14:20.746162	2023-06-22 01:14:20.746162	35	89
1452	0	2023-06-22 01:14:20.746	2023-06-22 01:14:20.746	35	89
1453	0	2023-06-22 01:14:21.023829	2023-06-22 01:14:21.023829	35	89
1454	0	2023-06-22 01:14:21.023	2023-06-22 01:14:21.023	35	89
1455	0	2023-06-22 01:14:21.220302	2023-06-22 01:14:21.220302	35	89
1456	0	2023-06-22 01:14:21.22	2023-06-22 01:14:21.22	35	89
1457	0	2023-06-22 01:14:21.5055	2023-06-22 01:14:21.5055	35	89
1458	0	2023-06-22 01:14:21.505	2023-06-22 01:14:21.505	35	89
1713	1	2023-06-22 01:45:31.82	2023-06-22 01:45:31.82	35	90
1464	0	2023-06-22 01:14:22.184	2023-06-22 01:14:22.184	35	89
1715	1	2023-06-22 01:45:33.985901	2023-06-22 01:45:33.985901	35	90
1467	0	2023-06-22 01:14:22.602133	2023-06-22 01:14:22.602133	35	89
1469	0	2023-06-22 01:14:22.907846	2023-06-22 01:14:22.907846	35	89
1472	0	2023-06-22 01:14:23.141	2023-06-22 01:14:23.141	35	89
1475	0	2023-06-22 01:14:23.605729	2023-06-22 01:14:23.605729	35	89
1478	0	2023-06-22 01:14:23.834	2023-06-22 01:14:23.834	35	89
1481	0	2023-06-22 01:14:24.297223	2023-06-22 01:14:24.297223	35	89
1484	0	2023-06-22 01:14:24.522	2023-06-22 01:14:24.522	35	89
1487	0	2023-06-22 01:14:24.980752	2023-06-22 01:14:24.980752	35	89
1718	1	2023-06-22 01:45:34.429	2023-06-22 01:45:34.429	35	90
2095	1	2023-06-22 02:11:12.861036	2023-06-22 02:11:12.861036	35	85
2237	1111111111111111111111111111111111111111111111111111111	2023-06-22 02:24:22.2392	2023-06-22 02:24:22.2392	35	85
2378	2	2023-06-22 02:58:23.332336	2023-06-22 02:58:23.332336	\N	90
2301	4	2023-06-22 02:29:22.763124	2023-06-22 02:29:22.763124	\N	\N
2340	7	2023-06-22 02:37:59.073818	2023-06-22 02:37:59.073818	\N	\N
2412	9	2023-06-22 03:16:05.441017	2023-06-22 03:16:05.441017	35	89
2417	6	2023-06-22 03:19:04.383264	2023-06-22 03:19:04.383264	35	89
2478	3	2023-06-22 03:40:29.862097	2023-06-22 03:40:29.862097	35	91
2699	hfg	2023-06-22 03:50:58.061117	2023-06-22 03:50:58.061117	35	90
2701	coucou	2023-06-22 03:51:11.785478	2023-06-22 03:51:11.785478	35	91
1459	0	2023-06-22 01:14:21.721536	2023-06-22 01:14:21.721536	35	89
1462	0	2023-06-22 01:14:21.934	2023-06-22 01:14:21.934	35	89
1465	0	2023-06-22 01:14:22.395376	2023-06-22 01:14:22.395376	35	89
1468	0	2023-06-22 01:14:22.602	2023-06-22 01:14:22.602	35	89
1470	0	2023-06-22 01:14:22.907	2023-06-22 01:14:22.907	35	89
1719	1	2023-06-22 01:45:37.61848	2023-06-22 01:45:37.61848	35	90
1476	0	2023-06-22 01:14:23.605	2023-06-22 01:14:23.605	35	89
1721	1	2023-06-22 01:45:38.661771	2023-06-22 01:45:38.661771	35	90
1479	0	2023-06-22 01:14:24.068496	2023-06-22 01:14:24.068496	35	89
1482	0	2023-06-22 01:14:24.297	2023-06-22 01:14:24.297	35	89
1485	0	2023-06-22 01:14:24.747953	2023-06-22 01:14:24.747953	35	89
1723	1	2023-06-22 01:45:39.482816	2023-06-22 01:45:39.482816	35	90
1725	1	2023-06-22 01:45:40.264952	2023-06-22 01:45:40.264952	35	90
1727	1	2023-06-22 01:45:41.06345	2023-06-22 01:45:41.06345	35	90
1729	1	2023-06-22 01:45:41.896244	2023-06-22 01:45:41.896244	35	90
1731	1	2023-06-22 01:45:42.65785	2023-06-22 01:45:42.65785	35	90
2097	5	2023-06-22 02:11:44.297218	2023-06-22 02:11:44.297218	35	85
2099	5	2023-06-22 02:11:46.060794	2023-06-22 02:11:46.060794	35	85
2101	5	2023-06-22 02:11:47.885502	2023-06-22 02:11:47.885502	35	85
2103	55	2023-06-22 02:11:49.536143	2023-06-22 02:11:49.536143	35	85
2105	5	2023-06-22 02:11:51.114788	2023-06-22 02:11:51.114788	35	85
2238	1111111111111111111111111111111111111111111111111111111	2023-06-22 02:24:22.239	2023-06-22 02:24:22.239	35	85
2303	2	2023-06-22 02:29:22.857734	2023-06-22 02:29:22.857734	\N	\N
2379	4	2023-06-22 02:58:23.342158	2023-06-22 02:58:23.342158	\N	\N
2383	9	2023-06-22 02:58:32.182793	2023-06-22 02:58:32.182793	\N	\N
2418	4	2023-06-22 03:19:05.018139	2023-06-22 03:19:05.018139	35	89
2420	1	2023-06-22 03:19:27.024401	2023-06-22 03:19:27.024401	35	90
2479	5	2023-06-22 03:40:32.020815	2023-06-22 03:40:32.020815	\N	\N
2702	sdcscccsdsc	2023-06-22 03:54:57.640604	2023-06-22 03:54:57.640604	35	91
2703	dsc  sccsd cd scsc	2023-06-22 03:55:00.968349	2023-06-22 03:55:00.968349	29	91
2704	1	2023-06-22 03:55:03.584911	2023-06-22 03:55:03.584911	29	91
2705	2	2023-06-22 03:55:03.880176	2023-06-22 03:55:03.880176	29	91
2706	3	2023-06-22 03:55:04.1873	2023-06-22 03:55:04.1873	29	91
2709	6	2023-06-22 03:55:04.991035	2023-06-22 03:55:04.991035	29	91
2712	99	2023-06-22 03:55:05.752951	2023-06-22 03:55:05.752951	29	91
2713	1	2023-06-22 03:55:07.964698	2023-06-22 03:55:07.964698	35	91
2714	2	2023-06-22 03:55:10.751602	2023-06-22 03:55:10.751602	35	91
2716	4	2023-06-22 03:55:16.463038	2023-06-22 03:55:16.463038	\N	91
2721	8	2023-06-22 03:55:27.703932	2023-06-22 03:55:27.703932	\N	\N
1460	0	2023-06-22 01:14:21.721	2023-06-22 01:14:21.721	35	89
1463	0	2023-06-22 01:14:22.184278	2023-06-22 01:14:22.184278	35	89
1466	0	2023-06-22 01:14:22.395	2023-06-22 01:14:22.395	35	89
1471	0	2023-06-22 01:14:23.141931	2023-06-22 01:14:23.141931	35	89
1474	0	2023-06-22 01:14:23.351	2023-06-22 01:14:23.351	35	89
1477	0	2023-06-22 01:14:23.834094	2023-06-22 01:14:23.834094	35	89
1480	0	2023-06-22 01:14:24.068	2023-06-22 01:14:24.068	35	89
1483	0	2023-06-22 01:14:24.522284	2023-06-22 01:14:24.522284	35	89
1486	0	2023-06-22 01:14:24.747	2023-06-22 01:14:24.747	35	89
1733	ggggg	2023-06-22 01:57:37.128947	2023-06-22 01:57:37.128947	29	85
1735	fffff	2023-06-22 01:57:39.264336	2023-06-22 01:57:39.264336	35	85
1737	f	2023-06-22 01:57:41.979094	2023-06-22 01:57:41.979094	35	85
1739	f	2023-06-22 01:57:42.540918	2023-06-22 01:57:42.540918	35	85
1741	f	2023-06-22 01:57:43.130765	2023-06-22 01:57:43.130765	35	85
1504	1	2023-06-22 01:18:57.272	2023-06-22 01:18:57.272	35	\N
1528	1	2023-06-22 01:19:00.39	2023-06-22 01:19:00.39	35	89
1743	f	2023-06-22 01:57:43.706541	2023-06-22 01:57:43.706541	35	85
1745	f	2023-06-22 01:57:44.297865	2023-06-22 01:57:44.297865	35	85
1747	f	2023-06-22 01:57:44.869371	2023-06-22 01:57:44.869371	35	85
1749	f	2023-06-22 01:57:45.500524	2023-06-22 01:57:45.500524	35	85
1495	0	2023-06-22 01:14:25.779542	2023-06-22 01:14:25.779542	35	89
1751	f	2023-06-22 01:57:46.115235	2023-06-22 01:57:46.115235	35	85
1508	1	2023-06-22 01:18:57.942544	2023-06-22 01:18:57.942544	35	\N
1753	f	2023-06-22 01:57:46.725738	2023-06-22 01:57:46.725738	35	85
1496	0	2023-06-22 01:14:25.779	2023-06-22 01:14:25.779	35	89
1755	f	2023-06-22 01:57:47.338043	2023-06-22 01:57:47.338043	35	85
1523	1	2023-06-22 01:18:59.853	2023-06-22 01:18:59.853	35	\N
1757	f	2023-06-22 01:57:47.988591	2023-06-22 01:57:47.988591	35	85
1759	f	2023-06-22 01:57:48.608025	2023-06-22 01:57:48.608025	35	85
1761	f	2023-06-22 01:57:49.269804	2023-06-22 01:57:49.269804	35	85
1546	1	2023-06-22 01:19:04.658	2023-06-22 01:19:04.658	35	89
1763	f	2023-06-22 01:57:49.933897	2023-06-22 01:57:49.933897	35	85
1765	f	2023-06-22 01:57:50.577014	2023-06-22 01:57:50.577014	35	85
1497	1	2023-06-22 01:18:56.472872	2023-06-22 01:18:56.472872	35	89
1498	1	2023-06-22 01:18:56.472	2023-06-22 01:18:56.472	35	89
1499	1	2023-06-22 01:18:56.746512	2023-06-22 01:18:56.746512	35	89
1500	1	2023-06-22 01:18:56.746	2023-06-22 01:18:56.746	35	89
1502	1	2023-06-22 01:18:57.015	2023-06-22 01:18:57.015	35	89
1767	f	2023-06-22 01:57:51.238519	2023-06-22 01:57:51.238519	35	85
1769	f	2023-06-22 01:57:51.909243	2023-06-22 01:57:51.909243	35	85
1771	f	2023-06-22 01:57:52.557254	2023-06-22 01:57:52.557254	35	85
1543	1	2023-06-22 01:19:02.475	2023-06-22 01:19:02.475	35	89
1773	f	2023-06-22 01:57:53.218193	2023-06-22 01:57:53.218193	35	85
1775	f	2023-06-22 01:57:53.87551	2023-06-22 01:57:53.87551	35	85
1777	f	2023-06-22 01:57:54.560763	2023-06-22 01:57:54.560763	35	85
1779	f	2023-06-22 01:57:55.220411	2023-06-22 01:57:55.220411	35	85
1506	1	2023-06-22 01:18:57.288	2023-06-22 01:18:57.288	\N	89
1781	f	2023-06-22 01:57:55.887267	2023-06-22 01:57:55.887267	35	85
1511	1	2023-06-22 01:18:57.942	2023-06-22 01:18:57.942	35	89
1501	1	2023-06-22 01:18:57.015864	2023-06-22 01:18:57.015864	\N	89
1783	f	2023-06-22 01:57:56.599459	2023-06-22 01:57:56.599459	35	85
1785	f	2023-06-22 01:57:57.295349	2023-06-22 01:57:57.295349	35	85
1787	f	2023-06-22 01:57:57.977506	2023-06-22 01:57:57.977506	35	85
1789	f	2023-06-22 01:57:58.65799	2023-06-22 01:57:58.65799	35	85
1564	1	2023-06-22 01:19:06.872	2023-06-22 01:19:06.872	\N	\N
1791	f	2023-06-22 01:57:59.416408	2023-06-22 01:57:59.416408	35	85
1513	1	2023-06-22 01:18:58.471388	2023-06-22 01:18:58.471388	35	89
1524	1	2023-06-22 01:18:59.874	2023-06-22 01:18:59.874	\N	\N
1793	f	2023-06-22 01:58:00.1166	2023-06-22 01:58:00.1166	35	85
1514	1	2023-06-22 01:18:58.719861	2023-06-22 01:18:58.719861	\N	89
1517	1	2023-06-22 01:18:58.719	2023-06-22 01:18:58.719	\N	89
1519	1	2023-06-22 01:18:59.48698	2023-06-22 01:18:59.48698	\N	89
1795	f	2023-06-22 01:58:00.814169	2023-06-22 01:58:00.814169	35	85
1518	1	2023-06-22 01:18:58.734	2023-06-22 01:18:58.734	35	89
1797	f	2023-06-22 01:58:01.514289	2023-06-22 01:58:01.514289	35	85
1799	f	2023-06-22 01:58:02.234607	2023-06-22 01:58:02.234607	35	85
1801	f	2023-06-22 01:58:03.019374	2023-06-22 01:58:03.019374	35	85
1516	1	2023-06-22 01:18:58.471	2023-06-22 01:18:58.471	\N	\N
1803	f	2023-06-22 01:58:03.774523	2023-06-22 01:58:03.774523	35	85
1805	f	2023-06-22 01:58:04.545604	2023-06-22 01:58:04.545604	35	85
1807	f	2023-06-22 01:58:05.320911	2023-06-22 01:58:05.320911	35	85
1509	1	2023-06-22 01:18:57.599	2023-06-22 01:18:57.599	35	89
1521	1	2023-06-22 01:18:59.853275	2023-06-22 01:18:59.853275	\N	\N
1505	1	2023-06-22 01:18:57.288077	2023-06-22 01:18:57.288077	\N	89
1520	1	2023-06-22 01:18:59.486	2023-06-22 01:18:59.486	35	89
1536	1	2023-06-22 01:19:01.033	2023-06-22 01:19:01.033	\N	\N
1545	1	2023-06-22 01:19:04.658978	2023-06-22 01:19:04.658978	35	89
1809	f	2023-06-22 01:58:06.119173	2023-06-22 01:58:06.119173	35	85
1540	1	2023-06-22 01:19:01.97	2023-06-22 01:19:01.97	35	\N
1522	1	2023-06-22 01:18:59.874211	2023-06-22 01:18:59.874211	35	89
1811	f	2023-06-22 01:58:06.973265	2023-06-22 01:58:06.973265	35	85
1813	f	2023-06-22 01:58:07.79598	2023-06-22 01:58:07.79598	35	85
1815	f	2023-06-22 01:58:08.663815	2023-06-22 01:58:08.663815	35	85
1817	f	2023-06-22 01:58:09.451413	2023-06-22 01:58:09.451413	35	85
1819	f	2023-06-22 01:58:10.227111	2023-06-22 01:58:10.227111	35	85
1569	1	2023-06-22 01:19:09.513412	2023-06-22 01:19:09.513412	35	89
1821	f	2023-06-22 01:58:11.055918	2023-06-22 01:58:11.055918	35	85
1823	f	2023-06-22 01:58:11.877842	2023-06-22 01:58:11.877842	35	85
1503	1	2023-06-22 01:18:57.27242	2023-06-22 01:18:57.27242	35	\N
1825	f	2023-06-22 01:58:12.690786	2023-06-22 01:58:12.690786	35	85
1515	1	2023-06-22 01:18:58.734693	2023-06-22 01:18:58.734693	35	\N
1827	f	2023-06-22 01:58:13.537929	2023-06-22 01:58:13.537929	35	85
1829	f	2023-06-22 01:58:14.546507	2023-06-22 01:58:14.546507	35	85
1831	f	2023-06-22 01:58:15.447516	2023-06-22 01:58:15.447516	35	85
1570	1	2023-06-22 01:19:09.516081	2023-06-22 01:19:09.516081	35	89
1531	1	2023-06-22 01:19:00.912	2023-06-22 01:19:00.912	35	\N
1833	f	2023-06-22 01:58:16.365348	2023-06-22 01:58:16.365348	35	85
1835	f	2023-06-22 01:58:17.220418	2023-06-22 01:58:17.220418	35	85
1837	f	2023-06-22 01:58:18.104264	2023-06-22 01:58:18.104264	35	85
1525	1	2023-06-22 01:19:00.155086	2023-06-22 01:19:00.155086	\N	89
1544	1	2023-06-22 01:19:02.478	2023-06-22 01:19:02.478	35	89
1563	1	2023-06-22 01:19:06.872242	2023-06-22 01:19:06.872242	\N	\N
1556	1	2023-06-22 01:19:05.861032	2023-06-22 01:19:05.861032	35	89
1571	1	2023-06-22 01:19:09.513	2023-06-22 01:19:09.513	\N	\N
1573	0	2023-06-22 01:19:24.700312	2023-06-22 01:19:24.700312	35	89
1575	0	2023-06-22 01:19:25.057109	2023-06-22 01:19:25.057109	35	89
1541	1	2023-06-22 01:19:02.47544	2023-06-22 01:19:02.47544	\N	89
1552	1	2023-06-22 01:19:05.204	2023-06-22 01:19:05.204	35	89
1547	1	2023-06-22 01:19:04.761894	2023-06-22 01:19:04.761894	\N	\N
1734	ggggg	2023-06-22 01:57:37.128	2023-06-22 01:57:37.128	29	85
1736	fffff	2023-06-22 01:57:39.264	2023-06-22 01:57:39.264	35	85
1738	f	2023-06-22 01:57:41.979	2023-06-22 01:57:41.979	35	85
1527	1	2023-06-22 01:19:00.155	2023-06-22 01:19:00.155	\N	89
1535	1	2023-06-22 01:19:01.032	2023-06-22 01:19:01.032	\N	89
1542	1	2023-06-22 01:19:02.478631	2023-06-22 01:19:02.478631	35	89
1551	1	2023-06-22 01:19:05.199	2023-06-22 01:19:05.199	35	89
1529	1	2023-06-22 01:19:00.91288	2023-06-22 01:19:00.91288	\N	89
1530	1	2023-06-22 01:19:00.930152	2023-06-22 01:19:00.930152	\N	89
1533	1	2023-06-22 01:19:01.033956	2023-06-22 01:19:01.033956	\N	\N
1526	1	2023-06-22 01:19:00.390957	2023-06-22 01:19:00.390957	\N	\N
1558	1	2023-06-22 01:19:05.861	2023-06-22 01:19:05.861	\N	89
1740	f	2023-06-22 01:57:42.54	2023-06-22 01:57:42.54	35	85
1742	f	2023-06-22 01:57:43.13	2023-06-22 01:57:43.13	35	85
1744	f	2023-06-22 01:57:43.706	2023-06-22 01:57:43.706	35	85
1746	f	2023-06-22 01:57:44.297	2023-06-22 01:57:44.297	35	85
1748	f	2023-06-22 01:57:44.869	2023-06-22 01:57:44.869	35	85
1750	f	2023-06-22 01:57:45.5	2023-06-22 01:57:45.5	35	85
1752	f	2023-06-22 01:57:46.115	2023-06-22 01:57:46.115	35	85
1754	f	2023-06-22 01:57:46.725	2023-06-22 01:57:46.725	35	85
1756	f	2023-06-22 01:57:47.338	2023-06-22 01:57:47.338	35	85
1758	f	2023-06-22 01:57:47.988	2023-06-22 01:57:47.988	35	85
1760	f	2023-06-22 01:57:48.608	2023-06-22 01:57:48.608	35	85
1762	f	2023-06-22 01:57:49.269	2023-06-22 01:57:49.269	35	85
1764	f	2023-06-22 01:57:49.933	2023-06-22 01:57:49.933	35	85
1766	f	2023-06-22 01:57:50.577	2023-06-22 01:57:50.577	35	85
1768	f	2023-06-22 01:57:51.238	2023-06-22 01:57:51.238	35	85
1770	f	2023-06-22 01:57:51.909	2023-06-22 01:57:51.909	35	85
1772	f	2023-06-22 01:57:52.557	2023-06-22 01:57:52.557	35	85
1774	f	2023-06-22 01:57:53.218	2023-06-22 01:57:53.218	35	85
1776	f	2023-06-22 01:57:53.875	2023-06-22 01:57:53.875	35	85
1778	f	2023-06-22 01:57:54.56	2023-06-22 01:57:54.56	35	85
1780	f	2023-06-22 01:57:55.22	2023-06-22 01:57:55.22	35	85
1782	f	2023-06-22 01:57:55.887	2023-06-22 01:57:55.887	35	85
1784	f	2023-06-22 01:57:56.599	2023-06-22 01:57:56.599	35	85
1786	f	2023-06-22 01:57:57.295	2023-06-22 01:57:57.295	35	85
1788	f	2023-06-22 01:57:57.977	2023-06-22 01:57:57.977	35	85
1790	f	2023-06-22 01:57:58.657	2023-06-22 01:57:58.657	35	85
1792	f	2023-06-22 01:57:59.416	2023-06-22 01:57:59.416	35	85
1794	f	2023-06-22 01:58:00.116	2023-06-22 01:58:00.116	35	85
1796	f	2023-06-22 01:58:00.814	2023-06-22 01:58:00.814	35	85
1798	f	2023-06-22 01:58:01.514	2023-06-22 01:58:01.514	35	85
1800	f	2023-06-22 01:58:02.234	2023-06-22 01:58:02.234	35	85
1802	f	2023-06-22 01:58:03.019	2023-06-22 01:58:03.019	35	85
1804	f	2023-06-22 01:58:03.774	2023-06-22 01:58:03.774	35	85
1806	f	2023-06-22 01:58:04.545	2023-06-22 01:58:04.545	35	85
1808	f	2023-06-22 01:58:05.32	2023-06-22 01:58:05.32	35	85
1810	f	2023-06-22 01:58:06.119	2023-06-22 01:58:06.119	35	85
1812	f	2023-06-22 01:58:06.973	2023-06-22 01:58:06.973	35	85
1814	f	2023-06-22 01:58:07.795	2023-06-22 01:58:07.795	35	85
1816	f	2023-06-22 01:58:08.663	2023-06-22 01:58:08.663	35	85
1818	f	2023-06-22 01:58:09.451	2023-06-22 01:58:09.451	35	85
1820	f	2023-06-22 01:58:10.227	2023-06-22 01:58:10.227	35	85
1822	f	2023-06-22 01:58:11.055	2023-06-22 01:58:11.055	35	85
1824	f	2023-06-22 01:58:11.877	2023-06-22 01:58:11.877	35	85
1826	f	2023-06-22 01:58:12.69	2023-06-22 01:58:12.69	35	85
1828	f	2023-06-22 01:58:13.537	2023-06-22 01:58:13.537	35	85
1830	f	2023-06-22 01:58:14.546	2023-06-22 01:58:14.546	35	85
1832	f	2023-06-22 01:58:15.447	2023-06-22 01:58:15.447	35	85
1834	f	2023-06-22 01:58:16.365	2023-06-22 01:58:16.365	35	85
1836	f	2023-06-22 01:58:17.22	2023-06-22 01:58:17.22	35	85
1838	f	2023-06-22 01:58:18.104	2023-06-22 01:58:18.104	35	85
1840	f	2023-06-22 01:58:19.003	2023-06-22 01:58:19.003	35	85
1842	f	2023-06-22 01:58:20.055	2023-06-22 01:58:20.055	35	85
1844	f	2023-06-22 01:58:21.004	2023-06-22 01:58:21.004	35	85
1846	f	2023-06-22 01:58:21.865	2023-06-22 01:58:21.865	35	85
1848	f	2023-06-22 01:58:22.737	2023-06-22 01:58:22.737	35	85
1850	f	2023-06-22 01:58:23.646	2023-06-22 01:58:23.646	35	85
2098	5	2023-06-22 02:11:44.297	2023-06-22 02:11:44.297	35	85
2100	5	2023-06-22 02:11:46.06	2023-06-22 02:11:46.06	35	85
2102	5	2023-06-22 02:11:47.885	2023-06-22 02:11:47.885	35	85
2104	55	2023-06-22 02:11:49.536	2023-06-22 02:11:49.536	35	85
2106	5	2023-06-22 02:11:51.114	2023-06-22 02:11:51.114	35	85
2239	41	2023-06-22 02:27:00.181583	2023-06-22 02:27:00.181583	35	85
2240	1	2023-06-22 02:27:04.4498	2023-06-22 02:27:04.4498	35	85
2241	3	2023-06-22 02:27:06.164544	2023-06-22 02:27:06.164544	35	85
2480	4	2023-06-22 03:40:35.633629	2023-06-22 03:40:35.633629	\N	91
2708	5	2023-06-22 03:55:04.574872	2023-06-22 03:55:04.574872	29	91
2246	8	2023-06-22 02:27:12.747374	2023-06-22 02:27:12.747374	\N	\N
2248	4	2023-06-22 02:27:15.428512	2023-06-22 02:27:15.428512	\N	\N
2380	5	2023-06-22 02:58:27.135338	2023-06-22 02:58:27.135338	35	90
2423	10	2023-06-22 03:20:12.672943	2023-06-22 03:20:12.672943	35	90
2424	1	2023-06-22 03:20:17.110313	2023-06-22 03:20:17.110313	35	90
2710	7	2023-06-22 03:55:05.258325	2023-06-22 03:55:05.258325	29	91
2304	5	2023-06-22 02:29:23.964106	2023-06-22 02:29:23.964106	35	\N
2429	3	2023-06-22 03:20:30.25935	2023-06-22 03:20:30.25935	35	90
1839	f	2023-06-22 01:58:19.003319	2023-06-22 01:58:19.003319	35	85
1841	f	2023-06-22 01:58:20.055906	2023-06-22 01:58:20.055906	35	85
1843	f	2023-06-22 01:58:21.004019	2023-06-22 01:58:21.004019	35	85
1845	f	2023-06-22 01:58:21.86524	2023-06-22 01:58:21.86524	35	85
1847	f	2023-06-22 01:58:22.737926	2023-06-22 01:58:22.737926	35	85
1534	1	2023-06-22 01:19:00.93	2023-06-22 01:19:00.93	35	89
1849	f	2023-06-22 01:58:23.646308	2023-06-22 01:58:23.646308	35	85
2107	4	2023-06-22 02:16:01.161008	2023-06-22 02:16:01.161008	35	85
2109	5	2023-06-22 02:16:02.959714	2023-06-22 02:16:02.959714	35	85
2111	6	2023-06-22 02:16:04.714449	2023-06-22 02:16:04.714449	35	85
2113	4	2023-06-22 02:16:06.365043	2023-06-22 02:16:06.365043	35	85
2115	5	2023-06-22 02:16:07.973646	2023-06-22 02:16:07.973646	35	85
1565	1	2023-06-22 01:19:08.293967	2023-06-22 01:19:08.293967	35	89
1557	1	2023-06-22 01:19:05.765	2023-06-22 01:19:05.765	\N	\N
2117	6	2023-06-22 02:16:09.692985	2023-06-22 02:16:09.692985	35	85
2382	7	2023-06-22 02:58:31.625504	2023-06-22 02:58:31.625504	35	90
2425	2	2023-06-22 03:20:18.961054	2023-06-22 03:20:18.961054	\N	90
2242	4	2023-06-22 02:27:06.195419	2023-06-22 02:27:06.195419	35	85
2428	2	2023-06-22 03:20:28.493507	2023-06-22 03:20:28.493507	35	90
2305	6	2023-06-22 02:29:23.450294	2023-06-22 02:29:23.450294	\N	\N
2434	8	2023-06-22 03:20:39.338243	2023-06-22 03:20:39.338243	35	\N
2482	6	2023-06-22 03:40:35.717252	2023-06-22 03:40:35.717252	\N	91
2711	8	2023-06-22 03:55:05.353592	2023-06-22 03:55:05.353592	29	91
2715	3	2023-06-22 03:55:13.598599	2023-06-22 03:55:13.598599	35	91
2718	6	2023-06-22 03:55:22.09838	2023-06-22 03:55:22.09838	\N	91
1851	1	2023-06-22 01:59:26.853477	2023-06-22 01:59:26.853477	35	85
1853	2	2023-06-22 01:59:27.808865	2023-06-22 01:59:27.808865	35	85
1855	3	2023-06-22 01:59:28.847399	2023-06-22 01:59:28.847399	35	85
1550	1	2023-06-22 01:19:05.204294	2023-06-22 01:19:05.204294	35	\N
1857	4	2023-06-22 01:59:29.769364	2023-06-22 01:59:29.769364	35	85
1859	5	2023-06-22 01:59:30.666373	2023-06-22 01:59:30.666373	35	85
1549	1	2023-06-22 01:19:05.199072	2023-06-22 01:19:05.199072	\N	89
1553	1	2023-06-22 01:19:05.746903	2023-06-22 01:19:05.746903	\N	89
1561	1	2023-06-22 01:19:06.122	2023-06-22 01:19:06.122	35	\N
1562	1	2023-06-22 01:19:06.536	2023-06-22 01:19:06.536	35	\N
2108	4	2023-06-22 02:16:01.161	2023-06-22 02:16:01.161	35	85
2110	5	2023-06-22 02:16:02.959	2023-06-22 02:16:02.959	35	85
1555	1	2023-06-22 01:19:05.746	2023-06-22 01:19:05.746	35	\N
2112	6	2023-06-22 02:16:04.714	2023-06-22 02:16:04.714	35	85
2114	4	2023-06-22 02:16:06.365	2023-06-22 02:16:06.365	35	85
2116	5	2023-06-22 02:16:07.973	2023-06-22 02:16:07.973	35	85
2118	6	2023-06-22 02:16:09.692	2023-06-22 02:16:09.692	35	85
2243	5	2023-06-22 02:27:09.224015	2023-06-22 02:27:09.224015	35	85
2385	2	2023-06-22 03:00:45.248728	2023-06-22 03:00:45.248728	35	89
2386	g df  gg fd g  fdg fdg dfg dfg fdg d dfg df df gdf g	2023-06-22 03:01:10.966323	2023-06-22 03:01:10.966323	35	89
2245	6	2023-06-22 02:27:10.891481	2023-06-22 02:27:10.891481	35	\N
2247	9	2023-06-22 02:27:15.394133	2023-06-22 02:27:15.394133	\N	\N
2307	6	2023-06-22 02:29:32.862287	2023-06-22 02:29:32.862287	29	85
2426	3	2023-06-22 03:20:19.53888	2023-06-22 03:20:19.53888	35	\N
2427	1	2023-06-22 03:20:26.607698	2023-06-22 03:20:26.607698	35	90
2431	7	2023-06-22 03:20:32.577793	2023-06-22 03:20:32.577793	\N	90
2484	9	2023-06-22 03:40:45.262301	2023-06-22 03:40:45.262301	35	\N
2717	5	2023-06-22 03:55:17.386867	2023-06-22 03:55:17.386867	35	\N
2720	9	2023-06-22 03:55:27.691867	2023-06-22 03:55:27.691867	\N	\N
1852	1	2023-06-22 01:59:26.853	2023-06-22 01:59:26.853	35	85
1568	1	2023-06-22 01:19:08.553	2023-06-22 01:19:08.553	35	89
1572	1	2023-06-22 01:19:09.516	2023-06-22 01:19:09.516	35	89
1574	0	2023-06-22 01:19:24.7	2023-06-22 01:19:24.7	35	89
1854	2	2023-06-22 01:59:27.808	2023-06-22 01:59:27.808	35	85
1856	3	2023-06-22 01:59:28.847	2023-06-22 01:59:28.847	35	85
1858	4	2023-06-22 01:59:29.769	2023-06-22 01:59:29.769	35	85
1860	5	2023-06-22 01:59:30.666	2023-06-22 01:59:30.666	35	85
2119	sdssdad	2023-06-22 02:17:10.337721	2023-06-22 02:17:10.337721	35	85
2121	d	2023-06-22 02:17:12.271186	2023-06-22 02:17:12.271186	35	85
2123	d	2023-06-22 02:17:14.13539	2023-06-22 02:17:14.13539	35	85
2125	dd	2023-06-22 02:17:15.926604	2023-06-22 02:17:15.926604	35	85
2127	d	2023-06-22 02:17:17.912525	2023-06-22 02:17:17.912525	35	85
2129	2	2023-06-22 02:17:20.41863	2023-06-22 02:17:20.41863	35	85
2131	2	2023-06-22 02:17:22.199141	2023-06-22 02:17:22.199141	35	85
2133	2	2023-06-22 02:17:24.06994	2023-06-22 02:17:24.06994	35	85
2135	2	2023-06-22 02:17:25.86935	2023-06-22 02:17:25.86935	35	85
2137	22	2023-06-22 02:17:27.663685	2023-06-22 02:17:27.663685	35	85
2249	1	2023-06-22 02:27:35.193457	2023-06-22 02:27:35.193457	35	85
2387	456	2023-06-22 03:08:13.180706	2023-06-22 03:08:13.180706	35	89
2255	1	2023-06-22 02:27:44.411857	2023-06-22 02:27:44.411857	35	\N
2308	5	2023-06-22 02:29:32.984514	2023-06-22 02:29:32.984514	\N	\N
2430	4	2023-06-22 03:20:30.328348	2023-06-22 03:20:30.328348	35	90
2435	9	2023-06-22 03:20:41.143704	2023-06-22 03:20:41.143704	35	\N
2485	000000000000000000000000000000000000	2023-06-22 03:41:05.300856	2023-06-22 03:41:05.300856	35	91
2486	1	2023-06-22 03:41:07.840324	2023-06-22 03:41:07.840324	35	91
2487	2	2023-06-22 03:41:10.167218	2023-06-22 03:41:10.167218	35	91
2488	3	2023-06-22 03:41:12.550458	2023-06-22 03:41:12.550458	35	91
2489	4	2023-06-22 03:41:14.906766	2023-06-22 03:41:14.906766	35	91
2490	5	2023-06-22 03:41:17.240857	2023-06-22 03:41:17.240857	35	91
2491	6	2023-06-22 03:41:19.558863	2023-06-22 03:41:19.558863	35	91
2492	7	2023-06-22 03:41:21.857074	2023-06-22 03:41:21.857074	35	91
2493	8	2023-06-22 03:41:24.197517	2023-06-22 03:41:24.197517	35	91
2494	9	2023-06-22 03:41:26.637384	2023-06-22 03:41:26.637384	35	91
2495	1	2023-06-22 03:41:34.360401	2023-06-22 03:41:34.360401	35	91
2719	7	2023-06-22 03:55:23.040356	2023-06-22 03:55:23.040356	35	\N
1566	1	2023-06-22 01:19:08.293	2023-06-22 01:19:08.293	35	\N
1861	sefsdf ssdf sdf sdf fd	2023-06-22 02:00:42.518793	2023-06-22 02:00:42.518793	35	85
2120	sdssdad	2023-06-22 02:17:10.337	2023-06-22 02:17:10.337	35	85
1567	1	2023-06-22 01:19:08.553134	2023-06-22 01:19:08.553134	\N	\N
1576	0	2023-06-22 01:19:25.057	2023-06-22 01:19:25.057	35	89
1577	0	2023-06-22 01:19:25.473304	2023-06-22 01:19:25.473304	35	89
1578	0	2023-06-22 01:19:25.473	2023-06-22 01:19:25.473	35	89
1579	0	2023-06-22 01:19:25.863877	2023-06-22 01:19:25.863877	35	89
1580	0	2023-06-22 01:19:25.863	2023-06-22 01:19:25.863	35	89
1581	0	2023-06-22 01:19:26.208639	2023-06-22 01:19:26.208639	35	89
1582	0	2023-06-22 01:19:26.208	2023-06-22 01:19:26.208	35	89
1583	1	2023-06-22 01:23:34.214193	2023-06-22 01:23:34.214193	35	89
1584	1	2023-06-22 01:23:34.214	2023-06-22 01:23:34.214	35	89
2122	d	2023-06-22 02:17:12.271	2023-06-22 02:17:12.271	35	85
1586	1	2023-06-22 01:23:34.565	2023-06-22 01:23:34.565	35	89
2124	d	2023-06-22 02:17:14.135	2023-06-22 02:17:14.135	35	85
2126	dd	2023-06-22 02:17:15.926	2023-06-22 02:17:15.926	35	85
2128	d	2023-06-22 02:17:17.912	2023-06-22 02:17:17.912	35	85
2130	2	2023-06-22 02:17:20.418	2023-06-22 02:17:20.418	35	85
2132	2	2023-06-22 02:17:22.199	2023-06-22 02:17:22.199	35	85
2134	2	2023-06-22 02:17:24.069	2023-06-22 02:17:24.069	35	85
2136	2	2023-06-22 02:17:25.869	2023-06-22 02:17:25.869	35	85
2138	22	2023-06-22 02:17:27.663	2023-06-22 02:17:27.663	35	85
2388	d	2023-06-22 03:12:07.549039	2023-06-22 03:12:07.549039	35	89
2250	1	2023-06-22 02:27:36.795581	2023-06-22 02:27:36.795581	35	\N
2256	1	2023-06-22 02:27:46.089605	2023-06-22 02:27:46.089605	35	85
2309	7	2023-06-22 02:29:33.057216	2023-06-22 02:29:33.057216	\N	\N
2432	5	2023-06-22 03:20:32.5843	2023-06-22 03:20:32.5843	\N	90
2496	2	2023-06-22 03:41:36.756021	2023-06-22 03:41:36.756021	35	91
2497	3	2023-06-22 03:41:39.137171	2023-06-22 03:41:39.137171	35	91
2498	4	2023-06-22 03:41:41.491199	2023-06-22 03:41:41.491199	35	91
2499	5	2023-06-22 03:41:43.835799	2023-06-22 03:41:43.835799	35	91
2500	6	2023-06-22 03:41:46.209636	2023-06-22 03:41:46.209636	35	91
2501	7	2023-06-22 03:41:48.616816	2023-06-22 03:41:48.616816	35	91
2502	8	2023-06-22 03:41:51.278109	2023-06-22 03:41:51.278109	35	91
2503	jhvj,hv,jv,jhvj,hv9vcvcxvcv cxvc xcxvcxcx v vxcv	2023-06-22 03:41:54.43412	2023-06-22 03:43:32.991	35	91
2722	gfd dg fd dfg	2023-06-22 04:29:49.609219	2023-06-22 04:29:49.609219	35	88
1603	1	2023-06-22 01:23:36.894	2023-06-22 01:23:36.894	35	\N
1594	1	2023-06-22 01:23:35.865942	2023-06-22 01:23:35.865942	\N	\N
1590	1	2023-06-22 01:23:35.327534	2023-06-22 01:23:35.327534	35	\N
1623	0	2023-06-22 01:23:40.725347	2023-06-22 01:23:40.725347	35	89
1640	2	2023-06-22 01:23:43.565	2023-06-22 01:23:43.565	35	\N
1862	sefsdf ssdf sdf sdf fd	2023-06-22 02:00:42.518	2023-06-22 02:00:42.518	35	85
2139	123123	2023-06-22 02:18:01.510658	2023-06-22 02:18:01.510658	35	85
2141	12	2023-06-22 02:18:03.41498	2023-06-22 02:18:03.41498	35	85
2143	1321321321	2023-06-22 02:18:05.333873	2023-06-22 02:18:05.333873	35	85
1626	0	2023-06-22 01:23:41.141	2023-06-22 01:23:41.141	35	89
2145	321	2023-06-22 02:18:07.173175	2023-06-22 02:18:07.173175	35	85
2147	321	2023-06-22 02:18:17.693382	2023-06-22 02:18:17.693382	35	85
2149	5	2023-06-22 02:18:19.450657	2023-06-22 02:18:19.450657	35	85
2151	4	2023-06-22 02:18:21.266584	2023-06-22 02:18:21.266584	35	85
2153	5	2023-06-22 02:18:23.154878	2023-06-22 02:18:23.154878	35	85
2155	6	2023-06-22 02:18:25.16286	2023-06-22 02:18:25.16286	35	85
2157	5	2023-06-22 02:18:26.950233	2023-06-22 02:18:26.950233	35	85
2159	4	2023-06-22 02:18:29.331152	2023-06-22 02:18:29.331152	35	85
2161	7	2023-06-22 02:18:31.22931	2023-06-22 02:18:31.22931	35	85
2163	8	2023-06-22 02:18:33.178535	2023-06-22 02:18:33.178535	35	85
2165	1	2023-06-22 02:18:40.639047	2023-06-22 02:18:40.639047	35	85
2167	1	2023-06-22 02:18:42.538435	2023-06-22 02:18:42.538435	35	85
2169	1	2023-06-22 02:18:44.445273	2023-06-22 02:18:44.445273	35	85
2171	1	2023-06-22 02:18:46.37016	2023-06-22 02:18:46.37016	35	85
2173	1	2023-06-22 02:18:48.339839	2023-06-22 02:18:48.339839	35	85
2175	1	2023-06-22 02:18:50.272766	2023-06-22 02:18:50.272766	35	85
2177	1	2023-06-22 02:18:52.190724	2023-06-22 02:18:52.190724	35	85
2179	1	2023-06-22 02:18:54.173248	2023-06-22 02:18:54.173248	35	85
2181	1	2023-06-22 02:18:58.006242	2023-06-22 02:18:58.006242	35	85
2389	123	2023-06-22 03:12:37.644105	2023-06-22 03:12:37.644105	35	89
2392	7	2023-06-22 03:12:48.850636	2023-06-22 03:12:48.850636	\N	89
2251	1	2023-06-22 02:27:36.859267	2023-06-22 02:27:36.859267	\N	85
2257	1	2023-06-22 02:27:47.790868	2023-06-22 02:27:47.790868	35	85
2561	1	2023-06-22 03:44:42.804631	2023-06-22 03:44:42.804631	29	91
2562	11	2023-06-22 03:44:43.071479	2023-06-22 03:44:43.071479	29	91
2311	4	2023-06-22 02:29:33.800589	2023-06-22 02:29:33.800589	29	\N
1597	1	2023-06-22 01:23:35.844	2023-06-22 01:23:35.844	35	89
1588	1	2023-06-22 01:23:34.895	2023-06-22 01:23:34.895	35	89
2567	1	2023-06-22 03:44:43.963391	2023-06-22 03:44:43.963391	29	91
1587	1	2023-06-22 01:23:34.895891	2023-06-22 01:23:34.895891	35	89
1612	0	2023-06-22 01:23:38.51	2023-06-22 01:23:38.51	35	89
1607	11	2023-06-22 01:23:37.988784	2023-06-22 01:23:37.988784	35	89
2569	1	2023-06-22 03:44:44.335318	2023-06-22 03:44:44.335318	29	91
1627	0	2023-06-22 01:23:41.51446	2023-06-22 01:23:41.51446	\N	\N
2433	6	2023-06-22 03:20:34.427174	2023-06-22 03:20:34.427174	\N	90
2504	Laron76 has join the room	2023-06-22 03:43:48.071128	2023-06-22 03:43:48.071128	0	91
2505	gfd gfdfdgf	2023-06-22 03:43:53.367256	2023-06-22 03:43:53.367256	29	91
2506	m	2023-06-22 03:43:56.115814	2023-06-22 03:43:56.115814	29	91
2507	m	2023-06-22 03:43:56.329796	2023-06-22 03:43:56.329796	29	91
2508	m	2023-06-22 03:43:56.490817	2023-06-22 03:43:56.490817	29	91
2509	m	2023-06-22 03:43:56.665522	2023-06-22 03:43:56.665522	29	91
2510	m	2023-06-22 03:43:56.878603	2023-06-22 03:43:56.878603	29	91
2511	m	2023-06-22 03:43:57.042598	2023-06-22 03:43:57.042598	29	91
2512	m	2023-06-22 03:43:57.217748	2023-06-22 03:43:57.217748	29	91
2513	m	2023-06-22 03:43:57.402228	2023-06-22 03:43:57.402228	29	91
2514	m	2023-06-22 03:43:57.593561	2023-06-22 03:43:57.593561	29	91
2515	m	2023-06-22 03:43:57.807278	2023-06-22 03:43:57.807278	29	91
2516	m	2023-06-22 03:43:57.968234	2023-06-22 03:43:57.968234	29	91
2517	1	2023-06-22 03:44:00.277701	2023-06-22 03:44:00.277701	29	91
2518	2	2023-06-22 03:44:00.482961	2023-06-22 03:44:00.482961	29	91
2519	3	2023-06-22 03:44:00.683495	2023-06-22 03:44:00.683495	29	91
2520	1	2023-06-22 03:44:02.131123	2023-06-22 03:44:02.131123	29	91
2521	2	2023-06-22 03:44:02.343168	2023-06-22 03:44:02.343168	29	91
2522	3	2023-06-22 03:44:02.54007	2023-06-22 03:44:02.54007	29	91
2523	4	2023-06-22 03:44:02.76274	2023-06-22 03:44:02.76274	29	91
2524	5	2023-06-22 03:44:02.964454	2023-06-22 03:44:02.964454	29	91
2525	6	2023-06-22 03:44:03.161928	2023-06-22 03:44:03.161928	29	91
2526	7	2023-06-22 03:44:03.361589	2023-06-22 03:44:03.361589	29	91
2527	8	2023-06-22 03:44:03.548259	2023-06-22 03:44:03.548259	29	91
1669	20	2023-06-22 01:23:49.538998	2023-06-22 01:23:49.538998	35	\N
2528	9	2023-06-22 03:44:03.738621	2023-06-22 03:44:03.738621	29	91
2529	10	2023-06-22 03:44:05.727211	2023-06-22 03:44:05.727211	29	91
2530	11	2023-06-22 03:44:06.86641	2023-06-22 03:44:06.86641	29	91
2531	12	2023-06-22 03:44:07.589907	2023-06-22 03:44:07.589907	29	91
2532	13	2023-06-22 03:44:08.035311	2023-06-22 03:44:08.035311	29	91
2533	14	2023-06-22 03:44:08.401878	2023-06-22 03:44:08.401878	29	91
1657	14	2023-06-22 01:23:47.370072	2023-06-22 01:23:47.370072	35	89
1649	9	2023-06-22 01:23:45.942795	2023-06-22 01:23:45.942795	35	89
1668	19	2023-06-22 01:23:49.196	2023-06-22 01:23:49.196	35	89
2534	15	2023-06-22 03:44:08.756713	2023-06-22 03:44:08.756713	29	91
2535	16	2023-06-22 03:44:09.116063	2023-06-22 03:44:09.116063	29	91
2536	17	2023-06-22 03:44:09.524507	2023-06-22 03:44:09.524507	29	91
2537	18	2023-06-22 03:44:09.945298	2023-06-22 03:44:09.945298	29	91
2538	19	2023-06-22 03:44:10.378968	2023-06-22 03:44:10.378968	29	91
1686	28	2023-06-22 01:23:53.109	2023-06-22 01:23:53.109	\N	89
1636	1	2023-06-22 01:23:42.343	2023-06-22 01:23:42.343	35	\N
1637	2	2023-06-22 01:23:43.231716	2023-06-22 01:23:43.231716	35	\N
2548	9	2023-06-22 03:44:27.408206	2023-06-22 03:44:27.408206	29	91
2549	000000000000000000000	2023-06-22 03:44:37.214992	2023-06-22 03:44:37.214992	29	91
2550	1	2023-06-22 03:44:38.066226	2023-06-22 03:44:38.066226	29	91
2551	2	2023-06-22 03:44:38.312824	2023-06-22 03:44:38.312824	29	91
2552	3	2023-06-22 03:44:38.551154	2023-06-22 03:44:38.551154	29	91
2553	4	2023-06-22 03:44:38.820237	2023-06-22 03:44:38.820237	29	91
2554	5	2023-06-22 03:44:38.973598	2023-06-22 03:44:38.973598	29	91
2555	6	2023-06-22 03:44:39.212351	2023-06-22 03:44:39.212351	29	91
2556	7	2023-06-22 03:44:39.454497	2023-06-22 03:44:39.454497	29	91
2557	8	2023-06-22 03:44:39.708784	2023-06-22 03:44:39.708784	29	91
2570	1	2023-06-22 03:44:44.527836	2023-06-22 03:44:44.527836	\N	91
2572	1	2023-06-22 03:44:44.813673	2023-06-22 03:44:44.813673	29	91
2581	1	2023-06-22 03:44:46.375538	2023-06-22 03:44:46.375538	29	91
2582	1	2023-06-22 03:44:46.545239	2023-06-22 03:44:46.545239	29	91
2583	1	2023-06-22 03:44:46.732919	2023-06-22 03:44:46.732919	29	91
2584	1	2023-06-22 03:44:46.911927	2023-06-22 03:44:46.911927	29	91
2585	1	2023-06-22 03:44:47.094561	2023-06-22 03:44:47.094561	29	91
2587	1	2023-06-22 03:44:47.426575	2023-06-22 03:44:47.426575	29	91
2589	1	2023-06-22 03:44:47.787554	2023-06-22 03:44:47.787554	29	91
2591	1	2023-06-22 03:44:48.171406	2023-06-22 03:44:48.171406	29	91
2723	gfdgdfgfgdfg	2023-06-22 12:45:26.77781	2023-06-22 12:45:26.77781	35	88
1863	2	2023-06-22 02:02:05.300538	2023-06-22 02:02:05.300538	35	85
1865	3	2023-06-22 02:02:06.514562	2023-06-22 02:02:06.514562	35	85
1867	4	2023-06-22 02:02:07.494699	2023-06-22 02:02:07.494699	35	85
1869	5	2023-06-22 02:02:08.515924	2023-06-22 02:02:08.515924	35	85
1871	6	2023-06-22 02:02:09.483198	2023-06-22 02:02:09.483198	35	85
1873	7	2023-06-22 02:02:10.447404	2023-06-22 02:02:10.447404	35	85
1875	1	2023-06-22 02:02:11.436378	2023-06-22 02:02:11.436378	35	85
1877	1	2023-06-22 02:02:12.440372	2023-06-22 02:02:12.440372	35	85
1645	7	2023-06-22 01:23:44.408328	2023-06-22 01:23:44.408328	35	89
1639	2	2023-06-22 01:23:43.565389	2023-06-22 01:23:43.565389	\N	89
1879	1	2023-06-22 02:02:13.384646	2023-06-22 02:02:13.384646	35	85
1881	1	2023-06-22 02:02:14.386198	2023-06-22 02:02:14.386198	35	85
1883	1	2023-06-22 02:02:15.371159	2023-06-22 02:02:15.371159	35	85
1885	1	2023-06-22 02:02:16.411278	2023-06-22 02:02:16.411278	35	85
1887	1	2023-06-22 02:02:17.528305	2023-06-22 02:02:17.528305	35	85
1889	1	2023-06-22 02:02:18.589508	2023-06-22 02:02:18.589508	35	85
1891	1	2023-06-22 02:02:19.579755	2023-06-22 02:02:19.579755	35	85
1893	1	2023-06-22 02:02:20.636583	2023-06-22 02:02:20.636583	35	85
1895	1	2023-06-22 02:02:21.708207	2023-06-22 02:02:21.708207	35	85
1897	1	2023-06-22 02:02:22.70079	2023-06-22 02:02:22.70079	35	85
1899	1	2023-06-22 02:02:23.734198	2023-06-22 02:02:23.734198	35	85
1901	11	2023-06-22 02:02:24.755662	2023-06-22 02:02:24.755662	35	85
1903	1	2023-06-22 02:02:38.014308	2023-06-22 02:02:38.014308	35	85
1905	2	2023-06-22 02:02:39.127579	2023-06-22 02:02:39.127579	35	85
1907	3	2023-06-22 02:02:40.20119	2023-06-22 02:02:40.20119	35	85
1909	4	2023-06-22 02:02:41.255425	2023-06-22 02:02:41.255425	35	85
1911	5	2023-06-22 02:02:42.432259	2023-06-22 02:02:42.432259	35	85
1913	67	2023-06-22 02:02:43.530012	2023-06-22 02:02:43.530012	35	85
1915	8	2023-06-22 02:02:44.619259	2023-06-22 02:02:44.619259	35	85
1666	18	2023-06-22 01:23:48.728	2023-06-22 01:23:48.728	35	\N
1917	9	2023-06-22 02:02:45.754589	2023-06-22 02:02:45.754589	35	85
1919	2	2023-06-22 02:02:54.893882	2023-06-22 02:02:54.893882	35	85
1921	2	2023-06-22 02:02:56.026081	2023-06-22 02:02:56.026081	35	85
1923	2	2023-06-22 02:02:57.165037	2023-06-22 02:02:57.165037	35	85
1925	2	2023-06-22 02:02:58.30841	2023-06-22 02:02:58.30841	35	85
1927	2	2023-06-22 02:02:59.474805	2023-06-22 02:02:59.474805	35	85
1929	2	2023-06-22 02:03:00.695223	2023-06-22 02:03:00.695223	35	85
1931	2	2023-06-22 02:03:01.818008	2023-06-22 02:03:01.818008	35	85
1933	2	2023-06-22 02:03:02.979811	2023-06-22 02:03:02.979811	35	85
1662	16	2023-06-22 01:23:47.493	2023-06-22 01:23:47.493	\N	89
1935	2	2023-06-22 02:03:04.092033	2023-06-22 02:03:04.092033	35	85
1937	2	2023-06-22 02:03:05.300621	2023-06-22 02:03:05.300621	35	85
1939	2	2023-06-22 02:03:06.456965	2023-06-22 02:03:06.456965	35	85
1684	2	2023-06-22 01:23:53.1	2023-06-22 01:23:53.1	35	89
1652	1	2023-06-22 01:23:46.077546	2023-06-22 01:23:46.077546	35	\N
1638	2	2023-06-22 01:23:43.231	2023-06-22 01:23:43.231	35	\N
1635	1	2023-06-22 01:23:42.343567	2023-06-22 01:23:42.343567	\N	\N
1941	2	2023-06-22 02:03:07.627398	2023-06-22 02:03:07.627398	35	85
1943	2	2023-06-22 02:03:08.798696	2023-06-22 02:03:08.798696	35	85
1945	2	2023-06-22 02:03:09.974691	2023-06-22 02:03:09.974691	35	85
1947	2	2023-06-22 02:03:11.121254	2023-06-22 02:03:11.121254	35	85
2140	123123	2023-06-22 02:18:01.51	2023-06-22 02:18:01.51	35	85
2142	12	2023-06-22 02:18:03.414	2023-06-22 02:18:03.414	35	85
2144	1321321321	2023-06-22 02:18:05.333	2023-06-22 02:18:05.333	35	85
2146	321	2023-06-22 02:18:07.173	2023-06-22 02:18:07.173	35	85
2148	321	2023-06-22 02:18:17.693	2023-06-22 02:18:17.693	35	85
2150	5	2023-06-22 02:18:19.45	2023-06-22 02:18:19.45	35	85
2152	4	2023-06-22 02:18:21.266	2023-06-22 02:18:21.266	35	85
2154	5	2023-06-22 02:18:23.154	2023-06-22 02:18:23.154	35	85
2156	6	2023-06-22 02:18:25.162	2023-06-22 02:18:25.162	35	85
2158	5	2023-06-22 02:18:26.95	2023-06-22 02:18:26.95	35	85
2160	4	2023-06-22 02:18:29.331	2023-06-22 02:18:29.331	35	85
2162	7	2023-06-22 02:18:31.229	2023-06-22 02:18:31.229	35	85
2164	8	2023-06-22 02:18:33.178	2023-06-22 02:18:33.178	35	85
2166	1	2023-06-22 02:18:40.639	2023-06-22 02:18:40.639	35	85
2168	1	2023-06-22 02:18:42.538	2023-06-22 02:18:42.538	35	85
2170	1	2023-06-22 02:18:44.445	2023-06-22 02:18:44.445	35	85
2172	1	2023-06-22 02:18:46.37	2023-06-22 02:18:46.37	35	85
2174	1	2023-06-22 02:18:48.339	2023-06-22 02:18:48.339	35	85
2176	1	2023-06-22 02:18:50.272	2023-06-22 02:18:50.272	35	85
2178	1	2023-06-22 02:18:52.19	2023-06-22 02:18:52.19	35	85
2180	1	2023-06-22 02:18:54.173	2023-06-22 02:18:54.173	35	85
2182	1	2023-06-22 02:18:58.006	2023-06-22 02:18:58.006	35	85
2390	5	2023-06-22 03:12:45.404415	2023-06-22 03:12:45.404415	35	89
2436	1	2023-06-22 03:22:49.964553	2023-06-22 03:22:49.964553	35	90
2252	1	2023-06-22 02:27:37.37388	2023-06-22 02:27:37.37388	35	85
2312	1	2023-06-22 02:30:32.339083	2023-06-22 02:30:32.339083	35	85
2440	7	2023-06-22 03:22:56.433204	2023-06-22 03:22:56.433204	\N	\N
2539	123	2023-06-22 03:44:20.680385	2023-06-22 03:44:20.680385	35	91
2540	1	2023-06-22 03:44:25.578511	2023-06-22 03:44:25.578511	29	91
2541	2	2023-06-22 03:44:25.791942	2023-06-22 03:44:25.791942	29	91
2542	3	2023-06-22 03:44:26.042281	2023-06-22 03:44:26.042281	29	91
2543	4	2023-06-22 03:44:26.268617	2023-06-22 03:44:26.268617	29	91
2327	3	2023-06-22 02:30:49.16588	2023-06-22 02:30:49.16588	29	85
2328	2	2023-06-22 02:30:49.306178	2023-06-22 02:30:49.306178	29	85
2329	1	2023-06-22 02:30:49.454775	2023-06-22 02:30:49.454775	29	85
2330	0	2023-06-22 02:30:49.604342	2023-06-22 02:30:49.604342	29	85
2544	5	2023-06-22 03:44:26.493313	2023-06-22 03:44:26.493313	29	91
2545	6	2023-06-22 03:44:26.720293	2023-06-22 03:44:26.720293	29	91
2318	7	2023-06-22 02:30:38.019974	2023-06-22 02:30:38.019974	\N	\N
2546	7	2023-06-22 03:44:27.041492	2023-06-22 03:44:27.041492	29	91
2547	8	2023-06-22 03:44:27.272015	2023-06-22 03:44:27.272015	29	91
2724	bli	2023-06-22 12:53:11.82308	2023-06-22 12:53:11.82308	35	91
1864	2	2023-06-22 02:02:05.3	2023-06-22 02:02:05.3	35	85
1866	3	2023-06-22 02:02:06.514	2023-06-22 02:02:06.514	35	85
1868	4	2023-06-22 02:02:07.494	2023-06-22 02:02:07.494	35	85
1870	5	2023-06-22 02:02:08.515	2023-06-22 02:02:08.515	35	85
1646	7	2023-06-22 01:23:44.408	2023-06-22 01:23:44.408	35	89
1631	1	2023-06-22 01:23:42.006545	2023-06-22 01:23:42.006545	35	89
1620	0	2023-06-22 01:23:39.85935	2023-06-22 01:23:39.85935	35	89
1872	6	2023-06-22 02:02:09.483	2023-06-22 02:02:09.483	35	85
1874	7	2023-06-22 02:02:10.447	2023-06-22 02:02:10.447	35	85
1876	1	2023-06-22 02:02:11.436	2023-06-22 02:02:11.436	35	85
1878	1	2023-06-22 02:02:12.44	2023-06-22 02:02:12.44	35	85
1880	1	2023-06-22 02:02:13.384	2023-06-22 02:02:13.384	35	85
1882	1	2023-06-22 02:02:14.386	2023-06-22 02:02:14.386	35	85
1884	1	2023-06-22 02:02:15.371	2023-06-22 02:02:15.371	35	85
1886	1	2023-06-22 02:02:16.411	2023-06-22 02:02:16.411	35	85
1888	1	2023-06-22 02:02:17.528	2023-06-22 02:02:17.528	35	85
1890	1	2023-06-22 02:02:18.589	2023-06-22 02:02:18.589	35	85
1892	1	2023-06-22 02:02:19.579	2023-06-22 02:02:19.579	35	85
1894	1	2023-06-22 02:02:20.636	2023-06-22 02:02:20.636	35	85
1896	1	2023-06-22 02:02:21.708	2023-06-22 02:02:21.708	35	85
1898	1	2023-06-22 02:02:22.7	2023-06-22 02:02:22.7	35	85
1900	1	2023-06-22 02:02:23.734	2023-06-22 02:02:23.734	35	85
1902	11	2023-06-22 02:02:24.755	2023-06-22 02:02:24.755	35	85
1671	21	2023-06-22 01:23:50.464351	2023-06-22 01:23:50.464351	35	89
2188	6	2023-06-22 02:22:52.331191	2023-06-22 02:22:52.331191	35	85
2391	6	2023-06-22 03:12:47.193174	2023-06-22 03:12:47.193174	35	89
2183	2	2023-06-22 02:22:48.479929	2023-06-22 02:22:48.479929	35	85
2198	9	2023-06-22 02:22:58.596	2023-06-22 02:22:58.596	\N	\N
1655	2	2023-06-22 01:23:46.953646	2023-06-22 01:23:46.953646	35	89
1651	9	2023-06-22 01:23:45.942	2023-06-22 01:23:45.942	\N	89
1678	25	2023-06-22 01:23:51.604507	2023-06-22 01:23:51.604507	\N	89
1689	0	2023-06-22 01:23:54.538209	2023-06-22 01:23:54.538209	35	89
1647	8	2023-06-22 01:23:44.984775	2023-06-22 01:23:44.984775	35	\N
2437	2	2023-06-22 03:22:52.035369	2023-06-22 03:22:52.035369	35	90
2253	1	2023-06-22 02:27:37.415953	2023-06-22 02:27:37.415953	\N	85
2443	8	2023-06-22 03:23:03.550209	2023-06-22 03:23:03.550209	35	90
2445	Invitation link http://localhost:3006/chat/channel/invitation/91/fgdffgddfg	2023-06-22 03:23:29.968365	2023-06-22 03:23:29.968365	0	91
2313	2	2023-06-22 02:30:34.047224	2023-06-22 02:30:34.047224	35	85
2558	9	2023-06-22 03:44:39.859557	2023-06-22 03:44:39.859557	29	91
2559	1	2023-06-22 03:44:42.39833	2023-06-22 03:44:42.39833	29	91
2560	1	2023-06-22 03:44:42.642884	2023-06-22 03:44:42.642884	29	91
2563	1	2023-06-22 03:44:43.203841	2023-06-22 03:44:43.203841	29	91
2564	1	2023-06-22 03:44:43.363955	2023-06-22 03:44:43.363955	29	91
2565	1	2023-06-22 03:44:43.508325	2023-06-22 03:44:43.508325	29	91
2566	1	2023-06-22 03:44:43.830318	2023-06-22 03:44:43.830318	29	91
2568	1	2023-06-22 03:44:44.118388	2023-06-22 03:44:44.118388	29	91
2571	1	2023-06-22 03:44:44.654344	2023-06-22 03:44:44.654344	29	91
2573	1	2023-06-22 03:44:44.968929	2023-06-22 03:44:44.968929	29	91
2574	1	2023-06-22 03:44:45.152113	2023-06-22 03:44:45.152113	29	91
2575	1	2023-06-22 03:44:45.307742	2023-06-22 03:44:45.307742	29	91
2576	1	2023-06-22 03:44:45.460665	2023-06-22 03:44:45.460665	29	91
2577	1	2023-06-22 03:44:45.62016	2023-06-22 03:44:45.62016	29	91
2578	1	2023-06-22 03:44:45.778139	2023-06-22 03:44:45.778139	29	91
2579	1	2023-06-22 03:44:45.962792	2023-06-22 03:44:45.962792	29	91
2580	1	2023-06-22 03:44:46.17425	2023-06-22 03:44:46.17425	29	91
2586	1	2023-06-22 03:44:47.257573	2023-06-22 03:44:47.257573	29	91
2588	1	2023-06-22 03:44:47.621329	2023-06-22 03:44:47.621329	29	91
2590	1	2023-06-22 03:44:47.967897	2023-06-22 03:44:47.967897	29	91
2725	blabla	2023-06-22 12:53:28.350957	2023-06-22 12:53:28.350957	29	91
2726	sdfsdsfsf	2023-06-22 12:53:36.671039	2023-06-22 12:53:36.671039	29	91
2727	sdfsdfsf	2023-06-22 12:53:38.920322	2023-06-22 12:53:38.920322	35	91
1904	1	2023-06-22 02:02:38.014	2023-06-22 02:02:38.014	35	85
1585	1	2023-06-22 01:23:34.565231	2023-06-22 01:23:34.565231	\N	89
1906	2	2023-06-22 02:02:39.127	2023-06-22 02:02:39.127	35	85
1908	3	2023-06-22 02:02:40.201	2023-06-22 02:02:40.201	35	85
1910	4	2023-06-22 02:02:41.255	2023-06-22 02:02:41.255	35	85
1912	5	2023-06-22 02:02:42.432	2023-06-22 02:02:42.432	35	85
1914	67	2023-06-22 02:02:43.53	2023-06-22 02:02:43.53	35	85
1916	8	2023-06-22 02:02:44.619	2023-06-22 02:02:44.619	35	85
1918	9	2023-06-22 02:02:45.754	2023-06-22 02:02:45.754	35	85
1920	2	2023-06-22 02:02:54.893	2023-06-22 02:02:54.893	35	85
1922	2	2023-06-22 02:02:56.026	2023-06-22 02:02:56.026	35	85
1664	17	2023-06-22 01:23:47.723	2023-06-22 01:23:47.723	\N	\N
1924	2	2023-06-22 02:02:57.165	2023-06-22 02:02:57.165	35	85
1926	2	2023-06-22 02:02:58.308	2023-06-22 02:02:58.308	35	85
1928	2	2023-06-22 02:02:59.474	2023-06-22 02:02:59.474	35	85
1930	2	2023-06-22 02:03:00.695	2023-06-22 02:03:00.695	35	85
1932	2	2023-06-22 02:03:01.818	2023-06-22 02:03:01.818	35	85
1658	14	2023-06-22 01:23:47.37	2023-06-22 01:23:47.37	35	89
1934	2	2023-06-22 02:03:02.979	2023-06-22 02:03:02.979	35	85
1688	29	2023-06-22 01:23:54.129	2023-06-22 01:23:54.129	35	89
1682	2	2023-06-22 01:23:53.100152	2023-06-22 01:23:53.100152	\N	89
1621	0	2023-06-22 01:23:39.742	2023-06-22 01:23:39.742	\N	\N
1936	2	2023-06-22 02:03:04.092	2023-06-22 02:03:04.092	35	85
1938	2	2023-06-22 02:03:05.3	2023-06-22 02:03:05.3	35	85
1940	2	2023-06-22 02:03:06.456	2023-06-22 02:03:06.456	35	85
1942	2	2023-06-22 02:03:07.627	2023-06-22 02:03:07.627	35	85
1944	2	2023-06-22 02:03:08.798	2023-06-22 02:03:08.798	35	85
1946	2	2023-06-22 02:03:09.974	2023-06-22 02:03:09.974	35	85
1948	2	2023-06-22 02:03:11.121	2023-06-22 02:03:11.121	35	85
2184	2	2023-06-22 02:22:48.479	2023-06-22 02:22:48.479	35	85
2186	4	2023-06-22 02:22:50.096	2023-06-22 02:22:50.096	\N	\N
2191	6	2023-06-22 02:22:52.331	2023-06-22 02:22:52.331	35	\N
2393	9	2023-06-22 03:12:49.499597	2023-06-22 03:12:49.499597	\N	\N
2254	1	2023-06-22 02:27:40.478023	2023-06-22 02:27:40.478023	\N	\N
2444	9	2023-06-22 03:23:05.500725	2023-06-22 03:23:05.500725	35	\N
2438	3	2023-06-22 03:22:52.697736	2023-06-22 03:22:52.697736	\N	90
2592	00000000000000000	2023-06-22 03:45:36.15336	2023-06-22 03:45:36.15336	29	91
2593	1	2023-06-22 03:45:37.449636	2023-06-22 03:45:37.449636	29	91
2594	2	2023-06-22 03:45:37.799625	2023-06-22 03:45:37.799625	29	91
2596	4	2023-06-22 03:45:38.203377	2023-06-22 03:45:38.203377	29	91
2314	3	2023-06-22 02:30:35.807729	2023-06-22 02:30:35.807729	\N	\N
2322	8	2023-06-22 02:30:44.747923	2023-06-22 02:30:44.747923	\N	\N
2597	5	2023-06-22 03:45:38.422671	2023-06-22 03:45:38.422671	29	91
2598	6	2023-06-22 03:45:38.668519	2023-06-22 03:45:38.668519	29	91
2599	7	2023-06-22 03:45:39.088443	2023-06-22 03:45:39.088443	29	91
2604	1	2023-06-22 03:45:42.562701	2023-06-22 03:45:42.562701	29	91
2605	1	2023-06-22 03:45:42.751685	2023-06-22 03:45:42.751685	29	91
2606	1	2023-06-22 03:45:42.984666	2023-06-22 03:45:42.984666	29	91
2607	1	2023-06-22 03:45:43.184351	2023-06-22 03:45:43.184351	29	91
2609	1	2023-06-22 03:45:43.558463	2023-06-22 03:45:43.558463	29	91
2611	1	2023-06-22 03:45:43.946936	2023-06-22 03:45:43.946936	29	91
2728	blabla	2023-06-22 12:53:49.930461	2023-06-22 12:53:49.930461	35	91
2729	sadsasd	2023-06-22 12:53:52.945756	2023-06-22 12:53:52.945756	29	91
2730	blablabalablabala	2023-06-22 12:53:56.658121	2023-06-22 12:53:56.658121	35	91
1949	1	2023-06-22 02:03:58.147481	2023-06-22 02:03:58.147481	35	85
1951	2	2023-06-22 02:04:00.071005	2023-06-22 02:04:00.071005	35	85
1953	3	2023-06-22 02:04:01.833752	2023-06-22 02:04:01.833752	35	85
1955	1	2023-06-22 02:04:03.997612	2023-06-22 02:04:03.997612	35	85
1957	1	2023-06-22 02:04:05.058219	2023-06-22 02:04:05.058219	35	85
1959	1	2023-06-22 02:04:06.138473	2023-06-22 02:04:06.138473	35	85
1961	1	2023-06-22 02:04:07.570703	2023-06-22 02:04:07.570703	35	85
1963	1	2023-06-22 02:04:09.192152	2023-06-22 02:04:09.192152	35	85
1965	1	2023-06-22 02:04:10.83175	2023-06-22 02:04:10.83175	35	85
1967	1	2023-06-22 02:04:12.107988	2023-06-22 02:04:12.107988	35	85
1969	1	2023-06-22 02:04:13.337429	2023-06-22 02:04:13.337429	35	85
1971	1	2023-06-22 02:04:15.014552	2023-06-22 02:04:15.014552	35	85
1973	1	2023-06-22 02:04:16.384386	2023-06-22 02:04:16.384386	35	85
1975	1	2023-06-22 02:04:17.801449	2023-06-22 02:04:17.801449	35	85
1977	1	2023-06-22 02:04:19.162828	2023-06-22 02:04:19.162828	35	85
1979	1	2023-06-22 02:04:20.548064	2023-06-22 02:04:20.548064	35	85
1981	1	2023-06-22 02:04:21.875789	2023-06-22 02:04:21.875789	35	85
1983	1	2023-06-22 02:04:23.794151	2023-06-22 02:04:23.794151	35	85
1985	1	2023-06-22 02:04:25.527484	2023-06-22 02:04:25.527484	35	85
1987	1	2023-06-22 02:04:26.720725	2023-06-22 02:04:26.720725	35	85
1989	1	2023-06-22 02:04:27.954441	2023-06-22 02:04:27.954441	35	85
1991	1	2023-06-22 02:04:29.249569	2023-06-22 02:04:29.249569	35	85
1993	1	2023-06-22 02:04:30.489475	2023-06-22 02:04:30.489475	35	85
1995	1	2023-06-22 02:04:31.704851	2023-06-22 02:04:31.704851	35	85
1997	1	2023-06-22 02:04:32.915192	2023-06-22 02:04:32.915192	35	85
1999	1	2023-06-22 02:04:34.36744	2023-06-22 02:04:34.36744	35	85
2001	1	2023-06-22 02:04:36.024105	2023-06-22 02:04:36.024105	35	85
2192	7	2023-06-22 02:22:52.381	2023-06-22 02:22:52.381	35	85
2185	4	2023-06-22 02:22:50.096975	2023-06-22 02:22:50.096975	\N	\N
2195	9	2023-06-22 02:22:58.596414	2023-06-22 02:22:58.596414	35	85
2206	3	2023-06-22 02:23:05.834	2023-06-22 02:23:05.834	\N	85
1599	1	2023-06-22 01:23:35.979	2023-06-22 01:23:35.979	\N	89
2209	5	2023-06-22 02:23:10.970784	2023-06-22 02:23:10.970784	\N	85
1611	0	2023-06-22 01:23:38.510168	2023-06-22 01:23:38.510168	35	89
2216	9	2023-06-22 02:23:16.145204	2023-06-22 02:23:16.145204	35	85
1596	1	2023-06-22 01:23:35.865	2023-06-22 01:23:35.865	35	89
1593	1	2023-06-22 01:23:35.844173	2023-06-22 01:23:35.844173	35	\N
1613	0	2023-06-22 01:23:39.012639	2023-06-22 01:23:39.012639	35	\N
1609	0	2023-06-22 01:23:38.38741	2023-06-22 01:23:38.38741	35	\N
1610	0	2023-06-22 01:23:38.387	2023-06-22 01:23:38.387	\N	\N
2258	esdgd dsfg	2023-06-22 02:28:08.44365	2023-06-22 02:28:08.44365	35	85
2259	1	2023-06-22 02:28:13.020386	2023-06-22 02:28:13.020386	35	85
2394	8	2023-06-22 03:12:49.50655	2023-06-22 03:12:49.50655	35	89
1670	20	2023-06-22 01:23:49.538	2023-06-22 01:23:49.538	35	\N
1675	2	2023-06-22 01:23:50.475	2023-06-22 01:23:50.475	35	\N
1674	21	2023-06-22 01:23:50.464	2023-06-22 01:23:50.464	\N	89
1690	0	2023-06-22 01:23:54.538	2023-06-22 01:23:54.538	35	89
1629	00	2023-06-22 01:23:41.855216	2023-06-22 01:23:41.855216	35	\N
1679	25	2023-06-22 01:23:51.604	2023-06-22 01:23:51.604	35	\N
2266	1	2023-06-22 02:28:24.519649	2023-06-22 02:28:24.519649	35	85
2439	5	2023-06-22 03:22:53.908852	2023-06-22 03:22:53.908852	\N	\N
2595	3	2023-06-22 03:45:38.009037	2023-06-22 03:45:38.009037	29	91
2600	8	2023-06-22 03:45:39.252242	2023-06-22 03:45:39.252242	29	91
2260	1	2023-06-22 02:28:14.705864	2023-06-22 02:28:14.705864	\N	85
2601	9	2023-06-22 03:45:39.436212	2023-06-22 03:45:39.436212	29	91
2602	1	2023-06-22 03:45:42.064491	2023-06-22 03:45:42.064491	29	91
2315	4	2023-06-22 02:30:35.897513	2023-06-22 02:30:35.897513	\N	\N
2603	1	2023-06-22 03:45:42.396633	2023-06-22 03:45:42.396633	29	91
2608	1	2023-06-22 03:45:43.384763	2023-06-22 03:45:43.384763	29	91
2610	1	2023-06-22 03:45:43.757633	2023-06-22 03:45:43.757633	29	91
2612	11	2023-06-22 03:45:44.172282	2023-06-22 03:45:44.172282	29	91
2613	5	2023-06-22 03:45:46.916175	2023-06-22 03:45:46.916175	35	91
2614	6	2023-06-22 03:45:49.201549	2023-06-22 03:45:49.201549	35	91
2325	7	2023-06-22 02:30:45.916374	2023-06-22 02:30:45.916374	\N	\N
2615	4	2023-06-22 03:45:51.564249	2023-06-22 03:45:51.564249	35	91
2616	7	2023-06-22 03:45:53.996638	2023-06-22 03:45:53.996638	35	91
2617	8	2023-06-22 03:45:56.478353	2023-06-22 03:45:56.478353	35	91
2618	9	2023-06-22 03:45:58.955319	2023-06-22 03:45:58.955319	35	91
2619	1	2023-06-22 03:46:05.505929	2023-06-22 03:46:05.505929	35	91
2620	2	2023-06-22 03:46:07.855048	2023-06-22 03:46:07.855048	35	91
2621	3	2023-06-22 03:46:10.55476	2023-06-22 03:46:10.55476	35	91
2628	4	2023-06-22 03:46:13.882455	2023-06-22 03:46:13.882455	35	91
2632	5	2023-06-22 03:46:17.3307	2023-06-22 03:46:17.3307	35	91
2633	6	2023-06-22 03:46:19.983291	2023-06-22 03:46:19.983291	35	91
2634	7	2023-06-22 03:46:22.489432	2023-06-22 03:46:22.489432	35	91
2635	8	2023-06-22 03:46:24.982718	2023-06-22 03:46:24.982718	35	91
2636	9	2023-06-22 03:46:27.485036	2023-06-22 03:46:27.485036	35	91
2731	Invitation link http://localhost:3006/chat/channel/invitation/92/TESSSSST	2023-06-22 13:00:58.203043	2023-06-22 13:00:58.203043	0	92
1624	0	2023-06-22 01:23:40.725	2023-06-22 01:23:40.725	35	89
1950	1	2023-06-22 02:03:58.147	2023-06-22 02:03:58.147	35	85
1952	2	2023-06-22 02:04:00.071	2023-06-22 02:04:00.071	35	85
1622	0	2023-06-22 01:23:39.859	2023-06-22 01:23:39.859	\N	\N
1625	0	2023-06-22 01:23:41.141154	2023-06-22 01:23:41.141154	35	89
1595	1	2023-06-22 01:23:35.979344	2023-06-22 01:23:35.979344	\N	\N
1628	0	2023-06-22 01:23:41.514	2023-06-22 01:23:41.514	35	89
1954	3	2023-06-22 02:04:01.833	2023-06-22 02:04:01.833	35	85
1956	1	2023-06-22 02:04:03.997	2023-06-22 02:04:03.997	35	85
1958	1	2023-06-22 02:04:05.058	2023-06-22 02:04:05.058	35	85
1960	1	2023-06-22 02:04:06.138	2023-06-22 02:04:06.138	35	85
1615	0	2023-06-22 01:23:39.356405	2023-06-22 01:23:39.356405	35	89
1962	1	2023-06-22 02:04:07.57	2023-06-22 02:04:07.57	35	85
1644	6	2023-06-22 01:23:44.074	2023-06-22 01:23:44.074	\N	\N
1589	1	2023-06-22 01:23:34.921761	2023-06-22 01:23:34.921761	\N	\N
1964	1	2023-06-22 02:04:09.192	2023-06-22 02:04:09.192	35	85
1966	1	2023-06-22 02:04:10.831	2023-06-22 02:04:10.831	35	85
1667	19	2023-06-22 01:23:49.196759	2023-06-22 01:23:49.196759	35	\N
1968	1	2023-06-22 02:04:12.107	2023-06-22 02:04:12.107	35	85
1970	1	2023-06-22 02:04:13.337	2023-06-22 02:04:13.337	35	85
1972	1	2023-06-22 02:04:15.014	2023-06-22 02:04:15.014	35	85
1672	2	2023-06-22 01:23:50.475957	2023-06-22 01:23:50.475957	\N	\N
1974	1	2023-06-22 02:04:16.384	2023-06-22 02:04:16.384	35	85
1976	1	2023-06-22 02:04:17.801	2023-06-22 02:04:17.801	35	85
1978	1	2023-06-22 02:04:19.162	2023-06-22 02:04:19.162	35	85
1980	1	2023-06-22 02:04:20.548	2023-06-22 02:04:20.548	35	85
1982	1	2023-06-22 02:04:21.875	2023-06-22 02:04:21.875	35	85
1984	1	2023-06-22 02:04:23.794	2023-06-22 02:04:23.794	35	85
1986	1	2023-06-22 02:04:25.527	2023-06-22 02:04:25.527	35	85
1988	1	2023-06-22 02:04:26.72	2023-06-22 02:04:26.72	35	85
1990	1	2023-06-22 02:04:27.954	2023-06-22 02:04:27.954	35	85
1992	1	2023-06-22 02:04:29.249	2023-06-22 02:04:29.249	35	85
1994	1	2023-06-22 02:04:30.489	2023-06-22 02:04:30.489	35	85
1996	1	2023-06-22 02:04:31.704	2023-06-22 02:04:31.704	35	85
1998	1	2023-06-22 02:04:32.915	2023-06-22 02:04:32.915	35	85
2000	1	2023-06-22 02:04:34.367	2023-06-22 02:04:34.367	35	85
2002	1	2023-06-22 02:04:36.024	2023-06-22 02:04:36.024	35	85
2187	5	2023-06-22 02:22:50.698738	2023-06-22 02:22:50.698738	\N	85
2197	1	2023-06-22 02:22:58.602368	2023-06-22 02:22:58.602368	35	85
2201	1	2023-06-22 02:23:04.140936	2023-06-22 02:23:04.140936	35	85
2395	1	2023-06-22 03:13:57.251224	2023-06-22 03:13:57.251224	35	89
2205	2	2023-06-22 02:23:05.826	2023-06-22 02:23:05.826	35	85
2212	6	2023-06-22 02:23:10.987	2023-06-22 02:23:10.987	35	85
2214	7	2023-06-22 02:23:14.29	2023-06-22 02:23:14.29	35	85
2217	8	2023-06-22 02:23:16.104	2023-06-22 02:23:16.104	35	\N
2400	6	2023-06-22 03:14:03.032312	2023-06-22 03:14:03.032312	\N	\N
2441	4	2023-06-22 03:22:57.84641	2023-06-22 03:22:57.84641	\N	\N
2268	1	2023-06-22 02:28:26.744838	2023-06-22 02:28:26.744838	35	85
2261	1	2023-06-22 02:28:15.278644	2023-06-22 02:28:15.278644	\N	\N
2316	6	2023-06-22 02:30:36.491911	2023-06-22 02:30:36.491911	\N	\N
2622	1	2023-06-22 03:46:12.881287	2023-06-22 03:46:12.881287	\N	\N
2630	8	2023-06-22 03:46:16.409846	2023-06-22 03:46:16.409846	29	91
2732	jrasser has join the room	2023-06-22 13:01:03.462717	2023-06-22 13:01:03.462717	0	92
2321	5	2023-06-22 02:30:44.138579	2023-06-22 02:30:44.138579	\N	85
2003	2	2023-06-22 02:05:16.486796	2023-06-22 02:05:16.486796	35	85
2005	3	2023-06-22 02:05:17.790585	2023-06-22 02:05:17.790585	35	85
2007	4	2023-06-22 02:05:19.12006	2023-06-22 02:05:19.12006	35	85
2009	5	2023-06-22 02:05:20.480688	2023-06-22 02:05:20.480688	35	85
2011	6	2023-06-22 02:05:21.826277	2023-06-22 02:05:21.826277	35	85
2013	7	2023-06-22 02:05:23.092469	2023-06-22 02:05:23.092469	35	85
2015	8	2023-06-22 02:05:24.328038	2023-06-22 02:05:24.328038	35	85
2017	9	2023-06-22 02:05:25.655073	2023-06-22 02:05:25.655073	35	85
1634	1	2023-06-22 01:23:42.224	2023-06-22 01:23:42.224	\N	\N
2194	8	2023-06-22 02:22:56.747	2023-06-22 02:22:56.747	35	85
2189	7	2023-06-22 02:22:52.381267	2023-06-22 02:22:52.381267	\N	85
2200	1	2023-06-22 02:22:58.602	2023-06-22 02:22:58.602	35	\N
2202	1	2023-06-22 02:23:04.14	2023-06-22 02:23:04.14	35	85
2207	4	2023-06-22 02:23:09.151069	2023-06-22 02:23:09.151069	\N	\N
2396	3	2023-06-22 03:13:59.038357	2023-06-22 03:13:59.038357	\N	\N
2211	5	2023-06-22 02:23:10.97	2023-06-22 02:23:10.97	35	\N
1602	1	2023-06-22 01:23:37.109497	2023-06-22 01:23:37.109497	35	89
1604	1	2023-06-22 01:23:37.109	2023-06-22 01:23:37.109	35	89
1605	1	2023-06-22 01:23:37.683861	2023-06-22 01:23:37.683861	35	89
1606	1	2023-06-22 01:23:37.683	2023-06-22 01:23:37.683	35	89
1608	11	2023-06-22 01:23:37.988	2023-06-22 01:23:37.988	35	89
1614	0	2023-06-22 01:23:39.012	2023-06-22 01:23:39.012	\N	89
2262	1	2023-06-22 02:28:16.434847	2023-06-22 02:28:16.434847	\N	85
2267	1	2023-06-22 02:28:26.195336	2023-06-22 02:28:26.195336	35	\N
2442	6	2023-06-22 03:23:01.596102	2023-06-22 03:23:01.596102	35	\N
2446	ggfgfffg	2023-06-22 03:23:33.652538	2023-06-22 03:23:33.652538	35	91
2447	1	2023-06-22 03:23:37.370664	2023-06-22 03:23:37.370664	35	91
1656	2	2023-06-22 01:23:46.953	2023-06-22 01:23:46.953	\N	89
2317	5	2023-06-22 02:30:36.526246	2023-06-22 02:30:36.526246	\N	\N
2623	4	2023-06-22 03:46:12.887394	2023-06-22 03:46:12.887394	29	91
2733	coucou	2023-06-22 13:01:06.680065	2023-06-22 13:01:06.680065	35	92
2734	slt	2023-06-22 13:01:09.025006	2023-06-22 13:01:09.025006	29	92
2319	8	2023-06-22 02:30:44.053463	2023-06-22 02:30:44.053463	35	85
2735	fsfsddf df sdsdf ds ds fsd fdf 	2023-06-22 13:01:11.08071	2023-06-22 13:01:11.08071	29	92
2736	1	2023-06-22 13:01:11.955503	2023-06-22 13:01:11.955503	29	92
2737	2	2023-06-22 13:01:12.682441	2023-06-22 13:01:12.682441	29	92
2738	3	2023-06-22 13:01:12.908034	2023-06-22 13:01:12.908034	29	92
2739	4	2023-06-22 13:01:13.138036	2023-06-22 13:01:13.138036	29	92
2740	5	2023-06-22 13:01:13.362468	2023-06-22 13:01:13.362468	29	92
2741	6	2023-06-22 13:01:13.562259	2023-06-22 13:01:13.562259	29	92
2742	7	2023-06-22 13:01:13.843256	2023-06-22 13:01:13.843256	29	92
1653	10	2023-06-22 01:23:45.955	2023-06-22 01:23:45.955	\N	89
1685	26	2023-06-22 01:23:53.092	2023-06-22 01:23:53.092	35	\N
2743	8	2023-06-22 13:01:14.102695	2023-06-22 13:01:14.102695	29	92
1665	18	2023-06-22 01:23:48.728836	2023-06-22 01:23:48.728836	\N	89
2744	9	2023-06-22 13:01:14.289416	2023-06-22 13:01:14.289416	29	92
2745	1	2023-06-22 13:01:15.802931	2023-06-22 13:01:15.802931	29	92
1687	29	2023-06-22 01:23:54.129708	2023-06-22 01:23:54.129708	\N	\N
1633	1	2023-06-22 01:23:42.006	2023-06-22 01:23:42.006	\N	\N
2746	2	2023-06-22 13:01:15.993383	2023-06-22 13:01:15.993383	29	92
2747	3	2023-06-22 13:01:16.194862	2023-06-22 13:01:16.194862	29	92
2748	4	2023-06-22 13:01:16.394782	2023-06-22 13:01:16.394782	29	92
2749	5	2023-06-22 13:01:16.601642	2023-06-22 13:01:16.601642	29	92
2750	6	2023-06-22 13:01:16.785227	2023-06-22 13:01:16.785227	29	92
2751	7	2023-06-22 13:01:16.986714	2023-06-22 13:01:16.986714	29	92
2752	8	2023-06-22 13:01:17.178291	2023-06-22 13:01:17.178291	29	92
2753	9	2023-06-22 13:01:17.321037	2023-06-22 13:01:17.321037	29	92
2754	1	2023-06-22 13:01:22.688982	2023-06-22 13:01:22.688982	29	92
2755	1	2023-06-22 13:01:22.875332	2023-06-22 13:01:22.875332	29	92
2756	1	2023-06-22 13:01:23.061299	2023-06-22 13:01:23.061299	29	92
2757	1	2023-06-22 13:01:23.235397	2023-06-22 13:01:23.235397	29	92
2758	1	2023-06-22 13:01:23.420113	2023-06-22 13:01:23.420113	29	92
2759	1	2023-06-22 13:01:23.611	2023-06-22 13:01:23.611	29	92
2760	1	2023-06-22 13:01:23.786463	2023-06-22 13:01:23.786463	29	92
2761	1	2023-06-22 13:01:23.97077	2023-06-22 13:01:23.97077	29	92
2762	1	2023-06-22 13:01:24.148278	2023-06-22 13:01:24.148278	29	92
2763	1	2023-06-22 13:01:24.339353	2023-06-22 13:01:24.339353	29	92
2764	1	2023-06-22 13:01:24.532442	2023-06-22 13:01:24.532442	29	92
2765	1	2023-06-22 13:01:24.699029	2023-06-22 13:01:24.699029	29	92
2766	1	2023-06-22 13:01:24.882056	2023-06-22 13:01:24.882056	29	92
2767	1	2023-06-22 13:01:25.067285	2023-06-22 13:01:25.067285	29	92
2768	1	2023-06-22 13:01:25.257627	2023-06-22 13:01:25.257627	29	92
2769	1	2023-06-22 13:01:25.402431	2023-06-22 13:01:25.402431	29	92
2770	2	2023-06-22 13:01:25.595558	2023-06-22 13:01:25.595558	29	92
2771	3	2023-06-22 13:01:26.009952	2023-06-22 13:01:26.009952	29	92
2772	4	2023-06-22 13:01:26.212096	2023-06-22 13:01:26.212096	29	92
1616	0	2023-06-22 01:23:39.356	2023-06-22 01:23:39.356	35	89
1592	1	2023-06-22 01:23:35.327	2023-06-22 01:23:35.327	\N	89
1591	1	2023-06-22 01:23:34.921	2023-06-22 01:23:34.921	\N	89
1630	00	2023-06-22 01:23:41.855	2023-06-22 01:23:41.855	35	\N
2004	2	2023-06-22 02:05:16.486	2023-06-22 02:05:16.486	35	85
2006	3	2023-06-22 02:05:17.79	2023-06-22 02:05:17.79	35	85
1642	4	2023-06-22 01:23:43.926	2023-06-22 01:23:43.926	35	89
1648	8	2023-06-22 01:23:44.984	2023-06-22 01:23:44.984	35	89
2008	4	2023-06-22 02:05:19.12	2023-06-22 02:05:19.12	35	85
2010	5	2023-06-22 02:05:20.48	2023-06-22 02:05:20.48	35	85
2012	6	2023-06-22 02:05:21.826	2023-06-22 02:05:21.826	35	85
2014	7	2023-06-22 02:05:23.092	2023-06-22 02:05:23.092	35	85
2016	8	2023-06-22 02:05:24.328	2023-06-22 02:05:24.328	35	85
2018	9	2023-06-22 02:05:25.655	2023-06-22 02:05:25.655	35	85
2196	0	2023-06-22 02:22:58.639016	2023-06-22 02:22:58.639016	35	85
1680	24	2023-06-22 01:23:51.594	2023-06-22 01:23:51.594	35	89
2190	5	2023-06-22 02:22:50.698	2023-06-22 02:22:50.698	35	\N
1654	1	2023-06-22 01:23:46.077	2023-06-22 01:23:46.077	35	\N
2208	4	2023-06-22 02:23:09.151	2023-06-22 02:23:09.151	35	85
2203	2	2023-06-22 02:23:05.826262	2023-06-22 02:23:05.826262	\N	\N
2218	9	2023-06-22 02:23:16.145	2023-06-22 02:23:16.145	35	85
2213	7	2023-06-22 02:23:14.290873	2023-06-22 02:23:14.290873	\N	\N
2397	2	2023-06-22 03:13:59.046342	2023-06-22 03:13:59.046342	35	89
2448	1	2023-06-22 03:23:59.882119	2023-06-22 03:23:59.882119	35	91
2449	2	2023-06-22 03:24:02.101304	2023-06-22 03:24:02.101304	35	91
2450	3	2023-06-22 03:24:04.456967	2023-06-22 03:24:04.456967	35	91
2451	4	2023-06-22 03:24:06.720141	2023-06-22 03:24:06.720141	35	91
2263	1	2023-06-22 02:28:16.468183	2023-06-22 02:28:16.468183	\N	\N
2269	1	2023-06-22 02:28:29.301411	2023-06-22 02:28:29.301411	35	85
2452	5	2023-06-22 03:24:08.965149	2023-06-22 03:24:08.965149	35	91
2453	6	2023-06-22 03:24:11.365954	2023-06-22 03:24:11.365954	35	91
2454	1	2023-06-22 03:24:18.846929	2023-06-22 03:24:18.846929	35	91
2455	2	2023-06-22 03:24:21.017108	2023-06-22 03:24:21.017108	35	91
2456	3	2023-06-22 03:24:23.151743	2023-06-22 03:24:23.151743	35	91
2457	4	2023-06-22 03:24:25.305989	2023-06-22 03:24:25.305989	35	91
2458	5	2023-06-22 03:24:27.473284	2023-06-22 03:24:27.473284	35	91
2459	6	2023-06-22 03:24:29.674023	2023-06-22 03:24:29.674023	35	91
2460	7	2023-06-22 03:24:31.88097	2023-06-22 03:24:31.88097	35	91
2461	8	2023-06-22 03:24:34.155286	2023-06-22 03:24:34.155286	35	91
2462	9	2023-06-22 03:24:36.402357	2023-06-22 03:24:36.402357	35	91
2320	4	2023-06-22 02:30:44.137858	2023-06-22 02:30:44.137858	\N	85
2323	6	2023-06-22 02:30:44.748891	2023-06-22 02:30:44.748891	\N	\N
2624	3	2023-06-22 03:46:12.875128	2023-06-22 03:46:12.875128	\N	91
2773	Invitation link http://localhost:3006/chat/channel/invitation/93/qwerrt	2023-06-22 13:01:53.93645	2023-06-22 13:01:53.93645	0	93
2774	jrasser has join the room	2023-06-22 13:02:06.25718	2023-06-22 13:02:06.25718	0	93
2775	bla	2023-06-22 13:02:10.886233	2023-06-22 13:02:10.886233	35	93
2776	bli	2023-06-22 13:02:17.526364	2023-06-22 13:02:17.526364	29	93
2777	sdfdsf fsdf	2023-06-22 13:02:20.205917	2023-06-22 13:02:20.205917	35	93
2778	df sd fsddfsf	2023-06-22 13:02:22.643092	2023-06-22 13:02:22.643092	29	93
2779	1	2023-06-22 13:02:24.198099	2023-06-22 13:02:24.198099	29	93
2780	1	2023-06-22 13:02:24.829679	2023-06-22 13:02:24.829679	29	93
2782	1	2023-06-22 13:02:25.88907	2023-06-22 13:02:25.88907	29	93
2786	1	2023-06-22 13:02:27.533874	2023-06-22 13:02:27.533874	29	93
2019	123	2023-06-22 02:05:49.005832	2023-06-22 02:05:49.005832	35	85
2021	456	2023-06-22 02:05:50.354308	2023-06-22 02:05:50.354308	35	85
1632	1	2023-06-22 01:23:42.224202	2023-06-22 01:23:42.224202	\N	\N
2023	789	2023-06-22 02:05:51.738023	2023-06-22 02:05:51.738023	35	85
2025	132	2023-06-22 02:05:53.099112	2023-06-22 02:05:53.099112	35	85
2193	8	2023-06-22 02:22:56.747737	2023-06-22 02:22:56.747737	\N	\N
2199	0	2023-06-22 02:22:58.639	2023-06-22 02:22:58.639	35	\N
2204	3	2023-06-22 02:23:05.834147	2023-06-22 02:23:05.834147	35	\N
1650	10	2023-06-22 01:23:45.955402	2023-06-22 01:23:45.955402	35	\N
1661	17	2023-06-22 01:23:47.723414	2023-06-22 01:23:47.723414	\N	\N
2215	8	2023-06-22 02:23:16.10427	2023-06-22 02:23:16.10427	35	85
2210	6	2023-06-22 02:23:10.987918	2023-06-22 02:23:10.987918	\N	85
2398	5	2023-06-22 03:14:01.257123	2023-06-22 03:14:01.257123	\N	\N
2463	fds fsdf dfds dsf dsdf	2023-06-22 03:24:54.451632	2023-06-22 03:24:54.451632	35	91
2264	1	2023-06-22 02:28:18.992026	2023-06-22 02:28:18.992026	35	85
2625	6	2023-06-22 03:46:13.020349	2023-06-22 03:46:13.020349	\N	91
2324	9	2023-06-22 02:30:45.91592	2023-06-22 02:30:45.91592	\N	\N
2781	1	2023-06-22 13:02:25.303891	2023-06-22 13:02:25.303891	29	93
2784	1	2023-06-22 13:02:26.7522	2023-06-22 13:02:26.7522	29	93
2020	123	2023-06-22 02:05:49.005	2023-06-22 02:05:49.005	35	85
2022	456	2023-06-22 02:05:50.354	2023-06-22 02:05:50.354	35	85
1677	24	2023-06-22 01:23:51.59486	2023-06-22 01:23:51.59486	35	89
2024	789	2023-06-22 02:05:51.738	2023-06-22 02:05:51.738	35	85
2026	132	2023-06-22 02:05:53.099	2023-06-22 02:05:53.099	35	85
2219	1	2023-06-22 02:23:45.510012	2023-06-22 02:23:45.510012	35	85
2226	7	2023-06-22 02:23:50.290207	2023-06-22 02:23:50.290207	\N	85
2399	4	2023-06-22 03:14:01.252159	2023-06-22 03:14:01.252159	35	\N
2464	dfdsfsdf	2023-06-22 03:27:19.765188	2023-06-22 03:27:19.765188	35	91
2265	1	2023-06-22 02:28:21.199304	2023-06-22 02:28:21.199304	\N	\N
2270	1	2023-06-22 02:28:30.940742	2023-06-22 02:28:30.940742	35	85
2326	9	2023-06-22 02:30:46.309412	2023-06-22 02:30:46.309412	35	\N
2626	5	2023-06-22 03:46:13.081821	2023-06-22 03:46:13.081821	\N	91
2783	1	2023-06-22 13:02:26.363026	2023-06-22 13:02:26.363026	29	93
2802	jrasser has left the room	2023-08-10 21:06:12.151682	2023-08-10 21:06:12.151682	0	92
2803	jrasser has left the room	2023-08-10 21:07:46.452695	2023-08-10 21:07:46.452695	0	68
2804	Coralie84 has join the room	2023-08-10 21:09:25.11741	2023-08-10 21:09:25.11741	0	92
2805	jrasser has join the room	2023-08-10 21:09:29.092875	2023-08-10 21:09:29.092875	0	92
2806	cc	2023-08-10 21:09:33.774913	2023-08-10 21:09:33.774913	41	92
\.


--
-- Data for Name: chat_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms (id, type, name, password, "createdAt", "updatedAt", "ownerUserId", "isProtected") FROM stdin;
59	private	Private	\N	2023-06-19 18:25:16.986254	2023-06-19 18:25:16.986254	25	f
61	private	zxcvbnm	\N	2023-06-20 17:01:34.236926	2023-06-20 17:01:34.236926	35	f
62	private	ffffffffffffffffffffffffffffffffffff	\N	2023-06-20 17:04:01.405376	2023-06-20 17:04:01.405376	35	f
63	private	aaaaaaaaaaaa	\N	2023-06-20 17:21:26.200586	2023-06-20 17:21:26.200586	35	f
64	private	bbbbbbbbbb	\N	2023-06-20 17:23:57.178957	2023-06-20 17:23:57.178957	35	f
65	private	ZZZZZZZZZ	\N	2023-06-20 17:29:03.537805	2023-06-20 17:29:03.537805	35	f
66	private	SSSSSSSSSS	\N	2023-06-20 17:30:42.976443	2023-06-20 17:30:42.976443	32	f
67	private	VVVVVVVVVV	\N	2023-06-20 17:32:20.162692	2023-06-20 17:32:20.162692	32	f
68	public	pUBLIC	\N	2023-06-20 17:33:56.901289	2023-06-20 17:33:56.901289	29	f
69	public	DFDFSFDSF	\N	2023-06-20 17:34:05.486055	2023-06-20 17:34:05.486055	29	f
70	private	PPPPPPPPPPPPPPPPPPPPPPP	\N	2023-06-20 17:36:49.039784	2023-06-20 17:36:49.039784	29	f
71	private	qweewqewqeqeqwe	\N	2023-06-20 17:38:02.344744	2023-06-20 17:38:02.344744	29	f
72	private	DDDDDDDDDD	\N	2023-06-20 17:52:38.346196	2023-06-20 17:52:38.346196	29	f
73	private	QWERTYUIO	\N	2023-06-20 17:57:07.401553	2023-06-20 17:57:07.401553	29	f
74	private	vvvvvvv	\N	2023-06-20 18:00:37.153111	2023-06-20 18:00:37.153111	29	f
75	private	sdfffdsf	\N	2023-06-20 18:01:47.390534	2023-06-20 18:01:47.390534	29	f
76	private	EFGEFSDFSDFSFD	\N	2023-06-20 18:02:52.418798	2023-06-20 18:02:52.418798	29	f
77	private	XXXXXXXXXXXXX	\N	2023-06-20 18:38:47.919887	2023-06-20 18:38:47.919887	29	f
78	private	EEEEEEEEEEE	\N	2023-06-20 18:54:41.659866	2023-06-20 18:54:41.659866	35	f
79	private	BLABLA	\N	2023-06-20 20:00:44.341796	2023-06-20 20:00:44.341796	35	f
80	private	mnbvmnm	\N	2023-06-20 20:56:44.738865	2023-06-20 20:56:44.738865	35	f
81	private	bnbnnbbnbnbbbn	\N	2023-06-20 22:27:25.226932	2023-06-20 22:27:25.226932	35	f
82	private	nmnmmnmnmnmn	\N	2023-06-20 22:28:50.702846	2023-06-20 22:28:50.702846	35	f
83	private	ouiiiiiiiiiiiiiiiiiiiiiiiiiii	\N	2023-06-20 22:42:14.955647	2023-06-20 22:42:14.955647	35	f
84	private	sdsaddd	\N	2023-06-21 13:01:38.531192	2023-06-21 13:01:38.531192	35	f
85	public	ttttttttttttttttttttttttttt	\N	2023-06-21 13:45:39.85294	2023-06-21 13:45:39.85294	35	f
86	public	bbbbbbbbbbbbbbb	\N	2023-06-21 15:21:53.312323	2023-06-21 15:21:53.312323	29	f
87	public	TEST	\N	2023-06-21 18:54:02.551546	2023-06-21 18:54:02.551546	35	f
88	public	TEEST	\N	2023-06-21 18:56:56.059136	2023-06-21 18:56:56.059136	35	f
89	public	ddddd	\N	2023-06-22 00:17:21.998039	2023-06-22 00:17:21.998039	35	f
90	public	dddd	\N	2023-06-22 01:26:38.483919	2023-06-22 01:26:38.483919	35	f
91	public	fgdffgddfg	\N	2023-06-22 03:23:29.93113	2023-06-22 03:23:29.93113	35	f
92	public	TESSSSST	\N	2023-06-22 13:00:58.183069	2023-06-22 13:00:58.183069	29	f
93	private	qwerrt	\N	2023-06-22 13:01:53.919976	2023-06-22 13:01:53.919976	29	f
\.


--
-- Data for Name: chat_rooms_accepted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_accepted_users_users ("chatRoomsId", "usersId") FROM stdin;
59	0
61	29
61	0
62	0
62	29
62	32
63	0
64	32
64	29
64	0
65	0
66	0
67	0
65	27
70	25
70	0
71	35
71	25
71	0
72	32
72	25
72	0
73	32
73	25
73	0
74	32
81	0
74	25
74	0
75	25
75	35
75	0
82	0
76	25
76	0
78	0
83	0
83	32
83	25
68	25
84	0
79	0
93	0
80	0
\.


--
-- Data for Name: chat_rooms_admins_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_admins_users ("chatRoomsId", "usersId") FROM stdin;
59	25
61	35
62	35
63	35
64	35
65	35
66	32
67	32
68	29
69	29
70	29
71	29
72	29
73	29
74	29
75	29
76	29
77	29
78	35
79	35
80	35
81	35
82	35
83	35
83	29
84	35
85	35
86	29
87	35
88	35
89	35
90	35
91	35
92	29
93	29
\.


--
-- Data for Name: chat_rooms_banned_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_banned_users_users ("chatRoomsId", "usersId") FROM stdin;
83	32
\.


--
-- Data for Name: chat_rooms_muted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_muted_users_users ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: chat_rooms_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_users_users ("chatRoomsId", "usersId") FROM stdin;
59	25
59	29
61	35
61	32
62	35
63	35
63	29
64	35
63	32
65	35
65	29
65	32
66	32
66	29
66	35
67	32
67	35
67	29
68	29
69	29
69	35
70	29
70	35
70	32
71	29
71	32
72	29
72	35
73	29
73	35
74	29
74	35
75	29
76	29
76	35
76	32
77	29
77	35
77	32
78	35
84	35
84	29
78	29
69	32
79	35
86	32
79	29
79	32
85	35
80	35
84	32
80	29
68	32
65	27
80	27
81	35
81	27
81	32
82	35
82	29
82	32
82	27
83	35
85	29
83	29
87	35
88	35
88	29
86	29
86	35
88	32
89	35
90	35
91	35
91	29
92	29
93	29
93	35
92	41
92	35
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (id, status, "createdAt", "finishAt", "abortedAt", "scorePlayer1", "scorePlayer2", "player1Id", "player2Id", "winnerId", "updatedAt", "eloScorePlayer1", "eloScorePlayer2", "levelPlayer1", "levelPlayer2", "expPlayer1", "expPlayer2") FROM stdin;
150	finished	2023-08-12 16:36:11.647	2023-08-12 16:36:23.417	2023-08-12 16:36:11.648823	2	0	35	29	35	2023-08-12 16:36:12.557	1565	1472	4	2	150	30
151	finished	2023-08-12 16:40:54.712	2023-08-12 16:41:07.844	2023-08-12 16:40:54.714668	2	0	35	29	35	2023-08-12 16:40:56.942	1576	1460	4	2	160	30
140	finished	2023-08-12 14:35:47.728	2023-08-12 14:36:24.512	2023-08-12 14:35:47.734497	0	2	29	35	35	2023-08-12 14:35:50.057	1486	1561	1	3	0	80
141	finished	2023-08-12 14:36:35.788	2023-08-12 14:36:52.357	2023-08-12 14:36:35.790365	0	2	29	35	35	2023-08-12 14:36:38.632	1473	1573	1	3	0	90
142	finished	2023-08-12 15:36:02.082	2023-08-12 15:36:45.799	2023-08-12 15:36:02.090751	2	0	35	29	35	2023-08-12 15:36:29.583	1584	1461	3	1	100	0
143	finished	2023-08-12 16:18:12.352	2023-08-12 16:18:37.388	2023-08-12 16:18:12.354671	1	3	29	35	35	2023-08-12 16:18:13.061	1450	1594	1	3	0	110
144	finished	2023-08-12 16:28:15.035	2023-08-12 16:28:30.591	2023-08-12 16:28:15.037952	0	2	29	35	35	2023-08-12 16:28:16.856	1440	1603	1	4	0	120
145	finished	2023-08-12 16:32:18.964	2023-08-12 16:32:33.465	2023-08-12 16:32:18.969728	0	2	29	35	35	2023-08-12 16:32:19.687	1431	1611	1	4	0	130
146	finished	2023-08-12 16:34:07.877	2023-08-12 16:34:20.76	2023-08-12 16:34:07.879022	2	0	29	35	29	2023-08-12 16:34:09.885	1454	1587	1	4	10	130
147	finished	2023-08-12 16:34:58.349	2023-08-12 16:35:16.157	2023-08-12 16:34:58.351572	0	2	29	35	35	2023-08-12 16:35:02.453	1443	1597	1	4	10	140
148	finished	2023-08-12 16:35:26.543	2023-08-12 16:35:38.22	2023-08-12 16:35:26.545218	2	0	29	35	29	2023-08-12 16:35:27.341	1465	1574	2	4	20	140
149	finished	2023-08-12 16:35:46.782	2023-08-12 16:35:59.406	2023-08-12 16:35:46.783764	2	0	29	35	29	2023-08-12 16:35:48.515	1485	1553	2	4	30	140
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, text, "createdAt", "updatedAt", "ownerUserId", "destUserId") FROM stdin;
18	cc	2023-06-19 18:56:05.483116	2023-06-19 18:56:05.483116	29	25
45	ddddddd	2023-06-21 17:19:40.152572	2023-06-21 17:19:40.152572	32	35
70	dddddd	2023-06-21 19:15:30.096724	2023-06-21 19:15:30.096724	35	29
21	hello	2023-06-20 20:08:12.851693	2023-06-20 20:08:12.851693	27	25
46	ds fsd fds fsdf	2023-06-21 17:20:27.755744	2023-06-21 17:20:27.755744	29	35
22	coucou	2023-06-20 20:08:19.941831	2023-06-20 20:08:19.941831	27	35
23	slt	2023-06-20 20:08:24.685288	2023-06-20 20:08:24.685288	35	27
24	sfsdsfff	2023-06-20 22:23:43.962831	2023-06-20 22:23:43.962831	35	32
47	fdsfds dsf sdfdsf	2023-06-21 17:21:39.921624	2023-06-21 17:21:39.921624	29	35
25	fdsf ds fdfd	2023-06-20 23:42:57.611446	2023-06-20 23:42:57.611446	29	27
26	coucou	2023-06-21 12:45:39.952511	2023-06-21 12:45:39.952511	29	35
85	123456	2023-06-22 20:14:16.05899	2023-06-22 20:14:16.05899	35	29
27	hello	2023-06-21 12:45:46.445151	2023-06-21 12:45:46.445151	35	29
48	ggggg	2023-06-21 17:36:30.877589	2023-06-21 17:36:30.877589	35	29
28	hello	2023-06-21 12:46:49.453502	2023-06-21 12:46:49.453502	32	35
29	blabla	2023-06-21 12:47:06.109077	2023-06-21 12:47:06.109077	35	29
71	ddddd	2023-06-21 19:15:38.415994	2023-06-21 19:15:38.415994	29	35
30	ggggggggggggggg	2023-06-21 12:48:16.766325	2023-06-21 12:48:16.766325	29	27
49	aaaaa	2023-06-21 17:56:35.238213	2023-06-21 17:56:35.238213	29	35
31	fgd fgfd g	2023-06-21 12:48:20.986989	2023-06-21 12:48:20.986989	32	35
32	dfg	2023-06-21 15:40:52.037905	2023-06-21 15:40:52.037905	29	35
33	llllll	2023-06-21 15:43:09.118565	2023-06-21 15:43:09.118565	29	35
50	zxcxvc	2023-06-21 19:06:13.376515	2023-06-21 19:06:13.376515	29	35
34	hello	2023-06-21 17:11:46.706003	2023-06-21 17:11:46.706003	35	29
35	slt	2023-06-21 17:11:52.567608	2023-06-21 17:11:52.567608	32	35
36	slt	2023-06-21 17:11:57.466899	2023-06-21 17:11:57.466899	29	35
51	vvvvv	2023-06-21 19:06:22.09607	2023-06-21 19:06:22.09607	35	32
37	sadsadadasdad	2023-06-21 17:11:59.43404	2023-06-21 17:11:59.43404	35	29
38	dddsdssdsdd	2023-06-21 17:12:02.350204	2023-06-21 17:12:02.350204	32	35
72	aaaa	2023-06-21 19:15:41.209631	2023-06-21 19:15:41.209631	29	35
39	dddd	2023-06-21 17:12:10.1709	2023-06-21 17:12:10.1709	35	32
52	sdfghjkl;'	2023-06-21 19:08:32.144185	2023-06-21 19:08:32.144185	35	32
40	sssss	2023-06-21 17:12:11.118016	2023-06-21 17:12:11.118016	35	32
41	aaaaa	2023-06-21 17:12:12.246114	2023-06-21 17:12:12.246114	35	32
42	ffffff	2023-06-21 17:15:23.676327	2023-06-21 17:15:23.676327	29	35
53	sdfghjkl;'	2023-06-21 19:11:42.45316	2023-06-21 19:11:42.45316	35	29
43	gggg	2023-06-21 17:15:28.112242	2023-06-21 17:15:28.112242	35	29
44	sdfdsffsfsffdfdsf	2023-06-21 17:16:02.613252	2023-06-21 17:16:02.613252	29	35
81	12	2023-06-22 20:14:14.890852	2023-06-22 20:14:14.890852	35	29
54	d	2023-06-21 19:12:58.467047	2023-06-21 19:12:58.467047	35	32
73	dsfsdfs	2023-06-21 19:20:04.789899	2023-06-21 19:20:04.789899	35	32
55	d	2023-06-21 19:12:58.670965	2023-06-21 19:12:58.670965	35	32
56	d	2023-06-21 19:12:58.860613	2023-06-21 19:12:58.860613	35	32
84	12345	2023-06-22 20:14:15.784529	2023-06-22 20:14:15.784529	35	29
57	d	2023-06-21 19:12:59.053504	2023-06-21 19:12:59.053504	35	32
74	cdcdc	2023-06-22 03:54:44.776487	2023-06-22 03:54:44.776487	29	35
58	d	2023-06-21 19:12:59.221404	2023-06-21 19:12:59.221404	35	32
59	d	2023-06-21 19:12:59.411113	2023-06-21 19:12:59.411113	35	32
82	123	2023-06-22 20:14:15.26038	2023-06-22 20:14:15.26038	\N	\N
60	d	2023-06-21 19:12:59.598458	2023-06-21 19:12:59.598458	35	32
75	slt	2023-06-22 13:02:51.846464	2023-06-22 13:02:51.846464	35	29
61	d	2023-06-21 19:12:59.79708	2023-06-21 19:12:59.79708	35	32
62	d	2023-06-21 19:13:00.101517	2023-06-21 19:13:00.101517	35	32
63	asdasdasdassd	2023-06-21 19:15:01.901411	2023-06-21 19:15:01.901411	35	32
76	coucou	2023-06-22 13:02:56.084385	2023-06-22 13:02:56.084385	29	35
64	ddd	2023-06-21 19:15:12.868722	2023-06-21 19:15:12.868722	29	35
65	asdsad asdasd	2023-06-21 19:15:15.098165	2023-06-21 19:15:15.098165	35	29
66	s	2023-06-21 19:15:15.559321	2023-06-21 19:15:15.559321	35	29
77	hello	2023-06-22 20:14:06.6689	2023-06-22 20:14:06.6689	35	29
67	s	2023-06-21 19:15:15.950127	2023-06-21 19:15:15.950127	35	29
68	s	2023-06-21 19:15:16.317616	2023-06-21 19:15:16.317616	35	29
88	wtf	2023-06-22 20:14:24.745511	2023-06-22 20:14:24.745511	35	29
69	s	2023-06-21 19:15:16.517974	2023-06-21 19:15:16.517974	35	29
78	coucou	2023-06-22 20:14:09.49411	2023-06-22 20:14:09.49411	29	35
79	lablablsba	2023-06-22 20:14:12.366904	2023-06-22 20:14:12.366904	35	29
89	1	2023-06-22 20:14:26.386079	2023-06-22 20:14:26.386079	35	29
90	2	2023-06-22 20:14:26.604007	2023-06-22 20:14:26.604007	35	29
91	3	2023-06-22 20:14:26.819018	2023-06-22 20:14:26.819018	35	29
92	4	2023-06-22 20:14:27.062579	2023-06-22 20:14:27.062579	35	29
83	1234	2023-06-22 20:14:15.51784	2023-06-22 20:14:15.51784	\N	\N
93	5	2023-06-22 20:14:27.283103	2023-06-22 20:14:27.283103	35	29
86	8	2023-06-22 20:14:16.43996	2023-06-22 20:14:16.43996	\N	\N
87	89	2023-06-22 20:14:16.49792	2023-06-22 20:14:16.49792	35	\N
80	1	2023-06-22 20:14:14.597877	2023-06-22 20:14:14.597877	35	29
94	6	2023-06-22 20:14:27.504703	2023-06-22 20:14:27.504703	35	29
95	7	2023-06-22 20:14:27.736481	2023-06-22 20:14:27.736481	35	29
96	8	2023-06-22 20:14:27.951826	2023-06-22 20:14:27.951826	35	29
97	9	2023-06-22 20:14:28.145489	2023-06-22 20:14:28.145489	35	29
98	Invitation Game http://localhost:3006/game?id=7	2023-06-22 20:52:11.295058	2023-06-22 20:52:11.295058	29	35
99	Invitation Game http://localhost:3006/game?id=8	2023-06-22 20:52:27.45324	2023-06-22 20:52:27.45324	29	35
100	Invitation Game http://localhost:3006/game?id=9	2023-06-22 20:53:30.109479	2023-06-22 20:53:30.109479	29	35
101	Invitation Game http://localhost:3006/game?id=10	2023-06-22 20:53:59.796199	2023-06-22 20:53:59.796199	35	29
102	Invitation Game http://localhost:3006/game?id=11	2023-06-22 20:56:21.057097	2023-06-22 20:56:21.057097	35	32
103	Invitation Game http://localhost:3006/game?id=12	2023-06-22 20:56:23.629035	2023-06-22 20:56:23.629035	35	29
104	Invitation Game http://localhost:3006/game?id=13	2023-06-22 20:58:25.472029	2023-06-22 20:58:25.472029	35	29
105	Invitation Game http://localhost:3006/game?id=14	2023-06-22 20:59:34.883261	2023-06-22 20:59:34.883261	35	29
106	Invitation Game http://localhost:3006/game?id=15	2023-06-22 21:00:29.740726	2023-06-22 21:00:29.740726	35	29
107	Invitation Game http://localhost:3006/game?id=17	2023-06-22 22:16:55.682296	2023-06-22 22:16:55.682296	29	35
108	Invitation Game http://localhost:3006/game?id=19	2023-06-22 22:18:01.69544	2023-06-22 22:18:01.69544	29	35
109	Invitation Game http://localhost:3006/game?id=21	2023-06-22 22:28:39.003209	2023-06-22 22:28:39.003209	35	32
110	Invitation Game http://localhost:3006/game?id=23	2023-06-22 22:32:56.032606	2023-06-22 22:32:56.032606	35	29
111	Invitation Game http://localhost:3006/game?id=24	2023-06-22 22:51:02.544146	2023-06-22 22:51:02.544146	35	29
112	Invitation Game http://localhost:3006/game?id=25	2023-06-22 22:52:25.765296	2023-06-22 22:52:25.765296	35	29
113	Invitation Game http://localhost:3006/game?id=26	2023-06-22 22:53:36.259351	2023-06-22 22:53:36.259351	29	35
114	Invitation Game http://localhost:3006/game?id=27	2023-06-22 22:55:34.719668	2023-06-22 22:55:34.719668	35	29
115	Invitation Game http://localhost:3006/game?id=34	2023-06-23 00:55:19.958518	2023-06-23 00:55:19.958518	29	35
116	Invitation Game http://localhost:3006/game?id=35	2023-06-23 01:11:23.859677	2023-06-23 01:11:23.859677	35	29
117	Invitation Game http://localhost:3006/game?id=36	2023-06-23 01:15:18.316233	2023-06-23 01:15:18.316233	35	29
118	Invitation Game http://localhost:3006/game?id=37	2023-06-23 01:15:22.088874	2023-06-23 01:15:22.088874	35	29
119	Invitation Game http://localhost:3006/game?id=38	2023-06-23 01:15:38.902136	2023-06-23 01:15:38.902136	29	35
120	Invitation Game http://localhost:3006/game?id=39	2023-06-23 01:16:37.558211	2023-06-23 01:16:37.558211	35	29
121	Invitation Game http://localhost:3006/game?id=40	2023-06-23 01:28:42.065845	2023-06-23 01:28:42.065845	35	29
122	Invitation Game http://localhost:3006/game?id=41	2023-06-23 01:33:57.21287	2023-06-23 01:33:57.21287	29	35
123	Invitation Game http://localhost:3006/game?id=55	2023-06-23 02:11:51.46356	2023-06-23 02:11:51.46356	35	32
124	jhvjvj,vjhv	2023-06-23 02:13:48.029954	2023-06-23 02:13:48.029954	32	35
125	,jhv,jgv,jghcv	2023-06-23 02:13:57.647837	2023-06-23 02:13:57.647837	35	32
126	Invitation Game http://localhost:3006/game?id=57	2023-06-23 02:19:01.556724	2023-06-23 02:19:01.556724	35	27
127	Invitation Game http://localhost:3006/game?id=58	2023-06-23 02:19:09.943183	2023-06-23 02:19:09.943183	35	32
156	ddd	2023-08-10 21:10:10.64967	2023-08-10 21:10:10.64967	41	35
128	cc	2023-08-10 20:50:18.963253	2023-08-10 20:50:18.963253	41	35
129	hi	2023-08-10 20:50:25.122622	2023-08-10 20:50:25.122622	35	41
247	ok	2023-08-11 23:42:19.815912	2023-08-11 23:42:19.815912	35	41
130	bli	2023-08-10 20:50:28.542999	2023-08-10 20:50:28.542999	35	41
157	cc	2023-08-10 21:31:05.272888	2023-08-10 21:31:05.272888	35	37
131	bla	2023-08-10 20:50:31.538583	2023-08-10 20:50:31.538583	41	35
132	bli	2023-08-10 20:51:39.824916	2023-08-10 20:51:39.824916	41	35
133	sadsad	2023-08-10 20:51:50.160405	2023-08-10 20:51:50.160405	41	35
158	zdxfcghvjkl;	2023-08-10 21:38:59.484383	2023-08-10 21:38:59.484383	41	35
134	wtf	2023-08-10 20:51:58.407363	2023-08-10 20:51:58.407363	35	41
135	hgc	2023-08-10 20:54:56.738397	2023-08-10 20:54:56.738397	41	35
136	dd	2023-08-10 21:08:25.692729	2023-08-10 21:08:25.692729	41	35
159	et bah	2023-08-10 21:40:21.694681	2023-08-10 21:40:21.694681	35	41
137	a	2023-08-10 21:08:30.489724	2023-08-10 21:08:30.489724	35	41
138	b	2023-08-10 21:08:30.763449	2023-08-10 21:08:30.763449	35	41
248	blabla	2023-08-11 23:42:24.409213	2023-08-11 23:42:24.409213	35	41
139	c	2023-08-10 21:08:30.995411	2023-08-10 21:08:30.995411	35	41
160	quoi?	2023-08-10 21:40:24.746668	2023-08-10 21:40:24.746668	41	35
140	d	2023-08-10 21:08:31.211962	2023-08-10 21:08:31.211962	35	41
141	e	2023-08-10 21:08:31.443731	2023-08-10 21:08:31.443731	35	41
142	r	2023-08-10 21:08:31.659729	2023-08-10 21:08:31.659729	35	41
161	rien	2023-08-10 21:40:29.738469	2023-08-10 21:40:29.738469	41	35
143	sf	2023-08-10 21:08:31.914574	2023-08-10 21:08:31.914574	35	41
144	dfds	2023-08-10 21:08:32.107333	2023-08-10 21:08:32.107333	35	41
145	fsd	2023-08-10 21:08:32.251098	2023-08-10 21:08:32.251098	35	41
249	1	2023-08-11 23:42:27.613037	2023-08-11 23:42:27.613037	35	41
146	fsdfsd	2023-08-10 21:08:32.478975	2023-08-10 21:08:32.478975	35	41
147	dsf	2023-08-10 21:08:32.713401	2023-08-10 21:08:32.713401	35	41
148	fsdf	2023-08-10 21:08:32.908005	2023-08-10 21:08:32.908005	35	41
250	2	2023-08-11 23:42:29.681147	2023-08-11 23:42:29.681147	35	41
149	sdfsddf	2023-08-10 21:08:36.729964	2023-08-10 21:08:36.729964	41	35
150	sdf	2023-08-10 21:09:49.932104	2023-08-10 21:09:49.932104	41	35
151	ddddddd	2023-08-10 21:09:52.550789	2023-08-10 21:09:52.550789	41	35
251	3	2023-08-11 23:42:31.722412	2023-08-11 23:42:31.722412	35	41
152	sssssss	2023-08-10 21:09:54.4796	2023-08-10 21:09:54.4796	41	35
153	dasdasdadads	2023-08-10 21:09:58.328851	2023-08-10 21:09:58.328851	35	41
154	dddd	2023-08-10 21:09:59.883995	2023-08-10 21:09:59.883995	35	41
252	4	2023-08-11 23:42:33.765999	2023-08-11 23:42:33.765999	35	41
155	ssss	2023-08-10 21:10:06.95442	2023-08-10 21:10:06.95442	41	35
253	5	2023-08-11 23:42:35.831153	2023-08-11 23:42:35.831153	35	41
254	6	2023-08-11 23:42:37.870508	2023-08-11 23:42:37.870508	35	41
255	7	2023-08-11 23:42:39.931105	2023-08-11 23:42:39.931105	35	41
256	8	2023-08-11 23:42:41.98565	2023-08-11 23:42:41.98565	35	41
257	9	2023-08-11 23:42:44.025814	2023-08-11 23:42:44.025814	35	41
258	10	2023-08-11 23:42:46.060409	2023-08-11 23:42:46.060409	35	41
259	http://localhost:3006/game?id=140	2023-08-12 14:35:47.73998	2023-08-12 14:35:47.73998	29	35
162	sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd sdsad sdasd sad adsa dasda ds d da da sdsad ad asdsd daddasd 	2023-08-10 21:40:36.45621	2023-08-10 21:40:36.45621	41	35
163	hi	2023-08-10 21:41:12.593777	2023-08-10 21:41:12.593777	37	35
164	http://localhost:3006/game?id=61	2023-08-10 21:43:16.611579	2023-08-10 21:43:16.611579	41	35
165	check ca www.google.fr	2023-08-10 21:44:16.741122	2023-08-10 21:44:16.741122	41	35
194	dfghjkl;'	2023-08-10 23:41:32.041667	2023-08-10 23:41:32.041667	35	42
166	http://google.fr	2023-08-10 21:44:25.373554	2023-08-10 21:44:25.373554	41	35
167	http://google.fr	2023-08-10 21:46:26.4501	2023-08-10 21:46:26.4501	35	41
168	https://google.fr	2023-08-10 21:46:32.636908	2023-08-10 21:46:32.636908	35	41
195	fghjk	2023-08-10 23:41:35.771468	2023-08-10 23:41:35.771468	42	35
169	:test	2023-08-10 21:46:52.650902	2023-08-10 21:46:52.650902	35	41
170	://test	2023-08-10 21:47:06.678944	2023-08-10 21:47:06.678944	35	41
211	lll	2023-08-11 00:12:33.379882	2023-08-11 00:12:33.379882	42	35
171	://test.fr	2023-08-10 21:47:17.410611	2023-08-10 21:47:17.410611	35	41
172	http://localhost:3006/game?id=62	2023-08-10 21:50:20.622925	2023-08-10 21:50:20.622925	41	35
196	cc	2023-08-10 23:41:58.391702	2023-08-10 23:41:58.391702	42	35
173	sdfdsf	2023-08-10 22:01:24.48325	2023-08-10 22:01:24.48325	41	35
174	http://localhost:3006/game?id=63	2023-08-10 22:01:30.456138	2023-08-10 22:01:30.456138	35	41
175	http://localhost:3006/game?id=64	2023-08-10 22:01:34.096655	2023-08-10 22:01:34.096655	41	35
176	sdasd	2023-08-10 22:40:50.404716	2023-08-10 22:40:50.404716	35	29
177	sadsad	2023-08-10 22:42:53.900659	2023-08-10 22:42:53.900659	35	41
197	sdfghjkl;'	2023-08-10 23:57:32.175752	2023-08-10 23:57:32.175752	42	35
178	beuh	2023-08-10 22:44:16.670712	2023-08-10 22:44:16.670712	41	35
179	ytre	2023-08-10 22:51:32.439772	2023-08-10 22:51:32.439772	42	35
221	f	2023-08-11 00:28:58.686781	2023-08-11 00:28:58.686781	42	35
180	cc	2023-08-10 22:51:38.133185	2023-08-10 22:51:38.133185	35	42
198	l;'	2023-08-10 23:57:36.715671	2023-08-10 23:57:36.715671	42	35
181	ca v ?	2023-08-10 22:51:41.920443	2023-08-10 22:51:41.920443	42	35
182	et toi ?	2023-08-10 22:52:03.611132	2023-08-10 22:52:03.611132	35	42
212	cc	2023-08-11 00:12:52.781739	2023-08-11 00:12:52.781739	35	42
183	bien	2023-08-10 22:52:07.889326	2023-08-10 22:52:07.889326	42	35
199	1	2023-08-10 23:57:47.611486	2023-08-10 23:57:47.611486	42	35
184	cc	2023-08-10 22:53:03.502801	2023-08-10 22:53:03.502801	35	42
185	dd	2023-08-10 22:53:05.702176	2023-08-10 22:53:05.702176	42	35
186	sdfsdf	2023-08-10 22:53:09.200758	2023-08-10 22:53:09.200758	42	35
200	2	2023-08-10 23:57:47.861597	2023-08-10 23:57:47.861597	42	35
187	asdfghj	2023-08-10 22:53:37.217576	2023-08-10 22:53:37.217576	35	42
188	zxcvbnm,.'	2023-08-10 22:53:40.07642	2023-08-10 22:53:40.07642	35	37
189	ggghh	2023-08-10 22:53:43.404222	2023-08-10 22:53:43.404222	42	35
201	3	2023-08-10 23:57:48.082952	2023-08-10 23:57:48.082952	42	35
190	fgdg	2023-08-10 22:53:49.417756	2023-08-10 22:53:49.417756	35	42
191	adsfdnhjk	2023-08-10 22:53:52.262154	2023-08-10 22:53:52.262154	42	35
213	ok	2023-08-11 00:12:56.339123	2023-08-11 00:12:56.339123	42	35
192	dfghjkl	2023-08-10 23:32:11.913757	2023-08-10 23:32:11.913757	42	35
202	4	2023-08-10 23:57:48.364442	2023-08-10 23:57:48.364442	42	35
193	fghjkl;'	2023-08-10 23:32:50.797287	2023-08-10 23:32:50.797287	42	35
203	5	2023-08-10 23:57:48.599115	2023-08-10 23:57:48.599115	42	35
227	gggg	2023-08-11 00:29:02.666671	2023-08-11 00:29:02.666671	35	42
204	6	2023-08-10 23:57:48.840804	2023-08-10 23:57:48.840804	42	35
214	mouahaaha	2023-08-11 00:13:05.811478	2023-08-11 00:13:05.811478	35	42
205	7	2023-08-10 23:57:49.106598	2023-08-10 23:57:49.106598	42	35
206	8	2023-08-10 23:57:49.435574	2023-08-10 23:57:49.435574	42	35
222	ff	2023-08-11 00:28:58.916429	2023-08-11 00:28:58.916429	42	35
207	9	2023-08-10 23:57:49.73151	2023-08-10 23:57:49.73151	42	35
215	nice	2023-08-11 00:13:18.517317	2023-08-11 00:13:18.517317	42	35
208	kjhgfds	2023-08-10 23:59:54.928814	2023-08-10 23:59:54.928814	35	42
209	ghjhgjgj	2023-08-11 00:00:00.843578	2023-08-11 00:00:00.843578	42	35
210	jjjjjj	2023-08-11 00:00:03.946507	2023-08-11 00:00:03.946507	42	35
216	djk	2023-08-11 00:28:33.988793	2023-08-11 00:28:33.988793	35	42
217	ert	2023-08-11 00:28:51.919431	2023-08-11 00:28:51.919431	35	42
223	f	2023-08-11 00:28:59.158176	2023-08-11 00:28:59.158176	42	35
218	dgdfggfg	2023-08-11 00:28:57.166476	2023-08-11 00:28:57.166476	42	35
219	fff	2023-08-11 00:28:58.11078	2023-08-11 00:28:58.11078	42	35
234	f	2023-08-11 00:34:36.434338	2023-08-11 00:34:36.434338	42	35
220	ff	2023-08-11 00:28:58.446425	2023-08-11 00:28:58.446425	42	35
224	f	2023-08-11 00:28:59.39732	2023-08-11 00:28:59.39732	42	35
228	ffff	2023-08-11 00:29:03.672108	2023-08-11 00:29:03.672108	35	42
225	f	2023-08-11 00:28:59.682644	2023-08-11 00:28:59.682644	42	35
226	ff	2023-08-11 00:28:59.955574	2023-08-11 00:28:59.955574	42	35
231	fghjkl;'	2023-08-11 00:34:28.277823	2023-08-11 00:34:28.277823	35	42
229	cc	2023-08-11 00:33:10.956108	2023-08-11 00:33:10.956108	35	37
230	sfsdf	2023-08-11 00:33:13.350893	2023-08-11 00:33:13.350893	42	35
233	f	2023-08-11 00:34:36.172046	2023-08-11 00:34:36.172046	42	35
232	ghjkl;'	2023-08-11 00:34:32.335212	2023-08-11 00:34:32.335212	42	35
235	f	2023-08-11 00:34:36.715371	2023-08-11 00:34:36.715371	42	35
236	f	2023-08-11 00:34:36.985236	2023-08-11 00:34:36.985236	42	35
237	f	2023-08-11 00:34:37.249713	2023-08-11 00:34:37.249713	42	35
238	f	2023-08-11 00:34:37.512116	2023-08-11 00:34:37.512116	42	35
239	f	2023-08-11 00:34:37.785117	2023-08-11 00:34:37.785117	42	35
240	f	2023-08-11 00:34:38.05839	2023-08-11 00:34:38.05839	42	35
241	dfghjkl;'	2023-08-11 00:34:58.155026	2023-08-11 00:34:58.155026	42	35
243	wtf	2023-08-11 21:39:43.812139	2023-08-11 21:39:43.812139	41	35
244	slt	2023-08-11 22:09:48.469693	2023-08-11 22:09:48.469693	37	35
245	hi	2023-08-11 23:42:07.989701	2023-08-11 23:42:07.989701	35	41
246	hey	2023-08-11 23:42:16.245317	2023-08-11 23:42:16.245317	35	41
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, content, read, "createdAt", "updatedAt", "senderId", "receiverId", "invitationLink") FROM stdin;
189	friendRequest	send you a friend request	f	2023-06-19 18:24:45.516455	2023-06-19 18:24:45.516455	25	26	\N
191	friendRequest	send you a friend request	f	2023-06-19 18:24:46.115453	2023-06-19 18:24:46.115453	25	28	\N
193	friendRequest	send you a friend request	f	2023-06-19 18:24:46.427762	2023-06-19 18:24:46.427762	25	30	\N
194	friendRequest	send you a friend request	f	2023-06-19 18:24:46.73162	2023-06-19 18:24:46.73162	25	31	\N
196	friendRequest	send you a friend request	f	2023-06-19 18:24:47.015554	2023-06-19 18:24:47.015554	25	33	\N
197	friendRequest	send you a friend request	f	2023-06-19 18:24:47.15575	2023-06-19 18:24:47.15575	25	34	\N
200	roomInvite	you have been invited to join the room Private	f	2023-06-19 18:25:17.022183	2023-06-19 18:25:17.022183	25	0	/chat/channel/invitation/59/Private
192	friendRequest	send you a friend request	t	2023-06-19 18:24:46.268831	2023-06-19 18:24:46.268831	25	29	\N
211	friendRequestAccepted	accepted your friend request	t	2023-06-19 18:26:57.846307	2023-06-19 18:26:57.846307	29	25	\N
190	friendRequest	send you a friend request	t	2023-06-19 18:24:45.81322	2023-06-19 18:24:45.81322	25	27	\N
213	friendRequestAccepted	accepted your friend request	t	2023-06-19 19:05:18.029236	2023-06-19 19:05:18.029236	27	25	\N
223	friendRequest	send you a friend request	f	2023-06-20 16:24:58.043966	2023-06-20 16:24:58.043966	35	26	\N
224	friendRequest	send you a friend request	f	2023-06-20 16:24:58.324595	2023-06-20 16:24:58.324595	35	28	\N
225	friendRequest	send you a friend request	f	2023-06-20 16:24:58.715094	2023-06-20 16:24:58.715094	35	30	\N
226	friendRequest	send you a friend request	f	2023-06-20 16:24:58.992385	2023-06-20 16:24:58.992385	35	31	\N
228	friendRequest	send you a friend request	f	2023-06-20 16:24:59.771417	2023-06-20 16:24:59.771417	35	33	\N
229	friendRequest	send you a friend request	f	2023-06-20 16:25:00.131007	2023-06-20 16:25:00.131007	35	34	\N
232	friendRequest	send you a friend request	f	2023-06-20 16:25:01.083845	2023-06-20 16:25:01.083845	35	25	\N
231	friendRequest	send you a friend request	t	2023-06-20 16:25:00.768553	2023-06-20 16:25:00.768553	35	29	\N
233	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:37:29.102957	2023-06-20 16:37:29.102957	29	35	\N
227	friendRequest	send you a friend request	t	2023-06-20 16:24:59.317435	2023-06-20 16:24:59.317435	35	32	\N
195	friendRequest	send you a friend request	t	2023-06-19 18:24:46.875216	2023-06-19 18:24:46.875216	25	32	\N
234	friendRequestDeclined	declined your friend request	t	2023-06-20 16:43:07.509191	2023-06-20 16:43:07.509191	32	35	\N
235	friendRequestDeclined	declined your friend request	t	2023-06-20 16:43:08.106337	2023-06-20 16:43:08.106337	32	25	\N
238	friendRequest	send you a friend request	f	2023-06-20 16:43:28.020239	2023-06-20 16:43:28.020239	29	33	\N
239	friendRequest	send you a friend request	f	2023-06-20 16:43:28.348118	2023-06-20 16:43:28.348118	29	31	\N
240	friendRequest	send you a friend request	f	2023-06-20 16:43:28.695015	2023-06-20 16:43:28.695015	29	30	\N
241	friendRequest	send you a friend request	f	2023-06-20 16:43:29.628212	2023-06-20 16:43:29.628212	29	28	\N
242	friendRequest	send you a friend request	f	2023-06-20 16:43:30.115286	2023-06-20 16:43:30.115286	29	34	\N
244	friendRequest	send you a friend request	f	2023-06-20 16:43:36.835126	2023-06-20 16:43:36.835126	29	26	\N
237	friendRequest	send you a friend request	t	2023-06-20 16:43:27.308176	2023-06-20 16:43:27.308176	29	32	\N
245	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:43:43.292509	2023-06-20 16:43:43.292509	32	29	\N
236	friendRequest	send you a friend request	t	2023-06-20 16:43:20.133492	2023-06-20 16:43:20.133492	35	32	\N
246	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:43:51.806306	2023-06-20 16:43:51.806306	32	35	\N
247	friendDeleted	deleted you from his friend list	t	2023-06-20 16:47:32.409781	2023-06-20 16:47:32.409781	35	32	\N
249	friendDeleted	deleted you from his friend list	t	2023-06-20 16:47:50.051553	2023-06-20 16:47:50.051553	29	32	\N
248	friendRequest	send you a friend request	t	2023-06-20 16:47:34.57109	2023-06-20 16:47:34.57109	35	32	\N
251	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:47:56.938518	2023-06-20 16:47:56.938518	32	35	\N
252	friendRequestDeclined	declined your friend request	t	2023-06-20 16:49:21.710774	2023-06-20 16:49:21.710774	32	29	\N
253	friendDeleted	deleted you from his friend list	t	2023-06-20 16:49:31.531363	2023-06-20 16:49:31.531363	35	32	\N
254	friendRequest	send you a friend request	t	2023-06-20 16:49:32.988087	2023-06-20 16:49:32.988087	29	32	\N
256	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:49:38.197579	2023-06-20 16:49:38.197579	32	29	\N
255	friendRequest	send you a friend request	t	2023-06-20 16:49:35.900449	2023-06-20 16:49:35.900449	35	32	\N
250	friendRequest	send you a friend request	t	2023-06-20 16:47:52.905693	2023-06-20 16:47:52.905693	29	32	\N
257	friendRequestDeclined	declined your friend request	t	2023-06-20 16:51:59.911239	2023-06-20 16:51:59.911239	32	35	\N
259	friendDeleted	deleted you from his friend list	t	2023-06-20 16:52:08.268148	2023-06-20 16:52:08.268148	29	32	\N
258	friendRequest	send you a friend request	t	2023-06-20 16:52:05.098713	2023-06-20 16:52:05.098713	35	32	\N
260	friendRequest	send you a friend request	t	2023-06-20 16:52:10.299267	2023-06-20 16:52:10.299267	29	32	\N
261	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:52:14.839657	2023-06-20 16:52:14.839657	32	35	\N
262	friendRequestDeclined	declined your friend request	t	2023-06-20 16:53:25.393609	2023-06-20 16:53:25.393609	32	29	\N
263	friendDeleted	deleted you from his friend list	t	2023-06-20 16:53:29.154885	2023-06-20 16:53:29.154885	35	32	\N
264	friendRequest	send you a friend request	t	2023-06-20 16:53:30.515225	2023-06-20 16:53:30.515225	29	32	\N
265	friendRequest	send you a friend request	t	2023-06-20 16:53:33.883684	2023-06-20 16:53:33.883684	35	32	\N
266	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:53:39.837562	2023-06-20 16:53:39.837562	32	29	\N
267	friendDeleted	deleted you from his friend list	t	2023-06-20 16:54:32.332111	2023-06-20 16:54:32.332111	35	29	\N
268	friendDeleted	deleted you from his friend list	t	2023-06-20 16:54:34.467755	2023-06-20 16:54:34.467755	29	32	\N
269	friendRequest	send you a friend request	t	2023-06-20 16:54:37.493759	2023-06-20 16:54:37.493759	35	29	\N
271	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:54:45.073028	2023-06-20 16:54:45.073028	29	35	\N
272	friendRequestCanceled	Canceled your friend request	t	2023-06-20 16:55:12.031515	2023-06-20 16:55:12.031515	35	32	\N
270	friendRequest	send you a friend request	t	2023-06-20 16:54:39.285983	2023-06-20 16:54:39.285983	29	32	\N
243	friendRequest	send you a friend request	t	2023-06-20 16:43:30.537035	2023-06-20 16:43:30.537035	29	27	\N
230	friendRequest	send you a friend request	t	2023-06-20 16:25:00.46186	2023-06-20 16:25:00.46186	35	27	\N
273	friendRequestCanceled	Canceled your friend request	t	2023-06-20 16:55:14.855046	2023-06-20 16:55:14.855046	29	32	\N
274	friendRequest	send you a friend request	t	2023-06-20 16:55:28.664494	2023-06-20 16:55:28.664494	35	32	\N
276	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:55:52.804008	2023-06-20 16:55:52.804008	32	35	\N
275	friendRequest	send you a friend request	t	2023-06-20 16:55:30.44583	2023-06-20 16:55:30.44583	29	32	\N
277	friendDeleted	deleted you from his friend list	t	2023-06-20 16:57:26.482135	2023-06-20 16:57:26.482135	35	32	\N
278	friendRequestCanceled	Canceled your friend request	t	2023-06-20 16:57:31.300468	2023-06-20 16:57:31.300468	29	32	\N
280	friendRequest	send you a friend request	t	2023-06-20 16:57:36.618952	2023-06-20 16:57:36.618952	35	32	\N
279	friendRequest	send you a friend request	t	2023-06-20 16:57:35.506456	2023-06-20 16:57:35.506456	29	32	\N
281	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:57:45.035806	2023-06-20 16:57:45.035806	32	29	\N
282	friendRequestAccepted	accepted your friend request	t	2023-06-20 16:57:47.022985	2023-06-20 16:57:47.022985	32	35	\N
285	roomInvite	you have been invited to join the room zxcvbnm	f	2023-06-20 17:01:34.282924	2023-06-20 17:01:34.282924	35	0	/chat/channel/invitation/61/zxcvbnm
284	roomInvite	you have been invited to join the room zxcvbnm	t	2023-06-20 17:01:34.279011	2023-06-20 17:01:34.279011	35	29	/chat/channel/invitation/61/zxcvbnm
286	friendDeleted	deleted you from his friend list	t	2023-06-20 17:01:48.219603	2023-06-20 17:01:48.219603	32	29	\N
287	friendRequest	send you a friend request	t	2023-06-20 17:01:50.749528	2023-06-20 17:01:50.749528	32	29	\N
283	roomInvite	you have been invited to join the room zxcvbnm	t	2023-06-20 17:01:34.274343	2023-06-20 17:01:34.274343	35	32	/chat/channel/invitation/61/zxcvbnm
288	friendRequestAccepted	accepted your friend request	t	2023-06-20 17:02:44.999606	2023-06-20 17:02:44.999606	29	32	\N
291	roomInvite	you have been invited to join the room ffffffffffffffffffffffffffffffffffff	f	2023-06-20 17:04:01.442285	2023-06-20 17:04:01.442285	35	0	/chat/channel/invitation/62/ffffffffffffffffffffffffffffffffffff
290	roomInvite	you have been invited to join the room ffffffffffffffffffffffffffffffffffff	t	2023-06-20 17:04:01.438927	2023-06-20 17:04:01.438927	35	29	/chat/channel/invitation/62/ffffffffffffffffffffffffffffffffffff
289	roomInvite	you have been invited to join the room ffffffffffffffffffffffffffffffffffff	t	2023-06-20 17:04:01.435265	2023-06-20 17:04:01.435265	35	32	/chat/channel/invitation/62/ffffffffffffffffffffffffffffffffffff
294	roomInvite	you have been invited to join the room aaaaaaaaaaaa	f	2023-06-20 17:21:26.237862	2023-06-20 17:21:26.237862	35	0	/chat/channel/invitation/63/aaaaaaaaaaaa
293	roomInvite	you have been invited to join the room aaaaaaaaaaaa	t	2023-06-20 17:21:26.235323	2023-06-20 17:21:26.235323	35	29	/chat/channel/invitation/63/aaaaaaaaaaaa
297	roomInvite	you have been invited to join the room bbbbbbbbbb	f	2023-06-20 17:23:57.394835	2023-06-20 17:23:57.394835	35	0	/chat/channel/invitation/64/bbbbbbbbbb
296	roomInvite	you have been invited to join the room bbbbbbbbbb	t	2023-06-20 17:23:57.376777	2023-06-20 17:23:57.376777	35	29	/chat/channel/invitation/64/bbbbbbbbbb
292	roomInvite	you have been invited to join the room aaaaaaaaaaaa	t	2023-06-20 17:21:26.232514	2023-06-20 17:21:26.232514	35	32	/chat/channel/invitation/63/aaaaaaaaaaaa
295	roomInvite	you have been invited to join the room bbbbbbbbbb	t	2023-06-20 17:23:57.357738	2023-06-20 17:23:57.357738	35	32	/chat/channel/invitation/64/bbbbbbbbbb
300	roomInvite	you have been invited to join the room ZZZZZZZZZ	f	2023-06-20 17:29:03.59115	2023-06-20 17:29:03.59115	35	0	/chat/channel/invitation/65/ZZZZZZZZZ
299	roomInvite	you have been invited to join the room ZZZZZZZZZ	t	2023-06-20 17:29:03.588379	2023-06-20 17:29:03.588379	35	29	/chat/channel/invitation/65/ZZZZZZZZZ
298	roomInvite	you have been invited to join the room ZZZZZZZZZ	t	2023-06-20 17:29:03.585393	2023-06-20 17:29:03.585393	35	32	/chat/channel/invitation/65/ZZZZZZZZZ
303	roomInvite	you have been invited to join the room SSSSSSSSSS	f	2023-06-20 17:30:43.017322	2023-06-20 17:30:43.017322	32	0	/chat/channel/invitation/66/SSSSSSSSSS
302	roomInvite	you have been invited to join the room SSSSSSSSSS	t	2023-06-20 17:30:43.014619	2023-06-20 17:30:43.014619	32	29	/chat/channel/invitation/66/SSSSSSSSSS
301	roomInvite	you have been invited to join the room SSSSSSSSSS	t	2023-06-20 17:30:43.011781	2023-06-20 17:30:43.011781	32	35	/chat/channel/invitation/66/SSSSSSSSSS
306	roomInvite	you have been invited to join the room VVVVVVVVVV	f	2023-06-20 17:32:20.201693	2023-06-20 17:32:20.201693	32	0	/chat/channel/invitation/67/VVVVVVVVVV
304	roomInvite	you have been invited to join the room VVVVVVVVVV	t	2023-06-20 17:32:20.196218	2023-06-20 17:32:20.196218	32	35	/chat/channel/invitation/67/VVVVVVVVVV
305	roomInvite	you have been invited to join the room VVVVVVVVVV	t	2023-06-20 17:32:20.198882	2023-06-20 17:32:20.198882	32	29	/chat/channel/invitation/67/VVVVVVVVVV
309	roomInvite	you have been invited to join the room PPPPPPPPPPPPPPPPPPPPPPP	f	2023-06-20 17:36:49.085345	2023-06-20 17:36:49.085345	29	25	/chat/channel/invitation/70/PPPPPPPPPPPPPPPPPPPPPPP
310	roomInvite	you have been invited to join the room PPPPPPPPPPPPPPPPPPPPPPP	f	2023-06-20 17:36:49.090516	2023-06-20 17:36:49.090516	29	0	/chat/channel/invitation/70/PPPPPPPPPPPPPPPPPPPPPPP
308	roomInvite	you have been invited to join the room PPPPPPPPPPPPPPPPPPPPPPP	t	2023-06-20 17:36:49.082686	2023-06-20 17:36:49.082686	29	35	/chat/channel/invitation/70/PPPPPPPPPPPPPPPPPPPPPPP
307	roomInvite	you have been invited to join the room PPPPPPPPPPPPPPPPPPPPPPP	t	2023-06-20 17:36:49.079777	2023-06-20 17:36:49.079777	29	32	/chat/channel/invitation/70/PPPPPPPPPPPPPPPPPPPPPPP
313	roomInvite	you have been invited to join the room qweewqewqeqeqwe	f	2023-06-20 17:38:02.400924	2023-06-20 17:38:02.400924	29	25	/chat/channel/invitation/71/qweewqewqeqeqwe
314	roomInvite	you have been invited to join the room qweewqewqeqeqwe	f	2023-06-20 17:38:02.403993	2023-06-20 17:38:02.403993	29	0	/chat/channel/invitation/71/qweewqewqeqeqwe
311	roomInvite	you have been invited to join the room qweewqewqeqeqwe	t	2023-06-20 17:38:02.393132	2023-06-20 17:38:02.393132	29	32	/chat/channel/invitation/71/qweewqewqeqeqwe
312	roomInvite	you have been invited to join the room qweewqewqeqeqwe	t	2023-06-20 17:38:02.397291	2023-06-20 17:38:02.397291	29	35	/chat/channel/invitation/71/qweewqewqeqeqwe
317	roomInvite	you have been invited to join the room DDDDDDDDDD	f	2023-06-20 17:52:38.423676	2023-06-20 17:52:38.423676	29	25	/chat/channel/invitation/72/DDDDDDDDDD
318	roomInvite	you have been invited to join the room DDDDDDDDDD	f	2023-06-20 17:52:38.427366	2023-06-20 17:52:38.427366	29	0	/chat/channel/invitation/72/DDDDDDDDDD
316	roomInvite	you have been invited to join the room DDDDDDDDDD	t	2023-06-20 17:52:38.41964	2023-06-20 17:52:38.41964	29	35	/chat/channel/invitation/72/DDDDDDDDDD
315	roomInvite	you have been invited to join the room DDDDDDDDDD	t	2023-06-20 17:52:38.415217	2023-06-20 17:52:38.415217	29	32	/chat/channel/invitation/72/DDDDDDDDDD
319	roomInvite	you have been invited to join the room QWERTYUIO	t	2023-06-20 17:57:07.461289	2023-06-20 17:57:07.461289	29	32	/chat/channel/invitation/73/QWERTYUIO
321	roomInvite	you have been invited to join the room QWERTYUIO	f	2023-06-20 17:57:07.469748	2023-06-20 17:57:07.469748	29	25	/chat/channel/invitation/73/QWERTYUIO
322	roomInvite	you have been invited to join the room QWERTYUIO	f	2023-06-20 17:57:07.475065	2023-06-20 17:57:07.475065	29	0	/chat/channel/invitation/73/QWERTYUIO
320	roomInvite	you have been invited to join the room QWERTYUIO	t	2023-06-20 17:57:07.465785	2023-06-20 17:57:07.465785	29	35	/chat/channel/invitation/73/QWERTYUIO
325	roomInvite	you have been invited to join the room vvvvvvv	f	2023-06-20 18:00:37.214266	2023-06-20 18:00:37.214266	29	25	/chat/channel/invitation/74/vvvvvvv
326	roomInvite	you have been invited to join the room vvvvvvv	f	2023-06-20 18:00:37.217753	2023-06-20 18:00:37.217753	29	0	/chat/channel/invitation/74/vvvvvvv
323	roomInvite	you have been invited to join the room vvvvvvv	t	2023-06-20 18:00:37.207027	2023-06-20 18:00:37.207027	29	32	/chat/channel/invitation/74/vvvvvvv
324	roomInvite	you have been invited to join the room vvvvvvv	t	2023-06-20 18:00:37.210255	2023-06-20 18:00:37.210255	29	35	/chat/channel/invitation/74/vvvvvvv
328	roomInvite	you have been invited to join the room sdfffdsf	f	2023-06-20 18:01:47.43753	2023-06-20 18:01:47.43753	29	25	/chat/channel/invitation/75/sdfffdsf
330	roomInvite	you have been invited to join the room sdfffdsf	f	2023-06-20 18:01:47.444521	2023-06-20 18:01:47.444521	29	0	/chat/channel/invitation/75/sdfffdsf
327	roomInvite	you have been invited to join the room sdfffdsf	t	2023-06-20 18:01:47.43468	2023-06-20 18:01:47.43468	29	32	/chat/channel/invitation/75/sdfffdsf
329	roomInvite	you have been invited to join the room sdfffdsf	t	2023-06-20 18:01:47.440693	2023-06-20 18:01:47.440693	29	35	/chat/channel/invitation/75/sdfffdsf
333	roomInvite	you have been invited to join the room EFGEFSDFSDFSFD	f	2023-06-20 18:02:52.465697	2023-06-20 18:02:52.465697	29	25	/chat/channel/invitation/76/EFGEFSDFSDFSFD
334	roomInvite	you have been invited to join the room EFGEFSDFSDFSFD	f	2023-06-20 18:02:52.468899	2023-06-20 18:02:52.468899	29	0	/chat/channel/invitation/76/EFGEFSDFSDFSFD
332	roomInvite	you have been invited to join the room EFGEFSDFSDFSFD	t	2023-06-20 18:02:52.463061	2023-06-20 18:02:52.463061	29	35	/chat/channel/invitation/76/EFGEFSDFSDFSFD
331	roomInvite	you have been invited to join the room EFGEFSDFSDFSFD	t	2023-06-20 18:02:52.460408	2023-06-20 18:02:52.460408	29	32	/chat/channel/invitation/76/EFGEFSDFSDFSFD
335	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 18:31:07.578255	2023-06-20 18:31:07.578255	29	32	/chat/channel/invitation/76/undefined
337	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 18:38:57.984797	2023-06-20 18:38:57.984797	29	35	/chat/channel/invitation/77/undefined
336	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 18:38:57.940157	2023-06-20 18:38:57.940157	29	32	/chat/channel/invitation/77/undefined
338	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 18:50:32.907358	2023-06-20 18:50:32.907358	29	32	/chat/channel/invitation/77/undefined
339	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 18:51:00.536878	2023-06-20 18:51:00.536878	29	32	/chat/channel/invitation/77/undefined
341	roomInvite	you have been invited to join the room EEEEEEEEEEE	f	2023-06-20 18:54:42.569458	2023-06-20 18:54:42.569458	35	0	/chat/channel/invitation/78/EEEEEEEEEEE
340	roomInvite	you have been invited to join the room EEEEEEEEEEE	t	2023-06-20 18:54:42.48371	2023-06-20 18:54:42.48371	35	32	/chat/channel/invitation/78/EEEEEEEEEEE
342	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 18:54:57.375854	2023-06-20 18:54:57.375854	35	29	/chat/channel/invitation/78/undefined
343	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:06:28.023583	2023-06-20 19:06:28.023583	35	32	/chat/channel/invitation/78/undefined
344	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:06:57.118817	2023-06-20 19:06:57.118817	35	32	/chat/channel/invitation/78/undefined
345	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:16:42.828919	2023-06-20 19:16:42.828919	35	29	/chat/channel/invitation/78/undefined
346	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:17:31.468716	2023-06-20 19:17:31.468716	35	29	/chat/channel/invitation/78/undefined
347	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:18:16.718652	2023-06-20 19:18:16.718652	35	29	/chat/channel/invitation/78/undefined
348	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:18:16.763546	2023-06-20 19:18:16.763546	35	32	/chat/channel/invitation/78/undefined
349	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:19:00.807795	2023-06-20 19:19:00.807795	35	29	/chat/channel/invitation/78/undefined
350	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:21:48.644929	2023-06-20 19:21:48.644929	35	32	/chat/channel/invitation/78/undefined
351	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:23:41.700665	2023-06-20 19:23:41.700665	35	32	/chat/channel/invitation/78/undefined
352	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:25:28.2146	2023-06-20 19:25:28.2146	35	32	/chat/channel/invitation/78/undefined
353	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:31:16.172665	2023-06-20 19:31:16.172665	35	32	/chat/channel/invitation/78/undefined
354	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:31:51.968662	2023-06-20 19:31:51.968662	35	32	/chat/channel/invitation/78/undefined
355	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:32:26.51109	2023-06-20 19:32:26.51109	35	32	/chat/channel/invitation/78/undefined
356	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:33:10.034012	2023-06-20 19:33:10.034012	35	32	/chat/channel/invitation/78/undefined
357	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:37:14.090257	2023-06-20 19:37:14.090257	35	29	/chat/channel/invitation/78/undefined
358	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:46:24.75143	2023-06-20 19:46:24.75143	35	32	/chat/channel/invitation/78/undefined
359	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 19:46:52.259194	2023-06-20 19:46:52.259194	35	32	/chat/channel/invitation/78/undefined
362	roomInvite	you have been invited to join the room BLABLA	f	2023-06-20 20:00:44.41021	2023-06-20 20:00:44.41021	35	0	/chat/channel/invitation/79/BLABLA
361	roomInvite	you have been invited to join the room BLABLA	t	2023-06-20 20:00:44.407397	2023-06-20 20:00:44.407397	35	29	/chat/channel/invitation/79/BLABLA
360	roomInvite	you have been invited to join the room BLABLA	t	2023-06-20 20:00:44.403947	2023-06-20 20:00:44.403947	35	32	/chat/channel/invitation/79/BLABLA
363	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:06:50.679308	2023-06-20 20:06:50.679308	35	32	/chat/channel/invitation/79/undefined
364	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:07:24.542074	2023-06-20 20:07:24.542074	35	32	/chat/channel/invitation/79/undefined
365	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:07:47.759972	2023-06-20 20:07:47.759972	35	32	/chat/channel/invitation/79/undefined
366	friendRequestAccepted	accepted your friend request	t	2023-06-20 20:08:15.957767	2023-06-20 20:08:15.957767	27	35	\N
367	friendRequestAccepted	accepted your friend request	t	2023-06-20 20:08:16.827236	2023-06-20 20:08:16.827236	27	29	\N
368	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:08:30.922436	2023-06-20 20:08:30.922436	35	27	/chat/channel/invitation/79/undefined
369	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:10:05.559505	2023-06-20 20:10:05.559505	35	29	/chat/channel/invitation/79/undefined
371	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:34:20.640933	2023-06-20 20:34:20.640933	35	32	/chat/channel/invitation/79/undefined
370	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:34:20.598302	2023-06-20 20:34:20.598302	35	27	/chat/channel/invitation/79/undefined
372	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:49:09.099639	2023-06-20 20:49:09.099639	35	27	/chat/channel/invitation/79/undefined
373	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:52:36.955238	2023-06-20 20:52:36.955238	35	27	/chat/channel/invitation/79/undefined
376	roomInvite	you have been invited to join the room mnbvmnm	f	2023-06-20 20:56:44.820911	2023-06-20 20:56:44.820911	35	0	/chat/channel/invitation/80/mnbvmnm
375	roomInvite	you have been invited to join the room mnbvmnm	t	2023-06-20 20:56:44.818213	2023-06-20 20:56:44.818213	35	32	/chat/channel/invitation/80/mnbvmnm
374	roomInvite	you have been invited to join the room mnbvmnm	t	2023-06-20 20:56:44.815557	2023-06-20 20:56:44.815557	35	27	/chat/channel/invitation/80/mnbvmnm
377	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 20:58:32.189702	2023-06-20 20:58:32.189702	35	29	/chat/channel/invitation/80/undefined
378	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 21:27:21.590139	2023-06-20 21:27:21.590139	35	27	/chat/channel/invitation/80/undefined
379	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 21:28:10.875357	2023-06-20 21:28:10.875357	35	32	/chat/channel/invitation/80/undefined
380	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 21:29:42.446924	2023-06-20 21:29:42.446924	35	32	/chat/channel/invitation/80/undefined
381	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 21:30:38.950285	2023-06-20 21:30:38.950285	35	32	/chat/channel/invitation/80/undefined
383	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 21:32:27.47764	2023-06-20 21:32:27.47764	35	32	/chat/channel/invitation/80/undefined
384	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 21:32:27.59451	2023-06-20 21:32:27.59451	35	29	/chat/channel/invitation/80/undefined
382	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 21:32:27.431337	2023-06-20 21:32:27.431337	35	27	/chat/channel/invitation/80/undefined
385	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:04:40.87616	2023-06-20 22:04:40.87616	35	27	/chat/channel/invitation/80/undefined
386	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:18:49.341975	2023-06-20 22:18:49.341975	35	27	/chat/channel/invitation/80/undefined
387	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:21:37.309866	2023-06-20 22:21:37.309866	35	27	/chat/channel/invitation/80/undefined
388	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:24:17.859921	2023-06-20 22:24:17.859921	35	27	/chat/channel/invitation/65/undefined
389	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:24:42.91488	2023-06-20 22:24:42.91488	35	27	/chat/channel/invitation/65/undefined
390	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:25:02.42725	2023-06-20 22:25:02.42725	35	27	/chat/channel/invitation/80/undefined
393	roomInvite	you have been invited to join the room bnbnnbbnbnbbbn	f	2023-06-20 22:27:25.321484	2023-06-20 22:27:25.321484	35	0	/chat/channel/invitation/81/bnbnnbbnbnbbbn
391	roomInvite	you have been invited to join the room bnbnnbbnbnbbbn	t	2023-06-20 22:27:25.315838	2023-06-20 22:27:25.315838	35	27	/chat/channel/invitation/81/bnbnnbbnbnbbbn
392	roomInvite	you have been invited to join the room bnbnnbbnbnbbbn	t	2023-06-20 22:27:25.31838	2023-06-20 22:27:25.31838	35	32	/chat/channel/invitation/81/bnbnnbbnbnbbbn
396	roomInvite	you have been invited to join the room nmnmmnmnmnmn	f	2023-06-20 22:28:51.059207	2023-06-20 22:28:51.059207	35	0	/chat/channel/invitation/82/nmnmmnmnmnmn
394	roomInvite	you have been invited to join the room nmnmmnmnmnmn	t	2023-06-20 22:28:50.982531	2023-06-20 22:28:50.982531	35	32	/chat/channel/invitation/82/nmnmmnmnmnmn
395	roomInvite	you have been invited to join the room nmnmmnmnmnmn	t	2023-06-20 22:28:51.020905	2023-06-20 22:28:51.020905	35	27	/chat/channel/invitation/82/nmnmmnmnmnmn
397	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:29:54.225548	2023-06-20 22:29:54.225548	35	32	/chat/channel/invitation/82/undefined
398	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:29:54.268577	2023-06-20 22:29:54.268577	35	29	/chat/channel/invitation/82/undefined
399	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:41:08.584293	2023-06-20 22:41:08.584293	35	32	/chat/channel/invitation/82/undefined
400	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:41:08.640608	2023-06-20 22:41:08.640608	35	27	/chat/channel/invitation/82/undefined
401	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:41:38.754221	2023-06-20 22:41:38.754221	35	27	/chat/channel/invitation/82/undefined
403	roomInvite	you have been invited to join the room ouiiiiiiiiiiiiiiiiiiiiiiiiiii	f	2023-06-20 22:42:15.053088	2023-06-20 22:42:15.053088	35	0	/chat/channel/invitation/83/ouiiiiiiiiiiiiiiiiiiiiiiiiiii
402	roomInvite	you have been invited to join the room ouiiiiiiiiiiiiiiiiiiiiiiiiiii	t	2023-06-20 22:42:15.04948	2023-06-20 22:42:15.04948	35	27	/chat/channel/invitation/83/ouiiiiiiiiiiiiiiiiiiiiiiiiiii
404	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:42:28.887156	2023-06-20 22:42:28.887156	35	29	/chat/channel/invitation/83/undefined
405	roomInvite	jrasser invite you to join the room undefined	t	2023-06-20 22:42:29.001739	2023-06-20 22:42:29.001739	35	32	/chat/channel/invitation/83/undefined
408	roomInvite	Laron76 invite you to join the room undefined	f	2023-06-20 23:45:30.761653	2023-06-20 23:45:30.761653	29	25	/chat/channel/invitation/83/undefined
406	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 23:45:30.67787	2023-06-20 23:45:30.67787	29	32	/chat/channel/invitation/83/undefined
410	roomInvite	Laron76 invite you to join the room undefined	f	2023-06-20 23:58:13.891919	2023-06-20 23:58:13.891919	29	25	/chat/channel/invitation/68/undefined
407	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 23:45:30.713632	2023-06-20 23:45:30.713632	29	27	/chat/channel/invitation/83/undefined
411	friendRequest	send you a friend request	f	2023-06-21 00:53:05.451071	2023-06-21 00:53:05.451071	32	30	\N
412	friendRequest	send you a friend request	f	2023-06-21 00:53:06.054009	2023-06-21 00:53:06.054009	32	28	\N
413	friendRequest	send you a friend request	f	2023-06-21 00:53:06.646396	2023-06-21 00:53:06.646396	32	26	\N
414	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-21 00:54:21.671297	2023-06-21 00:54:21.671297	29	35	/chat/channel/invitation/68/undefined
415	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-21 00:54:46.987156	2023-06-21 00:54:46.987156	29	32	/chat/channel/invitation/68/undefined
416	friendRequest	send you a friend request	f	2023-06-21 12:39:44.447539	2023-06-21 12:39:44.447539	35	26	\N
417	friendRequest	send you a friend request	f	2023-06-21 12:39:45.129829	2023-06-21 12:39:45.129829	35	28	\N
418	friendRequest	send you a friend request	f	2023-06-21 12:39:45.952486	2023-06-21 12:39:45.952486	35	30	\N
419	friendRequest	send you a friend request	f	2023-06-21 12:39:46.535981	2023-06-21 12:39:46.535981	35	31	\N
420	friendRequest	send you a friend request	f	2023-06-21 12:39:47.090869	2023-06-21 12:39:47.090869	35	33	\N
421	friendRequest	send you a friend request	f	2023-06-21 12:39:47.607142	2023-06-21 12:39:47.607142	35	34	\N
422	friendRequest	send you a friend request	f	2023-06-21 12:39:47.945363	2023-06-21 12:39:47.945363	35	25	\N
425	friendRequest	send you a friend request	t	2023-06-21 12:39:49.831348	2023-06-21 12:39:49.831348	35	29	\N
426	friendRequestAccepted	accepted your friend request	t	2023-06-21 12:45:31.506261	2023-06-21 12:45:31.506261	29	35	\N
424	friendRequest	send you a friend request	t	2023-06-21 12:39:49.242403	2023-06-21 12:39:49.242403	35	32	\N
427	friendRequestAccepted	accepted your friend request	t	2023-06-21 12:46:25.84286	2023-06-21 12:46:25.84286	32	35	\N
430	roomInvite	you have been invited to join the room sdsaddd	f	2023-06-21 13:01:38.713186	2023-06-21 13:01:38.713186	35	0	/chat/channel/invitation/84/sdsaddd
428	roomInvite	you have been invited to join the room sdsaddd	t	2023-06-21 13:01:38.705243	2023-06-21 13:01:38.705243	35	29	/chat/channel/invitation/84/sdsaddd
431	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 13:01:50.514845	2023-06-21 13:01:50.514845	35	29	/chat/channel/invitation/84/undefined
429	roomInvite	you have been invited to join the room sdsaddd	t	2023-06-21 13:01:38.708671	2023-06-21 13:01:38.708671	35	32	/chat/channel/invitation/84/sdsaddd
432	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 13:24:42.218868	2023-06-21 13:24:42.218868	35	32	/chat/channel/invitation/84/undefined
433	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 13:25:53.716386	2023-06-21 13:25:53.716386	35	32	/chat/channel/invitation/84/undefined
434	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 13:28:37.997448	2023-06-21 13:28:37.997448	35	32	/chat/channel/invitation/84/undefined
435	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 13:44:00.672866	2023-06-21 13:44:00.672866	35	32	/chat/channel/invitation/84/undefined
436	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 13:44:30.307551	2023-06-21 13:44:30.307551	35	32	/chat/channel/invitation/84/undefined
437	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 17:55:49.707764	2023-06-21 17:55:49.707764	35	32	/chat/channel/invitation/84/undefined
438	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 17:56:15.322456	2023-06-21 17:56:15.322456	35	32	/chat/channel/invitation/84/undefined
439	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 18:06:35.590684	2023-06-21 18:06:35.590684	35	32	/chat/channel/invitation/84/undefined
440	roomInvite	jrasser invite you to join the room undefined	t	2023-06-21 18:23:31.039016	2023-06-21 18:23:31.039016	35	32	/chat/channel/invitation/85/undefined
442	roomInvite	you have been invited to join the room qwerrt	f	2023-06-22 13:01:53.945484	2023-06-22 13:01:53.945484	29	0	/chat/channel/invitation/93/qwerrt
441	roomInvite	you have been invited to join the room qwerrt	t	2023-06-22 13:01:53.939435	2023-06-22 13:01:53.939435	29	35	/chat/channel/invitation/93/qwerrt
443	friendDeleted	deleted you from his friend list	t	2023-06-22 20:47:15.088839	2023-06-22 20:47:15.088839	29	35	\N
444	friendRequest	send you a friend request	t	2023-06-22 20:47:19.810565	2023-06-22 20:47:19.810565	29	35	\N
445	friendRequestAccepted	accepted your friend request	t	2023-06-22 20:47:24.465547	2023-06-22 20:47:24.465547	35	29	\N
446	gameInvite	Laron76 challenges you}	t	2023-06-22 20:52:11.302941	2023-06-22 20:52:11.302941	29	35	/game?id=7
447	gameInvite	Laron76 challenges you}	t	2023-06-22 20:52:27.456829	2023-06-22 20:52:27.456829	29	35	/game?id=8
448	gameInvite	Laron76 challenges you}	t	2023-06-22 20:53:30.114213	2023-06-22 20:53:30.114213	29	35	/game?id=9
449	gameInvite	jrasser challenges you}	t	2023-06-22 20:53:59.799244	2023-06-22 20:53:59.799244	35	29	/game?id=10
451	gameInvite	jrasser challenges you}	t	2023-06-22 20:56:23.633387	2023-06-22 20:56:23.633387	35	29	/game?id=12
452	gameInvite	jrasser challenges you}	t	2023-06-22 20:58:25.480567	2023-06-22 20:58:25.480567	35	29	/game?id=13
453	gameInvite	jrasser challenges you}	t	2023-06-22 20:59:34.887178	2023-06-22 20:59:34.887178	35	29	/game?id=14
454	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-22 20:59:43.552158	2023-06-22 20:59:43.552158	29	35	/game?id=14
455	gameInvite	jrasser challenges you}	t	2023-06-22 21:00:29.747846	2023-06-22 21:00:29.747846	35	29	/game?id=15
456	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-22 21:00:31.374589	2023-06-22 21:00:31.374589	29	35	/game?id=15
457	gameInvite	Laron76 challenges you}	t	2023-06-22 22:16:55.686382	2023-06-22 22:16:55.686382	29	35	/game?id=17
458	gameInviteAccepted	jrasser accept challenge, let's play	t	2023-06-22 22:16:59.586057	2023-06-22 22:16:59.586057	35	29	/game?id=17
459	gameInvite	Laron76 challenges you}	t	2023-06-22 22:18:01.701423	2023-06-22 22:18:01.701423	29	35	/game?id=19
460	gameInviteAccepted	jrasser accept challenge, let's play	t	2023-06-22 22:18:03.17372	2023-06-22 22:18:03.17372	35	29	/game?id=19
450	gameInvite	jrasser challenges you}	t	2023-06-22 20:56:21.061009	2023-06-22 20:56:21.061009	35	32	/game?id=11
461	gameInvite	jrasser challenges you}	t	2023-06-22 22:28:39.006623	2023-06-22 22:28:39.006623	35	32	/game?id=21
462	gameInviteAccepted	Grayce_Dach accept challenge, let's play	t	2023-06-22 22:28:40.718221	2023-06-22 22:28:40.718221	32	35	/game?id=21
463	gameInvite	jrasser challenges you}	t	2023-06-22 22:32:56.036569	2023-06-22 22:32:56.036569	35	29	/game?id=23
464	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-22 22:32:58.420623	2023-06-22 22:32:58.420623	29	35	/game?id=23
465	gameInvite	jrasser challenges you}	t	2023-06-22 22:51:02.555178	2023-06-22 22:51:02.555178	35	29	/game?id=24
423	friendRequest	send you a friend request	t	2023-06-21 12:39:48.572409	2023-06-21 12:39:48.572409	35	27	\N
466	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-22 22:51:05.067043	2023-06-22 22:51:05.067043	29	35	/game?id=24
467	gameInvite	jrasser challenges you}	t	2023-06-22 22:52:25.848382	2023-06-22 22:52:25.848382	35	29	/game?id=25
468	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-22 22:52:28.249883	2023-06-22 22:52:28.249883	29	35	/game?id=25
469	gameInvite	Laron76 challenges you}	t	2023-06-22 22:53:36.264939	2023-06-22 22:53:36.264939	29	35	/game?id=26
470	gameInviteAccepted	jrasser accept challenge, let's play	t	2023-06-22 22:53:38.175772	2023-06-22 22:53:38.175772	35	29	/game?id=26
471	gameInvite	jrasser challenges you}	t	2023-06-22 22:55:34.723602	2023-06-22 22:55:34.723602	35	29	/game?id=27
472	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-22 22:55:42.213395	2023-06-22 22:55:42.213395	29	35	/game?id=27
473	friendRequestAccepted	accepted your friend request	t	2023-06-23 00:54:14.183082	2023-06-23 00:54:14.183082	27	35	\N
409	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 23:58:13.858635	2023-06-20 23:58:13.858635	29	27	/chat/channel/invitation/68/undefined
474	gameInvite	Laron76 challenges you}	t	2023-06-23 00:55:19.962464	2023-06-23 00:55:19.962464	29	35	/game?id=34
475	gameInviteAccepted	jrasser accept challenge, let's play	t	2023-06-23 00:55:23.151439	2023-06-23 00:55:23.151439	35	29	/game?id=34
476	gameInvite	jrasser challenges you}	t	2023-06-23 01:11:23.866644	2023-06-23 01:11:23.866644	35	29	/game?id=35
477	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-23 01:11:25.084503	2023-06-23 01:11:25.084503	29	35	/game?id=35
479	gameInvite	jrasser challenges you}	t	2023-06-23 01:15:22.097754	2023-06-23 01:15:22.097754	35	29	/game?id=37
478	gameInvite	jrasser challenges you}	t	2023-06-23 01:15:18.320912	2023-06-23 01:15:18.320912	35	29	/game?id=36
481	gameInvite	Laron76 challenges you}	t	2023-06-23 01:15:38.907227	2023-06-23 01:15:38.907227	29	35	/game?id=38
480	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-23 01:15:27.756478	2023-06-23 01:15:27.756478	29	35	/game?id=37
482	gameInvite	jrasser challenges you}	t	2023-06-23 01:16:37.561968	2023-06-23 01:16:37.561968	35	29	/game?id=39
484	gameInvite	jrasser challenges you}	t	2023-06-23 01:28:42.090636	2023-06-23 01:28:42.090636	35	29	/game?id=40
483	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-23 01:16:40.882855	2023-06-23 01:16:40.882855	29	35	/game?id=39
485	gameInviteAccepted	Laron76 accept challenge, let's play	t	2023-06-23 01:28:44.735934	2023-06-23 01:28:44.735934	29	35	/game?id=40
486	gameInvite	Laron76 challenges you}	t	2023-06-23 01:33:57.217815	2023-06-23 01:33:57.217815	29	35	/game?id=41
487	gameInviteAccepted	jrasser accept challenge, let's play	t	2023-06-23 01:33:59.282509	2023-06-23 01:33:59.282509	35	29	/game?id=41
488	gameInvite	jrasser challenges you}	t	2023-06-23 02:11:51.470341	2023-06-23 02:11:51.470341	35	32	/game?id=55
489	gameInviteAccepted	Grayce_Dach accept challenge, let's play	t	2023-06-23 02:11:54.809767	2023-06-23 02:11:54.809767	32	35	/game?id=55
490	gameInvite	jrasser challenges you}	f	2023-06-23 02:19:01.560577	2023-06-23 02:19:01.560577	35	27	/game?id=57
491	gameInvite	jrasser challenges you}	t	2023-06-23 02:19:09.945756	2023-06-23 02:19:09.945756	35	32	/game?id=58
492	gameInviteAccepted	Grayce_Dach accept challenge, let's play	t	2023-06-23 02:19:11.877924	2023-06-23 02:19:11.877924	32	35	/game?id=58
493	friendRequest	send you a friend request	t	2023-08-10 20:49:58.050738	2023-08-10 20:49:58.050738	35	41	\N
494	friendRequestAccepted	accepted your friend request	t	2023-08-10 20:50:10.775472	2023-08-10 20:50:10.775472	41	35	\N
495	friendDeleted	deleted you from his friend list	t	2023-08-10 20:51:32.34033	2023-08-10 20:51:32.34033	41	35	\N
496	friendRequest	send you a friend request	t	2023-08-10 20:51:53.326835	2023-08-10 20:51:53.326835	35	41	\N
497	friendRequestAccepted	accepted your friend request	t	2023-08-10 20:51:55.197038	2023-08-10 20:51:55.197038	41	35	\N
498	blockUser	blocked you	t	2023-08-10 20:52:09.619595	2023-08-10 20:52:09.619595	35	41	\N
499	unblockUser	unblocked you	t	2023-08-10 20:52:11.687646	2023-08-10 20:52:11.687646	35	41	\N
500	friendRequest	send you a friend request	t	2023-08-10 20:52:34.914928	2023-08-10 20:52:34.914928	35	41	\N
501	friendRequestAccepted	accepted your friend request	t	2023-08-10 20:52:37.385131	2023-08-10 20:52:37.385131	41	35	\N
502	friendDeleted	deleted you from his friend list	t	2023-08-10 20:53:00.159716	2023-08-10 20:53:00.159716	35	41	\N
503	friendRequest	send you a friend request	t	2023-08-10 20:53:06.999047	2023-08-10 20:53:06.999047	35	41	\N
504	friendRequestAccepted	accepted your friend request	t	2023-08-10 20:53:09.097196	2023-08-10 20:53:09.097196	41	35	\N
505	blockUser	blocked you	t	2023-08-10 20:55:02.261245	2023-08-10 20:55:02.261245	35	41	\N
506	friendDeleted	deleted you from his friend list	t	2023-08-10 20:57:29.476523	2023-08-10 20:57:29.476523	35	41	\N
507	friendRequest	send you a friend request	t	2023-08-10 20:57:41.732771	2023-08-10 20:57:41.732771	41	35	\N
508	friendRequestAccepted	accepted your friend request	t	2023-08-10 20:58:44.822891	2023-08-10 20:58:44.822891	35	41	\N
509	friendDeleted	deleted you from his friend list	t	2023-08-10 21:07:57.967949	2023-08-10 21:07:57.967949	41	35	\N
510	friendRequest	send you a friend request	t	2023-08-10 21:08:02.144342	2023-08-10 21:08:02.144342	41	35	\N
511	friendRequestAccepted	accepted your friend request	t	2023-08-10 21:08:04.312094	2023-08-10 21:08:04.312094	35	41	\N
512	blockUser	blocked you	t	2023-08-10 21:08:43.519435	2023-08-10 21:08:43.519435	35	41	\N
513	unblockUser	unblocked you	t	2023-08-10 21:09:44.887957	2023-08-10 21:09:44.887957	35	41	\N
514	friendRequest	send you a friend request	t	2023-08-10 21:10:15.397402	2023-08-10 21:10:15.397402	35	41	\N
515	friendRequestAccepted	accepted your friend request	t	2023-08-10 21:10:19.20235	2023-08-10 21:10:19.20235	41	35	\N
516	friendDeleted	deleted you from his friend list	t	2023-08-10 21:10:26.303484	2023-08-10 21:10:26.303484	41	35	\N
517	friendRequest	send you a friend request	t	2023-08-10 21:16:24.202981	2023-08-10 21:16:24.202981	41	35	\N
518	friendRequestAccepted	accepted your friend request	t	2023-08-10 21:16:26.355118	2023-08-10 21:16:26.355118	35	41	\N
519	friendRequest	send you a friend request	f	2023-08-10 21:19:48.144019	2023-08-10 21:19:48.144019	35	36	\N
521	friendRequest	send you a friend request	f	2023-08-10 21:19:48.475474	2023-08-10 21:19:48.475474	35	38	\N
522	friendRequest	send you a friend request	f	2023-08-10 21:19:48.639864	2023-08-10 21:19:48.639864	35	40	\N
523	friendRequest	send you a friend request	f	2023-08-10 21:19:48.798875	2023-08-10 21:19:48.798875	35	39	\N
520	friendRequest	send you a friend request	t	2023-08-10 21:19:48.311875	2023-08-10 21:19:48.311875	35	37	\N
524	friendRequestAccepted	accepted your friend request	t	2023-08-10 21:20:15.006473	2023-08-10 21:20:15.006473	37	35	\N
525	friendRequest	send you a friend request	f	2023-08-10 21:20:28.279498	2023-08-10 21:20:28.279498	37	26	\N
526	friendRequest	send you a friend request	f	2023-08-10 21:20:28.406098	2023-08-10 21:20:28.406098	37	28	\N
527	friendRequest	send you a friend request	f	2023-08-10 21:20:28.557595	2023-08-10 21:20:28.557595	37	30	\N
528	friendRequest	send you a friend request	f	2023-08-10 21:20:28.71837	2023-08-10 21:20:28.71837	37	31	\N
529	friendRequest	send you a friend request	f	2023-08-10 21:20:28.965596	2023-08-10 21:20:28.965596	37	33	\N
530	friendRequest	send you a friend request	f	2023-08-10 21:20:29.109571	2023-08-10 21:20:29.109571	37	34	\N
531	friendRequest	send you a friend request	f	2023-08-10 21:20:29.244474	2023-08-10 21:20:29.244474	37	25	\N
532	friendRequest	send you a friend request	f	2023-08-10 21:20:29.388656	2023-08-10 21:20:29.388656	37	36	\N
533	friendRequest	send you a friend request	f	2023-08-10 21:20:29.532444	2023-08-10 21:20:29.532444	37	38	\N
534	friendRequest	send you a friend request	f	2023-08-10 21:20:29.685921	2023-08-10 21:20:29.685921	37	40	\N
535	friendRequest	send you a friend request	f	2023-08-10 21:20:29.829062	2023-08-10 21:20:29.829062	37	39	\N
537	friendRequest	send you a friend request	f	2023-08-10 21:20:30.116945	2023-08-10 21:20:30.116945	37	27	\N
538	friendRequest	send you a friend request	f	2023-08-10 21:20:30.269277	2023-08-10 21:20:30.269277	37	32	\N
539	friendRequest	send you a friend request	t	2023-08-10 21:20:30.509331	2023-08-10 21:20:30.509331	37	41	\N
540	friendRequestAccepted	accepted your friend request	t	2023-08-10 21:20:32.292869	2023-08-10 21:20:32.292869	41	37	\N
541	friendDeleted	deleted you from his friend list	t	2023-08-10 21:21:24.903061	2023-08-10 21:21:24.903061	41	37	\N
542	friendRequest	send you a friend request	t	2023-08-10 21:21:51.557664	2023-08-10 21:21:51.557664	37	41	\N
543	friendRequestAccepted	accepted your friend request	t	2023-08-10 21:21:52.949165	2023-08-10 21:21:52.949165	41	37	\N
544	friendDeleted	deleted you from his friend list	t	2023-08-10 21:22:08.733508	2023-08-10 21:22:08.733508	37	35	\N
545	friendRequest	send you a friend request	t	2023-08-10 21:23:12.958534	2023-08-10 21:23:12.958534	35	37	\N
546	friendRequestAccepted	accepted your friend request	t	2023-08-10 21:23:15.756018	2023-08-10 21:23:15.756018	37	35	\N
547	trophy	You win a trophy : Blitz Pong	t	2023-08-10 21:36:58.111614	2023-08-10 21:36:58.111614	\N	41	\N
548	trophy	You win a trophy : Blitz Pong	t	2023-08-10 21:36:58.125017	2023-08-10 21:36:58.125017	\N	35	\N
550	gameInvite	challenges you	t	2023-08-10 21:50:20.6254	2023-08-10 21:50:20.6254	41	35	/game?id=62
549	gameInvite	challenges you	t	2023-08-10 21:43:16.614766	2023-08-10 21:43:16.614766	41	35	/game?id=61
552	gameInvite	challenges you	t	2023-08-10 22:01:34.100736	2023-08-10 22:01:34.100736	41	35	/game?id=64
554	blockUser	blocked you	t	2023-08-10 22:18:33.577572	2023-08-10 22:18:33.577572	35	41	\N
555	unblockUser	unblocked you	t	2023-08-10 22:42:50.947261	2023-08-10 22:42:50.947261	35	41	\N
553	gameInviteAccepted	's challenge accepted, let's play	t	2023-08-10 22:17:52.935814	2023-08-10 22:17:52.935814	35	41	/game?id=64
551	gameInvite	challenges you	t	2023-08-10 22:01:30.459784	2023-08-10 22:01:30.459784	35	41	/game?id=63
556	friendRequest	send you a friend request	t	2023-08-10 22:43:47.34734	2023-08-10 22:43:47.34734	35	41	\N
557	friendRequestAccepted	accepted your friend request	t	2023-08-10 22:43:56.350596	2023-08-10 22:43:56.350596	41	35	\N
558	blockUser	blocked you	t	2023-08-10 22:48:04.750126	2023-08-10 22:48:04.750126	35	41	\N
559	unblockUser	unblocked you	t	2023-08-10 22:48:26.178486	2023-08-10 22:48:26.178486	35	41	\N
560	friendRequest	send you a friend request	t	2023-08-10 22:50:57.405737	2023-08-10 22:50:57.405737	42	35	\N
561	friendRequestAccepted	accepted your friend request	t	2023-08-10 22:51:00.64638	2023-08-10 22:51:00.64638	35	42	\N
562	blockUser	blocked you	t	2023-08-10 22:54:17.471458	2023-08-10 22:54:17.471458	35	42	\N
563	unblockUser	unblocked you	t	2023-08-10 22:57:42.226657	2023-08-10 22:57:42.226657	35	42	\N
564	friendRequest	send you a friend request	t	2023-08-10 22:58:18.247773	2023-08-10 22:58:18.247773	35	42	\N
565	friendRequestAccepted	accepted your friend request	t	2023-08-10 22:58:23.305813	2023-08-10 22:58:23.305813	42	35	\N
566	blockUser	blocked you	t	2023-08-10 22:58:29.132325	2023-08-10 22:58:29.132325	35	42	\N
567	unblockUser	unblocked you	t	2023-08-10 23:00:34.710341	2023-08-10 23:00:34.710341	35	42	\N
568	friendRequest	send you a friend request	t	2023-08-10 23:00:39.075952	2023-08-10 23:00:39.075952	35	42	\N
569	friendRequestAccepted	accepted your friend request	t	2023-08-10 23:00:42.557057	2023-08-10 23:00:42.557057	42	35	\N
570	blockUser	blocked you	t	2023-08-10 23:07:22.011808	2023-08-10 23:07:22.011808	35	42	\N
571	unblockUser	unblocked you	t	2023-08-10 23:07:30.00664	2023-08-10 23:07:30.00664	35	42	\N
572	friendRequest	send you a friend request	t	2023-08-10 23:32:17.448229	2023-08-10 23:32:17.448229	35	42	\N
573	friendRequestAccepted	accepted your friend request	t	2023-08-10 23:32:21.273236	2023-08-10 23:32:21.273236	42	35	\N
574	friendDeleted	deleted you from his friend list	t	2023-08-10 23:32:27.354184	2023-08-10 23:32:27.354184	35	42	\N
575	friendRequest	send you a friend request	t	2023-08-10 23:32:36.913919	2023-08-10 23:32:36.913919	35	42	\N
576	friendRequestAccepted	accepted your friend request	t	2023-08-10 23:32:38.3898	2023-08-10 23:32:38.3898	42	35	\N
577	friendDeleted	deleted you from his friend list	t	2023-08-10 23:32:43.038262	2023-08-10 23:32:43.038262	35	42	\N
578	unblockUser	unblocked you	t	2023-08-10 23:33:22.573174	2023-08-10 23:33:22.573174	35	42	\N
579	friendRequest	send you a friend request	t	2023-08-10 23:33:24.996455	2023-08-10 23:33:24.996455	35	42	\N
580	friendRequestAccepted	accepted your friend request	t	2023-08-10 23:33:27.407672	2023-08-10 23:33:27.407672	42	35	\N
581	friendDeleted	deleted you from his friend list	t	2023-08-10 23:33:29.589593	2023-08-10 23:33:29.589593	35	42	\N
582	friendRequest	send you a friend request	t	2023-08-10 23:41:47.060409	2023-08-10 23:41:47.060409	42	35	\N
583	friendRequestAccepted	accepted your friend request	t	2023-08-10 23:41:54.117667	2023-08-10 23:41:54.117667	35	42	\N
584	friendDeleted	deleted you from his friend list	t	2023-08-11 00:34:52.040203	2023-08-11 00:34:52.040203	35	42	\N
585	friendRequest	send you a friend request	t	2023-08-11 00:35:12.374986	2023-08-11 00:35:12.374986	35	42	\N
586	friendRequestAccepted	accepted your friend request	t	2023-08-11 00:35:16.058728	2023-08-11 00:35:16.058728	42	35	\N
587	blockUser	blocked you	t	2023-08-11 00:35:57.879659	2023-08-11 00:35:57.879659	42	35	\N
588	trophy	You win a trophy : Blitz Pong	t	2023-08-11 13:49:34.305414	2023-08-11 13:49:34.305414	\N	42	\N
589	trophy	You win a trophy : Warrior	t	2023-08-11 13:50:03.498949	2023-08-11 13:50:03.498949	\N	35	\N
590	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 13:50:03.514236	2023-08-11 13:50:03.514236	\N	42	\N
591	trophy	You win a trophy : Blitz Pong	t	2023-08-11 14:22:37.151648	2023-08-11 14:22:37.151648	\N	41	\N
592	trophy	You win a trophy : Warrior	t	2023-08-11 14:22:37.187337	2023-08-11 14:22:37.187337	\N	35	\N
593	trophy	You win a trophy : Why Not	t	2023-08-11 14:36:14.736935	2023-08-11 14:36:14.736935	\N	41	\N
594	trophy	You win a trophy : Why Not	t	2023-08-11 14:36:14.768991	2023-08-11 14:36:14.768991	\N	35	\N
595	trophy	You win a trophy : Warrior	t	2023-08-11 14:51:08.023669	2023-08-11 14:51:08.023669	\N	35	\N
596	trophy	You win a trophy : Lord	t	2023-08-11 14:51:08.027635	2023-08-11 14:51:08.027635	\N	35	\N
597	trophy	You win a trophy : Blitz Pong	t	2023-08-11 14:51:08.033638	2023-08-11 14:51:08.033638	\N	35	\N
598	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 14:51:08.038662	2023-08-11 14:51:08.038662	\N	35	\N
599	trophy	You win a trophy : Blitz Pong	t	2023-08-11 14:51:08.059571	2023-08-11 14:51:08.059571	\N	41	\N
600	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 14:51:08.069167	2023-08-11 14:51:08.069167	\N	41	\N
601	trophy	You win a trophy : Why Not	t	2023-08-11 14:54:00.675463	2023-08-11 14:54:00.675463	\N	41	\N
602	trophy	You win a trophy : Why Not	t	2023-08-11 14:54:00.711616	2023-08-11 14:54:00.711616	\N	35	\N
603	friendRequest	send you a friend request	t	2023-08-11 15:00:14.922947	2023-08-11 15:00:14.922947	41	35	\N
604	friendRequestAccepted	accepted your friend request	t	2023-08-11 15:00:16.963998	2023-08-11 15:00:16.963998	35	41	\N
605	trophy	You win a trophy : Blitz Pong	t	2023-08-11 15:02:10.30995	2023-08-11 15:02:10.30995	\N	37	\N
606	trophy	You win a trophy : Warrior	t	2023-08-11 15:02:32.069804	2023-08-11 15:02:32.069804	\N	37	\N
607	trophy	You win a trophy : Warrior	t	2023-08-11 15:29:39.396272	2023-08-11 15:29:39.396272	\N	35	\N
608	trophy	You win a trophy : Blitz Pong	t	2023-08-11 15:29:39.403738	2023-08-11 15:29:39.403738	\N	35	\N
609	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 15:29:39.407645	2023-08-11 15:29:39.407645	\N	35	\N
610	trophy	You win a trophy : Blitz Pong	t	2023-08-11 15:29:39.42589	2023-08-11 15:29:39.42589	\N	41	\N
611	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 15:29:39.428683	2023-08-11 15:29:39.428683	\N	41	\N
612	trophy	You win a trophy : Blitz Pong	t	2023-08-11 15:34:24.911298	2023-08-11 15:34:24.911298	\N	35	\N
613	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 15:34:25.156125	2023-08-11 15:34:25.156125	\N	35	\N
614	trophy	You win a trophy : Blitz Pong	t	2023-08-11 15:34:25.586961	2023-08-11 15:34:25.586961	\N	41	\N
615	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 15:34:25.811981	2023-08-11 15:34:25.811981	\N	41	\N
616	trophy	You win a trophy : Warrior	t	2023-08-11 15:34:57.200562	2023-08-11 15:34:57.200562	\N	35	\N
617	trophy	You win a trophy : Lord	t	2023-08-11 15:35:27.689692	2023-08-11 15:35:27.689692	\N	35	\N
618	trophy	You win a trophy : Why Not	t	2023-08-11 15:38:44.017207	2023-08-11 15:38:44.017207	\N	41	\N
619	trophy	You win a trophy : Why Not	t	2023-08-11 15:38:44.02918	2023-08-11 15:38:44.02918	\N	35	\N
620	trophy	You win a trophy : Warrior	t	2023-08-11 16:31:46.378453	2023-08-11 16:31:46.378453	\N	35	\N
621	trophy	You win a trophy : Blitz Pong	t	2023-08-11 16:31:46.382249	2023-08-11 16:31:46.382249	\N	35	\N
622	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 16:31:46.385636	2023-08-11 16:31:46.385636	\N	35	\N
623	trophy	You win a trophy : Blitz Pong	t	2023-08-11 16:31:46.398184	2023-08-11 16:31:46.398184	\N	41	\N
624	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 16:31:46.401649	2023-08-11 16:31:46.401649	\N	41	\N
625	trophy	You win a trophy : Blitz Pong	t	2023-08-11 18:21:10.23527	2023-08-11 18:21:10.23527	\N	37	\N
626	trophy	You win a trophy : Why Not	t	2023-08-11 18:43:42.644118	2023-08-11 18:43:42.644118	\N	35	\N
627	trophy	You win a trophy : Why Not	t	2023-08-11 18:43:42.667163	2023-08-11 18:43:42.667163	\N	41	\N
628	trophy	You win a trophy : Warrior	t	2023-08-11 18:43:42.67193	2023-08-11 18:43:42.67193	\N	41	\N
630	friendRequest	send you a friend request	f	2023-08-11 21:38:37.948419	2023-08-11 21:38:37.948419	43	25	\N
631	friendRequest	send you a friend request	f	2023-08-11 21:38:38.247015	2023-08-11 21:38:38.247015	43	26	\N
632	friendRequest	send you a friend request	f	2023-08-11 21:38:38.5493	2023-08-11 21:38:38.5493	43	27	\N
633	friendRequest	send you a friend request	f	2023-08-11 21:38:38.683594	2023-08-11 21:38:38.683594	43	28	\N
635	friendRequest	send you a friend request	f	2023-08-11 21:38:38.98725	2023-08-11 21:38:38.98725	43	30	\N
636	friendRequest	send you a friend request	f	2023-08-11 21:38:39.165235	2023-08-11 21:38:39.165235	43	31	\N
637	friendRequest	send you a friend request	f	2023-08-11 21:38:39.324874	2023-08-11 21:38:39.324874	43	32	\N
638	friendRequest	send you a friend request	f	2023-08-11 21:38:39.493556	2023-08-11 21:38:39.493556	43	33	\N
639	friendRequest	send you a friend request	f	2023-08-11 21:38:39.643894	2023-08-11 21:38:39.643894	43	42	\N
642	friendRequest	send you a friend request	f	2023-08-11 21:38:40.141826	2023-08-11 21:38:40.141826	43	34	\N
643	friendRequest	send you a friend request	f	2023-08-11 21:38:40.308768	2023-08-11 21:38:40.308768	43	36	\N
644	friendRequest	send you a friend request	f	2023-08-11 21:38:40.451878	2023-08-11 21:38:40.451878	43	38	\N
645	friendRequest	send you a friend request	f	2023-08-11 21:38:40.632507	2023-08-11 21:38:40.632507	43	39	\N
646	friendRequest	send you a friend request	f	2023-08-11 21:38:40.799168	2023-08-11 21:38:40.799168	43	40	\N
641	friendRequest	send you a friend request	t	2023-08-11 21:38:39.981127	2023-08-11 21:38:39.981127	43	37	\N
647	friendRequestAccepted	accepted your friend request	t	2023-08-11 21:38:43.331693	2023-08-11 21:38:43.331693	37	43	\N
629	friendRequest	send you a friend request	t	2023-08-11 21:38:37.197167	2023-08-11 21:38:37.197167	43	35	\N
648	friendRequestAccepted	accepted your friend request	t	2023-08-11 21:38:45.497053	2023-08-11 21:38:45.497053	35	43	\N
640	friendRequest	send you a friend request	t	2023-08-11 21:38:39.826549	2023-08-11 21:38:39.826549	43	41	\N
649	friendRequestAccepted	accepted your friend request	t	2023-08-11 21:38:49.771331	2023-08-11 21:38:49.771331	41	43	\N
650	trophy	You win a trophy : Blitz Pong	t	2023-08-11 22:16:49.10573	2023-08-11 22:16:49.10573	\N	41	\N
651	trophy	You win a trophy : Blitz Pong	t	2023-08-11 22:16:49.123291	2023-08-11 22:16:49.123291	\N	35	\N
652	trophy	You win a trophy : Warrior	t	2023-08-11 22:17:46.253235	2023-08-11 22:17:46.253235	\N	35	\N
653	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 22:28:04.120327	2023-08-11 22:28:04.120327	\N	35	\N
654	trophy	You win a trophy : Invincible Resistant	t	2023-08-11 22:28:04.134661	2023-08-11 22:28:04.134661	\N	41	\N
655	trophy	You win a trophy : Lord	t	2023-08-11 22:29:23.37169	2023-08-11 22:29:23.37169	\N	35	\N
656	trophy	You win a trophy : Blitz Pong	t	2023-08-12 00:42:41.321918	2023-08-12 00:42:41.321918	\N	37	\N
657	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 00:42:41.33157	2023-08-12 00:42:41.33157	\N	37	\N
634	friendRequest	send you a friend request	t	2023-08-11 21:38:38.845115	2023-08-11 21:38:38.845115	43	29	\N
658	friendRequestAccepted	accepted your friend request	t	2023-08-12 14:35:40.059982	2023-08-12 14:35:40.059982	29	43	\N
536	friendRequest	send you a friend request	t	2023-08-10 21:20:29.965923	2023-08-10 21:20:29.965923	37	29	\N
659	friendRequestAccepted	accepted your friend request	t	2023-08-12 14:35:41.523822	2023-08-12 14:35:41.523822	29	37	\N
660	gameInvite	challenges you	t	2023-08-12 14:35:47.744392	2023-08-12 14:35:47.744392	29	35	/game?id=140
661	gameInviteAccepted	's challenge accepted, let's play	t	2023-08-12 14:35:50.063497	2023-08-12 14:35:50.063497	35	29	/game?id=140
662	trophy	You win a trophy : Blitz Pong	t	2023-08-12 14:36:24.553809	2023-08-12 14:36:24.553809	\N	29	\N
663	trophy	You win a trophy : Warrior	t	2023-08-12 14:36:24.562458	2023-08-12 14:36:24.562458	\N	35	\N
664	trophy	You win a trophy : Blitz Pong	t	2023-08-12 14:36:24.565416	2023-08-12 14:36:24.565416	\N	35	\N
665	trophy	You win a trophy : Lord	t	2023-08-12 14:36:52.548888	2023-08-12 14:36:52.548888	\N	35	\N
666	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:45.867476	2023-08-12 15:36:45.867476	\N	35	\N
667	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:45.889494	2023-08-12 15:36:45.889494	\N	35	\N
668	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:45.904827	2023-08-12 15:36:45.904827	\N	35	\N
669	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:45.92553	2023-08-12 15:36:45.92553	\N	35	\N
670	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:45.95583	2023-08-12 15:36:45.95583	\N	35	\N
671	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:45.979721	2023-08-12 15:36:45.979721	\N	35	\N
672	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.008055	2023-08-12 15:36:46.008055	\N	35	\N
673	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.030226	2023-08-12 15:36:46.030226	\N	35	\N
674	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.049503	2023-08-12 15:36:46.049503	\N	35	\N
675	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.063809	2023-08-12 15:36:46.063809	\N	35	\N
676	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.082673	2023-08-12 15:36:46.082673	\N	35	\N
677	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.128101	2023-08-12 15:36:46.128101	\N	35	\N
678	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.165627	2023-08-12 15:36:46.165627	\N	29	\N
679	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.211302	2023-08-12 15:36:46.211302	\N	29	\N
680	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.253875	2023-08-12 15:36:46.253875	\N	29	\N
681	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.276754	2023-08-12 15:36:46.276754	\N	29	\N
682	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.291769	2023-08-12 15:36:46.291769	\N	29	\N
683	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.304556	2023-08-12 15:36:46.304556	\N	29	\N
684	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.318219	2023-08-12 15:36:46.318219	\N	29	\N
685	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.334425	2023-08-12 15:36:46.334425	\N	29	\N
686	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.351907	2023-08-12 15:36:46.351907	\N	29	\N
687	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.371717	2023-08-12 15:36:46.371717	\N	29	\N
688	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.381948	2023-08-12 15:36:46.381948	\N	29	\N
689	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.398801	2023-08-12 15:36:46.398801	\N	29	\N
690	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.413484	2023-08-12 15:36:46.413484	\N	29	\N
691	trophy	You win a trophy : Invincible Resistant	t	2023-08-12 15:36:46.438528	2023-08-12 15:36:46.438528	\N	29	\N
692	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.725612	2023-08-12 16:28:30.725612	\N	35	\N
693	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.743232	2023-08-12 16:28:30.743232	\N	35	\N
694	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.761069	2023-08-12 16:28:30.761069	\N	35	\N
695	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.783078	2023-08-12 16:28:30.783078	\N	35	\N
696	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.803137	2023-08-12 16:28:30.803137	\N	35	\N
697	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.837547	2023-08-12 16:28:30.837547	\N	35	\N
698	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.851825	2023-08-12 16:28:30.851825	\N	35	\N
699	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.864483	2023-08-12 16:28:30.864483	\N	35	\N
700	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.879513	2023-08-12 16:28:30.879513	\N	35	\N
701	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.894616	2023-08-12 16:28:30.894616	\N	35	\N
702	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.907975	2023-08-12 16:28:30.907975	\N	35	\N
703	trophy	You win a trophy : Emperor	t	2023-08-12 16:28:30.924367	2023-08-12 16:28:30.924367	\N	35	\N
704	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.478774	2023-08-12 16:35:59.478774	\N	29	\N
705	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.500183	2023-08-12 16:35:59.500183	\N	29	\N
706	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.516557	2023-08-12 16:35:59.516557	\N	29	\N
707	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.530499	2023-08-12 16:35:59.530499	\N	29	\N
708	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.544269	2023-08-12 16:35:59.544269	\N	29	\N
709	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.552746	2023-08-12 16:35:59.552746	\N	29	\N
710	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.562596	2023-08-12 16:35:59.562596	\N	29	\N
711	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.571277	2023-08-12 16:35:59.571277	\N	29	\N
712	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.581974	2023-08-12 16:35:59.581974	\N	29	\N
713	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.595805	2023-08-12 16:35:59.595805	\N	29	\N
714	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.606535	2023-08-12 16:35:59.606535	\N	29	\N
715	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.618327	2023-08-12 16:35:59.618327	\N	29	\N
716	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.630938	2023-08-12 16:35:59.630938	\N	29	\N
717	trophy	You win a trophy : Warrior	t	2023-08-12 16:35:59.644406	2023-08-12 16:35:59.644406	\N	29	\N
718	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.478676	2023-08-12 16:36:23.478676	\N	35	\N
719	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.499152	2023-08-12 16:36:23.499152	\N	35	\N
720	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.51773	2023-08-12 16:36:23.51773	\N	35	\N
721	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.537372	2023-08-12 16:36:23.537372	\N	35	\N
722	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.558534	2023-08-12 16:36:23.558534	\N	35	\N
723	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.57155	2023-08-12 16:36:23.57155	\N	35	\N
724	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.589788	2023-08-12 16:36:23.589788	\N	35	\N
725	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.609382	2023-08-12 16:36:23.609382	\N	35	\N
726	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.620495	2023-08-12 16:36:23.620495	\N	35	\N
727	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.638197	2023-08-12 16:36:23.638197	\N	35	\N
728	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.663094	2023-08-12 16:36:23.663094	\N	35	\N
729	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.692277	2023-08-12 16:36:23.692277	\N	29	\N
730	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.707153	2023-08-12 16:36:23.707153	\N	29	\N
731	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.73197	2023-08-12 16:36:23.73197	\N	29	\N
732	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.746977	2023-08-12 16:36:23.746977	\N	29	\N
733	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.762216	2023-08-12 16:36:23.762216	\N	29	\N
734	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.774285	2023-08-12 16:36:23.774285	\N	29	\N
735	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.793255	2023-08-12 16:36:23.793255	\N	29	\N
736	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.811154	2023-08-12 16:36:23.811154	\N	29	\N
737	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.823552	2023-08-12 16:36:23.823552	\N	29	\N
738	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.841274	2023-08-12 16:36:23.841274	\N	29	\N
739	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.861381	2023-08-12 16:36:23.861381	\N	29	\N
740	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.880882	2023-08-12 16:36:23.880882	\N	29	\N
741	trophy	You win a trophy : Why Not	t	2023-08-12 16:36:23.915525	2023-08-12 16:36:23.915525	\N	29	\N
742	trophy	You win a trophy : Regular	t	2023-08-12 16:41:07.944151	2023-08-12 16:41:07.944151	\N	35	\N
743	trophy	You win a trophy : Regular	t	2023-08-12 16:41:07.978092	2023-08-12 16:41:07.978092	\N	35	\N
744	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.008717	2023-08-12 16:41:08.008717	\N	35	\N
745	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.053492	2023-08-12 16:41:08.053492	\N	35	\N
746	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.084802	2023-08-12 16:41:08.084802	\N	35	\N
747	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.107037	2023-08-12 16:41:08.107037	\N	35	\N
748	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.1662	2023-08-12 16:41:08.1662	\N	35	\N
749	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.20134	2023-08-12 16:41:08.20134	\N	35	\N
750	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.229907	2023-08-12 16:41:08.229907	\N	35	\N
751	trophy	You win a trophy : Regular	t	2023-08-12 16:41:08.256694	2023-08-12 16:41:08.256694	\N	35	\N
\.


--
-- Data for Name: trophies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trophies (id, name, description, "imagePath", total) FROM stdin;
420	Lord	Win 5 games in a row	lord.jpeg	5
421	Emperor	Win 10 games in a row	emperor.jpeg	10
422	Laser Pointer	Kill an opponent with a Laser	laser_pointer.jpeg	0
423	Gamma Laser	Kill 5 opponents with a laser	gamma_laser.jpeg	5
424	Scorificator	Kill 10 opponents with a laser	scorificator.jpeg	10
425	Regular	Play 20 games	regular.jpeg	20
426	Addict	Play 50 games	addict.jpeg	50
427	NoLife	Play 100 games	nolife.jpeg	100
428	Bonus Master	Use 3 bonuses in one game	bonus_master.jpeg	3
429	Bonus Pro	Use 5 bonuses in one game	bonus_pro.jpeg	5
430	Bonus Cheater	Use 10 bonuses in one game	bonus_cheater.jpeg	10
431	Pong-tastic	Win 5 games without missing a single ball	pong_tastic.jpeg	5
432	Tireless Returner	Return the ball 10 times in a row without it touching the sides	tireless_returner.jpeg	10
433	Why Not	Win a bonus game without using any bonuses	why_not.jpeg	0
434	Ping King	Score a point when the ball is at high speed	ping_king.jpeg	0
435	Faster Than Light	Score a point when the ball is at maximum speed	faster_than_light.jpeg	0
436	Blitz Pong	Win a game in less than 2 minutes	blitz_pong.jpeg	0
437	Invincible Resistant	Win a game without losing a single point	invincible_resistant.jpeg	0
438	Point Prospector	Win a game with a minimum of 30 points scored	point_prospector.jpeg	30
419	Warrior	Win 3 games in a row	warrior.jpeg	3
\.


--
-- Data for Name: trophies_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trophies_progress (id, progress, total, "userId", "trophyId") FROM stdin;
3057	0	0	0	419
3058	0	5	0	420
3059	0	10	0	421
3060	0	0	0	422
3061	0	5	0	423
3062	0	10	0	424
3063	0	20	0	425
3064	0	50	0	426
3065	0	100	0	427
3066	0	3	0	428
3067	0	5	0	429
3068	0	10	0	430
3069	0	5	0	431
3070	0	10	0	432
3071	0	0	0	433
3072	0	0	0	434
3073	0	0	0	435
3074	0	0	0	436
3075	0	0	0	437
3076	0	30	0	438
3077	0	0	25	419
3078	0	5	25	420
3079	0	10	25	421
3080	0	0	25	422
3081	0	5	25	423
3082	0	10	25	424
3083	0	20	25	425
3084	0	50	25	426
3085	0	100	25	427
3086	0	3	25	428
3087	0	5	25	429
3088	0	10	25	430
3089	0	5	25	431
3090	0	10	25	432
3091	0	0	25	433
3092	0	0	25	434
3093	0	0	25	435
3094	0	0	25	436
3095	0	0	25	437
3096	0	30	25	438
3097	0	0	26	419
3098	0	5	26	420
3099	0	10	26	421
3100	0	0	26	422
3101	0	5	26	423
3102	0	10	26	424
3103	0	20	26	425
3104	0	50	26	426
3105	0	100	26	427
3106	0	3	26	428
3107	0	5	26	429
3108	0	10	26	430
3109	0	5	26	431
3110	0	10	26	432
3111	0	0	26	433
3112	0	0	26	434
3113	0	0	26	435
3114	0	0	26	436
3115	0	0	26	437
3116	0	30	26	438
3117	0	0	27	419
3118	0	5	27	420
3119	0	10	27	421
3120	0	0	27	422
3121	0	5	27	423
3122	0	10	27	424
3123	0	20	27	425
3124	0	50	27	426
3125	0	100	27	427
3126	0	3	27	428
3127	0	5	27	429
3128	0	10	27	430
3129	0	5	27	431
3130	0	10	27	432
3131	0	0	27	433
3132	0	0	27	434
3133	0	0	27	435
3134	0	0	27	436
3135	0	0	27	437
3136	0	30	27	438
3137	0	0	28	419
3138	0	5	28	420
3139	0	10	28	421
3140	0	0	28	422
3141	0	5	28	423
3142	0	10	28	424
3143	0	20	28	425
3144	0	50	28	426
3145	0	100	28	427
3146	0	3	28	428
3147	0	5	28	429
3148	0	10	28	430
3149	0	5	28	431
3150	0	10	28	432
3151	0	0	28	433
3152	0	0	28	434
3153	0	0	28	435
3154	0	0	28	436
3155	0	0	28	437
3156	0	30	28	438
3160	0	0	29	422
3161	0	5	29	423
3162	0	10	29	424
3166	0	3	29	428
3167	0	5	29	429
3168	0	10	29	430
3169	0	5	29	431
3170	0	10	29	432
3171	0	0	29	433
3172	0	0	29	434
3173	0	0	29	435
3174	0	0	29	436
3175	0	0	29	437
3177	0	0	30	419
3178	0	5	30	420
3179	0	10	30	421
3180	0	0	30	422
3181	0	5	30	423
3182	0	10	30	424
3183	0	20	30	425
3184	0	50	30	426
3185	0	100	30	427
3186	0	3	30	428
3187	0	5	30	429
3188	0	10	30	430
3189	0	5	30	431
3190	0	10	30	432
3191	0	0	30	433
3192	0	0	30	434
3158	4	5	29	420
3163	12	20	29	425
3157	4	0	29	419
3164	12	50	29	426
3165	12	100	29	427
3193	0	0	30	435
3194	0	0	30	436
3195	0	0	30	437
3196	0	30	30	438
3197	0	0	31	419
3198	0	5	31	420
3199	0	10	31	421
3200	0	0	31	422
3201	0	5	31	423
3202	0	10	31	424
3203	0	20	31	425
3204	0	50	31	426
3205	0	100	31	427
3206	0	3	31	428
3207	0	5	31	429
3208	0	10	31	430
3209	0	5	31	431
3210	0	10	31	432
3211	0	0	31	433
3212	0	0	31	434
3213	0	0	31	435
3214	0	0	31	436
3215	0	0	31	437
3216	0	30	31	438
3217	0	0	32	419
3218	0	5	32	420
3219	0	10	32	421
3220	0	0	32	422
3221	0	5	32	423
3222	0	10	32	424
3223	0	20	32	425
3224	0	50	32	426
3225	0	100	32	427
3226	0	3	32	428
3227	0	5	32	429
3228	0	10	32	430
3229	0	5	32	431
3230	0	10	32	432
3231	0	0	32	433
3232	0	0	32	434
3233	0	0	32	435
3234	0	0	32	436
3235	0	0	32	437
3236	0	30	32	438
3237	0	0	33	419
3238	0	5	33	420
3239	0	10	33	421
3240	0	0	33	422
3241	0	5	33	423
3242	0	10	33	424
3243	0	20	33	425
3244	0	50	33	426
3245	0	100	33	427
3246	0	3	33	428
3247	0	5	33	429
3248	0	10	33	430
3249	0	5	33	431
3250	0	10	33	432
3251	0	0	33	433
3252	0	0	33	434
3253	0	0	33	435
3254	0	0	33	436
3255	0	0	33	437
3256	0	30	33	438
3257	0	0	42	419
3258	0	5	42	420
3259	0	10	42	421
3260	0	0	42	422
3261	0	5	42	423
3262	0	10	42	424
3263	0	20	42	425
3264	0	50	42	426
3265	0	100	42	427
3266	0	3	42	428
3267	0	5	42	429
3268	0	10	42	430
3269	0	5	42	431
3270	0	10	42	432
3271	0	0	42	433
3272	0	0	42	434
3273	0	0	42	435
3274	0	0	42	436
3275	0	0	42	437
3276	0	30	42	438
3277	0	0	34	419
3278	0	5	34	420
3279	0	10	34	421
3280	0	0	34	422
3281	0	5	34	423
3282	0	10	34	424
3283	0	20	34	425
3284	0	50	34	426
3285	0	100	34	427
3286	0	3	34	428
3287	0	5	34	429
3288	0	10	34	430
3289	0	5	34	431
3290	0	10	34	432
3291	0	0	34	433
3292	0	0	34	434
3293	0	0	34	435
3294	0	0	34	436
3295	0	0	34	437
3296	0	30	34	438
3297	0	0	36	419
3298	0	5	36	420
3299	0	10	36	421
3300	0	0	36	422
3301	0	5	36	423
3302	0	10	36	424
3303	0	20	36	425
3304	0	50	36	426
3305	0	100	36	427
3306	0	3	36	428
3307	0	5	36	429
3308	0	10	36	430
3309	0	5	36	431
3310	0	10	36	432
3311	0	0	36	433
3312	0	0	36	434
3313	0	0	36	435
3314	0	0	36	436
3315	0	0	36	437
3316	0	30	36	438
3317	0	0	38	419
3318	0	5	38	420
3319	0	10	38	421
3320	0	0	38	422
3321	0	5	38	423
3322	0	10	38	424
3323	0	20	38	425
3324	0	50	38	426
3325	0	100	38	427
3326	0	3	38	428
3327	0	5	38	429
3328	0	10	38	430
3329	0	5	38	431
3330	0	10	38	432
3331	0	0	38	433
3332	0	0	38	434
3333	0	0	38	435
3334	0	0	38	436
3335	0	0	38	437
3336	0	30	38	438
3337	0	0	39	419
3338	0	5	39	420
3339	0	10	39	421
3340	0	0	39	422
3341	0	5	39	423
3342	0	10	39	424
3343	0	20	39	425
3344	0	50	39	426
3345	0	100	39	427
3346	0	3	39	428
3347	0	5	39	429
3348	0	10	39	430
3349	0	5	39	431
3350	0	10	39	432
3351	0	0	39	433
3352	0	0	39	434
3353	0	0	39	435
3354	0	0	39	436
3355	0	0	39	437
3356	0	30	39	438
3357	0	0	40	419
3358	0	5	40	420
3359	0	10	40	421
3360	0	0	40	422
3361	0	5	40	423
3362	0	10	40	424
3363	0	20	40	425
3364	0	50	40	426
3365	0	100	40	427
3366	0	3	40	428
3367	0	5	40	429
3368	0	10	40	430
3369	0	5	40	431
3370	0	10	40	432
3371	0	0	40	433
3372	0	0	40	434
3373	0	0	40	435
3374	0	0	40	436
3375	0	0	40	437
3376	0	30	40	438
3377	0	0	43	419
3378	0	5	43	420
3379	0	10	43	421
3380	0	0	43	422
3381	0	5	43	423
3382	0	10	43	424
3383	0	20	43	425
3384	0	50	43	426
3385	0	100	43	427
3386	0	3	43	428
3387	0	5	43	429
3388	0	10	43	430
3389	0	5	43	431
3390	0	10	43	432
3391	0	0	43	433
3392	0	0	43	434
3393	0	0	43	435
3394	0	0	43	436
3395	0	0	43	437
3396	0	30	43	438
3397	0	0	41	419
3398	0	5	41	420
3399	0	10	41	421
3400	0	0	41	422
3401	0	5	41	423
3402	0	10	41	424
3403	0	20	41	425
3404	0	50	41	426
3405	0	100	41	427
3406	0	3	41	428
3407	0	5	41	429
3408	0	10	41	430
3409	0	5	41	431
3410	0	10	41	432
3411	0	0	41	433
3412	0	0	41	434
3413	0	0	41	435
3414	0	0	41	436
3415	0	0	41	437
3416	0	30	41	438
3417	0	0	35	419
3418	0	5	35	420
3420	0	0	35	422
3421	0	5	35	423
3422	0	10	35	424
3423	0	20	35	425
3426	0	3	35	428
3427	0	5	35	429
3428	0	10	35	430
3429	0	5	35	431
3430	0	10	35	432
3431	0	0	35	433
3432	0	0	35	434
3433	0	0	35	435
3434	0	0	35	436
3435	0	0	35	437
3437	0	0	37	419
3438	0	5	37	420
3439	0	10	37	421
3440	0	0	37	422
3441	0	5	37	423
3442	0	10	37	424
3443	0	20	37	425
3444	0	50	37	426
3445	0	100	37	427
3446	0	3	37	428
3447	0	5	37	429
3448	0	10	37	430
3449	0	5	37	431
3450	0	10	37	432
3451	0	0	37	433
3452	0	0	37	434
3453	0	0	37	435
3454	0	0	37	436
3455	0	0	37	437
3456	0	30	37	438
3419	11	10	35	421
3436	2	30	35	438
3424	21	50	35	426
3425	21	100	35	427
3176	2	30	29	438
3159	4	10	29	421
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt", "lastActivity", score, level, experience, "gamesPlayed", "consecutiveWin", "laserKill", "bonusUsed", "numberOfConsecutiveWins", "numberOfEnemiesKilledWithLaser", "numberOfGamesPlayed", "numberOfGamesWonWithoutMissingBall") FROM stdin;
29	Darrin	Kirlin	Laron76	Furman_Buckridge-Gusikowski@gmail.com	$2b$10$c1j721RAxyGoIukxRC5suu2ALUFfYV2XoH51h8rryg7U1k40YmC/2	user	https://avatars.githubusercontent.com/u/82350039	Quis blanditiis vel aut repellendus atque itaque.	f	offline	\N	2023-06-19 18:24:15.304727	2023-08-12 19:09:50.518	2023-08-12 17:08:51.45	1460	2	30	0	0	0	0	0	0	12	0
44	Bot	Bot	bot	nomail@bot.bot	\N	user	https://t3.ftcdn.net/jpg/01/36/49/90/360_F_136499077_xp7bSQB4Dx13ktQp0OYJ5ricWXhiFtD2.jpg	I am a bot	f	online	\N	2023-08-12 21:09:13.093063	2023-08-12 21:09:13.093063	2023-08-12 21:09:13.093063	1500	1	0	0	0	0	0	0	0	0	0
0	Bot	Bot	Bot	bla@gmail.com	\N	user	https://t3.ftcdn.net/jpg/01/36/49/90/360_F_136499077_xp7bSQB4Dx13ktQp0OYJ5ricWXhiFtD2.jpg	\N	t	offline	\N	2023-06-18 23:09:10.083889	2023-06-18 23:09:10.083889	2023-06-18 23:09:10.083889	1500	1	0	0	0	0	0	0	0	0	0
25	Leila	Kessler	Lynn6	Cynthia4@yahoo.com	$2b$10$i3n6ue9OCkjOq5fezKOClunOOY7EhllA65vdYe0o9/zP9EEw9Nxyu	user	https://avatars.githubusercontent.com/u/41298539	Placeat aliquam iure eum.	f	offline	\N	2023-06-19 18:24:15.049995	2023-06-20 16:16:46.52	2023-06-19 19:47:29.461	1500	1	0	0	0	0	0	0	0	0	0
26	Violette	Beahan	Angelina93	Cali.Halvorson71@hotmail.com	$2b$10$c7fuqdKwSmloYW70MiVILe7LCQc2U56P18n7Q3fjUtr9rk3Po11FW	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/33.jpg	Neque eveniet ullam quia vitae esse facere.	f	offline	\N	2023-06-19 18:24:15.117241	2023-06-19 18:24:15.117241	2023-06-19 18:24:15.117241	1500	1	0	0	0	0	0	0	0	0	0
27	Rhianna	Hoppe	Randi.Bruen-Lakin	Katarina50@hotmail.com	$2b$10$sVfIx5EnyQslMSrSohv6Gei0BQkHqOlPOJ6wwO24Ig8i/ULVDmxpm	user	https://avatars.githubusercontent.com/u/58112789	Tenetur fugiat eveniet exercitationem repellendus fuga temporibus numquam accusamus.	f	offline	\N	2023-06-19 18:24:15.1809	2023-08-10 18:30:13.873	2023-06-23 02:22:02.005	1500	1	0	0	0	0	0	0	0	0	0
28	Christopher	Huels-Anderson	Jordane_Flatley54	Mabelle.Kshlerin-OKon@yahoo.com	$2b$10$pUcwY5cToAxvZ69ynmL8p.X3t/Vqi6..bdLY10px5m6Osp2/G8Fvm	user	https://avatars.githubusercontent.com/u/72724821	Occaecati quia sunt eligendi illo maxime minima debitis.	f	offline	\N	2023-06-19 18:24:15.244542	2023-06-19 18:24:15.244542	2023-06-19 18:24:15.244542	1500	1	0	0	0	0	0	0	0	0	0
30	Johnny	Bayer	Eula_Weber	Ashleigh.Gulgowski@yahoo.com	$2b$10$X8N/Xjc.uQ0y1t2eeMZyYeDkQ/5bDIJb.BG6d/r4fS1f93SLzBNsS	user	https://avatars.githubusercontent.com/u/83549509	Aperiam pariatur repudiandae rem culpa.	f	offline	\N	2023-06-19 18:24:15.38792	2023-06-19 18:24:15.38792	2023-06-19 18:24:15.38792	1500	1	0	0	0	0	0	0	0	0	0
31	Eula	Kutch	Libbie36	Jerod_Kutch@hotmail.com	$2b$10$eoTi/n5NDntYwtnuGhDSbeqtML6cYeaAa3RzizGIf6.Zv0yROS0Wu	user	https://avatars.githubusercontent.com/u/11865065	Quas dolor sequi harum numquam.	f	offline	\N	2023-06-19 18:24:15.468936	2023-06-19 18:24:15.468936	2023-06-19 18:24:15.468936	1500	1	0	0	0	0	0	0	0	0	0
32	Naomi	Runolfsson	Grayce_Dach	Margarita.Mosciski3@hotmail.com	$2b$10$iSNxAAh5CQWmpCLa7IaUM.Ykl2rRdFhEPtKNJ0V2mpC.nbvwgV6aq	user	https://avatars.githubusercontent.com/u/72204078	Iure laborum perspiciatis tenetur totam.	f	offline	\N	2023-06-19 18:24:15.542461	2023-08-10 18:30:14.107	2023-06-23 02:22:01.732	1500	1	0	0	0	0	0	0	0	0	0
33	Edwin	Wolf	Johanna73	Tressa_Beier@yahoo.com	$2b$10$ZW4WtRV4610xn/YF7u1Kvu6aX3tNJsbx/pwlmWC8pWk55XA8rtn4S	user	https://avatars.githubusercontent.com/u/48188922	Reiciendis quod asperiores odit earum magni itaque.	f	offline	\N	2023-06-19 18:24:15.60468	2023-06-19 18:24:15.60468	2023-06-19 18:24:15.60468	1500	1	0	0	0	0	0	0	0	0	0
42	Dianna	Dach	Johanna_Ledner71	Karen_Keebler26@yahoo.com	$2b$10$sdYbWik.ww/at6TzLXktZu3whblgAeCVwqbjwYU5Mpw3D3GUwhFzS	user	http://localhost:3000/avatars/avatar-1691714062004-781316.jpg	Ipsam enim a nesciunt autem necessitatibus quos quod.	f	offline	\N	2023-08-10 22:50:48.386448	2023-08-11 16:11:34.08	2023-08-11 14:10:38.233	1500	1	0	0	0	0	0	0	0	0	0
34	Shaina	Bergnaum	Ivy_Heller	Shawna_Schmitt@gmail.com	$2b$10$OOc2nVoZ67Acj3oxHKEDrecPIXbzLmEzSxFONgPjiOGuIPj6yW8MO	user	https://avatars.githubusercontent.com/u/87908182	Perferendis inventore culpa impedit.	f	offline	\N	2023-06-19 18:24:15.668621	2023-06-19 18:24:15.668621	2023-06-19 18:24:15.668621	1500	1	0	0	0	0	0	0	0	0	0
36	Chaim	Shields	Jazmin.Barrows	Eleanora_Leffler@yahoo.com	$2b$10$iDVCtJRwtxPtr7syvR52R.LM6OeLGD9DopNnZHO7TLx2gDGLAJuw6	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/581.jpg	Atque inventore iusto.	f	offline	\N	2023-06-23 01:48:13.337563	2023-06-23 01:48:13.337563	2023-06-23 01:48:13.337563	1500	1	0	0	0	0	0	0	0	0	0
38	Uriah	VonRueden	Kaelyn.Heathcote	Effie17@hotmail.com	$2b$10$mgKAY9GHrGKl/fE1gebv1ObP8u5EhFpLo8EmWIpHP5K3kKZl3ciGu	user	https://avatars.githubusercontent.com/u/39319990	Laudantium non quam provident laborum doloremque maiores quis.	f	offline	\N	2023-06-23 01:48:13.469143	2023-06-23 01:48:13.469143	2023-06-23 01:48:13.469143	1500	1	0	0	0	0	0	0	0	0	0
39	Rebekah	Sipes	Julian.Nienow69	Ed_Hamill97@gmail.com	$2b$10$/0yQUcg84GQldgZiYVrHr.CmSJgHgF1WknBSl8acL72UiiT3zBVXa	user	https://avatars.githubusercontent.com/u/93676085	At dolores deleniti totam.	f	offline	\N	2023-06-23 01:48:13.534414	2023-06-23 02:17:06.056	2023-06-23 02:17:06.05	1500	1	0	0	0	0	0	0	0	0	0
40	Krystina	Hilpert	Darlene75	Buddy24@hotmail.com	$2b$10$HFfxMguBAFAUAg0Wimv7y.V98/ZiZcSZto/8GkowfHBc3ghlusr1e	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/568.jpg	Perferendis velit cupiditate dolor tempore dolores doloremque distinctio illum.	f	offline	\N	2023-06-23 01:48:13.59588	2023-06-23 01:48:13.59588	2023-06-23 01:48:13.59588	1500	1	0	0	0	0	0	0	0	0	0
43	Breanne	Zulauf	Audra.Greenfelder	Bennie_Rolfson@yahoo.com	$2b$10$q.2UJcsaT9Kn0o2u2/RGk.BeUdcD4W/cqNyxsrmzIWLG2VthEZN8.	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/545.jpg	Facere reprehenderit iusto ullam.	f	offline	\N	2023-08-11 21:38:00.699852	2023-08-12 01:05:53.201	2023-08-12 01:05:53.153	1500	1	0	0	0	0	0	0	0	0	0
41	Boris	Franey	Coralie84	Margie95@gmail.com	$2b$10$wsNdsI6f.COrlnx.CYk1cu4.T.KA1xVK3vtwBINek0Tc9jt273k9W	user	http://localhost:3000/avatars/avatar-1691703574808-325166.jpg	Nam ipsa velit adipisci cum alias mollitia.	f	offline	\N	2023-08-10 20:49:38.666801	2023-08-12 02:29:55.698	2023-08-12 00:29:08.424	1426	1	10	0	0	0	0	0	0	8	0
35	Jean-michel	Rasser	jrasser	jrasser@student.42mulhouse.fr	\N	user	http://localhost:3000/avatars/avatar-1687278288385-749758.jpg	\N	f	offline	\N	2023-06-20 16:24:48.481926	2023-08-12 20:59:50.521	2023-08-12 18:59:16.742	1576	4	160	0	0	0	0	4	0	21	0
37	Rosa	Howe	Elsie.Hirthe74	Lowell20@hotmail.com	$2b$10$regtloEiaCuv11GAg//I5uEco6anmsPYjPCahN7ARW5tkkI/Lrk7e	user	https://avatars.githubusercontent.com/u/9337675	Culpa delectus fugiat.	f	offline	\N	2023-06-23 01:48:13.405836	2023-08-12 02:53:03.718	2023-08-12 00:52:23.244	1518	1	10	0	0	0	0	2	0	1	0
\.


--
-- Data for Name: users_relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."users_relation" (id, "relationType", "createdAt", "updatedAt", "userRelationId", "mutuelBlocked", "userInitiateurId") FROM stdin;
155	friend	2023-06-21 12:39:49.181625	2023-06-21 12:46:25.84	32	f	35
157	friend	2023-06-22 20:47:19.805364	2023-06-22 20:47:24.461	35	f	29
154	friend	2023-06-21 12:39:48.486107	2023-06-23 00:54:14.158	27	f	35
147	pending	2023-06-21 12:39:43.541252	2023-06-21 12:39:43.541252	26	f	35
148	pending	2023-06-21 12:39:45.065379	2023-06-21 12:39:45.065379	28	f	35
149	pending	2023-06-21 12:39:45.91519	2023-06-21 12:39:45.91519	30	f	35
150	pending	2023-06-21 12:39:46.499905	2023-06-21 12:39:46.499905	31	f	35
151	pending	2023-06-21 12:39:47.033559	2023-06-21 12:39:47.033559	33	f	35
152	pending	2023-06-21 12:39:47.574196	2023-06-21 12:39:47.574196	34	f	35
153	pending	2023-06-21 12:39:47.885413	2023-06-21 12:39:47.885413	25	f	35
205	pending	2023-08-11 21:38:38.984453	2023-08-11 21:38:38.984453	30	f	43
206	pending	2023-08-11 21:38:39.162695	2023-08-11 21:38:39.162695	31	f	43
207	pending	2023-08-11 21:38:39.321048	2023-08-11 21:38:39.321048	32	f	43
208	pending	2023-08-11 21:38:39.489341	2023-08-11 21:38:39.489341	33	f	43
209	pending	2023-08-11 21:38:39.640974	2023-08-11 21:38:39.640974	42	f	43
212	pending	2023-08-11 21:38:40.137366	2023-08-11 21:38:40.137366	34	f	43
213	pending	2023-08-11 21:38:40.303573	2023-08-11 21:38:40.303573	36	f	43
214	pending	2023-08-11 21:38:40.449831	2023-08-11 21:38:40.449831	38	f	43
215	pending	2023-08-11 21:38:40.62913	2023-08-11 21:38:40.62913	39	f	43
166	pending	2023-08-10 21:19:48.140986	2023-08-10 21:19:48.140986	36	f	35
168	pending	2023-08-10 21:19:48.473435	2023-08-10 21:19:48.473435	38	f	35
169	pending	2023-08-10 21:19:48.636798	2023-08-10 21:19:48.636798	40	f	35
170	pending	2023-08-10 21:19:48.796267	2023-08-10 21:19:48.796267	39	f	35
216	pending	2023-08-11 21:38:40.796222	2023-08-11 21:38:40.796222	40	f	43
171	pending	2023-08-10 21:20:28.276465	2023-08-10 21:20:28.276465	26	f	37
172	pending	2023-08-10 21:20:28.402763	2023-08-10 21:20:28.402763	28	f	37
173	pending	2023-08-10 21:20:28.554531	2023-08-10 21:20:28.554531	30	f	37
174	pending	2023-08-10 21:20:28.715532	2023-08-10 21:20:28.715532	31	f	37
175	pending	2023-08-10 21:20:28.962612	2023-08-10 21:20:28.962612	33	f	37
176	pending	2023-08-10 21:20:29.106776	2023-08-10 21:20:29.106776	34	f	37
177	pending	2023-08-10 21:20:29.24179	2023-08-10 21:20:29.24179	25	f	37
178	pending	2023-08-10 21:20:29.385616	2023-08-10 21:20:29.385616	36	f	37
179	pending	2023-08-10 21:20:29.529664	2023-08-10 21:20:29.529664	38	f	37
180	pending	2023-08-10 21:20:29.683413	2023-08-10 21:20:29.683413	40	f	37
181	pending	2023-08-10 21:20:29.826338	2023-08-10 21:20:29.826338	39	f	37
183	pending	2023-08-10 21:20:30.114666	2023-08-10 21:20:30.114666	27	f	37
184	pending	2023-08-10 21:20:30.266666	2023-08-10 21:20:30.266666	32	f	37
211	friend	2023-08-11 21:38:39.978453	2023-08-11 21:38:43.325	37	f	43
186	friend	2023-08-10 21:21:51.554569	2023-08-10 21:21:52.945	41	f	37
187	friend	2023-08-10 21:23:12.954653	2023-08-10 21:23:15.752	37	f	35
199	friend	2023-08-11 21:38:37.188791	2023-08-11 21:38:45.492	35	f	43
210	friend	2023-08-11 21:38:39.813224	2023-08-11 21:38:49.767	41	f	43
204	friend	2023-08-11 21:38:38.842016	2023-08-12 14:35:40.056	29	f	43
182	friend	2023-08-10 21:20:29.963108	2023-08-12 14:35:41.52	29	f	37
197	blocked	2023-08-11 00:35:12.371076	2023-08-11 00:35:57.874	35	f	42
198	friend	2023-08-11 15:00:14.917845	2023-08-11 15:00:16.957	35	f	41
200	pending	2023-08-11 21:38:37.940391	2023-08-11 21:38:37.940391	25	f	43
201	pending	2023-08-11 21:38:38.238914	2023-08-11 21:38:38.238914	26	f	43
202	pending	2023-08-11 21:38:38.546241	2023-08-11 21:38:38.546241	27	f	43
203	pending	2023-08-11 21:38:38.680863	2023-08-11 21:38:38.680863	28	f	43
\.


--
-- Data for Name: users_trophies_trophies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_trophies_trophies ("usersId", "trophiesId") FROM stdin;
29	436
35	419
35	436
35	420
35	437
29	437
35	421
29	419
35	433
29	433
35	425
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 2806, true);


--
-- Name: chat_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_rooms_id_seq', 93, true);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_id_seq', 151, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 259, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 751, true);


--
-- Name: trophies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trophies_id_seq', 438, true);


--
-- Name: trophies_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trophies_progress_id_seq', 3456, true);


--
-- Name: users_relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users_relation_id_seq"', 216, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 53, true);


--
-- Name: chat_rooms_banned_users_users PK_002acbb7765d4bc597bebda260e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_banned_users_users
    ADD CONSTRAINT "PK_002acbb7765d4bc597bebda260e" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: messages PK_18325f38ae6de43878487eff986; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY (id);


--
-- Name: chat_rooms_accepted_users_users PK_236a7e9e1aa4ed451c3029678b1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_accepted_users_users
    ADD CONSTRAINT "PK_236a7e9e1aa4ed451c3029678b1" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat_rooms_users_users PK_322f8949ef5a849ff041b908570; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_users_users
    ADD CONSTRAINT "PK_322f8949ef5a849ff041b908570" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat_messages PK_40c55ee0e571e268b0d3cd37d10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY (id);


--
-- Name: trophies PK_637daf936e7ee2633533bebd31f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trophies
    ADD CONSTRAINT "PK_637daf936e7ee2633533bebd31f" PRIMARY KEY (id);


--
-- Name: users_relation PK_6973ffe5e4128326da10a9527d1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users_relation"
    ADD CONSTRAINT "PK_6973ffe5e4128326da10a9527d1" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: chat_rooms_admins_users PK_7f9c3dc75597a20df1fc0a7eb44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_admins_users
    ADD CONSTRAINT "PK_7f9c3dc75597a20df1fc0a7eb44" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat_rooms_muted_users_users PK_92fa2c0b7f5181e413edb8b4a7f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_muted_users_users
    ADD CONSTRAINT "PK_92fa2c0b7f5181e413edb8b4a7f" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: chat_rooms PK_c69082bd83bffeb71b0f455bd59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms
    ADD CONSTRAINT "PK_c69082bd83bffeb71b0f455bd59" PRIMARY KEY (id);


--
-- Name: games PK_c9b16b62917b5595af982d66337; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY (id);


--
-- Name: trophies_progress PK_c9e42f7242172d838e09acfab94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trophies_progress
    ADD CONSTRAINT "PK_c9e42f7242172d838e09acfab94" PRIMARY KEY (id);


--
-- Name: users_trophies_trophies PK_dc465c6183cc813bf2c13986937; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_trophies_trophies
    ADD CONSTRAINT "PK_dc465c6183cc813bf2c13986937" PRIMARY KEY ("usersId", "trophiesId");


--
-- Name: users UQ_2d443082eccd5198f95f2a36e2c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE (login);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: IDX_2f84533b2af9f55150300e93fb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2f84533b2af9f55150300e93fb" ON public.chat_rooms_users_users USING btree ("chatRoomsId");


--
-- Name: IDX_3eb1543ae1d1b81c09a4b151e8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3eb1543ae1d1b81c09a4b151e8" ON public.chat_rooms_banned_users_users USING btree ("chatRoomsId");


--
-- Name: IDX_444df0df5e3ecd89efb686169b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_444df0df5e3ecd89efb686169b" ON public.chat_rooms_users_users USING btree ("usersId");


--
-- Name: IDX_44c3e4a7e33f71d52c2cb0a785; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_44c3e4a7e33f71d52c2cb0a785" ON public.users_trophies_trophies USING btree ("usersId");


--
-- Name: IDX_45f7673d36bd1985debccd7a2e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_45f7673d36bd1985debccd7a2e" ON public.users_trophies_trophies USING btree ("trophiesId");


--
-- Name: IDX_47e2c338a75bf1326bb5e4c21a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_47e2c338a75bf1326bb5e4c21a" ON public.chat_rooms_admins_users USING btree ("chatRoomsId");


--
-- Name: IDX_4c9b4e81136873c57158f2da6d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4c9b4e81136873c57158f2da6d" ON public.chat_rooms_muted_users_users USING btree ("chatRoomsId");


--
-- Name: IDX_862d467e839174d634aa9e7bd5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_862d467e839174d634aa9e7bd5" ON public.chat_rooms_admins_users USING btree ("usersId");


--
-- Name: IDX_88ad92a32dd70cf8bb4803c5ce; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_88ad92a32dd70cf8bb4803c5ce" ON public.chat_rooms_accepted_users_users USING btree ("chatRoomsId");


--
-- Name: IDX_8a2692a8f59a4d6b154509e3a9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_8a2692a8f59a4d6b154509e3a9" ON public.chat_rooms_muted_users_users USING btree ("usersId");


--
-- Name: IDX_97165bdd00364de79a7837c38c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_97165bdd00364de79a7837c38c" ON public.chat_rooms_banned_users_users USING btree ("usersId");


--
-- Name: IDX_97c390e700263fb405a48f8a18; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_97c390e700263fb405a48f8a18" ON public.chat_rooms_accepted_users_users USING btree ("usersId");


--
-- Name: users_relation FK_0402056c5d34c9eb988252444d9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users_relation"
    ADD CONSTRAINT "FK_0402056c5d34c9eb988252444d9" FOREIGN KEY ("userInitiateurId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: games FK_090ead4cf0688537043f35b569e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_090ead4cf0688537043f35b569e" FOREIGN KEY ("player2Id") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages FK_0fb1705612cf4af24c26d1a21eb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_0fb1705612cf4af24c26d1a21eb" FOREIGN KEY ("ownerUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages FK_1c522cb7567a307ebcc15cf773b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "FK_1c522cb7567a307ebcc15cf773b" FOREIGN KEY ("ownerUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: trophies_progress FK_2af5d79644dd29af544eb57e323; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trophies_progress
    ADD CONSTRAINT "FK_2af5d79644dd29af544eb57e323" FOREIGN KEY ("trophyId") REFERENCES public.trophies(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_users_users FK_2f84533b2af9f55150300e93fbc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_users_users
    ADD CONSTRAINT "FK_2f84533b2af9f55150300e93fbc" FOREIGN KEY ("chatRoomsId") REFERENCES public.chat_rooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_rooms_banned_users_users FK_3eb1543ae1d1b81c09a4b151e82; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_banned_users_users
    ADD CONSTRAINT "FK_3eb1543ae1d1b81c09a4b151e82" FOREIGN KEY ("chatRoomsId") REFERENCES public.chat_rooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_rooms_users_users FK_444df0df5e3ecd89efb686169b5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_users_users
    ADD CONSTRAINT "FK_444df0df5e3ecd89efb686169b5" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_trophies_trophies FK_44c3e4a7e33f71d52c2cb0a7857; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_trophies_trophies
    ADD CONSTRAINT "FK_44c3e4a7e33f71d52c2cb0a7857" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_trophies_trophies FK_45f7673d36bd1985debccd7a2e9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_trophies_trophies
    ADD CONSTRAINT "FK_45f7673d36bd1985debccd7a2e9" FOREIGN KEY ("trophiesId") REFERENCES public.trophies(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_admins_users FK_47e2c338a75bf1326bb5e4c21a1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_admins_users
    ADD CONSTRAINT "FK_47e2c338a75bf1326bb5e4c21a1" FOREIGN KEY ("chatRoomsId") REFERENCES public.chat_rooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_rooms_muted_users_users FK_4c9b4e81136873c57158f2da6dd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_muted_users_users
    ADD CONSTRAINT "FK_4c9b4e81136873c57158f2da6dd" FOREIGN KEY ("chatRoomsId") REFERENCES public.chat_rooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_relation FK_718040c5303bad75d9908ee7fc0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users_relation"
    ADD CONSTRAINT "FK_718040c5303bad75d9908ee7fc0" FOREIGN KEY ("userRelationId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: games FK_75fbf4e5d917a20839c96ccda03; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_75fbf4e5d917a20839c96ccda03" FOREIGN KEY ("player1Id") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_admins_users FK_862d467e839174d634aa9e7bd58; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_admins_users
    ADD CONSTRAINT "FK_862d467e839174d634aa9e7bd58" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_accepted_users_users FK_88ad92a32dd70cf8bb4803c5ce9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_accepted_users_users
    ADD CONSTRAINT "FK_88ad92a32dd70cf8bb4803c5ce9" FOREIGN KEY ("chatRoomsId") REFERENCES public.chat_rooms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_rooms_muted_users_users FK_8a2692a8f59a4d6b154509e3a98; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_muted_users_users
    ADD CONSTRAINT "FK_8a2692a8f59a4d6b154509e3a98" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_banned_users_users FK_97165bdd00364de79a7837c38cc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_banned_users_users
    ADD CONSTRAINT "FK_97165bdd00364de79a7837c38cc" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_accepted_users_users FK_97c390e700263fb405a48f8a185; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms_accepted_users_users
    ADD CONSTRAINT "FK_97c390e700263fb405a48f8a185" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages FK_9fa0373c1451ad384fc6a74aa8c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "FK_9fa0373c1451ad384fc6a74aa8c" FOREIGN KEY ("roomId") REFERENCES public.chat_rooms(id) ON DELETE CASCADE;


--
-- Name: messages FK_a0c2d1966be6c4ff33074b9f5d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_a0c2d1966be6c4ff33074b9f5d2" FOREIGN KEY ("destUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_rooms FK_b7803818c38584a3a2a0dce2830; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms
    ADD CONSTRAINT "FK_b7803818c38584a3a2a0dce2830" FOREIGN KEY ("ownerUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: trophies_progress FK_d1cb4d572cc245d1c754b4afaa7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trophies_progress
    ADD CONSTRAINT "FK_d1cb4d572cc245d1c754b4afaa7" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications FK_d1e9b2452666de3b9b4d271cca0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_d1e9b2452666de3b9b4d271cca0" FOREIGN KEY ("receiverId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications FK_ddb7981cf939fe620179bfea33a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_ddb7981cf939fe620179bfea33a" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: games FK_e528275f53e8f4a97f1b2e7dfb8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8" FOREIGN KEY ("winnerId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

