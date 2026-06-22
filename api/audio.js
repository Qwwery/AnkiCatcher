// api/audio.js

/**
 * Генерирует URL с аудио через Google TTS (неофициальный API)
 * @param {string} text - Текст для озвучки
 * @param {string} lang - Язык (по умолчанию 'en')
 * @returns {Promise<string|null>} - URL с аудио
 */
export async function getAudioUrl(text, lang = 'en') {
    try {
        if (!text || text.trim().length === 0) {
            return null;
        }

        // Google TTS URL (работает без ключа)
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

        console.log('🔊 Аудио URL:', url);
        return url;

    } catch (error) {
        console.error('Google TTS error:', error);
        return null;
    }
}

/**
 * Тестовая функция
 */
export async function testAudio() {
    console.log('🧪 Тест аудио...');
    const audioUrl = await getAudioUrl('hello');
    console.log('✅ Аудио URL:', audioUrl);
    return audioUrl;
}