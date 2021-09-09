START TRANSACTION;

INSERT INTO persone(Nome, Cognome) VALUES('Daniele', 'Nicosia');
INSERT INTO persone(Nome, Cognome) VALUES('Prova', 'Esempio');

INSERT INTO staff_grest(SGID, Nickname, Password) VALUES(1, 'alwe', SHA2('alwe', 256));
INSERT INTO staff_grest(SGID, Nickname, Password) VALUES(2, 'prova', SHA2('esempio', 256));

INSERT INTO squadre(Nome, Anno) VALUES('Boh', YEAR(CURRENT_DATE()));

INSERT INTO animatori(AID, Squadra, Anno) VALUES(2, 1, YEAR(CURRENT_DATE()));

-- SELECT * FROM giorni WHERE DATE(Data) BETWEEN 'YEAR-01-01' AND 'YEAR-12-31' -- per prendere i valori di un anno del grest

COMMIT;