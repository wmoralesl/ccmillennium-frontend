<template>
    <div>Teachable Machine Image Model</div>
    <button type="button" @click="init">Start</button>
    <button type="button" @click="captureAndPredict">Capture and Predict</button>
    <div id="webcam-container"></div>
    <div id="label-container"></div>
  
   <div hidden>
    <form action=".">
      <label>Class</label>
      <input type="text" v-model="predictedClass" readonly />
      <label>Probability</label>
      <input type="number" v-model="maxProbability" step="0.01" readonly />
      <label>Image</label>
      <input type="file" @change="handleFileChange" />
    </form>
   </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import * as tmImage from '@teachablemachine/image';
  import apiClient from '@/api'; // Asegúrate de que la ruta sea correcta
  
  const URL = "https://teachablemachine.withgoogle.com/models/Hxvr3qbVn/";
  
  let model, webcam, labelContainer;
  const maxPredictions = ref(0);
  const predictedClass = ref('');
  const maxProbability = ref(0);
  let imageFile = null;
  
  async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
  
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions.value = model.getTotalClasses();
  
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);
  
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions.value; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }
  }
  
  async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }
  
  async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions.value; i++) {
      const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;
    }
  }
  
  async function captureAndPredict() {
  const captureCanvas = document.createElement('canvas');
  captureCanvas.width = webcam.canvas.width;
  captureCanvas.height = webcam.canvas.height;

  const context = captureCanvas.getContext('2d');
  context.drawImage(webcam.canvas, 0, 0);

  webcam.stop(); // Detener la cámara

  const prediction = await model.predict(captureCanvas);
  labelContainer.innerHTML = '';

  let maxProbabilityValue = 0;
  let predictedClassValue = '';

  for (let i = 0; i < maxPredictions.value; i++) {
    const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.appendChild(document.createElement("div")).innerHTML = classPrediction;

    if (prediction[i].probability > maxProbabilityValue) {
      maxProbabilityValue = prediction[i].probability;
      predictedClassValue = prediction[i].className;
    }
  }

  predictedClass.value = predictedClassValue;
  maxProbability.value = maxProbabilityValue;

  // Convert canvas to Blob for file input
  captureCanvas.toBlob((blob) => {
    // Usar el nombre de la clase para crear el nombre del archivo
    const fileName = `${predictedClassValue.replace(/\s+/g, '-')}.png`; // Reemplaza espacios con guiones y añade .png
    const file = new File([blob], fileName, { type: 'image/png' });
    imageFile = file;

    // Llamar a la función para enviar datos a la API
    sendPredictionToAPI(predictedClass.value, maxProbability.value, imageFile);
  });

  alert(`Predicción: ${predictedClassValue} con probabilidad de ${maxProbabilityValue.toFixed(2)}`);
}
  
  // Función para enviar datos a la API
  async function sendPredictionToAPI(className, probability, image) {
    const formData = new FormData();
    formData.append('class_name', className);
    formData.append('prediction_value', probability);
    formData.append('image', image);
  
    try {
      const response = await apiClient.post('predictions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Importante para subir archivos
        },
      });
      console.log('Predicción guardada:', response.data);
      alert('Predicción guardada exitosamente.');
    } catch (error) {
      console.error('Error al guardar la predicción:', error);
      alert('Error al guardar la predicción.');
    }
  }
  </script>
  
  