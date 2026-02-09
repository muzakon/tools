export function useImageCompressor() {
  const imageFile = ref<File | null>(null);
  const imageSrc = ref("");
  const originalWidth = ref(0);
  const originalHeight = ref(0);
  const quality = ref(80);
  const selectedFormat = ref("JPG");
  const isProcessing = ref(false);

  const hasImage = computed(() => !!imageSrc.value);

  const fileSizeText = computed(() => {
    if (!imageFile.value) return "";
    const bytes = imageFile.value.size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  });

  const dimensionSummary = computed(() => {
    if (!hasImage.value) return "";
    return `${originalWidth.value} × ${originalHeight.value}`;
  });

  function loadFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;

    imageFile.value = file;
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      originalWidth.value = img.naturalWidth;
      originalHeight.value = img.naturalHeight;
      imageSrc.value = url;
    };
    img.src = url;
  }

  function applyPreset(label: string) {
    const match = label.match(/\((\d+)%\)/);
    if (match) quality.value = Number(match[1]);
  }

  function removeImage() {
    if (imageSrc.value) URL.revokeObjectURL(imageSrc.value);
    imageFile.value = null;
    imageSrc.value = "";
    originalWidth.value = 0;
    originalHeight.value = 0;
    quality.value = 80;
  }

  async function compressAndDownload() {
    if (!imageSrc.value || isProcessing.value) return;
    isProcessing.value = true;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageSrc.value;
      });

      const canvas = document.createElement("canvas");
      canvas.width = originalWidth.value;
      canvas.height = originalHeight.value;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, originalWidth.value, originalHeight.value);

      const mimeMap: Record<string, string> = {
        PNG: "image/png",
        JPG: "image/jpeg",
        WEBP: "image/webp",
      };
      const mime = mimeMap[selectedFormat.value] || "image/jpeg";
      // PNG is lossless so quality param is ignored by the browser
      const q = selectedFormat.value === "PNG" ? undefined : quality.value / 100;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, q)
      );

      if (blob) {
        const ext = selectedFormat.value.toLowerCase();
        const baseName =
          imageFile.value?.name.replace(/\.[^.]+$/, "") || "image";
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${baseName}-compressed.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    imageSrc,
    quality,
    selectedFormat,
    isProcessing,
    hasImage,
    fileSizeText,
    dimensionSummary,
    loadFile,
    applyPreset,
    removeImage,
    compressAndDownload,
  };
}
