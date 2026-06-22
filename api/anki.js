// api/anki.js

const ANKI_CONNECT_URL = 'http://localhost:8765';

async function ankiRequest(action, params = {}) {
    try {
        const response = await fetch(ANKI_CONNECT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, version: 6, params })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        return data.result;
    } catch (error) {
        console.error('AnkiConnect error:', error);
        throw error;
    }
}

export async function checkConnection() {
    try {
        const version = await ankiRequest('version');
        return { success: true, version };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Получает список всех колод
 */
export async function getDeckNames() {
    try {
        const decks = await ankiRequest('deckNames');
        // Добавляем "Default" если его нет
        if (!decks.includes('Default')) {
            decks.unshift('Default');
        }
        return decks;
    } catch (error) {
        console.error('Get decks error:', error);
        return ['Default'];
    }
}

async function getModelNames() {
    return await ankiRequest('modelNames');
}

async function getModelFieldNames(modelName) {
    return await ankiRequest('modelFieldNames', { modelName });
}

async function findSuitableModel() {
    const models = await getModelNames();
    const preferredNames = ['Basic', 'Basic (and reversed card)', 'Словарь', 'Слово'];

    for (const name of preferredNames) {
        if (models.includes(name)) {
            const fields = await getModelFieldNames(name);
            return { name, fields };
        }
    }

    for (const name of models) {
        const fields = await getModelFieldNames(name);
        if (fields.length >= 2) {
            return { name, fields };
        }
    }

    throw new Error('Не найдена подходящая модель в Anki.');
}

async function createDeck(deckName) {
    try {
        const decks = await ankiRequest('deckNames');
        if (decks.includes(deckName)) return true;
        await ankiRequest('createDeck', { deck: deckName });
        return true;
    } catch (error) {
        return false;
    }
}

export async function addCard(card, deckName = 'Default') {
    try {
        await createDeck(deckName);
        const model = await findSuitableModel();

        const frontField = model.fields[0];
        const backField = model.fields[1];

        let backHtml = `<div style="font-size: 18px; text-align: center;">`;
        backHtml += `<div style="margin-bottom: 10px;"><strong>${card.word}</strong></div>`;  // Английское слово

        if (card.context) {
            backHtml += `<div style="font-size: 14px; color: #666; margin-bottom: 10px; font-style: italic;">${card.context}</div>`;
        }

        if (card.audioUrl) {
            // Используем data URL для аудио
            backHtml += `<div style="margin: 10px 0;"><audio controls src="${card.audioUrl}"></audio></div>`;
        }

        backHtml += `</div>`;

        const note = {
                        note: {
                deckName,
                modelName: model.name,
                fields: { 
                    [frontField]: card.translation,    // Русский перевод (лицевая сторона)
                    [backField]: backHtml              // Английское слово + аудио (оборот)
                },
                options: { allowDuplicate: false, duplicateScope: 'deck' },
                tags: ['auto-added', 'extension']
            }
        };

        const noteId = await ankiRequest('addNote', note);
        console.log('✅ Card added! ID:', noteId);
        return { success: true, noteId };
    } catch (error) {
        console.error('Add card error:', error);
        return { success: false, error: error.message };
    }
}
