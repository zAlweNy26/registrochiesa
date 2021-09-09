START TRANSACTION;

INSERT INTO persone(PID, Nome, Cognome) VALUES(1, 'Daniele', 'Nicosia');
INSERT INTO persone(PID, Nome, Cognome) VALUES(2, 'Prova', 'Esempio');

INSERT INTO staff_grest(SGID, Nickname, Password) VALUES(1, 'alwe', SHA2('alwe', 256));
INSERT INTO staff_grest(SGID, Nickname, Password) VALUES(2, 'prova', SHA2('esempio', 256));

INSERT INTO squadre(SID, Nome) VALUES(1, 'Figo');

INSERT INTO animatori(AID, Squadra) VALUES(2, 1);

-- SELECT * FROM giorni WHERE DATE(data) BETWEEN 'YEAR-01-01' AND 'YEAR-12-31' -- per prendere i valori di un anno del grest

COMMIT;