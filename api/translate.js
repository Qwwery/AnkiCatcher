// api/translate.js

export async function translateWord(word, sourceLang = 'en', targetLang = 'ru') {
    try {
        // Неофициальный Google Translate API
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(word)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Google возвращает массив: [[["перевод","оригинал",null,null,10]],null,"en"]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }

        throw new Error('Перевод не найден');

    } catch (error) {
        console.error('Google Translate error:', error);
        throw error;
    }
}

export async function testTranslation() {
    try {
        const translation = await translateWord('hello');
        console.log('✅ Тест: hello →', translation);
        return translation;
    } catch (error) {
        console.error('❌ Ошибка теста:', error.message);
        return null;
    }
}