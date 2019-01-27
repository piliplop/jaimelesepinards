CREATE TABLE public.admin_tokens (
    token text
);


ALTER TABLE public.admin_tokens OWNER TO jul;

CREATE TABLE public.authentification (
    password text
);


ALTER TABLE public.authentification OWNER TO jul;

CREATE TABLE public.commandes (
    id text NOT NULL,
    sos_type text,
    delivery_date text,
    delivery_hour text,
    delivery_adress text,
    additional_informations text,
    state text,
    decline_reason text,
    email text
);


ALTER TABLE public.commandes OWNER TO jul;

--
-- Name: commandes_cp; Type: TABLE; Schema: public; Owner: jul
--

CREATE TABLE public.commandes_cp (
    id text,
    sos_type text,
    delivery_date text,
    delivery_hour text,
    delivery_adress text,
    additional_informations text
);


ALTER TABLE public.commandes_cp OWNER TO jul;


--
-- Data for Name: authentification; Type: TABLE DATA; Schema: public; Owner: jul
--

COPY public.authentification (password) FROM stdin;
azerty
\.


--
-- Name: commandes commandes_pkey; Type: CONSTRAINT; Schema: public; Owner: jul
--

ALTER TABLE ONLY public.commandes
    ADD CONSTRAINT commandes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

