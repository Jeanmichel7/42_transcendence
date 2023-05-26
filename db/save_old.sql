--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.2 (Debian 15.2-1.pgdg110+1)

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

CREATE TABLE public."chat_messages" (
    id bigint NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "userId" bigint,
    "roomId" bigint
);


ALTER TABLE public."chat_messages" OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."chat_messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."chat_messages_id_seq" OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."chat_messages_id_seq" OWNED BY public."chat_messages".id;


--
-- Name: chat_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat_rooms" (
    id bigint NOT NULL,
    status text DEFAULT 'public'::text NOT NULL,
    password text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "ownerUserId" bigint
);


ALTER TABLE public."chat_rooms" OWNER TO postgres;

--
-- Name: chat_rooms_admins_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat_rooms_admins_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat_rooms_admins_users" OWNER TO postgres;

--
-- Name: chat_rooms_banned_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat_rooms_banned_users_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat_rooms_banned_users_users" OWNER TO postgres;

--
-- Name: chat_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."chat_rooms_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."chat_rooms_id_seq" OWNER TO postgres;

--
-- Name: chat_rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."chat_rooms_id_seq" OWNED BY public."chat_rooms".id;


--
-- Name: chat_rooms_muted_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat_rooms_muted_users_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat_rooms_muted_users_users" OWNER TO postgres;

--
-- Name: chat_rooms_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat_rooms_users_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat_rooms_users_users" OWNER TO postgres;

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
    "updatedAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users-relation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."users-relation" (
    id integer NOT NULL,
    "relationType" text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "userId" bigint,
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

ALTER TABLE ONLY public."chat_messages" ALTER COLUMN id SET DEFAULT nextval('public."chat_messages_id_seq"'::regclass);


--
-- Name: chat_rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms" ALTER COLUMN id SET DEFAULT nextval('public."chat_rooms_id_seq"'::regclass);


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

COPY public."chat_messages" (id, text, "createdAt", "updatedAt", "userId", "roomId") FROM stdin;
1	Hello everyone	2023-04-15 15:18:44.969765	2023-04-15 15:18:44.969765	2	2
2	Hello everyone	2023-04-15 15:21:45.199946	2023-04-15 15:21:45.199946	2	2
3	Hello everyone	2023-04-15 15:23:16.619574	2023-04-15 15:23:16.619574	2	2
4	Hello everyone	2023-04-15 15:24:26.268709	2023-04-15 15:24:26.268709	2	2
5	Hello everyone	2023-04-15 15:24:33.429685	2023-04-15 15:24:33.429685	2	2
6	Hello everyone	2023-04-15 15:25:35.533427	2023-04-15 15:25:35.533427	2	2
7	Hello everyone	2023-04-15 15:26:20.766359	2023-04-15 15:26:20.766359	2	2
8	Hello everyone	2023-04-15 15:26:26.175978	2023-04-15 15:26:26.175978	2	2
9	Hello everyone	2023-04-15 15:27:35.826356	2023-04-15 15:27:35.826356	2	2
10	Hello everyone	2023-04-15 15:28:40.010035	2023-04-15 15:28:40.010035	2	2
11	Hello	2023-04-15 15:30:09.59099	2023-04-15 15:30:09.59099	3	2
12	Hi	2023-04-15 15:30:15.414073	2023-04-15 15:30:15.414073	1	2
13	Hello	2023-04-15 15:51:05.825422	2023-04-15 15:51:05.825422	3	2
14	Hello	2023-04-15 15:51:15.66553	2023-04-15 15:51:15.66553	3	3
15	Hello everyone	2023-04-15 15:51:28.001907	2023-04-15 15:51:28.001907	2	2
16	Hello everyone	2023-04-15 15:51:40.855553	2023-04-15 15:51:40.855553	2	1
17	eeeeee	2023-04-15 15:54:09.867064	2023-04-15 15:54:09.867064	1	1
18	rrrrrrr	2023-04-15 15:54:13.308524	2023-04-15 15:54:13.308524	1	2
19	Hello	2023-04-15 18:16:01.702971	2023-04-15 18:16:01.702971	3	3
20	Hello	2023-04-15 18:17:58.065179	2023-04-15 18:17:58.065179	3	3
21	Hello	2023-04-15 18:20:57.390281	2023-04-15 18:20:57.390281	3	3
22	mnbvc	2023-04-15 18:21:26.921816	2023-04-15 18:21:26.921816	1	2
23	dfsa	2023-04-15 18:33:00.118345	2023-04-15 18:33:00.118345	1	3
\.


--
-- Data for Name: chat_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat_rooms" (id, status, password, "createdAt", "updatedAt", "ownerUserId") FROM stdin;
1	public	\N	2023-04-15 15:13:14.280723	2023-04-15 15:13:14.280723	1
2	public	\N	2023-04-15 15:15:57.668681	2023-04-15 15:15:57.668681	1
3	public	pwd	2023-04-15 15:47:23.547194	2023-04-15 15:47:23.547194	3
\.


--
-- Data for Name: chat_rooms_admins_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat_rooms_admins_users" ("chatRoomsId", "usersId") FROM stdin;
1	1
2	1
3	3
\.


--
-- Data for Name: chat_rooms_banned_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat_rooms_banned_users_users" ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: chat_rooms_muted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat_rooms_muted_users_users" ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: chat_rooms_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat_rooms_users_users" ("chatRoomsId", "usersId") FROM stdin;
1	1
2	1
3	3
3	1
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, text, "createdAt", "updatedAt", "ownerUserId", "destUserId") FROM stdin;
1	Hello	2023-04-15 14:51:24.065198	2023-04-15 14:51:24.065198	1	2
2	Hi! How are you?	2023-04-15 14:52:31.903734	2023-04-15 14:52:31.903734	2	1
3	Fine and u	2023-04-15 14:52:48.770817	2023-04-15 14:52:48.770817	1	2
4	Fine	2023-04-15 14:53:07.475761	2023-04-15 14:53:07.475761	2	1
5	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.	2023-04-15 14:54:03.049563	2023-04-15 14:54:03.049563	3	1
6	What ?	2023-04-15 14:58:01.536222	2023-04-15 14:58:01.536222	1	3
7	Nothing	2023-04-15 14:58:12.326031	2023-04-15 14:58:12.326031	3	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt") FROM stdin;
1	Jean-michel	Rasser	jrasser843	jrasser@student.42mulhouse.fr	\N	user	avatar-1681569352834-22313.jpg	\N	f	offline	\N	2023-04-15 14:35:52.983528	2023-04-15 14:35:52.983528
2	myname	mylastname	mylogin	mymail@student.42.mulhouse.fr	$2b$10$AS6SHG9yawx/Ppi0FgF.1ulkvjl.VPUuQaIlskZtFMvRCcsJuqLfq	user	avatar-1681569879125-524990.jpg	\N	f	offline	\N	2023-04-15 14:36:39.627354	2023-04-15 14:44:39.151
3	myname2	mylastname2	mylogin2	mymail2@student.42.mulhouse.fr	$2b$10$OcW31nqM8xFvkj3ypkSj.e.1edEvBE6Bg4aU6Dj9yM/o/PAbbGA8S	user	avatar-1681569905226-824669.jpg	\N	f	offline	\N	2023-04-15 14:37:16.641894	2023-04-15 14:45:05.23
\.


--
-- Data for Name: users-relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."users-relation" (id, "relationType", "createdAt", "updatedAt", "userId", "userRelationId") FROM stdin;
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."chat_messages_id_seq"', 23, true);


--
-- Name: chat_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."chat_rooms_id_seq"', 3, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 7, true);


--
-- Name: users-relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users-relation_id_seq"', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: messages PK_18325f38ae6de43878487eff986; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY (id);


--
-- Name: users-relation PK_6973ffe5e4128326da10a9527d1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
    ADD CONSTRAINT "PK_6973ffe5e4128326da10a9527d1" PRIMARY KEY (id);


--
-- Name: chat_rooms_users_users PK_874e232358b5cf723660782b829; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_users_users"
    ADD CONSTRAINT "PK_874e232358b5cf723660782b829" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: chat_rooms_muted_users_users PK_d09fcf2a5c71305cbd055896b83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_muted_users_users"
    ADD CONSTRAINT "PK_d09fcf2a5c71305cbd055896b83" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat_rooms_admins_users PK_d72b5303fca5f97ffd7ba7f47b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_admins_users"
    ADD CONSTRAINT "PK_d72b5303fca5f97ffd7ba7f47b7" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat_rooms_banned_users_users PK_d84d3a37a15042dcd2a10c0d6e9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_banned_users_users"
    ADD CONSTRAINT "PK_d84d3a37a15042dcd2a10c0d6e9" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat_rooms PK_e4005b2d7c7fcdb9560f72979a3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms"
    ADD CONSTRAINT "PK_e4005b2d7c7fcdb9560f72979a3" PRIMARY KEY (id);


--
-- Name: chat_messages PK_fa087ba26131bc9415a4d4fbc45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_messages"
    ADD CONSTRAINT "PK_fa087ba26131bc9415a4d4fbc45" PRIMARY KEY (id);


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
-- Name: IDX_2562e296712bff664e6927a9ad; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2562e296712bff664e6927a9ad" ON public."chat_rooms_admins_users" USING btree ("chatRoomsId");


--
-- Name: IDX_3d8c7d5dc814c801b1075a100d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3d8c7d5dc814c801b1075a100d" ON public."chat_rooms_admins_users" USING btree ("usersId");


--
-- Name: IDX_512a2d0b091e14e85094b295d7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_512a2d0b091e14e85094b295d7" ON public."chat_rooms_muted_users_users" USING btree ("usersId");


--
-- Name: IDX_652058acde35292d8d9692a62e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_652058acde35292d8d9692a62e" ON public."chat_rooms_banned_users_users" USING btree ("usersId");


--
-- Name: IDX_6cc4059a8e8a95f7147a26cb59; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6cc4059a8e8a95f7147a26cb59" ON public."chat_rooms_users_users" USING btree ("chatRoomsId");


--
-- Name: IDX_7803d418aba8d9cd9466247c7a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7803d418aba8d9cd9466247c7a" ON public."chat_rooms_users_users" USING btree ("usersId");


--
-- Name: IDX_aa155ba4ecaae555c8cb4ba1fb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_aa155ba4ecaae555c8cb4ba1fb" ON public."chat_rooms_banned_users_users" USING btree ("chatRoomsId");


--
-- Name: IDX_e17666d5d6493f5969339abb1f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e17666d5d6493f5969339abb1f" ON public."chat_rooms_muted_users_users" USING btree ("chatRoomsId");


--
-- Name: messages FK_0fb1705612cf4af24c26d1a21eb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_0fb1705612cf4af24c26d1a21eb" FOREIGN KEY ("ownerUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages FK_249982c5f0a72ab6dd09a31c23c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_messages"
    ADD CONSTRAINT "FK_249982c5f0a72ab6dd09a31c23c" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_admins_users FK_2562e296712bff664e6927a9ad6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_admins_users"
    ADD CONSTRAINT "FK_2562e296712bff664e6927a9ad6" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat_rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_rooms_admins_users FK_3d8c7d5dc814c801b1075a100d9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_admins_users"
    ADD CONSTRAINT "FK_3d8c7d5dc814c801b1075a100d9" FOREIGN KEY ("usersId") REFERENCES public.users(id);


--
-- Name: chat_rooms_muted_users_users FK_512a2d0b091e14e85094b295d78; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_muted_users_users"
    ADD CONSTRAINT "FK_512a2d0b091e14e85094b295d78" FOREIGN KEY ("usersId") REFERENCES public.users(id);


--
-- Name: chat_rooms_banned_users_users FK_652058acde35292d8d9692a62e5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_banned_users_users"
    ADD CONSTRAINT "FK_652058acde35292d8d9692a62e5" FOREIGN KEY ("usersId") REFERENCES public.users(id);


--
-- Name: chat_rooms_users_users FK_6cc4059a8e8a95f7147a26cb59c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_users_users"
    ADD CONSTRAINT "FK_6cc4059a8e8a95f7147a26cb59c" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat_rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users-relation FK_718040c5303bad75d9908ee7fc0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
    ADD CONSTRAINT "FK_718040c5303bad75d9908ee7fc0" FOREIGN KEY ("userRelationId") REFERENCES public.users(id);


--
-- Name: chat_rooms_users_users FK_7803d418aba8d9cd9466247c7ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_users_users"
    ADD CONSTRAINT "FK_7803d418aba8d9cd9466247c7ad" FOREIGN KEY ("usersId") REFERENCES public.users(id);


--
-- Name: users-relation FK_8d141e88588d48afdbe8a7bb99c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
    ADD CONSTRAINT "FK_8d141e88588d48afdbe8a7bb99c" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: chat_messages FK_9a952a3345b5554f1f04bb066d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_messages"
    ADD CONSTRAINT "FK_9a952a3345b5554f1f04bb066d2" FOREIGN KEY ("roomId") REFERENCES public."chat_rooms"(id) ON DELETE CASCADE;


--
-- Name: messages FK_a0c2d1966be6c4ff33074b9f5d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_a0c2d1966be6c4ff33074b9f5d2" FOREIGN KEY ("destUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_rooms_banned_users_users FK_aa155ba4ecaae555c8cb4ba1fb2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_banned_users_users"
    ADD CONSTRAINT "FK_aa155ba4ecaae555c8cb4ba1fb2" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat_rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_rooms FK_df0593dbc3a47467284bc2fbc3b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms"
    ADD CONSTRAINT "FK_df0593dbc3a47467284bc2fbc3b" FOREIGN KEY ("ownerUserId") REFERENCES public.users(id);


--
-- Name: chat_rooms_muted_users_users FK_e17666d5d6493f5969339abb1f4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat_rooms_muted_users_users"
    ADD CONSTRAINT "FK_e17666d5d6493f5969339abb1f4" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat_rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

