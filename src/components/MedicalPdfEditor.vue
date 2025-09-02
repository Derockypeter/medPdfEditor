<template>
  <div class="medical-pdf-editor">
    <VuePdfEditor
      :width="width"
      :height="height"
      :show-choose-file-btn="showChooseFileBtn"
      :show-customize-editor="showCustomizeEditor"
      :show-customize-editor-add-text="showAddText"
      :show-customize-editor-add-img="showAddImg"
      :show-customize-editor-add-draw="showAddDraw"
      :show-line-size-select="showLineSizeSelect"
      :show-font-size-select="showFontSizeSelect"
      :show-font-select="showFontSelect"
      :show-rename="showRename"
      :show-save-btn="showSaveBtn"
      :save-to-upload="saveToUpload"
      :init-file-src="initFileSrc"
      :init-file="initFile"
      :init-file-name="initFileName"
      :init-text-fields="initTextFields"
      :init-image-urls="initImageUrls"
      :init-image-scale="initImageScale"
      :seal-image-show="sealImageShow"
      :seal-image-hidden-on-save="sealImageHiddenOnSave"
      @onSave2Upload="handleSave"
    />
    <button @click="addRedaction">Add Redaction</button>
    <div v-if="auditLogs.length">
      <h3>Audit Logs</h3>
      <ul>
        <li v-for="log in auditLogs" :key="log.id">{{ log.timestamp }} - {{ log.action }} by {{ log.user }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VuePdfEditor from '@libresign/vue-pdf-editor';
import { PDFDocument } from 'pdf-lib';
import { addAuditLog, getAuditLogs } from '../utils/auditLog';
import { applyRedaction } from '../plugins/redaction';

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
  showChooseFileBtn: { type: Boolean, default: true },
  showCustomizeEditor: { type: Boolean, default: true },
  showAddText: { type: Boolean, default: true },
  showAddImg: { type: Boolean, default: true },
  showAddDraw: { type: Boolean, default: true },
  showLineSizeSelect: { type: Boolean, default: true },
  showFontSizeSelect: { type: Boolean, default: true },
  showFontSelect: { type: Boolean, default: true },
  showRename: { type: Boolean, default: true },
  showSaveBtn: { type: Boolean, default: true },
  saveToUpload: { type: Boolean, default: false },
  initFileSrc: { type: String, default: '' },
  initFile: { type: File, default: null },
  initFileName: { type: String, default: '' },
  initTextFields: { type: Array, default: () => [] },
  initImageUrls: { type: Array, default: () => [] },
  initImageScale: { type: Number, default: 0.2 },
  sealImageShow: { type: Boolean, default: true },
  sealImageHiddenOnSave: { type: Boolean, default: true },
  user: { type: String, default: 'Anonymous' }  // For audit
});

const emit = defineEmits(['onSave']);

const auditLogs = ref([]);

onMounted(() => {
  auditLogs.value = getAuditLogs();
});

const addRedaction = async () => {
  // Simulate redaction: Add black rectangle (extend with canvas overlay if needed)
  applyRedaction();  // Custom plugin logic
  addAuditLog({ action: 'Redaction added', user: props.user });
  auditLogs.value = getAuditLogs();
};

const handleSave = async (pdfBytes, fileName) => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  // Flatten annotations (medical immutability)
  await pdfDoc.flatten();
  const savedBytes = await pdfDoc.save();
  addAuditLog({ action: 'Document saved', user: props.user });
  emit('onSave', savedBytes, fileName);
};
</script>

<style>
.medical-pdf-editor { position: relative; }
</style>
