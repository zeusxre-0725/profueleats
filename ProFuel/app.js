const products = [
  {id:1,category:"breakfast",name:"Peanut Butter Oats",description:"Warm oats with banana, berries and crunchy toppings.",price:119,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Banana_blueberry_oatmeal.jpg/500px-Banana_blueberry_oatmeal.jpg"},
  {id:2,category:"breakfast",name:"Berry Chia Oats",description:"Creamy oats finished with fresh berries and seeds.",price:129,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Oatmeal_porridge_with_fruits.jpg/500px-Oatmeal_porridge_with_fruits.jpg"},
  {id:3,category:"wraps",name:"Chicken Tikka Wrap",description:"A smoky, spiced chicken tikka filling with fresh greens.",price:149,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg/500px-Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg"},
  {id:4,category:"wraps",name:"Paneer Tikka Wrap",description:"Charred paneer tikka with a bright Indian spice blend.",price:139,image:"assets/paneer-tikka-wrap.png"},
  {id:5,category:"meals",name:"Tandoori Chicken Meal",description:"Charred tandoori chicken with lemon and fresh salad.",price:189,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Tandoori_Chicken-2.jpg/500px-Tandoori_Chicken-2.jpg"},
  {id:6,category:"meals",name:"Masala Egg Plate",description:"Boiled eggs topped with onion, herbs and Indian spices.",price:139,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Masala_Eggs.jpg/500px-Masala_Eggs.jpg"},
  {id:7,category:"meals",name:"Keema Matar",description:"Homestyle minced meat cooked with peas and warming spices.",price:179,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Kheema_Mutter.JPG/500px-Kheema_Mutter.JPG"},
  {id:8,category:"addons",name:"Boiled Masala Eggs",description:"Two boiled eggs finished with a simple masala topping.",price:49,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Boiled_masala_egg.jpg/500px-Boiled_masala_egg.jpg"}
];
let cart = JSON.parse(localStorage.getItem("profuel-cart") || "[]");
let users = JSON.parse(localStorage.getItem("profuel-users") || "[]");
let session = JSON.parse(localStorage.getItem("profuel-session") || "null");
const $ = (selector) => document.querySelector(selector);
const money = (value) => `₹${value}`;

function renderProducts(category = "all") {
  const list = category === "all" ? products : products.filter((product) => product.category === category);
  $("#productGrid").innerHTML = list.map((product) => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info"><h3>${product.name}</h3><p>${product.description}</p>
        <div class="product-bottom"><span class="price">${money(product.price)}</span><button class="add-button" data-add="${product.id}">Add to cart +</button></div>
      </div>
    </article>`).join("");
}
function renderCart() {
  const items = cart.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  $("#cartCount").textContent = items.length;
  $("#cartItems").innerHTML = items.length ? items.map((item, index) => `
    <div class="cart-row"><img src="${item.image}" alt=""><div><h4>${item.name}</h4><p>${money(item.price)}</p><div class="qty"><button data-remove="${index}">−</button><span>1</span><button data-add="${item.id}">+</button></div></div></div>`).join("") : '<div class="cart-empty">Your cart is waiting for something good.</div>';
  $("#cartTotal").textContent = money(items.reduce((sum, item) => sum + item.price, 0));
  localStorage.setItem("profuel-cart", JSON.stringify(cart));
}
function openDrawer(drawer) { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); $("#overlay").classList.add("open"); }
function closeDrawers() { document.querySelectorAll(".cart-drawer,.chat-window").forEach((el) => { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); }); $("#overlay").classList.remove("open"); }
document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const remove = event.target.closest("[data-remove]");
  if (add) { cart.push(Number(add.dataset.add)); renderCart(); }
  if (remove) { cart.splice(Number(remove.dataset.remove), 1); renderCart(); }
  const filter = event.target.closest(".filter");
  if (filter) { document.querySelectorAll(".filter").forEach((button) => button.classList.remove("active")); filter.classList.add("active"); renderProducts(filter.dataset.category); }
  const suggestion = event.target.closest(".chat-suggestions button");
  if (suggestion) { $("#chatInput").value = suggestion.textContent; $("#chatForm").requestSubmit(); }
});
document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", () => { $(".main-nav").classList.remove("mobile-open"); $(".menu-toggle").setAttribute("aria-expanded", "false"); }));
$(".menu-toggle").addEventListener("click", () => { const open = $(".main-nav").classList.toggle("mobile-open"); $(".menu-toggle").setAttribute("aria-expanded", String(open)); });
$("#cartButton").addEventListener("click", () => openDrawer($("#cartDrawer")));
$("#closeCart").addEventListener("click", closeDrawers);
$("#overlay").addEventListener("click", closeDrawers);
$("#openAssistant").addEventListener("click", () => openDrawer($("#chatWindow")));
$("#floatingAi").addEventListener("click", () => openDrawer($("#chatWindow")));
$("#closeChat").addEventListener("click", closeDrawers);
$("#checkout").addEventListener("click", () => alert(cart.length ? "Checkout is ready to connect to your ordering backend." : "Add a meal to your cart first."));
$("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = $("#chatInput"); const message = input.value.trim(); if (!message) return;
  $("#chatBody").insertAdjacentHTML("beforeend", `<div class="chat-bubble" style="background:#002b12;color:#fff;margin-left:35px">${message}</div>`);
  input.value = ""; $("#chatBody").scrollTop = $("#chatBody").scrollHeight;
  let reply = getLocalAssistantReply(message);
  try {
    const response = await fetch("/api/chat", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({message})});
    if (response.ok) reply = (await response.json()).reply || reply;
  } catch (_) {
    // The local fallback keeps the assistant useful until the backend is configured.
  }
  $("#chatBody").insertAdjacentHTML("beforeend", `<div class="chat-bubble">${reply}</div>`);
  $("#chatBody").scrollTop = $("#chatBody").scrollHeight;
});

function getLocalAssistantReply(message) {
  const query = message.toLowerCase();
  const budgetMatch = query.match(/(?:under|below|less than)\s*₹?\s*(\d+)/);
  const budget = budgetMatch ? Number(budgetMatch[1]) : Infinity;
  const vegetarian = /vegetarian|veg\b|paneer/.test(query);
  const breakfast = /breakfast|oats|morning/.test(query);
  const protein = /protein|strength|workout|gym|chicken|egg/.test(query);
  let matches = products.filter((product) => product.price <= budget);
  if (vegetarian) matches = matches.filter((product) => product.id === 1 || product.id === 2 || product.id === 4);
  if (breakfast) matches = matches.filter((product) => product.category === "breakfast");
  if (protein) matches = matches.filter((product) => product.category === "meals" || product.category === "wraps");
  if (!matches.length) return "I couldn’t find a verified menu match for those filters. Try a higher budget or ask about our current menu.";
  const picks = matches.slice(0, 2).map((product) => `${product.name} for ${money(product.price)}`).join(" or ");
  if (/ingredient|contains|made of|allergen/.test(query)) return "Our menu cards show the verified dish descriptions. For allergy-level ingredient checks, please confirm with the ProFuel kitchen before ordering.";
  if (/order|checkout|cart|delivery/.test(query)) return "Add a meal to your cart, review the subtotal, and continue to checkout. Delivery and payment are ready to connect to the ordering backend.";
  return `Try ${picks}. ${protein ? "They are the strongest protein-focused matches in the current menu." : "They fit the preferences and budget you shared."}`;
}

function setSession(user) {
  session = user;
  localStorage.setItem("profuel-session", JSON.stringify(user));
  $("#authButton").textContent = user ? (user.role === "admin" ? "Dashboard" : user.name.split(" ")[0]) : "Log in";
}
function openAuth(mode = "login") {
  $("#authPanel").classList.add("open");
  $("#authPanel").setAttribute("aria-hidden", "false");
  document.querySelectorAll(".auth-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.authMode === mode));
  $("#authLogin").hidden = mode !== "login";
  $("#authSignup").hidden = mode !== "signup";
}
function closeAuth() {
  $("#authPanel").classList.remove("open");
  $("#authPanel").setAttribute("aria-hidden", "true");
}
function openAdmin() {
  if (!session || session.role !== "admin") { openAuth(); return; }
  $("#adminUserName").textContent = session.name;
  $("#adminPanel").classList.add("open");
  $("#adminPanel").setAttribute("aria-hidden", "false");
}
function closeAdmin() {
  $("#adminPanel").classList.remove("open");
  $("#adminPanel").setAttribute("aria-hidden", "true");
}
function showError(id, message) { $(id).textContent = message; }
$("#authButton").addEventListener("click", () => session?.role === "admin" ? openAdmin() : openAuth());
$("#closeAuth").addEventListener("click", closeAuth);
document.querySelectorAll(".auth-tab").forEach((tab) => tab.addEventListener("click", () => openAuth(tab.dataset.authMode)));
$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;
  const account = email === "admin@profueleats.in" && password === "admin123"
    ? {name:"ProFuel Admin", email, role:"admin"}
    : users.find((user) => user.email === email && user.password === password);
  if (!account) { showError("#loginError", "That email or password doesn’t match our records."); return; }
  showError("#loginError", ""); setSession(account); closeAuth(); if (account.role === "admin") openAdmin();
});
$("#signupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#signupName").value.trim();
  const email = $("#signupEmail").value.trim().toLowerCase();
  const password = $("#signupPassword").value;
  if (users.some((user) => user.email === email) || email === "admin@profueleats.in") { showError("#signupError", "An account with this email already exists."); return; }
  const account = {name, email, password, role:"customer"};
  users.push(account); localStorage.setItem("profuel-users", JSON.stringify(users)); setSession({name, email, role:"customer"}); showError("#signupError", ""); closeAuth();
});
$("#adminLogout").addEventListener("click", () => { setSession(null); closeAdmin(); });
$("#adminAddItem").addEventListener("click", () => alert("Menu editor is ready for your backend menu API."));
document.querySelectorAll(".admin-nav").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".admin-nav").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  if (button.classList.contains("forecast-nav")) $("#forecastSection").scrollIntoView({behavior:"smooth", block:"start"});
}));
document.querySelectorAll(".subscribe-button").forEach((button) => button.addEventListener("click", () => {
  if (!session) { openAuth("signup"); return; }
  alert(`${button.dataset.plan} plan selected. Connect this action to your subscription checkout endpoint.`);
}));
const recommendationForm = $("#recommendationForm");
if (recommendationForm) recommendationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const budget = Number($("#budget").value);
  const preference = $("#preference").value;
  const goal = $("#goal").value;
  const restrictions = $("#restrictions").value.trim().toLowerCase();
  let matches = products.filter((product) => product.price <= budget);
  if (preference === "Vegetarian") matches = matches.filter((product) => [1, 2, 4].includes(product.id));
  if (preference === "Chicken-friendly") matches = matches.filter((product) => [3, 5, 7].includes(product.id));
  if (preference === "Egg-friendly") matches = matches.filter((product) => [6, 8].includes(product.id));
  if (/dairy|milk/.test(restrictions)) matches = matches.filter((product) => ![1, 2, 4].includes(product.id));
  if (/egg/.test(restrictions)) matches = matches.filter((product) => ![6, 8].includes(product.id));
  const result = $("#recommendationResult");
  if (!matches.length) {
    result.innerHTML = '<span class="result-mark">!</span><div><strong>No exact match yet.</strong><p>Try widening your budget or removing one restriction. We only recommend meals currently listed on the ProFuel menu.</p></div>';
    return;
  }
  const picks = matches.slice(0, 2);
  result.innerHTML = `<span class="result-mark">✦</span><div><strong>Try ${picks.map((product) => `${product.name} (${money(product.price)})`).join(" or ")}.</strong><p>These are the best current matches for your ${goal.toLowerCase()} goal, ${preference.toLowerCase()} preference and budget.</p></div>`;
});
setSession(session);
renderProducts(); renderCart();
