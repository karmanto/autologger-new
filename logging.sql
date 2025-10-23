-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 03, 2022 at 09:42 PM
-- Server version: 10.3.31-MariaDB-0+deb10u1
-- PHP Version: 7.3.31-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `logging`
--

-- --------------------------------------------------------

--
-- Table structure for table `activeMachine`
--

CREATE TABLE `activeMachine` (
  `id` tinyint(4) NOT NULL,
  `tanggal` date NOT NULL,
  `waktu` time NOT NULL,
  `CBC1` tinyint(4) NOT NULL,
  `CBC2` tinyint(4) NOT NULL,
  `PRS1` tinyint(4) NOT NULL,
  `PRS2` tinyint(4) NOT NULL,
  `PRS3` tinyint(4) NOT NULL,
  `PRS4` tinyint(4) NOT NULL,
  `PRS5` tinyint(4) NOT NULL,
  `PRS6` tinyint(4) NOT NULL,
  `PRS7` tinyint(4) NOT NULL,
  `PRS8` tinyint(4) NOT NULL,
  `DTR1` tinyint(4) NOT NULL,
  `DTR2` tinyint(4) NOT NULL,
  `DTR3` tinyint(4) NOT NULL,
  `DTR4` tinyint(4) NOT NULL,
  `DTR5` tinyint(4) NOT NULL,
  `DTR6` tinyint(4) NOT NULL,
  `DTR7` tinyint(4) NOT NULL,
  `DTR8` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `activeMachine`
--

INSERT INTO `activeMachine` (`id`, `tanggal`, `waktu`, `CBC1`, `CBC2`, `PRS1`, `PRS2`, `PRS3`, `PRS4`, `PRS5`, `PRS6`, `PRS7`, `PRS8`, `DTR1`, `DTR2`, `DTR3`, `DTR4`, `DTR5`, `DTR6`, `DTR7`, `DTR8`) VALUES
(1, '2022-05-03', '21:42:41', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `activeMachine1`
--

CREATE TABLE `activeMachine1` (
  `id` tinyint(4) NOT NULL,
  `tanggal` date NOT NULL,
  `waktu` time NOT NULL,
  `spare0` tinyint(4) NOT NULL,
  `spare1` tinyint(4) NOT NULL,
  `spare2` tinyint(4) NOT NULL,
  `spare3` tinyint(4) NOT NULL,
  `spare4` tinyint(4) NOT NULL,
  `spare5` tinyint(4) NOT NULL,
  `spare6` tinyint(4) NOT NULL,
  `spare7` tinyint(4) NOT NULL,
  `spare8` tinyint(4) NOT NULL,
  `spare9` tinyint(4) NOT NULL,
  `spare10` tinyint(4) NOT NULL,
  `spare11` tinyint(4) NOT NULL,
  `spare12` tinyint(4) NOT NULL,
  `spare13` tinyint(4) NOT NULL,
  `spare14` tinyint(4) NOT NULL,
  `spare15` tinyint(4) NOT NULL,
  `spare16` tinyint(4) NOT NULL,
  `spare17` tinyint(4) NOT NULL,
  `spare18` tinyint(4) NOT NULL,
  `spare19` tinyint(4) NOT NULL,
  `spare20` tinyint(4) NOT NULL,
  `spare21` tinyint(4) NOT NULL,
  `spare22` tinyint(4) NOT NULL,
  `spare23` tinyint(4) NOT NULL,
  `spare24` tinyint(4) NOT NULL,
  `spare25` tinyint(4) NOT NULL,
  `spare26` tinyint(4) NOT NULL,
  `spare27` tinyint(4) NOT NULL,
  `spare28` tinyint(4) NOT NULL,
  `spare29` tinyint(4) NOT NULL,
  `spare30` tinyint(4) NOT NULL,
  `spare31` tinyint(4) NOT NULL,
  `spare32` tinyint(4) NOT NULL,
  `spare33` tinyint(4) NOT NULL,
  `spare34` tinyint(4) NOT NULL,
  `spare35` tinyint(4) NOT NULL,
  `spare36` tinyint(4) NOT NULL,
  `spare37` tinyint(4) NOT NULL,
  `spare38` tinyint(4) NOT NULL,
  `spare39` tinyint(4) NOT NULL,
  `spare40` tinyint(4) NOT NULL,
  `spare41` tinyint(4) NOT NULL,
  `spare42` tinyint(4) NOT NULL,
  `spare43` tinyint(4) NOT NULL,
  `spare44` tinyint(4) NOT NULL,
  `spare45` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `activeMachine1`
--

INSERT INTO `activeMachine1` (`id`, `tanggal`, `waktu`, `spare0`, `spare1`, `spare2`, `spare3`, `spare4`, `spare5`, `spare6`, `spare7`, `spare8`, `spare9`, `spare10`, `spare11`, `spare12`, `spare13`, `spare14`, `spare15`, `spare16`, `spare17`, `spare18`, `spare19`, `spare20`, `spare21`, `spare22`, `spare23`, `spare24`, `spare25`, `spare26`, `spare27`, `spare28`, `spare29`, `spare30`, `spare31`, `spare32`, `spare33`, `spare34`, `spare35`, `spare36`, `spare37`, `spare38`, `spare39`, `spare40`, `spare41`, `spare42`, `spare43`, `spare44`, `spare45`) VALUES
(1, '2022-05-03', '21:42:42', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `alarm`
--

CREATE TABLE `alarm` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `alarm_id` tinyint(4) NOT NULL,
  `alarm_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `alarm`
--

INSERT INTO `alarm` (`id`, `date`, `time`, `alarm_id`, `alarm_name`) VALUES
(1, '2022-05-03', '10:18:14', 2, 'DATECHANGE'),
(2, '2022-05-03', '21:08:00', 0, 'RTC'),
(3, '2022-05-03', '21:25:15', 0, 'RTC');

-- --------------------------------------------------------

--
-- Table structure for table `cbc1`
--

CREATE TABLE `cbc1` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cbc1`
--

INSERT INTO `cbc1` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:42:11', 1),
(2, '2022-05-03', '07:46:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `cbc2`
--

CREATE TABLE `cbc2` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cbc2`
--

INSERT INTO `cbc2` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:46:13', 1),
(2, '2022-05-03', '07:46:31', 0),
(3, '2022-05-03', '07:46:54', 1),
(4, '2022-05-03', '07:49:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr1`
--

CREATE TABLE `dtr1` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr1`
--

INSERT INTO `dtr1` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:43:02', 1),
(2, '2022-05-03', '07:45:52', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr2`
--

CREATE TABLE `dtr2` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr2`
--

INSERT INTO `dtr2` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:47:06', 1),
(2, '2022-05-03', '07:49:50', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr3`
--

CREATE TABLE `dtr3` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr3`
--

INSERT INTO `dtr3` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:47:13', 1),
(2, '2022-05-03', '07:49:54', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr4`
--

CREATE TABLE `dtr4` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr4`
--

INSERT INTO `dtr4` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:50:21', 1),
(2, '2022-05-03', '08:04:21', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr5`
--

CREATE TABLE `dtr5` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr5`
--

INSERT INTO `dtr5` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:04:46', 1),
(2, '2022-05-03', '08:09:09', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr6`
--

CREATE TABLE `dtr6` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr6`
--

INSERT INTO `dtr6` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:43:15', 1),
(2, '2022-05-03', '07:45:48', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr7`
--

CREATE TABLE `dtr7` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr7`
--

INSERT INTO `dtr7` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:09:25', 1),
(2, '2022-05-03', '08:13:43', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dtr8`
--

CREATE TABLE `dtr8` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dtr8`
--

INSERT INTO `dtr8` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:14:24', 1),
(2, '2022-05-03', '08:54:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `lastMilisRecord`
--

CREATE TABLE `lastMilisRecord` (
  `id` tinyint(4) NOT NULL,
  `lastMilis` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `waktu` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lastMilisRecord`
--

INSERT INTO `lastMilisRecord` (`id`, `lastMilis`, `tanggal`, `waktu`) VALUES
(1, 1651618783, '2022-05-04', '05:59:43');

-- --------------------------------------------------------

--
-- Table structure for table `prs1`
--

CREATE TABLE `prs1` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs1`
--

INSERT INTO `prs1` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:50:04', 1),
(2, '2022-05-03', '08:04:06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prs2`
--

CREATE TABLE `prs2` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs2`
--

INSERT INTO `prs2` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:04:33', 1),
(2, '2022-05-03', '08:08:56', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prs3`
--

CREATE TABLE `prs3` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs3`
--

INSERT INTO `prs3` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:46:06', 1),
(2, '2022-05-03', '07:46:29', 0),
(3, '2022-05-03', '08:04:35', 1),
(4, '2022-05-03', '08:09:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prs4`
--

CREATE TABLE `prs4` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs4`
--

INSERT INTO `prs4` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:42:54', 1),
(2, '2022-05-03', '07:45:56', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prs5`
--

CREATE TABLE `prs5` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs5`
--

INSERT INTO `prs5` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:46:58', 1),
(2, '2022-05-03', '07:49:44', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prs6`
--

CREATE TABLE `prs6` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs6`
--

INSERT INTO `prs6` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:50:13', 1),
(2, '2022-05-03', '08:04:10', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prs7`
--

CREATE TABLE `prs7` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs7`
--

INSERT INTO `prs7` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:50:19', 1),
(2, '2022-05-03', '08:04:15', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prs8`
--

CREATE TABLE `prs8` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prs8`
--

INSERT INTO `prs8` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:04:41', 1),
(2, '2022-05-03', '08:09:05', 0);

-- --------------------------------------------------------

--
-- Table structure for table `remoteControl`
--

CREATE TABLE `remoteControl` (
  `id` tinyint(4) NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `remoteControl`
--

INSERT INTO `remoteControl` (`id`, `stat`) VALUES
(1, 93);

-- --------------------------------------------------------

--
-- Table structure for table `rpi`
--

CREATE TABLE `rpi` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rpi`
--

INSERT INTO `rpi` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '07:41:38', 1),
(2, '2022-05-03', '09:17:27', 0),
(3, '2022-05-03', '09:40:23', 1),
(4, '2022-05-03', '10:16:52', 0),
(5, '2022-05-03', '10:17:27', 1),
(6, '2022-05-03', '10:24:17', 0),
(7, '2022-05-03', '10:24:54', 1),
(8, '2022-05-03', '10:26:35', 0),
(9, '2022-05-03', '20:58:38', 1),
(10, '2022-05-03', '21:07:02', 0),
(11, '2022-05-03', '21:07:39', 1),
(12, '2022-05-03', '21:11:06', 0),
(13, '2022-05-03', '21:23:33', 1),
(14, '2022-05-03', '23:59:59', 2),
(15, '2022-05-04', '00:00:00', 3),
(16, '2022-05-04', '02:46:59', 0),
(17, '2022-05-04', '05:39:51', 1),
(18, '2022-05-04', '05:59:41', 0);

-- --------------------------------------------------------

--
-- Table structure for table `runSecond`
--

CREATE TABLE `runSecond` (
  `id` tinyint(4) NOT NULL,
  `tanggal` date NOT NULL,
  `waktu` time NOT NULL,
  `CBC1` int(11) NOT NULL,
  `CBC2` int(11) NOT NULL,
  `PRS1` int(11) NOT NULL,
  `PRS2` int(11) NOT NULL,
  `PRS3` int(11) NOT NULL,
  `PRS4` int(11) NOT NULL,
  `PRS5` int(11) NOT NULL,
  `PRS6` int(11) NOT NULL,
  `PRS7` int(11) NOT NULL,
  `PRS8` int(11) NOT NULL,
  `DTR1` int(11) NOT NULL,
  `DTR2` int(11) NOT NULL,
  `DTR3` int(11) NOT NULL,
  `DTR4` int(11) NOT NULL,
  `DTR5` int(11) NOT NULL,
  `DTR6` int(11) NOT NULL,
  `DTR7` int(11) NOT NULL,
  `DTR8` int(11) NOT NULL,
  `RPI` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `runSecond`
--

INSERT INTO `runSecond` (`id`, `tanggal`, `waktu`, `CBC1`, `CBC2`, `PRS1`, `PRS2`, `PRS3`, `PRS4`, `PRS5`, `PRS6`, `PRS7`, `PRS8`, `DTR1`, `DTR2`, `DTR3`, `DTR4`, `DTR5`, `DTR6`, `DTR7`, `DTR8`, `RPI`) VALUES
(1, '2022-05-03', '21:25:15', 229, 186, 842, 263, 288, 182, 166, 837, 836, 264, 170, 164, 161, 840, 263, 153, 258, 2376, 29756);

-- --------------------------------------------------------

--
-- Table structure for table `runSecond1`
--

CREATE TABLE `runSecond1` (
  `id` tinyint(4) NOT NULL,
  `tanggal` date NOT NULL,
  `waktu` time NOT NULL,
  `spare0` int(11) NOT NULL,
  `spare1` int(11) NOT NULL,
  `spare2` int(11) NOT NULL,
  `spare3` int(11) NOT NULL,
  `spare4` int(11) NOT NULL,
  `spare5` int(11) NOT NULL,
  `spare6` int(11) NOT NULL,
  `spare7` int(11) NOT NULL,
  `spare8` int(11) NOT NULL,
  `spare9` int(11) NOT NULL,
  `spare10` int(11) NOT NULL,
  `spare11` int(11) NOT NULL,
  `spare12` int(11) NOT NULL,
  `spare13` int(11) NOT NULL,
  `spare14` int(11) NOT NULL,
  `spare15` int(11) NOT NULL,
  `spare16` int(11) NOT NULL,
  `spare17` int(11) NOT NULL,
  `spare18` int(11) NOT NULL,
  `spare19` int(11) NOT NULL,
  `spare20` int(11) NOT NULL,
  `spare21` int(11) NOT NULL,
  `spare22` int(11) NOT NULL,
  `spare23` int(11) NOT NULL,
  `spare24` int(11) NOT NULL,
  `spare25` int(11) NOT NULL,
  `spare26` int(11) NOT NULL,
  `spare27` int(11) NOT NULL,
  `spare28` int(11) NOT NULL,
  `spare29` int(11) NOT NULL,
  `spare30` int(11) NOT NULL,
  `spare31` int(11) NOT NULL,
  `spare32` int(11) NOT NULL,
  `spare33` int(11) NOT NULL,
  `spare34` int(11) NOT NULL,
  `spare35` int(11) NOT NULL,
  `spare36` int(11) NOT NULL,
  `spare37` int(11) NOT NULL,
  `spare38` int(11) NOT NULL,
  `spare39` int(11) NOT NULL,
  `spare40` int(11) NOT NULL,
  `spare41` int(11) NOT NULL,
  `spare42` int(11) NOT NULL,
  `spare43` int(11) NOT NULL,
  `spare44` int(11) NOT NULL,
  `spare45` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `runSecond1`
--

INSERT INTO `runSecond1` (`id`, `tanggal`, `waktu`, `spare0`, `spare1`, `spare2`, `spare3`, `spare4`, `spare5`, `spare6`, `spare7`, `spare8`, `spare9`, `spare10`, `spare11`, `spare12`, `spare13`, `spare14`, `spare15`, `spare16`, `spare17`, `spare18`, `spare19`, `spare20`, `spare21`, `spare22`, `spare23`, `spare24`, `spare25`, `spare26`, `spare27`, `spare28`, `spare29`, `spare30`, `spare31`, `spare32`, `spare33`, `spare34`, `spare35`, `spare36`, `spare37`, `spare38`, `spare39`, `spare40`, `spare41`, `spare42`, `spare43`, `spare44`, `spare45`) VALUES
(1, '2022-05-03', '21:25:25', 367, 576, 570, 259, 2377, 366, 365, 566, 257, 2380, 2374, 364, 566, 263, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare0`
--

CREATE TABLE `spare0` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare0`
--

INSERT INTO `spare0` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '09:05:08', 1),
(2, '2022-05-03', '09:11:15', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare1`
--

CREATE TABLE `spare1` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare1`
--

INSERT INTO `spare1` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:54:42', 1),
(2, '2022-05-03', '09:04:13', 0),
(3, '2022-05-03', '09:12:07', 1),
(4, '2022-05-03', '09:12:12', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare2`
--

CREATE TABLE `spare2` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare2`
--

INSERT INTO `spare2` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:54:50', 1),
(2, '2022-05-03', '09:04:15', 0),
(3, '2022-05-03', '09:12:20', 1),
(4, '2022-05-03', '09:12:25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare3`
--

CREATE TABLE `spare3` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare3`
--

INSERT INTO `spare3` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:09:29', 1),
(2, '2022-05-03', '08:13:48', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare4`
--

CREATE TABLE `spare4` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare4`
--

INSERT INTO `spare4` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:14:28', 1),
(2, '2022-05-03', '08:54:05', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare5`
--

CREATE TABLE `spare5` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare5`
--

INSERT INTO `spare5` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '09:05:11', 1),
(2, '2022-05-03', '09:11:17', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare6`
--

CREATE TABLE `spare6` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare6`
--

INSERT INTO `spare6` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '09:05:15', 1),
(2, '2022-05-03', '09:11:20', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare7`
--

CREATE TABLE `spare7` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare7`
--

INSERT INTO `spare7` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:54:54', 1),
(2, '2022-05-03', '09:04:20', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare8`
--

CREATE TABLE `spare8` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare8`
--

INSERT INTO `spare8` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:09:34', 1),
(2, '2022-05-03', '08:13:51', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare9`
--

CREATE TABLE `spare9` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare9`
--

INSERT INTO `spare9` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:14:33', 1),
(2, '2022-05-03', '08:54:08', 0),
(3, '2022-05-03', '09:13:26', 1),
(4, '2022-05-03', '09:13:31', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare10`
--

CREATE TABLE `spare10` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare10`
--

INSERT INTO `spare10` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:14:38', 1),
(2, '2022-05-03', '08:54:12', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare11`
--

CREATE TABLE `spare11` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare11`
--

INSERT INTO `spare11` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '09:05:19', 1),
(2, '2022-05-03', '09:11:23', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare12`
--

CREATE TABLE `spare12` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare12`
--

INSERT INTO `spare12` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:54:57', 1),
(2, '2022-05-03', '09:04:23', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare13`
--

CREATE TABLE `spare13` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `spare13`
--

INSERT INTO `spare13` (`id`, `date`, `time`, `stat`) VALUES
(1, '2022-05-03', '08:09:40', 1),
(2, '2022-05-03', '08:14:03', 0);

-- --------------------------------------------------------

--
-- Table structure for table `spare14`
--

CREATE TABLE `spare14` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare15`
--

CREATE TABLE `spare15` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare16`
--

CREATE TABLE `spare16` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare17`
--

CREATE TABLE `spare17` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare18`
--

CREATE TABLE `spare18` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare19`
--

CREATE TABLE `spare19` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare20`
--

CREATE TABLE `spare20` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare21`
--

CREATE TABLE `spare21` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare22`
--

CREATE TABLE `spare22` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare23`
--

CREATE TABLE `spare23` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare24`
--

CREATE TABLE `spare24` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare25`
--

CREATE TABLE `spare25` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare26`
--

CREATE TABLE `spare26` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare27`
--

CREATE TABLE `spare27` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare28`
--

CREATE TABLE `spare28` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare29`
--

CREATE TABLE `spare29` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare30`
--

CREATE TABLE `spare30` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare31`
--

CREATE TABLE `spare31` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare32`
--

CREATE TABLE `spare32` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare33`
--

CREATE TABLE `spare33` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare34`
--

CREATE TABLE `spare34` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare35`
--

CREATE TABLE `spare35` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare36`
--

CREATE TABLE `spare36` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare37`
--

CREATE TABLE `spare37` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare38`
--

CREATE TABLE `spare38` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare39`
--

CREATE TABLE `spare39` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare40`
--

CREATE TABLE `spare40` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare41`
--

CREATE TABLE `spare41` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare42`
--

CREATE TABLE `spare42` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare43`
--

CREATE TABLE `spare43` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare44`
--

CREATE TABLE `spare44` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `spare45`
--

CREATE TABLE `spare45` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stat` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cbc1`
--
ALTER TABLE `cbc1`
  ADD KEY `date` (`date`);

--
-- Indexes for table `cbc2`
--
ALTER TABLE `cbc2`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr1`
--
ALTER TABLE `dtr1`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr2`
--
ALTER TABLE `dtr2`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr3`
--
ALTER TABLE `dtr3`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr4`
--
ALTER TABLE `dtr4`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr5`
--
ALTER TABLE `dtr5`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr6`
--
ALTER TABLE `dtr6`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr7`
--
ALTER TABLE `dtr7`
  ADD KEY `date` (`date`);

--
-- Indexes for table `dtr8`
--
ALTER TABLE `dtr8`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs1`
--
ALTER TABLE `prs1`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs2`
--
ALTER TABLE `prs2`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs3`
--
ALTER TABLE `prs3`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs4`
--
ALTER TABLE `prs4`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs5`
--
ALTER TABLE `prs5`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs6`
--
ALTER TABLE `prs6`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs7`
--
ALTER TABLE `prs7`
  ADD KEY `date` (`date`);

--
-- Indexes for table `prs8`
--
ALTER TABLE `prs8`
  ADD KEY `date` (`date`);

--
-- Indexes for table `rpi`
--
ALTER TABLE `rpi`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare0`
--
ALTER TABLE `spare0`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare1`
--
ALTER TABLE `spare1`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare2`
--
ALTER TABLE `spare2`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare3`
--
ALTER TABLE `spare3`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare4`
--
ALTER TABLE `spare4`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare5`
--
ALTER TABLE `spare5`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare6`
--
ALTER TABLE `spare6`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare7`
--
ALTER TABLE `spare7`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare8`
--
ALTER TABLE `spare8`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare9`
--
ALTER TABLE `spare9`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare10`
--
ALTER TABLE `spare10`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare11`
--
ALTER TABLE `spare11`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare12`
--
ALTER TABLE `spare12`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare13`
--
ALTER TABLE `spare13`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare14`
--
ALTER TABLE `spare14`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare15`
--
ALTER TABLE `spare15`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare16`
--
ALTER TABLE `spare16`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare17`
--
ALTER TABLE `spare17`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare18`
--
ALTER TABLE `spare18`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare19`
--
ALTER TABLE `spare19`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare20`
--
ALTER TABLE `spare20`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare21`
--
ALTER TABLE `spare21`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare22`
--
ALTER TABLE `spare22`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare23`
--
ALTER TABLE `spare23`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare24`
--
ALTER TABLE `spare24`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare25`
--
ALTER TABLE `spare25`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare26`
--
ALTER TABLE `spare26`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare27`
--
ALTER TABLE `spare27`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare28`
--
ALTER TABLE `spare28`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare29`
--
ALTER TABLE `spare29`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare30`
--
ALTER TABLE `spare30`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare31`
--
ALTER TABLE `spare31`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare32`
--
ALTER TABLE `spare32`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare33`
--
ALTER TABLE `spare33`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare34`
--
ALTER TABLE `spare34`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare35`
--
ALTER TABLE `spare35`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare36`
--
ALTER TABLE `spare36`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare37`
--
ALTER TABLE `spare37`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare38`
--
ALTER TABLE `spare38`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare39`
--
ALTER TABLE `spare39`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare40`
--
ALTER TABLE `spare40`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare41`
--
ALTER TABLE `spare41`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare42`
--
ALTER TABLE `spare42`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare43`
--
ALTER TABLE `spare43`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare44`
--
ALTER TABLE `spare44`
  ADD KEY `date` (`date`);

--
-- Indexes for table `spare45`
--
ALTER TABLE `spare45`
  ADD KEY `date` (`date`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
