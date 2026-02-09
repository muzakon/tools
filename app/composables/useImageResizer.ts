export function useImageResizer() {
  const imageFile = ref<File | null>(null);
  const imageSrc = ref("");
  const originalWidth = ref(0);
  const originalHeight = ref(0);
  const width = ref(0);
  const height = ref(0);
  const isRatioLocked = ref(true);
  const selectedFormat = ref("PNG");
  const isProcessing = ref(false);

  const aspectRatio = computed(() =>
    originalHeight.value ? originalWidth.value / originalHeight.value : 1
  );

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
      width.value = img.naturalWidth;
      height.value = img.naturalHeight;
      imageSrc.value = url;
    };
    img.src = url;
  }

  function setWidth(val: number) {
    width.value = Math.max(1, Math.round(val));
    if (isRatioLocked.value) {
      height.value = Math.max(1, Math.round(width.value / aspectRatio.value));
    }
  }

  function setHeight(val: number) {
    height.value = Math.max(1, Math.round(val));
    if (isRatioLocked.value) {
      width.value = Math.max(1, Math.round(height.value * aspectRatio.value));
    }
  }

  function applyScale(percent: number) {
    const factor = percent / 100;
    width.value = Math.max(1, Math.round(originalWidth.value * factor));
    height.value = Math.max(1, Math.round(originalHeight.value * factor));
  }

  function resetToOriginal() {
    width.value = originalWidth.value;
    height.value = originalHeight.value;
  }

  function removeImage() {
    if (imageSrc.value) URL.revokeObjectURL(imageSrc.value);
    imageFile.value = null;
    imageSrc.value = "";
    originalWidth.value = 0;
    originalHeight.value = 0;
    width.value = 0;
    height.value = 0;
  }

  async function resizeAndDownload() {
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
      canvas.width = width.value;
      canvas.height = height.value;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width.value, height.value);

      const mimeMap: Record<string, string> = {
        PNG: "image/png",
        JPG: "image/jpeg",
        WEBP: "image/webp",
      };
      const mime = mimeMap[selectedFormat.value] || "image/png";
      const quality = selectedFormat.value === "PNG" ? undefined : 0.92;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, quality)
      );

      if (blob) {
        const ext = selectedFormat.value.toLowerCase();
        const baseName = imageFile.value?.name.replace(/\.[^.]+$/, "") || "image";
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${baseName}-${width.value}x${height.value}.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    imageFile,
    imageSrc,
    originalWidth,
    originalHeight,
    width,
    height,
    isRatioLocked,
    selectedFormat,
    isProcessing,
    hasImage,
    fileSizeText,
    dimensionSummary,
    aspectRatio,
    loadFile,
    setWidth,
    setHeight,
    applyScale,
    resetToOriginal,
    removeImage,
    resizeAndDownload,
  };
}
