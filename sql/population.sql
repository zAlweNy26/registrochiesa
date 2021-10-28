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

-- INSERT DI PROVA :

INSERT INTO servizi(nome, descrizione) VALUES
("Doposcuola", "lol"), ("Grest", "idk"), ("Danza", "ahah"), ("Inglese", "meme"), 
("Jujitsu", "shit"), ("Calcio", "nigga"), ("Gita", "what");

INSERT INTO ruoli(ID, servizio, livello) VALUES (1, "Doposcuola", 1), (1, "Grest", 1), (2, "Grest", 1); -- DA COMPLETARE

INSERT INTO utenti(nome, cognome) VALUES ("Daniele", "Nicosia"), ("Vincenzo", "D'Angelo");

INSERT INTO anni(servizio, prezzo, dataInizio, dataFine) VALUES
("Doposcuola", 15, "2021-10-01", "2022-05-31"), 
("Grest", 10, "2022-06-01", "2022-08-31"), 
("Danza", 20, "2020-01-01", "2020-05-31");

INSERT INTO programma(pdata, descrizione, servizio) VALUES ("2021-10-01", "Cazzeggio", "Doposcuola"), ("2022-06-01", "Boh", "Grest");

INSERT INTO staff(ID, nickname, password, ruolo) VALUES (1, "alwe", SHA2("alwe", 256), 1), (2, "vinc", SHA2("dang", 256), 2);

-- DA AGGIUNGERE DOPO IN BASE AL UID

INSERT INTO squadre(nome, anno, capo) VALUES ("Boh", 1, 2), ("Lol", 2, 2);

INSERT INTO lavoratori(UID, squadra, anno) VALUES (2, 1, 2);

INSERT INTO partecipanti(UID, squadra, anno, accompagnatore) VALUES (1, NULL, 1, NULL), (1, 2, 2, NULL);

INSERT INTO giorni(gdata, UID, temperatura, assente, motivo, comportamento) VALUES
("2021-10-01", 1, 36.8, 0, NULL, 1), ("2022-06-01", 1, 38.2, 1, "Febbre", NULL);