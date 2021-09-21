SET storage_engine=InnoDB;
SET FOREIGN_KEY_CHECKS=1;

DROP DATABASE IF EXISTS registrogrest;
CREATE DATABASE IF NOT EXISTS registrogrest;
USE registrogrest;

DROP TABLE IF EXISTS partecipanti;
DROP TABLE IF EXISTS lavoratori;
DROP TABLE IF EXISTS programma;
DROP TABLE IF EXISTS servizi;
DROP TABLE IF EXISTS squadre;
DROP TABLE IF EXISTS utenti;
DROP TABLE IF EXISTS giorni;
DROP TABLE IF EXISTS ruoli;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS anni;

DROP FUNCTION IF EXISTS RINT;

CREATE FUNCTION RINT(vmin INT, vmax INT)
RETURNS INT
COMMENT 'Genera un intero casuale tra vmin e vmax inclusi'
RETURN FLOOR(vmin + RAND() * (vmax - vmin + 1));

CREATE TABLE utenti (
	ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	nome CHAR(32) NOT NULL,
	cognome CHAR(32) NOT NULL,
	PRIMARY KEY (ID)
);

CREATE TABLE servizi (
	nome CHAR(64) NOT NULL,
	PRIMARY KEY (nome)
);

CREATE TABLE anni (
	ID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	servizio CHAR(64) NOT NULL,
	anno SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (servizio)
		REFERENCES servizi(nome) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE ruoli (
	ID TINYINT NOT NULL,
	servizio CHAR(64) NOT NULL,
	livello TINYINT NOT NULL,
	PRIMARY KEY (ID, servizio, livello),
	FOREIGN KEY (servizio)
		REFERENCES servizi(nome) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE staff (
	ID INT UNSIGNED NOT NULL,
	nickname CHAR(20) NOT NULL,
	password CHAR(64) NOT NULL,
	ruolo TINYINT NOT NULL,
	PRIMARY KEY (ID, nickname), 
	FOREIGN KEY (ID)
		REFERENCES utenti(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (ruolo)
		REFERENCES ruoli(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

CREATE TABLE squadre (
	ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	nome CHAR(64) NOT NULL,
	anno SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (anno)
		REFERENCES anni(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

CREATE TABLE lavoratori (
	ID INT UNSIGNED NOT NULL,
	squadra INT UNSIGNED NOT NULL,
	anno SMALLINT UNSIGNED NOT NULL,
	ruolo TINYINT NOT NULL,
	PRIMARY KEY (ID),
    FOREIGN KEY (ID)
		REFERENCES utenti(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (squadra)
		REFERENCES squadre(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (ruolo)
		REFERENCES ruoli(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (anno)
		REFERENCES anni(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

CREATE TABLE partecipanti (
	ID INT UNSIGNED NOT NULL,
    squadra INT UNSIGNED NOT NULL,
	anno SMALLINT UNSIGNED NOT NULL,
	codice MEDIUMINT UNSIGNED NOT NULL,
	accompagnatore CHAR(64),
	PRIMARY KEY (ID),
    FOREIGN KEY (ID)
		REFERENCES utenti(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (squadra)
		REFERENCES squadre(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (anno)
		REFERENCES anni(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

CREATE TABLE programma (
	data DATE NOT NULL,
	descrizione TEXT,
	ID INT UNSIGNED NOT NULL,
	PRIMARY KEY (data),
	FOREIGN KEY (ID)
		REFERENCES utenti(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE giorni (
	data DATE NOT NULL,
	ID INT UNSIGNED NOT NULL,
	temperatura DOUBLE(2, 1),
	assente BIT(1) NOT NULL,
	motivo TEXT,
	PRIMARY KEY (data), 
    FOREIGN KEY (ID)
		REFERENCES utenti(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);