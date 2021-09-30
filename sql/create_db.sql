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
DROP TRIGGER IF EXISTS addUID;

CREATE FUNCTION RINT(vmin INT, vmax INT)
RETURNS INT
COMMENT 'Genera un intero casuale tra vmin e vmax inclusi'
RETURN FLOOR(vmin + RAND() * (vmax - vmin + 1));

CREATE TABLE utenti (
	ID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	UID MEDIUMINT UNSIGNED NOT NULL,
	nome VARCHAR(32) NOT NULL,
	cognome VARCHAR(32) NOT NULL,
	PRIMARY KEY (ID, UID)
);

CREATE TRIGGER addUID BEFORE INSERT ON utenti FOR EACH ROW SET NEW.UID = RINT(1000000, 9999999);

CREATE TABLE servizi (
	nome VARCHAR(64) NOT NULL,
	PRIMARY KEY (nome)
);

CREATE TABLE anni (
	ID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	servizio VARCHAR(64) NOT NULL,
	anno SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (servizio)
		REFERENCES servizi(nome) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE ruoli (
	ID TINYINT NOT NULL,
	servizio VARCHAR(64) NOT NULL,
	livello TINYINT NOT NULL,
	PRIMARY KEY (ID, servizio, livello),
	FOREIGN KEY (servizio)
		REFERENCES servizi(nome) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE staff (
	ID INT UNSIGNED NOT NULL,
	nickname VARCHAR(20) NOT NULL,
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
	nome VARCHAR(64) NOT NULL,
	anno SMALLINT UNSIGNED NOT NULL,
	capo INT UNSIGNED NOT NULL
	PRIMARY KEY (ID),
	FOREIGN KEY (anno)
		REFERENCES anni(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (capo)
		REFERENCES utenti(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

CREATE TABLE lavoratori (
	ID INT UNSIGNED NOT NULL,
	squadra INT UNSIGNED,
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
	anno SMALLINT UNSIGNED NOT NULL,
    squadra INT UNSIGNED,
	accompagnatore VARCHAR(64),
	PRIMARY KEY (ID, anno),
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
	pdata DATE NOT NULL,
	descrizione TEXT,
	servizio VARCHAR(64) NOT NULL,
	PRIMARY KEY (pdata, servizio),
	FOREIGN KEY (servizio)
		REFERENCES servizi(nome) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE giorni (
	gdata DATE NOT NULL,
	ID INT UNSIGNED NOT NULL,
	temperatura DOUBLE,
	assente BIT(1) NOT NULL,
	motivo TEXT,
	comportamento BIT(1),
	PRIMARY KEY (gdata), 
    FOREIGN KEY (ID)
		REFERENCES utenti(ID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);