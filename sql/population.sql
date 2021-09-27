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

INSERT INTO anni(servizio, anno) VALUES("Doposcuola", YEAR(CURRENT_DATE())), ("Grest", 2022), ("Danza", 2020);

INSERT INTO ruoli(ID, servizio, livello) VALUES(1, "Doposcuola", 1), (1, "Grest", 1), (2, "Grest", 1);

INSERT INTO utenti(nome, cognome) VALUES("Daniele", "Nicosia"), ("Vincenzo", "D'Angelo");

INSERT INTO staff(ID, nickname, password, ruolo) VALUES(1, "alwe", SHA2("alwe", 256), 1), (2, "vinc", SHA2("dang", 256), 2);

INSERT INTO squadre(nome, anno) VALUES("Boh", 1), ("Lol", 2);

INSERT INTO lavoratori(ID, squadra, anno, ruolo) VALUES(2, 1, 2, 2);

INSERT INTO partecipanti(ID, squadra, anno, codice) VALUES(2, 1, 2, RINT(1000000, 9999999));

-- SELECT * FROM giorni WHERE DATE(Data) BETWEEN "YEAR-01-01" AND "YEAR-12-31" -- per prendere i valori di un anno del grest

COMMIT;