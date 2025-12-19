// 展示页面逻辑

function initDisplayPage() {
    // 解析URL参数
    const urlParams = new URLSearchParams(window.location.search);
    let data = null;
    
    // 尝试解析新格式（data参数）
    if (urlParams.has('data')) {
        data = decodeData(urlParams.get('data'));
    } 
    // 兼容旧格式
    else if (urlParams.has('sender') && urlParams.has('relation')) {
        data = {
            sender: urlParams.get('sender'),
            relation: urlParams.get('relation'),
            message: urlParams.get('msg') || ''
        };
    }
    
    // 验证数据
    if (!data || !data.sender || !data.relation) {
        showToast('链接参数错误，请检查链接是否完整');
        setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname;
        }, 2000);
        return;
    }
    
    // 显示内容
    displayBlessing(data);
    
    // 初始化控制按钮
    initControls();
    
    // 加载场景样式
    loadSceneStyle(data.relation);
}

// 显示祝福内容
function displayBlessing(data) {
    const { sender, relation, message } = data;
    
    // 关系映射
    const relationMap = {
        lover: { emoji: '💑', text: '给我的恋人' },
        friend: { emoji: '👫', text: '给我的朋友' },
        family: { emoji: '👨‍👩‍👧', text: '给我的家人' },
        colleague: { emoji: '🤝', text: '给我的同事' },
        neighbor: { emoji: '🏡', text: '给我的邻居' },
        teacher: { emoji: '🎓', text: '给我的师长/学生' },
        leader: { emoji: '💼', text: '给我的领导/下属' }
    };
    
    const relationInfo = relationMap[relation] || { emoji: '🎄', text: '给你' };
    
    // 设置发送人
    const senderEl = document.getElementById('display-sender');
    senderEl.textContent = `来自 ${sender} 的圣诞祝福`;
    
    // 设置关系标签
    const relationEl = document.getElementById('display-relation');
    relationEl.innerHTML = `${relationInfo.emoji} ${relationInfo.text}`;
    
    // 获取祝福语
    let blessingText = message;
    if (!blessingText && typeof BLESSINGS !== 'undefined') {
        const blessingsList = BLESSINGS[relation] || BLESSINGS.friend;
        blessingText = blessingsList[Math.floor(Math.random() * blessingsList.length)];
    }
    
    // 打字机效果显示祝福语
    const blessingEl = document.getElementById('display-blessing');
    typeWriter(blessingEl, blessingText, 50);
    
    // 添加装饰效果
    addSceneDecoration(relation);
}

// 打字机效果
function typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 500); // 延迟开始
}

// 加载场景样式
function loadSceneStyle(relation) {
    const head = document.head;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/scenes/${relation}.css`;
    link.onerror = () => {
        console.warn(`场景样式 ${relation}.css 加载失败，使用默认样式`);
    };
    head.appendChild(link);
    
    // 添加场景类名到body
    document.body.className = `scene-${relation}`;
}

// 添加场景装饰
function addSceneDecoration(relation) {
    const decorationEl = document.getElementById('scene-decoration');
    
    // 根据不同关系添加特殊装饰
    switch (relation) {
        case 'lover':
            decorationEl.innerHTML = '<div class="hearts"></div>';
            createHearts();
            break;
        case 'friend':
            decorationEl.innerHTML = '<div class="gifts"></div>';
            break;
        case 'family':
            decorationEl.innerHTML = '<div class="fireplace"></div>';
            break;
        default:
            decorationEl.innerHTML = '<div class="stars"></div>';
    }
}

// 创建爱心效果（恋人场景）
function createHearts() {
    const heartsContainer = document.querySelector('.hearts');
    if (!heartsContainer) return;
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '💕';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heartsContainer.appendChild(heart);
    }
}

// 初始化控制按钮
function initControls() {
    // 音乐控制
    const btnMusic = document.getElementById('btn-music');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;
    
    btnMusic.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            this.textContent = '🔇';
        } else {
            bgMusic.play().catch(err => {
                console.log('音乐播放失败:', err);
                showToast('音乐播放需要用户交互');
            });
            this.textContent = '🔊';
        }
        isPlaying = !isPlaying;
    });
    
    // 保存图片
    const btnSave = document.getElementById('btn-save');
    btnSave.addEventListener('click', function() {
        if (typeof html2canvas === 'undefined') {
            showToast('截图功能加载失败');
            return;
        }
        
        showToast('正在生成图片...');
        
        const sceneContainer = document.querySelector('.scene-container');
        html2canvas(sceneContainer, {
            backgroundColor: null,
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'christmas-blessing.png';
            link.href = canvas.toDataURL();
            link.click();
            showToast('✅ 图片已保存');
        }).catch(err => {
            console.error('截图失败:', err);
            showToast('图片生成失败');
        });
    });
    
    // 创建我的祝福
    const btnCreate = document.getElementById('btn-create');
    btnCreate.addEventListener('click', function() {
        window.location.href = window.location.origin + window.location.pathname;
    });
}

