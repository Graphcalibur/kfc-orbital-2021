-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: localhost    Database: testdb
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `code_snippet`
--

DROP TABLE IF EXISTS `code_snippet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code_snippet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_snippet`
--

LOCK TABLES `code_snippet` WRITE;
/*!40000 ALTER TABLE `code_snippet` DISABLE KEYS */;
INSERT INTO `code_snippet` VALUES (1,'C++','for (int i = 0; i < 10; ++i)\n    cout << i << endl;\n}'),(2,'Python','for i in range(10):\n    print(\"number\", i)\n    print(\"number squared\": i ** 2)');
/*!40000 ALTER TABLE `code_snippet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `score`
--

DROP TABLE IF EXISTS `score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `score` (
  `playid` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `snippetid` int NOT NULL,
  `speed` int NOT NULL,
  `accuracy` decimal(10,5) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `context` enum('Solo','Multiplayer') NOT NULL DEFAULT 'Solo',
  PRIMARY KEY (`playid`),
  UNIQUE KEY `playid_UNIQUE` (`playid`),
  KEY `fk_userid_idx` (`userid`),
  KEY `fk_snippetid_idx` (`snippetid`),
  CONSTRAINT `fk__scores__code_snippet` FOREIGN KEY (`snippetid`) REFERENCES `code_snippet` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk__scores__user` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `score`
--

LOCK TABLES `score` WRITE;
/*!40000 ALTER TABLE `score` DISABLE KEYS */;
INSERT INTO `score` VALUES (1,NULL,2,100,97.21000,'2021-06-04 13:25:44','Solo'),(2,1,1,84,96.40000,'2021-06-03 13:13:07','Solo'),(3,1,2,66,99.23000,'2021-06-07 20:45:57','Solo'),(4,1,2,68,98.24000,'2021-06-07 21:01:55','Solo'),(5,1,2,78,98.82000,'2021-06-09 21:09:55','Solo'),(6,NULL,2,82,99.85000,'2021-06-09 21:11:43','Solo'),(7,1,2,80,97.05000,'2021-06-09 21:12:10','Solo');
/*!40000 ALTER TABLE `score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'abacaba123'),(2,'abacaba1234'),(3,'testuser');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_password`
--

DROP TABLE IF EXISTS `user_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_password` (
  `userid` int NOT NULL,
  `password_hash` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `userid_UNIQUE` (`userid`),
  CONSTRAINT `fk_userid` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_password`
--

LOCK TABLES `user_password` WRITE;
/*!40000 ALTER TABLE `user_password` DISABLE KEYS */;
INSERT INTO `user_password` VALUES (1,'$argon2i$v=19$m=4096,t=3,p=1$xab4nXTRrjj4rI8h7ZFwrg$ppi7zEuNI+O1tHYWaa+y2y2jrNkH1JtI/7u7YurBcbs'),(2,'$argon2i$v=19$m=4096,t=3,p=1$UdWdK3H9Sr9X1CETg45dRw$qLRYoWt73giHe8wz1PtgszC8JKKgt0iXBZKK5GF2E6c'),(3,'$argon2i$v=19$m=4096,t=3,p=1$rsOluG4gtCjam9y5EykaKw$0wYIvD2YSW+5mJc5H5WH/WjZuuPkJ+hBmZ4o9Mrr7Qw');
/*!40000 ALTER TABLE `user_password` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-09 21:13:00
