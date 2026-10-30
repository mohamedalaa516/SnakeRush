const socket = io("http://localhost:3000", { transports: ["websocket"] });

const loginForm = document.querySelector(".menu-login");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const userName = formData.get("username")?.trim();
  if (!userName) return;
  let playerId = localStorage.getItem("playerId");
  if (!playerId) {
    const uniqueId = window.crypto.randomUUID();
    localStorage.setItem("playerId", uniqueId);
    socket.emit("player:playerId", playerId);
  }
  localStorage.setItem("userName", userName);
  window.location.href = "index.html";
});
