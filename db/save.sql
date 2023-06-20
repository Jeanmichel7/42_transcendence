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
<<<<<<< HEAD
46	Joana.Cartwright has left the room	2023-06-18 01:42:36.416579	2023-06-18 01:42:36.416579	0	5
23	Joana.Cartwright has been banned	2023-06-18 01:26:08.938347	2023-06-18 01:26:08.938347	0	5
24	Joana.Cartwright has been unbanned	2023-06-18 01:26:28.373818	2023-06-18 01:26:28.373818	0	5
25	cc	2023-06-18 01:26:36.115048	2023-06-18 01:26:36.115048	3	5
47	Joana.Cartwright has left the room	2023-06-18 01:42:38.074764	2023-06-18 01:42:38.074764	0	6
26	yeah	2023-06-18 01:26:44.751196	2023-06-18 01:26:44.751196	3	5
27	Joana.Cartwright has been muted this idiot	2023-06-18 01:26:56.596153	2023-06-18 01:26:56.596153	0	5
64	6	2023-06-18 01:43:32.891414	2023-06-18 01:43:32.891414	12	5
28	Joana.Cartwright has been unmuted	2023-06-18 01:27:16.633578	2023-06-18 01:27:16.633578	0	5
48	1	2023-06-18 01:43:25.016493	2023-06-18 01:43:25.016493	12	5
29	ok	2023-06-18 01:27:27.871763	2023-06-18 01:27:27.871763	3	5
30	Invitation link http://localhost:3006/chat/channel/invitation/6/priv	2023-06-18 01:31:26.602769	2023-06-18 01:31:26.602769	0	6
31	Joana.Cartwright has join the room	2023-06-18 01:31:40.434886	2023-06-18 01:31:40.434886	0	6
49	2	2023-06-18 01:43:25.378065	2023-06-18 01:43:25.378065	12	5
32	Benjamin50 has join the room	2023-06-18 01:31:48.338361	2023-06-18 01:31:48.338361	0	6
11	Invitation link http://localhost:3006/chat/channel/invitation/5/Test	2023-06-18 00:12:03.972985	2023-06-18 00:12:03.972985	0	5
12	Joana.Cartwright has join the room	2023-06-18 00:13:15.599035	2023-06-18 00:13:15.599035	0	5
33	Benjamin50 has been muted this idiot	2023-06-18 01:32:10.35982	2023-06-18 01:32:10.35982	0	6
13	coucou	2023-06-18 00:13:25.003197	2023-06-18 00:13:25.003197	3	5
14	Joana.Cartwright has been muted this idiot	2023-06-18 01:05:51.751128	2023-06-18 01:05:51.751128	0	5
75	27	2023-06-18 01:43:38.41399	2023-06-18 01:43:38.41399	12	5
15	Joana.Cartwright has been unmuted	2023-06-18 01:05:52.243547	2023-06-18 01:05:52.243547	0	5
34	Benjamin50 has been kicked	2023-06-18 01:32:17.098288	2023-06-18 01:32:17.098288	0	6
16	Joana.Cartwright has been kicked	2023-06-18 01:06:03.320986	2023-06-18 01:06:03.320986	0	5
17	coucou	2023-06-18 01:16:53.170602	2023-06-18 01:16:53.170602	12	5
50	3	2023-06-18 01:43:25.80136	2023-06-18 01:43:25.80136	12	5
18	Joana.Cartwright has join the room	2023-06-18 01:25:46.229101	2023-06-18 01:25:46.229101	0	5
35	Benjamin50 has been unmuted	2023-06-18 01:32:30.392121	2023-06-18 01:32:30.392121	0	6
19	Joana.Cartwright has been kicked	2023-06-18 01:25:50.568675	2023-06-18 01:25:50.568675	0	5
20	Joana.Cartwright has join the room	2023-06-18 01:25:59.707656	2023-06-18 01:25:59.707656	0	5
21	Joana.Cartwright has left the room	2023-06-18 01:26:03.709465	2023-06-18 01:26:03.709465	0	5
36	Jon.Torp has join the room	2023-06-18 01:32:52.558153	2023-06-18 01:32:52.558153	0	6
22	Joana.Cartwright has join the room	2023-06-18 01:26:05.445344	2023-06-18 01:26:05.445344	0	5
65	17	2023-06-18 01:43:33.367959	2023-06-18 01:43:33.367959	12	5
37	Benjamin50 has join the room	2023-06-18 01:32:57.634583	2023-06-18 01:32:57.634583	0	6
51	4	2023-06-18 01:43:26.170688	2023-06-18 01:43:26.170688	12	5
38	coucou	2023-06-18 01:34:05.602233	2023-06-18 01:34:05.602233	2	6
39	wtf	2023-06-18 01:41:10.19689	2023-06-18 01:41:10.19689	3	6
40	oups	2023-06-18 01:41:14.410132	2023-06-18 01:41:14.410132	2	6
52	5	2023-06-18 01:43:26.514279	2023-06-18 01:43:26.514279	12	5
41	slt	2023-06-18 01:41:38.010341	2023-06-18 01:41:38.010341	12	5
42	cc	2023-06-18 01:41:40.069879	2023-06-18 01:41:40.069879	3	5
43	Benjamin50 has join the room	2023-06-18 01:41:47.5899	2023-06-18 01:41:47.5899	0	5
53	6	2023-06-18 01:43:26.813635	2023-06-18 01:43:26.813635	12	5
44	hey	2023-06-18 01:41:51.016476	2023-06-18 01:41:51.016476	2	5
45	blabla	2023-06-18 01:41:54.256781	2023-06-18 01:41:54.256781	2	5
66	18	2023-06-18 01:43:33.826429	2023-06-18 01:43:33.826429	12	5
54	7	2023-06-18 01:43:27.119916	2023-06-18 01:43:27.119916	12	5
83	Invitation link http://localhost:3006/chat/channel/invitation/12/gdffg	2023-06-18 02:50:54.551492	2023-06-18 02:50:54.551492	0	12
55	8	2023-06-18 01:43:27.424058	2023-06-18 01:43:27.424058	12	5
67	9	2023-06-18 01:43:34.280418	2023-06-18 01:43:34.280418	12	5
56	9	2023-06-18 01:43:27.758937	2023-06-18 01:43:27.758937	12	5
57	10	2023-06-18 01:43:28.521641	2023-06-18 01:43:28.521641	12	5
76	28	2023-06-18 01:43:38.898014	2023-06-18 01:43:38.898014	12	5
58	1	2023-06-18 01:43:28.952666	2023-06-18 01:43:28.952666	12	5
68	20	2023-06-18 01:43:34.830862	2023-06-18 01:43:34.830862	12	5
59	11	2023-06-18 01:43:29.975638	2023-06-18 01:43:29.975638	12	5
60	12	2023-06-18 01:43:30.716245	2023-06-18 01:43:30.716245	12	5
61	13	2023-06-18 01:43:31.523295	2023-06-18 01:43:31.523295	12	5
69	21	2023-06-18 01:43:35.281596	2023-06-18 01:43:35.281596	12	5
62	14	2023-06-18 01:43:31.971669	2023-06-18 01:43:31.971669	12	5
63	5	2023-06-18 01:43:32.452275	2023-06-18 01:43:32.452275	12	5
80	Invitation link http://localhost:3006/chat/channel/invitation/9/aaaa	2023-06-18 02:44:01.172022	2023-06-18 02:44:01.172022	0	9
70	22	2023-06-18 01:43:35.739892	2023-06-18 01:43:35.739892	12	5
77	30	2023-06-18 01:43:40.86487	2023-06-18 01:43:40.86487	12	5
71	23	2023-06-18 01:43:36.174213	2023-06-18 01:43:36.174213	12	5
72	24	2023-06-18 01:43:36.631152	2023-06-18 01:43:36.631152	12	5
73	2	2023-06-18 01:43:37.036865	2023-06-18 01:43:37.036865	12	5
78	Invitation link http://localhost:3006/chat/channel/invitation/7/dgdgf	2023-06-18 02:40:03.510255	2023-06-18 02:40:03.510255	0	7
74	26	2023-06-18 01:43:37.92011	2023-06-18 01:43:37.92011	12	5
82	Invitation link http://localhost:3006/chat/channel/invitation/11/qaqaqaqaq	2023-06-18 02:49:56.289324	2023-06-18 02:49:56.289324	0	11
79	Invitation link http://localhost:3006/chat/channel/invitation/8/dddddddd	2023-06-18 02:40:57.499292	2023-06-18 02:40:57.499292	0	8
81	Invitation link http://localhost:3006/chat/channel/invitation/10/vvvvvvvvvvvv	2023-06-18 02:45:51.660511	2023-06-18 02:45:51.660511	0	10
84	Invitation link http://localhost:3006/chat/channel/invitation/13/gdgffdfgddgddfg	2023-06-18 02:51:05.609892	2023-06-18 02:51:05.609892	0	13
85	Invitation link http://localhost:3006/chat/channel/invitation/14/wwwwww	2023-06-18 02:53:10.965823	2023-06-18 02:53:10.965823	0	14
86	Joana.Cartwright has join the room	2023-06-18 02:53:21.612228	2023-06-18 02:53:21.612228	0	14
87	dfsddf	2023-06-18 02:53:25.82364	2023-06-18 02:53:25.82364	3	14
88	Invitation link http://localhost:3006/chat/channel/invitation/15/BLIBLIB	2023-06-18 03:06:09.942512	2023-06-18 03:06:09.942512	0	15
89	Invitation link http://localhost:3006/chat/channel/invitation/16/Mouahahaa	2023-06-18 03:22:48.512074	2023-06-18 03:22:48.512074	0	16
91	jrasser has join the room	2023-06-18 03:32:45.319554	2023-06-18 03:32:45.319554	0	17
90	Invitation link http://localhost:3006/chat/channel/invitation/17/zxzxzzxzzxxzx	2023-06-18 03:32:14.978619	2023-06-18 03:32:14.978619	0	17
92	Invitation link http://localhost:3006/chat/channel/invitation/18/BLIBLIBLIB	2023-06-18 03:33:06.04664	2023-06-18 03:33:06.04664	0	18
93	jrasser has join the room	2023-06-18 03:33:11.125878	2023-06-18 03:33:11.125878	0	18
94	Invitation link http://localhost:3006/chat/channel/invitation/19/BLBALBA	2023-06-18 03:33:26.092744	2023-06-18 03:33:26.092744	0	19
95	coucou	2023-06-18 03:33:31.879734	2023-06-18 03:33:31.879734	2	19
96	Invitation link http://localhost:3006/chat/channel/invitation/20/:OUAHA	2023-06-18 03:38:25.024657	2023-06-18 03:38:25.024657	0	20
97	Joana.Cartwright has join the room	2023-06-18 03:38:30.808871	2023-06-18 03:38:30.808871	0	20
98	Invitation link http://localhost:3006/chat/channel/invitation/21/iiiiiii	2023-06-18 03:40:00.651244	2023-06-18 03:40:00.651244	0	21
99	Invitation link http://localhost:3006/chat/channel/invitation/22/ccccccc	2023-06-18 03:40:54.248808	2023-06-18 03:40:54.248808	0	22
100	Invitation link http://localhost:3006/chat/channel/invitation/23/zzzzzzzzzz	2023-06-18 03:42:28.107831	2023-06-18 03:42:28.107831	0	23
101	Invitation link http://localhost:3006/chat/channel/invitation/24/aaaaaaa	2023-06-18 03:43:52.985776	2023-06-18 03:43:52.985776	0	24
102	Invitation link http://localhost:3006/chat/channel/invitation/25/uuuuuuu	2023-06-18 03:45:05.90628	2023-06-18 03:45:05.90628	0	25
103	jrasser has join the room	2023-06-18 03:45:40.053687	2023-06-18 03:45:40.053687	0	25
104	Invitation link http://localhost:3006/chat/channel/invitation/26/ttttt	2023-06-18 04:00:04.529106	2023-06-18 04:00:04.529106	0	26
105	jrasser has join the room	2023-06-18 04:00:17.060426	2023-06-18 04:00:17.060426	0	26
=======
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
>>>>>>> JM--ChannelV2
\.


--
-- Data for Name: chat_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms (id, type, "isProtected", name, password, "createdAt", "updatedAt", "ownerUserId") FROM stdin;
<<<<<<< HEAD
5	public	f	Test	\N	2023-06-18 00:12:03.948883	2023-06-18 00:12:03.948883	12
6	private	f	priv	\N	2023-06-18 01:31:26.573986	2023-06-18 01:31:26.573986	12
7	private	f	dgdgf	\N	2023-06-18 02:40:03.478945	2023-06-18 02:40:03.478945	12
8	private	f	dddddddd	\N	2023-06-18 02:40:57.454858	2023-06-18 02:40:57.454858	12
9	private	f	aaaa	\N	2023-06-18 02:44:01.136797	2023-06-18 02:44:01.136797	12
10	private	f	vvvvvvvvvvvv	\N	2023-06-18 02:45:51.632504	2023-06-18 02:45:51.632504	12
11	private	f	qaqaqaqaq	\N	2023-06-18 02:49:56.254996	2023-06-18 02:49:56.254996	12
12	private	f	gdffg	\N	2023-06-18 02:50:54.520614	2023-06-18 02:50:54.520614	12
13	private	f	gdgffdfgddgddfg	\N	2023-06-18 02:51:05.58809	2023-06-18 02:51:05.58809	12
14	private	f	wwwwww	\N	2023-06-18 02:53:10.914591	2023-06-18 02:53:10.914591	12
15	private	f	BLIBLIB	\N	2023-06-18 03:06:09.877129	2023-06-18 03:06:09.877129	3
16	private	f	Mouahahaa	\N	2023-06-18 03:22:48.480043	2023-06-18 03:22:48.480043	3
17	private	f	zxzxzzxzzxxzx	\N	2023-06-18 03:32:14.949403	2023-06-18 03:32:14.949403	2
18	private	f	BLIBLIBLIB	\N	2023-06-18 03:33:06.024342	2023-06-18 03:33:06.024342	2
19	private	f	BLBALBA	\N	2023-06-18 03:33:26.072906	2023-06-18 03:33:26.072906	2
20	private	f	:OUAHA	\N	2023-06-18 03:38:24.997267	2023-06-18 03:38:24.997267	2
21	private	f	iiiiiii	\N	2023-06-18 03:40:00.630688	2023-06-18 03:40:00.630688	2
22	private	f	ccccccc	\N	2023-06-18 03:40:54.221807	2023-06-18 03:40:54.221807	2
23	private	f	zzzzzzzzzz	\N	2023-06-18 03:42:28.082713	2023-06-18 03:42:28.082713	2
24	private	f	aaaaaaa	\N	2023-06-18 03:43:52.966746	2023-06-18 03:43:52.966746	2
25	private	f	uuuuuuu	\N	2023-06-18 03:45:05.879602	2023-06-18 03:45:05.879602	2
26	private	f	ttttt	\N	2023-06-18 04:00:04.498838	2023-06-18 04:00:04.498838	2
=======
58	public	f	Hello	\N	2023-06-19 18:25:09.293451	2023-06-19 18:25:09.293451	24
59	private	f	Private	\N	2023-06-19 18:25:16.986254	2023-06-19 18:25:16.986254	25
>>>>>>> JM--ChannelV2
\.


--
-- Data for Name: chat_rooms_accepted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_accepted_users_users ("chatRoomsId", "usersId") FROM stdin;
<<<<<<< HEAD
6	0
7	3
7	6
7	0
8	3
8	6
8	0
9	6
9	3
9	0
11	3
11	6
11	0
13	3
13	0
14	6
14	0
15	6
15	12
15	2
15	0
16	12
16	0
17	0
18	0
19	12
19	0
20	12
20	0
21	12
21	0
22	12
22	0
23	12
23	0
24	12
24	0
25	0
26	0
=======
59	0
>>>>>>> JM--ChannelV2
\.


--
-- Data for Name: chat_rooms_admins_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_admins_users ("chatRoomsId", "usersId") FROM stdin;
<<<<<<< HEAD
5	12
6	12
7	12
8	12
9	12
10	12
11	12
12	12
13	12
14	12
15	3
16	3
17	2
18	2
19	2
20	2
21	2
22	2
23	2
24	2
25	2
26	2
=======
58	24
59	25
58	25
>>>>>>> JM--ChannelV2
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
<<<<<<< HEAD
5	12
6	12
6	6
6	2
5	2
7	12
8	12
9	12
10	12
11	12
12	12
13	12
14	12
14	3
15	3
16	3
17	2
17	12
18	2
18	12
19	2
20	2
20	3
21	2
22	2
23	2
24	2
25	2
25	12
26	2
26	12
=======
58	24
59	25
59	24
58	25
59	29
58	29
>>>>>>> JM--ChannelV2
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
<<<<<<< HEAD
1	helllo	2023-06-18 00:13:00.261499	2023-06-18 00:13:00.261499	12	3
2	coucou	2023-06-18 00:13:05.916224	2023-06-18 00:13:05.916224	3	12
3	slt	2023-06-18 01:43:09.894962	2023-06-18 01:43:09.894962	3	6
=======
16	elo	2023-06-19 18:24:58.014339	2023-06-19 18:24:58.014339	24	25
17	hello	2023-06-19 18:25:03.283594	2023-06-19 18:25:03.283594	25	24
18	cc	2023-06-19 18:56:05.483116	2023-06-19 18:56:05.483116	29	25
19	hello	2023-06-19 19:05:30.359879	2023-06-19 19:05:30.359879	27	24
20	slt	2023-06-19 19:46:59.950707	2023-06-19 19:46:59.950707	25	24
>>>>>>> JM--ChannelV2
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, content, read, "createdAt", "updatedAt", "senderId", "receiverId", "invitationLink") FROM stdin;
<<<<<<< HEAD
108	roomInvite	you have been invited to join the room BLIBLIB	f	2023-06-18 03:06:10.197115	2023-06-18 03:06:10.197115	3	0	/chat/channel/invitation/15/BLIBLIB
106	roomInvite	you have been invited to join the room BLIBLIB	t	2023-06-18 03:06:10.131773	2023-06-18 03:06:10.131773	3	12	/chat/channel/invitation/15/BLIBLIB
105	roomInvite	you have been invited to join the room BLIBLIB	t	2023-06-18 03:06:10.101085	2023-06-18 03:06:10.101085	3	6	/chat/channel/invitation/15/BLIBLIB
110	roomInvite	you have been invited to join the room Mouahahaa	f	2023-06-18 03:22:48.559236	2023-06-18 03:22:48.559236	3	0	/chat/channel/invitation/16/Mouahahaa
109	roomInvite	you have been invited to join the room Mouahahaa	t	2023-06-18 03:22:48.545275	2023-06-18 03:22:48.545275	3	12	/chat/channel/invitation/16/Mouahahaa
113	roomInvite	you have been invited to join the room zxzxzzxzzxxzx	f	2023-06-18 03:32:15.011744	2023-06-18 03:32:15.011744	2	0	/chat/channel/invitation/17/zxzxzzxzzxxzx
112	roomInvite	you have been invited to join the room zxzxzzxzzxxzx	t	2023-06-18 03:32:15.007388	2023-06-18 03:32:15.007388	2	12	/chat/channel/invitation/17/zxzxzzxzzxxzx
111	friendRequestAccepted	accepted your friend request	t	2023-06-18 03:32:08.010748	2023-06-18 03:32:08.010748	2	12	\N
131	roomInvite	you have been invited to join the room ttttt	t	2023-06-18 04:00:04.554384	2023-06-18 04:00:04.554384	2	12	/chat/channel/invitation/26/ttttt
107	roomInvite	you have been invited to join the room BLIBLIB	t	2023-06-18 03:06:10.161693	2023-06-18 03:06:10.161693	3	2	/chat/channel/invitation/15/BLIBLIB
115	roomInvite	you have been invited to join the room BLIBLIBLIB	f	2023-06-18 03:33:06.073373	2023-06-18 03:33:06.073373	2	0	/chat/channel/invitation/18/BLIBLIBLIB
114	roomInvite	you have been invited to join the room BLIBLIBLIB	t	2023-06-18 03:33:06.067823	2023-06-18 03:33:06.067823	2	12	/chat/channel/invitation/18/BLIBLIBLIB
117	roomInvite	you have been invited to join the room BLBALBA	f	2023-06-18 03:33:26.11878	2023-06-18 03:33:26.11878	2	0	/chat/channel/invitation/19/BLBALBA
116	roomInvite	you have been invited to join the room BLBALBA	t	2023-06-18 03:33:26.113074	2023-06-18 03:33:26.113074	2	12	/chat/channel/invitation/19/BLBALBA
120	roomInvite	you have been invited to join the room :OUAHA	f	2023-06-18 03:38:25.072359	2023-06-18 03:38:25.072359	2	0	/chat/channel/invitation/20/:OUAHA
119	roomInvite	you have been invited to join the room :OUAHA	t	2023-06-18 03:38:25.068218	2023-06-18 03:38:25.068218	2	3	/chat/channel/invitation/20/:OUAHA
118	roomInvite	you have been invited to join the room :OUAHA	t	2023-06-18 03:38:25.060387	2023-06-18 03:38:25.060387	2	12	/chat/channel/invitation/20/:OUAHA
122	roomInvite	you have been invited to join the room iiiiiii	f	2023-06-18 03:40:00.675445	2023-06-18 03:40:00.675445	2	0	/chat/channel/invitation/21/iiiiiii
121	roomInvite	you have been invited to join the room iiiiiii	t	2023-06-18 03:40:00.67105	2023-06-18 03:40:00.67105	2	12	/chat/channel/invitation/21/iiiiiii
124	roomInvite	you have been invited to join the room ccccccc	f	2023-06-18 03:40:54.275259	2023-06-18 03:40:54.275259	2	0	/chat/channel/invitation/22/ccccccc
123	roomInvite	you have been invited to join the room ccccccc	t	2023-06-18 03:40:54.270911	2023-06-18 03:40:54.270911	2	12	/chat/channel/invitation/22/ccccccc
126	roomInvite	you have been invited to join the room zzzzzzzzzz	f	2023-06-18 03:42:28.136003	2023-06-18 03:42:28.136003	2	0	/chat/channel/invitation/23/zzzzzzzzzz
125	roomInvite	you have been invited to join the room zzzzzzzzzz	t	2023-06-18 03:42:28.13107	2023-06-18 03:42:28.13107	2	12	/chat/channel/invitation/23/zzzzzzzzzz
128	roomInvite	you have been invited to join the room aaaaaaa	f	2023-06-18 03:43:53.009194	2023-06-18 03:43:53.009194	2	0	/chat/channel/invitation/24/aaaaaaa
127	roomInvite	you have been invited to join the room aaaaaaa	t	2023-06-18 03:43:53.004496	2023-06-18 03:43:53.004496	2	12	/chat/channel/invitation/24/aaaaaaa
130	roomInvite	you have been invited to join the room uuuuuuu	f	2023-06-18 03:45:05.956493	2023-06-18 03:45:05.956493	2	0	/chat/channel/invitation/25/uuuuuuu
129	roomInvite	you have been invited to join the room uuuuuuu	t	2023-06-18 03:45:05.952418	2023-06-18 03:45:05.952418	2	12	/chat/channel/invitation/25/uuuuuuu
132	roomInvite	you have been invited to join the room ttttt	f	2023-06-18 04:00:04.56032	2023-06-18 04:00:04.56032	2	0	/chat/channel/invitation/26/ttttt
=======
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
>>>>>>> JM--ChannelV2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt", "lastActivity") FROM stdin;
<<<<<<< HEAD
2	Ressie	Fisher	Benjamin50	Leon.Fahey1@gmail.com	$2b$10$cgmbHX2D7VP3Hf.PUrz3m.QE6eK3QJbcnSXqlXRkmJuTLK5Nuu0vi	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/699.jpg	Nulla magni expedita quam.	f	absent	\N	2023-06-17 22:22:32.741511	2023-06-18 02:51:48.333	2023-06-18 04:00:04.487
0	Bot	Bot	Bot	bot@mail.com	\N	user	https://t3.ftcdn.net/jpg/01/36/49/90/360_F_136499077_xp7bSQB4Dx13ktQp0OYJ5ricWXhiFtD2.jpg	bot description	f	absent	\N	2023-06-17 22:22:16.018156	2023-06-18 04:00:21.614	2023-06-17 22:22:16.018156
4	Zackary	Leuschke	Maddison.Nolan69	Hollis_Schultz31@hotmail.com	$2b$10$4oCYnR2crVTmQxBNCAmUg.3bDcanf4sovnPSgTAq6rwngsY6uXom2	user	https://avatars.githubusercontent.com/u/90351874	Unde cumque explicabo assumenda consectetur tempore asperiores ea enim.	f	offline	\N	2023-06-17 22:22:32.870325	2023-06-17 22:22:32.870325	2023-06-17 22:22:32.870325
5	Nico	Mayert	Icie_Mayer	Jairo.Hoeger60@gmail.com	$2b$10$pTCACJl4jLHb4mn0xi.cXuIeohTBMsmylEfMsBf6o38zTPjVdsKMO	user	https://avatars.githubusercontent.com/u/37201890	Molestias laborum laborum quae minus nemo ratione iusto.	f	offline	\N	2023-06-17 22:22:32.932016	2023-06-17 22:22:32.932016	2023-06-17 22:22:32.932016
7	Johnathon	Nicolas	Talon.Cartwright33	Evans70@yahoo.com	$2b$10$sDiVkK8HTWjLhnbDnQMZuu3jtu0VM1IBdSsrt4WEoiB7YSeDIHPaC	user	https://avatars.githubusercontent.com/u/15462752	Ipsum repellat reprehenderit fugit inventore veritatis minima.	f	offline	\N	2023-06-17 22:22:33.057834	2023-06-17 22:22:33.057834	2023-06-17 22:22:33.057834
8	Hadley	Beatty	Friedrich_Lakin	Tina.Cormier20@gmail.com	$2b$10$HO8chHJIZKgDwfZC4jU1NO6jPg8v46ygjatlVpKbp9m7w/xop0nDa	user	https://avatars.githubusercontent.com/u/22865324	Dicta necessitatibus iste facere suscipit odio.	f	offline	\N	2023-06-17 22:22:33.12163	2023-06-17 22:22:33.12163	2023-06-17 22:22:33.12163
9	Myrna	Ferry	Corene.Roob30	Reid_Grimes@hotmail.com	$2b$10$5sv.FznN3jpX7VQQI7A1NO5Xgxpzc6CfGLMw//F4p3Kcm4W3IJjZ2	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/158.jpg	Suscipit veritatis voluptatem voluptates commodi.	f	offline	\N	2023-06-17 22:22:33.181338	2023-06-17 22:22:33.181338	2023-06-17 22:22:33.181338
10	Jimmy	McGlynn-Kshlerin	Zechariah_Stroman50	Vallie.Ullrich@gmail.com	$2b$10$ND.lHAg2xT27ENeU08fO9OiNtRMlKvy62y2uzVEhpvWj52Quog3Lu	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/923.jpg	Suscipit ipsum aut unde quis cum dolorum ab incidunt accusantium.	f	offline	\N	2023-06-17 22:22:33.242532	2023-06-17 22:22:33.242532	2023-06-17 22:22:33.242532
11	Idell	Abernathy	Verlie.Reilly	Ottilie6@hotmail.com	$2b$10$nKQGm1VJ/97lpmNIyQzUIOIzS0Hm4EKsK7C3aiSq2phfqJz8vfhGK	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/789.jpg	Aliquid natus eligendi cupiditate ipsam ad libero nihil consequatur.	f	offline	\N	2023-06-17 22:22:33.303534	2023-06-17 22:22:33.303534	2023-06-17 22:22:33.303534
6	Kareem	Powlowski	Jon.Torp	Logan_Ankunding81@hotmail.com	$2b$10$O0rHoAj1BdOj6mj3m8oXouFPDRh9EN3t4f5jqXC2l.hhfN51RxTOm	user	https://avatars.githubusercontent.com/u/97260829	Autem minus ab aspernatur molestiae exercitationem necessitatibus facilis dignissimos provident.	f	offline	\N	2023-06-17 22:22:32.993764	2023-06-17 22:22:32.993764	2023-06-18 03:59:05.898
3	Mustafa	McGlynn	Joana.Cartwright	Devan.Abbott75@gmail.com	$2b$10$uZYrFAEZbH5P1pacq6s0NeEMGHk89kg3t4rg2XAOErzaTh1S9ZfMS	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/584.jpg	Necessitatibus asperiores incidunt expedita adipisci delectus inventore beatae ducimus.	f	absent	\N	2023-06-17 22:22:32.806413	2023-06-18 02:25:32.569	2023-06-18 03:59:06.008
12	Jean-michel	Rasser	jrasser	jrasser@student.42mulhouse.fr	\N	user	http://localhost:3000/avatars/avatar-1687046709734-714939.png	\N	f	online	\N	2023-06-17 23:53:44.75819	2023-06-18 03:39:54.282	2023-06-18 04:00:22.981
=======
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
>>>>>>> JM--ChannelV2
\.


--
-- Data for Name: users-relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."users-relation" (id, "relationType", "mutuelBlocked", "createdAt", "updatedAt", "userInitiateurId", "userRelationId") FROM stdin;
<<<<<<< HEAD
10	friend	f	2023-06-17 22:36:28.575896	2023-06-17 22:36:34.907	3	2
28	pending	f	2023-06-17 22:55:09.097375	2023-06-17 22:55:09.097375	3	9
29	pending	f	2023-06-17 22:55:09.29191	2023-06-17 22:55:09.29191	3	10
34	pending	f	2023-06-17 22:55:21.763398	2023-06-17 22:55:21.763398	3	5
35	pending	f	2023-06-17 22:55:21.907834	2023-06-17 22:55:21.907834	3	7
31	friend	f	2023-06-17 22:55:09.595713	2023-06-18 01:30:40.301	3	6
43	friend	f	2023-06-18 00:05:42.085934	2023-06-18 01:30:40.932	12	6
46	pending	f	2023-06-18 01:33:21.021019	2023-06-18 01:33:21.021019	12	7
47	pending	f	2023-06-18 01:33:21.286501	2023-06-18 01:33:21.286501	12	8
48	pending	f	2023-06-18 01:33:21.587265	2023-06-18 01:33:21.587265	12	9
49	pending	f	2023-06-18 01:33:21.852575	2023-06-18 01:33:21.852575	12	10
50	pending	f	2023-06-18 01:33:22.118109	2023-06-18 01:33:22.118109	12	11
52	pending	f	2023-06-18 02:39:14.792132	2023-06-18 02:39:14.792132	12	5
53	pending	f	2023-06-18 02:39:15.175782	2023-06-18 02:39:15.175782	12	4
51	friend	f	2023-06-18 02:39:14.417243	2023-06-18 02:39:21.146	12	3
54	friend	f	2023-06-18 02:39:15.598536	2023-06-18 03:32:08.006	12	2
=======
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
>>>>>>> JM--ChannelV2
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

<<<<<<< HEAD
SELECT pg_catalog.setval('public.chat_messages_id_seq', 105, true);
=======
SELECT pg_catalog.setval('public.chat_messages_id_seq', 363, true);
>>>>>>> JM--ChannelV2


--
-- Name: chat_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

<<<<<<< HEAD
SELECT pg_catalog.setval('public.chat_rooms_id_seq', 26, true);
=======
SELECT pg_catalog.setval('public.chat_rooms_id_seq', 59, true);
>>>>>>> JM--ChannelV2


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_id_seq', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

<<<<<<< HEAD
SELECT pg_catalog.setval('public.messages_id_seq', 3, true);
=======
SELECT pg_catalog.setval('public.messages_id_seq', 20, true);
>>>>>>> JM--ChannelV2


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

<<<<<<< HEAD
SELECT pg_catalog.setval('public.notifications_id_seq', 132, true);
=======
SELECT pg_catalog.setval('public.notifications_id_seq', 219, true);
>>>>>>> JM--ChannelV2


--
-- Name: users-relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

<<<<<<< HEAD
SELECT pg_catalog.setval('public."users-relation_id_seq"', 54, true);
=======
SELECT pg_catalog.setval('public."users-relation_id_seq"', 109, true);
>>>>>>> JM--ChannelV2


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

<<<<<<< HEAD
SELECT pg_catalog.setval('public.users_id_seq', 12, true);
=======
SELECT pg_catalog.setval('public.users_id_seq', 34, true);
>>>>>>> JM--ChannelV2


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

