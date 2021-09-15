START TRANSACTION;

INSERT INTO utenti(Nome, Cognome) VALUES("Daniele", "Nicosia");
INSERT INTO utenti(Nome, Cognome) VALUES("Vincenzo", "D'Angelo");

INSERT INTO staff(SID, Nickname, Password, PL) VALUES(1, "alwe", SHA2("alwe", 256), 1);
INSERT INTO staff(SID, Nickname, Password, PL) VALUES(2, "vinc", SHA2("dang", 256), 2);

INSERT INTO squadre(Nome, Anno) VALUES("Boh", YEAR(CURRENT_DATE()));
INSERT INTO squadre(Nome, Anno) VALUES("Lol", 2020);

INSERT INTO lavoratori(LID, Squadra, Anno, Occupazione) VALUES(2, 1, YEAR(CURRENT_DATE()), 1);

-- SELECT * FROM giorni WHERE DATE(Data) BETWEEN "YEAR-01-01" AND "YEAR-12-31" -- per prendere i valori di un anno del grest

COMMIT;