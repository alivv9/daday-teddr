// Wadi Al-Kouf Exchange - JavaScript Actions

document.addEventListener("DOMContentLoaded", () => {
  // --- Rate Definitions (Normalized to LYD) ---
  const currencyRates = {
    LYD: { name: "دينار ليبي", rate: 1.0, buy: 1.0, sell: 1.0, trend: "neutral", change: "0.0%" },
    USD: { name: "دولار أمريكي", rate: 6.82, buy: 6.80, sell: 6.85, trend: "up", change: "+0.15%" },
    EUR: { name: "يورو أوروبي", rate: 7.39, buy: 7.36, sell: 7.42, trend: "up", change: "+0.08%" },
    EGP: { name: "جنيه مصري", rate: 0.143, buy: 0.141, sell: 0.145, trend: "down", change: "-0.22%" },
    TND: { name: "دينار تونسي", rate: 2.16, buy: 2.14, sell: 2.18, trend: "down", change: "-0.11%" }
  };

  const COMMISSION_PCT = 0.005; // 0.5% commission
  const MIN_COMMISSION = 1.0; // 1 LYD minimum commission

  // --- Elements Selection ---
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const closeDrawer = document.getElementById("close-drawer");
  const navOverlay = document.getElementById("nav-overlay");
  
  // Converter Elements
  const convertAmount = document.getElementById("convert-amount");
  const fromCurrency = document.getElementById("from-currency");
  const toCurrency = document.getElementById("to-currency");
  const switchCurrencies = document.getElementById("switch-currencies");
  
  const resultValue = document.getElementById("result-value");
  const rateDetail = document.getElementById("rate-detail");
  const commissionDetail = document.getElementById("commission-detail");
  const totalWithCommDetail = document.getElementById("total-with-comm-detail");
  const resultSection = document.getElementById("result-section");



  // --- Theme Toggle Action ---
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // --- Mobile Navigation Drawer ---
  const toggleDrawer = () => {
    navOverlay.classList.toggle("active");
  };

  menuToggle.addEventListener("click", toggleDrawer);
  closeDrawer.addEventListener("click", toggleDrawer);
  
  // Close drawer on overlay click
  navOverlay.addEventListener("click", (e) => {
    if (e.target === navOverlay) {
      toggleDrawer();
    }
  });

  // Close drawer on link click
  document.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", toggleDrawer);
  });

  // --- Converter Logic ---
  function calculateConversion() {
    const amount = parseFloat(convertAmount.value);
    if (isNaN(amount) || amount <= 0) {
      resultSection.style.opacity = "0.5";
      resultValue.textContent = "0.00";
      rateDetail.textContent = "-";
      commissionDetail.textContent = "-";
      totalWithCommDetail.textContent = "-";
      return;
    }

    resultSection.style.opacity = "1";

    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Normalize through LYD: Rate is how many LYD equals 1 unit of currency.
    // Amount in LYD = amount * rate[from]
    // Amount in Target = (amount * rate[from]) / rate[to]
    const amountInLyd = amount * currencyRates[from].rate;
    const targetAmount = amountInLyd / currencyRates[to].rate;

    // Calculate commission in target currency
    let commission = targetAmount * COMMISSION_PCT;
    // Enforce minimum commission (converted to target currency)
    const minCommInTarget = MIN_COMMISSION / currencyRates[to].rate;
    if (commission < minCommInTarget) {
      commission = minCommInTarget;
    }

    // Displays
    resultValue.textContent = `${targetAmount.toFixed(2)} ${to}`;

    // Detail rate string: 1 From = X To
    const unitRate = currencyRates[from].rate / currencyRates[to].rate;
    rateDetail.textContent = `1 ${from} = ${unitRate.toFixed(4)} ${to}`;
    commissionDetail.textContent = `${commission.toFixed(2)} ${to} (${(COMMISSION_PCT * 100).toFixed(1)}%)`;
    
    // Total is target amount minus commission (or plus depending on buy/sell logic. Usually, user pays commission on top)
    const totalWithComm = targetAmount + commission;
    totalWithCommDetail.textContent = `${totalWithComm.toFixed(2)} ${to}`;
  }

  // Bind inputs
  convertAmount.addEventListener("input", calculateConversion);
  fromCurrency.addEventListener("change", calculateConversion);
  toCurrency.addEventListener("change", calculateConversion);

  // Switch currencies click
  switchCurrencies.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    calculateConversion();
  });



  // Initialize conversion display
  calculateConversion();


});
