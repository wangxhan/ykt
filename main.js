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

// 整页统一渲染入口
function renderWholePage() {
  const langKey = currentLang;
  const textData = siteData.globalText[langKey];
  const companyList = siteData.companyData[langKey];
  const totalBiz = siteData.businessTotal[langKey];
  const globalNet = siteData.globalNetwork[langKey];
  const visionTxt = siteData.vision[langKey];

  // 导航文字赋值
  document.getElementById("navBrand").innerText = textData.nav.brand;
  document.querySelector('[data-key="about"]').innerText = textData.nav.about;
  document.querySelector('[data-key="business"]').innerText = textData.nav.business;
  document.querySelector('[data-key="globalNet"]').innerText = textData.nav.globalNet;
  document.querySelector('[data-key="vision"]').innerText = textData.nav.vision;

  // 头部横幅
  document.querySelector(".hero-title").innerText = textData.hero.title;
  document.querySelector(".hero-desc").innerText = textData.hero.desc;

  // 渲染公司列表（名称一行，经营范围下一行）
  renderAllCompanies(companyList);
  // 渲染集团总业务
  renderTotalBusiness(totalBiz);
  // 全球网点
  renderGlobalNet(globalNet);
  // 发展理念
  document.querySelector(".vision-text").innerText = visionTxt;
}

// 渲染公司区块
function renderAllCompanies(groupArr) {
  const container = document.getElementById("firmContainer");
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
  btn.onclick = () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    btn.innerText = currentLang === "zh" ? "ZH / EN" : "EN / ZH";
    renderWholePage();
  }
}

// 程序启动
loadSourceData();