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
    "isProtected" boolean DEFAULT false NOT NULL,
    name text DEFAULT 'room'::text NOT NULL,
    password text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "ownerUserId" bigint
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
    "winnerId" bigint
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
    "lastActivity" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users-relation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."users-relation" (
    id integer NOT NULL,
    "relationType" text DEFAULT 'pending'::text NOT NULL,
    "mutuelBlocked" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "userInitiateurId" bigint,
    "userRelationId" bigint
);


ALTER TABLE public."users-relation" OWNER TO postgres;

--
-- Name: users-relation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."users-relation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."users-relation_id_seq" OWNER TO postgres;

--
-- Name: users-relation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."users-relation_id_seq" OWNED BY public."users-relation".id;


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
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users-relation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation" ALTER COLUMN id SET DEFAULT nextval('public."users-relation_id_seq"'::regclass);


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, text, "createdAt", "updatedAt", "ownerUserId", "roomId") FROM stdin;

235	Invitation link http://localhost:3006/chat/channel/invitation/58/Hello	2023-06-19 18:25:09.315217	2023-06-19 18:25:09.315217	0	58
303	8	2023-06-19 18:56:16.652485	2023-06-19 18:56:16.652485	24	59
236	Invitation link http://localhost:3006/chat/channel/invitation/59/Private	2023-06-19 18:25:17.004831	2023-06-19 18:25:17.004831	0	59
268	22	2023-06-19 18:55:12.375071	2023-06-19 18:55:12.375071	25	59
237	salut	2023-06-19 18:25:22.320812	2023-06-19 18:25:22.320812	25	59
238	aaaah	2023-06-19 18:25:27.619965	2023-06-19 18:25:27.619965	25	59
290	14	2023-06-19 18:55:45.013792	2023-06-19 18:55:45.013792	29	59
239	jrasser has join the room	2023-06-19 18:25:45.948864	2023-06-19 18:25:45.948864	0	59
269	23	2023-06-19 18:55:13.037022	2023-06-19 18:55:13.037022	25	59
240	slt	2023-06-19 18:25:50.848092	2023-06-19 18:25:50.848092	24	59
241	ca va ?	2023-06-19 18:25:58.56571	2023-06-19 18:25:58.56571	24	59
242	et toi ?	2023-06-19 18:26:05.094693	2023-06-19 18:26:05.094693	25	59
270	24	2023-06-19 18:55:13.661339	2023-06-19 18:55:13.661339	25	59
243	Lynn6 has join the room	2023-06-19 18:26:27.178535	2023-06-19 18:26:27.178535	0	58
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
311	16	2023-06-19 18:56:22.68763	2023-06-19 18:56:22.68763	24	59
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
304	9	2023-06-19 18:56:17.363193	2023-06-19 18:56:17.363193	24	59
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
305	10	2023-06-19 18:56:18.136545	2023-06-19 18:56:18.136545	24	59
286	10	2023-06-19 18:55:42.260309	2023-06-19 18:55:42.260309	29	59
296	20	2023-06-19 18:55:50.578832	2023-06-19 18:55:50.578832	29	59
287	11	2023-06-19 18:55:42.963526	2023-06-19 18:55:42.963526	29	59
288	12	2023-06-19 18:55:43.653793	2023-06-19 18:55:43.653793	29	59
289	13	2023-06-19 18:55:44.358478	2023-06-19 18:55:44.358478	29	59
297	1	2023-06-19 18:56:11.667687	2023-06-19 18:56:11.667687	24	59
316	1	2023-06-19 18:56:52.660877	2023-06-19 18:56:52.660877	25	59
298	3	2023-06-19 18:56:12.677853	2023-06-19 18:56:12.677853	24	59
306	11	2023-06-19 18:56:18.865969	2023-06-19 18:56:18.865969	24	59
299	4	2023-06-19 18:56:13.479924	2023-06-19 18:56:13.479924	24	59
300	5	2023-06-19 18:56:14.687358	2023-06-19 18:56:14.687358	24	59
312	7	2023-06-19 18:56:23.471938	2023-06-19 18:56:23.471938	24	59
301	6	2023-06-19 18:56:15.337886	2023-06-19 18:56:15.337886	24	59
307	12	2023-06-19 18:56:19.546996	2023-06-19 18:56:19.546996	24	59
302	7	2023-06-19 18:56:16.071204	2023-06-19 18:56:16.071204	24	59
308	13	2023-06-19 18:56:20.296964	2023-06-19 18:56:20.296964	24	59
313	18	2023-06-19 18:56:24.214634	2023-06-19 18:56:24.214634	24	59
309	14	2023-06-19 18:56:21.15123	2023-06-19 18:56:21.15123	24	59
310	15	2023-06-19 18:56:21.917308	2023-06-19 18:56:21.917308	24	59
319	4	2023-06-19 18:56:54.457385	2023-06-19 18:56:54.457385	25	59
317	2	2023-06-19 18:56:53.319441	2023-06-19 18:56:53.319441	25	59
314	19	2023-06-19 18:56:25.027053	2023-06-19 18:56:25.027053	24	59
315	20	2023-06-19 18:56:26.058044	2023-06-19 18:56:26.058044	24	59
321	6	2023-06-19 18:57:11.06218	2023-06-19 18:57:11.06218	29	59
318	3	2023-06-19 18:56:53.896979	2023-06-19 18:56:53.896979	25	59
320	5	2023-06-19 18:56:55.040122	2023-06-19 18:56:55.040122	25	59
322	7	2023-06-19 18:57:11.618265	2023-06-19 18:57:11.618265	29	59
323	8	2023-06-19 18:57:12.250869	2023-06-19 18:57:12.250869	29	59
324	9	2023-06-19 18:57:12.875549	2023-06-19 18:57:12.875549	29	59
325	10	2023-06-19 18:57:13.880995	2023-06-19 18:57:13.880995	29	59
326	9	2023-06-19 18:57:34.078561	2023-06-19 18:57:34.078561	24	59
327	8	2023-06-19 18:57:34.815725	2023-06-19 18:57:34.815725	24	59
328	7	2023-06-19 18:57:35.562436	2023-06-19 18:57:35.562436	24	59
329	6	2023-06-19 18:57:36.582154	2023-06-19 18:57:36.582154	24	59
330	5	2023-06-19 18:57:37.255379	2023-06-19 18:57:37.255379	24	59
331	4	2023-06-19 18:57:37.8518	2023-06-19 18:57:37.8518	24	59
332	3	2023-06-19 18:57:38.457827	2023-06-19 18:57:38.457827	24	59
333	2	2023-06-19 18:57:39.058874	2023-06-19 18:57:39.058874	24	59
334	1	2023-06-19 18:57:39.663799	2023-06-19 18:57:39.663799	24	59
335	0	2023-06-19 18:57:42.414071	2023-06-19 18:57:42.414071	24	59
336	a	2023-06-19 18:58:30.732447	2023-06-19 18:58:30.732447	24	59
337	b	2023-06-19 18:58:31.244552	2023-06-19 18:58:31.244552	24	59
338	c	2023-06-19 18:58:31.682235	2023-06-19 18:58:31.682235	24	59
339	d	2023-06-19 18:58:32.178916	2023-06-19 18:58:32.178916	24	59
340	e	2023-06-19 18:58:32.599257	2023-06-19 18:58:32.599257	24	59
341	f	2023-06-19 18:58:33.121839	2023-06-19 18:58:33.121839	24	59
342	g	2023-06-19 18:58:33.620978	2023-06-19 18:58:33.620978	24	59
343	h	2023-06-19 18:58:34.132263	2023-06-19 18:58:34.132263	24	59
344	i	2023-06-19 18:58:34.59381	2023-06-19 18:58:34.59381	24	59
345	j	2023-06-19 18:58:35.103032	2023-06-19 18:58:35.103032	24	59
346	k	2023-06-19 18:58:35.549777	2023-06-19 18:58:35.549777	24	59
347	l	2023-06-19 18:58:36.082146	2023-06-19 18:58:36.082146	24	59
348	m	2023-06-19 18:58:36.636971	2023-06-19 18:58:36.636971	24	59
349	n	2023-06-19 18:58:37.361904	2023-06-19 18:58:37.361904	24	59
350	o	2023-06-19 18:58:37.834913	2023-06-19 18:58:37.834913	24	59
351	p	2023-06-19 18:58:38.427325	2023-06-19 18:58:38.427325	24	59
352	q	2023-06-19 18:58:38.9268	2023-06-19 18:58:38.9268	24	59
353	r	2023-06-19 18:58:39.426606	2023-06-19 18:58:39.426606	24	59
354	s	2023-06-19 18:58:40.26831	2023-06-19 18:58:40.26831	24	59
355	t	2023-06-19 18:58:40.787563	2023-06-19 18:58:40.787563	24	59
356	u	2023-06-19 18:58:41.661524	2023-06-19 18:58:41.661524	24	59
357	v	2023-06-19 18:58:42.560086	2023-06-19 18:58:42.560086	24	59
358	w	2023-06-19 18:58:43.290097	2023-06-19 18:58:43.290097	24	59
359	x	2023-06-19 18:58:43.987722	2023-06-19 18:58:43.987722	24	59
360	y	2023-06-19 18:58:44.873105	2023-06-19 18:58:44.873105	24	59
361	z	2023-06-19 18:58:45.319229	2023-06-19 18:58:45.319229	24	59
362	Laron76 has join the room	2023-06-19 19:08:02.783762	2023-06-19 19:08:02.783762	0	58
363	hello	2023-06-19 19:47:29.477643	2023-06-19 19:47:29.477643	25	58

\.


--
-- Data for Name: chat_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms (id, type, "isProtected", name, password, "createdAt", "updatedAt", "ownerUserId") FROM stdin;
58	public	f	Hello	\N	2023-06-19 18:25:09.293451	2023-06-19 18:25:09.293451	24
59	private	f	Private	\N	2023-06-19 18:25:16.986254	2023-06-19 18:25:16.986254	25

\.


--
-- Data for Name: chat_rooms_accepted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_accepted_users_users ("chatRoomsId", "usersId") FROM stdin;

59	0

\.


--
-- Data for Name: chat_rooms_admins_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_admins_users ("chatRoomsId", "usersId") FROM stdin;

58	24
59	25
58	25

\.


--
-- Data for Name: chat_rooms_banned_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_banned_users_users ("chatRoomsId", "usersId") FROM stdin;
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

58	24
59	25
59	24
58	25
59	29
58	29

\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (id, status, "createdAt", "finishAt", "abortedAt", "scorePlayer1", "scorePlayer2", "player1Id", "player2Id", "winnerId") FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, text, "createdAt", "updatedAt", "ownerUserId", "destUserId") FROM stdin;

16	elo	2023-06-19 18:24:58.014339	2023-06-19 18:24:58.014339	24	25
17	hello	2023-06-19 18:25:03.283594	2023-06-19 18:25:03.283594	25	24
18	cc	2023-06-19 18:56:05.483116	2023-06-19 18:56:05.483116	29	25
19	hello	2023-06-19 19:05:30.359879	2023-06-19 19:05:30.359879	27	24
20	slt	2023-06-19 19:46:59.950707	2023-06-19 19:46:59.950707	25	24

\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, content, read, "createdAt", "updatedAt", "senderId", "receiverId", "invitationLink") FROM stdin;

189	friendRequest	send you a friend request	f	2023-06-19 18:24:45.516455	2023-06-19 18:24:45.516455	25	26	\N
191	friendRequest	send you a friend request	f	2023-06-19 18:24:46.115453	2023-06-19 18:24:46.115453	25	28	\N
193	friendRequest	send you a friend request	f	2023-06-19 18:24:46.427762	2023-06-19 18:24:46.427762	25	30	\N
194	friendRequest	send you a friend request	f	2023-06-19 18:24:46.73162	2023-06-19 18:24:46.73162	25	31	\N
195	friendRequest	send you a friend request	f	2023-06-19 18:24:46.875216	2023-06-19 18:24:46.875216	25	32	\N
196	friendRequest	send you a friend request	f	2023-06-19 18:24:47.015554	2023-06-19 18:24:47.015554	25	33	\N
197	friendRequest	send you a friend request	f	2023-06-19 18:24:47.15575	2023-06-19 18:24:47.15575	25	34	\N
188	friendRequest	send you a friend request	t	2023-06-19 18:24:45.234225	2023-06-19 18:24:45.234225	25	24	\N
200	roomInvite	you have been invited to join the room Private	f	2023-06-19 18:25:17.022183	2023-06-19 18:25:17.022183	25	0	/chat/channel/invitation/59/Private
199	roomInvite	you have been invited to join the room Private	t	2023-06-19 18:25:17.019006	2023-06-19 18:25:17.019006	25	24	/chat/channel/invitation/59/Private
198	friendRequestAccepted	accepted your friend request	t	2023-06-19 18:24:51.417942	2023-06-19 18:24:51.417942	24	25	\N
201	friendRequest	send you a friend request	f	2023-06-19 18:26:35.168496	2023-06-19 18:26:35.168496	24	26	\N
203	friendRequest	send you a friend request	f	2023-06-19 18:26:35.796927	2023-06-19 18:26:35.796927	24	28	\N
205	friendRequest	send you a friend request	f	2023-06-19 18:26:36.191363	2023-06-19 18:26:36.191363	24	30	\N
206	friendRequest	send you a friend request	f	2023-06-19 18:26:36.379647	2023-06-19 18:26:36.379647	24	31	\N
207	friendRequest	send you a friend request	f	2023-06-19 18:26:36.611134	2023-06-19 18:26:36.611134	24	32	\N
208	friendRequest	send you a friend request	f	2023-06-19 18:26:36.884588	2023-06-19 18:26:36.884588	24	33	\N
209	friendRequest	send you a friend request	f	2023-06-19 18:26:37.203617	2023-06-19 18:26:37.203617	24	34	\N
204	friendRequest	send you a friend request	t	2023-06-19 18:26:35.995029	2023-06-19 18:26:35.995029	24	29	\N
192	friendRequest	send you a friend request	t	2023-06-19 18:24:46.268831	2023-06-19 18:24:46.268831	25	29	\N
211	friendRequestAccepted	accepted your friend request	t	2023-06-19 18:26:57.846307	2023-06-19 18:26:57.846307	29	25	\N
210	friendRequestAccepted	accepted your friend request	t	2023-06-19 18:26:55.909084	2023-06-19 18:26:55.909084	29	24	\N
202	friendRequest	send you a friend request	t	2023-06-19 18:26:35.481604	2023-06-19 18:26:35.481604	24	27	\N
190	friendRequest	send you a friend request	t	2023-06-19 18:24:45.81322	2023-06-19 18:24:45.81322	25	27	\N
212	friendRequestAccepted	accepted your friend request	t	2023-06-19 19:05:13.578314	2023-06-19 19:05:13.578314	27	24	\N
213	friendRequestAccepted	accepted your friend request	t	2023-06-19 19:05:18.029236	2023-06-19 19:05:18.029236	27	25	\N
215	friendRequest	send you a friend request	t	2023-06-19 19:22:09.215744	2023-06-19 19:22:09.215744	25	24	\N
216	friendRequestAccepted	accepted your friend request	t	2023-06-19 19:22:12.330378	2023-06-19 19:22:12.330378	24	25	\N
214	friendDeleted	deleted you from his friend list	t	2023-06-19 19:22:02.614585	2023-06-19 19:22:02.614585	25	24	\N
217	friendDeleted	deleted you from his friend list	t	2023-06-19 19:46:39.59073	2023-06-19 19:46:39.59073	25	24	\N
218	friendRequest	send you a friend request	t	2023-06-19 19:46:46.451994	2023-06-19 19:46:46.451994	25	24	\N
219	friendRequestAccepted	accepted your friend request	t	2023-06-19 19:46:48.820393	2023-06-19 19:46:48.820393	24	25	\N

\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt", "lastActivity") FROM stdin;

24	Jean-michel	Rasser	jrasser	jrasser@student.42mulhouse.fr	\N	user	http://localhost:3000/avatars/avatar-1687198549286-879531.jpg	\N	f	online	\N	2023-06-19 18:15:49.384301	2023-06-19 19:38:01.044	2023-06-19 19:47:22.024
0	Bot	Bot	Bot	bla@gmail.com	\N	user	https://t3.ftcdn.net/jpg/01/36/49/90/360_F_136499077_xp7bSQB4Dx13ktQp0OYJ5ricWXhiFtD2.jpg	\N	t	offline	\N	2023-06-18 23:09:10.083889	2023-06-18 23:09:10.083889	2023-06-18 23:09:10.083889
26	Violette	Beahan	Angelina93	Cali.Halvorson71@hotmail.com	$2b$10$c7fuqdKwSmloYW70MiVILe7LCQc2U56P18n7Q3fjUtr9rk3Po11FW	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/33.jpg	Neque eveniet ullam quia vitae esse facere.	f	offline	\N	2023-06-19 18:24:15.117241	2023-06-19 18:24:15.117241	2023-06-19 18:24:15.117241
28	Christopher	Huels-Anderson	Jordane_Flatley54	Mabelle.Kshlerin-OKon@yahoo.com	$2b$10$pUcwY5cToAxvZ69ynmL8p.X3t/Vqi6..bdLY10px5m6Osp2/G8Fvm	user	https://avatars.githubusercontent.com/u/72724821	Occaecati quia sunt eligendi illo maxime minima debitis.	f	offline	\N	2023-06-19 18:24:15.244542	2023-06-19 18:24:15.244542	2023-06-19 18:24:15.244542
30	Johnny	Bayer	Eula_Weber	Ashleigh.Gulgowski@yahoo.com	$2b$10$X8N/Xjc.uQ0y1t2eeMZyYeDkQ/5bDIJb.BG6d/r4fS1f93SLzBNsS	user	https://avatars.githubusercontent.com/u/83549509	Aperiam pariatur repudiandae rem culpa.	f	offline	\N	2023-06-19 18:24:15.38792	2023-06-19 18:24:15.38792	2023-06-19 18:24:15.38792
31	Eula	Kutch	Libbie36	Jerod_Kutch@hotmail.com	$2b$10$eoTi/n5NDntYwtnuGhDSbeqtML6cYeaAa3RzizGIf6.Zv0yROS0Wu	user	https://avatars.githubusercontent.com/u/11865065	Quas dolor sequi harum numquam.	f	offline	\N	2023-06-19 18:24:15.468936	2023-06-19 18:24:15.468936	2023-06-19 18:24:15.468936
32	Naomi	Runolfsson	Grayce_Dach	Margarita.Mosciski3@hotmail.com	$2b$10$iSNxAAh5CQWmpCLa7IaUM.Ykl2rRdFhEPtKNJ0V2mpC.nbvwgV6aq	user	https://avatars.githubusercontent.com/u/72204078	Iure laborum perspiciatis tenetur totam.	f	offline	\N	2023-06-19 18:24:15.542461	2023-06-19 18:24:15.542461	2023-06-19 18:24:15.542461
33	Edwin	Wolf	Johanna73	Tressa_Beier@yahoo.com	$2b$10$ZW4WtRV4610xn/YF7u1Kvu6aX3tNJsbx/pwlmWC8pWk55XA8rtn4S	user	https://avatars.githubusercontent.com/u/48188922	Reiciendis quod asperiores odit earum magni itaque.	f	offline	\N	2023-06-19 18:24:15.60468	2023-06-19 18:24:15.60468	2023-06-19 18:24:15.60468
34	Shaina	Bergnaum	Ivy_Heller	Shawna_Schmitt@gmail.com	$2b$10$OOc2nVoZ67Acj3oxHKEDrecPIXbzLmEzSxFONgPjiOGuIPj6yW8MO	user	https://avatars.githubusercontent.com/u/87908182	Perferendis inventore culpa impedit.	f	offline	\N	2023-06-19 18:24:15.668621	2023-06-19 18:24:15.668621	2023-06-19 18:24:15.668621
25	Leila	Kessler	Lynn6	Cynthia4@yahoo.com	$2b$10$i3n6ue9OCkjOq5fezKOClunOOY7EhllA65vdYe0o9/zP9EEw9Nxyu	user	https://avatars.githubusercontent.com/u/41298539	Placeat aliquam iure eum.	f	online	\N	2023-06-19 18:24:15.049995	2023-06-19 19:38:01.048	2023-06-19 19:47:29.461
27	Rhianna	Hoppe	Randi.Bruen-Lakin	Katarina50@hotmail.com	$2b$10$sVfIx5EnyQslMSrSohv6Gei0BQkHqOlPOJ6wwO24Ig8i/ULVDmxpm	user	https://avatars.githubusercontent.com/u/58112789	Tenetur fugiat eveniet exercitationem repellendus fuga temporibus numquam accusamus.	f	offline	\N	2023-06-19 18:24:15.1809	2023-06-19 19:13:55.237	2023-06-19 19:05:43.524
29	Darrin	Kirlin	Laron76	Furman_Buckridge-Gusikowski@gmail.com	$2b$10$c1j721RAxyGoIukxRC5suu2ALUFfYV2XoH51h8rryg7U1k40YmC/2	user	https://avatars.githubusercontent.com/u/82350039	Quis blanditiis vel aut repellendus atque itaque.	f	offline	\N	2023-06-19 18:24:15.304727	2023-06-19 19:16:55.236	2023-06-19 19:08:10.659

\.


--
-- Data for Name: users-relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."users-relation" (id, "relationType", "mutuelBlocked", "createdAt", "updatedAt", "userInitiateurId", "userRelationId") FROM stdin;

90	pending	f	2023-06-19 18:24:45.513717	2023-06-19 18:24:45.513717	25	26
92	pending	f	2023-06-19 18:24:46.1126	2023-06-19 18:24:46.1126	25	28
94	pending	f	2023-06-19 18:24:46.424417	2023-06-19 18:24:46.424417	25	30
95	pending	f	2023-06-19 18:24:46.729144	2023-06-19 18:24:46.729144	25	31
96	pending	f	2023-06-19 18:24:46.872535	2023-06-19 18:24:46.872535	25	32
97	pending	f	2023-06-19 18:24:47.010581	2023-06-19 18:24:47.010581	25	33
98	pending	f	2023-06-19 18:24:47.15308	2023-06-19 18:24:47.15308	25	34
99	pending	f	2023-06-19 18:26:35.163459	2023-06-19 18:26:35.163459	24	26
101	pending	f	2023-06-19 18:26:35.794232	2023-06-19 18:26:35.794232	24	28
103	pending	f	2023-06-19 18:26:36.186943	2023-06-19 18:26:36.186943	24	30
104	pending	f	2023-06-19 18:26:36.377257	2023-06-19 18:26:36.377257	24	31
105	pending	f	2023-06-19 18:26:36.608795	2023-06-19 18:26:36.608795	24	32
106	pending	f	2023-06-19 18:26:36.881258	2023-06-19 18:26:36.881258	24	33
107	pending	f	2023-06-19 18:26:37.200743	2023-06-19 18:26:37.200743	24	34
102	friend	f	2023-06-19 18:26:35.992721	2023-06-19 18:26:55.905	24	29
93	friend	f	2023-06-19 18:24:46.265264	2023-06-19 18:26:57.84	25	29
100	friend	f	2023-06-19 18:26:35.477428	2023-06-19 19:05:13.573	24	27
91	friend	f	2023-06-19 18:24:45.809777	2023-06-19 19:05:18.024	25	27
109	friend	f	2023-06-19 19:46:46.447963	2023-06-19 19:46:48.816	25	24

\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 363, true);



--
-- Name: chat_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_rooms_id_seq', 59, true);



--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_id_seq', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 20, true);



--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 219, true);



--
-- Name: users-relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users-relation_id_seq"', 109, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 34, true);



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
-- Name: users-relation PK_6973ffe5e4128326da10a9527d1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
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
-- Name: users-relation FK_0402056c5d34c9eb988252444d9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
    ADD CONSTRAINT "FK_0402056c5d34c9eb988252444d9" FOREIGN KEY ("userInitiateurId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: games FK_090ead4cf0688537043f35b569e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_090ead4cf0688537043f35b569e" FOREIGN KEY ("player2Id") REFERENCES public.users(id);


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
-- Name: users-relation FK_718040c5303bad75d9908ee7fc0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
    ADD CONSTRAINT "FK_718040c5303bad75d9908ee7fc0" FOREIGN KEY ("userRelationId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: games FK_75fbf4e5d917a20839c96ccda03; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_75fbf4e5d917a20839c96ccda03" FOREIGN KEY ("player1Id") REFERENCES public.users(id);


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
    ADD CONSTRAINT "FK_97c390e700263fb405a48f8a185" FOREIGN KEY ("usersId") REFERENCES public.users(id);


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
    ADD CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8" FOREIGN KEY ("winnerId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

