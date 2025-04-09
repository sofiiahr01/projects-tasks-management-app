import { ref, onMounted } from "vue";

export function useResizableColumns(minWidths: number[], headers: any[]) {
  const columnWidths = ref<number[]>([...minWidths]);
  const resizingCol = ref<number | null>(null);
  const startX = ref(0);
  const startWidth = ref(0);
  const WIDTHS_KEY = "vue-table-column-widths";

  const startResize = (event: MouseEvent, index: number) => {
    resizingCol.value = index;
    startX.value = event.clientX;
    startWidth.value = headers[index].value?.offsetWidth || 0;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (resizingCol.value !== null) {
      const delta = event.clientX - startX.value;
      const newWidth = startWidth.value + delta;
      if (newWidth >= minWidths[resizingCol.value]) {
        columnWidths.value[resizingCol.value] = newWidth;
        updateWidths();
        saveWidthsToLocalStorage();
      }
    }
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopResize);
    resizingCol.value = null;
  };

  const updateWidths = () => {
    headers.forEach((header, i) => {
      const th = header.value;
      if (th) th.style.width = columnWidths.value[i] + "px";
    });
  };

  const saveWidthsToLocalStorage = () => {
    localStorage.setItem(WIDTHS_KEY, JSON.stringify(columnWidths.value));
  };

  onMounted(() => {
    const saved = localStorage.getItem(WIDTHS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          columnWidths.value = parsed;
        }
      } catch (e) {
        console.error("Не вдалося прочитати ширину колонок з localStorage");
      }
    }
    updateWidths();
  });

  return {
    columnWidths,
    startResize,
  };
}
