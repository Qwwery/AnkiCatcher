import { translateWord } from './api/translate.js';
import { getAudioUrl, getAudioAsDataUrl } from './api/audio.js';
import { checkConnection, addCard, getDeckNames } from './api/anki.js';

console.log('🚀 Background script ЗАГРУЖЕН!');

chrome.runtime.onInstalled.addListener(() => {
    console.log('🎉 Расширение установлено!');

    chrome.contextMenus.create({
        id: 'addToAnki',
        title: '🎴 Добавить карточку в Anki',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'addToAnki') {
        console.log('📝 Выделенный текст:', info.selectionText);

        await chrome.storage.local.set({ selectedText: info.selectionText });

        try {
            await chrome.tabs.sendMessage(tab.id, {
                action: 'showPopup',
                text: info.selectionText
            });
        } catch (error) {
            console.error('Content script не загружен. Обнови страницу (F5).');
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Получено сообщение:', request);

    if (request.action === 'translate') {
        translateWord(request.word)
            .then(translation => sendResponse({ success: true, translation }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'getAudio') {
        // Возвращаем data URL (работает везде, без CORS!)
        getAudioAsDataUrl(request.word)
            .then(audioUrl => sendResponse({ success: true, audioUrl }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'getDecks') {
        getDeckNames()
            .then(decks => sendResponse({ success: true, decks }))
            .catch(error => sendResponse({ success: false, error: error.message, decks: ['Default'] }));
        return true;
    }

    if (request.action === 'addToAnki') {
        addCard(request.card, request.deckName || 'Default')
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'checkAnki') {
        checkConnection()
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    return false;
});