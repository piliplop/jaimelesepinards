
CREATE TABLE public.commandes (
    id text NOT NULL PRIMARY KEY,
    sos_type text, 
    delivery_date text,
    delivery_hour text,
    delivery_adress text,
    additional_informations text
);


ALTER TABLE public.commandes OWNER TO jul;