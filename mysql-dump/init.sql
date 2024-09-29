CREATE DATABASE puzzle_games;
USE puzzle_games;

GRANT ALL on puzzle_games.* TO `scott_tsao`@`%`;

CREATE TABLE `users` (`line_id` varchar(45) NOT NULL, `name` varchar(50) NOT NULL, `image` varchar(255) NULL, `chapter` int NOT NULL DEFAULT '1', `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`line_id`)) ENGINE=InnoDB;
CREATE TABLE `problems` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `question` varchar(255) NOT NULL,
  `image` varchar(255) NULL,
  `answer` varchar(255) NOT NULL,
  `number` int NOT NULL,
  `error_message` varchar(255) NOT NULL DEFAULT '答案不對喔，再好好想想吧',
  `hint` varchar(255) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

INSERT INTO `problems` (`question`, `image`, `answer`, `number`, `title`, `error_message`) VALUES 
('想要拿到寶藏的你，興致沖沖地來到了，新郎新娘的家，卻發現大門上了鎖，這時聰明的你想起，新郎曾經說過，為了不忘記婚禮的日期，曾經改過大門的密碼', 'https://lh3.googleusercontent.com/pw/AP1GczNhPpHJ2TEBa4Xju7NJDCXMppjHzCTuy8KoMS7_KKetlsgDO3XKxkog21DuDeTeaFv7AP0Bx05oGfU8AGOtZa9ohHvdPmxEQsPv5DFIPxvPpIzUKkKEDubSJprzTh2LqMfSM4su-6rW77dP6Il1EWLwEQ=w2010-h1508-s-no-gm?authuser=0', '1130', '1', '大門密碼？', '答案不對喔，再好好想想吧'),
('進到家門以後，你直達書房並且發現了新郎的電腦，但是卻上了鎖，聰明的你藉由探索環境來得到電腦密碼的提示吧', 'https://lh3.googleusercontent.com/pw/AP1GczOJTqdcl-is07U3BPWSbOIW2S7xq-AOtLSl8BqCx8Lpx9S4Z_eZmiEkp9xiDDVuCBK9uSrS5xVRPpmevcSOkMBtAHr7TOphaD77vkca-WRw2SN7BNW6eNU3wFHTWTAD0_LsI2GSxLKDlE3R365X2Id8rg=w2010-h1508-s-no-gm?authuser=0', '1i xu6g.4', '2', '電腦密碼？', '密碼錯誤，請注意密碼須包含英數與特殊符號'),
('打開電腦後你看到了一張藏寶圖，想要我的寶藏嗎？想要的話可以全部給你，去找吧！我把所有的財寶都放在那裡！', 'https://lh3.googleusercontent.com/pw/AP1GczMo4mvOn4O1D4si-UfB8MuCtyFP1T3gzdMq_wfcOx1xDOmuONnsP1Hu4Xbbb4ZuIn4-887R3Gwfy0MoQVb3ubBgLD4CzC7Uaq4jHNn5LQMaYiehBQdVmdp08h-6xiCO7OdxIWHwNc4bI7sb8L4lpnBsug=w2010-h1508-s-no-gm?authuser=0', '擴香石', '3', '寶藏是什麼？', '答案不對喔，再好好想想吧');