let siteData = null;
let currentLang = "zh";

// 初始化加载数据 + 异常捕获
async function initLoadData() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error("JSON文件读取失败");
    siteData = await res.json();
    renderPage();
    bindLangEvent();
    console.log("页面渲染正常");
  } catch (err) {
    console.error("运行异常：", err);
    alert("请使用本地服务打开页面，禁止直接双击文件打开");
  }
}

// 整体页面渲染
function renderPage() {
  const t = siteData.globalText[currentLang];
  const comp = siteData.companyList[currentLang];
  const bizData = siteData.businessInfo[currentLang];
  const netData = siteData.globalNetwork[currentLang];
  const visionText = siteData.vision[currentLang];

  // 导航文案赋值
  document.getElementById("navBrand").innerText = t.nav.brand;
  document.querySelector('[data-key="about"]').innerText = t.nav.about;
  document.querySelector('[data-key="business"]').innerText = t.nav.business;
  document.querySelector('[data-key="globalNet"]').innerText = t.nav.globalNet;
  document.querySelector('[data-key="vision"]').innerText = t.nav.vision;

  // 头部区块
  document.querySelector(".hero-title").innerText = t.hero.title;
  document.querySelector(".hero-desc").innerText = t.hero.desc;
  document.querySelector(".platform-title").innerText = t.platformTitle;
  document.querySelector(".platform-desc").innerText = t.platformDesc;

  // 渲染各组公司
  renderCompany("#platformCompanies", comp.investmentPlatform);
  renderCompany("#culturalCompanies", comp.culturalSub);
  renderCompany("#agriCompanies", comp.agriSub);
  renderCompany("#aiMedCompanies", comp.aiMedSub);
  renderCompany("#overseaCompanies", comp.overseaEntity);

  // 业务板块渲染
  const bizWrap = document.getElementById("businessWrap");
  bizWrap.innerHTML = "";
  bizData.forEach(item => {
    const card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `<h4>${item.title}</h4><p>${item.intro}</p>`;
    bizWrap.appendChild(card);
  });

  // 全球网点
  const globalList = document.getElementById("globalList");
  globalList.innerHTML = "";
  netData.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    globalList.appendChild(li);
  });

  // 理念文案
  document.querySelector(".vision-text").innerText = visionText;
}

// 渲染公司条目，自动区分中英文样式
function renderCompany(selector, nameArray) {
  const wrap = document.querySelector(selector);
  if (!wrap || !Array.isArray(nameArray)) return;
  wrap.innerHTML = "";
  nameArray.forEach(name => {
    const span = document.createElement("span");
    // 首字符为英文判定en-firm，其余中文
    const firstChar = name.trim().charAt(0);
    const isEnglish = /[A-Za-z]/.test(firstChar);
    span.className = isEnglish ? "en-firm" : "cn-firm";
    span.textContent = name;
    wrap.appendChild(span);
  });
}

// 语言切换绑定（文字逻辑修正）
function bindLangEvent() {
  const btn = document.querySelector(".lang-switch");
  btn.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    btn.innerText = currentLang === "zh" ? "ZH / EN" : "EN / ZH";
    renderPage();
  });
}

// 程序入口
initLoadData();