<template>
  <div class="popup-overlay" >
    <div class="popup-content" @click.stop>
      <div class="popup-header">
        <h2>Willkommen!</h2>
      </div>

      <div class="popup-body">
        <div class="loadButton">
          <Button label="Neue Datei anlegen" @click="neueDatei" style="margin-right: 10px"/>
        </div>

        <div class="loadButton">
          <input placeholder="Load Data" type="file" @change="ladenLocal($event)" accept=".json" />
        </div>

        <div class="loadButton">
          <Button @click="ladenDatenbank" label="Laden aus der Datenbank" style="margin-right: 10px"/>
          <InputText
              type="text"
              v-model="saveId"
              placeholder="Wie heißt die Datei?"
              @keyup.enter="ladenDatenbank"
          />
        </div>

        <!-- Recent Files Section -->
        <div v-if="recentFiles.length" class="recent-section">
          <h3>Zuletzt verwendete Dateien</h3>
          <div class="recent-files">
            <div
                v-for="file in recentFiles"
                :key="file.name"
                @click="loadRecentFile(file)"
                class="recent-file-item"
            >
              <div class="file-info">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-date">{{ formatDate(file.lastUsed) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status/Error Message -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { saveAllData } from '../service/LoadDatabank'
import { loadData } from '../service/LoadDataLocal'
import { newFile } from '../service/NewFile'
import { ref, onMounted } from "vue";

const saveId = ref('')
const recentFiles = ref<Array<{name: string, lastUsed: Date}>>([])
const errorMessage = ref('')

const RECENT_FILES_KEY = 'drawio_recent_files'
const MAX_RECENT = 5


const emit = defineEmits<{
  close: []
}>();


onMounted(() => {
  loadRecentFiles()
})

// Recent Files laden
const loadRecentFiles = () => {
  const stored = localStorage.getItem(RECENT_FILES_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      recentFiles.value = parsed.map((file: any) => ({
        ...file,
        lastUsed: new Date(file.lastUsed)
      }))
    } catch (e) {
      console.error('Fehler beim Laden der Recent Files:', e)
    }
  }
}


const saveRecentFiles = () => {
  localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(recentFiles.value))
}


const addToRecent = (name: string) => {
  const existingIndex = recentFiles.value.findIndex(f => f.name === name)

  if (existingIndex >= 0) {
    recentFiles.value.splice(existingIndex, 1)
  }

  recentFiles.value.unshift({
    name: name,
    lastUsed: new Date()
  })

  if (recentFiles.value.length > MAX_RECENT) {
    recentFiles.value = recentFiles.value.slice(0, MAX_RECENT)
  }

  saveRecentFiles()
}


const loadRecentFile = async (file: {name: string, lastUsed: Date}) => {
  saveId.value = file.name
  await ladenDatenbank()
}


const formatDate = (date: Date) => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Heute'
  if (diffDays === 2) return 'Gestern'
  if (diffDays <= 7) return `vor ${diffDays} Tagen`

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}


const setError = (message: string) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

const handleClose = () => {
  emit('close');
};

const neueDatei = () => {
  newFile()
  emit('close')
}

const ladenLocal = (event: Event) => {
  loadData(event);
  emit('close');
};

const ladenDatenbank = async () => {
  if (saveId.value.length !== 0) {
    try {
      console.log('saveId value', saveId.value);


      await saveAllData(saveId)


      addToRecent(saveId.value)

      emit('close')
    } catch (error) {
      console.error('Fehler beim Laden:', error)
      setError('Datei konnte nicht geladen werden. Überprüfe den Namen.')
    }
  } else {
    setError('Bitte Dateinamen eintragen')
  }
}


</script>

<style scoped>
.loadButton {
  text-align: center;
  margin: 20px;
}

/* Recent Files Styles */
.recent-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.recent-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  text-align: left;
}

.recent-files {
  margin-bottom: 15px;
}

.recent-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8f9fa;
}

.recent-file-item:hover {
  background: #e9ecef;
  border-color: #007bff;
}

.file-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.file-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.file-date {
  font-size: 12px;
  color: #666;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #c82333;
}

.recent-actions {
  text-align: center;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #5a6268;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 10px;
  margin-top: 15px;
  text-align: center;
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

/* Popup Content */
.popup-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: popupFadeIn 0.3s ease-out;
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 15px;
  border-bottom: 1px solid #eee;
}

.popup-header h2 {
  color: #333;
  margin: 0;
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

/* Body */
.popup-body {
  padding: 20px 30px;
}

/* Footer */
.popup-footer {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 20px 30px 30px;
  border-top: 1px solid #eee;
}

/* Responsive */
@media (max-width: 768px) {
  .popup-content {
    width: 95%;
    margin: 20px;
  }

  .popup-header, .popup-body, .popup-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .popup-footer {
    flex-direction: column;
  }

  .recent-file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .remove-btn {
    align-self: flex-end;
  }
}
</style>