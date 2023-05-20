--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg110+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg110+1)

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
-- Name: chat-messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat-messages" (
    id bigint NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "userId" bigint,
    "roomId" bigint
);


ALTER TABLE public."chat-messages" OWNER TO postgres;

--
-- Name: chat-messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."chat-messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."chat-messages_id_seq" OWNER TO postgres;

--
-- Name: chat-messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."chat-messages_id_seq" OWNED BY public."chat-messages".id;


--
-- Name: chat-rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat-rooms" (
    id bigint NOT NULL,
    type text DEFAULT 'private'::text NOT NULL,
    password text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "ownerUserId" bigint
);


ALTER TABLE public."chat-rooms" OWNER TO postgres;

--
-- Name: chat-rooms_admins_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat-rooms_admins_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat-rooms_admins_users" OWNER TO postgres;

--
-- Name: chat-rooms_banned_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat-rooms_banned_users_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat-rooms_banned_users_users" OWNER TO postgres;

--
-- Name: chat-rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."chat-rooms_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."chat-rooms_id_seq" OWNER TO postgres;

--
-- Name: chat-rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."chat-rooms_id_seq" OWNED BY public."chat-rooms".id;


--
-- Name: chat-rooms_muted_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat-rooms_muted_users_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat-rooms_muted_users_users" OWNER TO postgres;

--
-- Name: chat-rooms_users_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."chat-rooms_users_users" (
    "chatRoomsId" bigint NOT NULL,
    "usersId" bigint NOT NULL
);


ALTER TABLE public."chat-rooms_users_users" OWNER TO postgres;

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
-- Name: chat-messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-messages" ALTER COLUMN id SET DEFAULT nextval('public."chat-messages_id_seq"'::regclass);


--
-- Name: chat-rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms" ALTER COLUMN id SET DEFAULT nextval('public."chat-rooms_id_seq"'::regclass);


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
-- Data for Name: chat-messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat-messages" (id, text, "createdAt", "updatedAt", "userId", "roomId") FROM stdin;
\.


--
-- Data for Name: chat-rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat-rooms" (id, type, password, "createdAt", "updatedAt", "ownerUserId") FROM stdin;
\.


--
-- Data for Name: chat-rooms_admins_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat-rooms_admins_users" ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: chat-rooms_banned_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat-rooms_banned_users_users" ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: chat-rooms_muted_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat-rooms_muted_users_users" ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: chat-rooms_users_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."chat-rooms_users_users" ("chatRoomsId", "usersId") FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, text, "createdAt", "updatedAt", "ownerUserId", "destUserId") FROM stdin;
8	Hello	2023-05-20 15:49:45.385379	2023-05-20 15:49:45.385379	7	4
9	Hello la forme ?	2023-05-20 15:49:59.271065	2023-05-20 15:49:59.271065	7	6
10	1	2023-05-20 15:50:09.893491	2023-05-20 15:50:09.893491	7	6
11	2	2023-05-20 15:50:11.152618	2023-05-20 15:50:11.152618	7	6
12	3	2023-05-20 15:50:12.264438	2023-05-20 15:50:12.264438	7	6
13	4	2023-05-20 15:50:13.509195	2023-05-20 15:50:13.509195	7	6
14	5	2023-05-20 15:50:14.492224	2023-05-20 15:50:14.492224	7	6
15	6	2023-05-20 15:50:16.064519	2023-05-20 15:50:16.064519	7	6
16	Fine and u	2023-05-20 15:51:47.321694	2023-05-20 15:51:47.321694	4	7
17	Hello	2023-05-20 15:52:04.740202	2023-05-20 15:52:04.740202	4	7
18	Salut	2023-05-20 15:52:08.765511	2023-05-20 15:52:08.765511	4	7
19	babla	2023-05-20 15:52:13.43018	2023-05-20 15:52:13.43018	7	6
20	Hello	2023-05-20 15:54:08.662638	2023-05-20 15:54:08.662638	6	4
21	Salut toi \n	2023-05-20 15:54:26.316307	2023-05-20 15:54:26.316307	6	4
22	Hello	2023-05-20 15:54:33.897356	2023-05-20 15:54:33.897356	6	4
23	Coucou	2023-05-20 15:54:37.730999	2023-05-20 15:54:37.730999	6	4
24	Hey 	2023-05-20 15:54:58.80025	2023-05-20 15:54:58.80025	6	7
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "firstName", "lastName", login, email, password, role, avatar, description, "is2FAEnabled", status, "secret2FA", "createdAt", "updatedAt", "lastActivity") FROM stdin;
7	Jean-michel	Rasser	jrasser	jrasser@student.42mulhouse.fr	\N	user	avatar-1684597759567-714642.jpg	\N	f	absent	\N	2023-05-20 15:49:19.631682	2023-05-20 16:18:08.972	2023-05-20 15:58:57.918
4	Yann	Dumaine	ydumaine	ydumaine@student.42mulhouse.fr	\N	user	avatar-1684597161730-676240.jpg	\N	f	offline	\N	2023-05-20 15:39:21.815568	2023-05-20 15:42:29.235	2023-05-20 15:52:08.758
6	Wilhelm	Fermey	wfermey	wfermey@student.42mulhouse.fr	\N	user	avatar-1684597618569-58366.jpg	\N	f	offline	\N	2023-05-20 15:46:58.634678	2023-05-20 15:58:40.587	2023-05-20 15:58:40.584
\.


--
-- Data for Name: users-relation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."users-relation" (id, "relationType", "createdAt", "updatedAt", "userId", "userRelationId") FROM stdin;
4	friend	2023-05-20 15:49:34.581297	2023-05-20 15:49:34.58	7	7
5	friend	2023-05-20 15:49:36.954703	2023-05-20 15:49:36.954	7	4
6	friend	2023-05-20 15:49:37.794761	2023-05-20 15:49:37.794	7	6
8	friend	2023-05-20 15:53:28.52993	2023-05-20 15:53:28.529	6	4
7	friend	2023-05-20 15:53:26.774284	2023-05-20 15:54:51.769	6	7
\.


--
-- Name: chat-messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."chat-messages_id_seq"', 23, true);


--
-- Name: chat-rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."chat-rooms_id_seq"', 3, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 24, true);


--
-- Name: users-relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users-relation_id_seq"', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


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
-- Name: chat-rooms_users_users PK_874e232358b5cf723660782b829; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_users_users"
    ADD CONSTRAINT "PK_874e232358b5cf723660782b829" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: chat-rooms_muted_users_users PK_d09fcf2a5c71305cbd055896b83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_muted_users_users"
    ADD CONSTRAINT "PK_d09fcf2a5c71305cbd055896b83" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat-rooms_admins_users PK_d72b5303fca5f97ffd7ba7f47b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_admins_users"
    ADD CONSTRAINT "PK_d72b5303fca5f97ffd7ba7f47b7" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat-rooms_banned_users_users PK_d84d3a37a15042dcd2a10c0d6e9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_banned_users_users"
    ADD CONSTRAINT "PK_d84d3a37a15042dcd2a10c0d6e9" PRIMARY KEY ("chatRoomsId", "usersId");


--
-- Name: chat-rooms PK_e4005b2d7c7fcdb9560f72979a3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms"
    ADD CONSTRAINT "PK_e4005b2d7c7fcdb9560f72979a3" PRIMARY KEY (id);


--
-- Name: chat-messages PK_fa087ba26131bc9415a4d4fbc45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-messages"
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

CREATE INDEX "IDX_2562e296712bff664e6927a9ad" ON public."chat-rooms_admins_users" USING btree ("chatRoomsId");


--
-- Name: IDX_3d8c7d5dc814c801b1075a100d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3d8c7d5dc814c801b1075a100d" ON public."chat-rooms_admins_users" USING btree ("usersId");


--
-- Name: IDX_512a2d0b091e14e85094b295d7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_512a2d0b091e14e85094b295d7" ON public."chat-rooms_muted_users_users" USING btree ("usersId");


--
-- Name: IDX_652058acde35292d8d9692a62e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_652058acde35292d8d9692a62e" ON public."chat-rooms_banned_users_users" USING btree ("usersId");


--
-- Name: IDX_6cc4059a8e8a95f7147a26cb59; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6cc4059a8e8a95f7147a26cb59" ON public."chat-rooms_users_users" USING btree ("chatRoomsId");


--
-- Name: IDX_7803d418aba8d9cd9466247c7a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7803d418aba8d9cd9466247c7a" ON public."chat-rooms_users_users" USING btree ("usersId");


--
-- Name: IDX_aa155ba4ecaae555c8cb4ba1fb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_aa155ba4ecaae555c8cb4ba1fb" ON public."chat-rooms_banned_users_users" USING btree ("chatRoomsId");


--
-- Name: IDX_e17666d5d6493f5969339abb1f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e17666d5d6493f5969339abb1f" ON public."chat-rooms_muted_users_users" USING btree ("chatRoomsId");


--
-- Name: messages FK_0fb1705612cf4af24c26d1a21eb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_0fb1705612cf4af24c26d1a21eb" FOREIGN KEY ("ownerUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat-messages FK_249982c5f0a72ab6dd09a31c23c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-messages"
    ADD CONSTRAINT "FK_249982c5f0a72ab6dd09a31c23c" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat-rooms_admins_users FK_2562e296712bff664e6927a9ad6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_admins_users"
    ADD CONSTRAINT "FK_2562e296712bff664e6927a9ad6" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat-rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat-rooms_admins_users FK_3d8c7d5dc814c801b1075a100d9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_admins_users"
    ADD CONSTRAINT "FK_3d8c7d5dc814c801b1075a100d9" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat-rooms_muted_users_users FK_512a2d0b091e14e85094b295d78; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_muted_users_users"
    ADD CONSTRAINT "FK_512a2d0b091e14e85094b295d78" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat-rooms_banned_users_users FK_652058acde35292d8d9692a62e5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_banned_users_users"
    ADD CONSTRAINT "FK_652058acde35292d8d9692a62e5" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat-rooms_users_users FK_6cc4059a8e8a95f7147a26cb59c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_users_users"
    ADD CONSTRAINT "FK_6cc4059a8e8a95f7147a26cb59c" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat-rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users-relation FK_718040c5303bad75d9908ee7fc0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
    ADD CONSTRAINT "FK_718040c5303bad75d9908ee7fc0" FOREIGN KEY ("userRelationId") REFERENCES public.users(id);


--
-- Name: chat-rooms_users_users FK_7803d418aba8d9cd9466247c7ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_users_users"
    ADD CONSTRAINT "FK_7803d418aba8d9cd9466247c7ad" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users-relation FK_8d141e88588d48afdbe8a7bb99c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."users-relation"
    ADD CONSTRAINT "FK_8d141e88588d48afdbe8a7bb99c" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: chat-messages FK_9a952a3345b5554f1f04bb066d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-messages"
    ADD CONSTRAINT "FK_9a952a3345b5554f1f04bb066d2" FOREIGN KEY ("roomId") REFERENCES public."chat-rooms"(id) ON DELETE CASCADE;


--
-- Name: messages FK_a0c2d1966be6c4ff33074b9f5d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_a0c2d1966be6c4ff33074b9f5d2" FOREIGN KEY ("destUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat-rooms_banned_users_users FK_aa155ba4ecaae555c8cb4ba1fb2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_banned_users_users"
    ADD CONSTRAINT "FK_aa155ba4ecaae555c8cb4ba1fb2" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat-rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat-rooms FK_df0593dbc3a47467284bc2fbc3b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms"
    ADD CONSTRAINT "FK_df0593dbc3a47467284bc2fbc3b" FOREIGN KEY ("ownerUserId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat-rooms_muted_users_users FK_e17666d5d6493f5969339abb1f4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."chat-rooms_muted_users_users"
    ADD CONSTRAINT "FK_e17666d5d6493f5969339abb1f4" FOREIGN KEY ("chatRoomsId") REFERENCES public."chat-rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

