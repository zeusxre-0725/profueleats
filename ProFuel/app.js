const products = [
  {id:1,category:"breakfast",name:"Super Banana Oats",description:"Creamy oats with banana and nourishing toppings.",price:99,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Banana_blueberry_oatmeal.jpg/500px-Banana_blueberry_oatmeal.jpg"},
  {id:2,category:"breakfast",name:"Crispy Apple Oats",description:"Warm oats with crisp apple and a lightly spiced finish.",price:109,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Oatmeal_porridge_with_fruits.jpg/500px-Oatmeal_porridge_with_fruits.jpg"},
  {id:3,category:"breakfast",name:"Protein Packed Oats",description:"A filling oat bowl made for a stronger start.",price:149,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Oatmeal_porridge_with_fruits.jpg/500px-Oatmeal_porridge_with_fruits.jpg"},
  {id:4,category:"breakfast",name:"Classic Bread Peanut Butter",description:"Toasted bread with smooth peanut butter.",price:39,image:"https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=85"},
  {id:5,category:"breakfast",name:"Loaded Bread Peanut Butter",description:"Toasted bread loaded with generous peanut butter.",price:69,image:"https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=85"},
  {id:6,category:"wraps",name:"Paneer Power Wrap",description:"Spiced paneer, fresh vegetables and a hearty roll.",price:119,image:"assets/paneer-tikka-wrap.png"},
  {id:7,category:"wraps",name:"Chicken Power Wrap",description:"Seasoned chicken with greens in a satisfying wrap.",price:129,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg/500px-Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg"},
  {id:8,category:"wraps",name:"Spicy Chicken Rice Wrap",description:"Spiced chicken and rice wrapped for an easy meal.",price:149,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg/500px-Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg"},
  {id:9,category:"wraps",name:"Veg Protein Wrap",description:"Vegetables and plant protein in a fresh wrap.",price:109,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/-Egg_wrap_-Delicious_-Tempted_-Friends_-Fun_-Bike_Ride_-Golden_memories.jpg/500px--Egg_wrap_-Delicious_-Tempted_-Friends_-Fun_-Bike_Ride_-Golden_memories.jpg"},
  {id:10,category:"meals",name:"Egg Power Meal",description:"A protein-focused egg meal with fresh sides.",price:109,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Masala_Eggs.jpg/500px-Masala_Eggs.jpg"},
  {id:11,category:"meals",name:"Chicken Power Bowl",description:"Seasoned chicken with grains and colourful vegetables.",price:149,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Tandoori_Chicken-2.jpg/500px-Tandoori_Chicken-2.jpg"},
  {id:12,category:"meals",name:"Chicken Fuel Wrap",description:"A filling chicken wrap for busy, active days.",price:129,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg/500px-Chicken_Shawarma_Wrap_-_Lavash_2024-09-11.jpg"},
  {id:13,category:"meals",name:"Spicy Chicken Rice Bowl",description:"Spicy chicken and rice with fresh vegetables.",price:149,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Tandoori_Chicken-2.jpg/500px-Tandoori_Chicken-2.jpg"},
  {id:14,category:"addons",name:"Extra Protein",description:"Add an extra protein serving to your meal.",price:30,image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Tandoori_Chicken-2.jpg/500px-Tandoori_Chicken-2.jpg"},
  {id:15,category:"addons",name:"Extra Peanut Butter",description:"A rich peanut butter boost for oats or toast.",price:20,image:"https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=85"},
  {id:16,category:"addons",name:"Fresh Fruits",description:"Fresh seasonal fruit to complete your meal.",price:15,image:"https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=85"}
];
let cart = JSON.parse(localStorage.getItem("profuel-cart") || "[]");
let users = JSON.parse(localStorage.getItem("profuel-users") || "[]");
let session = JSON.parse(localStorage.getItem("profuel-session") || "null");
const $ = (selector) => document.querySelector(selector);
const money = (value) => `₹${value}`;

function renderProducts(category = "all") {
  const groups = [
    {key:"breakfast", title:"OATS BOWLS", subtitle:"Nutritious. Delicious. Energising.", icon:"⌁"},
    {key:"wraps", title:"WRAPS", subtitle:"Healthy. Filling. On-the-Go.", icon:"✦"},
    {key:"meals", title:"EGG & CHICKEN MEALS", subtitle:"High Protein. Great Taste.", icon:"◯"},
    {key:"addons", title:"ADD-ONS", subtitle:"Enhance Your Meal.", icon:"+"}
  ];
  const renderCard = (product) => `
    <article class="menu-line">
      <div><strong>${product.name}</strong><small>${product.description}</small></div>
      <span class="menu-line-price">${money(product.price)}</span>
      <button class="menu-add" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button>
    </article>`;
  const visibleGroups = category === "all" ? groups : groups.filter((group) => group.key === category);
  $("#productGrid").innerHTML = visibleGroups.map((group) => {
    const items = products.filter((product) => product.category === group.key);
    return `<section class="menu-board menu-board-${group.key}">
      <div class="menu-board-copy">
        <header class="menu-board-heading"><span class="menu-board-icon">${group.icon}</span><div><h3>${group.title}</h3><p>${group.subtitle}</p></div></header>
        <div class="menu-lines">${items.map(renderCard).join("")}</div>
      </div>
      <img class="menu-board-image" src="${items[0].image}" alt="${group.title.toLowerCase()}" loading="lazy">
    </section>`;
  }).join("");
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
  if (vegetarian) matches = matches.filter((product) => [1, 2, 3, 4, 5, 6, 9, 15, 16].includes(product.id));
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
  if (preference === "Vegetarian") matches = matches.filter((product) => [1, 2, 3, 4, 5, 6, 9, 15, 16].includes(product.id));
  if (preference === "Chicken-friendly") matches = matches.filter((product) => [7, 8, 11, 12, 13, 14].includes(product.id));
  if (preference === "Egg-friendly") matches = matches.filter((product) => product.id === 10);
  if (/dairy|milk/.test(restrictions)) matches = matches.filter((product) => ![6, 15].includes(product.id));
  if (/egg/.test(restrictions)) matches = matches.filter((product) => product.id !== 10);
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
