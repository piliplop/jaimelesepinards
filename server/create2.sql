drop table if exists public.admin_tokens;
CREATE TABLE public.admin_tokens (
    token text
);


ALTER TABLE public.admin_tokens OWNER TO jul;

--
-- Name: authentification; Type: TABLE; Schema: public; Owner: jul
drop table if exists public.authentification;

CREATE TABLE public.authentification (
    hash text
);

insert into public.authentification values ('cd5e840e54759ff5d67510e99342709e97e35b5df0dd9654095f83cd0ccb1c22');


ALTER TABLE public.authentification OWNER TO jul;

--
-- Name: commandes; Type: TABLE; Schema: public; Owner: jul
drop table if exists public.commandes;

CREATE TABLE public.commandes (
    id text NOT NULL,
    sos_type text,
    amount numeric,
    delivery_hour text,
    delivery_adress text,
    additional_informations text,
    state text,
    decline_reason text,
    email text
);


ALTER TABLE public.commandes OWNER TO jul;

--
-- Name: commandes commandes_pkey; Type: CONSTRAINT; Schema: public; Owner: jul
--

ALTER TABLE ONLY public.commandes
    ADD CONSTRAINT commandes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

