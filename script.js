// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (email) {
      localStorage.setItem("dormsphereUser", email);

      // Always show setup page
      window.location.href = "setup.html";
    }
  });
}

// SETUP PAGE
const setupForm = document.getElementById("setupForm");

if (setupForm) {
  setupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const college = document.getElementById("collegeName").value.trim();
    const hostel = document.getElementById("hostelName").value.trim();
    const room = document.getElementById("roomNumber").value.trim();

    if (college && hostel && room) {
      localStorage.setItem("dormsphereCollege", college);
      localStorage.setItem("dormsphereHostel", hostel);
      localStorage.setItem("dormsphereRoom", room);

      window.location.href = "home.html";
    }
  });
}

// USER + LOGOUT
const userEmail = document.getElementById("userEmail");

if (userEmail) {
  const savedUser = localStorage.getItem("dormsphereUser");
  userEmail.textContent = savedUser || "Student";
}

function logout() {
  localStorage.removeItem("dormsphereUser");
  window.location.href = "index.html";
}

// HOME SEARCH
const search = document.getElementById("featureSearch");

if (search) {
  search.addEventListener("input", function () {
    const value = search.value.toLowerCase();

    document.querySelectorAll(".module-card").forEach(function (card) {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(value) ? "block" : "none";
    });
  });
}

// HOMEPAGE COUNTERS + GREETING
function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let current = 0;
  const increment = Math.max(1, Math.ceil(target / 30));

  const timer = setInterval(function () {
    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    element.textContent = current;
  }, 30);
}

function updateGreeting() {
  const greeting = document.getElementById("greetingText");
  if (!greeting) return;

  const hour = new Date().getHours();
  let text = "Welcome";

  if (hour < 12) {
    text = "Good Morning";
  } else if (hour < 17) {
    text = "Good Afternoon";
  } else {
    text = "Good Evening";
  }

  greeting.textContent = `${text}, Prachi 👋`;
}

function updateHomeStats() {
  const messReviews = JSON.parse(localStorage.getItem("dormsphereMessReviews")) || [];
  const studyCircles = JSON.parse(localStorage.getItem("dormsphereStudyCircles")) || [];
  const lostItems = JSON.parse(localStorage.getItem("dormsphereLostItems")) || [];
  const products = JSON.parse(localStorage.getItem("dormsphereProducts")) || [];

  const homeMessRating = document.getElementById("homeMessRating");
  const homeMessText = document.getElementById("homeMessText");
  const homeSummary = document.getElementById("homeSummary");

  const collegeDisplay = document.getElementById("collegeDisplay");
  const hostelDisplay = document.getElementById("hostelDisplay");
  const roomDisplay = document.getElementById("roomDisplay");

  const college = localStorage.getItem("dormsphereCollege");
  const hostel = localStorage.getItem("dormsphereHostel");
  const room = localStorage.getItem("dormsphereRoom");

  if (collegeDisplay) collegeDisplay.textContent = college || "College";
  if (hostelDisplay) hostelDisplay.textContent = hostel || "Hostel";
  if (roomDisplay) roomDisplay.textContent = room || "101";

  animateCounter("homeStudyCount", studyCircles.length);
  animateCounter("homeLostCount", lostItems.length);
  animateCounter("homeMarketCount", products.length);

  if (homeSummary) {
    homeSummary.textContent =
      `You have ${studyCircles.length} active study circles, ${lostItems.length} lost & found reports, and ${products.length} marketplace listings available.`;
  }

  if (homeMessRating && homeMessText) {
    if (messReviews.length === 0) {
      homeMessRating.textContent = "0.0";
      homeMessText.textContent = "Waiting for student reviews.";
    } else {
      const total = messReviews.reduce((sum, review) => sum + review.rating, 0);
      const average = total / messReviews.length;

      homeMessRating.textContent = average.toFixed(1);

      if (average >= 4.5) {
        homeMessText.textContent = "Mess is absolutely winning today 🔥";
      } else if (average >= 4) {
        homeMessText.textContent = "Students are loving today's menu.";
      } else if (average >= 3) {
        homeMessText.textContent = "Average mess day.";
      } else {
        homeMessText.textContent = "Backup snacks recommended 😭";
      }
    }
  }
}

updateGreeting();
updateHomeStats();

// DORMAI
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

if (sendBtn && userInput && chatMessages) {
  sendBtn.addEventListener("click", sendMessage);

  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  document.querySelectorAll(".prompt-card").forEach(function (card) {
    card.addEventListener("click", function () {
      userInput.value = card.innerText;
      sendMessage();
    });
  });
}

function getDormAIReply(text) {
  const msg = text.toLowerCase();

  if (msg.includes("500") || msg.includes("budget") || msg.includes("money") || msg.includes("left")) {
    return "Okay, budget mode on 💸 First divide your money by remaining days. Prioritize mess food, avoid delivery charges, keep emergency cash aside, and track every small snack expense.";
  }

  if (msg.includes("100") || msg.includes("80") || msg.includes("food") || msg.includes("dinner") || msg.includes("eat")) {
    return "Food under budget idea 🍜: check mess first. If you need outside food, go for dosa, idli, egg rice, rolls, or split a meal with a friend.";
  }

  if (msg.includes("study") || msg.includes("exam") || msg.includes("dbms") || msg.includes("plan")) {
    return "Study plan 📚: Do 45 minutes concepts, 30 minutes PYQs, and 15 minutes active recall. For DBMS, revise ER model, normalization, SQL, transactions, keys, and indexing.";
  }

  if (msg.includes("roommate") || msg.includes("fight") || msg.includes("room")) {
    return "Roommate tip 🛏️: start calmly. Suggest simple rules like lights off timing, headphones for calls, cleaning schedule, and guest timing.";
  }

  if (msg.includes("lost") || msg.includes("found") || msg.includes("missing")) {
    return "Lost item plan 🔍: post item name, color, last seen location, time, and photo if possible. Check mess, lift, common room, laundry area, and security desk.";
  }

  if (msg.includes("laundry") || msg.includes("wash") || msg.includes("clothes")) {
    return "Laundry reminder 🧺: count clothes before giving them, separate whites/darks, and track pickup date.";
  }

  if (msg.includes("mess") || msg.includes("breakfast") || msg.includes("lunch")) {
    return "MessMeter suggestion 🍽️: check today’s rating before going. If rating is below 3 stars, carry backup snacks.";
  }

  if (msg.includes("market") || msg.includes("sell") || msg.includes("buy")) {
    return "Marketplace tip 🛒: add clear photos, price, condition, hostel block, and pickup location.";
  }

  return "I can help with hostel budgets, food choices, study plans, lost items, roommate issues, laundry, marketplace listings, and daily hostel survival.";
}

function sendMessage() {
  const text = userInput.value.trim();
  if (text === "") return;

  const userDiv = document.createElement("div");
  userDiv.className = "user-message";
  userDiv.innerText = text;
  chatMessages.appendChild(userDiv);

  userInput.value = "";

  setTimeout(function () {
    const botDiv = document.createElement("div");
    botDiv.className = "bot-message";
    botDiv.innerText = getDormAIReply(text);
    chatMessages.appendChild(botDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 500);
}

// BUDGET BUDDY
let expenses = JSON.parse(localStorage.getItem("dormsphereExpenses")) || [];

function addExpense() {
  const name = document.getElementById("expenseName");
  const amount = document.getElementById("expenseAmount");
  const category = document.getElementById("expenseCategory");

  if (!name || !amount || !category) return;

  if (name.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter expense name and amount.");
    return;
  }

  const expense = {
    id: Date.now(),
    name: name.value.trim(),
    amount: Number(amount.value),
    category: category.value
  };

  expenses.push(expense);
  localStorage.setItem("dormsphereExpenses", JSON.stringify(expenses));

  name.value = "";
  amount.value = "";

  renderExpenses();
}

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem("dormsphereExpenses", JSON.stringify(expenses));
  renderExpenses();
}

function renderExpenses() {
  const expenseList = document.getElementById("expenseList");
  const totalSpent = document.getElementById("totalSpent");
  const budgetMood = document.getElementById("budgetMood");

  if (!expenseList || !totalSpent || !budgetMood) return;

  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach(function (expense) {
    total += expense.amount;

    const div = document.createElement("div");
    div.className = "expense-item";

    div.innerHTML = `
      <div>
        <strong>${expense.name}</strong><br>
        <span>${expense.category}</span>
      </div>
      <strong>₹${expense.amount}</strong>
      <button class="delete-expense" onclick="deleteExpense(${expense.id})">Delete</button>
    `;

    expenseList.appendChild(div);
  });

  totalSpent.textContent = total;

  if (total < 1000) {
    budgetMood.textContent = "Nice! Your spending is under control.";
  } else if (total < 3000) {
    budgetMood.textContent = "Careful. Your expenses are rising.";
  } else {
    budgetMood.textContent = "Warning: hostel budget danger zone.";
  }
}

renderExpenses();

// MESSMETER
let messReviews = JSON.parse(localStorage.getItem("dormsphereMessReviews")) || [];

function addMealReview() {
  const mealType = document.getElementById("mealType");
  const mealName = document.getElementById("mealName");
  const mealRating = document.getElementById("mealRating");
  const mealReview = document.getElementById("mealReview");

  if (!mealType || !mealName || !mealRating || !mealReview) return;

  if (mealName.value.trim() === "" || mealReview.value.trim() === "") {
    alert("Please enter meal name and review.");
    return;
  }

  const review = {
    id: Date.now(),
    type: mealType.value,
    name: mealName.value.trim(),
    rating: Number(mealRating.value),
    review: mealReview.value.trim()
  };

  messReviews.unshift(review);
  localStorage.setItem("dormsphereMessReviews", JSON.stringify(messReviews));

  mealName.value = "";
  mealReview.value = "";

  renderMessReviews();
}

function renderMessReviews() {
  const reviewList = document.getElementById("reviewList");
  const averageRating = document.getElementById("averageRating");
  const messMoodText = document.getElementById("messMoodText");

  if (!reviewList || !averageRating || !messMoodText) return;

  reviewList.innerHTML = "";

  if (messReviews.length === 0) {
    averageRating.textContent = "0.0";
    messMoodText.textContent = "No ratings yet. Be the first one.";
    return;
  }

  let total = 0;

  messReviews.forEach(function (item) {
    total += item.rating;

    const div = document.createElement("div");
    div.className = "review-item";

    div.innerHTML = `
      <div class="review-top">
        <strong>${item.type} • ${item.name}</strong>
        <span>${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</span>
      </div>
      <p>${item.review}</p>
    `;

    reviewList.appendChild(div);
  });

  const avg = total / messReviews.length;
  averageRating.textContent = avg.toFixed(1);

  if (avg >= 4) {
    messMoodText.textContent = "Mess is actually winning today.";
  } else if (avg >= 3) {
    messMoodText.textContent = "Average day. Safe but not exciting.";
  } else {
    messMoodText.textContent = "Risky mess day. Backup snacks recommended.";
  }
}

renderMessReviews();

// LOST & FOUND
let lostItems = JSON.parse(localStorage.getItem("dormsphereLostItems")) || [];

function addLostItem() {
  const itemName = document.getElementById("itemName");
  const itemLocation = document.getElementById("itemLocation");
  const itemStatus = document.getElementById("itemStatus");
  const itemDescription = document.getElementById("itemDescription");

  if (!itemName || !itemLocation || !itemStatus || !itemDescription) return;

  if (itemName.value.trim() === "" || itemLocation.value.trim() === "") {
    alert("Please fill all fields.");
    return;
  }

  const item = {
    id: Date.now(),
    name: itemName.value.trim(),
    location: itemLocation.value.trim(),
    status: itemStatus.value,
    description: itemDescription.value.trim()
  };

  lostItems.unshift(item);
  localStorage.setItem("dormsphereLostItems", JSON.stringify(lostItems));

  itemName.value = "";
  itemLocation.value = "";
  itemDescription.value = "";

  renderLostItems();
}

function renderLostItems() {
  const container = document.getElementById("itemsContainer");
  const totalItems = document.getElementById("totalItems");
  const lostCount = document.getElementById("lostCount");
  const foundCount = document.getElementById("foundCount");

  if (!container) return;

  container.innerHTML = "";

  let lost = 0;
  let found = 0;

  lostItems.forEach(function (item) {
    if (item.status === "Lost") lost++;
    else found++;

    const div = document.createElement("div");
    div.className = "item-card";

    div.innerHTML = `
      <div class="item-top">
        <h4>${item.name}</h4>
        <span class="${item.status === "Lost" ? "status-lost" : "status-found"}">
          ${item.status}
        </span>
      </div>
      <div class="item-location">📍 ${item.location}</div>
      <div class="item-description">${item.description}</div>
    `;

    container.appendChild(div);
  });

  if (totalItems) totalItems.textContent = lostItems.length;
  if (lostCount) lostCount.textContent = lost;
  if (foundCount) foundCount.textContent = found;
}

renderLostItems();

// STUDY CIRCLES
let studyCircles = JSON.parse(localStorage.getItem("dormsphereStudyCircles")) || [];

function addStudyCircle() {
  const circleName = document.getElementById("circleName");
  const circleSubject = document.getElementById("circleSubject");
  const circleTime = document.getElementById("circleTime");
  const circleMode = document.getElementById("circleMode");

  if (!circleName || !circleSubject || !circleTime || !circleMode) return;

  if (circleName.value.trim() === "" || circleSubject.value.trim() === "" || circleTime.value.trim() === "") {
    alert("Please fill all fields.");
    return;
  }

  const circle = {
    id: Date.now(),
    name: circleName.value.trim(),
    subject: circleSubject.value.trim(),
    time: circleTime.value.trim(),
    mode: circleMode.value,
    members: 1
  };

  studyCircles.unshift(circle);
  localStorage.setItem("dormsphereStudyCircles", JSON.stringify(studyCircles));

  circleName.value = "";
  circleSubject.value = "";
  circleTime.value = "";

  renderStudyCircles();
}

function joinCircle(id) {
  studyCircles = studyCircles.map(function (circle) {
    if (circle.id === id) {
      return { ...circle, members: circle.members + 1 };
    }
    return circle;
  });

  localStorage.setItem("dormsphereStudyCircles", JSON.stringify(studyCircles));
  renderStudyCircles();
}

function renderStudyCircles() {
  const container = document.getElementById("circleContainer");
  const circleCount = document.getElementById("circleCount");

  if (!container) return;

  container.innerHTML = "";

  studyCircles.forEach(function (circle) {
    const div = document.createElement("div");
    div.className = "circle-card";

    div.innerHTML = `
      <div>
        <h4>${circle.name}</h4>
        <p>📘 ${circle.subject} • ${circle.time}</p>
        <span class="circle-tag">${circle.mode} • ${circle.members} member(s)</span>
      </div>
      <button class="join-btn" onclick="joinCircle(${circle.id})">Join</button>
    `;

    container.appendChild(div);
  });

  if (circleCount) circleCount.textContent = studyCircles.length;
}

renderStudyCircles();

// MARKETPLACE
let products = JSON.parse(localStorage.getItem("dormsphereProducts")) || [];

function addProduct() {
  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productLocation = document.getElementById("productLocation");
  const productCategory = document.getElementById("productCategory");
  const productDescription = document.getElementById("productDescription");

  if (!productName || !productPrice || !productLocation || !productCategory || !productDescription) return;

  if (productName.value.trim() === "" || productPrice.value.trim() === "" || productLocation.value.trim() === "") {
    alert("Please fill item name, price and pickup location.");
    return;
  }

  const product = {
    id: Date.now(),
    name: productName.value.trim(),
    price: Number(productPrice.value),
    location: productLocation.value.trim(),
    category: productCategory.value,
    description: productDescription.value.trim()
  };

  products.unshift(product);
  localStorage.setItem("dormsphereProducts", JSON.stringify(products));

  productName.value = "";
  productPrice.value = "";
  productLocation.value = "";
  productDescription.value = "";

  renderProducts();
}

function renderProducts() {
  const container = document.getElementById("productContainer");
  const productCount = document.getElementById("productCount");

  if (!container) return;

  container.innerHTML = "";

  products.forEach(function (product) {
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <div class="product-top">
        <h4>${product.name}</h4>
        <span class="product-price">₹${product.price}</span>
      </div>
      <div class="product-meta">🏷️ ${product.category} • 📍 ${product.location}</div>
      <div class="product-desc">${product.description || "No extra details added."}</div>
    `;

    container.appendChild(div);
  });

  if (productCount) productCount.textContent = products.length;
}

renderProducts();

// NOTICE BOARD
let notices = JSON.parse(localStorage.getItem("dormsphereNotices")) || [];

function addNotice() {
  const noticeTitle = document.getElementById("noticeTitle");
  const noticeCategory = document.getElementById("noticeCategory");
  const noticeText = document.getElementById("noticeText");

  if (!noticeTitle || !noticeCategory || !noticeText) {
    alert("Notice Board elements not found. Check HTML IDs.");
    return;
  }

  if (noticeTitle.value.trim() === "" || noticeText.value.trim() === "") {
    alert("Please enter notice title and message.");
    return;
  }

  const notice = {
    id: Date.now(),
    title: noticeTitle.value.trim(),
    category: noticeCategory.value,
    text: noticeText.value.trim()
  };

  notices.unshift(notice);
  localStorage.setItem("dormsphereNotices", JSON.stringify(notices));

  noticeTitle.value = "";
  noticeText.value = "";

  renderNotices();
}

function renderNotices() {
  const container = document.getElementById("noticeContainer");
  const noticeCount = document.getElementById("noticeCount");

  if (!container) return;

  container.innerHTML = "";

  notices.forEach(function (notice) {
    const div = document.createElement("div");
    div.className = "notice-item";

    div.innerHTML = `
      <div class="notice-top">
        <h4>${notice.title}</h4>
        <span class="notice-badge">${notice.category}</span>
      </div>
      <p>${notice.text}</p>
    `;

    container.appendChild(div);
  });

  if (noticeCount) {
    noticeCount.textContent = notices.length;
  }
}

renderNotices();

// LAUNDRY
let laundryData = JSON.parse(localStorage.getItem("dormsphereLaundry")) || [];

function addLaundry() {
  const laundryName = document.getElementById("laundryName");
  const laundryCount = document.getElementById("laundryCount");
  const laundryDate = document.getElementById("laundryDate");
  const laundryStatus = document.getElementById("laundryStatus");

  if (!laundryName || !laundryCount || !laundryDate || !laundryStatus) {
    alert("Laundry elements not found.");
    return;
  }

  if (
    laundryName.value.trim() === "" ||
    laundryCount.value.trim() === "" ||
    laundryDate.value.trim() === ""
  ) {
    alert("Please fill all laundry fields.");
    return;
  }

  const batch = {
    id: Date.now(),
    name: laundryName.value.trim(),
    count: laundryCount.value.trim(),
    date: laundryDate.value,
    status: laundryStatus.value
  };

  laundryData.unshift(batch);
  localStorage.setItem("dormsphereLaundry", JSON.stringify(laundryData));

  laundryName.value = "";
  laundryCount.value = "";
  laundryDate.value = "";

  renderLaundry();
}

function renderLaundry() {
  const container = document.getElementById("laundryContainer");
  const countDisplay = document.getElementById("laundryCountDisplay");

  if (!container) return;

  container.innerHTML = "";

  laundryData.forEach(function (batch) {
    const div = document.createElement("div");
    div.className = "laundry-item";

    div.innerHTML = `
      <h4>${batch.name}</h4>
      <p>👕 Clothes: ${batch.count}</p>
      <p>📅 Date: ${batch.date}</p>
      <span class="status-pill">${batch.status}</span>
    `;

    container.appendChild(div);
  });

  if (countDisplay) {
    countDisplay.textContent = laundryData.length;
  }
}

renderLaundry();

function renderLaundry() {
  const container = document.getElementById("laundryContainer");
  const countDisplay = document.getElementById("laundryCountDisplay");

  if (!container) return;

  container.innerHTML = "";

  laundryData.forEach(function (batch) {
    const div = document.createElement("div");
    div.className = "laundry-item";

    div.innerHTML = `
      <h4>${batch.name}</h4>
      <p>👕 Clothes: ${batch.count}</p>
      <p>📅 Date: ${batch.date}</p>
      <span class="status-pill">${batch.status}</span>
    `;

    container.appendChild(div);
  });

  if (countDisplay) {
    countDisplay.textContent = laundryData.length;
  }
}

renderLaundry();

// ROOMMATE MATCH
function findRoommateMatch() {
  const sleepTime = document.getElementById("sleepTime");
  const cleanliness = document.getElementById("cleanliness");
  const studyStyle = document.getElementById("studyStyle");
  const socialLevel = document.getElementById("socialLevel");

  const matchScore = document.getElementById("matchScore");
  const matchName = document.getElementById("matchName");
  const matchReason = document.getElementById("matchReason");

  if (
    !sleepTime ||
    !cleanliness ||
    !studyStyle ||
    !socialLevel ||
    !matchScore ||
    !matchName ||
    !matchReason
  ) {
    alert("Roommate Match elements not found. Check HTML IDs.");
    return;
  }

  let score = 78;
  let name = "Meera";
  let reason = "Meera is flexible, balanced, and adapts well to different hostel routines.";

  if (sleepTime.value === "late" && studyStyle.value === "quiet") {
    score = 94;
    name = "Ananya";
    reason = "Ananya also prefers late nights and quiet study sessions, making her a strong lifestyle match.";
  } else if (sleepTime.value === "early" && socialLevel.value === "balanced") {
    score = 89;
    name = "Riya";
    reason = "Riya has an early routine and balanced social habits, which matches your daily rhythm well.";
  } else if (studyStyle.value === "group" || cleanliness.value === "medium") {
    score = 86;
    name = "Meera";
    reason = "Meera enjoys group study and keeps a practical, moderate room routine.";
  } else if (cleanliness.value === "very-clean") {
    score = 91;
    name = "Ananya";
    reason = "Ananya is very clean and prefers an organized room environment.";
  }

  matchScore.textContent = score;
  matchName.textContent = name;
  matchReason.textContent = reason;
}