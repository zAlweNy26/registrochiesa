START TRANSACTION;

DELETE FROM partecipanti;
DELETE FROM lavoratori;
DELETE FROM programma;
DELETE FROM servizi;
DELETE FROM squadre;
DELETE FROM utenti;
DELETE FROM giorni;
DELETE FROM ruoli;
DELETE FROM staff;
DELETE FROM anni;

INSERT INTO servizi(nome) VALUES("Doposcuola"), ("Grest"), ("Danza"), ("Inglese"), ("Jujitsu"), ("Calcio");

INSERT INTO ruoli(ID, servizio, livello) VALUES(1, "Doposcuola", 1), (1, "Grest", 1), (2, "Grest", 1); -- DA COMPLETARE

-- INSERT DI PROVA :

INSERT INTO utenti(nome, cognome) VALUES("Daniele", "Nicosia"), ("Vincenzo", "D'Angelo");

INSERT INTO staff(ID, nickname, password, ruolo) VALUES(1, "alwe", SHA2("alwe", 256), 1), (2, "vinc", SHA2("dang", 256), 2);

INSERT INTO anni(servizio, anno) VALUES("Doposcuola", YEAR(CURRENT_DATE())), ("Grest", 2022), ("Danza", 2020);

INSERT INTO squadre(nome, anno, capo) VALUES("Boh", 1, 2), ("Lol", 2, 2);

INSERT INTO lavoratori(ID, squadra, anno, ruolo) VALUES(2, 1, 2, 2);

INSERT INTO partecipanti(ID, squadra, anno, accompagnatore) VALUES(1, NULL, 1, NULL), (1, 2, 2, NULL);

INSERT INTO giorni(gdata, ID, temperatura, assente, motivo, comportamento) VALUES("2021-01-01", 1, 36.8, 0, NULL, 1), VALUES("2022-01-01", 1, 38.2, 1, "Febbre", NULL);

INSERT INTO programma(pdata, descrizione, servizio) VALUES("2021-01-01", "Cazzeggio", "Doposcuola"), ("2022-01-01", "Boh", "Grest");

-- SELECT DI PROVA :

-- Prende servizio e anno dal value del dropdown menu (ovvero gli ID dei vari anni a cui ha partecipato l'utente)
-- SELECT * FROM anni WHERE ID = ?;

-- Controllare se servizio = Grest
-- Se sì : prende nome squadra e capo squadra con la query
-- SELECT nome, capo FROM squadre WHERE ID = ?;
-- Se no : non fare nulla

-- Prende valori da giorni e programma nell'arco di due date per uno specifico utente
-- SELECT * FROM programma INNER JOIN giorni ON pdata BETWEEN "YEAR-01-01" AND "YEAR-12-31" AND pdata = gdata AND ID = ?;

COMMIT;