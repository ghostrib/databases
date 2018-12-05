CREATE DATABASE chat;
USE chat;

CREATE TABLE users (
  userID INT NOT NULL AUTO_INCREMENT,
  username TEXT,
  PRIMARY KEY ( userID )
);

CREATE TABLE chatroom   (
  roomID INT NOT NULL AUTO_INCREMENT,
  room TEXT,
  PRIMARY KEY ( roomID )
);

CREATE TABLE messages (
  roomID INT NOT NULL,
  userID INT NOT NULL,
  msg TEXT,
  created_at DATE,
  messageID INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (messageID)
  -- FOREIGN KEY (roomID) REFERENCES chatroom(roomID),
  -- FOREIGN KEY (userID) REFERENCES users(userID)
);


/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

