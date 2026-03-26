const input = document.getElementById("takeInput");
const charCount = document.getElementById("charCount");
const submitBtn = document.getElementById("submitBtn");
const container = document.getElementById("takesContainer");

const escapeHtml = (str) => {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[m],
  );
};

input.addEventListener("input", () => {
  charCount.textContent = `${input.value.length} / 280`;
});

submitBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  const res = await fetch("/api/takes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (res.ok) {
    input.value = "";
    charCount.textContent = "0 / 280";
    loadTakes();
  }
});

const createCard = (take) => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div>${escapeHtml(take.text)}</div>
    <div class="actions">
      <button onclick="vote('${take._id}', 'agree', this)">🔥 ${take.agrees}</button>
      <button onclick="vote('${take._id}', 'disagree', this)">💀 ${take.disagrees}</button>
    </div>
  `;

  return div;
};

window.vote = async (id, type, btn) => {
  const count = btn.innerText.split(" ")[1];
  btn.innerText = `${btn.innerText.split(" ")[0]} ${parseInt(count) + 1}`;

  await fetch(`/api/takes/${id}/${type}`, {
    method: "PATCH",
  });
};

const loadTakes = async () => {
  const res = await fetch("/api/takes");
  const takes = await res.json();

  container.innerHTML = "";

  if (!takes.length) {
    container.innerHTML = `<div class="empty">No hot takes yet. Be brave.</div>`;
    return;
  }

  takes.forEach((take) => {
    container.appendChild(createCard(take));
  });
};

loadTakes();