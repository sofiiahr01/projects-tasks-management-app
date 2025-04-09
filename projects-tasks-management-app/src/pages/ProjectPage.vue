<script setup lang="ts">
import { defineProps, ref, onMounted, reactive, watch, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import axios from "axios";
import Modal from "../components/Modal.vue";

interface Task {
  id: number;
  name: string;
  worker: string;
  status: string;
  createdAt: string;
  projectId: number;
}

const route = useRoute();
const tasks = ref<Task[]>([]);
const taskName = ref("");
const taskWorker = ref("");
const taskStatus = ref("");
const taskDate = ref("");
const nextId = ref(1);

const workers = ref<string[]>([]);

const fetchWorkers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/workers");
    workers.value = response.data;
  } catch (error) {
    console.error("Error fetching workers:", error);
  }
};

onMounted(() => {
  fetchWorkers();
});

const projects = ref<any[]>([]);

const projectId = computed(() => Number(route.params.id));

onMounted(() => {
  const savedProjects = localStorage.getItem("projects");
  if (savedProjects) {
    projects.value = JSON.parse(savedProjects);
  }

  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
});

const project = computed(() => {
  return projects.value.find((p) => p.id === projectId.value);
});

const projectTasks = computed(() => {
  return tasks.value.filter((task) => task.projectId === projectId.value);
});

const taskCount = computed(() => projectTasks.value.length);

watch(taskCount, (newCount) => {
  if (project.value) {
    project.value.taskCount = newCount;
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.map((p) =>
      p.id === project.value.id ? project.value : p
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  }
});

const sortField = ref<string>("id");

const filterName = ref("");
const filterStatus = ref("");

const filteredTasks = computed(() => {
  return projectTasks.value
    .filter((task) => {
      const matchesName = task.name
        .toLowerCase()
        .includes(filterName.value.toLowerCase());
      const matchesStatus = filterStatus.value
        ? task.status === filterStatus.value
        : true;
      return matchesName && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField.value === "createdAt") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortField.value === "status") {
        return a.status.localeCompare(b.status);
      } else {
        return 0;
      }
    });
});

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const addTask = () => {
  if (!taskName.value.trim()) return;

  tasks.value.push({
    id: nextId.value,
    name: taskName.value,
    worker: taskWorker.value,
    status: taskStatus.value,
    createdAt: taskDate.value,
    projectId: projectId.value,
  });

  nextId.value++;

  taskName.value = "";
  taskWorker.value = "";
  taskStatus.value = "";
  taskDate.value = "";

  isModalOpen.value = false;

  localStorage.setItem("tasks", JSON.stringify(tasks.value));
  localStorage.setItem("nextId", JSON.stringify(nextId.value));
};

const handleDragStart = (e: DragEvent, task: Task) => {
  e.dataTransfer?.setData("task", JSON.stringify(task));
};

const handleDrop = (e: DragEvent, index: number) => {
  const taskData = e.dataTransfer?.getData("task");
  if (taskData) {
    const draggedTask: Task = JSON.parse(taskData);
    const draggedIndex = tasks.value.findIndex((t) => t.id === draggedTask.id);
    if (draggedIndex !== -1 && draggedIndex !== index) {
      tasks.value.splice(draggedIndex, 1);
      tasks.value.splice(index, 0, draggedTask);
    }
  }
};

watch(
  tasks,
  (newTasks) => {
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  },
  { deep: true }
);
</script>

<template>
  <div class="table-wrap">
    <router-link to="/">← Назад</router-link>
    <h2>{{ project?.name }}</h2>
    <div class="sort-container">
      <div class="sort-item">
        <label for="filterStatus">Фільтр:</label>
        <select id="filterStatus" v-model="filterStatus">
          <option value="">Всі</option>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="sort-item">
        <label for="sortField">Сортувати за:</label>
        <select id="sortField" v-model="sortField">
          <option value="status">Статус</option>
          <option value="createdAt">Термін</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>Назва завдання</th>
          <th>Виконавець</th>
          <th>Статус</th>
          <th>Термін</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in filteredTasks"
          :key="task.id"
          draggable="true"
          @dragstart="handleDragStart($event, task)"
          @drop="handleDrop($event, index)"
          @dragover.prevent
        >
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.worker }}</td>
          <td>{{ task.status }}</td>
          <td>{{ task.createdAt }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="openModal">Додати завдання</button>
    <Modal :isVisible="isModalOpen" @close="closeModal" class="page-modal">
      <label for="taskName" class="input-name">Назва завдання</label>
      <input type="text" id="taskName" v-model="taskName" />
      <label for="name" class="input-name">Виконавець</label>
      <select name="name" id="name" v-model="taskWorker">
        <option value="" disabled>Оберіть виконавця</option>
        <option v-for="worker in workers" :key="worker" :value="worker">
          {{ worker }}
        </option>
      </select>
      <label for="status" class="input-name">Статус</label>
      <select name="status" id="status" v-model="taskStatus">
        <option value="default">--</option>
        <option value="to-do">зробити</option>
        <option value="in-progress">в роботі</option>
        <option value="done">виконано</option>
      </select>
      <label for="date" class="input-name">Термін</label>
      <input type="date" v-model="taskDate" />
      <button @click="addTask">Зберегти</button>
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
  min-width: 900px;
  width: 100%;
  position: relative;
  text-align: right;
}

table {
  width: 100%;
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

label {
  padding-right: 5px;
  align-self: flex-start;
}

input {
  background-color: #eeece3;
  border: 2px solid #dad5c6;
  border-radius: 5px;
}

select {
  background-color: #fafafa;
  border: none;
  color: #232e3f;
}

.page-modal select {
  background-color: #eeece3;
  border: 2px solid #dad5c6;
  border-radius: 5px;
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

.page-modal button {
  margin-top: 10px;
}

.input-name {
  color: #232e3f;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
  font-size: 15px;
}

td {
  color: #232e3f;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.sort-container {
  display: flex;
  justify-content: flex-start;
  gap: 100px;
  margin: 20px 0;
}

.sort-item {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
}
</style>
