
drop table if exists admin_tokens;
drop table if exists authentification;
drop table if exists commandes;
drop table if exists sos_types;


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
    phone text,
    last_modif_qg text,
    ip text
);

ALTER TABLE public.commandes OWNER TO jul;

create table public.sos_types (
    name text,
    short_name text,
    cost float default 0
);

alter table public.sos_types owner to jul;

insert into sos_types values ('Repas d''aventurier (wrap chili con carne)', 'Repas d''aventurier', 3);
insert into sos_types values ('Koh''cktail de Denis', '', 2.5);
insert into sos_types values ('Crêpes (préciser nature/pâte à tartiner/sucre dans "Informations complémentaires")', 'Crêpes', 0);
insert into sos_types values ('Pâtes pesto', '', 0);
insert into sos_types values ('Croques', '', 0);
insert into sos_types values ('Petit déj (commander la veille)', 'Petit déj', 0);
insert into sos_types values ('Café', '', 0);
insert into sos_types values ('Chocolat', '', 0);
insert into sos_types values ('Thé', '', 0);
insert into sos_types values ('Koh''rée', '', 0);
insert into sos_types values ('Break danse', '', 0);
insert into sos_types values ('Intégrale Koh-lanta', '', 0);
insert into sos_types values ('Karaoké', '', 0);
insert into sos_types values ('Kohnsultation psykohlogique', '', 0);
insert into sos_types values ('Ballons rigolos', '', 0);
insert into sos_types values ('Koh''sh Remise en forme', '', 0);
insert into sos_types values ('Beauté des îles', '', 0);
insert into sos_types values ('Koh''affeur', '', 0);
insert into sos_types values ('Strip poker', '', 0);
insert into sos_types values ('Koh''loc en danger', '', 0);
insert into sos_types values ('Koh''baye', '', 0);
insert into sos_types values ('Koh''mdom', '', 0);
insert into sos_types values ('Aventure surprise ?', '', 0);
insert into sos_types values ('Massage', '', 0);
insert into sos_types values ('Vaisselle', '', 0);
insert into sos_types values ('Ménage', '', 0);
insert into sos_types values ('Taxi', '', 0);
insert into sos_types values ('Koh''ourses', '', 0);
insert into sos_types values ('Livraison', '', 0);
insert into sos_types values ('Aide au transport dans les couloirs de l''imag', 'Aide au transport', 0);
insert into sos_types values ('Poppers', '', 0);

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