import { translateWord } from './api/translate.js';
import { getAudioUrl } from './api/audio.js';

console.log('🚀 Background script ЗАГРУЖЕН!');

chrome.runtime.onInstalled.addListener(() => {
    console.log('🎉 Расширение установлено!');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Получено сообщение:', request);

    if (request.action === 'translate') {
        translateWord(request.word)
            .then(translation => {
                console.log('✅ Перевод:', translation);
                sendResponse({ success: true, translation });
            })
            .catch(error => {
                console.error('❌ Ошибка:', error.message);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }

    if (request.action === 'getAudio') {
        getAudioUrl(request.word)
            .then(audioUrl => {
                console.log('✅ Аудио URL получен');
                sendResponse({ success: true, audioUrl });
            })
            .catch(error => {
                console.error('❌ Ошибка аудио:', error.message);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }

    return false;
});