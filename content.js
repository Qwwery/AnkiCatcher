// content.js

let popupContainer = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showPopup') {
        showAnkiPopup(request.text);
        sendResponse({ success: true });
    }
    return true;
});

chrome.storage.local.get('selectedText', (data) => {
    if (data.selectedText) {
        showAnkiPopup(data.selectedText);
        chrome.storage.local.remove('selectedText');
    }
});

function showAnkiPopup(initialText = '') {
    if (popupContainer) {
        closePopup();
        return;
    }

    popupContainer = document.createElement('div');
    popupContainer.id = 'anki-catcher-popup';
    popupContainer.innerHTML = `
        <style>
            #anki-catcher-popup {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 2147483647;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                animation: anki-fade-in 0.2s ease-out;
            }
            @keyframes anki-fade-in { from { opacity: 0; } to { opacity: 1; } }
            #anki-catcher-popup .anki-card {
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 400px;
                max-width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: anki-slide-in 0.3s ease-out;
            }
            @keyframes anki-slide-in {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #anki-catcher-popup .anki-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            #anki-catcher-popup .anki-title {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin: 0;
            }
            #anki-catcher-popup .anki-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }
            #anki-catcher-popup .anki-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            #anki-catcher-popup input,
            #anki-catcher-popup select {
                width: 100%;
                padding: 10px 12px;
                font-size: 16px;
                border: 2px solid #ddd;
                border-radius: 6px;
                box-sizing: border-box;
                outline: none;
                margin-bottom: 10px;
            }
            #anki-catcher-popup input:focus,
            #anki-catcher-popup select:focus {
                border-color: #4CAF50;
            }
            #anki-catcher-popup label {
                display: block;
                font-size: 13px;
                color: #666;
                margin-bottom: 4px;
            }
            #anki-catcher-popup .anki-btn {
                width: 100%;
                padding: 12px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 15px;
                font-weight: bold;
                cursor: pointer;
            }
            #anki-catcher-popup .anki-btn:hover:not(:disabled) { background: #45a049; }
            #anki-catcher-popup .anki-btn:disabled { background: #ccc; cursor: not-allowed; }
            #anki-catcher-popup .anki-result {
                margin-top: 16px;
                padding: 16px;
                background: #f9f9f9;
                border-radius: 6px;
                display: none;
            }
            #anki-catcher-popup .anki-result.show { display: block; }
            #anki-catcher-popup .anki-word {
                font-size: 22px;
                font-weight: bold;
                color: #333;
                margin-bottom: 8px;
            }
            #anki-catcher-popup .anki-translation {
                font-size: 16px;
                color: #666;
                margin-bottom: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid #e0e0e0;
            }
            #anki-catcher-popup audio { width: 100%; margin-bottom: 12px; }
            #anki-catcher-popup .anki-status {
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 13px;
                margin-top: 8px;
            }
            #anki-catcher-popup .anki-status.success { background: #d4edda; color: #155724; }
            #anki-catcher-popup .anki-status.error { background: #f8d7da; color: #721c24; }
            #anki-catcher-popup .anki-status.loading { background: #fff3cd; color: #856404; }
        </style>
        
        <div class="anki-card">
            <div class="anki-header">
                <h3 class="anki-title">🎴 Anki Catcher</h3>
                <button class="anki-close" id="anki-close-btn">&times;</button>
            </div>
            <input type="text" id="anki-word-input" placeholder="Введи слово..." value="${escapeHtml(initialText)}">
            <label for="anki-deck-select">Колода:</label>
            <select id="anki-deck-select">
                <option value="Default">Default</option>
            </select>
            <button class="anki-btn" id="anki-add-btn">Добавить карточку</button>
            <div class="anki-result" id="anki-result">
                <div class="anki-word" id="anki-display-word"></div>
                <div class="anki-translation" id="anki-display-translation"></div>
                <audio id="anki-audio-player" controls></audio>
                <div class="anki-status" id="anki-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(popupContainer);

    const wordInput = popupContainer.querySelector('#anki-word-input');
    const deckSelect = popupContainer.querySelector('#anki-deck-select');
    const addBtn = popupContainer.querySelector('#anki-add-btn');
    const closeBtn = popupContainer.querySelector('#anki-close-btn');
    const resultDiv = popupContainer.querySelector('#anki-result');
    const displayWord = popupContainer.querySelector('#anki-display-word');
    const displayTranslation = popupContainer.querySelector('#anki-display-translation');
    const audioPlayer = popupContainer.querySelector('#anki-audio-player');
    const statusDiv = popupContainer.querySelector('#anki-status');

    setTimeout(() => wordInput.focus(), 100);

    // Загружаем колоды
    loadDecks();

    popupContainer.addEventListener('click', (e) => {
        if (e.target === popupContainer) closePopup();
    });

    closeBtn.addEventListener('click', closePopup);

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    wordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addBtn.click();
    });

    // Сохраняем выбор колоды
    deckSelect.addEventListener('change', () => {
        chrome.storage.local.set({ selectedDeck: deckSelect.value });
    });

    addBtn.addEventListener('click', async () => {
        const word = wordInput.value.trim();

        if (!word) {
            showStatus('❌ Введи слово!', 'error');
            return;
        }

        addBtn.disabled = true;
        addBtn.textContent = 'Загрузка...';

        try {
            showStatus('📝 Получаю перевод...', 'loading');
            const translation = await sendToBackground({ action: 'translate', word });

            showStatus('🔊 Получаю аудио...', 'loading');
            const audioUrl = await sendToBackground({ action: 'getAudio', word });

            displayWord.textContent = word;
            displayTranslation.textContent = translation;

            if (audioUrl) {
                audioPlayer.src = audioUrl;
                audioPlayer.style.display = 'block';
            } else {
                audioPlayer.style.display = 'none';
            }

            resultDiv.classList.add('show');

            showStatus('📚 Добавляю в Anki...', 'loading');
            await sendToBackground({
                action: 'addToAnki',
                card: { word, translation, audioUrl },
                deckName: deckSelect.value
            });

            showStatus('✅ Карточка добавлена в Anki!', 'success');
            setTimeout(closePopup, 2000);

        } catch (error) {
            console.error('Error:', error);
            showStatus(`❌ Ошибка: ${error.message}`, 'error');
            addBtn.disabled = false;
            addBtn.textContent = 'Добавить карточку';
        }
    });

    function loadDecks() {
        sendToBackground({ action: 'getDecks' })
            .then(decks => {
                deckSelect.innerHTML = '';
                decks.forEach(deck => {
                    const option = document.createElement('option');
                    option.value = deck;
                    option.textContent = deck;
                    deckSelect.appendChild(option);
                });

                // Восстанавливаем сохранённую колоду
                chrome.storage.local.get('selectedDeck', (data) => {
                    if (data.selectedDeck && decks.includes(data.selectedDeck)) {
                        deckSelect.value = data.selectedDeck;
                    }
                });
            })
            .catch(() => {
                // Anki не запущен — оставляем Default
            });
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `anki-status ${type}`;
    }

    function closePopup() {
        if (popupContainer) {
            popupContainer.remove();
            popupContainer = null;
        }
    }
}

function sendToBackground(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else if (response?.success) {
                if (message.action === 'translate') resolve(response.translation);
                else if (message.action === 'getAudio') resolve(response.audioUrl);
                else if (message.action === 'getDecks') resolve(response.decks);
                else resolve(response);
            } else {
                reject(new Error(response?.error || 'Неизвестная ошибка'));
            }
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/"/g, '&quot;');
}