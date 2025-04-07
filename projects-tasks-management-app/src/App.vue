<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";
import ProjectPage from "./pages/ProjectPage.vue";
import Modal from "./components/Modal.vue";
export default {
  data() {
    return {
      project: [],
      id: "",
      projectName: "",
    };
  },
  components: { Modal },

  setup() {
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    return {
      isModalOpen,
      openModal,
      closeModal,
    };
  },

  methods: {
    SendData() {
      project.push({
        id: this.id,
        title: this.projectName,
      });
    },
  },
};
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>Назва проєкту</th>
          <th>Кількість завдань</th>
          <th>Статус</th>
          <th>Дата створення</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td {{ row.id }}></td>
          <td>{{ projectName }}</td>
          <td contenteditable="true"></td>
          <td>
            <select name="status" id="status">
              <option value="default" desabled></option>
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </td>
          <td>
            <input type="date" name="event_date_1" id="date" />
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="openModal" class="open-modal">Додати проєкт</button>
    <Modal :isVisible="isModalOpen" @close="closeModal" class="modal">
      <label for="name" class="input-name">Назва проєкту</label>
      <input type="text" v-model="projectName" id="name" required />
      <label for="description" class="input-name">Опис проєкту</label>
      <textarea id="description"></textarea>
      <button @click="SendData()">Зберегти</button>
    </Modal>
  </div>
</template>

<style scoped>
.table-wrap {
  position: relative;
  max-width: 550px;
  text-align: right;
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
  padding: 10px;
}

thead th {
  border: none;
}

td {
  padding: 10px;
  border: 1px solid #dad5c6;
}

select {
  background-color: #fafafa;
}

#status,
#date {
  border: none;
  color: #232e3f;
}

button {
  background-color: #cf9421;
  color: #fafafa;
  font-family: "Monterrat", sans-serif;
  font-weight: 400;
  border-radius: 10px;
  padding: 10px;
  border: none;
  cursor: pointer;
}

label {
  padding-right: 5px;
}

input,
textarea {
  background-color: #eeece3;
  border: 2px solid #dad5c6;
  border-radius: 5px;
}

.modal input {
  margin-bottom: 10px;
}

.modal button {
  margin-top: 10px;
}

.input-name {
  color: #232e3f;
  font-family: "Monterrat", sans-serif;
  font-weight: 300;
  font-size: 15px;
}
</style>
