import chroma from "chroma-js";
import { useClipboard } from "@vueuse/core";

export function useColor() {
  const input = ref("");

  const parsed = computed(() => {
    const val = input.value.trim();
    if (!val) return null;
    try {
      return chroma(val);
    } catch {
      return null;
    }
  });

  const hasError = computed(() => {
    if (!input.value.trim()) return false;
    return parsed.value === null;
  });

  const errorMessage = computed(() => {
    if (!hasError.value) return "";
    return "Invalid color. Enter a valid HEX, RGB, HSL, or CMYK value.";
  });

  const previewColor = computed(() => {
    return parsed.value ? parsed.value.hex() : "#ffffff";
  });

  // Palette: 10 colors from white through the input color to black
  const palette = computed(() => {
    if (!parsed.value) return [];
    return chroma
      .scale(["white", parsed.value.hex(), "black"])
      .mode("lab")
      .colors(10);
  });

  // Conversions
  const hex = computed(() => {
    if (!parsed.value) return "-";
    return parsed.value.hex();
  });

  const rgb = computed(() => {
    if (!parsed.value) return "-";
    const [r, g, b] = parsed.value.rgb();
    return `${r}, ${g}, ${b}`;
  });

  const hsl = computed(() => {
    if (!parsed.value) return "-";
    const [h, s, l] = parsed.value.hsl();
    return `${Math.round(h || 0)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  });

  const cmyk = computed(() => {
    if (!parsed.value) return "-";
    const [c, m, y, k] = parsed.value.cmyk();
    return `${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%`;
  });

  const { copy, copied } = useClipboard();

  return {
    input,
    previewColor,
    hasError,
    errorMessage,
    palette,
    hex,
    rgb,
    hsl,
    cmyk,
    copy,
    copied,
  };
}
