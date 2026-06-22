# Anki Catcher 🎴

[English](#english) | [Русский](#русский)

---

## English

**Quickly create Anki flashcards from any word on a webpage with translation, audio pronunciation, and one-click Anki integration.**

### ✨ Features

- 🔤 **Instant Translation** - Powered by Google Translate
- 🔊 **Native Audio Pronunciation** - High-quality TTS from Google
- 📚 **One-Click Anki Integration** - Seamlessly add cards to your decks
- 🖱️ **Context Menu** - Right-click any selected text to add a card
-  **Custom Deck Selection** - Choose which deck to add cards to
- 💾 **Smart Settings** - Remembers your last used deck
- ⚡ **No API Keys Required** - Works out of the box (for translation and audio)
- 🌐 **Works on Any Website** - Learn from content you already read

### 📦 Installation

#### 1. Install Anki

Download and install [Anki](https://apps.ankiweb.net/) - a powerful spaced repetition flashcard program.

#### 2. Install AnkiConnect Plugin

AnkiConnect is required for the extension to communicate with Anki:

1. Open Anki
2. Go to **Tools** → **Add-ons** → **Get Add-ons**
3. Enter code: **2055492159**
4. Click **OK** and restart Anki

#### 3. Install the Extension

**From GitHub:**
1. Download or clone this repository
2. Open your browser and go to:
   - Chrome/Edge/Yandex: `chrome://extensions/`
   - Firefox: `about:addons`
3. Enable **Developer Mode**
4. Click **Load unpacked** (or **Load Temporary Add-on** in Firefox)
5. Select the extension folder

**From Chrome Web Store** (coming soon):
- [Link will be added here]

### 🚀 Usage

#### Method 1: Context Menu (Recommended)

1. **Select any word** on a webpage
2. **Right-click** → choose **🎴 Add card to Anki**
3. A popup will appear with the selected word
4. Choose your deck (optional)
5. Click **Add card**
6. You'll see the translation and hear the pronunciation
7. The card is automatically added to Anki!

#### Method 2: Extension Popup

1. Click the extension icon in your browser toolbar
2. Enter a word manually
3. Choose your deck
4. Click **Add card**

### 📋 Requirements

- **Anki** (desktop application)
- **AnkiConnect** plugin (code: 2055492159)
- Modern browser (Chrome, Edge, Firefox, Yandex)
- Internet connection (for translation and audio)

### 🛠 Technologies

- **Chrome Extension API** (Manifest V3)
- **Google Translate API** (unofficial)
- **Google Text-to-Speech**
- **AnkiConnect API**
- **JavaScript (ES6+)**

### 📁 Project Structure
AnkiCatcher/
├── manifest.json # Extension configuration
├── background.js # Service worker
├── content.js # Content script (popup on page)
├── api/
│ ├── translate.js # Translation service
│ ├── audio.js # Audio generation
│ └── anki.js # AnkiConnect integration
└── popup/
├── popup.html # Extension popup UI
└── popup.js # Popup logic

### ⚙️ Settings

The extension automatically saves:
- Last used deck
- Selected text from context menu

All settings are stored locally in your browser.

### 🐛 Troubleshooting

**"Could not establish connection" error:**
- Refresh the page (F5) after installing/updating the extension

**Anki not connecting:**
- Make sure Anki is running
- Check that AnkiConnect plugin is installed
- Restart Anki

**"model was not found" error:**
- The extension will automatically find a suitable note type
- Or create a custom note type with at least 2 fields

### 📄 License

[GNU General Public License v3.0](LICENSE) - Free to use, modify, and distribute.

### 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome!

---

## Русский

**Быстрое создание карточек Anki из любых слов на веб-странице с переводом, озвучкой и интеграцией в один клик.**

### ✨ Возможности

- 🔤 **Мгновенный перевод** - через Google Translate
- 🔊 **Озвучка носителями** - качественный TTS от Google
- 📚 **Интеграция с Anki** - добавление карточек в один клик
- 🖱️ **Контекстное меню** - правый клик по выделенному тексту
- 📝 **Выбор колоды** - выбирайте, в какую колоду добавить
- 💾 **Умные настройки** - запоминает последнюю колоду
- ⚡ **Без API ключей** - работает сразу (перевод и аудио)
- 🌐 **Работает на любых сайтах** - учите слова из любого контента

### 📦 Установка

#### 1. Установите Anki

Скачайте и установите [Anki](https://apps.ankiweb.net/) - программу для интервального повторения.

#### 2. Установите плагин AnkiConnect

AnkiConnect необходим для связи расширения с Anki:

1. Откройте Anki
2. Перейдите в **Инструменты** → **Дополнения** → **Получить дополнения**
3. Введите код: **2055492159**
4. Нажмите **OK** и перезапустите Anki

#### 3. Установите расширение

**С GitHub:**
1. Скачайте или склонируйте репозиторий
2. Откройте браузер и перейдите:
   - Chrome/Edge/Yandex: `chrome://extensions/`
   - Firefox: `about:addons`
3. Включите **Режим разработчика**
4. Нажмите **Загрузить распакованное расширение**
5. Выберите папку с расширением

**Из Chrome Web Store** (скоро):
- [Ссылка будет добавлена]

### 🚀 Использование

#### Способ 1: Контекстное меню (рекомендуется)

1. **Выделите слово** на любой странице
2. **Правый клик** → выберите **🎴 Добавить карточку в Anki**
3. Появится всплывающее окно с выделенным словом
4. Выберите колоду (необязательно)
5. Нажмите **Добавить карточку**
6. Вы увидите перевод и услышите произношение
7. Карточка автоматически добавится в Anki!

#### Способ 2: Popup расширения

1. Кликните по иконке расширения в панели браузера
2. Введите слово вручную
3. Выберите колоду
4. Нажмите **Добавить карточку**

### 📋 Требования

- **Anki** (настольное приложение)
- Плагин **AnkiConnect** (код: 2055492159)
- Современный браузер (Chrome, Edge, Firefox, Yandex)
- Подключение к интернету (для перевода и аудио)

### 🛠 Технологии

- **Chrome Extension API** (Manifest V3)
- **Google Translate API** (неофициальный)
- **Google Text-to-Speech**
- **AnkiConnect API**
- **JavaScript (ES6+)**

### 📁 Структура проекта
AnkiCatcher/
├── manifest.json # Конфигурация расширения
├── background.js # Service worker
├── content.js # Content script (всплывающее окно)
├── api/
│ ├── translate.js # Сервис перевода
│ ├── audio.js # Генерация аудио
│ └── anki.js # Интеграция с AnkiConnect
└── popup/
├── popup.html # UI popup расширения
└── popup.js # Логика popup

### ⚙️ Настройки

Расширение автоматически сохраняет:
- Последнюю использованную колоду
- Выделенный текст из контекстного меню

Все настройки хранятся локально в браузере.

### 🐛 Решение проблем

**Ошибка "Could not establish connection":**
- Обновите страницу (F5) после установки/обновления расширения

**Anki не подключается:**
- Убедитесь, что Anki запущен
- Проверьте, что плагин AnkiConnect установлен
- Перезапустите Anki

**Ошибка "model was not found":**
- Расширение автоматически найдет подходящую модель
- Или создайте свою модель заметок с минимум 2 полями

### 📄 Лицензия

[GNU General Public License v3.0](LICENSE) - свободно используйте, изменяйте и распространяйте.

### 🤝 Участие в разработке

Pull request'ы, issues и предложения по новым функциям приветствуются!

---

**Сделано нейросетью Qwen3.7-Plus**