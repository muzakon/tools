export function useBase64() {
  const input = ref("");
  const mode = ref(0); // 0 = Decode, 1 = Encode

  const output = computed(() => {
    const text = input.value;
    if (!text) return "";

    if (mode.value === 1) {
      // Encode
      try {
        return btoa(
          new TextEncoder()
            .encode(text)
            .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
        );
      } catch {
        return "";
      }
    }

    // Decode
    try {
      const binary = atob(text.trim());
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      return "";
    }
  });

  const hasError = computed(() => {
    if (!input.value) return false;
    if (mode.value === 0) {
      try {
        atob(input.value.trim());
        return false;
      } catch {
        return true;
      }
    }
    return false;
  });

  const errorMessage = computed(() => {
    if (!hasError.value) return "";
    return "Invalid Base64 string. Please check your input.";
  });

  const inputLabel = computed(() => (mode.value === 0 ? "Base64" : "Text"));
  const outputLabel = computed(() => (mode.value === 0 ? "Text" : "Base64"));

  return {
    input,
    mode,
    output,
    hasError,
    errorMessage,
    inputLabel,
    outputLabel,
  };
}
