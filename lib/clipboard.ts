/**
 * 클립보드 복사 유틸
 * 1순위: navigator.clipboard.writeText (HTTPS / localhost)
 * 2순위: document.execCommand('copy') - HTTP 환경, 구형 브라우저 등 폴백
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1) Modern Clipboard API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 권한 거부 등 → 폴백으로 계속
    }
  }

  // 2) execCommand 폴백 (HTTP 환경, WebView 등에서도 동작)
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText =
      "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}