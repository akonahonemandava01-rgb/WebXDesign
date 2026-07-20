-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: sep_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `application_documents`
--

DROP TABLE IF EXISTS `application_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage_path` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `idx_appdocs_application` (`application_id`),
  CONSTRAINT `fk_appdocs_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_documents`
--

LOCK TABLES `application_documents` WRITE;
/*!40000 ALTER TABLE `application_documents` DISABLE KEYS */;
INSERT INTO `application_documents` VALUES (1,1,NULL,'secure_cloud_buckets/cv/wits_2483921_cv.pdf','2026-07-12 02:57:17'),(2,1,NULL,'secure_cloud_buckets/transcripts/wits_2483921_academic_record.pdf','2026-07-12 02:57:17'),(3,2,NULL,'secure_cloud_buckets/cv/wits_2510492_portfolio.pdf','2026-07-12 02:57:17'),(4,5,'Cover Letter','1783901372868-687783064.pdf','2026-07-13 02:09:32');
/*!40000 ALTER TABLE `application_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `student_id` int NOT NULL,
  `application_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `applied_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `unique_student_job_app` (`student_id`,`job_id`),
  KEY `idx_applications_job` (`job_id`),
  KEY `idx_applications_student` (`student_id`),
  CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_applications_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,1,'Pending','2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,2,2,'Pending','2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,3,3,'Successful','2026-07-12 20:45:02','2026-07-12 20:56:56'),(5,2,3,'Pending','2026-07-13 01:39:05','2026-07-13 01:39:05'),(6,3,7,'Withdrawn','2026-07-15 21:00:21','2026-07-15 21:03:40');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `department_id` int NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  KEY `idx_course_department` (`department_id`),
  CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,1,'BSc(Eng) Electronic and Information Engineering','2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,2,'BSc in Computer Science','2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,3,'BCom in Information Systems','2026-07-12 02:57:17','2026-07-12 02:57:17');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`),
  KEY `idx_department_faculty` (`faculty_id`),
  CONSTRAINT `fk_department_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,1,'School of Electrical and Information Engineering','2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,2,'School of Computer Science and Applied Mathematics','2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,3,'School of Business Sciences','2026-07-12 02:57:17','2026-07-12 02:57:17');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employers`
--

DROP TABLE IF EXISTS `employers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employers` (
  `employer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `approval_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `approved_by_user_id` int DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approval_comments` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employer_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `registration_number` (`registration_number`),
  KEY `idx_employers_approved_by` (`approved_by_user_id`),
  CONSTRAINT `fk_employers_approved_by` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_employers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employers`
--

LOCK TABLES `employers` WRITE;
/*!40000 ALTER TABLE `employers` DISABLE KEYS */;
INSERT INTO `employers` VALUES (1,2,'Prospects South Africa','2018/492019/07','Approved',9,'2026-07-13 01:03:19',NULL,'2026-07-12 02:57:17','2026-07-13 01:03:19'),(2,3,'Johannesburg Tech Solutions','2022/883941/07','Approved',9,'2026-07-13 01:03:06',NULL,'2026-07-12 02:57:17','2026-07-13 01:03:06'),(3,6,'Test Co','123456789','Approved',9,'2026-07-12 19:31:43',NULL,'2026-07-12 03:01:15','2026-07-12 19:31:43'),(4,12,'amazon','REG123456','Approved',9,'2026-07-13 22:25:17','Verified By phone','2026-07-13 22:13:11','2026-07-13 22:25:17'),(5,13,'MTN','REG3256784','Approved',9,'2026-07-14 12:43:06','Verified by email','2026-07-14 12:31:08','2026-07-14 12:43:06'),(6,15,'Cell c','REG-XY-0Z','Pending',NULL,NULL,NULL,'2026-07-15 15:06:48','2026-07-15 15:06:48');
/*!40000 ALTER TABLE `employers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `faculty_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`faculty_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES (1,'Faculty of Engineering and the Built Environment','2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,'Faculty of Science','2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,'Faculty of Commerce, Law and Management','2026-07-12 02:57:17','2026-07-12 02:57:17');
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `employer_id` int NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employment_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `closing_date` datetime NOT NULL,
  `approval_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `approved_by_user_id` int DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approval_comments` text COLLATE utf8mb4_unicode_ci,
  `limited_faculty_id` int DEFAULT NULL,
  `limited_department_id` int DEFAULT NULL,
  `eligible_levels` json DEFAULT NULL,
  `citizenship_requirement` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Open',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  KEY `idx_jobs_employer` (`employer_id`),
  KEY `idx_jobs_approved_by` (`approved_by_user_id`),
  KEY `fk_jobs_limited_faculty` (`limited_faculty_id`),
  KEY `fk_jobs_limited_department` (`limited_department_id`),
  CONSTRAINT `fk_jobs_approved_by` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_jobs_employer` FOREIGN KEY (`employer_id`) REFERENCES `employers` (`employer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jobs_limited_department` FOREIGN KEY (`limited_department_id`) REFERENCES `department` (`department_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_jobs_limited_faculty` FOREIGN KEY (`limited_faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,'Junior Full-Stack Web Developer Intern','Looking for a final year Witsie to assist with Node.js and React app scaling integrations.','Braamfontein, JHB','Part-time',150.00,'2026-08-31 23:59:59','Approved',1,'2026-07-12 02:57:17','Hourly rate scales match institutional fair student labor criteria.',NULL,NULL,NULL,'Open',0,'2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,2,'Data Analyst Assistant','Python automation development tasks focusing on local business intelligence data migrations.','Remote (South Africa)','Internship',125.50,'2026-09-15 17:00:00','Approved',1,'2026-07-12 02:57:17','Remote compliance profile aligns perfectly with off-campus safety workflows.',NULL,NULL,NULL,'Open',0,'2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,3,'Desktop management','Looking for a student who\'ll help with the desktop management','Randburg','Part-time',110.00,'2026-10-31 00:00:00','Approved',9,'2026-07-12 20:36:04','The compensation better match the workload.',NULL,NULL,NULL,'Open',0,'2026-07-12 20:18:59','2026-07-12 20:36:04'),(4,4,'Junior Library Assistant','Support the librarian with routine tasks','William Cullen Library','Part-time',120.00,'2026-12-31 00:00:00','Approved',9,'2026-07-13 22:46:49','The compensation is fair for the role.',NULL,NULL,NULL,'Open',0,'2026-07-13 22:36:49','2026-07-13 22:46:49'),(5,5,'internship','Support the librarian with routine tasks','Randburg','Part-time',120.00,'2026-11-30 00:00:00','Pending',NULL,NULL,NULL,NULL,NULL,NULL,'Open',0,'2026-07-14 12:56:13','2026-07-14 12:56:13');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skill_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'JavaScript','2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,'Node.js','2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,'Express.js','2026-07-12 02:57:17','2026-07-12 02:57:17'),(4,'MySQL','2026-07-12 02:57:17','2026-07-12 02:57:17'),(5,'React Native','2026-07-12 02:57:17','2026-07-12 02:57:17'),(6,'Python','2026-07-12 02:57:17','2026-07-12 02:57:17'),(7,'AWS S3 Storage','2026-07-12 02:57:17','2026-07-12 02:57:17'),(8,'Microsoft Excel','2026-07-13 01:34:15','2026-07-13 01:34:15'),(9,'BMI','2026-07-15 21:06:11','2026-07-15 21:06:11');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_education`
--

DROP TABLE IF EXISTS `student_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_education` (
  `education_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `institution` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_range` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualification` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjects` text COLLATE utf8mb4_unicode_ci,
  `majors` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_majors` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `research` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`education_id`),
  KEY `idx_education_student` (`student_id`),
  CONSTRAINT `fk_education_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_education`
--

LOCK TABLES `student_education` WRITE;
/*!40000 ALTER TABLE `student_education` DISABLE KEYS */;
INSERT INTO `student_education` VALUES (1,3,'University of the Witwatersrand','2023 - 2025','Honours BA (Sociology)',NULL,NULL,NULL,NULL,'2026-07-13 01:26:48','2026-07-13 01:26:48'),(2,6,'University Of Johannesburg','2022-2026','Bachelor of Arts','CSC3B, IFM3B','CSC & IFM',NULL,'AI research','2026-07-13 23:05:38','2026-07-13 23:05:38');
/*!40000 ALTER TABLE `student_education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_employment`
--

DROP TABLE IF EXISTS `student_employment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_employment` (
  `employment_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `employer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_range` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tasks_responsibilities` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employment_id`),
  KEY `idx_employment_student` (`student_id`),
  CONSTRAINT `fk_employment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_employment`
--

LOCK TABLES `student_employment` WRITE;
/*!40000 ALTER TABLE `student_employment` DISABLE KEYS */;
INSERT INTO `student_employment` VALUES (1,3,'Wichita Spur','Oct 2018 - Jan 2019','Waitron and Cashier',NULL,'2026-07-13 01:29:48','2026-07-13 01:29:48');
/*!40000 ALTER TABLE `student_employment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_referees`
--

DROP TABLE IF EXISTS `student_referees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_referees` (
  `referee_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`referee_id`),
  KEY `idx_referees_student` (`student_id`),
  CONSTRAINT `fk_referees_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_referees`
--

LOCK TABLES `student_referees` WRITE;
/*!40000 ALTER TABLE `student_referees` DISABLE KEYS */;
INSERT INTO `student_referees` VALUES (1,3,'Prof. J.H. Russel','Senior Lecturer','Wits','0829878765','jonathan.russel@wits.ac.za','2026-07-13 01:32:50','2026-07-13 01:32:50');
/*!40000 ALTER TABLE `student_referees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_skills`
--

DROP TABLE IF EXISTS `student_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_skills` (
  `student_id` int NOT NULL,
  `skill_id` int NOT NULL,
  PRIMARY KEY (`student_id`,`skill_id`),
  KEY `fk_studentskills_skill` (`skill_id`),
  CONSTRAINT `fk_studentskills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_studentskills_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_skills`
--

LOCK TABLES `student_skills` WRITE;
/*!40000 ALTER TABLE `student_skills` DISABLE KEYS */;
INSERT INTO `student_skills` VALUES (1,1),(1,2),(1,3),(2,4),(2,6),(3,8),(7,8),(7,9);
/*!40000 ALTER TABLE `student_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `student_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_passport_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drivers_license` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `career_objective` text COLLATE utf8mb4_unicode_ci,
  `race` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `achievements` text COLLATE utf8mb4_unicode_ci,
  `interests` text COLLATE utf8mb4_unicode_ci,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `student_no` (`student_no`),
  KEY `idx_students_course` (`course_id`),
  CONSTRAINT `fk_students_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,4,1,'2483921',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Female','South African','2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,5,2,'2510492',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Zimbabwean','2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,7,1,'0012345','Kabelo Sekele',NULL,NULL,'0764923451',NULL,NULL,'To gain a challenging entry-level role',NULL,'Year 2',NULL,NULL,'Male','South Africa','2026-07-12 03:06:25','2026-07-13 01:23:46'),(4,8,3,'2207832',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Sudan','2026-07-12 18:51:44','2026-07-12 18:51:44'),(6,11,1,'0112345','Mark Henry','Kingsway Ave, 2092','0783333339','0723637363','03206534081','2-XX-7Y-DD-09','To become a software engineer','Black African','Undergraduate','Top Learner in 1st year computer science','football','Male','South Africa','2026-07-13 22:09:32','2026-07-13 22:58:52'),(7,14,2,'4689237','Bigman Thendo',NULL,NULL,'0732356486',NULL,NULL,'Internahip',NULL,'Year 3',NULL,NULL,'Male','South Africa','2026-07-15 14:58:19','2026-07-17 16:38:09');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_expiry` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ccdu.admin@wits.ac.za','$2b$10$EixZaYVK1eG3A3e89XWz2M101MockBcryptHashAdmin','admin',1,NULL,NULL,'2026-07-12 02:57:17','2026-07-12 02:57:17'),(2,'graduates@prospects.co.za','$2b$10$9KxFm39AkWq2O9x89XWz2M102MockBcryptHashEmp1','employer',1,NULL,NULL,'2026-07-12 02:57:17','2026-07-12 02:57:17'),(3,'hr@jhbtechsolutions.co.za','$2b$10$7LzGn40BkXr3P0y90YXa3N103MockBcryptHashEmp2','employer',1,NULL,NULL,'2026-07-12 02:57:17','2026-07-12 02:57:17'),(4,'2483921@students.wits.ac.za','$2b$10$bY7vR8XWz2M4Q7v89XWz2M104MockBcryptHashStu1','student',1,NULL,NULL,'2026-07-12 02:57:17','2026-07-12 02:57:17'),(5,'2510492@students.wits.ac.za','$2b$10$mN3xP4zVw5K6R7v89XWz2M105MockBcryptHashStu2','student',1,NULL,NULL,'2026-07-12 02:57:17','2026-07-12 02:57:17'),(6,'test@company.com','$2a$10$ZeHalmdcGxH0BQpStSy5sOnm/Ocby/uza2Vejoltq9msvgNgvhkL6','employer',0,NULL,NULL,'2026-07-12 03:01:15','2026-07-12 03:01:15'),(7,'student@wits.ac.za','$2a$10$IlYRZedHPov.1q/ue/Kvx.U8zY7.B2vdWheZqEm9iIwBvgW7N2aay','student',0,NULL,NULL,'2026-07-12 03:06:25','2026-07-12 03:06:25'),(8,'bigman9@gmail.com','$2a$10$A0.tjgljgjJV5PUiZy/QmuKNdf79n79rod9/LMCi9W2X3NtgxFVZm','student',0,NULL,NULL,'2026-07-12 18:51:43','2026-07-12 18:51:43'),(9,'admin@sep.local','$2a$10$y41jagI30s5kgDGP/kZq9e9T2CbGhYbZ9ACcmE5Gi/4kW2rE.xIG.','admin',1,NULL,NULL,'2026-07-12 19:00:44','2026-07-12 19:00:44'),(11,'student1@wits.ac.za','$2a$10$NoBL5IOYHbTU9YN4LBJTX.oZ.n7lzQQWULJN5rEMnbOgv/6HnFQPq','student',0,NULL,NULL,'2026-07-13 22:09:32','2026-07-13 22:09:32'),(12,'employer1@company.com','$2a$10$OaKPBvE221RySxFZDrBYe.rx.EjbXR6eGhG6JEVjEJ.z3TGDPjw2y','employer',0,NULL,NULL,'2026-07-13 22:13:11','2026-07-13 22:13:11'),(13,'employer2@company.com','$2a$10$ZRzl6nIqm5WDFhUvP0Zm2eY1SQlnQBcUvTyTKlfmWlPFsvdXZVBgm','employer',0,NULL,NULL,'2026-07-14 12:31:08','2026-07-14 12:31:08'),(14,'student05@wits.ac.za','$2a$10$FpZYz7gcU9DTfzHAyudkM.VXzjsIjYJlE1eYM8NC5kFFVgu31uc2i','student',0,NULL,NULL,'2026-07-15 14:58:19','2026-07-15 14:58:19'),(15,'employer04@gov.com','$2a$10$ALVi2bmkq8Pb77meHFLhReSXKOfrXwL5OVwlyMzUlu3/ph1qscba2','employer',0,NULL,NULL,'2026-07-15 15:06:48','2026-07-15 15:06:48');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-20 18:32:11
