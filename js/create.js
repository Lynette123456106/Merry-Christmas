// 创建页面逻辑

let selectedRelation = '';

function initCreatePage() {
    // 关系卡片选择
    const relationCards = document.querySelectorAll('.relation-card');
    relationCards.forEach(card => {
        card.addEventListener('click', function() {
            relationCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedRelation = this.dataset.relation;
        });
    });
    
    // 自定义祝福语折叠面板
    const toggleBtn = document.getElementById('toggle-custom');
    const customPanel = document.getElementById('custom-panel');
    toggleBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        customPanel.classList.toggle('active');
    });
    
    // 字符计数
    const customMessage = document.getElementById('custom-message');
    const charCount = document.querySelector('.char-count');
    customMessage.addEventListener('input', function() {
        charCount.textContent = `${this.value.length}/200`;
    });
    
    // 生成按钮
    const btnGenerate = document.getElementById('btn-generate');
    btnGenerate.addEventListener('click', generateLink);
    
    // 复制按钮
    const btnCopy = document.getElementById('btn-copy');
    btnCopy.addEventListener('click', copyLink);
    
    // 分享按钮
    const btnShare = document.getElementById('btn-share');
    btnShare.addEventListener('click', shareLink);
}

// 生成链接
function generateLink() {
    const senderName = document.getElementById('sender-name').value.trim();
    const customMsg = document.getElementById('custom-message').value.trim();
    
    // 验证
    if (!senderName) {
        showToast('请输入您的名字');
        return;
    }
    
    if (!selectedRelation) {
        showToast('请选择关系类型');
        return;
    }
    
    // 构建数据
    const data = {
        sender: senderName,
        relation: selectedRelation,
        message: customMsg || '',
        timestamp: Date.now()
    };
    
    // 编码
    const encodedData = encodeData(data);
    
    // 生成URL
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?data=${encodedData}`;
    
    // 显示结果
    const resultSection = document.getElementById('result-section');
    const linkInput = document.getElementById('generated-link');
    linkInput.value = link;
    resultSection.classList.add('show');
    
    // 生成二维码
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';
    
    if (typeof QRCode !== 'undefined') {
        new QRCode(qrcodeDiv, {
            text: link,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    // 滚动到结果
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    showToast('✅ 链接生成成功！');
}

// 复制链接
function copyLink() {
    const linkInput = document.getElementById('generated-link');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // 移动端
    
    try {
        document.execCommand('copy');
        const btnCopy = document.getElementById('btn-copy');
        btnCopy.textContent = '✅ 已复制';
        btnCopy.classList.add('copied');
        
        setTimeout(() => {
            btnCopy.textContent = '📋 复制';
            btnCopy.classList.remove('copied');
        }, 2000);
        
        showToast('✅ 链接已复制到剪贴板');
    } catch (err) {
        showToast('复制失败，请手动复制');
    }
}

// 分享链接
function shareLink() {
    const linkInput = document.getElementById('generated-link');
    const link = linkInput.value;
    
    // 检查是否支持Web Share API
    if (navigator.share) {
        navigator.share({
            title: '🎄 圣诞祝福',
            text: '我为你准备了一份特别的圣诞祝福！',
            url: link
        }).then(() => {
            showToast('✅ 分享成功');
        }).catch((err) => {
            if (err.name !== 'AbortError') {
                console.error('分享失败:', err);
                copyLink(); // 回退到复制
            }
        });
    } else {
        // 不支持则复制链接
        copyLink();
    }
}

