-- -------------------------------------------------------------
-- TablePlus 4.5.0(396)
--
-- https://tableplus.com/
--
-- Database: classroom_manager
-- Generation Time: 2021-12-01 21:20:10.0670
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `class` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `creation_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
  `modification_time` datetime DEFAULT NULL COMMENT 'Update Time',
  `classname` varchar(255) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `grade` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `creation_time` datetime DEFAULT NULL COMMENT 'Create Time',
  `modification_time` datetime DEFAULT NULL COMMENT 'Update Time',
  `name` varchar(255) NOT NULL,
  `point` int NOT NULL,
  `id_class` int NOT NULL,
  `stt` int NOT NULL,
  `deadline` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `membership` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `id_user` int NOT NULL,
  `id_class` int NOT NULL,
  `role_member` int NOT NULL,
  `creation_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modification_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_class` (`id_class`),
  CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rfToken` varchar(255) DEFAULT NULL,
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `modification_time` datetime DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `studentid` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

INSERT INTO `class` (`id`, `creation_time`, `modification_time`, `classname`, `code`, `img`) VALUES
(1, '2021-11-20 16:39:32', '2021-11-20 16:39:32', 'PTUDWNC', 'sdssd34', NULL),
(3, '2021-11-22 15:30:42', NULL, 'PTUDWeb', 'sd34dfg', NULL);

INSERT INTO `grade` (`id`, `creation_time`, `modification_time`, `name`, `point`, `id_class`, `stt`, `deadline`) VALUES
(34, NULL, NULL, 'Giữa kì', 2, 1, 1, '2021-12-02 20:28:09'),
(35, NULL, NULL, 'Cuối kì', 5, 1, 2, '2021-12-03 20:27:41');

INSERT INTO `membership` (`id`, `id_user`, `id_class`, `role_member`, `creation_time`, `modification_time`) VALUES
(1, 1, 1, 1, '2021-11-20 16:43:55', '2021-11-20 16:43:57'),
(3, 5, 1, 2, '2021-11-24 11:34:02', '2021-11-24 11:34:05');

INSERT INTO `user` (`id`, `username`, `password`, `fullname`, `email`, `rfToken`, `creation_time`, `modification_time`, `avatar`, `studentid`) VALUES
(1, 'admin', '$2a$10$vsKeNent1I7DwHMInoDm/.hjr2rz8NXCxHgKsHhSUfqJyFPslCxFa', 'Administrat', 'nguyenhuuduynvc@gmail.com', '5LJawFe4HmtE5Ymw99vRzjxKbklZhUbs', NULL, NULL, NULL, ''),
(5, 'huuduynvc2', '$2a$10$Zi4uK5354zhODVEEAJoUxuvFweNwk9W9Yylg5VR0Loiy..RhIgO2e', 'Nguyen Van Dien', 'huuduynvc14@gmail.com', 'IHUzUpUlS6XIQdJM8qXRXMTJzB19MO0u', '2021-11-24 11:33:38', NULL, NULL, '41'),
(6, 'huuduynvc3', '$2a$10$NpFN3PLJToVHxTcNH9vsbeU12rLzzUdmuWfKnRwjkxaJ3SKRjAIHq', 'Nguyen Van Dien', 'huuduynvc15@gmail.com', NULL, '2021-11-24 20:53:57', NULL, NULL, NULL),
(7, 'huuduynvc5', '$2a$10$6F3tf1dwUVtL1PNdU5kUOO5s.6BalTgJ4qfjf.5RV/.poB2YNd2Kq', 'nguyen van tu', 'nguyenhu@gmail.com', NULL, '2021-11-24 21:03:35', NULL, NULL, '1712333'),
(9, 'huuduynvc6', '$2a$10$7vYOyLkVLxoByEEPd4SFRe7MQlNu8Rp6JEddJ.5snRtQPU6MV.qka', 'nguyen van tu', 'nguyenhu22222@gmail.com', NULL, '2021-11-24 21:15:30', NULL, NULL, '1712333'),
(10, 'huuduynvc7', '$2a$10$XMc.tKaUuoM4lOFuInidROslex6o6c6Owyx3Sp4he4J8cUBadb6ge', 'nguyen van ttt', 'nguyen@gmail.com', NULL, '2021-11-24 21:16:27', NULL, NULL, '17282828');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;