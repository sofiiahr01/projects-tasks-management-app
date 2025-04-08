<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #eeece3;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  width: 300px;
  text-align: center;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
}

select {
  background-color: #eeece3;
  border: 2px solid #dad5c6;
  border-radius: 5px;
}

.page-modal {
  display: flex;
  flex-direction: column;
}
</style>
