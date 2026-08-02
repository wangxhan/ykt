let siteData = null;
let currentLang = "zh";

// 加载JSON数据
async function loadSourceData() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error("JSON文件读取失败，请使用Live Server运行");
    siteData = await res.json();
    renderWholePage();
    bindLangSwitch();
    console.log("页面渲染正常，无报错");
  } catch (error) {
    console.error("运行错误：", error);
    alert("禁止直接双击HTML打开文件，请使用VSCode Live Server启动预览");
  }
}

const NAV_ORDER = [
  { key: "about", href: "index.html#firmList" },
  { key: "business", href: "about.html" },
  { key: "globalNet", href: "business.html" },
  { key: "vision", href: "contact.html" }
];

function getPageTitleText(langKey) {
  const pageType = window.pageType || "home";
  const pageData = siteData?.pageContent?.[langKey]?.[pageType];

  if (pageType === "home") {
    return siteData?.globalText?.[langKey]?.siteTitle || "YKT Group";
  }

  if (pageData?.title) {
    return pageData.title;
  }

  return siteData?.globalText?.[langKey]?.siteTitle || "YKT Group";
}

// 整页统一渲染入口
function renderWholePage() {
  if (!siteData) return;

  const langKey = currentLang;
  const textData = siteData.globalText[langKey];
  const values = siteData.values[langKey];
  const overview = siteData.overview[langKey];
  const footer = siteData.footer[langKey];
  const companyList = siteData.companyData[langKey];
  const totalBiz = siteData.businessTotal[langKey];
  const globalNet = siteData.globalNetwork[langKey];
  const visionTxt = siteData.vision[langKey];

  document.title = getPageTitleText(langKey);
  document.documentElement.lang = langKey === "zh" ? "zh-CN" : "en-US";

  const langToggle = document.querySelector(".lang-toggle");
  if (langToggle) {
    langToggle.textContent = langKey === "zh" ? "English" : "中文";
    langToggle.setAttribute("aria-label", langKey === "zh" ? "Switch to English" : "切换到中文");
  }

  const navBrand = document.getElementById("navBrand");
  if (navBrand) navBrand.innerText = textData.nav.brand;

  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach((link, index) => {
    const config = NAV_ORDER[index];
    if (!config) return;
    link.href = config.href;
    link.setAttribute('data-key', config.key);
    link.innerText = textData.nav[config.key];
  });

  syncNavState();

  const firmListTitle = document.getElementById("firmListTitle");
  if (firmListTitle) firmListTitle.innerText = textData.sections.firmList;
  const groupBizTitle = document.getElementById("groupBizTitle");
  if (groupBizTitle) groupBizTitle.innerText = textData.sections.business;
  const globalNetTitle = document.getElementById("globalNetTitle");
  if (globalNetTitle) globalNetTitle.innerText = textData.sections.globalNet;
  const visionTitle = document.getElementById("visionTitle");
  if (visionTitle) visionTitle.innerText = textData.sections.vision;

  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) heroTitle.innerText = textData.hero.title;
  const heroDesc = document.querySelector(".hero-desc");
  if (heroDesc) heroDesc.innerText = textData.hero.desc;

  if (document.getElementById("valueGrid")) renderBrandValues(values);
  if (document.getElementById("overviewEyebrow")) renderOverview(overview);
  if (document.getElementById("footerBrand") || document.getElementById("metaLabel1")) renderFooter(footer);

  if (document.getElementById("firmContainer")) renderAllCompanies(companyList);
  if (document.getElementById("bizContainer")) renderTotalBusiness(totalBiz);
  if (document.getElementById("globalList")) renderGlobalNet(globalNet);

  const visionText = document.querySelector(".vision-text");
  if (visionText) visionText.innerText = visionTxt;

  renderPageSpecificContent();
}

function syncNavState() {
  const links = document.querySelectorAll('.nav-item');
  if (!links.length) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const canonicalHref = href.split('?')[0];
    const hrefPath = canonicalHref.split('#')[0];
    const isActive = hrefPath === currentPage || (hrefPath === 'index.html' && currentPage === 'index.html');

    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function renderPageSpecificContent() {
  const pageType = window.pageType || "home";
  const langKey = currentLang;
  const pageData = siteData.pageContent?.[langKey]?.[pageType];
  if (!pageData) return;

  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) pageTitle.textContent = pageData.title || "";

  const pageSummary = document.getElementById("pageSummary");
  if (pageSummary) pageSummary.textContent = pageData.summary || "";

  const aboutInfo = document.getElementById("aboutInfo");
  if (aboutInfo && Array.isArray(pageData.items)) {
    aboutInfo.innerHTML = pageData.items.map(item => `
      <div class="info-card">
        <span class="info-label">${item.label}</span>
        <strong>${item.value}</strong>
      </div>
    `).join("");
  }

  const bizContainer = document.getElementById("bizContainer");
  if (bizContainer && siteData.businessTotal?.[langKey]) {
    renderTotalBusiness(siteData.businessTotal[langKey]);
  }

  const contactEyebrow = document.getElementById("contactEyebrow");
  if (contactEyebrow) contactEyebrow.textContent = pageData.eyebrow || "";

  const contactTitle = document.getElementById("contactTitle");
  if (contactTitle) contactTitle.textContent = pageData.title || "";

  const contactText = document.getElementById("contactText");
  if (contactText) contactText.textContent = pageData.text || "";

  const contactList = document.getElementById("contactList");
  if (contactList && Array.isArray(pageData.items)) {
    contactList.innerHTML = pageData.items.map((item) => `
      <div class="contact-item">
        <span class="contact-label">${item.label}</span>
        <span class="contact-value">${item.value}</span>
      </div>
    `).join("");
  }
}

function renderBrandValues(values) {
  const grid = document.getElementById("valueGrid");
  if (!grid) return;

  grid.innerHTML = "";
  values.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "value-card";
    card.innerHTML = `
      <div class="value-index">0${index + 1}</div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    `;
    grid.appendChild(card);
  });
}

function renderOverview(overview) {
  const eyebrow = document.getElementById("overviewEyebrow");
  const title = document.getElementById("overviewTitle");
  const text = document.getElementById("overviewText");
  const stats = document.getElementById("overviewStats");

  if (!eyebrow || !title || !text || !stats) return;

  eyebrow.textContent = overview.eyebrow;
  title.textContent = overview.title;
  text.textContent = overview.text;
  stats.innerHTML = overview.stats.map(item => `
    <div class="stat-item">
      <span class="stat-value">${item.value}</span>
      <span class="stat-label">${item.label}</span>
    </div>
  `).join("");
}

function renderFooter(footer) {
  const footerBrand = document.getElementById("footerBrand");
  const footerNote = document.getElementById("footerNote");
  const ctaEyebrow = document.getElementById("ctaEyebrow");
  const ctaTitle = document.getElementById("ctaTitle");
  const ctaButton = document.getElementById("ctaButton");
  const meta1Label = document.getElementById("metaLabel1");
  const meta1Value = document.getElementById("metaValue1");
  const meta2Label = document.getElementById("metaLabel2");
  const meta2Value = document.getElementById("metaValue2");
  const meta3Label = document.getElementById("metaLabel3");
  const meta3Value = document.getElementById("metaValue3");

  if (footerBrand) footerBrand.textContent = footer.brand;
  if (footerNote) footerNote.textContent = footer.note;

  if (ctaEyebrow && footer.cta) ctaEyebrow.textContent = footer.cta.eyebrow;
  if (ctaTitle && footer.cta) ctaTitle.textContent = footer.cta.title;
  if (ctaButton && footer.cta) ctaButton.textContent = footer.cta.button;

  if (Array.isArray(footer.meta)) {
    const [meta1, meta2, meta3] = footer.meta;
    if (meta1Label && meta1Value && meta1) {
      meta1Label.textContent = meta1.label;
      meta1Value.textContent = meta1.value;
    }
    if (meta2Label && meta2Value && meta2) {
      meta2Label.textContent = meta2.label;
      meta2Value.textContent = meta2.value;
    }
    if (meta3Label && meta3Value && meta3) {
      meta3Label.textContent = meta3.label;
      meta3Value.textContent = meta3.value;
    }
  }
}

// 渲染公司区块
function renderAllCompanies(groupArr) {
  const container = document.getElementById("firmContainer");
  if (!container || !Array.isArray(groupArr)) return;
  container.innerHTML = "";

  groupArr.forEach(groupItem => {
    const groupWrap = document.createElement("div");
    groupWrap.className = "firm-group-block";

    // 板块大标题
    const groupTitleDom = document.createElement("h3");
    groupTitleDom.className = "firm-group-title";
    groupTitleDom.innerText = groupItem.groupTitle;
    groupWrap.appendChild(groupTitleDom);

    // 遍历该板块内每一家公司
    groupItem.firmList.forEach(firm => {
      const itemDom = document.createElement("div");
      itemDom.className = "single-firm-item";

      // 公司名称DOM
      const nameSpan = document.createElement("span");
      const firstChar = firm.name.trim().charAt(0);
      const isEng = /[A-Za-z]/.test(firstChar);
      nameSpan.className = isEng ? "en-firm-name" : "cn-firm-name";
      nameSpan.innerText = firm.name;

      // 经营范围DOM
      const scopeP = document.createElement("p");
      scopeP.className = "firm-scope-text";
      scopeP.innerText = firm.scope;

      itemDom.appendChild(nameSpan);
      itemDom.appendChild(scopeP);
      groupWrap.appendChild(itemDom);
    });
    container.appendChild(groupWrap);
  });
}

// 渲染集团整体业务
function renderTotalBusiness(bizArr) {
  const wrap = document.getElementById("bizContainer");
  if (!wrap || !Array.isArray(bizArr)) return;
  wrap.innerHTML = "";
  bizArr.forEach(item => {
    const card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `<h4>${item.title}</h4><p>${item.desc}</p>`;
    wrap.appendChild(card);
  });
}

// 渲染全球网络
function renderGlobalNet(listArr) {
  const ul = document.getElementById("globalList");
  if (!ul || !Array.isArray(listArr)) return;
  ul.innerHTML = "";
  listArr.forEach(txt => {
    const li = document.createElement("li");
    li.innerText = txt;
    ul.appendChild(li);
  });
}

// 语言切换绑定
function bindLangSwitch() {
  const btn = document.querySelector(".lang-toggle");
  if (!btn) return;
  btn.onclick = () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    renderWholePage();
  };
}

