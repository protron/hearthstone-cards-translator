var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var awesomplete;
var nameTranslations;
function updateResult() {
    var translatedName = '';
    var selectedCard = awesomplete.input.value;
    if (selectedCard) {
        var translations = nameTranslations[selectedCard];
        if (!translations) {
            console.log("No entry found for card '".concat(selectedCard, "'"));
        }
        else {
            var selectedTargetLang = document.getElementById("targetLanguage").value;
            translatedName = translations[selectedTargetLang];
            if (!translatedName) {
                console.log("Card '".concat(selectedCard, "' found for other languages but not this one."), translations);
            }
        }
    }
    document.getElementById("result").innerText = translatedName;
}
function initAwesomplete() {
    var input = document.getElementById("cardNames");
    awesomplete = new Awesomplete(input);
    awesomplete.minChars = 1;
    awesomplete.autoFirst = true;
    input.addEventListener("awesomplete-selectcomplete", updateResult, true);
}
function updateAwesomplete(nameTranslations) {
    var cardOptions = getObjectKeys(nameTranslations);
    awesomplete.list = cardOptions;
}
function getObjectKeys(obj) {
    var keys = [];
    for (var key in obj)
        if (obj.hasOwnProperty(key))
            keys.push(key);
    return keys;
}
function getUrlTranslations(sourceLanguage) {
    return 'translations-' + sourceLanguage + '.json?v=#{version}';
}
function clearTexts() {
    awesomplete.input.value = null;
    document.getElementById("result").textContent = null;
}
function loadTranslations() {
    return __awaiter(this, void 0, void 0, function () {
        var sourceLanguage, urlTranslations, jsFileContent, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clearTexts();
                    sourceLanguage = document.getElementById("sourceLanguage").value;
                    console.log("Loading translations for " + sourceLanguage);
                    urlTranslations = getUrlTranslations(sourceLanguage);
                    return [4, fetch(urlTranslations)];
                case 1:
                    jsFileContent = _a.sent();
                    return [4, jsFileContent.json()];
                case 2:
                    data = _a.sent();
                    nameTranslations = data;
                    updateAwesomplete(nameTranslations);
                    console.log("Loaded translations for " + sourceLanguage);
                    return [2];
            }
        });
    });
}
function onSourceLangChange() {
    loadTranslations();
}
function onTargetLangChange() {
    updateResult();
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initAwesomplete();
                    document.getElementById("sourceLanguage").addEventListener("change", onSourceLangChange);
                    return [4, loadTranslations()];
                case 1:
                    _a.sent();
                    document.getElementById("targetLanguage").addEventListener("change", onTargetLangChange);
                    return [2];
            }
        });
    });
}
init();
//# sourceMappingURL=clientside.js.map