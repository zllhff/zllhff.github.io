export function nextOpenState(currentOpenId, clickedId) {
  return currentOpenId === clickedId ? null : clickedId;
}
