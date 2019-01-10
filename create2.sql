CREATE TABLE public.admin_tokens (
    token text
);


ALTER TABLE public.admin_tokens OWNER TO jul;

--
-- Name: authentification; Type: TABLE; Schema: public; Owner: jul
--

CREATE TABLE public.authentification (
    password text
);


ALTER TABLE public.authentification OWNER TO jul;

--
-- Name: commande_cp; Type: TABLE; Schema: public; Owner: jul
--

CREATE TABLE public.commande_cp (
    id text,
    delivery_date text,
    delivery_hour text,
    delivery_adress text,
    additional_informations text,
    sos_type text
);


ALTER TABLE public.commande_cp OWNER TO jul;

--
-- Name: commandes; Type: TABLE; Schema: public; Owner: jul
--

CREATE TABLE public.commandes (
    id text NOT NULL,
    sos_type text,
    delivery_date text,
    delivery_hour text,
    delivery_adress text,
    additional_informations text
);


ALTER TABLE public.commandes OWNER TO jul;