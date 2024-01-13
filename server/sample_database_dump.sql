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
-- Table structure for table code_snippet
--

DROP TABLE IF EXISTS code_snippet CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE code_snippet (
  id serial NOT NULL,
  language varchar(20) NOT NULL,
  code varchar(2000) NOT NULL,
  PRIMARY KEY (id)
);
ALTER SEQUENCE code_snippet_id_seq RESTART WITH 3;
/*!40101 SET character_set_client = @saved_cs_client */

--
-- Dumping data for table code_snippet
--

/*!40000 ALTER TABLE code_snippet DISABLE KEYS */
INSERT INTO code_snippet VALUES (1,'C++','for (int i = 0; i < 10; ++i) {\n    cout << i << endl;\n}'),(2,'Python','for i in range(10):\n    print("number", i)\n    print("number squared": i ** 2)');
/*!40000 ALTER TABLE code_snippet ENABLE KEYS */

--
-- Table structure for table permission
--

DROP TABLE IF EXISTS permission CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE permission (
  id serial NOT NULL,
  permission_name varchar(45) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT permission_name_UNIQUE UNIQUE (permission_name)
);
ALTER SEQUENCE permission_id_seq RESTART WITH 2;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table permission
--

/*!40000 ALTER TABLE permission DISABLE KEYS */;
INSERT INTO permission VALUES (1,'upload-code');
/*!40000 ALTER TABLE permission ENABLE KEYS */;

--
-- Table structure for table role
--

DROP TABLE IF EXISTS role CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE role (
  id serial NOT NULL,
  role_name varchar(60) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT name_UNIQUE UNIQUE (role_name)
);
ALTER SEQUENCE role_id_seq RESTART WITH 2;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table role
--

/*!40000 ALTER TABLE role DISABLE KEYS */;
INSERT INTO role VALUES (1,'admin');
/*!40000 ALTER TABLE role ENABLE KEYS */;

--
-- Table structure for table role_permission
--

DROP TABLE IF EXISTS role_permission CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE role_permission (
  id serial NOT NULL,
  role_id int NOT NULL,
  permission_id int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk__role_permission__permission FOREIGN KEY (permission_id) REFERENCES permission (id) ON DELETE CASCADE,
  CONSTRAINT fk__role_permission__role FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE
);
ALTER SEQUENCE role_permission_id_seq RESTART WITH 2;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table role_permission
--

/*!40000 ALTER TABLE role_permission DISABLE KEYS */;
INSERT INTO role_permission VALUES (1,1,1);
/*!40000 ALTER TABLE role_permission ENABLE KEYS */;

--
-- Table structure for table user
--

DROP TABLE IF EXISTS users CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE users (
  id serial,
  username varchar(45) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT id_UNIQUE UNIQUE (id)
);
ALTER SEQUENCE users_id_seq RESTART WITH 4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table user
--

/*!40000 ALTER TABLE user DISABLE KEYS */;
INSERT INTO users VALUES (1,'abacaba123'),(2,'abacaba1234'),(3,'testuser');
/*!40000 ALTER TABLE user ENABLE KEYS */;

--
-- Table structure for table user_password
--

DROP TABLE IF EXISTS user_password CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE user_password (
  userid int NOT NULL,
  password_hash varchar(200) NOT NULL,
  PRIMARY KEY (userid),
  CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table user_password
--

/*!40000 ALTER TABLE user_password DISABLE KEYS */;
INSERT INTO user_password VALUES (1,'$argon2i$v=19$m=4096,t=3,p=1$xab4nXTRrjj4rI8h7ZFwrg$ppi7zEuNI+O1tHYWaa+y2y2jrNkH1JtI/7u7YurBcbs'),(2,'$argon2i$v=19$m=4096,t=3,p=1$UdWdK3H9Sr9X1CETg45dRw$qLRYoWt73giHe8wz1PtgszC8JKKgt0iXBZKK5GF2E6c'),(3,'$argon2i$v=19$m=4096,t=3,p=1$rsOluG4gtCjam9y5EykaKw$0wYIvD2YSW+5mJc5H5WH/WjZuuPkJ+hBmZ4o9Mrr7Qw');
/*!40000 ALTER TABLE user_password ENABLE KEYS */;

--
-- Table structure for table user_role
--

DROP TABLE IF EXISTS user_role CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE user_role (
  id serial NOT NULL,
  user_id int NOT NULL,
  role_id int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk__user_role__role FOREIGN KEY (role_id) REFERENCES role (id),
  CONSTRAINT fk__user_role__user FOREIGN KEY (user_id) REFERENCES users (id)
);
ALTER SEQUENCE user_role_id_seq RESTART WITH 2;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table user_role
--

/*!40000 ALTER TABLE user_role DISABLE KEYS */;
INSERT INTO user_role VALUES (1,1,1);
/*!40000 ALTER TABLE user_role ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-13  2:12:08

--
-- Table structure for table score
--

DROP TYPE IF EXISTS context_type;
CREATE TYPE context_type AS ENUM('Solo', 'Multiplayer');

DROP TABLE IF EXISTS score CASCADE;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE score (
  playid serial NOT NULL,
  userid int DEFAULT NULL,
  snippetid int NOT NULL,
  speed int NOT NULL,
  accuracy decimal(10,5) NOT NULL,
  time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  context context_type NOT NULL DEFAULT 'Solo',
  PRIMARY KEY (playid),
  CONSTRAINT fk__scores__code_snippet FOREIGN KEY (snippetid) REFERENCES code_snippet (id) ON DELETE CASCADE,
  CONSTRAINT fk__scores__user FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE
);
ALTER SEQUENCE score_playid_seq RESTART WITH 12;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table score
--

/*!40000 ALTER TABLE score DISABLE KEYS */;
INSERT INTO score VALUES (1,NULL,2,100,97.21000,'2021-06-04 13:25:44','Solo'),(2,1,1,84,96.40000,'2021-06-03 13:13:07','Solo'),(3,1,2,66,99.23000,'2021-06-07 20:45:57','Solo'),(4,1,2,68,98.24000,'2021-06-07 21:01:55','Solo'),(5,1,2,78,98.82000,'2021-06-09 21:09:55','Solo'),(6,NULL,2,82,99.85000,'2021-06-09 21:11:43','Solo'),(7,1,2,80,97.05000,'2021-06-09 21:12:10','Solo'),(8,1,2,59,100.00000,'2021-06-28 19:36:57','Multiplayer'),(9,1,2,102,100.00000,'2021-07-06 19:38:29','Solo'),(10,1,1,49,100.00000,'2021-07-06 19:48:13','Multiplayer'),(11,1,1,48,100.00000,'2021-07-06 19:48:13','Multiplayer');
/*!40000 ALTER TABLE score ENABLE KEYS */;