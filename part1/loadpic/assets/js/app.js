const uploadPhotoBtn  = document.getElementById('uploadPhotoBtn');
const photoInput      = document.getElementById('photoInput');
const photoCanvas     = document.getElementById('photoCanvas');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const errorMsg        = document.getElementById('errorMsg');

const ctx = photoCanvas.getContext('2d');

// Ajustar el tamaño del canvas al tamaño visual del recuadro
function resizeCanvasToDisplaySize() {
  const rect = photoCanvas.getBoundingClientRect();
  // rect.width / rect.height respetan el aspect-ratio 3/4 del CSS
  photoCanvas.width  = rect.width;
  photoCanvas.height = rect.height;
}

function clearCanvas() {
  resizeCanvasToDisplaySize();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, photoCanvas.width, photoCanvas.height);
}

// Inicialmente, limpiar el canvas
clearCanvas();

// 1) Cuando se presiona el botón, abrimos el prompt de archivos
uploadPhotoBtn.addEventListener('click', () => {
  errorMsg.textContent = '';
  photoInput.click();
});

// 2) Cuando el usuario elige un archivo
photoInput.addEventListener('change', () => {
  errorMsg.textContent = '';

  const file = photoInput.files[0];
  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    errorMsg.textContent = 'Por favor selecciona un archivo de imagen.';
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      // Ajustar canvas al tamaño visual actual
      resizeCanvasToDisplaySize();

      // Limpiar fondo
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, photoCanvas.width, photoCanvas.height);

      // Calcular cómo encajar la imagen dentro del recuadro (cover o contain)
      const canvasAspect = photoCanvas.width / photoCanvas.height;
      const imgAspect    = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      // Vamos a hacer un "cover": la imagen llena el canvas, recortando si es necesario
      if (imgAspect > canvasAspect) {
        // imagen más "ancha" que el canvas
        drawHeight = photoCanvas.height;
        drawWidth  = img.width * (drawHeight / img.height);
        offsetX    = (photoCanvas.width - drawWidth) / 2;
        offsetY    = 0;
      } else {
        // imagen más "alta" (o igual proporción)
        drawWidth  = photoCanvas.width;
        drawHeight = img.height * (drawWidth / img.width);
        offsetX    = 0;
        offsetY    = (photoCanvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Ocultar el placeholder
      uploadPlaceholder.style.display = 'none';
    };

    img.onerror = function () {
      errorMsg.textContent = 'No se pudo cargar la imagen seleccionada.';
    };

    img.src = event.target.result;
  };

  reader.onerror = function () {
    errorMsg.textContent = 'Ocurrió un error al leer el archivo.';
  };

  reader.readAsDataURL(file);
});

// Si quisieras obtener luego la imagen en base64:
// const dataUrl = photoCanvas.toDataURL('image/png');
