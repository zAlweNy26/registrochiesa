START TRANSACTION;

DELETE FROM utenti;
DELETE FROM staff;
DELETE FROM squadre;
DELETE FROM lavoratori;
DELETE FROM ruoli;

INSERT INTO ruoli(servizio, livello) VALUES("Tutto", 1), ("Grest", 1);

INSERT INTO utenti(Nome, Cognome) VALUES("Daniele", "Nicosia"), ("Vincenzo", "D'Angelo");

INSERT INTO staff(SID, Nickname, Password, ruolo) VALUES(1, "alwe", SHA2("alwe", 256), 1), (2, "vinc", SHA2("dang", 256), 2);

INSERT INTO squadre(Nome, Anno) VALUES("Boh", YEAR(CURRENT_DATE())), ("Lol", 2020);

INSERT INTO lavoratori(LID, Squadra, Anno, ruolo) VALUES(2, 1, YEAR(CURRENT_DATE()), 2);

-- SELECT * FROM giorni WHERE DATE(Data) BETWEEN "YEAR-01-01" AND "YEAR-12-31" -- per prendere i valori di un anno del grest

COMMIT;