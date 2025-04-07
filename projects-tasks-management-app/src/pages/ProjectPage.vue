<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Modal from "../components/Modal.vue";

interface Project {
  id: number;
  name: string;
  tasks: number | string;
  status: string;
  createdAt: string;
}

const route = useRoute();
const project = ref<Project | null>(null);

onMounted(() => {
  const saved = localStorage.getItem("projects");
  if (saved) {
    const projects: Project[] = JSON.parse(saved);
    const found = projects.find((p) => p.id === Number(route.params.id));
    if (found) {
      project.value = found;
    }
  }
});

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="table-wrap">
    <router-link to="/">← Назад</router-link>
    <h2>{{ project?.name }}</h2>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>Назва проєкту</th>
          <th>Виконавець</th>
          <th>Статус</th>
          <th>Термін</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <button @click="openModal">Додати проєкт</button>
    <Modal :isVisible="isModalOpen" @close="closeModal">
      <label for="taskName">Назва завдання</label>
      <input type="text" id="taskName" />
      <label for="name">Виконавець</label>
      <select name="name" id="name"></select>
      <label for="status">Статус</label>
      <select name="status" id="status">
        <option value="default" desabled></option>
        <option value="to-do">зробити</option>
        <option value="in-progress">в роботі</option>
        <option value="done">виконано</option>
      </select>
      <label for="date">Термін</label>
      <input type="date" name="event_date_1" id="date" />
      <button>Зберегти</button>
    </Modal>
  </div>
</template>

<style scoped>
body {
  text-align: center;
}

h2 {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  color: #232e3f;
  text-align: center;
}

.table-wrap {
  max-width: 550px;
  text-align: right;
  margin: auto;
}

table {
  border-radius: 5px;
  border: 1px solid #dad5c6;
  border-spacing: 0;
  margin: 20px auto;
}

thead {
  background-color: #dad5c6;
  border: 1px solid #dad5c6;
  text-align: center;
}

th {
  color: #232e3f;
  font-family: "Monterrat", sans-serif;
  font-weight: 400;
  padding: 20px;
}

thead th {
  border: none;
}

td {
  padding: 20px;
  border: 1px solid #dad5c6;
}

#status,
#date {
  border: none;
  color: #232e3f;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  margin: 15% auto;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  position: relative;
  text-align: center;
}

.close {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}

button {
  background-color: #cf9421;
  color: #eeece3;
  font-family: "Monterrat", sans-serif;
  font-weight: 400;
  border-radius: 10px;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
