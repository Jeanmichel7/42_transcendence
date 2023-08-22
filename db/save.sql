--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-1.pgdg120+1)
-- Dumped by pg_dump version 15.4 (Debian 15.4-1.pgdg120+1)

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
    "consecutiveWin" integer DEFAULT 0 NOT NULL,
    "laserKill" integer DEFAULT 0 NOT NULL,
    "bonusUsed" integer DEFAULT 0 NOT NULL,
    "numberOfConsecutiveWins" integer DEFAULT 0 NOT NULL,
    "numberOfEnemiesKilledWithLaser" integer DEFAULT 0 NOT NULL,
    "numberOfGamesPlayed" integer DEFAULT 0 NOT NULL,
    "numberOfGamesWonWithoutMissingBall" integer DEFAULT 0 NOT NULL,
    rank text DEFAULT 'silver_2'::text
);


ALTER TABLE public.users OWNER TO postgres;

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
-- Name: users_relation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_relation (
    id integer NOT NULL,
    "relationType" text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "userRelationId" bigint,
    "mutuelBlocked" boolean DEFAULT false NOT NULL,
    "userInitiateurId" bigint
);


ALTER TABLE public.users_relation OWNER TO postgres;

--
-- Name: users_relation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_relation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_relation_id_seq OWNER TO postgres;

--
-- Name: users_relation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_relation_id_seq OWNED BY public.users_relation.id;


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

ALTER TABLE ONLY public.users_relation ALTER COLUMN id SET DEFAULT nextval('public.users_relation_id_seq'::regclass);


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, text, "createdAt", "updatedAt", "ownerUserId", "roomId") FROM stdin;
2841	Invitation link http://pcbureau:3006/chat/channel/invitation/95/PublicRoom	2023-08-21 22:27:16.748037	2023-08-21 22:27:16.748037	0	95
2842	Invitation link http://pcbureau:3006/chat/channel/invitation/96/PrivateRoom	2023-08-21 22:27:35.13098	2023-08-21 22:27:35.13098	0	96
2843	Marilyn_Funk has join the room	2023-08-21 22:27:49.022601	2023-08-21 22:27:49.022601	0	96
2844	Pauline_Mueller66 has join the room	2023-08-21 22:27:50.107872	2023-08-21 22:27:50.107872	0	96
2845	OraWeber has join the room	2023-08-21 22:27:51.642241	2023-08-21 22:27:51.642241	0	96
2846	Bradley_Pollich has join the room	2023-08-21 22:27:52.554777	2023-08-21 22:27:52.554777	0	96
2847	Sara_Wiza79 has join the room	2023-08-21 22:27:53.385247	2023-08-21 22:27:53.385247	0	96
2848	Elias29 has join the room	2023-08-21 22:27:54.249264	2023-08-21 22:27:54.249264	0	96
2849	Monica47 has join the room	2023-08-21 22:27:55.032216	2023-08-21 22:27:55.032216	0	96
2850	Hi	2023-08-21 22:27:59.051203	2023-08-21 22:27:59.051203	654	96
2851	sdfsdf	2023-08-21 22:28:03.671769	2023-08-21 22:28:03.671769	652	96
2852	dsfssfdsf	2023-08-21 22:28:06.217916	2023-08-21 22:28:06.217916	653	96
2853	fffff	2023-08-21 22:28:09.037881	2023-08-21 22:28:09.037881	657	96
2854	sdfsd sf sddf	2023-08-21 22:28:11.957364	2023-08-21 22:28:11.957364	658	96
2855	sdfsddfsdf	2023-08-21 22:28:14.806733	2023-08-21 22:28:14.806733	659	96
2856	dfsdsdfdsf	2023-08-21 22:28:17.974309	2023-08-21 22:28:17.974309	656	96
2857	fsdfdfsdfsdfsddf	2023-08-21 22:28:20.875285	2023-08-21 22:28:20.875285	655	96
2858	Invitation link http://pcbureau:3006/chat/channel/invitation/97/Pwd123	2023-08-21 22:30:04.494683	2023-08-21 22:30:04.494683	0	97
2859	Invitation link http://pcbureau:3006/chat/channel/invitation/98/Realy_long_name_here	2023-08-21 22:31:26.166166	2023-08-21 22:31:26.166166	0	98
2860	Invitation link http://pcbureau:3006/chat/channel/invitation/99/C++	2023-08-21 22:31:48.183572	2023-08-21 22:31:48.183572	0	99
2861	Invitation link http://pcbureau:3006/chat/channel/invitation/100/C/C++	2023-08-21 22:32:01.227718	2023-08-21 22:32:01.227718	0	100
2862	Invitation link http://pcbureau:3006/chat/channel/invitation/101/Javascript	2023-08-21 22:32:07.7679	2023-08-21 22:32:07.7679	0	101
2863	Invitation link http://pcbureau:3006/chat/channel/invitation/102/Python	2023-08-21 22:32:14.263597	2023-08-21 22:32:14.263597	0	102
2864	Invitation link http://pcbureau:3006/chat/channel/invitation/103/Java	2023-08-21 22:32:19.832376	2023-08-21 22:32:19.832376	0	103
2865	Invitation link http://pcbureau:3006/chat/channel/invitation/104/C#	2023-08-21 22:32:28.311202	2023-08-21 22:32:28.311202	0	104
2866	Invitation link http://pcbureau:3006/chat/channel/invitation/105/Ruby	2023-08-21 22:33:18.67399	2023-08-21 22:33:18.67399	0	105
2867	Invitation link http://pcbureau:3006/chat/channel/invitation/106/Andor	2023-08-21 22:34:08.770128	2023-08-21 22:34:08.770128	0	106
2868	Invitation link http://pcbureau:3006/chat/channel/invitation/107/Terre	2023-08-21 22:35:07.092623	2023-08-21 22:35:07.092623	0	107
2869	Invitation link http://pcbureau:3006/chat/channel/invitation/108/Vulcain 	2023-08-21 22:35:12.824093	2023-08-21 22:35:12.824093	0	108
2870	Invitation link http://pcbureau:3006/chat/channel/invitation/109/Cardassia 	2023-08-21 22:35:17.85693	2023-08-21 22:35:17.85693	0	109
2871	Invitation link http://pcbureau:3006/chat/channel/invitation/110/Bétazed	2023-08-21 22:35:21.236467	2023-08-21 22:35:21.236467	0	110
2872	Invitation link http://pcbureau:3006/chat/channel/invitation/111/Risa	2023-08-21 22:35:24.771818	2023-08-21 22:35:24.771818	0	111
2873	Invitation link http://pcbureau:3006/chat/channel/invitation/112/Kronos	2023-08-21 22:35:33.47636	2023-08-21 22:35:33.47636	0	112
2874	Invitation link http://pcbureau:3006/chat/channel/invitation/113/Ferenginar	2023-08-21 22:35:37.258732	2023-08-21 22:35:37.258732	0	113
2875	Invitation link http://pcbureau:3006/chat/channel/invitation/114/Romulus	2023-08-21 22:35:50.109529	2023-08-21 22:35:50.109529	0	114
2876	Elias29 has join the room	2023-08-21 22:38:07.825206	2023-08-21 22:38:07.825206	0	110
2877	Elias29 has join the room	2023-08-21 22:38:08.497519	2023-08-21 22:38:08.497519	0	112
2878	Elias29 has join the room	2023-08-21 22:38:08.928954	2023-08-21 22:38:08.928954	0	111
2879	Elias29 has join the room	2023-08-21 22:38:09.749235	2023-08-21 22:38:09.749235	0	107
2880	Elias29 has join the room	2023-08-21 22:38:10.412334	2023-08-21 22:38:10.412334	0	108
2881	Monica47 has join the room	2023-08-21 22:38:10.986957	2023-08-21 22:38:10.986957	0	109
2882	Monica47 has join the room	2023-08-21 22:38:11.668601	2023-08-21 22:38:11.668601	0	112
2883	Monica47 has join the room	2023-08-21 22:38:12.805567	2023-08-21 22:38:12.805567	0	105
2884	Monica47 has join the room	2023-08-21 22:38:14.370034	2023-08-21 22:38:14.370034	0	101
2885	Marilyn_Funk has join the room	2023-08-21 22:38:32.917325	2023-08-21 22:38:32.917325	0	104
2886	Marilyn_Funk has join the room	2023-08-21 22:38:33.339018	2023-08-21 22:38:33.339018	0	103
2887	Marilyn_Funk has join the room	2023-08-21 22:38:33.871522	2023-08-21 22:38:33.871522	0	101
2888	Marilyn_Funk has join the room	2023-08-21 22:38:35.388802	2023-08-21 22:38:35.388802	0	100
2889	Pauline_Mueller66 has join the room	2023-08-21 22:38:39.862791	2023-08-21 22:38:39.862791	0	114
2890	Pauline_Mueller66 has join the room	2023-08-21 22:38:40.507089	2023-08-21 22:38:40.507089	0	111
2891	Pauline_Mueller66 has join the room	2023-08-21 22:38:41.041994	2023-08-21 22:38:41.041994	0	110
2892	Pauline_Mueller66 has join the room	2023-08-21 22:38:41.420717	2023-08-21 22:38:41.420717	0	109
2893	Pauline_Mueller66 has join the room	2023-08-21 22:38:41.89535	2023-08-21 22:38:41.89535	0	107
2894	Pauline_Mueller66 has join the room	2023-08-21 22:38:42.309479	2023-08-21 22:38:42.309479	0	108
2895	Pauline_Mueller66 has join the room	2023-08-21 22:38:43.265495	2023-08-21 22:38:43.265495	0	105
2896	Pauline_Mueller66 has join the room	2023-08-21 22:38:45.061676	2023-08-21 22:38:45.061676	0	101
2897	Pauline_Mueller66 has join the room	2023-08-21 22:38:45.590722	2023-08-21 22:38:45.590722	0	103
2898	Pauline_Mueller66 has join the room	2023-08-21 22:38:46.32505	2023-08-21 22:38:46.32505	0	104
2899	Pauline_Mueller66 has join the room	2023-08-21 22:38:47.04798	2023-08-21 22:38:47.04798	0	102
2900	Pauline_Mueller66 has join the room	2023-08-21 22:38:47.719069	2023-08-21 22:38:47.719069	0	100
2901	Pauline_Mueller66 has join the room	2023-08-21 22:38:48.283971	2023-08-21 22:38:48.283971	0	98
2902	LonnieWelch has join the room	2023-08-21 22:38:51.956774	2023-08-21 22:38:51.956774	0	111
2903	LonnieWelch has join the room	2023-08-21 22:38:53.005893	2023-08-21 22:38:53.005893	0	109
2904	LonnieWelch has join the room	2023-08-21 22:38:53.549688	2023-08-21 22:38:53.549688	0	110
2905	LonnieWelch has join the room	2023-08-21 22:38:56.874971	2023-08-21 22:38:56.874971	0	95
2906	LonnieWelch has join the room	2023-08-21 22:38:57.721449	2023-08-21 22:38:57.721449	0	101
2907	OraWeber has join the room	2023-08-21 22:39:00.205395	2023-08-21 22:39:00.205395	0	111
2908	OraWeber has join the room	2023-08-21 22:39:00.595615	2023-08-21 22:39:00.595615	0	110
2909	OraWeber has join the room	2023-08-21 22:39:01.310633	2023-08-21 22:39:01.310633	0	109
2910	OraWeber has join the room	2023-08-21 22:39:04.0299	2023-08-21 22:39:04.0299	0	103
2911	OraWeber has join the room	2023-08-21 22:39:04.577898	2023-08-21 22:39:04.577898	0	102
2912	OraWeber has join the room	2023-08-21 22:39:09.474724	2023-08-21 22:39:09.474724	0	97
2913	Bradley_Pollich has join the room	2023-08-21 22:39:23.522231	2023-08-21 22:39:23.522231	0	101
2914	Bradley_Pollich has join the room	2023-08-21 22:39:24.761793	2023-08-21 22:39:24.761793	0	102
2916	Bradley_Pollich has join the room	2023-08-21 22:39:29.708595	2023-08-21 22:39:29.708595	0	97
2917	Sara_Wiza79 has join the room	2023-08-21 22:39:34.635608	2023-08-21 22:39:34.635608	0	110
2919	Sara_Wiza79 has join the room	2023-08-21 22:39:35.693999	2023-08-21 22:39:35.693999	0	108
2920	Sara_Wiza79 has join the room	2023-08-21 22:39:36.164897	2023-08-21 22:39:36.164897	0	107
2915	Bradley_Pollich has join the room	2023-08-21 22:39:25.259708	2023-08-21 22:39:25.259708	0	100
2918	Sara_Wiza79 has join the room	2023-08-21 22:39:35.102777	2023-08-21 22:39:35.102777	0	111
2921	Elias29 has join the room	2023-08-21 22:39:37.085973	2023-08-21 22:39:37.085973	0	109
2922	Monica47 has join the room	2023-08-21 22:39:38.41388	2023-08-21 22:39:38.41388	0	95
2923	Monica47 has join the room	2023-08-21 22:39:40.194571	2023-08-21 22:39:40.194571	0	110
2924	Monica47 has join the room	2023-08-21 22:39:41.162193	2023-08-21 22:39:41.162193	0	108
2925	Marilyn_Funk has join the room	2023-08-21 22:40:20.707151	2023-08-21 22:40:20.707151	0	114
2926	Marilyn_Funk has join the room	2023-08-21 22:40:21.176018	2023-08-21 22:40:21.176018	0	112
2927	Marilyn_Funk has join the room	2023-08-21 22:40:21.798098	2023-08-21 22:40:21.798098	0	111
2928	Marilyn_Funk has join the room	2023-08-21 22:40:22.286608	2023-08-21 22:40:22.286608	0	109
2929	Marilyn_Funk has join the room	2023-08-21 22:40:23.034359	2023-08-21 22:40:23.034359	0	110
2930	Marilyn_Funk has join the room	2023-08-21 22:40:23.564769	2023-08-21 22:40:23.564769	0	108
2931	Marilyn_Funk has join the room	2023-08-21 22:40:27.574077	2023-08-21 22:40:27.574077	0	97
2932	Marilyn_Funk has join the room	2023-08-21 22:40:31.630069	2023-08-21 22:40:31.630069	0	105
2933	Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically typed and garbage-collected. It supports multiple programming paradigms, including structured, object-oriented and functional programming. Wikipedia	2023-08-21 22:42:22.962129	2023-08-21 22:42:22.962129	654	102
2934	https://en.wikipedia.org/wiki/Python_(programming_language)	2023-08-21 22:42:26.104033	2023-08-21 22:42:26.104033	654	102
2935	C# (pronounced See sharp) is a general-purpose high-level programming language supporting multiple paradigms. C# encompasses static typing, strong typing, lexically scoped, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines. C#	2023-08-21 22:43:08.367078	2023-08-21 22:43:08.367078	652	104
2936	https://www.google.com/search?q=C%23&oq=C%23&aqs=chrome..69i57j69i58j69i65.1298j0j4&sourceid=chrome&ie=UTF-8	2023-08-21 22:43:12.797486	2023-08-21 22:43:12.797486	652	104
2937	JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2023, 98.7% of websites use JavaScript on the client side for webpage behavior, often incorporating third-party libraries. Wikipedia	2023-08-21 22:43:28.481172	2023-08-21 22:43:28.481172	653	101
2938	https://en.wikipedia.org/wiki/JavaScript	2023-08-21 22:43:41.254964	2023-08-21 22:43:41.254964	659	101
2939	Elias29 has join the room	2023-08-21 22:43:46.771757	2023-08-21 22:43:46.771757	0	101
2940	Hello	2023-08-21 22:43:54.4144	2023-08-21 22:43:54.4144	655	101
2941	asdfghj sfs sd fdsfdf dsfd	2023-08-21 22:44:16.879436	2023-08-21 22:44:16.879436	652	111
2942	dsad sadsa sad adsadd sdasdadsadas dsa d sad sad asd as ds fdg f hj h hfd gds f df h gsd	2023-08-21 22:44:26.616556	2023-08-21 22:44:26.616556	653	111
2943	de omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo invento	2023-08-21 22:44:46.990222	2023-08-21 22:44:46.990222	657	111
2944	Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ip	2023-08-21 22:44:53.703067	2023-08-21 22:44:53.703067	658	111
2945	repudiandae sin	2023-08-21 22:45:01.872532	2023-08-21 22:45:01.872532	655	111
2947	repudiandae sin	2023-08-21 22:45:02.807233	2023-08-21 22:45:02.807233	655	111
2946	repudiandae sin.	2023-08-21 22:45:02.430533	2023-08-21 22:45:09.345	655	111
2948	atis, unde omnis iste natus error sit voluptatem accusantium doloremque la	2023-08-21 22:45:27.511677	2023-08-21 22:45:27.511677	656	111
2949	a inci[di]dunt, ut labore et dolo	2023-08-21 22:45:43.718621	2023-08-21 22:45:43.718621	657	111
2950	Sara_Wiza79 has left the room	2023-08-21 22:45:57.652013	2023-08-21 22:45:57.652013	0	111
2951	Sara_Wiza79 has join the room	2023-08-21 22:46:06.768578	2023-08-21 22:46:06.768578	0	111
2952	Sara_Wiza79 has join the room	2023-08-21 22:46:17.622023	2023-08-21 22:46:17.622023	0	97
\.


--
-- Data for Name: chat_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms (id, type, name, password, "createdAt", "updatedAt", "ownerUserId", "isProtected") FROM stdin;
95	public	PublicRoom	\N	2023-08-21 22:27:16.733803	2023-08-21 22:27:16.733803	653	f
96	private	PrivateRoom	\N	2023-08-21 22:27:35.100432	2023-08-21 22:27:35.100432	657	f
97	public	Pwd123	$2b$10$FDB0ttTo4w47egjwMwoVIuQVAPN2ndjeaiAIKpq4ETD9mH9wymUQW	2023-08-21 22:30:04.481145	2023-08-21 22:30:04.481145	657	t
98	public	Realy_long_name_here	\N	2023-08-21 22:31:26.154249	2023-08-21 22:31:26.154249	652	f
99	public	C++	$2b$10$mVhM9Wd8bIi3uxC4a0m3LOiLHp3EougDmbsquFV15pkXNhz1L978q	2023-08-21 22:31:48.169188	2023-08-21 22:31:48.169188	653	t
100	public	C/C++	\N	2023-08-21 22:32:01.215127	2023-08-21 22:32:01.215127	657	f
101	public	Javascript	\N	2023-08-21 22:32:07.755464	2023-08-21 22:32:07.755464	658	f
102	public	Python	\N	2023-08-21 22:32:14.250911	2023-08-21 22:32:14.250911	654	f
103	public	Java	\N	2023-08-21 22:32:19.821202	2023-08-21 22:32:19.821202	655	f
104	public	C#	\N	2023-08-21 22:32:28.30098	2023-08-21 22:32:28.30098	656	f
105	public	Ruby	\N	2023-08-21 22:33:18.658742	2023-08-21 22:33:18.658742	656	f
106	public	Andor	$2b$10$RIL3zHSxOHpQh8YDdMYl0uilKLcW4wj7ZVZ6CXqSPaZdc9ecvwSF.	2023-08-21 22:34:08.732416	2023-08-21 22:34:08.732416	656	t
107	public	Terre	\N	2023-08-21 22:35:07.073442	2023-08-21 22:35:07.073442	659	f
108	public	Vulcain 	\N	2023-08-21 22:35:12.808741	2023-08-21 22:35:12.808741	659	f
109	public	Cardassia 	\N	2023-08-21 22:35:17.84318	2023-08-21 22:35:17.84318	659	f
110	public	Bétazed	\N	2023-08-21 22:35:21.22535	2023-08-21 22:35:21.22535	659	f
111	public	Risa	\N	2023-08-21 22:35:24.759846	2023-08-21 22:35:24.759846	659	f
112	public	Kronos	\N	2023-08-21 22:35:33.464921	2023-08-21 22:35:33.464921	659	f
113	public	Ferenginar	\N	2023-08-21 22:35:37.25046	2023-08-21 22:35:37.25046	659	f
114	public	Romulus	\N	2023-08-21 22:35:50.094506	2023-08-21 22:35:50.094506	659	f
\.


--
-- Data for Name: chat_rooms_accepted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_accepted_users_users ("chatRoomsId", "usersId") FROM stdin;
96	0
\.


--
-- Data for Name: chat_rooms_admins_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_rooms_admins_users ("chatRoomsId", "usersId") FROM stdin;
95	653
96	657
97	657
98	652
99	653
100	657
101	658
102	654
103	655
104	656
105	656
106	656
107	659
108	659
109	659
110	659
111	659
112	659
113	659
114	659
111	653
111	655
111	657
111	652
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
95	653
96	657
96	652
96	653
96	658
96	659
96	656
96	655
96	654
97	657
98	652
99	653
100	657
101	658
102	654
103	655
104	656
105	656
106	656
107	659
108	659
109	659
110	659
111	659
112	659
113	659
114	659
110	655
112	655
111	655
107	655
108	655
109	654
112	654
105	654
101	654
104	652
103	652
101	652
100	652
114	653
111	653
110	653
109	653
107	653
108	653
105	653
101	653
103	653
104	653
102	653
100	653
98	653
111	657
109	657
110	657
95	657
101	657
111	658
110	658
109	658
103	658
102	658
97	658
101	659
102	659
100	659
97	659
110	656
108	656
107	656
109	655
95	654
110	654
108	654
114	652
112	652
111	652
109	652
110	652
108	652
97	652
105	652
101	655
111	656
97	656
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (id, status, "createdAt", "finishAt", "abortedAt", "scorePlayer1", "scorePlayer2", "player1Id", "player2Id", "winnerId", "updatedAt", "eloScorePlayer1", "eloScorePlayer2", "levelPlayer1", "levelPlayer2", "expPlayer1", "expPlayer2") FROM stdin;
345	finished	2023-08-21 22:53:47.25	2023-08-21 22:54:32.674	2023-08-21 22:53:47.251199	6	4	658	655	658	2023-08-21 22:53:48.051	1544	1457	2	1	40	10
348	finished	2023-08-21 22:53:52.07	2023-08-21 22:54:35.564	2023-08-21 22:53:52.074548	4	6	652	656	656	2023-08-21 22:53:52.692	1451	1483	1	2	10	20
346	finished	2023-08-21 22:53:48.703	2023-08-21 22:54:36.039	2023-08-21 22:53:48.705131	5	7	653	659	659	2023-08-21 22:53:49.538	1481	1517	2	2	20	30
347	finished	2023-08-21 22:53:50.284	2023-08-21 22:54:47.821	2023-08-21 22:53:50.285512	7	5	657	654	657	2023-08-21 22:53:51.106	1514	1539	2	2	30	40
330	finished	2023-08-21 22:47:41.531	2023-08-21 22:48:03.568	2023-08-21 22:47:41.533173	6	0	656	658	656	2023-08-21 22:47:42.475	1516	1484	1	1	10	0
331	finished	2023-08-21 22:47:43.415	2023-08-21 22:48:24.3	2023-08-21 22:47:43.417543	4	6	659	653	653	2023-08-21 22:47:44.592	1484	1516	1	1	0	10
332	finished	2023-08-21 22:47:45.319	2023-08-21 22:48:33.613	2023-08-21 22:47:45.320655	7	5	657	652	657	2023-08-21 22:47:46.054	1516	1484	1	1	10	0
329	finished	2023-08-21 22:47:40.133	2023-08-21 22:48:35.701	2023-08-21 22:47:40.134781	7	5	654	655	654	2023-08-21 22:47:40.7	1516	1484	1	1	10	0
378	finished	2023-08-21 23:07:35.208	2023-08-21 23:07:57.929	2023-08-21 23:07:35.210708	0	6	653	659	659	2023-08-21 23:07:35.996	1458	1592	2	3	50	100
358	finished	2023-08-21 22:59:13.068	2023-08-21 22:59:33.792	2023-08-21 22:59:13.070091	6	0	658	657	658	2023-08-21 22:59:13.586	1552	1500	3	2	60	40
333	finished	2023-08-21 22:49:02.322	2023-08-21 22:49:37.401	2023-08-21 22:49:02.324111	6	1	652	653	652	2023-08-21 22:49:03.849	1501	1498	1	1	10	10
336	finished	2023-08-21 22:49:15.59	2023-08-21 22:49:54.177	2023-08-21 22:49:15.592059	3	6	655	654	654	2023-08-21 22:49:17.394	1469	1530	1	2	0	20
335	finished	2023-08-21 22:49:13.254	2023-08-21 22:49:57.458	2023-08-21 22:49:13.255834	6	4	659	656	659	2023-08-21 22:49:13.86	1501	1498	1	1	10	10
334	finished	2023-08-21 22:49:05.607	2023-08-21 22:49:58.945	2023-08-21 22:49:05.609268	5	7	657	658	658	2023-08-21 22:49:07.545	1498	1501	1	1	10	10
359	finished	2023-08-21 22:59:14.149	2023-08-21 22:59:56.153	2023-08-21 22:59:14.150268	2	6	653	655	655	2023-08-21 22:59:14.938	1433	1472	2	2	20	30
357	finished	2023-08-21 22:59:10.818	2023-08-21 22:59:59.608	2023-08-21 22:59:10.819796	4	6	656	659	659	2023-08-21 22:59:11.421	1473	1527	2	2	30	50
337	finished	2023-08-21 22:50:13.336	2023-08-21 22:50:36.846	2023-08-21 22:50:13.337301	0	6	656	657	657	2023-08-21 22:50:14.074	1482	1514	1	2	10	20
340	finished	2023-08-21 22:50:18.583	2023-08-21 22:50:54.199	2023-08-21 22:50:18.588058	6	3	654	652	654	2023-08-21 22:50:19.718	1544	1486	2	1	30	10
339	finished	2023-08-21 22:50:16.633	2023-08-21 22:50:57.164	2023-08-21 22:50:16.635033	4	6	655	653	653	2023-08-21 22:50:17.607	1454	1512	1	2	0	20
338	finished	2023-08-21 22:50:14.802	2023-08-21 22:50:57.99	2023-08-21 22:50:14.803431	6	2	658	659	658	2023-08-21 22:50:15.623	1517	1485	2	1	20	10
351	finished	2023-08-21 22:55:38.777	2023-08-21 22:56:05.375	2023-08-21 22:55:38.778843	6	0	655	653	655	2023-08-21 22:55:40.063	1474	1463	2	2	20	20
349	finished	2023-08-21 22:55:34.912	2023-08-21 22:56:18.739	2023-08-21 22:55:34.921347	4	6	657	658	658	2023-08-21 22:55:35.523	1499	1558	2	2	30	50
350	finished	2023-08-21 22:55:36.206	2023-08-21 22:56:25.591	2023-08-21 22:55:36.207432	7	5	659	656	659	2023-08-21 22:55:37.875	1531	1468	2	2	40	20
352	finished	2023-08-21 22:56:01.792	2023-08-21 22:56:28.436	2023-08-21 22:56:01.794059	6	0	652	654	652	2023-08-21 22:56:03.962	1470	1519	2	2	20	40
343	finished	2023-08-21 22:51:27.699	2023-08-21 22:51:52.72	2023-08-21 22:51:27.700715	0	6	657	659	659	2023-08-21 22:51:28.64	1496	1502	2	2	20	20
342	finished	2023-08-21 22:51:26.029	2023-08-21 22:51:55.779	2023-08-21 22:51:26.03091	2	6	652	655	655	2023-08-21 22:51:26.856	1468	1471	1	1	10	10
344	finished	2023-08-21 22:51:29.339	2023-08-21 22:51:56.614	2023-08-21 22:51:29.347051	1	6	656	658	658	2023-08-21 22:51:30.356	1467	1531	1	2	10	30
341	finished	2023-08-21 22:51:24.455	2023-08-21 22:52:08.775	2023-08-21 22:51:24.456405	6	4	654	653	654	2023-08-21 22:51:25.349	1558	1497	2	2	40	20
360	finished	2023-08-21 22:59:15.558	2023-08-21 23:00:07.244	2023-08-21 22:59:15.560292	5	7	654	652	652	2023-08-21 22:59:16.243	1513	1504	2	2	50	40
372	finished	2023-08-21 23:04:46.983	2023-08-21 23:05:14.773	2023-08-21 23:04:46.985117	6	0	659	652	659	2023-08-21 23:04:48.2	1569	1518	3	3	80	60
365	finished	2023-08-21 23:03:26.389	2023-08-21 23:03:47.632	2023-08-21 23:03:26.39194	6	0	652	657	652	2023-08-21 23:03:27.747	1534	1470	3	2	60	40
354	finished	2023-08-21 22:56:42.932	2023-08-21 22:57:09.784	2023-08-21 22:56:42.933475	6	0	656	658	656	2023-08-21 22:56:44.576	1488	1537	2	2	30	50
353	finished	2023-08-21 22:56:41.23	2023-08-21 22:57:13.952	2023-08-21 22:56:41.231525	6	2	652	655	652	2023-08-21 22:56:42.281	1486	1457	2	2	30	20
355	finished	2023-08-21 22:56:45.268	2023-08-21 22:57:15.443	2023-08-21 22:56:45.269829	6	1	657	659	657	2023-08-21 22:56:46.294	1516	1513	2	2	40	40
356	finished	2023-08-21 22:56:47.74	2023-08-21 22:57:23.088	2023-08-21 22:56:47.742386	1	6	653	654	654	2023-08-21 22:56:50.145	1449	1532	2	2	20	50
366	finished	2023-08-21 23:03:28.373	2023-08-21 23:03:57.535	2023-08-21 23:03:28.403039	6	1	653	658	653	2023-08-21 23:03:28.958	1469	1512	2	3	40	60
367	finished	2023-08-21 23:03:29.672	2023-08-21 23:04:10.031	2023-08-21 23:03:29.673912	6	3	659	655	659	2023-08-21 23:03:30.491	1554	1477	3	2	70	40
368	finished	2023-08-21 23:03:31.226	2023-08-21 23:04:10.068	2023-08-21 23:03:31.228067	6	4	656	654	656	2023-08-21 23:03:32.113	1472	1478	2	2	40	50
364	finished	2023-08-21 23:00:24.825	2023-08-21 23:01:02.909	2023-08-21 23:00:24.827927	6	2	655	658	655	2023-08-21 23:00:26.161	1491	1532	2	3	40	60
361	finished	2023-08-21 23:00:18.822	2023-08-21 23:01:04.965	2023-08-21 23:00:18.823878	5	7	654	652	652	2023-08-21 23:00:19.561	1496	1520	2	2	50	50
362	finished	2023-08-21 23:00:20.87	2023-08-21 23:01:06.294	2023-08-21 23:00:20.871458	4	6	657	659	659	2023-08-21 23:00:22.18	1485	1541	2	3	40	60
363	finished	2023-08-21 23:00:22.874	2023-08-21 23:01:13.244	2023-08-21 23:00:22.875986	5	7	656	653	653	2023-08-21 23:00:23.746	1455	1450	2	2	30	30
369	finished	2023-08-21 23:04:39.633	2023-08-21 23:05:20.314	2023-08-21 23:04:39.635026	3	6	653	657	657	2023-08-21 23:04:40.184	1453	1485	2	2	40	50
371	finished	2023-08-21 23:04:42.3	2023-08-21 23:05:25.064	2023-08-21 23:04:42.302314	4	6	654	658	658	2023-08-21 23:04:44.85	1463	1526	2	3	50	70
370	finished	2023-08-21 23:04:41.016	2023-08-21 23:05:30.168	2023-08-21 23:04:41.017966	3	6	656	655	655	2023-08-21 23:04:41.469	1456	1492	2	2	40	50
375	finished	2023-08-21 23:06:10.095	2023-08-21 23:06:51.157	2023-08-21 23:06:10.096581	6	4	653	654	653	2023-08-21 23:06:10.996	1469	1446	2	2	50	50
379	finished	2023-08-21 23:07:37.175	2023-08-21 23:07:59.007	2023-08-21 23:07:37.177182	6	0	657	658	657	2023-08-21 23:07:37.762	1515	1491	3	3	70	70
373	finished	2023-08-21 23:06:05.543	2023-08-21 23:06:35.791	2023-08-21 23:06:05.545213	2	6	652	659	659	2023-08-21 23:06:06.784	1504	1582	3	3	60	90
376	finished	2023-08-21 23:06:11.837	2023-08-21 23:06:56.351	2023-08-21 23:06:11.839035	6	3	657	656	657	2023-08-21 23:06:12.613	1499	1441	3	2	60	40
374	finished	2023-08-21 23:06:07.758	2023-08-21 23:07:07.161	2023-08-21 23:06:07.760413	5	7	658	655	655	2023-08-21 23:06:08.803	1508	1509	3	3	70	60
380	finished	2023-08-21 23:07:38.66	2023-08-21 23:08:18.6	2023-08-21 23:07:38.661778	6	2	655	654	655	2023-08-21 23:07:39.199	1522	1432	3	2	70	50
377	finished	2023-08-21 23:07:32.957	2023-08-21 23:07:54.861	2023-08-21 23:07:32.960407	6	0	656	652	656	2023-08-21 23:07:34.081	1459	1485	2	3	50	60
381	finished	2023-08-21 23:08:33.343	2023-08-21 23:09:15.888	2023-08-21 23:08:33.344955	6	3	657	652	657	2023-08-21 23:08:34.464	1529	1470	3	3	80	60
384	finished	2023-08-21 23:08:38.38	2023-08-21 23:09:01.245	2023-08-21 23:08:38.382559	0	6	655	656	656	2023-08-21 23:08:39.021	1503	1477	3	3	70	60
382	finished	2023-08-21 23:08:35.118	2023-08-21 23:09:04.269	2023-08-21 23:08:35.119621	1	6	653	658	658	2023-08-21 23:08:35.952	1443	1505	2	3	50	80
383	finished	2023-08-21 23:08:36.796	2023-08-21 23:09:01.14	2023-08-21 23:08:36.797681	0	6	659	654	654	2023-08-21 23:08:37.721	1569	1454	3	3	100	60
415	finished	2023-08-21 23:24:25.047	2023-08-21 23:25:01.033	2023-08-21 23:24:25.048734	6	0	659	653	659	2023-08-21 23:24:25.618	1588	1453	4	4	190	120
404	finished	2023-08-21 23:19:21.411	2023-08-21 23:19:51.114	2023-08-21 23:19:21.412279	6	1	653	659	653	2023-08-21 23:19:22.076	1479	1550	3	4	100	140
386	finished	2023-08-21 23:09:32.104	2023-08-21 23:09:55.5	2023-08-21 23:09:32.106598	0	6	655	653	653	2023-08-21 23:09:32.779	1484	1461	3	3	70	60
385	finished	2023-08-21 23:09:29.68	2023-08-21 23:10:10.319	2023-08-21 23:09:29.682363	6	2	652	654	652	2023-08-21 23:09:31.515	1485	1438	3	3	70	60
387	finished	2023-08-21 23:09:33.539	2023-08-21 23:10:13.938	2023-08-21 23:09:33.541107	6	2	657	656	657	2023-08-21 23:09:34.373	1542	1463	3	3	90	60
388	finished	2023-08-21 23:09:35.186	2023-08-21 23:10:25.162	2023-08-21 23:09:35.188625	6	3	659	658	659	2023-08-21 23:09:36.074	1582	1491	3	3	110	80
405	finished	2023-08-21 23:20:14.217	2023-08-21 23:20:39.114	2023-08-21 23:20:14.218957	0	6	653	659	659	2023-08-21 23:20:14.66	1466	1562	3	4	100	150
390	finished	2023-08-21 23:11:00.358	2023-08-21 23:11:32.437	2023-08-21 23:11:00.359777	3	6	653	652	652	2023-08-21 23:11:01.16	1446	1499	3	3	60	80
389	finished	2023-08-21 23:10:58.343	2023-08-21 23:11:37.308	2023-08-21 23:10:58.344842	3	6	655	654	654	2023-08-21 23:10:58.98	1465	1456	3	3	70	70
391	finished	2023-08-21 23:11:10.09	2023-08-21 23:11:52.07	2023-08-21 23:11:10.091796	6	4	656	657	656	2023-08-21 23:11:10.878	1482	1522	3	3	70	90
392	finished	2023-08-21 23:11:43.402	2023-08-21 23:12:11.227	2023-08-21 23:11:43.403896	6	0	653	652	653	2023-08-21 23:11:44.047	1464	1480	3	3	70	80
406	finished	2023-08-21 23:20:20.114	2023-08-21 23:21:01.172	2023-08-21 23:20:20.114978	4	6	654	655	655	2023-08-21 23:20:20.798	1486	1425	3	3	110	80
393	finished	2023-08-21 23:12:23.788	2023-08-21 23:12:49.413	2023-08-21 23:12:23.789802	0	6	655	652	652	2023-08-21 23:12:24.426	1449	1495	3	3	70	90
394	finished	2023-08-21 23:12:25.049	2023-08-21 23:13:11.113	2023-08-21 23:12:25.050981	4	6	653	654	654	2023-08-21 23:12:26.108	1447	1472	3	3	70	80
424	finished	2023-08-21 23:39:42.798	2023-08-21 23:40:16.237	2023-08-21 23:39:42.800226	6	2	656	658	656	2023-08-21 23:39:45.095	1487	1490	3	3	80	90
397	finished	2023-08-21 23:14:13.678	2023-08-21 23:14:43.789	2023-08-21 23:14:13.679533	6	1	654	655	654	2023-08-21 23:14:14.218	1486	1434	3	3	90	70
396	finished	2023-08-21 23:14:11.062	2023-08-21 23:14:48.687	2023-08-21 23:14:11.064366	3	6	653	659	659	2023-08-21 23:14:11.665	1436	1592	3	4	70	120
407	finished	2023-08-21 23:20:51.312	2023-08-21 23:21:53.669	2023-08-21 23:20:51.314205	3	6	659	654	654	2023-08-21 23:21:19.938	1542	1505	4	4	150	120
398	finished	2023-08-21 23:15:09.163	2023-08-21 23:15:46.292	2023-08-21 23:15:09.163933	6	0	659	654	659	2023-08-21 23:15:10.843	1603	1474	4	3	130	90
408	finished	2023-08-21 23:21:21.5	2023-08-21 23:21:59.561	2023-08-21 23:21:21.501481	6	1	653	655	653	2023-08-21 23:21:22.218	1480	1410	3	3	110	80
400	finished	2023-08-21 23:16:35.85	2023-08-21 23:17:11.686	2023-08-21 23:16:35.851161	6	1	653	655	653	2023-08-21 23:16:37.642	1451	1418	3	3	80	70
399	finished	2023-08-21 23:16:31.465	2023-08-21 23:17:11.706	2023-08-21 23:16:31.466991	3	6	659	654	654	2023-08-21 23:16:32.691	1581	1495	4	3	130	100
401	finished	2023-08-21 23:17:29.809	2023-08-21 23:17:51.871	2023-08-21 23:17:29.810751	6	0	653	659	653	2023-08-21 23:17:30.455	1472	1559	3	4	90	130
402	finished	2023-08-21 23:17:31.162	2023-08-21 23:18:17.036	2023-08-21 23:17:31.165029	6	3	654	655	654	2023-08-21 23:17:31.709	1507	1405	3	3	110	70
403	finished	2023-08-21 23:18:14.158	2023-08-21 23:18:35.675	2023-08-21 23:18:14.159595	6	0	659	653	659	2023-08-21 23:18:14.616	1571	1459	4	3	140	90
410	finished	2023-08-21 23:22:09.49	2023-08-21 23:22:40.578	2023-08-21 23:22:09.491746	6	1	654	653	654	2023-08-21 23:22:10.471	1519	1465	4	3	130	110
409	finished	2023-08-21 23:22:06.373	2023-08-21 23:22:47.891	2023-08-21 23:22:06.374851	6	0	659	655	659	2023-08-21 23:22:08.824	1552	1399	4	3	160	80
412	finished	2023-08-21 23:23:00.133	2023-08-21 23:23:20.947	2023-08-21 23:23:00.135676	6	0	653	655	653	2023-08-21 23:23:00.811	1477	1386	4	3	120	80
411	finished	2023-08-21 23:22:58.321	2023-08-21 23:23:37.992	2023-08-21 23:22:58.323405	0	6	654	659	659	2023-08-21 23:22:59.38	1504	1566	4	4	130	170
416	finished	2023-08-21 23:30:33.764	2023-08-21 23:30:56.004	2023-08-21 23:30:33.766842	6	0	659	656	659	2023-08-21 23:30:34.565	1599	1470	5	3	200	70
417	finished	2023-08-21 23:30:35.516	2023-08-21 23:31:05.056	2023-08-21 23:30:35.518078	2	6	657	658	658	2023-08-21 23:30:36.076	1504	1508	3	3	90	90
413	finished	2023-08-21 23:23:49.338	2023-08-21 23:24:09.679	2023-08-21 23:23:49.339788	6	0	659	653	659	2023-08-21 23:23:50.275	1577	1465	4	4	180	120
414	finished	2023-08-21 23:23:51.093	2023-08-21 23:24:21.126	2023-08-21 23:23:51.09514	6	1	655	654	655	2023-08-21 23:23:51.701	1407	1482	3	4	90	130
423	finished	2023-08-21 23:39:41.661	2023-08-21 23:40:23.379	2023-08-21 23:39:41.66399	4	6	654	655	655	2023-08-21 23:39:42.275	1473	1414	4	3	140	100
419	finished	2023-08-21 23:30:38.784	2023-08-21 23:31:07.804	2023-08-21 23:30:38.786419	6	1	654	655	654	2023-08-21 23:30:39.484	1494	1394	4	3	140	90
422	finished	2023-08-21 23:39:39.934	2023-08-21 23:40:38.492	2023-08-21 23:39:39.951241	3	6	659	653	653	2023-08-21 23:39:40.951	1555	1495	5	4	200	140
421	finished	2023-08-21 23:31:08.849	2023-08-21 23:31:46.88	2023-08-21 23:31:08.85093	2	6	659	653	653	2023-08-21 23:31:09.6	1576	1475	5	4	200	130
435	finished	2023-08-22 00:13:23.419	2023-08-22 00:14:31.576	2023-08-22 00:13:23.421254	2	6	653	658	658	2023-08-22 00:13:27.266	1528	1493	4	3	180	100
432	finished	2023-08-22 00:09:02.108	2023-08-22 00:09:42.41	2023-08-22 00:09:02.108921	6	1	653	656	653	2023-08-22 00:09:08.581	1535	1472	4	3	170	80
429	finished	2023-08-21 23:40:56.494	2023-08-21 23:41:45.559	2023-08-21 23:40:56.495619	6	2	659	657	659	2023-08-21 23:40:57.184	1568	1490	5	3	210	90
430	finished	2023-08-22 00:07:08.38	2023-08-22 00:07:32.346	2023-08-22 00:07:08.3817	0	6	658	653	653	2023-08-22 00:07:09.109	1474	1510	3	4	90	150
433	finished	2023-08-22 00:09:57.598	2023-08-22 00:10:55.586	2023-08-22 00:09:57.599452	6	0	653	657	653	2023-08-22 00:10:16.362	1548	1476	4	3	180	90
431	finished	2023-08-22 00:08:16.333	2023-08-22 00:08:48.254	2023-08-22 00:08:16.334483	6	0	653	655	653	2023-08-22 00:08:18.699	1521	1402	4	3	160	100
434	finished	2023-08-22 00:11:29.971	2023-08-22 00:11:59.592	2023-08-22 00:11:29.972774	0	6	656	652	652	2023-08-22 00:11:30.746	1457	1509	3	3	80	100
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, text, "createdAt", "updatedAt", "ownerUserId", "destUserId") FROM stdin;
306	Hello	2023-08-21 22:26:52.542919	2023-08-21 22:26:52.542919	657	654
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, content, read, "createdAt", "updatedAt", "senderId", "receiverId", "invitationLink") FROM stdin;
1354	friendRequest	send you a friend request	t	2023-08-21 22:20:45.783729	2023-08-21 22:20:45.783729	652	655	\N
1349	friendRequest	send you a friend request	t	2023-08-21 22:20:44.778071	2023-08-21 22:20:44.778071	652	654	\N
1356	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:20:47.670802	2023-08-21 22:20:47.670802	654	652	\N
1361	friendRequest	send you a friend request	t	2023-08-21 22:20:50.800538	2023-08-21 22:20:50.800538	653	655	\N
1365	friendRequest	send you a friend request	t	2023-08-21 22:20:54.227213	2023-08-21 22:20:54.227213	657	655	\N
1363	friendRequest	send you a friend request	t	2023-08-21 22:20:53.914089	2023-08-21 22:20:53.914089	657	654	\N
1357	friendRequest	send you a friend request	t	2023-08-21 22:20:50.100567	2023-08-21 22:20:50.100567	653	654	\N
1372	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:04.010856	2023-08-21 22:21:04.010856	654	653	\N
1373	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:04.418238	2023-08-21 22:21:04.418238	654	657	\N
1374	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:04.76541	2023-08-21 22:21:04.76541	654	658	\N
1375	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:05.780342	2023-08-21 22:21:05.780342	655	652	\N
1376	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:06.134035	2023-08-21 22:21:06.134035	655	653	\N
1377	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:06.41707	2023-08-21 22:21:06.41707	655	657	\N
1378	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:06.744293	2023-08-21 22:21:06.744293	655	658	\N
1379	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:07.032169	2023-08-21 22:21:07.032169	655	654	\N
1360	friendRequest	send you a friend request	t	2023-08-21 22:20:50.668109	2023-08-21 22:20:50.668109	653	656	\N
1353	friendRequest	send you a friend request	t	2023-08-21 22:20:45.633024	2023-08-21 22:20:45.633024	652	656	\N
1380	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:07.998046	2023-08-21 22:21:07.998046	656	652	\N
1381	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:08.335284	2023-08-21 22:21:08.335284	656	653	\N
1382	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:08.628409	2023-08-21 22:21:08.628409	656	657	\N
1362	friendRequest	send you a friend request	t	2023-08-21 22:20:51.935975	2023-08-21 22:20:51.935975	653	659	\N
1355	friendRequest	send you a friend request	t	2023-08-21 22:20:46.348804	2023-08-21 22:20:46.348804	652	659	\N
1383	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:09.663919	2023-08-21 22:21:09.663919	659	652	\N
1384	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:09.991321	2023-08-21 22:21:09.991321	659	653	\N
1385	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:10.305468	2023-08-21 22:21:10.305468	659	657	\N
1386	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:10.557162	2023-08-21 22:21:10.557162	659	658	\N
1358	friendRequest	send you a friend request	t	2023-08-21 22:20:50.246615	2023-08-21 22:20:50.246615	653	657	\N
1351	friendRequest	send you a friend request	t	2023-08-21 22:20:45.347702	2023-08-21 22:20:45.347702	652	657	\N
1387	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:11.79698	2023-08-21 22:21:11.79698	657	652	\N
1388	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:12.200777	2023-08-21 22:21:12.200777	657	653	\N
1389	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:12.497244	2023-08-21 22:21:12.497244	657	658	\N
1350	friendRequest	send you a friend request	t	2023-08-21 22:20:45.055993	2023-08-21 22:20:45.055993	652	653	\N
1390	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:19.845748	2023-08-21 22:21:19.845748	653	652	\N
1352	friendRequest	send you a friend request	t	2023-08-21 22:20:45.48011	2023-08-21 22:20:45.48011	652	658	\N
1359	friendRequest	send you a friend request	t	2023-08-21 22:20:50.382938	2023-08-21 22:20:50.382938	653	658	\N
1391	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:22.568332	2023-08-21 22:21:22.568332	658	652	\N
1392	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:22.982181	2023-08-21 22:21:22.982181	658	653	\N
1393	friendRequest	send you a friend request	t	2023-08-21 22:21:23.818063	2023-08-21 22:21:23.818063	658	656	\N
1394	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:25.080214	2023-08-21 22:21:25.080214	656	658	\N
1395	friendRequest	send you a friend request	t	2023-08-21 22:21:25.960735	2023-08-21 22:21:25.960735	655	656	\N
1397	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:27.988007	2023-08-21 22:21:27.988007	656	655	\N
1396	friendRequest	send you a friend request	t	2023-08-21 22:21:26.748695	2023-08-21 22:21:26.748695	655	659	\N
1398	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:30.193051	2023-08-21 22:21:30.193051	659	655	\N
1400	friendRequest	send you a friend request	t	2023-08-21 22:21:31.681165	2023-08-21 22:21:31.681165	656	659	\N
1401	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:32.965665	2023-08-21 22:21:32.965665	659	656	\N
1399	friendRequest	send you a friend request	t	2023-08-21 22:21:31.206252	2023-08-21 22:21:31.206252	656	654	\N
1402	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:34.330545	2023-08-21 22:21:34.330545	654	656	\N
1403	friendRequest	send you a friend request	t	2023-08-21 22:21:35.693211	2023-08-21 22:21:35.693211	654	659	\N
1404	friendRequestAccepted	accepted your friend request	t	2023-08-21 22:21:37.035392	2023-08-21 22:21:37.035392	659	654	\N
1367	friendRequest	send you a friend request	t	2023-08-21 22:20:57.126628	2023-08-21 22:20:57.126628	658	657	\N
1369	friendRequest	send you a friend request	t	2023-08-21 22:20:57.656358	2023-08-21 22:20:57.656358	658	654	\N
1368	friendRequest	send you a friend request	t	2023-08-21 22:20:57.353797	2023-08-21 22:20:57.353797	658	655	\N
1364	friendRequest	send you a friend request	t	2023-08-21 22:20:54.075725	2023-08-21 22:20:54.075725	657	656	\N
1371	friendRequest	send you a friend request	t	2023-08-21 22:21:01.982013	2023-08-21 22:21:01.982013	654	655	\N
1370	friendRequest	send you a friend request	t	2023-08-21 22:20:59.889447	2023-08-21 22:20:59.889447	658	659	\N
1366	friendRequest	send you a friend request	t	2023-08-21 22:20:55.236262	2023-08-21 22:20:55.236262	657	659	\N
1408	roomInvite	invite you to join the channel PrivateRoom	t	2023-08-21 22:27:35.152034	2023-08-21 22:27:35.152034	657	659	/chat/channel/invitation/96/PrivateRoom
1407	roomInvite	invite you to join the channel PrivateRoom	t	2023-08-21 22:27:35.143504	2023-08-21 22:27:35.143504	657	656	/chat/channel/invitation/96/PrivateRoom
1406	roomInvite	invite you to join the channel PrivateRoom	t	2023-08-21 22:27:35.139472	2023-08-21 22:27:35.139472	657	655	/chat/channel/invitation/96/PrivateRoom
1405	roomInvite	invite you to join the channel PrivateRoom	t	2023-08-21 22:27:35.135187	2023-08-21 22:27:35.135187	657	654	/chat/channel/invitation/96/PrivateRoom
1412	roomInvite	invite you to join the channel PrivateRoom	f	2023-08-21 22:27:35.304916	2023-08-21 22:27:35.304916	657	0	/chat/channel/invitation/96/PrivateRoom
1409	roomInvite	invite you to join the channel PrivateRoom	t	2023-08-21 22:27:35.166503	2023-08-21 22:27:35.166503	657	652	/chat/channel/invitation/96/PrivateRoom
1410	roomInvite	invite you to join the channel PrivateRoom	t	2023-08-21 22:27:35.185649	2023-08-21 22:27:35.185649	657	653	/chat/channel/invitation/96/PrivateRoom
1411	roomInvite	invite you to join the channel PrivateRoom	t	2023-08-21 22:27:35.199222	2023-08-21 22:27:35.199222	657	658	/chat/channel/invitation/96/PrivateRoom
1413	trophy	You win a trophy : Why Not	t	2023-08-21 22:48:03.992761	2023-08-21 22:48:03.992761	0	656	\N
1414	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:04.000156	2023-08-21 22:48:04.000156	0	656	\N
1415	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:48:04.006223	2023-08-21 22:48:04.006223	0	656	\N
1416	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 22:48:04.020567	2023-08-21 22:48:04.020567	0	656	\N
1417	trophy	You win a trophy : Why Not	t	2023-08-21 22:48:04.207086	2023-08-21 22:48:04.207086	0	658	\N
1418	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:04.237953	2023-08-21 22:48:04.237953	0	658	\N
1419	trophy	You win a trophy : Why Not	t	2023-08-21 22:48:24.478861	2023-08-21 22:48:24.478861	0	659	\N
1420	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:24.48325	2023-08-21 22:48:24.48325	0	659	\N
1421	trophy	You win a trophy : Why Not	t	2023-08-21 22:48:24.68901	2023-08-21 22:48:24.68901	0	653	\N
1422	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:24.698167	2023-08-21 22:48:24.698167	0	653	\N
1423	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:48:24.702186	2023-08-21 22:48:24.702186	0	653	\N
1424	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:33.81561	2023-08-21 22:48:33.81561	0	657	\N
1425	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:48:33.826455	2023-08-21 22:48:33.826455	0	657	\N
1426	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:33.946468	2023-08-21 22:48:33.946468	0	652	\N
1427	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:36.094079	2023-08-21 22:48:36.094079	0	654	\N
1428	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:48:36.112599	2023-08-21 22:48:36.112599	0	654	\N
1429	trophy	You win a trophy : Beginner	t	2023-08-21 22:48:36.395879	2023-08-21 22:48:36.395879	0	655	\N
1430	trophy	You win a trophy : Why Not	t	2023-08-21 22:49:37.668786	2023-08-21 22:49:37.668786	0	652	\N
1431	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:49:37.685604	2023-08-21 22:49:37.685604	0	652	\N
1432	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:49:57.603463	2023-08-21 22:49:57.603463	0	659	\N
1433	trophy	You win a trophy : Why Not	t	2023-08-21 22:49:59.074462	2023-08-21 22:49:59.074462	0	657	\N
1434	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:49:59.222968	2023-08-21 22:49:59.222968	0	658	\N
1435	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 22:50:37.572219	2023-08-21 22:50:37.572219	0	657	\N
1436	trophy	You win a trophy : Why Not	t	2023-08-21 22:50:54.565661	2023-08-21 22:50:54.565661	0	654	\N
1437	trophy	You win a trophy : Warrior	t	2023-08-21 22:50:54.588496	2023-08-21 22:50:54.588496	0	654	\N
1438	trophy	You win a trophy : Why Not	t	2023-08-21 22:50:57.365591	2023-08-21 22:50:57.365591	0	655	\N
1439	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 22:51:53.265621	2023-08-21 22:51:53.265621	0	659	\N
1440	trophy	You win a trophy : Blitz Pong	t	2023-08-21 22:51:56.160476	2023-08-21 22:51:56.160476	0	655	\N
1441	trophy	You win a trophy : Warrior	t	2023-08-21 22:51:57.081942	2023-08-21 22:51:57.081942	0	658	\N
1442	trophy	You win a trophy : Warrior	t	2023-08-21 22:54:37.005076	2023-08-21 22:54:37.005076	0	659	\N
1443	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 22:56:09.945204	2023-08-21 22:56:09.945204	0	655	\N
1444	trophy	You win a trophy : Lord	t	2023-08-21 22:56:23.005778	2023-08-21 22:56:23.005778	0	658	\N
1445	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 22:56:28.807408	2023-08-21 22:56:28.807408	0	652	\N
1446	trophy	You win a trophy : Warrior	t	2023-08-21 22:57:14.271739	2023-08-21 22:57:14.271739	0	652	\N
1447	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 22:59:33.99691	2023-08-21 22:59:33.99691	0	658	\N
1448	trophy	You win a trophy : Lord	t	2023-08-21 23:01:05.419841	2023-08-21 23:01:05.419841	0	652	\N
1449	trophy	You win a trophy : Lord	t	2023-08-21 23:05:15.251444	2023-08-21 23:05:15.251444	0	659	\N
1450	trophy	You win a trophy : Warrior	t	2023-08-21 23:07:59.553415	2023-08-21 23:07:59.553415	0	657	\N
1451	trophy	You win a trophy : Warrior	t	2023-08-21 23:08:19.12068	2023-08-21 23:08:19.12068	0	655	\N
1452	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 23:09:01.864856	2023-08-21 23:09:01.864856	0	654	\N
1453	trophy	You win a trophy : Warrior	t	2023-08-21 23:09:01.912957	2023-08-21 23:09:01.912957	0	656	\N
1454	trophy	You win a trophy : Lord	t	2023-08-21 23:09:16.127879	2023-08-21 23:09:16.127879	0	657	\N
1455	trophy	You win a trophy : Invincible Resistant	t	2023-08-21 23:09:56.003812	2023-08-21 23:09:56.003812	0	653	\N
1456	trophy	You win a trophy : Laser Pointer	t	2023-08-21 23:13:11.297435	2023-08-21 23:13:11.297435	0	654	\N
1457	trophy	You win a trophy : Regular	t	2023-08-21 23:17:11.813273	2023-08-21 23:17:11.813273	0	653	\N
1458	trophy	You win a trophy : Regular	t	2023-08-21 23:17:11.897312	2023-08-21 23:17:11.897312	0	654	\N
1459	trophy	You win a trophy : Warrior	t	2023-08-21 23:17:52.000745	2023-08-21 23:17:52.000745	0	653	\N
1460	trophy	You win a trophy : Regular	t	2023-08-21 23:18:17.171802	2023-08-21 23:18:17.171802	0	655	\N
1461	trophy	You win a trophy : Regular	t	2023-08-21 23:18:35.765274	2023-08-21 23:18:35.765274	0	659	\N
1462	trophy	You win a trophy : Emperor	t	2023-08-21 23:30:56.26813	2023-08-21 23:30:56.26813	0	659	\N
1463	trophy	You win a trophy : Lord	t	2023-08-22 00:08:48.380307	2023-08-22 00:08:48.380307	0	653	\N
1464	trophy	You win a trophy : Regular	t	2023-08-22 00:11:59.695648	2023-08-22 00:11:59.695648	0	656	\N
\.


--
-- Data for Name: trophies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trophies (id, name, description, "imagePath", total) FROM stdin;
440	Beginner	Play your first game	beginner.jpeg	0
441	Warrior	Win 3 games in a row	warrior.jpeg	3
442	Lord	Win 5 games in a row	lord.jpeg	5
443	Emperor	Win 10 games in a row	emperor.jpeg	10
444	Laser Pointer	Kill an opponent with a Laser	laser_pointer.jpeg	0
445	Gamma Laser	Kill 5 opponents with a laser	gamma_laser.jpeg	5
446	Scorificator	Kill 10 opponents with a laser	scorificator.jpeg	10
447	Regular	Play 20 games	regular.jpeg	20
448	Addict	Play 50 games	addict.jpeg	50
449	NoLife	Play 100 games	nolife.jpeg	100
450	Bonus Master	Use 3 bonuses in one game	bonus_master.jpeg	3
451	Bonus Pro	Use 5 bonuses in one game	bonus_pro.jpeg	5
452	Bonus Cheater	Use 10 bonuses in one game	bonus_cheater.jpeg	10
453	Pong-tastic	Win 5 games without missing a single ball	pong_tastic.jpeg	5
454	Tireless Returner	Return the ball 10 times in a row without it touching the sides	tireless_returner.jpeg	10
455	Why Not	Win a bonus game without using any bonuses	why_not.jpeg	0
456	Ping King	Score a point when the ball is at high speed	ping_king.jpeg	0
457	Faster Than Light	Score a point when the ball is at maximum speed	faster_than_light.jpeg	0
458	Blitz Pong	Win a game in less than 2 minutes	blitz_pong.jpeg	0
459	Invincible Resistant	Win a game without losing a single point	invincible_resistant.jpeg	0
460	Point Prospector	Win a game with a minimum of 30 points scored	point_prospector.jpeg	30
\.


--
-- Data for Name: trophies_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trophies_progress (id, progress, total, "userId", "trophyId") FROM stdin;
3457	0	0	0	\N
3458	0	3	0	\N
3459	0	5	0	\N
3460	0	10	0	\N
3461	0	0	0	444
3462	0	5	0	445
3463	0	10	0	446
3464	0	20	0	447
3465	0	50	0	448
3466	0	100	0	449
3467	0	3	0	450
3468	0	5	0	451
3469	0	10	0	452
3470	0	5	0	453
3471	0	10	0	454
3472	0	0	0	455
3473	0	0	0	456
3474	0	0	0	457
3475	0	0	0	458
3476	0	0	0	459
3477	0	30	0	460
3478	0	0	652	440
3482	0	0	652	444
3483	0	5	652	445
3484	0	10	652	446
3488	0	3	652	450
3489	0	5	652	451
3490	0	10	652	452
3491	0	5	652	453
3492	0	10	652	454
3493	0	0	652	455
3494	0	0	652	456
3495	0	0	652	457
3496	0	0	652	458
3497	0	0	652	459
3499	0	0	653	440
3503	0	0	653	444
3504	0	5	653	445
3505	0	10	653	446
3509	0	3	653	450
3510	0	5	653	451
3511	0	10	653	452
3512	0	5	653	453
3514	0	0	653	455
3515	0	0	653	456
3516	0	0	653	457
3517	0	0	653	458
3518	0	0	653	459
3520	0	0	654	440
3524	0	0	654	444
3533	0	5	654	453
3535	0	0	654	455
3536	0	0	654	456
3537	0	0	654	457
3538	0	0	654	458
3539	0	0	654	459
3541	0	0	655	440
3545	0	0	655	444
3546	0	5	655	445
3547	0	10	655	446
3551	0	3	655	450
3552	0	5	655	451
3553	0	10	655	452
3554	0	5	655	453
3556	0	0	655	455
3557	0	0	655	456
3558	0	0	655	457
3559	0	0	655	458
3560	0	0	655	459
3562	0	0	656	440
3566	0	0	656	444
3567	0	5	656	445
3568	0	10	656	446
3572	0	3	656	450
3573	0	5	656	451
3574	0	10	656	452
3575	0	5	656	453
3576	0	10	656	454
3577	0	0	656	455
3578	0	0	656	456
3579	0	0	656	457
3580	0	0	656	458
3581	0	0	656	459
3583	0	0	657	440
3587	0	0	657	444
3588	0	5	657	445
3589	0	10	657	446
3502	9	10	653	443
3586	6	10	657	443
3522	4	5	654	442
3590	19	20	657	447
3585	5	5	657	442
3582	6	30	656	460
3549	28	50	655	448
3513	1	10	653	454
3592	19	100	657	449
3519	7	30	653	460
3498	7	30	652	460
3481	7	10	652	443
3529	28	100	654	449
3501	6	5	653	442
3550	28	100	655	449
3528	28	50	654	448
3521	3	3	654	441
3584	4	3	657	441
3544	3	10	655	443
3506	20	20	653	447
3487	19	100	652	449
3570	20	50	656	448
3561	7	30	655	460
3543	3	5	655	442
3530	1	3	654	450
3480	5	5	652	442
3555	2	10	655	454
3540	7	30	654	460
3569	20	20	656	447
3525	2	5	654	445
3479	3	3	652	441
3542	3	3	655	441
3527	20	20	654	447
3500	3	3	653	441
3508	36	100	653	449
3526	2	10	654	446
3571	20	100	656	449
3564	4	5	656	442
3531	1	5	654	451
3532	1	10	654	452
3534	1	10	654	454
3485	19	20	652	447
3591	19	50	657	448
3593	0	3	657	450
3594	0	5	657	451
3595	0	10	657	452
3596	0	5	657	453
3597	0	10	657	454
3598	0	0	657	455
3599	0	0	657	456
3600	0	0	657	457
3601	0	0	657	458
3602	0	0	657	459
3604	0	0	658	440
3608	0	0	658	444
3609	0	5	658	445
3610	0	10	658	446
3614	0	3	658	450
3615	0	5	658	451
3616	0	10	658	452
3617	0	5	658	453
3619	0	0	658	455
3620	0	0	658	456
3621	0	0	658	457
3622	0	0	658	458
3623	0	0	658	459
3625	0	0	659	440
3629	0	0	659	444
3630	0	5	659	445
3631	0	10	659	446
3635	0	3	659	450
3636	0	5	659	451
3637	0	10	659	452
3638	0	5	659	453
3640	0	0	659	455
3641	0	0	659	456
3642	0	0	659	457
3643	0	0	659	458
3644	0	0	659	459
3607	5	10	658	443
3603	7	30	657	460
3563	4	3	656	441
3565	4	10	656	443
3628	10	10	659	443
3624	7	30	658	460
3605	3	3	658	441
3633	31	50	659	448
3639	2	10	659	454
3634	31	100	659	449
3523	4	10	654	443
3627	5	5	659	442
3626	3	3	659	441
3486	19	50	652	448
3507	36	50	653	448
3611	19	20	658	447
3612	19	50	658	448
3613	19	100	658	449
3645	7	30	659	460
3618	1	10	658	454
3606	5	5	658	442
3548	20	20	655	447
3632	20	20	659	447
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt", "lastActivity", score, level, experience, "consecutiveWin", "laserKill", "bonusUsed", "numberOfConsecutiveWins", "numberOfEnemiesKilledWithLaser", "numberOfGamesPlayed", "numberOfGamesWonWithoutMissingBall", rank) FROM stdin;
0	Bot	Bot	Bot	Bot@bot.com	\N	user	https://t3.ftcdn.net/jpg/01/36/49/90/360_F_136499077_xp7bSQB4Dx13ktQp0OYJ5ricWXhiFtD2.jpg	I'm a bot	f	offline	\N	2023-08-16 21:34:36.841798	2023-08-16 21:34:36.841798	2023-08-16 21:34:36.841798	1500	1	0	0	0	0	0	0	0	0	cooper_1
653	Pauline	Mueller	Pauline_Mueller66	Pauline77@hotmail.com	$2b$10$R4PnkrJYLjW/zC5yRgukEu42DLdO4xaHHho5fQElFZsGfvXNGHWoy	user	https://loremflickr.com/640/480/people?lock=66907260583936	Voluptatibus at dolore.	f	online	\N	2023-08-21 22:16:40.138137	2023-08-22 00:14:31.587	2023-08-22 00:14:52.455	1528	4	180	0	0	0	0	0	36	0	gold_3
655	Elias	Heller	Elias29	Elias_Heller@gmail.com	$2b$10$BulSbNS6IDT5iKs7v78edO28tsd8Lljq65VJupbHmmsbLmJLmwGuW	user	avatar-1692662525517-560943.jpg	Itaque harum voluptates eos.	f	online	\N	2023-08-21 22:17:13.58553	2023-08-22 00:08:48.266	2023-08-22 00:09:00.847	1402	3	100	0	0	0	0	0	28	0	cooper_2
659	Bradley	Pollich	Bradley_Pollich	Bradley.Pollich@hotmail.com	$2b$10$FIsWuuT4VXaJ48fhvcu1l.ImhjZJbyRZgWHBPy87NBOVcGxYcgkTK	user	avatar-1692662437211-425374.jpg	Provident modi placeat eveniet minima.	f	online	\N	2023-08-21 22:19:13.719386	2023-08-22 00:00:37.213	2023-08-22 00:04:37.586	1568	5	210	0	0	0	1	0	31	0	gold_2
654	Monica	Franey	Monica47	Monica.Franey11@hotmail.com	$2b$10$tqRxj8r.KB/.1wjuu1ow5e.UFOn.5Ebaf0BP7AGL3cy4D0H25Kutu	user	https://loremflickr.com/640/480/people?lock=5607576829952000	Ipsum itaque molestias.	f	offline	\N	2023-08-21 22:16:58.878814	2023-08-22 00:02:48.042	2023-08-22 00:02:48.037	1473	4	140	0	2	1	0	0	28	0	silver_3
656	Sara	Wiza	Sara_Wiza79	Sara.Wiza@hotmail.com	$2b$10$ZHW4g5vXfQZ0HHG5W70Cae5HOwRGSA0O/ymZT7KTApm50fuH2SyPC	user	https://loremflickr.com/640/480/people?lock=8269245968285696	Beatae cumque eos dolorem ullam at in.	f	online	\N	2023-08-21 22:17:56.929376	2023-08-22 00:11:59.598	2023-08-22 00:11:31.488	1457	3	80	0	0	0	0	0	20	0	cooper_1
658	Ora	Weber	OraWeber	Ora.Weber84@yahoo.com	$2b$10$ifkNUk1RgyNhW6aY0uLkJeVoBO5hSGtBJ7J69cHEMazdj8ezeGXMO	user	avatar-1692662745247-627704.jpg	Deleniti laudantium inventore.	f	online	\N	2023-08-21 22:18:59.314227	2023-08-22 00:14:31.598	2023-08-22 00:14:50.942	1493	3	100	0	0	0	1	0	19	0	silver_2
657	Lonnie	Welch	LonnieWelch	Lonnie.Welch62@gmail.com	$2b$10$AHdPPCdBQJt2FADVSshe5eVAZa3suf22eL7lMz2HmGkd8HpglncIe	user	https://loremflickr.com/640/480/people?lock=3436739894968320	Repellendus rerum facilis sed doloremque.	f	online	\N	2023-08-21 22:18:22.882673	2023-08-22 00:10:55.601	2023-08-22 00:14:34.423	1476	3	90	0	0	0	0	0	19	0	silver_3
652	Marilyn	Funk	Marilyn_Funk	Marilyn91@gmail.com	$2b$10$sW5dQhc46Aj6/F9fhWuyN.qF4szstqyTw4izV9mwCZG2w18fnZbZ6	user	https://loremflickr.com/640/480/people?lock=5249448787574784	Mollitia exercitationem distinctio eos magnam animi facilis.	f	online	\N	2023-08-21 22:16:25.151917	2023-08-22 00:11:59.605	2023-08-22 00:12:12.264	1509	3	100	0	0	0	4	0	19	0	silver_1
\.


--
-- Data for Name: users_relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_relation (id, "relationType", "createdAt", "updatedAt", "userRelationId", "mutuelBlocked", "userInitiateurId") FROM stdin;
226	friend	2023-08-21 22:20:44.748415	2023-08-21 22:20:47.667	654	f	652
233	friend	2023-08-21 22:20:50.097931	2023-08-21 22:21:04.008	654	f	653
239	friend	2023-08-21 22:20:53.912307	2023-08-21 22:21:04.415	654	f	657
245	friend	2023-08-21 22:20:57.652949	2023-08-21 22:21:04.759	654	f	658
231	friend	2023-08-21 22:20:45.781534	2023-08-21 22:21:05.776	655	f	652
237	friend	2023-08-21 22:20:50.798678	2023-08-21 22:21:06.13	655	f	653
241	friend	2023-08-21 22:20:54.220052	2023-08-21 22:21:06.394	655	f	657
244	friend	2023-08-21 22:20:57.34946	2023-08-21 22:21:06.74	655	f	658
247	friend	2023-08-21 22:21:01.979331	2023-08-21 22:21:07.022	655	f	654
230	friend	2023-08-21 22:20:45.631265	2023-08-21 22:21:07.995	656	f	652
236	friend	2023-08-21 22:20:50.665546	2023-08-21 22:21:08.329	656	f	653
240	friend	2023-08-21 22:20:54.071889	2023-08-21 22:21:08.624	656	f	657
232	friend	2023-08-21 22:20:46.346009	2023-08-21 22:21:09.66	659	f	652
238	friend	2023-08-21 22:20:51.93396	2023-08-21 22:21:09.985	659	f	653
242	friend	2023-08-21 22:20:55.234425	2023-08-21 22:21:10.302	659	f	657
246	friend	2023-08-21 22:20:59.885928	2023-08-21 22:21:10.552	659	f	658
228	friend	2023-08-21 22:20:45.345463	2023-08-21 22:21:11.794	657	f	652
234	friend	2023-08-21 22:20:50.245015	2023-08-21 22:21:12.197	657	f	653
243	friend	2023-08-21 22:20:57.124458	2023-08-21 22:21:12.494	657	f	658
227	friend	2023-08-21 22:20:45.052457	2023-08-21 22:21:19.842	653	f	652
229	friend	2023-08-21 22:20:45.477804	2023-08-21 22:21:22.565	658	f	652
235	friend	2023-08-21 22:20:50.380955	2023-08-21 22:21:22.979	658	f	653
248	friend	2023-08-21 22:21:23.815046	2023-08-21 22:21:25.073	656	f	658
249	friend	2023-08-21 22:21:25.956964	2023-08-21 22:21:27.985	656	f	655
250	friend	2023-08-21 22:21:26.746672	2023-08-21 22:21:30.188	659	f	655
252	friend	2023-08-21 22:21:31.675883	2023-08-21 22:21:32.951	659	f	656
251	friend	2023-08-21 22:21:31.204128	2023-08-21 22:21:34.327	654	f	656
253	friend	2023-08-21 22:21:35.688935	2023-08-21 22:21:37.032	659	f	654
\.


--
-- Data for Name: users_trophies_trophies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_trophies_trophies ("usersId", "trophiesId") FROM stdin;
656	455
656	440
656	458
656	459
658	455
658	440
659	455
659	440
653	455
653	440
653	458
657	440
657	458
652	440
654	440
654	458
655	440
652	455
652	458
659	458
657	455
658	458
657	459
654	455
654	441
655	455
659	459
655	458
658	441
659	441
655	459
658	442
652	459
652	441
658	459
652	442
659	442
657	441
655	441
654	459
656	441
657	442
653	459
654	444
653	447
654	447
653	441
655	447
659	447
659	443
653	442
656	447
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 2952, true);


--
-- Name: chat_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_rooms_id_seq', 114, true);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_id_seq', 435, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 306, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1464, true);


--
-- Name: trophies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trophies_id_seq', 460, true);


--
-- Name: trophies_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trophies_progress_id_seq', 3645, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 659, true);


--
-- Name: users_relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_relation_id_seq', 253, true);


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

ALTER TABLE ONLY public.users_relation
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
-- Name: users_relation FK_3d873af2df3de21e76d81d27780; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_relation
    ADD CONSTRAINT "FK_3d873af2df3de21e76d81d27780" FOREIGN KEY ("userInitiateurId") REFERENCES public.users(id) ON DELETE CASCADE;


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
-- Name: games FK_75fbf4e5d917a20839c96ccda03; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_75fbf4e5d917a20839c96ccda03" FOREIGN KEY ("player1Id") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_relation FK_7e8bd3e8733c360fb1fce113ab3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_relation
    ADD CONSTRAINT "FK_7e8bd3e8733c360fb1fce113ab3" FOREIGN KEY ("userRelationId") REFERENCES public.users(id) ON DELETE CASCADE;


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

