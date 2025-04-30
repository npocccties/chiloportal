export function getCookieValue(key: string): string {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    var cookiesArray = cookie.split("=");
    if (cookiesArray[0].trim() == key.trim()) {
      return cookiesArray[1]; // (key[0],value[1])
    }
  }
  return "";
}
