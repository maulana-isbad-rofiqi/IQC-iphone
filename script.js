// --- STATE ---
const state = {
    messages: [],
    mode: 'lockscreen' // or 'whatsapp'
};

// --- ELEMENTS ---
const els = {
    // System
    sysTime: document.getElementById('sys-time'),
    sysBatt: document.getElementById('sys-battery'),
    sysTheme: document.getElementById('sys-theme'), // New
    dispSysTime: document.getElementById('disp-sys-time'),
    dispSysBatt: document.getElementById('disp-sys-battery'),
    
    // Panels & Views
    panelLock: document.getElementById('panel-lockscreen'),
    panelWa: document.getElementById('panel-whatsapp'),
    viewLock: document.getElementById('view-lockscreen'),
    viewWa: document.getElementById('view-whatsapp'),

    // Lock Screen Inputs
    lsOp: document.getElementById('ls-operator'),
    lsDate: document.getElementById('ls-date'),
    lsSender: document.getElementById('ls-sender'),
    lsMsg: document.getElementById('ls-message'),
    lsTimeAgo: document.getElementById('ls-time-ago'),

    // Lock Screen Displays
    dispLsOp: document.getElementById('disp-ls-operator'),
    dispLsDate: document.getElementById('disp-ls-date'),
    dispLsSender: document.getElementById('disp-ls-sender'),
    dispLsMsg: document.getElementById('disp-ls-message'),
    dispLsTimeAgo: document.getElementById('disp-ls-time-ago'),
    dispLsClock: document.getElementById('disp-ls-clock'), // uses sysTime

    // WA Inputs
    waName: document.getElementById('wa-name'),
    waStatus: document.getElementById('wa-status'),
    waAvatarIn: document.getElementById('wa-avatar-input'),
    waInMsg: document.getElementById('wa-input-msg'),
    waInTime: document.getElementById('wa-input-time'),
    waInPos: document.getElementById('wa-input-pos'),
    waInCheck: document.getElementById('wa-input-check'),
    waCheckGroup: document.getElementById('wa-check-group'),

    // WA Displays
    dispWaName: document.getElementById('disp-wa-name'),
    dispWaStatus: document.getElementById('disp-wa-status'),
    dispWaAvatar: document.getElementById('disp-wa-avatar'),
    dispWaDefault: document.getElementById('disp-wa-avatar-default'),
    waChatList: document.getElementById('wa-chat-list'),
    
    // Sidebar List
    msgList: document.getElementById('message-list'),

    // Overlay
    overlay: document.getElementById('wa-overlay')
};

// --- INIT & EVENTS ---

function init() {
    // System
    els.sysTime.addEventListener('input', updateTime);
    els.sysBatt.addEventListener('input', updateBattery);
    els.sysTheme.addEventListener('change', updateTheme); // New

    // Lock Screen
    els.lsOp.addEventListener('input', (e) => els.dispLsOp.textContent = e.target.value);
    els.lsDate.addEventListener('input', (e) => els.dispLsDate.textContent = e.target.value);
    els.lsSender.addEventListener('input', (e) => els.dispLsSender.textContent = e.target.value);
    els.lsMsg.addEventListener('input', (e) => els.dispLsMsg.textContent = e.target.value);
    els.lsTimeAgo.addEventListener('input', (e) => els.dispLsTimeAgo.textContent = e.target.value);

    // Wallpaper
    document.getElementById('ls-wallpaper').addEventListener('change', handleWallpaperChange);
    document.getElementById('ls-wallpaper-input').addEventListener('change', handleWallpaperUpload);

    // WA Profile
    els.waName.addEventListener('input', (e) => els.dispWaName.textContent = e.target.value);
    els.waStatus.addEventListener('input', (e) => els.dispWaStatus.textContent = e.target.value);
    els.waAvatarIn.addEventListener('change', handleAvatarUpload);

    // WA Input Logic
    els.waInPos.addEventListener('change', (e) => {
        els.waCheckGroup.style.display = e.target.value === 'right' ? 'flex' : 'none';
    });

    // Overlay Click to Close
    els.overlay.addEventListener('click', closeReactionMode);

    // Download
    document.getElementById('btn-download').addEventListener('click', downloadImage);
}

// --- FUNCTIONS ---

function switchTab(mode) {
    state.mode = mode;
    
    // Buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    // Panels
    els.panelLock.classList.remove('active');
    els.panelWa.classList.remove('active');
    if (mode === 'lockscreen') els.panelLock.classList.add('active');
    else els.panelWa.classList.add('active');

    // Views
    els.viewLock.classList.remove('active');
    els.viewWa.classList.remove('active');
    if (mode === 'lockscreen') els.viewLock.classList.add('active');
    else els.viewWa.classList.add('active');
}

function updateTime(e) {
    const val = e.target.value;
    els.dispSysTime.textContent = val;
    els.dispLsClock.textContent = val;
}

function updateBattery(e) {
    let val = parseInt(e.target.value);
    if(isNaN(val)) val = 100; // fallback
    if(val > 100) val = 100;
    if(val < 0) val = 0;
    
    // Update text (without % symbol)
    document.getElementById('disp-batt-num').textContent = val;
    
    // Update fill
    els.dispSysBatt.style.width = val + '%';
    els.dispSysBatt.style.background = val <= 20 ? '#ff453a' : 'white';
    
    // Update text color based on battery level and theme
    const battNum = document.getElementById('disp-batt-num');
    const isLight = document.querySelector('.phone-frame').classList.contains('theme-light');
    
    if(val <= 20) {
        // Low battery - red background, white text
        battNum.style.color = '#fff';
    } else {
        // Normal battery - white/black background, black/white text
        battNum.style.color = '#000';
    }
    
    // Adjust fill color for theme
    if(isLight && val > 20) {
        els.dispSysBatt.style.background = 'black';
        battNum.style.color = '#fff';
    } else if (!isLight && val > 20) {
        els.dispSysBatt.style.background = 'white';
        battNum.style.color = '#000';
    }
}

function updateTheme(e) {
    const theme = e.target.value;
    const phone = document.querySelector('.phone-frame');
    const waView = document.getElementById('view-whatsapp');
    const battFill = els.dispSysBatt;
    
    // Trigger battery update to fix colors immediately
    const currentBattVal = parseInt(els.sysBatt.value) || 100;

    if(theme === 'light') {
        phone.classList.add('theme-light');
        waView.style.background = '#e4ddd6'; 
        if(currentBattVal > 20) battFill.style.background = 'black';
    } else {
        phone.classList.remove('theme-light');
        waView.style.background = '#0b141a';
        if(currentBattVal > 20) battFill.style.background = 'white';
    }
}

function handleWallpaperChange(e) {
    const value = e.target.value;
    const uploadGroup = document.getElementById('wallpaper-upload-group');
    const lockscreenView = document.getElementById('view-lockscreen');
    
    if(value === 'custom') {
        uploadGroup.style.display = 'flex';
    } else {
        uploadGroup.style.display = 'none';
        // Apply gradient wallpapers
        const gradients = {
            gradient1: 'linear-gradient(180deg, #2c3e50 0%, #000 100%)',
            gradient2: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
            gradient3: 'linear-gradient(180deg, #11998e 0%, #38ef7d 100%)',
            gradient4: 'linear-gradient(180deg, #ee0979 0%, #ff6a00 100%)'
        };
        lockscreenView.style.backgroundImage = '';
        lockscreenView.style.background = gradients[value] || gradients.gradient1;
    }
}

function handleWallpaperUpload(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const lockscreenView = document.getElementById('view-lockscreen');
            lockscreenView.style.backgroundImage = `url(${e.target.result})`;
            lockscreenView.style.backgroundSize = 'cover';
            lockscreenView.style.backgroundPosition = 'center';
            lockscreenView.style.backgroundRepeat = 'no-repeat';
        }
        reader.readAsDataURL(file);
    }
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            els.dispWaAvatar.src = event.target.result;
            els.dispWaAvatar.style.display = 'block';
            els.dispWaDefault.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
}

// --- CHAT LOGIC ---

function addMessage() {
    const text = els.waInMsg.value;
    if(!text) return;

    const msg = {
        id: Date.now(),
        text: text,
        time: els.waInTime.value,
        pos: els.waInPos.value,
        check: els.waInCheck.value
    };

    state.messages.push(msg);
    renderMessages();
    renderSidebarList();
    els.waInMsg.value = ''; // clear
}

function deleteMessage(id) {
    state.messages = state.messages.filter(m => m.id !== id);
    renderMessages();
    renderSidebarList();
    closeReactionMode();
}

function renderMessages() {
    const container = els.waChatList;
    container.innerHTML = ''; // clear

    state.messages.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `bubble bubble-${msg.pos}`;
        bubble.id = `msg-${msg.id}`;

        // Checkmark Logic
        let checkSvg = '';
        if(msg.pos === 'right' && msg.check !== 'none') {
            const isLight = document.querySelector('.phone-frame').classList.contains('theme-light');
            const blueColor = '#53bdeb'; // Blue check
            const grayColor = isLight ? '#8696a0' : '#8696a0'; // Gray check (lighter in light mode maybe?) Standard WA is pretty consistent
            
            let color = msg.check === 'read' ? blueColor : grayColor;

            if(msg.check === 'sent') {
                // Check 1
                checkSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            } else {
                // Check 2
                checkSvg = `
                    <div style="position:relative; width:16px; height:11px;">
                        <svg viewBox="0 0 24 24" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="position:absolute; right:0; top:0; width:16px; height:16px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <svg viewBox="0 0 24 24" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="position:absolute; right:-5px; top:0; width:16px; height:16px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    `;
            }
        }

        bubble.innerHTML = `
            ${msg.text.replace(/\n/g, '<br>')}
            <div class="bubble-meta">
                <span class="bubble-time">${msg.time}</span>
                <div class="bubble-check">${checkSvg}</div>
            </div>
        `;

        container.appendChild(bubble);
    });
    
    // Auto scroll if not in active mode
    if(!els.overlay.classList.contains('active')) {
        container.scrollTop = container.scrollHeight;
    }
}

function renderSidebarList() {
    const list = els.msgList;
    list.innerHTML = '';
    
    state.messages.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'list-item';
        const posTxt = msg.pos === 'left' ? 'Kiri' : 'Kanan';
        item.innerHTML = `
            <div class="list-text"><b>[${posTxt}]</b> ${msg.text}</div>
            <div class="list-actions">
                <button class="btn-icon" onclick="activateReactionMode(${msg.id})">👆</button>
                <button class="btn-icon btn-del" onclick="deleteMessage(${msg.id})">✕</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// --- LONG PRESS LOGIC ---

function activateReactionMode(id) {
    closeReactionMode(); // Reset first

    const bubble = document.getElementById(`msg-${id}`);
    if(!bubble) return;

    // 1. Activate Overlay
    els.overlay.classList.add('active');

    // 2. Highlight Bubble (Clone it visually or boost z-index)
    // Boosting z-index is easier but we need position relative to container
    bubble.classList.add('active-press');

    // 3. Get Position
    // We need offset relative to the container (.wa-chat-container)
    // bubble.offsetTop includes padding-top of container.
    const bubbleTop = bubble.offsetTop;
    const bubbleHeight = bubble.offsetHeight;
    const isRight = bubble.classList.contains('bubble-right');

    // 4. Inject Reaction Bar
    // Menggunakan Image URL dari Emojipedia/Apple CDN agar tampilan persis iOS di semua perangkat
    const emojiUrls = {
        like: 'https://em-content.zobj.net/source/apple/391/thumbs-up_1f44d.png',
        love: 'https://em-content.zobj.net/source/apple/391/red-heart_2764-fe0f.png',
        haha: 'https://em-content.zobj.net/source/apple/391/face-with-tears-of-joy_1f602.png',
        wow:  'https://em-content.zobj.net/source/apple/391/face-with-open-mouth_1f62e.png',
        sad:  'https://em-content.zobj.net/source/apple/391/crying-face_1f622.png',
        pray: 'https://em-content.zobj.net/source/apple/391/folded-hands_1f64f.png'
    };

    const rBar = document.createElement('div');
    rBar.className = 'reaction-bar temp-ui';
    rBar.innerHTML = `
        <div class="reaction"><img src="${emojiUrls.like}" alt="like"></div>
        <div class="reaction"><img src="${emojiUrls.love}" alt="love"></div>
        <div class="reaction"><img src="${emojiUrls.haha}" alt="haha"></div>
        <div class="reaction"><img src="${emojiUrls.wow}" alt="wow"></div>
        <div class="reaction"><img src="${emojiUrls.sad}" alt="sad"></div>
        <div class="reaction"><img src="${emojiUrls.pray}" alt="pray"></div>
        <div class="reaction reaction-more">
            <svg viewBox="0 0 24 24" fill="#8e8e93"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
        </div>
    `;
    rBar.style.top = (bubbleTop - 55) + 'px';
    
    if(isRight) {
        rBar.style.right = '15px';
        rBar.style.transformOrigin = 'bottom right';
    } else {
        rBar.style.left = '15px';
        rBar.style.transformOrigin = 'bottom left';
    }
    els.waChatList.appendChild(rBar);

    // 5. Inject Context Menu
    const menu = document.createElement('div');
    menu.className = 'ctx-menu temp-ui';
    menu.innerHTML = `
        <div class="ctx-item">Balas <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg></div>
        <div class="ctx-item">Teruskan <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path></svg></div>
        <div class="ctx-item">Salin <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div>
        <div class="ctx-item">Tanya Meta AI <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
        <div class="ctx-item danger">Hapus <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></div>
        <div class="ctx-item">Lainnya... <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></div>
    `;
    menu.style.top = (bubbleTop + bubbleHeight + 8) + 'px';

    if(isRight) {
        menu.style.right = '15px';
        menu.style.transformOrigin = 'top right';
    } else {
        menu.style.left = '15px';
        menu.style.transformOrigin = 'top left';
    }
    els.waChatList.appendChild(menu);

    // Scroll into view if needed?
    // For now assume user positioned chat correctly
}

function closeReactionMode() {
    els.overlay.classList.remove('active');
    
    // Remove active class from bubbles
    document.querySelectorAll('.active-press').forEach(el => el.classList.remove('active-press'));
    
    // Remove temp UI
    document.querySelectorAll('.temp-ui').forEach(el => el.remove());
}

function downloadImage() {
    const btn = document.getElementById('btn-download');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generating...';

    // Check if we're in WhatsApp mode and close blur if active
    if(state.mode === 'whatsapp') {
        closeReactionMode();
        
        // Wait for blur to close completely
        setTimeout(() => {
            captureAndDownload(btn, originalText);
        }, 300);
    } else {
        // Lockscreen mode - capture immediately
        captureAndDownload(btn, originalText);
    }
}

function captureAndDownload(btn, originalText) {
    const phoneFrame = document.getElementById('capture-area');
    
    html2canvas(phoneFrame, {
        scale: 2,
        backgroundColor: '#000',
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'IQC-iPhone-' + Date.now() + '.png';
        link.href = canvas.toDataURL();
        link.click();
        btn.innerHTML = originalText;
    }).catch(e => {
        console.error(e);
        alert('Error generating image');
        btn.innerHTML = originalText;
    });
}

// Make global for onclick html
window.switchTab = switchTab;
window.addMessage = addMessage;
window.activateReactionMode = activateReactionMode;
window.deleteMessage = deleteMessage;

// Run
init();
