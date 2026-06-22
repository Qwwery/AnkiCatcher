const wordInput = document.getElementById('word');
const deckSelect = document.getElementById('deck');
const addCardBtn = document.getElementById('addCard');
const resultDiv = document.getElementById('result');
const displayWord = document.getElementById('displayWord');
const displayTranslation = document.getElementById('displayTranslation');
const audioPlayer = document.getElementById('audioPlayer');
const statusDiv = document.getElementById('status');

// Загружаем список колод при открытии
loadDecks();

// Загружаем выделенный текст и сохранённую колоду
chrome.storage.local.get(['selectedText', 'selectedDeck'], (data) => {
    if (data.selectedText) {
        wordInput.value = data.selectedText;
        addCardBtn.focus();
        chrome.storage.local.remove('selectedText');
    }
    if (data.selectedDeck) {
        // Подождём, пока загрузятся колоды
        setTimeout(() => {
            deckSelect.value = data.selectedDeck;
        }, 500);
    }
});

// Сохраняем выбор колоды
deckSelect.addEventListener('change', () => {
    chrome.storage.local.set({ selectedDeck: deckSelect.value });
});

// Загрузка колод из Anki
async function loadDecks() {
    chrome.runtime.sendMessage({ action: 'getDecks' }, (response) => {
        if (response?.success && response.decks) {
            deckSelect.innerHTML = '';
            response.decks.forEach(deck => {
                const option = document.createElement('option');
                option.value = deck;
                option.textContent = deck;
                deckSelect.appendChild(option);
            });

            // Восстанавливаем сохранённую колоду
            chrome.storage.local.get('selectedDeck', (data) => {
                if (data.selectedDeck && response.decks.includes(data.selectedDeck)) {
                    deckSelect.value = data.selectedDeck;
                }
            });
        }
    });
}

addCardBtn.addEventListener('click', async () => {
    const word = wordInput.value.trim();

    if (!word) {
        showStatus('❌ Введи слово!', 'error');
        return;
    }

    addCardBtn.disabled = true;
    addCardBtn.textContent = 'Загрузка...';

    try {
        showStatus('📝 Получаю перевод...', 'loading');
        const translation = await getTranslation(word);

        showStatus('🔊 Получаю аудио...', 'loading');
        const audioUrl = await getAudio(word);

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
        await addToAnki(word, translation, audioUrl, deckSelect.value);

        showStatus('✅ Карточка добавлена в Anki!', 'success');

    } catch (error) {
        console.error('Error:', error);
        showStatus(`❌ Ошибка: ${error.message}`, 'error');
    } finally {
        addCardBtn.disabled = false;
        addCardBtn.textContent = 'Добавить карточку';
    }
});

async function getTranslation(word) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { action: 'translate', word },
            (response) => {
                if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                else if (response?.success) resolve(response.translation);
                else reject(new Error(response?.error || 'Не удалось перевести'));
            }
        );
    });
}

async function getAudio(word) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: 'getAudio', word },
            (response) => {
                resolve(response?.audioUrl || null);
            }
        );
    });
}

async function addToAnki(word, translation, audioUrl, deckName) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                action: 'addToAnki',
                card: { word, translation, audioUrl },
                deckName
            },
            (response) => {
                if (response?.success) resolve(response);
                else reject(new Error(response?.error || 'Не удалось добавить в Anki'));
            }
        );
    });
}

function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}