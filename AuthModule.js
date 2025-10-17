// AuthModule.js
// Simple hash function using closure
const createHasher = () => {
  const hash = (str) =>
    str
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      .toString(16);
  return hash;
};
const hasher = createHasher();

const USERS_KEY = "users";
const SESSION_KEY = "session";

export async function register(username, password) {
  await simulateDelay();
  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if (users.find((u) => u.username === username)) {
    throw new Error("User exists");
  }
  users.push({ username, password: hasher(password) });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function login(username, password) {
  await simulateDelay();
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const user = users.find(
    (u) => u.username === username && u.password === hasher(password)
  );
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function checkSession() {
  await simulateDelay();
  return !!localStorage.getItem(SESSION_KEY);
}

function simulateDelay() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}