CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  place_id INT,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  photo VARCHAR(255),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (place_id) REFERENCES places(id)
);

INSERT INTO categories (id, name, description) VALUES
(1, 'Мебель', 'Мебель для удобства и комфорта'),
(2, 'Офисное оборудование', 'Оборудование для сотрудников офиса'),
(3, 'Помещение автомобилей', 'Специальное место для автомобилей');

INSERT INTO places (id, name, description) VALUES
(1, 'Кабинет директора', 'Кабинет руководителя компании'),
(2, 'Маркетинговое помещение', 'Помещение для пиарщиков, идей по развитию'),
(3, 'Офис 201 Бишкек', 'Офф.дилер, автосалон Анкара 5 Бишкек, рекламное помещение');

INSERT INTO items (category_id, place_id, name, description) VALUES
(1, 1, 'Диваны', 'Дизайнерские диваны и пуфики для интерьера'),
(2, 2, 'Ноутбуки для работников', 'Новые ноутбуки для сотрудников на проверки'),
(3, 3, 'Mercedes-Benz s600', 'Mercedes-Benz оснащенный 6.0 литровым двигателем V12');
