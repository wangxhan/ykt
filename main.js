// 读取JSON数据
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        const zhData = data.zh;
        const enData = data.en;
        const bindElements = document.querySelectorAll('[data-bind]');
        const globalList = document.getElementById('globalList');

        // 渲染页面内容
        function render(langObj) {
            bindElements.forEach(el => {
                const key = el.getAttribute('data-bind');
                if (langObj[key]) el.innerText = langObj[key];
            })
            // 渲染全球列表
            globalList.innerHTML = "";
            langObj.globalItems.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                globalList.appendChild(li);
            })
        }
        // 默认加载中文
        render(zhData);
        // 切换语言按钮
        document.getElementById('zhBtn').addEventListener('click', () => render(zhData));
        document.getElementById('enBtn').addEventListener('click', () => render(enData));
    })
    .catch(err => console.error("数据加载异常：", err))