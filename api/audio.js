// api/audio.js

/**
 * Получает URL аудио через Google TTS
 */
export async function getAudioUrl(text, lang = 'en') {
    try {
        if (!text || text.trim().length === 0) return null;
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
        return url;
    } catch (error) {
        console.error('Google TTS error:', error);
        return null;
    }
}

/**
 * Скачивает аудио и возвращает как data URL (обходит CORS!)
 */
export async function getAudioAsDataUrl(text, lang = 'en') {
    try {
        const url = await getAudioUrl(text, lang);
        if (!url) return null;

        // Скачиваем аудио
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();

        // Конвертируем в data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Download audio error:', error);
        return null;
    }
}