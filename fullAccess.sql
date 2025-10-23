-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 03, 2022 at 09:43 PM
-- Server version: 10.3.31-MariaDB-0+deb10u1
-- PHP Version: 7.3.31-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fullAccess`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `dateSave` date NOT NULL,
  `timeSave` time NOT NULL,
  `Revisi` tinyint(4) NOT NULL,
  `byWho` varchar(20) NOT NULL,
  `comment` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `date`, `dateSave`, `timeSave`, `Revisi`, `byWho`, `comment`) VALUES
(1, '2020-10-06', '2020-10-10', '08:27:00', 1, 'HP-PC', 'tidak olah TBS'),
(2, '2020-10-12', '2020-10-19', '08:20:00', 1, 'HP-PC', 'Logger sedang dalam perbaikan.'),
(3, '2020-10-13', '2020-10-19', '08:20:00', 1, 'HP-PC', 'Logger sedang dalam perbaikan.'),
(4, '2020-10-14', '2020-10-19', '08:20:00', 1, 'HP-PC', 'Logger sedang dalam perbaikan.'),
(5, '2020-10-15', '2020-10-19', '08:21:00', 1, 'HP-PC', 'Logger sedang dalam perbaikan.'),
(6, '2020-10-16', '2020-10-19', '08:21:00', 1, 'HP-PC', 'Logger sedang dalam perbaikan.'),
(7, '2020-10-17', '2020-10-19', '08:21:00', 1, 'HP-PC', 'Logger sedang dalam perbaikan.'),
(8, '2020-10-18', '2020-10-19', '08:22:00', 1, 'HP-PC', 'Logger sedang dalam perbaikan.'),
(9, '2020-10-28', '2020-10-28', '22:29:00', 1, 'DAYAT', 'jam 19.11 sd 19.17 stop olah karna stim turun di boiler'),
(10, '2020-11-02', '2020-11-03', '07:12:00', 1, 'DAYAT', 'jam 16.32 sd 16.38 cbc line 1 dan 2 stop olah karna stim turun'),
(11, '2020-11-05', '2020-11-06', '07:11:00', 1, 'DAYAT', 'jam 14.33 sd 14.45 cbc stop karna boiler takuma trip air tekor'),
(12, '2020-11-14', '2020-11-14', '19:56:00', 1, 'DAYAT', 'olah tbs line 1 lambat jalan karna perbaikan panel fiber cyclone line 1 (shood )'),
(13, '2020-11-20', '2020-11-21', '07:22:00', 1, 'DAYAT', '16.12 sd 16.18 stop olah karna kendala di boiler stim turun'),
(14, '2020-11-30', '2020-12-01', '07:14:00', 1, 'DAYAT', 'jam 11.18 sd 11.21 stop olah line 1 karna aerlock fiber cyclone trip'),
(15, '2020-12-16', '2020-12-16', '12:36:00', 1, 'DAYAT', 'jam 11.41 s/d 11.59 press dan cbc line 1 dan 2 stop karna boiler turun steam pendulum takuma trip'),
(16, '2020-12-18', '2020-12-18', '11:55:00', 1, 'DAYAT', 'pres no 3 perbaikan ganti pres cake'),
(17, '2020-12-22', '2020-12-22', '14:28:00', 1, 'AMRI', 'Jam 12.53 - 14.22 cbc stop karena daun cbc line 1lepas dan masuk ke dalam polhisingdrum.'),
(18, '2020-12-28', '2020-12-28', '15:28:00', 1, 'DAYAT', 'jam 11.53 sd 12.36 pres dan cbc line 2 stop karna perbaikan polisingdrum trip'),
(19, '2020-12-28', '2020-12-28', '23:47:00', 2, 'AMRI', '1.Jam 21.42 sampai jam 22.04 CBC line satu stop,pendulum boiler takuma sumbat(janjagan).\n2.Jam 21.42 sampai jam 22.20 CBC lone dua stop,pendulum boiler takuma sumbat(janjagan).dan mengambil janjagan dari dalam conveyor polishingdrum line dua.'),
(20, '2020-12-28', '2020-12-28', '23:54:00', 3, 'AMRI', '3.Jam 11.53 sampai jam 12.36 CBC line d7a stop,polishingdrum line dua trip\n'),
(21, '2020-12-28', '2020-12-29', '00:02:00', 4, 'AMRI', '1.Jam 11.53 sampai jam 12.36 CBC line dua stop,polishingdrum trip.\n2.Jam 21.42 sampai jam 22.04 CBC line satu stop,pendulum boiler takuma sumbat(janjagan).\n3.Jam 21.42 sampai jam 22.20 CBC line dua stop,pendulum boiler takuma sumbat(janjangan).dan pembersihan conveyor polishingdrum line dua dari janjangan.'),
(22, '2020-12-29', '2020-12-29', '20:48:00', 1, 'AMRI', '1.Jam 12.58 - 13.36 CBC line satu stop,pendulum takuma trip(sumbat).\n2.Jam 13.03 - 13.17 CBC line dua stop,pendulum takuma trip(sumbat)'),
(23, '2020-12-30', '2020-12-30', '19:42:00', 1, 'AMRI', 'CBC line satu dalam kontrol perbaikan sehingga jalan tidak normal,penambahan daun conveyor.'),
(24, '2020-12-31', '2020-12-31', '21:58:00', 1, 'AMRI', 'Jam 18.17 - 18.23 wib CBC line satu stop,polishingdrum stop ambil janjangan di conveyor polishingdrum line satu.'),
(25, '2021-01-06', '2021-01-06', '15:05:00', 1, 'AMRI', '1).Jam 12.42 - 12.44 CBC line dua stop karena steam turun.\n2).Jam 13.47 - 13.51 CBC line dua stop breker panel CBC trip'),
(26, '2021-01-07', '2021-01-07', '23:46:00', 1, 'DAYAT', 'jam 18.06 sd 18.10 cbc stop karna boiler turun steam'),
(27, '2021-01-11', '2021-01-11', '22:24:00', 1, 'AMRI', 'Jam 17.43 - 17.48 wib,CBC line satu stop karena tekanan steam boiler turun.'),
(28, '2021-01-11', '2021-01-11', '22:25:00', 2, 'AMRI', 'Jam 17.43 - 17.48 wib,CBC line satu stop karena tekanan steam boiler turun.'),
(29, '2021-01-12', '2021-01-12', '20:26:00', 1, 'AMRI', '1.Jam 12.52 - 12.58 wib,CBC line 2 stop karena panel trip.\n2.Jam 12.58 - 13.00 wib,CBC line 2 stop panel trip kembali.\n3.Jam 16.30 - 19.30 wib,perbaikan H.crane no 2 tidak bisa memutar/menuang lori.'),
(30, '2021-01-14', '2021-01-14', '21:58:00', 1, 'AMRI', 'Jam 13.00 - 13.02 CBC line 2 stop karena panel trip.'),
(31, '2021-01-16', '2021-01-16', '22:05:00', 1, 'AMRI', 'Jam 13.57 - 13.59 CBC line dua stop karena panel line dua trip.\n'),
(32, '2021-01-18', '2021-01-19', '01:00:00', 1, 'DAYAT', 'jam 09.55 s/d 09.58 pengecekan dan perbaikan cbc line 2'),
(33, '2021-01-21', '2021-01-21', '19:43:00', 1, 'DAYAT', 'jam 16.01 sd 16.22 stop olah line 2 karna steam turun di boiler\njam 16.04 sd 16.21 stop olah line 1 karna steam turun di boiler'),
(34, '2021-01-23', '2021-01-23', '20:30:00', 1, 'AMRI', 'Jam 18.36 CBC line satu stop,spie sproket polishingdrum line satu lepas.perbaikan selesai jam 20.25 wib.'),
(35, '2021-01-26', '2021-01-26', '19:11:00', 1, 'AMRI', 'Jam 17.33 - 17.38 CBC line 1 & 2 stop,steam boiler turun cut pendulum boiler sumbat.'),
(36, '2021-04-21', '2021-04-22', '16:11:00', 1, 'MPA MTC1', 'Pressan Terpasang Hanyan '),
(37, '2021-04-21', '2021-04-22', '16:13:00', 2, 'MPA MTC1', 'Pres Berjalan Hanya 2\n'),
(38, '2021-04-21', '2021-04-22', '16:27:00', 3, 'MPA MTC1', 'Jumlah Pressan Dan Digester 7 Unit Yang Berjalan');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD KEY `date` (`date`),
  ADD KEY `id` (`id`),
  ADD KEY `date_2` (`date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
