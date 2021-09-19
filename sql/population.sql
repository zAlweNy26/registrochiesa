START TRANSACTION;

DELETE FROM utenti;
DELETE FROM staff;
DELETE FROM squadre;
DELETE FROM lavoratori;
DELETE FROM ruoli;
DELETE FROM partecipanti;

INSERT INTO ruoli(servizio, livello) VALUES("Tutto", 1), ("Grest", 1);

INSERT INTO utenti(Nome, Cognome) VALUES("Daniele", "Nicosia"), ("Vincenzo", "D'Angelo");

INSERT INTO staff(ID, Nickname, Password, ruolo) VALUES(1, "alwe", SHA2("alwe", 256), 1), (2, "vinc", SHA2("dang", 256), 2);

INSERT INTO squadre(Nome, Anno) VALUES("Boh", YEAR(CURRENT_DATE())), ("Lol", 2020);

INSERT INTO lavoratori(ID, Squadra, Anno, ruolo) VALUES(2, 1, YEAR(CURRENT_DATE()), 2);

INSERT INTO partecipanti(ID, Squadra, Anno, UUID) VALUES(2, 1, YEAR(CURRENT_DATE()), RINT(1, 65535));

-- SELECT * FROM giorni WHERE DATE(Data) BETWEEN "YEAR-01-01" AND "YEAR-12-31" -- per prendere i valori di un anno del grest

COMMIT;