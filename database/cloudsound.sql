-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (x86_64)
--
-- Host: localhost    Database: cloudsound
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Addresses`
--

DROP TABLE IF EXISTS `Addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Addresses` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nUserID` int NOT NULL,
  `vchAddress1` varchar(45) DEFAULT NULL,
  `vchAddress2` varchar(45) DEFAULT NULL,
  `vchCity` varchar(45) DEFAULT NULL,
  `nStateID` int DEFAULT NULL,
  `vchZIP` varchar(45) DEFAULT NULL,
  `nCountryID` int NOT NULL,
  `bIsActive` int NOT NULL DEFAULT '0',
  `bIsDeleted` int NOT NULL DEFAULT '0',
  `bUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `bInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`),
  UNIQUE KEY `ID_UNIQUE` (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Addresses`
--

LOCK TABLES `Addresses` WRITE;
/*!40000 ALTER TABLE `Addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `Addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CCInfo`
--

DROP TABLE IF EXISTS `CCInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CCInfo` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nUserID` int NOT NULL,
  `nCCType` int NOT NULL,
  `vchCCNumber` varchar(45) NOT NULL,
  `vchCCExp` varchar(45) NOT NULL,
  `vchCCV` varchar(45) NOT NULL,
  `bIsPreferred` int DEFAULT '0',
  `bIsDeleted` int DEFAULT '0',
  `dtLastUpdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CCInfo`
--

LOCK TABLES `CCInfo` WRITE;
/*!40000 ALTER TABLE `CCInfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `CCInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CCTypes`
--

DROP TABLE IF EXISTS `CCTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CCTypes` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `vchName` varchar(45) NOT NULL,
  `vchIconPath` varchar(45) DEFAULT NULL,
  `bIsDeleted` int DEFAULT '0',
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CCTypes`
--

LOCK TABLES `CCTypes` WRITE;
/*!40000 ALTER TABLE `CCTypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `CCTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Countries`
--

DROP TABLE IF EXISTS `Countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Countries` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `vchCountryName` varchar(45) NOT NULL,
  `vchCountryAbbr` varchar(45) DEFAULT NULL,
  `bPriority` int DEFAULT '0',
  `bIsDeleted` int NOT NULL DEFAULT '0',
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Countries`
--

LOCK TABLES `Countries` WRITE;
/*!40000 ALTER TABLE `Countries` DISABLE KEYS */;
INSERT INTO `Countries` VALUES (1,'United States','USA',1,0,'2024-03-14 16:39:19','2024-03-14 16:39:19');
/*!40000 ALTER TABLE `Countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Followers`
--

DROP TABLE IF EXISTS `Followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Followers` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nUserID` int DEFAULT NULL,
  `nFollowingID` int DEFAULT NULL,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Followers`
--

LOCK TABLES `Followers` WRITE;
/*!40000 ALTER TABLE `Followers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Followers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItems`
--

DROP TABLE IF EXISTS `OrderItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItems` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nProductID` int NOT NULL,
  `nQuantity` int NOT NULL DEFAULT '1',
  `fPrice` float DEFAULT NULL,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItems`
--

LOCK TABLES `OrderItems` WRITE;
/*!40000 ALTER TABLE `OrderItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nUserID` int DEFAULT NULL,
  `nItemCount` int DEFAULT NULL,
  `fCostTotal` float DEFAULT NULL,
  `fTaxTotal` float DEFAULT NULL,
  `fShippingTotal` float DEFAULT NULL,
  `fGrandTotal` float DEFAULT NULL,
  `bIsPaid` int DEFAULT '0',
  `nCCInfoID` int DEFAULT NULL,
  `nShippingAddressID` int DEFAULT NULL,
  `nBillingAddressID` int DEFAULT NULL,
  `bIsShipped` int DEFAULT '0',
  `bIsCanceled` int DEFAULT '0',
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nStoreID` int DEFAULT NULL,
  `vchName` varchar(255) DEFAULT NULL,
  `txtDescription` text,
  `fPrice` float DEFAULT NULL,
  `nInventory` int DEFAULT NULL,
  `vchImagePath` varchar(255) DEFAULT NULL,
  `bIsDeleted` int DEFAULT '0',
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `States`
--

DROP TABLE IF EXISTS `States`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `States` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `vchStateName` varchar(45) NOT NULL,
  `vchStateAbbr` varchar(45) NOT NULL,
  `fTaxRate` float DEFAULT NULL,
  `bIsDeleted` int DEFAULT '0',
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `States`
--

LOCK TABLES `States` WRITE;
/*!40000 ALTER TABLE `States` DISABLE KEYS */;
INSERT INTO `States` VALUES (1,'Alabama','AL',0.04,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(2,'Alaska','AK',0,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(3,'Arizona','AZ',0.056,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(4,'Arkansas','AR',0.065,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(5,'California','CA',0.0725,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(6,'Colorado','CO',0.029,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(7,'Connecticut','CT',0.0635,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(8,'Delaware','DE',0,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(9,'Florida','FL',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(10,'Georgia','GA',0.04,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(11,'Hawaii','HI',0.04,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(12,'Idaho','ID',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(13,'Illinois','IL',0.0625,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(14,'Indiana','IN',0.07,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(15,'Iowa','IO',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(16,'Kansas','KS',0.065,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(17,'Kentucky','KY',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(18,'Louisiana','LA',0.0445,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(19,'Maine','ME',0.055,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(20,'Maryland','MD',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(21,'Massachusetts','MA',0.0625,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(22,'Michigan','MI',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(23,'Minnesota','MN',0.0688,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(24,'Mississippi','MS',0.07,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(25,'Missouri','MO',0.0423,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(26,'Montana','MT',0,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(27,'Nebraska','NB',0.055,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(28,'Nevada','NV',0.0685,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(29,'New Hampshire','NH',0,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(30,'New Jersey','NJ',0.0663,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(31,'New Mexico','NM',0.0488,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(32,'New York','NY',0.04,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(33,'North Carolina','NC',0.0475,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(34,'North Dakota','ND',0.05,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(35,'Ohio','OH',0.0575,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(36,'Oklahoma','OK',0.045,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(37,'Oregon','OR',0,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(38,'Pennsylvania','PA',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(39,'Rhode Island','RI',0.07,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(40,'South Carolina','SC',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(41,'South Dakota','SD',0.042,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(42,'Tennessee','TN',0.07,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(43,'Texas','TX',625,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(44,'Utah','UT',0.061,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(45,'Vermont','VT',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(46,'Virginia','VA',0.053,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(47,'Washington','WA',0.065,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(48,'West Virginia','WV',0.06,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(49,'Wisconsin','WI',0.05,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(50,'Wyoming','WY',0.04,0,'2024-03-14 16:49:23','2024-03-14 16:49:23'),(51,'District of Columbia','DC',0.06,0,'2024-03-14 16:59:25','2024-03-14 16:59:25');
/*!40000 ALTER TABLE `States` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StoreFollowers`
--

DROP TABLE IF EXISTS `StoreFollowers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StoreFollowers` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nUserID` int DEFAULT NULL,
  `nStoreID` int DEFAULT NULL,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StoreFollowers`
--

LOCK TABLES `StoreFollowers` WRITE;
/*!40000 ALTER TABLE `StoreFollowers` DISABLE KEYS */;
/*!40000 ALTER TABLE `StoreFollowers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Storefronts`
--

DROP TABLE IF EXISTS `Storefronts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Storefronts` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `vchStoreName` varchar(255) DEFAULT NULL,
  `nUserID` int DEFAULT NULL,
  `txtDescription` text,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` varchar(45) DEFAULT 'CURRENT_TIMESTAMP',
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Storefronts`
--

LOCK TABLES `Storefronts` WRITE;
/*!40000 ALTER TABLE `Storefronts` DISABLE KEYS */;
/*!40000 ALTER TABLE `Storefronts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tracks`
--

DROP TABLE IF EXISTS `Tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tracks` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `nAuthorID` int DEFAULT NULL,
  `vchTitle` varchar(255) DEFAULT NULL,
  `vchDescription` varchar(255) DEFAULT NULL,
  `vchAudioURL` varchar(255) DEFAULT NULL,
  `vchImagePath` varchar(255) DEFAULT NULL,
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tracks`
--

LOCK TABLES `Tracks` WRITE;
/*!40000 ALTER TABLE `Tracks` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `vchUsername` varchar(45) NOT NULL,
  `vchPassword` varchar(45) NOT NULL,
  `dtLastLogin` datetime DEFAULT NULL,
  `vchFirstName` varchar(45) DEFAULT NULL,
  `vchLastName` varchar(45) DEFAULT NULL,
  `vchNickname` varchar(45) DEFAULT NULL,
  `vchEmail` varchar(45) DEFAULT NULL,
  `bIsVerified` int DEFAULT '0',
  `vchBio` text,
  `vchProfilePicPath` varchar(255) DEFAULT NULL,
  `nShippingAddressID` int DEFAULT NULL,
  `nBillingAddressID` int DEFAULT NULL,
  `bIsBanned` int DEFAULT '0',
  `dtUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `dtInsertDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-16 19:20:46
