const textFrom = document.querySelector(".text-from");
const textTo = document.querySelector(".text-to");
const selectTag = document.querySelectorAll("select");
const exchange = document.querySelector(".exchange i");
const icons = document.querySelectorAll(".icons i");

selectTag.forEach((tag, id) => {
    for (const countryCode in countries) {
        let selected;
        if(id == 0 && countryCode == "en-GB") {
            selected = "selected";
        }else if (id == 1 && countryCode == "ar-SA") {
            selected = "selected";
        }
        let option = `<option value="${countryCode}" ${selected}>${countries[countryCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    };
});

let typingTimer;
const doneTypingInterval = 500;

textFrom.addEventListener("input", () => {
    clearTimeout(typingTimer);

typingTimer = setTimeout(() => {
    translateText();
    }, doneTypingInterval);
});

function translateText() {
    let text = textFrom.value;
    if (text.trim() === '') {
        textTo.value = '';
        return; // Exit the function
    }
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
    const apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`

    fetch(apiURL).then(res => res.json()).then(data => {
        textTo.value = data.responseData.translatedText;
    });
};

exchange.addEventListener("click", () => {
    let tempText = textFrom.value;
    let tempLang = selectTag[0].value;
    textFrom.value = textTo.value;
    selectTag[0].value = selectTag[1].value;
    textTo.value = tempText;
    selectTag[1].value = tempLang;
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                new ClipboardJS("#from", {
                    text: function() {
                        return textFrom.value;
                    }
                })
            }else {
                new ClipboardJS("#to", {
                    text: function() {
                        return textTo.value;
                    }
                })
            }
        }else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(textFrom.value);
                utterance.lang = selectTag[0].value;
            }else {
                utterance = new SpeechSynthesisUtterance(textTo.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});