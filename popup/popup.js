// Перевод
document.getElementById('translate').addEventListener('click', () => {
    const word = document.getElementById('word').value.trim();
    const output = document.getElementById('output');

    if (!word) {
        output.textContent = '❌ Введи слово!';
        return;
    }

    output.textContent = 'Загрузка...';

    chrome.runtime.sendMessage(
        { action: 'translate', word: word },
        (response) => {
            if (chrome.runtime.lastError) {
                output.textContent = `❌ Ошибка: ${chrome.runtime.lastError.message}`;
                return;
            }

            if (response && response.success) {
                output.textContent = `✅ ${word} → ${response.translation}`;
            } else {
                output.textContent = `❌ ${response?.error || 'Неизвестная ошибка'}`;
            }
        }
    );
});

// Аудио
document.getElementById('testAudio').addEventListener('click', () => {
    const word = document.getElementById('word').value.trim();
    const output = document.getElementById('output');

    if (!word) {
        output.textContent = '❌ Введи слово!';
        return;
    }

    output.textContent = 'Получаю аудио...';

    chrome.runtime.sendMessage(
        { action: 'getAudio', word: word },
        (response) => {
            if (chrome.runtime.lastError) {
                output.textContent = `❌ Ошибка: ${chrome.runtime.lastError.message}`;
                return;
            }

            if (response && response.success && response.audioUrl) {
                output.textContent = `🔊 Озвучиваю: ${word}`;

                // Создаём аудио элемент и проигрываем
                const audio = new Audio(response.audioUrl);
                audio.play()
                    .then(() => {
                        console.log('✅ Аудио играет');
                    })
                    .catch(err => {
                        console.error('❌ Ошибка воспроизведения:', err);
                        output.textContent += '\n⚠️ Не удалось воспроизвести';
                    });
            } else {
                output.textContent = `❌ ${response?.error || 'Не удалось получить аудио'}`;
            }
        }
    );
});