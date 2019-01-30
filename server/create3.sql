
drop table if exists admin_tokens;
drop table if exists authentification;
drop table if exists commandes;


CREATE TABLE public.admin_tokens (
    token text
);


ALTER TABLE public.admin_tokens OWNER TO jul;

--
-- Name: authentification; Type: TABLE; Schema: public; Owner: jul
--

CREATE TABLE public.authentification (
    hash text
);


ALTER TABLE public.authentification OWNER TO jul;

--
-- Name: commandes; Type: TABLE; Schema: public; Owner: jul
--

CREATE TABLE public.commandes (
    id text NOT NULL,
    sos_type text,
    amount numeric,
    delivery_hour text,
    delivery_adress text,
    additional_informations text,
    state text,
    decline_reason text,
    email text,
    phone text
);


ALTER TABLE public.commandes OWNER TO jul;

--
-- Name: commandes_cp; Type: TABLE; Schema: public; Owner: jul
--

--
-- Data for Name: authentification; Type: TABLE DATA; Schema: public; Owner: jul
--

COPY public.authentification (hash) FROM stdin;
55b229477763a5866b3a9463ca84b060a0fd60ab1cb4a21e99f629c170daf485
\.



--
-- Name: commandes commandes_pkey; Type: CONSTRAINT; Schema: public; Owner: jul
--

ALTER TABLE ONLY public.commandes
    ADD CONSTRAINT commandes_pkey PRIMARY KEY (id);