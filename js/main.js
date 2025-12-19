// 主逻辑 - 路由判断和初始化

document.addEventListener('DOMContentLoaded', function() {
    // 初始化雪花系统
    const snowCanvas = document.getElementById('snow-canvas');
    if (snowCanvas) {
        const snowSystem = new SnowSystem(snowCanvas, 100);
        snowSystem.start();
    }
    
    // 路由判断
    const urlParams = new URLSearchParams(window.location.search);
    const hasParams = urlParams.has('data') || (urlParams.has('sender') && urlParams.has('relation'));
    
    if (hasParams) {
        // 展示页面
        showDisplayPage();
        initDisplayPage();
    } else {
        // 创建页面
        showCreatePage();
        initCreatePage();
    }
});

// 显示创建页面
function showCreatePage() {
    document.getElementById('create-page').classList.remove('hidden');
    document.getElementById('display-page').classList.add('hidden');
}

// 显示展示页面
function showDisplayPage() {
    document.getElementById('create-page').classList.add('hidden');
    document.getElementById('display-page').classList.remove('hidden');
}

// 工具函数：Base64编码
function encodeData(data) {
    try {
        return btoa(encodeURIComponent(JSON.stringify(data)));
    } catch (e) {
        console.error('编码失败:', e);
        return '';
    }
}

// 工具函数：Base64解码
function decodeData(encodedData) {
    try {
        return JSON.parse(decodeURIComponent(atob(encodedData)));
    } catch (e) {
        console.error('解码失败:', e);
        return null;
    }
}

// 工具函数：显示提示
function showToast(message, duration = 2000) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 自动移除
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
            document.head.removeChild(style);
        }, 300);
    }, duration);
}

