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
1	Hello	2023-06-15 23:30:44.363329	2023-06-15 23:30:44.363329	1	1
29	Demond47 has join the room	2023-06-16 02:57:22.008299	2023-06-16 02:57:22.008299	0	3
2	login1 has join the room	2023-06-16 02:02:05.981758	2023-06-16 02:02:05.981758	0	2
3	login1 has join the room	2023-06-16 02:02:07.69278	2023-06-16 02:02:07.69278	0	3
4	Ike.Stanton11 has join the room	2023-06-16 02:02:54.663438	2023-06-16 02:02:54.663438	0	1
30	Demond47 has join the room	2023-06-16 02:57:25.770543	2023-06-16 02:57:25.770543	0	4
5	Aleen_Stamm11 has join the room	2023-06-16 02:36:52.35372	2023-06-16 02:36:52.35372	0	1
6	login1 has join the room	2023-06-16 02:37:12.895748	2023-06-16 02:37:12.895748	0	4
7	Hello	2023-06-16 02:37:54.74358	2023-06-16 02:37:54.74358	11	4
31	rextcfyvgbhnji.udsrehzxcj Eetjrydjkjg mhdjyt f kyjyrdx jtrytdujtrd jtfdjy dj   jydjydjydjytr sthesztjez jtx	2023-06-16 02:58:04.546932	2023-06-16 02:58:04.546932	12	1
8	Coucou	2023-06-16 02:38:00.492618	2023-06-16 02:38:00.492618	1	4
9	Aleen_Stamm11 has join the room	2023-06-16 02:38:12.323763	2023-06-16 02:38:12.323763	0	2
10	Aleen_Stamm11 has join the room	2023-06-16 02:38:14.043948	2023-06-16 02:38:14.043948	0	3
32	/	2023-06-16 02:58:09.234661	2023-06-16 02:58:09.234661	12	1
11	Aleen_Stamm11 has left the room	2023-06-16 02:38:17.671113	2023-06-16 02:38:17.671113	0	2
12	Aleen_Stamm11 has left the room	2023-06-16 02:38:34.317614	2023-06-16 02:38:34.317614	0	4
13	et bah	2023-06-16 02:38:41.848204	2023-06-16 02:38:41.848204	1	4
14	Aleen_Stamm11 has join the room	2023-06-16 02:38:45.092456	2023-06-16 02:38:45.092456	0	4
15	Ike.Stanton11 has join the room	2023-06-16 02:49:37.98404	2023-06-16 02:49:37.98404	0	2
16	Lloyd25 has join the room	2023-06-16 02:51:51.280817	2023-06-16 02:51:51.280817	0	1
17	Davin.Wunsch32 has join the room	2023-06-16 02:52:45.222721	2023-06-16 02:52:45.222721	0	1
18	Lyric12 has join the room	2023-06-16 02:55:26.871271	2023-06-16 02:55:26.871271	0	1
19	Lyric12 has join the room	2023-06-16 02:55:28.503797	2023-06-16 02:55:28.503797	0	3
20	coucou	2023-06-16 02:55:33.32543	2023-06-16 02:55:33.32543	4	1
21	dfdsd dfd dssdfsfsddf dssd fd fdsf fdsf 	2023-06-16 02:55:38.305028	2023-06-16 02:55:38.305028	4	1
22	dsfdsff	2023-06-16 02:55:39.861344	2023-06-16 02:55:39.861344	4	1
23	sdfsdfds sdf sfds dsfsf	2023-06-16 02:55:41.967916	2023-06-16 02:55:41.967916	4	1
24	Perry83 has join the room	2023-06-16 02:56:02.514708	2023-06-16 02:56:02.514708	0	1
25	Perry83 has join the room	2023-06-16 02:56:05.828038	2023-06-16 02:56:05.828038	0	2
26	Hi	2023-06-16 02:56:22.168557	2023-06-16 02:56:22.168557	15	1
27	Demond47 has join the room	2023-06-16 02:57:11.521615	2023-06-16 02:57:11.521615	0	1
28	Demond47 has join the room	2023-06-16 02:57:20.624199	2023-06-16 02:57:20.624199	0	2
33	jrasser has join the room	2023-06-16 15:05:47.220875	2023-06-16 15:05:47.220875	0	3
124	login1 has left the room	2023-06-16 17:59:01.252862	2023-06-16 17:59:01.252862	0	17
34	jrasser has join the room	2023-06-16 15:05:50.590774	2023-06-16 15:05:50.590774	0	4
115	login1 has join the room	2023-06-16 17:21:48.258918	2023-06-16 17:21:48.258918	0	17
35	dsa s sdd sa ddasd	2023-06-16 15:05:55.285379	2023-06-16 15:05:55.285379	22	4
36	coucou	2023-06-16 15:05:57.274366	2023-06-16 15:05:57.274366	22	4
74	ds	2023-06-16 16:12:09.451958	2023-06-16 16:12:09.451958	6	4
116	Marion_Donnelly53 has join the room	2023-06-16 17:21:50.721723	2023-06-16 17:21:50.721723	0	17
62	dfsfdfsddf	2023-06-16 16:11:46.57305	2023-06-16 16:11:46.57305	22	4
39	jrasser has left the room	2023-06-16 15:11:34.659481	2023-06-16 15:11:34.659481	0	4
40	jrasser has join the room	2023-06-16 15:26:58.142869	2023-06-16 15:26:58.142869	0	1
41	jrasser has join the room	2023-06-16 15:28:19.663775	2023-06-16 15:28:19.663775	0	2
117	lll	2023-06-16 17:32:22.71818	2023-06-16 17:32:22.71818	6	18
42	jrasser has join the room	2023-06-16 15:28:22.396552	2023-06-16 15:28:22.396552	0	4
43	jrasser has left the room	2023-06-16 15:28:48.693325	2023-06-16 15:28:48.693325	0	3
63	but post ?	2023-06-16 16:12:05.697503	2023-06-16 16:12:05.697503	6	4
44	jrasser has join the room	2023-06-16 15:29:08.876751	2023-06-16 15:29:08.876751	0	3
45	jrasser has left the room	2023-06-16 15:29:44.751388	2023-06-16 15:29:44.751388	0	3
46	jrasser has join the room	2023-06-16 15:32:39.424504	2023-06-16 15:32:39.424504	0	3
75	f 	2023-06-16 16:12:09.644951	2023-06-16 16:12:09.644951	6	4
47	jrasser has left the room	2023-06-16 15:32:43.99702	2023-06-16 15:32:43.99702	0	3
118	jrasser has join the room	2023-06-16 17:32:28.915555	2023-06-16 17:32:28.915555	0	18
64	dfsdfd	2023-06-16 16:12:07.228305	2023-06-16 16:12:07.228305	6	4
65	 fsd	2023-06-16 16:12:07.444549	2023-06-16 16:12:07.444549	6	4
125	ljhjhv	2023-06-16 18:00:27.230745	2023-06-16 18:00:27.230745	1	17
66	fd	2023-06-16 16:12:07.660977	2023-06-16 16:12:07.660977	6	4
76	f	2023-06-16 16:12:09.81274	2023-06-16 16:12:09.81274	6	4
67	fds dsf	2023-06-16 16:12:08.26814	2023-06-16 16:12:08.26814	6	4
68	sd	2023-06-16 16:12:08.444659	2023-06-16 16:12:08.444659	6	4
77	sdf	2023-06-16 16:12:10.014811	2023-06-16 16:12:10.014811	6	4
69	f	2023-06-16 16:12:08.573282	2023-06-16 16:12:08.573282	6	4
70	sd	2023-06-16 16:12:08.732079	2023-06-16 16:12:08.732079	6	4
71	f sd	2023-06-16 16:12:08.919515	2023-06-16 16:12:08.919515	6	4
78	merdeeeee	2023-06-16 16:12:15.47144	2023-06-16 16:12:15.47144	6	4
72	f 	2023-06-16 16:12:09.101163	2023-06-16 16:12:09.101163	6	4
140	login1 has join the room	2023-06-16 18:12:59.248075	2023-06-16 18:12:59.248075	0	22
73	dsf	2023-06-16 16:12:09.284015	2023-06-16 16:12:09.284015	6	4
141	sdfsdsdf	2023-06-16 18:13:03.302684	2023-06-16 18:13:03.302684	1	22
143	Marion_Donnelly53 has left the room	2023-06-16 18:30:33.033881	2023-06-16 18:30:33.033881	0	22
142	Marion_Donnelly53 has join the room	2023-06-16 18:28:05.099565	2023-06-16 18:28:05.099565	0	22
139	fff	2023-06-16 18:12:51.50845	2023-06-16 18:12:51.50845	6	17
144	login1 has left the room	2023-06-16 18:34:11.430664	2023-06-16 18:34:11.430664	0	22
\.


--
-- Data for Name: chat_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms (id, type, "isProtected", name, password, "createdAt", "updatedAt", "ownerUserId") FROM stdin;
1	public	f	42	\N	2023-06-15 23:30:40.081569	2023-06-15 23:30:40.081569	1
2	public	t	room	$2b$10$1Pax7awjdOKSmN.GXcf/wuBnKtN5yk895FQPJJpZ5jAAepAs5DTOy	2023-06-16 00:39:39.710572	2023-06-16 00:39:39.710572	16
3	public	f	Channel	\N	2023-06-16 00:39:45.772039	2023-06-16 00:39:45.772039	16
4	public	t	Room	$2b$10$ww4P4kTdWTGeEhPaJJk1bu.Fc2nxEBNS0srFQ3H8SgP68HSzEWP3e	2023-06-16 02:37:02.064434	2023-06-16 02:37:02.064434	11
17	public	f	BLIBLI	\N	2023-06-16 17:21:41.966945	2023-06-16 17:21:41.966945	22
18	public	f	l;;	\N	2023-06-16 17:32:02.358744	2023-06-16 17:32:02.358744	6
22	public	f	aaaaaaaaa	\N	2023-06-16 18:12:56.963259	2023-06-16 18:12:56.963259	22
\.


--
-- Data for Name: chat_rooms_accepted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_accepted_users_users ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: chat_rooms_admins_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_admins_users ("chatRoomsId", "usersId") FROM stdin;
1	1
2	16
3	16
17	22
18	6
22	22
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
1	1
2	16
3	16
2	1
3	1
1	7
1	11
4	1
3	11
4	11
2	7
1	10
1	5
1	4
3	4
1	15
2	15
1	12
2	12
3	12
4	12
1	22
2	22
4	22
17	22
17	6
18	6
18	22
22	22
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (id, status, "createdAt", "finishAt", "abortedAt", "scorePlayer1", "scorePlayer2", "player1Id", "player2Id", "winnerId") FROM stdin;
1	finished	2023-06-16 14:47:45.417	2023-06-16 14:48:16.343	2023-06-16 14:47:45.420437	5	5	2	2	1
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, text, "createdAt", "updatedAt", "ownerUserId", "destUserId") FROM stdin;
32	fgdf df dfgfdg	2023-06-16 02:43:08.171977	2023-06-16 02:43:08.171977	16	1
1	Hello	2023-06-16 02:33:55.642475	2023-06-16 02:33:55.642475	14	1
2	Salut	2023-06-16 02:34:14.938351	2023-06-16 02:34:14.938351	1	14
54	22	2023-06-16 02:43:37.914514	2023-06-16 02:43:37.914514	1	16
3	ca va ?	2023-06-16 02:34:18.269823	2023-06-16 02:34:18.269823	14	1
33	1	2023-06-16 02:43:21.962712	2023-06-16 02:43:21.962712	1	16
4	Hello	2023-06-16 02:41:06.487029	2023-06-16 02:41:06.487029	6	1
5	fgfd	2023-06-16 02:42:23.468901	2023-06-16 02:42:23.468901	16	1
6	gd dfg dfg dfd	2023-06-16 02:42:24.381802	2023-06-16 02:42:24.381802	16	1
34	2	2023-06-16 02:43:22.609953	2023-06-16 02:43:22.609953	1	16
7	 fg	2023-06-16 02:42:24.60646	2023-06-16 02:42:24.60646	16	1
8	df 	2023-06-16 02:42:24.805173	2023-06-16 02:42:24.805173	16	1
9	g fd	2023-06-16 02:42:25.093179	2023-06-16 02:42:25.093179	16	1
35	3	2023-06-16 02:43:23.155602	2023-06-16 02:43:23.155602	1	16
10	fgd 	2023-06-16 02:42:25.976561	2023-06-16 02:42:25.976561	16	1
11	 dfgfd gf dg dfgfdfd gf fdhgjgj g	2023-06-16 02:42:31.79109	2023-06-16 02:42:31.79109	1	16
55	23	2023-06-16 02:43:38.943507	2023-06-16 02:43:38.943507	1	16
12	hhhh	2023-06-16 02:42:33.93041	2023-06-16 02:42:33.93041	16	1
36	4	2023-06-16 02:43:23.755427	2023-06-16 02:43:23.755427	1	16
13	 gdfg dfgdf	2023-06-16 02:42:36.14269	2023-06-16 02:42:36.14269	1	16
14	df	2023-06-16 02:42:36.328379	2023-06-16 02:42:36.328379	1	16
15	df gdf fdgd	2023-06-16 02:42:36.931081	2023-06-16 02:42:36.931081	1	16
37	5	2023-06-16 02:43:24.378533	2023-06-16 02:43:24.378533	1	16
16	dfg gffdfdgdf ggfd dfg fdg fdgf dfgdf dgfdg gd fdgfd gfd dfgfd gdfg	2023-06-16 02:42:40.88067	2023-06-16 02:42:40.88067	1	16
17	fd df fgfdgdfgdf fd fg dfg df fdgd dfg dfgfdf hfhdf fdg fgfdgdfgd gfdg fd fdg f dgfd df fdg fdg g	2023-06-16 02:42:46.924085	2023-06-16 02:42:46.924085	1	16
18	f fdg	2023-06-16 02:42:47.533493	2023-06-16 02:42:47.533493	1	16
38	6	2023-06-16 02:43:24.954244	2023-06-16 02:43:24.954244	1	16
19	fdg df 	2023-06-16 02:42:48.206157	2023-06-16 02:42:48.206157	1	16
20	fdg fdg	2023-06-16 02:42:49.62772	2023-06-16 02:42:49.62772	1	16
56	24	2023-06-16 02:43:39.861125	2023-06-16 02:43:39.861125	1	16
21	dfgfd	2023-06-16 02:42:51.589691	2023-06-16 02:42:51.589691	16	1
39	7	2023-06-16 02:43:25.604875	2023-06-16 02:43:25.604875	1	16
22	 fd	2023-06-16 02:42:51.864372	2023-06-16 02:42:51.864372	16	1
23	gfdgfdg fdg	2023-06-16 02:42:52.978771	2023-06-16 02:42:52.978771	16	1
24	fdgfgdfd	2023-06-16 02:42:53.705172	2023-06-16 02:42:53.705172	16	1
40	8	2023-06-16 02:43:26.250339	2023-06-16 02:43:26.250339	1	16
25	g	2023-06-16 02:42:54.260686	2023-06-16 02:42:54.260686	16	1
26	ggfgdf gdf fdgfdg	2023-06-16 02:42:55.636719	2023-06-16 02:42:55.636719	16	1
68	36	2023-06-16 02:43:54.194738	2023-06-16 02:43:54.194738	16	1
27	df gf	2023-06-16 02:42:56.148317	2023-06-16 02:42:56.148317	16	1
41	9	2023-06-16 02:43:26.834206	2023-06-16 02:43:26.834206	1	16
28	 fdgfd dfg	2023-06-16 02:42:57.26107	2023-06-16 02:42:57.26107	16	1
29	dsfs ds f sdf	2023-06-16 02:43:00.479407	2023-06-16 02:43:00.479407	1	16
57	25	2023-06-16 02:43:40.64596	2023-06-16 02:43:40.64596	1	16
30	sd sd sd d dsf dsf d ssfsdf dsfdfdsfdsf ds sdf	2023-06-16 02:43:04.834835	2023-06-16 02:43:04.834835	1	16
42	10	2023-06-16 02:43:27.608929	2023-06-16 02:43:27.608929	1	16
31	dsf 	2023-06-16 02:43:05.580885	2023-06-16 02:43:05.580885	1	16
43	11	2023-06-16 02:43:28.707438	2023-06-16 02:43:28.707438	1	16
58	26	2023-06-16 02:43:41.540941	2023-06-16 02:43:41.540941	1	16
44	12	2023-06-16 02:43:29.709303	2023-06-16 02:43:29.709303	1	16
45	13	2023-06-16 02:43:30.548168	2023-06-16 02:43:30.548168	1	16
76	44	2023-06-16 02:44:00.731156	2023-06-16 02:44:00.731156	16	1
46	14	2023-06-16 02:43:31.466707	2023-06-16 02:43:31.466707	1	16
59	27	2023-06-16 02:43:42.40319	2023-06-16 02:43:42.40319	1	16
47	15	2023-06-16 02:43:32.246591	2023-06-16 02:43:32.246591	1	16
48	16	2023-06-16 02:43:33.048713	2023-06-16 02:43:33.048713	1	16
69	37	2023-06-16 02:43:54.948331	2023-06-16 02:43:54.948331	16	1
49	17	2023-06-16 02:43:33.835028	2023-06-16 02:43:33.835028	1	16
60	28	2023-06-16 02:43:43.291148	2023-06-16 02:43:43.291148	1	16
50	18	2023-06-16 02:43:34.596865	2023-06-16 02:43:34.596865	1	16
51	19	2023-06-16 02:43:35.427417	2023-06-16 02:43:35.427417	1	16
52	20	2023-06-16 02:43:36.27234	2023-06-16 02:43:36.27234	1	16
61	29	2023-06-16 02:43:44.17034	2023-06-16 02:43:44.17034	1	16
53	21	2023-06-16 02:43:37.100223	2023-06-16 02:43:37.100223	1	16
70	38	2023-06-16 02:43:55.719777	2023-06-16 02:43:55.719777	16	1
62	30	2023-06-16 02:43:45.029035	2023-06-16 02:43:45.029035	1	16
63	31	2023-06-16 02:43:49.357579	2023-06-16 02:43:49.357579	16	1
81	49	2023-06-16 02:44:05.03225	2023-06-16 02:44:05.03225	16	1
64	32	2023-06-16 02:43:50.50337	2023-06-16 02:43:50.50337	16	1
71	39	2023-06-16 02:43:56.608943	2023-06-16 02:43:56.608943	16	1
65	33	2023-06-16 02:43:51.462193	2023-06-16 02:43:51.462193	16	1
66	34	2023-06-16 02:43:52.65982	2023-06-16 02:43:52.65982	16	1
77	45	2023-06-16 02:44:01.596193	2023-06-16 02:44:01.596193	16	1
67	35	2023-06-16 02:43:53.382235	2023-06-16 02:43:53.382235	16	1
72	40	2023-06-16 02:43:57.387402	2023-06-16 02:43:57.387402	16	1
73	41	2023-06-16 02:43:58.231837	2023-06-16 02:43:58.231837	16	1
74	42	2023-06-16 02:43:59.041515	2023-06-16 02:43:59.041515	16	1
78	46	2023-06-16 02:44:02.444953	2023-06-16 02:44:02.444953	16	1
75	43	2023-06-16 02:43:59.798096	2023-06-16 02:43:59.798096	16	1
84	52	2023-06-16 02:44:07.82253	2023-06-16 02:44:07.82253	16	1
79	47	2023-06-16 02:44:03.324117	2023-06-16 02:44:03.324117	16	1
82	50	2023-06-16 02:44:05.930373	2023-06-16 02:44:05.930373	16	1
80	48	2023-06-16 02:44:04.127794	2023-06-16 02:44:04.127794	16	1
83	51	2023-06-16 02:44:06.950288	2023-06-16 02:44:06.950288	16	1
85	53	2023-06-16 02:44:08.760241	2023-06-16 02:44:08.760241	16	1
86	54	2023-06-16 02:44:09.705431	2023-06-16 02:44:09.705431	16	1
87	55	2023-06-16 02:44:10.517744	2023-06-16 02:44:10.517744	16	1
88	56	2023-06-16 02:44:11.488629	2023-06-16 02:44:11.488629	16	1
89	57	2023-06-16 02:44:12.261714	2023-06-16 02:44:12.261714	16	1
90	58	2023-06-16 02:44:13.031025	2023-06-16 02:44:13.031025	16	1
91	59	2023-06-16 02:44:14.065684	2023-06-16 02:44:14.065684	16	1
92	60	2023-06-16 02:44:15.459498	2023-06-16 02:44:15.459498	16	1
93	61	2023-06-16 02:44:16.731889	2023-06-16 02:44:16.731889	16	1
94	62	2023-06-16 02:44:17.651365	2023-06-16 02:44:17.651365	16	1
95	63	2023-06-16 02:44:18.57692	2023-06-16 02:44:18.57692	16	1
96	64	2023-06-16 02:44:19.891087	2023-06-16 02:44:19.891087	16	1
97	65	2023-06-16 02:44:20.818834	2023-06-16 02:44:20.818834	16	1
98	66	2023-06-16 02:44:22.188639	2023-06-16 02:44:22.188639	16	1
133	dr gfd ggdf f gfdg	2023-06-16 02:49:25.25588	2023-06-16 02:49:25.25588	7	6
99	67	2023-06-16 02:44:23.05101	2023-06-16 02:44:23.05101	16	1
100	68	2023-06-16 02:44:24.002626	2023-06-16 02:44:24.002626	16	1
165	coucou	2023-06-16 17:01:15.050103	2023-06-16 17:01:15.050103	1	6
143	fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f 	2023-06-16 02:49:57.385859	2023-06-16 02:49:57.385859	7	1
101	69	2023-06-16 02:44:24.891974	2023-06-16 02:44:24.891974	16	1
134	dsf sd sdf	2023-06-16 02:49:48.291477	2023-06-16 02:49:48.291477	7	1
102	70	2023-06-16 02:44:25.733637	2023-06-16 02:44:25.733637	16	1
103	71	2023-06-16 02:44:28.418977	2023-06-16 02:44:28.418977	1	16
104	72	2023-06-16 02:44:29.256169	2023-06-16 02:44:29.256169	1	16
135	f	2023-06-16 02:49:49.159721	2023-06-16 02:49:49.159721	7	1
105	73	2023-06-16 02:44:30.268764	2023-06-16 02:44:30.268764	1	16
106	74	2023-06-16 02:44:31.280522	2023-06-16 02:44:31.280522	1	16
107	75	2023-06-16 02:44:32.403765	2023-06-16 02:44:32.403765	1	16
136	sd	2023-06-16 02:49:49.394883	2023-06-16 02:49:49.394883	7	1
108	6	2023-06-16 02:44:33.357393	2023-06-16 02:44:33.357393	1	16
109	78	2023-06-16 02:44:34.375724	2023-06-16 02:44:34.375724	1	16
144	fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f 	2023-06-16 02:49:59.13433	2023-06-16 02:49:59.13433	7	1
110	79	2023-06-16 02:44:35.386315	2023-06-16 02:44:35.386315	1	16
111	80	2023-06-16 02:44:37.709598	2023-06-16 02:44:37.709598	1	16
112	81	2023-06-16 02:44:42.011713	2023-06-16 02:44:42.011713	16	1
113	82	2023-06-16 02:44:43.282296	2023-06-16 02:44:43.282296	16	1
148	fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f\nfsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f\nfsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f\nfsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f\nfsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f\n	2023-06-16 02:50:37.005766	2023-06-16 02:50:37.005766	7	1
114	83	2023-06-16 02:44:44.132818	2023-06-16 02:44:44.132818	16	1
138	dsf fsd sd	2023-06-16 02:49:50.126722	2023-06-16 02:49:50.126722	7	1
115	84	2023-06-16 02:44:45.386513	2023-06-16 02:44:45.386513	16	1
137	dsf f	2023-06-16 02:49:49.984414	2023-06-16 02:49:49.984414	\N	\N
116	85	2023-06-16 02:44:46.640113	2023-06-16 02:44:46.640113	16	1
117	86	2023-06-16 02:44:47.971589	2023-06-16 02:44:47.971589	16	1
118	87	2023-06-16 02:44:49.163419	2023-06-16 02:44:49.163419	16	1
139	sdf	2023-06-16 02:49:50.461142	2023-06-16 02:49:50.461142	7	1
119	88	2023-06-16 02:44:50.246947	2023-06-16 02:44:50.246947	16	1
120	89	2023-06-16 02:44:51.284268	2023-06-16 02:44:51.284268	16	1
121	90	2023-06-16 02:44:52.315275	2023-06-16 02:44:52.315275	16	1
140	sdfsdf 	2023-06-16 02:49:50.656964	2023-06-16 02:49:50.656964	7	1
122	91	2023-06-16 02:44:54.808714	2023-06-16 02:44:54.808714	1	16
123	92	2023-06-16 02:44:56.923383	2023-06-16 02:44:56.923383	1	16
124	93	2023-06-16 02:44:57.902805	2023-06-16 02:44:57.902805	1	16
141	d	2023-06-16 02:49:51.087767	2023-06-16 02:49:51.087767	7	1
125	94	2023-06-16 02:44:59.087111	2023-06-16 02:44:59.087111	1	16
126	95	2023-06-16 02:45:00.531441	2023-06-16 02:45:00.531441	1	16
149	fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f fsd df dsf sd fsdf sfsdf ssd f f csa c	2023-06-16 02:50:44.036118	2023-06-16 02:50:50.311	7	1
127	96	2023-06-16 02:45:01.561793	2023-06-16 02:45:01.561793	1	16
142	d	2023-06-16 02:49:51.468768	2023-06-16 02:49:51.468768	7	1
128	97	2023-06-16 02:45:02.709531	2023-06-16 02:45:02.709531	1	16
129	98	2023-06-16 02:45:03.77489	2023-06-16 02:45:03.77489	1	16
147	 dsfds dsf ds fsdfsdfsdfsd df dsf sd fsdf sfsdf ssd f 	2023-06-16 02:50:08.19227	2023-06-16 02:50:21.36	7	1
130	99	2023-06-16 02:45:04.799634	2023-06-16 02:45:04.799634	1	16
131	1000	2023-06-16 02:45:06.323055	2023-06-16 02:45:06.323055	1	16
150	sdf	2023-06-16 02:51:36.44937	2023-06-16 02:51:36.44937	10	1
132	 g fd fg fdg fdgfx hghxhgh gfhx hfxghxghxgh xgfhghxh gxghg	2023-06-16 02:45:28.515652	2023-06-16 02:45:28.515652	16	6
151	wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww	2023-06-16 02:53:01.349943	2023-06-16 02:53:01.349943	5	1
152	cxvxcxvv	2023-06-16 02:54:36.417661	2023-06-16 02:54:36.417661	4	6
153	xcvxcvxvcxvcxv	2023-06-16 02:54:38.475821	2023-06-16 02:54:38.475821	4	6
154	cvxxcv	2023-06-16 02:54:38.93688	2023-06-16 02:54:38.93688	4	6
155	xcvxcvxc	2023-06-16 02:54:39.384502	2023-06-16 02:54:39.384502	4	6
156	xcvxcvxcvcxvxcvxcvcxvcxvcxvxcvc	2023-06-16 02:54:41.023028	2023-06-16 02:54:41.023028	4	6
157	ds fdsf fdsdfdgfh fgh fghg fg fgh gfh fgfg hgf	2023-06-16 02:56:17.301644	2023-06-16 02:56:17.301644	15	1
158	asdfghjkl;	2023-06-16 02:58:36.784571	2023-06-16 02:58:36.784571	12	1
159	helo	2023-06-16 15:12:45.084314	2023-06-16 15:12:45.084314	22	1
160	cc	2023-06-16 15:12:49.010182	2023-06-16 15:12:49.010182	1	22
161	lkjlkl	2023-06-16 15:17:48.302031	2023-06-16 15:17:48.302031	11	1
162	sdfdf	2023-06-16 15:22:05.755841	2023-06-16 15:22:05.755841	6	22
163	sdfsdf	2023-06-16 15:22:09.14293	2023-06-16 15:22:09.14293	22	6
164	sdfsdff	2023-06-16 16:45:07.861791	2023-06-16 16:45:07.861791	22	12
166	wtf	2023-06-16 17:01:25.440609	2023-06-16 17:01:25.440609	6	22
167	rien rien	2023-06-16 17:01:28.670056	2023-06-16 17:01:28.670056	22	6
168	mouahahahaha	2023-06-16 17:01:31.782761	2023-06-16 17:01:31.782761	1	6
169	heu	2023-06-16 17:01:35.813625	2023-06-16 17:01:35.813625	1	6
170	d'accord	2023-06-16 17:01:38.745864	2023-06-16 17:01:38.745864	1	6
171	sdsad	2023-06-16 17:02:02.865932	2023-06-16 17:02:02.865932	1	6
172	TEST	2023-06-16 17:02:13.767655	2023-06-16 17:02:13.767655	1	6
173	drg	2023-06-16 17:08:53.681591	2023-06-16 17:08:53.681591	6	22
174	dfg	2023-06-16 17:08:55.879323	2023-06-16 17:08:55.879323	22	6
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt", "lastActivity") FROM stdin;
2	Kurt	Batz	William20	Christiana_Schulist65@yahoo.com	$2b$10$13Ztzgw.mrmEwozJpt5ckOhsqpMZficWPxEwfRv10KefeOZf1uSg2	user	https://avatars.githubusercontent.com/u/73806346	Maxime dignissimos quasi exercitationem praesentium porro at.	f	offline	\N	2023-06-15 23:05:11.549823	2023-06-15 23:05:11.549823	2023-06-15 23:05:11.549823
3	Brooks	Brekke	Susie50	Kory45@yahoo.com	$2b$10$yw9ESCjldtUp3J2cSHwFCOnqUmVgxyGzclCb.aJk97dj472WK2Ssi	user	https://avatars.githubusercontent.com/u/10185778	Recusandae nulla ratione nobis minus voluptatem earum eum.	f	offline	\N	2023-06-15 23:05:11.823801	2023-06-15 23:05:11.823801	2023-06-15 23:05:11.823801
17	Lucinda	Leffler	Stephania_McLaughlin	Norberto97@hotmail.com	$2b$10$Rot6z5WXjojGgcmkprRd3.B.hFEEi4ydsvFMGroZfvseeg0IeSoJ6	user	https://avatars.githubusercontent.com/u/55306448	Nihil repellat voluptate pariatur odio nam nulla.	f	offline	\N	2023-06-15 23:23:19.418435	2023-06-15 23:23:19.418435	2023-06-15 23:23:19.418435
18	Floyd	Lesch	Maria_Lakin72	Roy.Fisher@yahoo.com	$2b$10$xJjAgtUlZWSlY3c.79iD4.a3tGSmIodH5cpKBbp0RaL.THCCb23Cy	user	https://avatars.githubusercontent.com/u/21272949	Facilis quas placeat.	f	offline	\N	2023-06-15 23:23:19.497028	2023-06-15 23:23:19.497028	2023-06-15 23:23:19.497028
19	Jannie	Rempel	Autumn_Stroman-Mohr	Kristoffer35@yahoo.com	$2b$10$j4SWK.Mb4kVMfE0OrYxvTuYLwmoqKk.2zXU8ZqEulkQzK3wrNPEqu	user	https://avatars.githubusercontent.com/u/75137093	Similique odit consequuntur dolore eveniet quidem harum expedita.	f	offline	\N	2023-06-15 23:24:13.344258	2023-06-15 23:24:13.344258	2023-06-15 23:24:13.344258
20	Celestino	Connelly	Alayna.Spinka53	Koby44@gmail.com	$2b$10$6BJIHG4dE7ynvhmqijcdNusQUCRfdKkVnTLbPj5wayFY7pcZ8LGCu	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/890.jpg	Excepturi tenetur error ullam rem a atque quam laudantium error.	f	offline	\N	2023-06-15 23:24:13.40784	2023-06-15 23:24:13.40784	2023-06-15 23:24:13.40784
21	Sidney	Towne	Barry.Gerhold	Helene.Bednar@hotmail.com	$2b$10$YzDCeCs4dRTK8sHrbKVLieajNaf4DQ8MNK.ZezbKxPv8q7DNTGDKq	user	https://avatars.githubusercontent.com/u/36896261	Culpa dolor aut dolores facilis ad minus.	f	offline	\N	2023-06-15 23:24:13.470445	2023-06-15 23:24:13.470445	2023-06-15 23:24:13.470445
15	Loyce	Prohaska	Perry83	Maryjane_Swift@gmail.com	$2b$10$zeAGVWCwtBoPZYcLqjbrJuZLSQ7mfTJDfP0MB/wqpwLPn0KMkLa.e	user	https://avatars.githubusercontent.com/u/97518305	Hic iure eligendi maiores saepe repellat a.	f	offline	\N	2023-06-15 23:23:19.285663	2023-06-16 02:56:30.924	2023-06-16 02:56:30.918
9	Lonzo	Kessler	Milton.Wyman	Teresa_Russel@hotmail.com	$2b$10$QXfO2UtOAULnHYNOSf3H1.Nc.9QFDxIPwsP4hSOTfFmFZsP4BQo2i	user	https://avatars.githubusercontent.com/u/99210078	Eveniet illo nostrum suscipit.	f	offline	\N	2023-06-15 23:23:18.84982	2023-06-15 23:23:18.84982	2023-06-15 23:23:18.84982
13	Deanna	Luettgen	Cleora_Donnelly33	Ignacio94@hotmail.com	$2b$10$GBPi7XecZ3sNe66k2k4pIePrJ6jiQBVIAkrnetQcXio2zPvrhOUkq	user	https://avatars.githubusercontent.com/u/7051334	Cupiditate accusantium voluptatibus impedit tempore.	f	offline	\N	2023-06-15 23:23:19.144389	2023-06-15 23:23:19.144389	2023-06-15 23:23:19.144389
7	Rod	Koss	Ike.Stanton11	Kolby24@yahoo.com	$2b$10$.5zQvYQVcdD1P9dc0M9IE.2tY/XThLorIh5OgDmF1FYXV5/B41F4e	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/232.jpg	A enim doloribus magni labore incidunt neque voluptatem.	f	offline	\N	2023-06-15 23:05:12.116236	2023-06-16 02:50:59.409	2023-06-16 02:50:59.403
8	Gracie	Stracke	Timmy_Marquardt28	Esther64@yahoo.com	$2b$10$fQYmwBqFAMC0gChq2Tkfi.ttIjutckc8.pwIhJ8Lb1SyJ4lHiATGe	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/750.jpg	Ipsam excepturi a eaque quibusdam cumque doloremque magnam magnam.	f	offline	\N	2023-06-15 23:05:12.195326	2023-06-16 02:48:45.895	2023-06-16 02:48:45.89
14	Toby	Bernier	Kamren_Smitham98	Terrence_Carroll37@yahoo.com	$2b$10$zdjEq8161iFgV2qlyJxEquYKoutKSXS8KB9l8UsIruy/jpeEaI716	user	https://avatars.githubusercontent.com/u/5596822	Blanditiis quos vel hic fugiat fuga eligendi quo dolore.	f	offline	\N	2023-06-15 23:23:19.21863	2023-06-16 02:34:47.899	2023-06-16 02:34:47.894
16	Brooks	Stark	Jonatan79	Presley_OReilly52@gmail.com	$2b$10$/3a3HMGPsWoj3jj6QgaLu..VKjIoN/puuDGjqCWOByBMWajPgcUrS	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1148.jpg	Eaque ratione id architecto at.	f	offline	\N	2023-06-15 23:23:19.357497	2023-06-16 02:46:56.543	2023-06-16 02:46:56.537
10	Nicklaus	Steuber	Lloyd25	Ashley91@yahoo.com	$2b$10$KFuAhpr0pMACmc2gbkzvNO.YHf8JO/K/mTjWxzsF6oWhOLQxTIx.W	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/775.jpg	Excepturi eos perferendis ullam.	f	offline	\N	2023-06-15 23:23:18.916448	2023-06-16 02:51:53.358	2023-06-16 02:51:53.352
5	Rosemary	Breitenberg	Davin.Wunsch32	Jakob.Stark60@gmail.com	$2b$10$ThBR9XyHGy5aRv9dpzQOnOxp/MMS7oh1adg8Pak7aYx0YuTo2IanC	user	https://avatars.githubusercontent.com/u/44420470	Impedit minus quia vitae iure aliquid dolor.	f	offline	\N	2023-06-15 23:05:11.983213	2023-06-16 02:53:05.443	2023-06-16 02:53:05.437
12	Trudie	Koelpin	Demond47	Terrill59@yahoo.com	$2b$10$BQdu.uyMPgU9Gbny6.VQJuIbj.022TeNwEMWhG.1wGJkGH9q.KZGG	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1186.jpg	Officiis sapiente doloremque nobis magnam sunt laborum totam a.	f	offline	\N	2023-06-15 23:23:19.074919	2023-06-16 02:58:39.179	2023-06-16 02:58:39.175
4	Antoinette	Rippin	Lyric12	Marshall.Bins@yahoo.com	$2b$10$PqdsWOTH56DG00Wvsn/4z.IiSCwgp6gBd4qqtzqhOQDJb.X2fS/02	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/424.jpg	Recusandae voluptas officia quaerat neque nisi.	f	offline	\N	2023-06-15 23:05:11.907128	2023-06-16 02:55:47.185	2023-06-16 02:55:47.181
11	Colin	Johnston	Aleen_Stamm11	Laney.Schmeler0@gmail.com	$2b$10$kS9/kIkLOVoQt87AG21qRuabFu14kwLEkMRB5Rad4PL.57YW/7C7q	user	https://avatars.githubusercontent.com/u/35595372	Ipsa distinctio magni non repellendus.	f	offline	\N	2023-06-15 23:23:18.979132	2023-06-16 15:18:12.594	2023-06-16 15:18:12.585
1	Julio	Kessler	login1	Tia.Moen61@hotmail.com	$2b$10$jXoNqYAMQ/3tti1B2K8iVe3uR.EVtpFof.jGe8JAXIQkFeIvez8QK	user	https://avatars.githubusercontent.com/u/48230799	Iste quam quae eaque occaecati nihil voluptates voluptatibus ipsum.	f	offline	\N	2023-06-15 23:05:11.194982	2023-06-16 15:18:26.049	2023-06-16 18:34:11.734
0	Bot	Bot	Bot	botmail@mail.com	\N	user	https://t3.ftcdn.net/jpg/01/36/49/90/360_F_136499077_xp7bSQB4Dx13ktQp0OYJ5ricWXhiFtD2.jpg	Description de bot	t	absent	\N	2023-06-15 23:05:11.194982	2023-06-16 18:36:02.478	2023-06-15 23:05:11.194982
6	Adolphus	Rodriguez	Marion_Donnelly53	Allen78@gmail.com	$2b$10$x1Q0PD3Iql9nlEZQGzf/buSpYAN9CMduduYQUKKbRCjX1tCx2VNJa	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/433.jpg	Facilis occaecati voluptates modi voluptatibus repellat voluptatum vel enim deleniti.	f	absent	\N	2023-06-15 23:05:12.046586	2023-06-16 16:10:48.795	2023-06-16 18:30:33.133
22	Jean-michel	Rasser	jrasser	jrasser@student.42mulhouse.fr	\N	user	http://localhost:3000/avatars/avatar-1686926700265-120853.jpg	\N	f	absent	\N	2023-06-16 14:45:00.350129	2023-06-16 16:26:48.813	2023-06-16 18:35:22.898
\.


--
-- Data for Name: users-relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."users-relation" (id, "relationType", "mutuelBlocked", "createdAt", "updatedAt", "userInitiateurId", "userRelationId") FROM stdin;
7	pending	f	2023-06-16 00:38:22.446526	2023-06-16 00:38:22.446526	1	17
8	pending	f	2023-06-16 00:38:22.806259	2023-06-16 00:38:22.806259	1	19
9	pending	f	2023-06-16 00:38:23.109709	2023-06-16 00:38:23.109709	1	21
13	pending	f	2023-06-16 00:38:24.189132	2023-06-16 00:38:24.189132	1	0
14	pending	f	2023-06-16 00:38:24.485623	2023-06-16 00:38:24.485623	1	13
15	pending	f	2023-06-16 00:38:25.020807	2023-06-16 00:38:25.020807	1	20
2	friend	f	2023-06-15 23:30:19.692645	2023-06-16 00:38:50.999	1	16
17	pending	f	2023-06-16 02:24:17.982653	2023-06-16 02:24:17.982653	14	18
18	pending	f	2023-06-16 02:24:18.382718	2023-06-16 02:24:18.382718	14	20
19	pending	f	2023-06-16 02:24:18.756513	2023-06-16 02:24:18.756513	14	9
20	pending	f	2023-06-16 02:24:19.086496	2023-06-16 02:24:19.086496	14	13
21	friend	f	2023-06-16 02:24:20.028666	2023-06-16 02:24:29.144	14	1
23	pending	f	2023-06-16 02:36:11.310931	2023-06-16 02:36:11.310931	11	14
24	pending	f	2023-06-16 02:36:12.190136	2023-06-16 02:36:12.190136	11	13
25	pending	f	2023-06-16 02:36:12.773982	2023-06-16 02:36:12.773982	11	9
26	pending	f	2023-06-16 02:36:14.213904	2023-06-16 02:36:14.213904	11	17
22	friend	f	2023-06-16 02:36:10.516667	2023-06-16 02:36:38.152	11	1
28	pending	f	2023-06-16 02:40:44.166573	2023-06-16 02:40:44.166573	6	2
29	pending	f	2023-06-16 02:40:44.62994	2023-06-16 02:40:44.62994	6	3
33	pending	f	2023-06-16 02:40:46.045115	2023-06-16 02:40:46.045115	6	17
34	pending	f	2023-06-16 02:40:46.325169	2023-06-16 02:40:46.325169	6	18
35	pending	f	2023-06-16 02:40:46.639608	2023-06-16 02:40:46.639608	6	19
36	pending	f	2023-06-16 02:40:46.917596	2023-06-16 02:40:46.917596	6	20
37	pending	f	2023-06-16 02:40:47.243407	2023-06-16 02:40:47.243407	6	21
39	pending	f	2023-06-16 02:40:47.83691	2023-06-16 02:40:47.83691	6	9
42	pending	f	2023-06-16 02:40:48.693472	2023-06-16 02:40:48.693472	6	13
43	pending	f	2023-06-16 02:40:48.956834	2023-06-16 02:40:48.956834	6	0
5	friend	f	2023-06-15 23:30:21.045207	2023-06-16 02:40:56.826	1	6
16	friend	f	2023-06-16 02:24:17.624808	2023-06-16 02:40:57.638	14	6
27	friend	f	2023-06-16 02:36:15.244522	2023-06-16 02:40:58.208	11	6
45	friend	f	2023-06-16 02:40:52.998396	2023-06-16 02:45:16.422	6	16
46	pending	f	2023-06-16 02:47:13.518799	2023-06-16 02:47:13.518799	8	3
47	pending	f	2023-06-16 02:47:15.167932	2023-06-16 02:47:15.167932	8	2
50	pending	f	2023-06-16 02:47:17.9169	2023-06-16 02:47:17.9169	8	9
51	pending	f	2023-06-16 02:47:18.918217	2023-06-16 02:47:18.918217	8	21
52	pending	f	2023-06-16 02:47:19.82905	2023-06-16 02:47:19.82905	8	20
3	friend	f	2023-06-15 23:30:20.209733	2023-06-16 02:47:54.928	1	8
32	friend	f	2023-06-16 02:40:45.740921	2023-06-16 02:47:55.527	6	8
49	friend	f	2023-06-16 02:47:17.02936	2023-06-16 02:48:58.071	8	7
4	friend	f	2023-06-15 23:30:20.607792	2023-06-16 02:48:58.509	1	7
38	friend	f	2023-06-16 02:40:47.532673	2023-06-16 02:48:58.974	6	7
10	friend	f	2023-06-16 00:38:23.381524	2023-06-16 02:51:27.964	1	10
1	friend	f	2023-06-15 23:30:17.575387	2023-06-16 02:52:20.552	1	5
31	friend	f	2023-06-16 02:40:45.389554	2023-06-16 02:52:21.012	6	5
53	pending	f	2023-06-16 02:52:22.902689	2023-06-16 02:52:22.902689	5	18
54	pending	f	2023-06-16 02:52:23.20757	2023-06-16 02:52:23.20757	5	21
56	pending	f	2023-06-16 02:52:24.466708	2023-06-16 02:52:24.466708	5	20
57	pending	f	2023-06-16 02:52:24.717152	2023-06-16 02:52:24.717152	5	17
60	pending	f	2023-06-16 02:52:25.6542	2023-06-16 02:52:25.6542	5	14
61	pending	f	2023-06-16 02:52:26.08739	2023-06-16 02:52:26.08739	5	7
48	friend	f	2023-06-16 02:47:16.093908	2023-06-16 02:54:20.528	8	4
6	friend	f	2023-06-15 23:30:21.470447	2023-06-16 02:54:20.895	1	4
30	friend	f	2023-06-16 02:40:45.030992	2023-06-16 02:54:21.291	6	4
58	friend	f	2023-06-16 02:52:25.014498	2023-06-16 02:54:21.637	5	4
62	pending	f	2023-06-16 02:54:28.117228	2023-06-16 02:54:28.117228	4	19
63	pending	f	2023-06-16 02:54:28.509246	2023-06-16 02:54:28.509246	4	20
64	pending	f	2023-06-16 02:54:28.902474	2023-06-16 02:54:28.902474	4	21
65	pending	f	2023-06-16 02:54:29.294451	2023-06-16 02:54:29.294451	4	9
44	friend	f	2023-06-16 02:40:49.22877	2023-06-16 02:56:09.864	6	15
59	friend	f	2023-06-16 02:52:25.311414	2023-06-16 02:56:10.205	5	15
12	friend	f	2023-06-16 00:38:23.917229	2023-06-16 02:56:10.631	1	15
11	friend	f	2023-06-16 00:38:23.660869	2023-06-16 02:58:21.707	1	12
41	friend	f	2023-06-16 02:40:48.413735	2023-06-16 02:58:21.997	6	12
55	friend	f	2023-06-16 02:52:23.639124	2023-06-16 02:58:22.254	5	12
66	friend	f	2023-06-16 02:54:29.637679	2023-06-16 02:58:22.536	4	12
68	pending	f	2023-06-16 15:03:17.060546	2023-06-16 15:03:17.060546	22	12
70	pending	f	2023-06-16 15:03:17.997908	2023-06-16 15:03:17.997908	22	16
67	friend	f	2023-06-16 15:03:16.429334	2023-06-16 15:12:39.984	22	1
69	friend	f	2023-06-16 15:03:17.558076	2023-06-16 15:21:03.045	22	6
71	pending	f	2023-06-16 17:02:18.929864	2023-06-16 17:02:18.929864	6	10
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 144, true);


--
-- Name: chat_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_rooms_id_seq', 22, true);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_id_seq', 1, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 174, true);


--
-- Name: users-relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users-relation_id_seq"', 71, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


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
-- Name: games FK_e528275f53e8f4a97f1b2e7dfb8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8" FOREIGN KEY ("winnerId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

