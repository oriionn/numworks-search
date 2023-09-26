console.clear();
setTimeout(console.clear, 1000)
function setCredentials(apiKey, cx) {
  localStorage.setItem("key", apiKey);
  localStorage.setItem("cx", cx);
  return "Your custom Api Key and Cx have been set."
}

function resetCredentials() {
  localStorage.removeItem("key");
  localStorage.removeItem("cx");
  return "Your custom Api Key and Cx have been reset."
}