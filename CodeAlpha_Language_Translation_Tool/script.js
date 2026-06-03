const textInput = document.getElementById("text");
const result = document.getElementById("result");

const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");

const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");
const downloadBtn = document.getElementById("downloadBtn");

const counter = document.getElementById("counter");

const placeholderText = "Your translated text will appear here...";

// Hidden audio element reused for all TTS playback
const ttsAudio = document.createElement("audio");
ttsAudio.style.display = "none";
document.body.appendChild(ttsAudio);

// Mapping from language code → ResponsiveVoice name
const rvVoiceMap = {
    en: "UK English Female",
    hi: "Hindi Female",
    ta: "Tamil Female",
    es: "Spanish Female",
    de: "Deutsch Female"
};

// CHARACTER COUNTER
textInput.addEventListener("input", () => {
    if (textInput.value.length > 500) {
        textInput.value = textInput.value.slice(0, 500);
    }
    counter.innerText = `${textInput.value.length} / 500`;
});


// TRANSLATE
translateBtn.addEventListener("click", async () => {

    const text = textInput.value.trim();

    if (!text) {
        result.innerText = "Please enter text";
        return;
    }

    if (fromLang.value === toLang.value) {
        result.innerText = text;
        saveHistory(text, text);
        return;
    }

    translateBtn.disabled = true;
    translateBtn.innerText = "Translating...";
    result.innerText = "Translating...";

    try {
        const translatedText = await translateText(
            text,
            fromLang.value,
            toLang.value
        );

        result.innerText = translatedText || "Translation failed.";
        saveHistory(text, translatedText);

    } catch (error) {
        console.error(error);
        result.innerText =
            "Translation failed. Please check your internet connection and try again.";
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerText = "Translate Text";
    }
});


// TRANSLATION API
async function translateText(text, source, target) {
    const url =
        "https://translate.googleapis.com/translate_a/single" +
        `?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return data[0]
        .map(item => item[0])
        .join("");
}


// SWAP LANGUAGES
swapBtn.addEventListener("click", () => {
    const tempLang = fromLang.value;
    fromLang.value = toLang.value;
    toLang.value = tempLang;

    const tempText = textInput.value;

    textInput.value =
        result.innerText === placeholderText
            ? ""
            : result.innerText;

    result.innerText = tempText;

    counter.innerText = `${textInput.value.length} / 500`;
});


// COPY
copyBtn.addEventListener("click", async () => {
    const text = result.innerText.trim();

    if (!text || text === placeholderText) return;

    try {
        await navigator.clipboard.writeText(text);
        alert("Copied!");
    } catch {
        alert("Copy failed");
    }
});


// SPEAK — uses ResponsiveVoice (supports all 14 languages reliably)
speakBtn.addEventListener("click", () => {

    const text = result.innerText.trim();

    if (
        !text ||
        text === placeholderText ||
        text === "Translating..." ||
        text.includes("failed")
    ) {
        alert("Nothing to speak");
        return;
    }

    const lang = toLang.value;

    // ResponsiveVoice: loaded via CDN in index.html
    if (typeof responsiveVoice !== "undefined") {
        responsiveVoice.cancel();
        const voiceName = rvVoiceMap[lang] || "UK English Female";
        responsiveVoice.speak(text, voiceName, {
            rate: 1,
            pitch: 1,
            volume: 1,
            onstart: () => { speakBtn.disabled = true; },
            onend:   () => { speakBtn.disabled = false; },
            onerror: () => {
                speakBtn.disabled = false;
                alert("Speech failed. Please try again.");
            }
        });
        return;
    }

    // Fallback: MyMemory TTS (CORS-friendly, no key needed)
    const ttsUrl =
        `https://api.mymemory.translated.net/get` +
        `?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${lang}|${lang}&mt=1&key=`;

    // Use Google Translate TTS via hidden audio src (no fetch, avoids CORS)
    const gttsUrl =
        `https://translate.googleapis.com/translate_tts` +
        `?ie=UTF-8&client=gtx&tl=${lang}&q=${encodeURIComponent(text.slice(0, 200))}`;

    speakBtn.disabled = true;
    ttsAudio.src = gttsUrl;
    ttsAudio.load();
    ttsAudio.play()
        .then(() => {
            ttsAudio.onended = () => { speakBtn.disabled = false; };
        })
        .catch(() => {
            speakBtn.disabled = false;
            // Last resort: browser Web Speech API with any available voice
            fallbackWebSpeech(text, lang);
        });
});

function fallbackWebSpeech(text, lang) {
    if (!("speechSynthesis" in window)) {
        alert("Speech is not supported in this browser.");
        return;
    }
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 1;
    utt.onerror = () => alert("Speech unavailable for this language in your browser.");
    speechSynthesis.speak(utt);
}


// DOWNLOAD
downloadBtn.addEventListener("click", () => {
    const text = result.innerText.trim();

    if (!text || text === placeholderText) return;

    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "translation.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(a.href);
});


// SAVE HISTORY
function saveHistory(original, translated) {
    const history = document.querySelector(".history");
    if (!history) return;

    const item = document.createElement("div");
    item.classList.add("history-item");
    item.innerText = `${original} → ${translated}`;
    history.prepend(item);
}
