# Projects & Tasks Manager

**Projects & Tasks Manager** - це SPA-додаток для управління проектами і завданнями із застосуванням Vue.js 3, TypeScript, Pinia/Vuex, Axios. Додаток включає таблицю проектів з можливістю сортування, фільтрації та зміни розмірів колонок; детальну сторінку проекту з таблицею завдань; форму створення/редагування завдань.

## Технології

- **Vue.js 3** 
- **TypeScript**
- **Pinia** — для менеджменту стану
- **Axios** — для HTTP-запитів
- **VueDraggable** — drag-and-drop функціональність
- **JSON Server** — моковий API

## Інструкція для запуску:

### 1. Клонування репозиторію
git clone https://github.com/sofiiahr01/projects-tasks-management-app.git
cd projects-tasks-management-app

### 2. Встановлення залежностей
npm instal

### 3. Запуск мок-сервера (JSON Server)
npm install -g json-server

Старт сервера з db.json:
json-server --watch db.json --port 3000

### 4. Запуск клієнтської частини
cd projects-tasks-management-app
npm run dev
