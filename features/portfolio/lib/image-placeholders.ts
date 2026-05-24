export const fallbackBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTAnIHZpZXdCb3g9JzAgMCAxNiAxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB5MT0nMCcgeDI9JzEnIHkyPScxJz48c3RvcCBzdG9wLWNvbG9yPScjMTExJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjNDQ0Jy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgZmlsbD0ndXJsKCNnKScgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJy8+PHBhdGggZD0nTTAgMTBoMTZMMTAgNEw3IDdMNSA1eicgZmlsbD0nIzg4OCcgZmlsbC1vcGFjaXR5PScuNDUnLz48L3N2Zz4=";

export async function createBlurDataURL(file: File) {
  if (!file.type.startsWith("image/")) {
    return undefined;
  }

  const image = document.createElement("img");
  const objectUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Image preview could not be loaded."));
      image.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    const size = 12;
    const ratio = image.naturalWidth / image.naturalHeight || 1;
    canvas.width = ratio >= 1 ? size : Math.max(1, Math.round(size * ratio));
    canvas.height = ratio >= 1 ? Math.max(1, Math.round(size / ratio)) : size;

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    context.filter = "grayscale(1)";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.45);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
