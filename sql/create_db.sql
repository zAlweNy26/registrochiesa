-- create an empty database.
SET storage_engine=InnoDB;
SET FOREIGN_KEY_CHECKS=1;
CREATE DATABASE IF NOT EXISTS registrogrest;
USE registrogrest;

-- drop tables if they already exist
DROP TABLE IF EXISTS squadre;
DROP TABLE IF EXISTS bimbo;
DROP TABLE IF EXISTS persone;
DROP TABLE IF EXISTS animatori;
DROP TABLE IF EXISTS programma;
DROP TABLE IF EXISTS giorni;

-- create tables

CREATE TABLE persone (
	PID INT NOT NULL,
	Nome CHAR(20) NOT NULL,
	Cognome CHAR(20) NOT NULL,
	PRIMARY KEY (PID)
);

CREATE TABLE squadre (
	SID INT,
	Nome CHAR(50) NOT NULL,
	PRIMARY KEY (SID)
);

CREATE TABLE staff_grest (
	SGID INT NOT NULL, 
	Nickname CHAR(20) NOT NULL,
	Password CHAR(255) NOT NULL,
	PRIMARY KEY (SGID, Nickname), 
	FOREIGN KEY (SGID)
		REFERENCES persone(PID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

CREATE TABLE animatori (
	AID INT NOT NULL,
	Squadra INT NOT NULL,
	PRIMARY KEY (AID),
	FOREIGN KEY (Squadra)
		REFERENCES squadre(SID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (AID)
		REFERENCES persone(PID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE 
);

CREATE TABLE bimbi (
	BID INT,
    Squadra INT ,
	Accompagnatore CHAR(50) NOT NULL,
	PRIMARY KEY (BID),
    FOREIGN KEY (BID)
		REFERENCES persone(PID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (Squadra)
		REFERENCES squadre(SID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE programma (
	PID INT NOT NULL,
	DataP DATE NOT NULL,
	Descrizione VARCHAR(400) NOT NULL,
	Organizzatore CHAR(50) NOT NULL,
	PRIMARY KEY (PID)
);

CREATE TABLE giorni (
	DataG TIME,
	GID INT NOT NULL,
	Temperatura INT,
	Assente BIT NOT NULL,
	MotivoAssenza VARCHAR(400),
	PRIMARY KEY (DataG), 
    FOREIGN KEY (GID)
		REFERENCES persone(PID) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
);