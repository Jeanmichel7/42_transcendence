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
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "userRelationId" bigint,
    "mutuelBlocked" boolean DEFAULT false NOT NULL,
    "userInitiateurId" bigint
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
393	jrasser has left the room	2023-06-20 17:35:49.215027	2023-06-20 17:35:49.215027	0	68
394	jrasser has join the room	2023-06-20 17:35:52.354396	2023-06-20 17:35:52.354396	0	68
395	jrasser has join the room	2023-06-20 17:35:54.137012	2023-06-20 17:35:54.137012	0	69
432	Grayce_Dach has left the room	2023-06-20 18:57:35.566295	2023-06-20 18:57:35.566295	0	78
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
684	l	2023-06-21 00:28:45.331432	2023-06-21 00:28:45.331432	32	68
402	sdfsdsdfdff	2023-06-20 17:37:06.528336	2023-06-20 17:37:06.528336	32	70
403	Invitation link http://localhost:3006/chat/channel/invitation/71/qweewqewqeqeqwe	2023-06-20 17:38:02.370585	2023-06-20 17:38:02.370585	0	71
404	Grayce_Dach has join the room	2023-06-20 17:38:24.070481	2023-06-20 17:38:24.070481	0	71
433	Grayce_Dach has join the room	2023-06-20 19:06:32.85378	2023-06-20 19:06:32.85378	0	78
405	Invitation link http://localhost:3006/chat/channel/invitation/72/DDDDDDDDDD	2023-06-20 17:52:38.383449	2023-06-20 17:52:38.383449	0	72
406	jrasser has join the room	2023-06-20 17:52:46.992809	2023-06-20 17:52:46.992809	0	72
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
725	Grayce_Dach has been kicked	2023-06-21 00:54:42.895399	2023-06-21 00:54:42.895399	0	68
743	coucou	2023-06-21 13:23:46.687363	2023-06-21 13:23:46.687363	29	68
877	Invitation link http://localhost:3006/chat/channel/invitation/86/bbbbbbbbbbbbbbb	2023-06-21 15:21:53.343824	2023-06-21 15:21:53.343824	0	86
878	jrasser has join the room	2023-06-21 15:21:57.84513	2023-06-21 15:21:57.84513	0	86
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
964	Grayce_Dach has join the room	2023-06-21 16:54:02.56396	2023-06-21 16:54:02.56396	0	85
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
1127	dddddd	2023-06-21 18:18:59.515597	2023-06-21 18:18:59.515597	32	68
1139	sdfsdfdsfsfsfsdfsdffsdfdsffsfsfsf	2023-06-21 18:19:07.494929	2023-06-21 18:19:07.494929	32	68
1141	f	2023-06-21 18:19:07.760781	2023-06-21 18:19:07.760781	32	68
1138	sdfsdfdsfsfsfsdfsdffsdfdsf	2023-06-21 18:19:06.337705	2023-06-21 18:19:06.337705	32	68
1143	d	2023-06-21 18:19:12.817839	2023-06-21 18:19:12.817839	32	68
1144	f	2023-06-21 18:19:13.614325	2023-06-21 18:19:13.614325	32	68
1145	d	2023-06-21 18:19:14.190968	2023-06-21 18:19:14.190968	32	68
1146	s	2023-06-21 18:19:14.653774	2023-06-21 18:19:14.653774	32	68
1147	a	2023-06-21 18:19:15.110812	2023-06-21 18:19:15.110812	32	68
1148	s	2023-06-21 18:19:15.501414	2023-06-21 18:19:15.501414	32	68
1149	d	2023-06-21 18:19:15.851335	2023-06-21 18:19:15.851335	32	68
1150	f	2023-06-21 18:19:16.193056	2023-06-21 18:19:16.193056	32	68
1151	g	2023-06-21 18:19:16.536941	2023-06-21 18:19:16.536941	32	68
1152	r	2023-06-21 18:19:17.223362	2023-06-21 18:19:17.223362	32	68
1153	w	2023-06-21 18:19:17.837902	2023-06-21 18:19:17.837902	32	68
1154	q	2023-06-21 18:19:18.264377	2023-06-21 18:19:18.264377	32	68
1155	ddddd	2023-06-21 18:19:20.014789	2023-06-21 18:19:20.014789	32	68
1156	dfsdf df sd fsd dsf f dsf sdf sf	2023-06-21 18:19:23.27392	2023-06-21 18:19:23.27392	32	68
1137	aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa	2023-06-21 18:19:06.280241	2023-06-21 23:20:20.645	32	68
1142	s	2023-06-21 18:19:08.755365	2023-06-21 18:19:08.755365	32	68
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
1234	ertyuiytetui	2023-06-21 22:46:04.797728	2023-06-21 22:46:04.797728	35	84
1235	fgd fddfg gfd fdgffd ddfgfgfgfdg fdgfdgdf g fdgfg fd gfd gfd gdfgfdgdf gdf gfgdf gdf gfd g dfg gf dg	2023-06-21 22:52:49.812256	2023-06-21 22:52:49.812256	35	84
1236	fsd sdf sdfsd fsdf sd sd sdfds sd dsfsdffdsfdsfdfdsfsfsdfddsfsdf sdf dsfsdfsdf sdf sdf sdf sd fsd fds fds fsd fsd f sdf sd f	2023-06-21 22:53:09.453982	2023-06-21 22:53:09.453982	35	84
1237	dfdsfd sdff	2023-06-21 22:53:22.906282	2023-06-21 22:53:22.906282	35	84
1238	rewrer w wer ewr ewr ewr ewre ewr ere wrwe werweewrewrewrwe rewrew ewr erewr	2023-06-21 22:53:36.119095	2023-06-21 22:53:36.119095	35	84
1239	sdsad sad	2023-06-21 22:56:53.956093	2023-06-21 22:56:53.956093	35	84
1240	sadsadad	2023-06-21 23:00:39.04749	2023-06-21 23:00:39.04749	35	68
1241	sadaasd	2023-06-21 23:01:09.236932	2023-06-21 23:01:09.236932	35	85
1242	ddddddd	2023-06-21 23:01:11.73757	2023-06-21 23:01:11.73757	35	85
1243	xzXZxZX	2023-06-21 23:03:38.017587	2023-06-21 23:03:38.017587	35	84
1244	sdfdfdsf	2023-06-21 23:06:44.90015	2023-06-21 23:06:44.90015	35	84
1245	fsdf sdf sdfd fsd sdf df	2023-06-21 23:08:44.55711	2023-06-21 23:08:44.55711	35	84
1246	sdasdadassdsadsadadsas d sadsadsaasd	2023-06-21 23:15:04.993772	2023-06-21 23:15:04.993772	35	68
1247	fffffff	2023-06-21 23:18:37.718779	2023-06-21 23:18:37.718779	32	88
1248	dddddd	2023-06-21 23:18:44.317775	2023-06-21 23:18:44.317775	35	88
1249	dfsddf	2023-06-21 23:19:43.56531	2023-06-21 23:19:43.56531	35	68
1250	fsdd s dsfd fs sdfsdf sd df sdf sf fsdfs sdf	2023-06-21 23:46:18.823288	2023-06-21 23:46:18.823288	35	68
1251	asdfghjklpoiuytresaZxcvghjklnjhbgrtceszdfcvyui;nkvljda dsf sdf sdf ds sdf dsf dsfd sf s sdf sdf sdf sdf ds fsdf sd fds fsd fds fds fsd fsd fsd fds fds f 	2023-06-21 23:46:26.899668	2023-06-21 23:46:26.899668	35	68
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
83	27
83	25
68	27
68	25
84	0
79	0
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
68	35
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
54	d	2023-06-21 19:12:58.467047	2023-06-21 19:12:58.467047	35	32
73	dsfsdfs	2023-06-21 19:20:04.789899	2023-06-21 19:20:04.789899	35	32
55	d	2023-06-21 19:12:58.670965	2023-06-21 19:12:58.670965	35	32
56	d	2023-06-21 19:12:58.860613	2023-06-21 19:12:58.860613	35	32
57	d	2023-06-21 19:12:59.053504	2023-06-21 19:12:59.053504	35	32
58	d	2023-06-21 19:12:59.221404	2023-06-21 19:12:59.221404	35	32
59	d	2023-06-21 19:12:59.411113	2023-06-21 19:12:59.411113	35	32
60	d	2023-06-21 19:12:59.598458	2023-06-21 19:12:59.598458	35	32
61	d	2023-06-21 19:12:59.79708	2023-06-21 19:12:59.79708	35	32
62	d	2023-06-21 19:13:00.101517	2023-06-21 19:13:00.101517	35	32
63	asdasdasdassd	2023-06-21 19:15:01.901411	2023-06-21 19:15:01.901411	35	32
64	ddd	2023-06-21 19:15:12.868722	2023-06-21 19:15:12.868722	29	35
65	asdsad asdasd	2023-06-21 19:15:15.098165	2023-06-21 19:15:15.098165	35	29
66	s	2023-06-21 19:15:15.559321	2023-06-21 19:15:15.559321	35	29
67	s	2023-06-21 19:15:15.950127	2023-06-21 19:15:15.950127	35	29
68	s	2023-06-21 19:15:16.317616	2023-06-21 19:15:16.317616	35	29
69	s	2023-06-21 19:15:16.517974	2023-06-21 19:15:16.517974	35	29
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
407	roomInvite	Laron76 invite you to join the room undefined	f	2023-06-20 23:45:30.713632	2023-06-20 23:45:30.713632	29	27	/chat/channel/invitation/83/undefined
408	roomInvite	Laron76 invite you to join the room undefined	f	2023-06-20 23:45:30.761653	2023-06-20 23:45:30.761653	29	25	/chat/channel/invitation/83/undefined
406	roomInvite	Laron76 invite you to join the room undefined	t	2023-06-20 23:45:30.67787	2023-06-20 23:45:30.67787	29	32	/chat/channel/invitation/83/undefined
409	roomInvite	Laron76 invite you to join the room undefined	f	2023-06-20 23:58:13.858635	2023-06-20 23:58:13.858635	29	27	/chat/channel/invitation/68/undefined
410	roomInvite	Laron76 invite you to join the room undefined	f	2023-06-20 23:58:13.891919	2023-06-20 23:58:13.891919	29	25	/chat/channel/invitation/68/undefined
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
423	friendRequest	send you a friend request	f	2023-06-21 12:39:48.572409	2023-06-21 12:39:48.572409	35	27	\N
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
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt", "lastActivity") FROM stdin;
0	Bot	Bot	Bot	bla@gmail.com	\N	user	https://t3.ftcdn.net/jpg/01/36/49/90/360_F_136499077_xp7bSQB4Dx13ktQp0OYJ5ricWXhiFtD2.jpg	\N	t	offline	\N	2023-06-18 23:09:10.083889	2023-06-18 23:09:10.083889	2023-06-18 23:09:10.083889
26	Violette	Beahan	Angelina93	Cali.Halvorson71@hotmail.com	$2b$10$c7fuqdKwSmloYW70MiVILe7LCQc2U56P18n7Q3fjUtr9rk3Po11FW	user	https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/33.jpg	Neque eveniet ullam quia vitae esse facere.	f	offline	\N	2023-06-19 18:24:15.117241	2023-06-19 18:24:15.117241	2023-06-19 18:24:15.117241
28	Christopher	Huels-Anderson	Jordane_Flatley54	Mabelle.Kshlerin-OKon@yahoo.com	$2b$10$pUcwY5cToAxvZ69ynmL8p.X3t/Vqi6..bdLY10px5m6Osp2/G8Fvm	user	https://avatars.githubusercontent.com/u/72724821	Occaecati quia sunt eligendi illo maxime minima debitis.	f	offline	\N	2023-06-19 18:24:15.244542	2023-06-19 18:24:15.244542	2023-06-19 18:24:15.244542
30	Johnny	Bayer	Eula_Weber	Ashleigh.Gulgowski@yahoo.com	$2b$10$X8N/Xjc.uQ0y1t2eeMZyYeDkQ/5bDIJb.BG6d/r4fS1f93SLzBNsS	user	https://avatars.githubusercontent.com/u/83549509	Aperiam pariatur repudiandae rem culpa.	f	offline	\N	2023-06-19 18:24:15.38792	2023-06-19 18:24:15.38792	2023-06-19 18:24:15.38792
31	Eula	Kutch	Libbie36	Jerod_Kutch@hotmail.com	$2b$10$eoTi/n5NDntYwtnuGhDSbeqtML6cYeaAa3RzizGIf6.Zv0yROS0Wu	user	https://avatars.githubusercontent.com/u/11865065	Quas dolor sequi harum numquam.	f	offline	\N	2023-06-19 18:24:15.468936	2023-06-19 18:24:15.468936	2023-06-19 18:24:15.468936
33	Edwin	Wolf	Johanna73	Tressa_Beier@yahoo.com	$2b$10$ZW4WtRV4610xn/YF7u1Kvu6aX3tNJsbx/pwlmWC8pWk55XA8rtn4S	user	https://avatars.githubusercontent.com/u/48188922	Reiciendis quod asperiores odit earum magni itaque.	f	offline	\N	2023-06-19 18:24:15.60468	2023-06-19 18:24:15.60468	2023-06-19 18:24:15.60468
34	Shaina	Bergnaum	Ivy_Heller	Shawna_Schmitt@gmail.com	$2b$10$OOc2nVoZ67Acj3oxHKEDrecPIXbzLmEzSxFONgPjiOGuIPj6yW8MO	user	https://avatars.githubusercontent.com/u/87908182	Perferendis inventore culpa impedit.	f	offline	\N	2023-06-19 18:24:15.668621	2023-06-19 18:24:15.668621	2023-06-19 18:24:15.668621
25	Leila	Kessler	Lynn6	Cynthia4@yahoo.com	$2b$10$i3n6ue9OCkjOq5fezKOClunOOY7EhllA65vdYe0o9/zP9EEw9Nxyu	user	https://avatars.githubusercontent.com/u/41298539	Placeat aliquam iure eum.	f	offline	\N	2023-06-19 18:24:15.049995	2023-06-20 16:16:46.52	2023-06-19 19:47:29.461
27	Rhianna	Hoppe	Randi.Bruen-Lakin	Katarina50@hotmail.com	$2b$10$sVfIx5EnyQslMSrSohv6Gei0BQkHqOlPOJ6wwO24Ig8i/ULVDmxpm	user	https://avatars.githubusercontent.com/u/58112789	Tenetur fugiat eveniet exercitationem repellendus fuga temporibus numquam accusamus.	f	offline	\N	2023-06-19 18:24:15.1809	2023-06-21 00:46:45.584	2023-06-20 22:46:06.029
32	Naomi	Runolfsson	Grayce_Dach	Margarita.Mosciski3@hotmail.com	$2b$10$iSNxAAh5CQWmpCLa7IaUM.Ykl2rRdFhEPtKNJ0V2mpC.nbvwgV6aq	user	https://avatars.githubusercontent.com/u/72204078	Iure laborum perspiciatis tenetur totam.	f	online	\N	2023-06-19 18:24:15.542461	2023-06-21 21:16:11.119	2023-06-22 00:00:08.344
35	Jean-michel	Rasser	jrasser	jrasser@student.42mulhouse.fr	\N	user	http://localhost:3000/avatars/avatar-1687278288385-749758.jpg	\N	f	online	\N	2023-06-20 16:24:48.481926	2023-06-21 21:18:11.11	2023-06-22 00:00:08.909
29	Darrin	Kirlin	Laron76	Furman_Buckridge-Gusikowski@gmail.com	$2b$10$c1j721RAxyGoIukxRC5suu2ALUFfYV2XoH51h8rryg7U1k40YmC/2	user	https://avatars.githubusercontent.com/u/82350039	Quis blanditiis vel aut repellendus atque itaque.	f	online	\N	2023-06-19 18:24:15.304727	2023-06-21 21:16:11.113	2023-06-22 00:00:09.078
\.


--
-- Data for Name: users-relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."users-relation" (id, "relationType", "createdAt", "updatedAt", "userRelationId", "mutuelBlocked", "userInitiateurId") FROM stdin;
156	friend	2023-06-21 12:39:49.76983	2023-06-21 12:45:31.502	29	f	35
155	friend	2023-06-21 12:39:49.181625	2023-06-21 12:46:25.84	32	f	35
147	pending	2023-06-21 12:39:43.541252	2023-06-21 12:39:43.541252	26	f	35
148	pending	2023-06-21 12:39:45.065379	2023-06-21 12:39:45.065379	28	f	35
149	pending	2023-06-21 12:39:45.91519	2023-06-21 12:39:45.91519	30	f	35
150	pending	2023-06-21 12:39:46.499905	2023-06-21 12:39:46.499905	31	f	35
151	pending	2023-06-21 12:39:47.033559	2023-06-21 12:39:47.033559	33	f	35
152	pending	2023-06-21 12:39:47.574196	2023-06-21 12:39:47.574196	34	f	35
153	pending	2023-06-21 12:39:47.885413	2023-06-21 12:39:47.885413	25	f	35
154	pending	2023-06-21 12:39:48.486107	2023-06-21 12:39:48.486107	27	f	35
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 1251, true);


--
-- Name: chat_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_rooms_id_seq', 88, true);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_id_seq', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 73, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 440, true);


--
-- Name: users-relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users-relation_id_seq"', 156, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 35, true);


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

