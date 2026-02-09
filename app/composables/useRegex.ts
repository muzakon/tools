export function useRegex() {
  const pattern = ref('Hello');
  const text = ref('Hello World!');
  const error = ref<string | null>(null);

  const flags = reactive({
    global: true,
    ignoreCase: true,
    multiline: false,
    dotAll: false,
    unicode: false,
  });

  const activeFlags = computed(() => {
    let f = '';
    if (flags.global) f += 'g';
    if (flags.ignoreCase) f += 'i';
    if (flags.multiline) f += 'm';
    if (flags.dotAll) f += 's';
    if (flags.unicode) f += 'u';
    return f;
  });

  const regex = computed(() => {
    if (!pattern.value) {
      error.value = null;
      return null;
    }
    try {
      const r = new RegExp(pattern.value, activeFlags.value);
      error.value = null;
      return r;
    } catch (e: any) {
      error.value = e.message;
      return null;
    }
  });

  const matchCount = computed(() => {
    if (!regex.value || !text.value) return 0;
    if (!flags.global) {
      return text.value.match(regex.value) ? 1 : 0;
    }
    const matches = text.value.match(regex.value);
    return matches ? matches.length : 0;
  });

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const highlightedHtml = computed(() => {
    if (!text.value) return '';
    if (!regex.value) return escapeHtml(text.value) + '<br>';

    const src = text.value;
    const re = regex.value;

    let result = '';
    let lastIndex = 0;
    let match;

    const reClone = new RegExp(re.source, re.flags);

    if (reClone.global) {
      while ((match = reClone.exec(src)) !== null) {
        result += escapeHtml(src.slice(lastIndex, match.index));

        const matchText = match[0];
        if (matchText === '' && reClone.lastIndex === lastIndex) {
          reClone.lastIndex++;
        } else {
          result += `<mark class="bg-lime-300 text-black rounded-[2px]">${escapeHtml(matchText)}</mark>`;
        }

        lastIndex = reClone.lastIndex;
      }
    } else {
      match = reClone.exec(src);
      if (match) {
        result += escapeHtml(src.slice(0, match.index));
        result += `<mark class="bg-lime-300 text-black rounded-[2px]">${escapeHtml(match[0])}</mark>`;
        lastIndex = match.index + match[0].length;
      }
    }

    result += escapeHtml(src.slice(lastIndex));

    if (result.endsWith('\n')) {
      result += '<br>';
    }

    return result;
  });

  return {
    pattern,
    text,
    error,
    flags,
    activeFlags,
    regex,
    matchCount,
    highlightedHtml,
  };
}
