<template>
  <div class="center-container">
    <a-qrcode value="http://localhost:8080/clasificador" />
    <h2>Clasificador de Componentes</h2>
    <a-button @click="init" v-if="!iniciar">Iniciar Cámara</a-button>
    <div id="webcam-container" style="display: none;"></div>
    <a-button @click="captureAndPredict" v-if="iniciar">Capturar</a-button>

    <div id="label-container" style="display:none;"></div>
<div style="margin-top: 16px;">
  o
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px;">
  <a-button>
    <label for="upload" >
    Subir Imagen
  </label>
</a-button>
  <input type="file" id="upload" style="display: none;" @change="handleFileChange" />



</div>

    <div hidden>
      <form action=".">
        <label>Class</label>
        <input type="text" v-model="predictedClass" readonly />
        <label>Probability</label>
        <input type="number" v-model="maxProbability" step="0.01" readonly />
      </form>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, h } from 'vue';
import * as tmImage from '@teachablemachine/image';
import apiClient from '@/api'; // Asegúrate de que la ruta sea correcta
import { Modal } from 'ant-design-vue';
const URL = "https://teachablemachine.withgoogle.com/models/Hxvr3qbVn/";

let model, webcam, labelContainer;
const maxPredictions = ref(0);
const predictedClass = ref('');
const maxProbability = ref(0);
let imageFile = null;
const iniciar = ref(false);

onMounted(async () => {
  try {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions.value = model.getTotalClasses();
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
  }
});


async function init() {

  // Obtener el contenedor de la webcam
  const webcamContainer = document.getElementById("webcam-container");

  // Limpiar el contenedor al inicio para evitar duplicación
  webcamContainer.innerHTML = '';
  webcamContainer.style.display = 'block';

  // Detener la webcam si ya está en uso
  if (webcam) {
    try {
      await webcam.stop();
    } catch (error) {
      console.error("Error al detener la webcam:", error);
    }
  }

  try {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions.value = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Solo añadir el canvas si no está presente
    if (!webcamContainer.contains(webcam.canvas)) {
      webcamContainer.appendChild(webcam.canvas);
    }

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions.value; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }
    iniciar.value = true;
  } catch (error) {
    console.error("Error al inicializar la webcam:", error);
  }
}

async function loop() {
  if (webcam && webcam.canvas) { // Comprobación adicional
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  } else {
    console.error("Webcam is not ready.");
  }
}

async function predict() {
  if (!webcam || !webcam.canvas) {
    console.error("Webcam or its canvas is not initialized yet.");
    return; // Salir si no está listo
  }

  const prediction = await model.predict(webcam.canvas);
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
}

async function captureAndPredict() {
  if (!webcam || !webcam.canvas) {
    console.error("Webcam is not ready for capture.");
    return; // Salir si la cámara no está lista
  }

  const captureCanvas = document.createElement('canvas');
  captureCanvas.width = webcam.canvas.width;
  captureCanvas.height = webcam.canvas.height;

  const context = captureCanvas.getContext('2d');
  context.drawImage(webcam.canvas, 0, 0);

  await webcam.stop(); // Detener la cámara

  // Realiza la predicción
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

  // Convertir el canvas a Blob para el input de archivo
  captureCanvas.toBlob((blob) => {
    const fileName = `${predictedClassValue.replace(/\s+/g, '-')}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });
    imageFile = file;

    // Llamar a la función para enviar datos a la API
    sendPredictionToAPI(predictedClass.value, maxProbability.value, imageFile);
  });

  // Convertir el canvas en una URL de datos para mostrarlo en el modal
  const imageDataUrl = captureCanvas.toDataURL('image/png');

  Modal.info({
    title: 'Resultado',
    content: h('div', {}, [
      h('p', {}, `Predicción: ${predictedClassValue} con probabilidad de ${(maxProbabilityValue * 100).toFixed(2)}%`),
      h('img', { src: imageDataUrl, alt: 'Imagen capturada', style: 'width: 100%; margin-top: 10px;' }),
      h('div', { style: 'color:red; margin-top: 10px;' }, 'Advertencia: La predicción puede no ser precisa. Solicite retroalimentación de su instructor'),
    ]),
    onOk() {
      console.log('ok');
      const webcamContainer = document.getElementById("webcam-container");
      webcamContainer.style.display = 'none';
    },
  });

  reset();
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
    // message.success('Predicción guardada exitosamente.');
  } catch (error) {
    console.error('Error al guardar la predicción:', error);
    // alert('Error al guardar la predicción.');
  }
}

function reset() {
  // Reiniciar valores de las predicciones
  predictedClass.value = '';
  maxProbability.value = 0;


  // Detener la webcam si está activa
  if (webcam && webcam.stream) {
    webcam.stop().then(() => {
      const webcamContainer = document.getElementById("webcam-container");
      webcamContainer.innerHTML = ''; // Limpiar el contenedor
      iniciar.value = false; // Permitir iniciar de nuevo
    }).catch((error) => {
      console.error("Error al detener la webcam:", error);
    });
  } else {
    iniciar.value = false; // Si no hay webcam, permitir iniciar de nuevo
  }
}

async function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = async () => {
        // Crear un canvas para dibujar la imagen cargada
        const canvas = document.createElement('canvas');
        canvas.width = 200; // Ajusta el tamaño según sea necesario
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Realizar la predicción
        const prediction = await model.predict(canvas);
        let maxProbabilityValue = 0;
        let predictedClassValue = '';

        for (let i = 0; i < maxPredictions.value; i++) {
          if (prediction[i].probability > maxProbabilityValue) {
            maxProbabilityValue = prediction[i].probability;
            predictedClassValue = prediction[i].className;
          }
        }

        predictedClass.value = predictedClassValue;
        maxProbability.value = maxProbabilityValue;

        // Convertir el canvas a una URL de datos para mostrar la imagen en el modal
        const imageDataUrl = canvas.toDataURL('image/png');

        Modal.info({
          title: 'Resultado',
          content: h('div', {}, [
            h('p', {}, `Predicción: ${predictedClassValue} con probabilidad de ${(maxProbabilityValue * 100).toFixed(2)}%`),
            h('img', { src: imageDataUrl, alt: 'Imagen cargada', style: 'width: 100%; margin-top: 10px;' }),
            h('div', { style: 'color:red; margin-top: 10px;' }, 'Advertencia: La predicción puede no ser precisa. Solicite retroalimentación de su instructor'),
          ]),
        });

        // Llamar a la API con los datos y el archivo cargado
        await sendPredictionToAPI(predictedClass.value, maxProbability.value, file);

        // Limpiar el input de archivo después de enviar a la API
        event.target.value = ''; // Esto limpia el valor del input
      };
    };
    reader.readAsDataURL(file);
  }
}

</script>
  
  <style scoped>
.center-container {
  display: flex;
  flex-direction: column; /* Orienta los elementos en columna */
  align-items: center; /* Centra horizontalmente */
  justify-content: center; /* Centra verticalmente si el contenedor tiene altura */
  min-height: 50vh; /* Ocupa toda la altura de la ventana */
  margin: 0 auto; /* Centra el contenedor principal */
}
</style>