// Fake photo counts for previewing the layout until entries store photos.
// Gives each entry a stable 0, 1 or 2 based on its id.
export function getMockPhotoCount(entryId: string) {
  let sum = 0;
  for (const char of entryId) {
    sum += char.charCodeAt(0);
  }
  return sum % 3;
}
