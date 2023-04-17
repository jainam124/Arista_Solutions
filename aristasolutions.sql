-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2023 at 12:18 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aristasolutions`
--

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `description`, `price`, `image`) VALUES
(1, 'RE-102 System', 'jnadsfnjnn', '1000', 'http://www.newagefireprotection.com/admin/images/news/news_banner_1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hsncode` varchar(100) NOT NULL,
  `qty` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `warranty` varchar(100) NOT NULL,
  `make` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category`, `brand`, `name`, `hsncode`, `qty`, `price`, `description`, `warranty`, `make`) VALUES
('1', 'fire alarm', 'Ravel', 'RE-102 System', '1547', '100', '1000', 'A fire alarm system is a network of devices designed to detect and alert occupants of a building in ', '2 years', 'India'),
('1', 'fire alarm', 'Ravel', 'RE-102 System', '1547', '100', '1000', 'A fire alarm system is a network of devices designed to detect and alert occupants of a building in ', '2 years', 'India'),
('1', 'fire alarm', 'Ravel', 'RE-102 System', '1547', '100', '1000', 'A fire alarm system is a network of devices designed to detect and alert occupants of a building in ', '2 years', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`) VALUES
('jainamsheth124@gmail.com', 'jainam123$'),
('jainamsheth124@gmail.com', 'jainam'),
('vedbulsara9@gmail.com', 'ved'),
('vedbulsara9@gmail.com', 'ved'),
('jash123@gmail.com', 'jash123'),
('jainamsheth124@gmail.com', 'jainam'),
('', ''),
('jainamsheth124@gmail.com', 'asdf123$'),
('jainamsheth124@gmail.com', 'asdf123$'),
('jainamsheth124@gmail.com', 'des'),
('jainamsheth124@gmail.com', 'ert'),
('jainamsheth124@gmail.com', 'ert'),
('jainamsheth124@gmail.com', 'ert'),
('jainamsheth124@gmail.com', 'ert'),
('jainamsheth124@gmail.com', 'a'),
('jainamsheth124@gmail.com', 'jainam1*'),
('jainamsheth124@gmail.com', 'jainam1*'),
('jainamsheth124@gmail.com', 'jainam1*'),
('vedbulsara9@gmail.com', 'ved123'),
('jainamsheth124@gmail.com', 'jainam'),
('jainamsheth124@gmail.com', 'jainam'),
('jashparmar@gmail.com', 'jash'),
('vedbulsara9@gmail.com', 'ved');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
