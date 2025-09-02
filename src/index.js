import MedicalPdfEditor from './components/MedicalPdfEditor.vue';
// import SignatureCanvas from './components/SignatureCanvas.vue';

export const install = (app) => {
  app.component('MedicalPdfEditor', MedicalPdfEditor);
  // app.component('SignatureCanvas', SignatureCanvas);
};

export { MedicalPdfEditor };
