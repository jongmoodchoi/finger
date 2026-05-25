const USER_KEY = "finger_user";
const RECORD_KEY = "finger_records";

const usernameInput = document.getElementById("username");
const saveUserButton = document.getElementById("saveUser");
const activeUserText = document.getElementById("activeUser");
const form = document.getElementById("recordForm");
const recordsList = document.getElementById("records");
const memoInput = document.getElementById("memo");

function getCurrentUser() {
  return localStorage.getItem(USER_KEY) || "";
}

function setCurrentUser(name) {
  localStorage.setItem(USER_KEY, name);
}

function getAllRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORD_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAllRecords(data) {
  localStorage.setItem(RECORD_KEY, JSON.stringify(data));
}

function renderUser() {
  const user = getCurrentUser();
  activeUserText.textContent = user ? `현재 사용자: ${user}` : "사용자를 먼저 저장해 주세요.";
}

function renderRecords() {
  const user = getCurrentUser();
  recordsList.innerHTML = "";

  if (!user) {
    return;
  }

  const all = getAllRecords();
  const entries = all[user] || [];

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "아직 저장된 기록이 없습니다.";
    recordsList.appendChild(empty);
    return;
  }

  entries
    .slice()
    .reverse()
    .forEach((entry) => {
      const li = document.createElement("li");
      const activities = entry.activities.length > 0 ? entry.activities.join(", ") : "선택 없음";
      li.textContent = `${entry.date} | ${activities}${entry.memo ? ` | 메모: ${entry.memo}` : ""}`;
      recordsList.appendChild(li);
    });
}

saveUserButton.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("이름 또는 별명을 입력해 주세요.");
    return;
  }

  setCurrentUser(name);
  usernameInput.value = "";
  renderUser();
  renderRecords();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = getCurrentUser();

  if (!user) {
    alert("먼저 사용자를 저장해 주세요.");
    return;
  }

  const selectedActivities = Array.from(form.querySelectorAll("input[name='activity']:checked")).map(
    (checkbox) => checkbox.value
  );
  const memo = memoInput.value.trim();

  const allUserRecords = getAllRecords();
  const userRecords = allUserRecords[user] || [];
  userRecords.push({
    date: new Date().toLocaleString("ko-KR"),
    activities: selectedActivities,
    memo
  });
  allUserRecords[user] = userRecords;
  saveAllRecords(allUserRecords);

  form.reset();
  renderRecords();
});

renderUser();
renderRecords();
