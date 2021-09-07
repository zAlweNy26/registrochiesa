START TRANSACTION;

INSERT INTO persone(PID, Nome, Cognome) VALUES(1, 'Daniele', 'Nicosia');
INSERT INTO persone(PID, Nome, Cognome) VALUES(2, 'Bruno', 'Palermo');

INSERT INTO staff_grest(SGID, Nickname, Password) VALUES(1, 'alwe', 'alwe');
INSERT INTO staff_grest(SGID, Nickname, Password) VALUES(2, 'bruno', 'pale');

INSERT INTO squadre(SID, Nome) VALUES(1, 'Gay');

INSERT INTO animatori(AID, Squadra) VALUES(2, 1);

COMMIT;