DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `Name` varchar(2048) NOT NULL,
  `Password` varchar(2048) DEFAULT NULL,
  `UserId` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `drawings`;
CREATE TABLE `drawings` (
  `DrawingId` int NOT NULL AUTO_INCREMENT,
  `Word` varchar(2048) NOT NULL,
  `Data` MEDIUMTEXT DEFAULT NULL,
  `UserId` int NOT NULL,
  `Valid` tinyint DEFAULT 0,
  PRIMARY KEY(`DrawingId`),
  FOREIGN KEY (`UserId`) REFERENCES `user`(`UserId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `HistoryId` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `DrawingId` int NOT NULL,
  `Result` int NOT NULL,
  `Timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(`HistoryId`),
  UNIQUE(`UserId`, `DrawingId`, `Result`),
  FOREIGN KEY (`UserId`) REFERENCES `user`(`UserId`) ON DELETE CASCADE, 
  FOREIGN KEY (`DrawingId`) REFERENCES `drawings`(`DrawingId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `scores`;
CREATE TABLE `scores` (
  `GuessScore` int DEFAULT NULL,
  `DrawScore` int DEFAULT NULL,
  `UserId` int NOT NULL,
  PRIMARY KEY(`UserId`),
  FOREIGN KEY (`UserId`) REFERENCES `user`(`UserId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `comments`; 
CREATE TABLE `comments` (
  `CommentId` int NOT NULL AUTO_INCREMENT,
  `DrawingId` int NOT NULL,
  `UserId` int NOT NULL,
  `Comment` varchar(4096) NOT NULL,
  `Timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(`CommentId`),
  FOREIGN KEY (`UserId`) REFERENCES `user`(`UserId`) ON DELETE CASCADE,
  FOREIGN KEY (`DrawingId`) REFERENCES `drawings`(`DrawingId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;  
