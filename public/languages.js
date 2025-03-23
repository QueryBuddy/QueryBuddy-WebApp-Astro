var languages = [
    { "language": "Afrikaans", "country": "ZA", "code": "af" },
    { "language": "አማርኛ", "country": "ET", "code": "am" },

    { "language": "العربية", "code": "ar" },
    { "country": "001", "code": "ar", "map": "ar" },
    { "country": "AE", "code": "ar", "map": "ar" },
    { "country": "BH", "code": "ar", "map": "ar" },
    { "country": "DJ", "code": "ar", "map": "ar" },
    { "country": "DZ", "code": "ar", "map": "ar" },
    { "country": "EG", "code": "ar", "map": "ar" },
    { "country": "ER", "code": "ar", "map": "ar" },
    { "country": "IL", "code": "ar", "map": "ar" },
    { "country": "IQ", "code": "ar", "map": "ar" },
    { "country": "JO", "code": "ar", "map": "ar" },
    { "country": "KM", "code": "ar", "map": "ar" },
    { "country": "KW", "code": "ar", "map": "ar" },
    { "country": "LE", "code": "ar", "map": "ar" },
    { "country": "LI", "code": "ar", "map": "ar" },
    { "country": "MA", "code": "ar", "map": "ar" },
    { "country": "MR", "code": "ar", "map": "ar" },
    { "country": "OM", "code": "ar", "map": "ar" },
    { "country": "PS", "code": "ar", "map": "ar" },
    { "country": "QA", "code": "ar", "map": "ar" },
    { "country": "SA", "code": "ar", "map": "ar" },
    { "country": "SD", "code": "ar", "map": "ar" },
    { "country": "SO", "code": "ar", "map": "ar" },
    { "country": "SS", "code": "ar", "map": "ar" },
    { "country": "SY", "code": "ar", "map": "ar" },
    { "country": "TD", "code": "ar", "map": "ar" },
    { "country": "TN", "code": "ar", "map": "ar" },
    { "country": "YE", "code": "ar", "map": "ar" },

    { "language": "Mapudungun", "country": "CL", "code": "arn" },
    { "language": "الدارجة المغربية", "country": "MA", "code": "ary" },
    { "language": "অসমীয়া", "country": "IN", "code": "as" },
    { "language": "Azərbaycan", "country": "AZ", "code": "az" },
    { "language": "Башҡорт", "country": "RU", "code": "ba" },
    { "language": "беларуская", "country": "BY", "code": "be" },
    { "language": "български", "country": "BG", "code": "bg" },

    { "language": "বাংলা", "code": "bn"},
    { "country": "BD", "code": "bn", "map": "bn" },
    { "country": "IN", "code": "bn", "map": "bn" },

    { "language": "བོད་ཡིག", "country": "CN", "code": "bo" },
    { "language": "Brezhoneg", "country": "FR", "code": "br" },
    { "language": "Bosanski", "country": "BA", "code": "bs" },
    { "language": "Català", "country": "ES", "code": "ca" },
    { "language": "کوردیی ناوەندی", "country": "IQ", "code": "ckb" },
    { "language": "Corsu", "country": "FR", "code": "co" },
    { "language": "Čeština", "country": "CZ", "code": "cs" },
    { "language": "Cymraeg", "country": "GB", "code": "cy" },
    { "language": "Dansk", "country": "DK", "code": "da" },
    { "language": "Deutsch", "country": "DE", "code": "de" },
    { "language": "Dolnoserbšćina", "country": "DE", "code": "dsb" },
    { "language": "ދިވެހިބަސް", "country": "MV", "code": "dv" },
    { "language": "Ελληνικά", "country": "GR", "code": "el" },

    { "language": "English", "code": "en", "map": "en"},
    { "country": "US", "code": "en", "map": "en"},
    { "country": "CA", "code": "en", "map": "en"},
    { "country": "GB", "code": "en", "map": "en"},
    { "country": "AU", "code": "en", "map": "en"},
    { "country": "NZ", "code": "en", "map": "en"},
    { "country": "ZA", "code": "en", "map": "en"},
    { "country": "IN", "code": "en", "map": "en"},

    { "language": "Español", "code": "es", "map": "es" },
    { "country": "ES", "code": "es", "map": "es" },
    { "country": "MX", "code": "es", "map": "es" },
    { "country": "419", "code": "es", "map": "es" },

    { "language": "Eesti", "country": "EE", "code": "et" },
    { "language": "Euskara", "country": "ES", "code": "eu" },
    { "language": "فارسى", "country": "IR", "code": "fa" },
    { "language": "Suomi", "country": "FI", "code": "fi" },
    { "language": "Filipino", "country": "PH", "code": "fil" },
    { "language": "Føroyskt", "country": "FO", "code": "fo" },
    { "language": "Français", "country": "FR", "code": "fr" },
    { "language": "Frysk", "country": "NL", "code": "fy" },
    { "language": "Gaeilge", "country": "IE", "code": "ga" },
    { "language": "Gàidhlig", "country": "GB", "code": "gd" },
    { "language": "Taetae ni Kiribati", "country": "KI", "code": "gil" },
    { "language": "Galego", "country": "ES", "code": "gl" },
    { "language": "Schweizerdeutsch", "country": "CH", "code": "gsw" },
    { "language": "ગુજરાતી", "country": "IN", "code": "gu" },
    { "language": "Hausa", "country": "NG", "code": "ha" },
    { "language": "עברית", "country": "IL", "code": "he" },
    { "language": "हिंदी", "country": "IN", "code": "hi" },
    { "language": "Hrvatski", "country": "HR", "code": "hr" },
    { "language": "hornjoserbšćina", "country": "DE", "code": "hsb" },
    { "language": "magyar", "country": "HU", "code": "hu" },
    { "language": "Հայերեն", "country": "AM", "code": "hy" },
    { "language": "Bahasa Indonesia", "country": "ID", "code": "id" },
    { "language": "Igbo", "country": "NG", "code": "ig" },
    { "language": "ꆈꌠꁱꂷ", "country": "CN", "code": "ii" },
    { "language": "Íslenska", "country": "IS", "code": "is" },
    { "language": "Italiano", "country": "IT", "code": "it" },
    { "language": "Inuktitut/ᐃᓄᒃᑎᑐᑦ (ᑲᓇᑕ)", "country": "CA", "code": "iu" },
    { "language": "日本語", "country": "JP", "code": "ja" },
    { "language": "ქართული", "country": "GE", "code": "ka" },
    { "language": "Қазақша", "country": "KZ", "code": "kk" },
    { "language": "Kalaallisut", "country": "GL", "code": "kl" },
    { "language": "ខ្មែរ", "country": "KH", "code": "km" },
    { "language": "ಕನ್ನಡ", "country": "IN", "code": "kn" },
    { "language": "한국어", "country": "KR", "code": "ko" },
    { "language": "कोंकणी", "country": "IN", "code": "kok" },

    { "language": "کوردی", "code": "ku" },
    { "country": "TR", "code": "ku" },
    { "country": "TR", "code": "kmr", "map": "ku" },
    { "country": "TR", "code": "sth", "map": "ku" },

    { "language": "Кыргыз", "country": "KG", "code": "ky" },
    { "language": "Lëtzebuergesch", "country": "LU", "code": "lb" },
    { "language": "ລາວ", "country": "LA", "code": "lo" },
    { "language": "Lietuvių", "country": "LT", "code": "lt" },
    { "language": "Latviešu", "country": "LV", "code": "lv" },
    { "language": "Reo Māori", "country": "NZ", "code": "mi" },
    { "language": "македонски јазик", "country": "MK", "code": "mk" },
    { "language": "മലയാളം", "country": "IN", "code": "ml" },
    { "language": "Монгол хэл/ᠮᠤᠨᠭᠭᠤᠯ ᠬᠡᠯᠡ", "country": "MN", "code": "mn" },
    { "language": "Kanien'kéha", "country": "CA", "code": "moh" },
    { "language": "मराठी", "country": "IN", "code": "mr" },
    { "language": "Bahasa Malaysia", "country": "MY", "code": "ms" },
    { "language": "Malti", "country": "MT", "code": "mt" },
    { "language": "မြန်မာဘာသာ", "country": "MM", "code": "my" },
    { "language": "bokmål", "country": "NO", "code": "nb" },
    { "language": "नेपाली (नेपाल)", "country": "NP", "code": "ne" },
    { "language": "Nederlands", "country": "NL", "code": "nl" },
    { "language": "Nynorsk", "country": "NO", "code": "nn" },
    { "language": "Norsk", "country": "NO", "code": "no" },
    { "language": "Occitan", "country": "FR", "code": "oc" },
    { "language": "ଓଡ଼ିଆ", "country": "IN", "code": "or" },
    { "language": "Papiamentu", "country": "AW", "code": "pap" },
    { "language": "ਪੰਜਾਬੀ / پنجابی", "country": "IN", "code": "pa" },
    { "language": "Polski", "country": "PL", "code": "pl" },
    { "language": "درى", "country": "AF", "code": "prs" },
    { "language": "پښتو", "country": "AF", "code": "ps" },

    { "language": "Português", "code": "pt", "map": "pt" },
    { "country": "PT", "code": "pt", "map": "pt" },
    { "country": "BR", "code": "pt", "map": "pt" },

    { "language": "K'iche", "country": "GT", "code": "quc" },
    { "language": "Runasimi", "country": "PE", "code": "qu" },
    { "language": "Rumantsch", "country": "CH", "code": "rm" },
    { "language": "Română", "country": "RO", "code": "ro" },
    { "language": "русский", "country": "RU", "code": "ru" },
    { "language": "Kinyarwanda", "country": "RW", "code": "rw" },
    { "language": "संस्कृत", "country": "IN", "code": "sa" },
    { "language": "саха", "country": "RU", "code": "sah" },
    { "language": "davvisámegiella", "country": "NO", "code": "se" },
    { "language": "සිංහල", "country": "LK", "code": "si" },
    { "language": "Slovenčina", "country": "SK", "code": "sk" },
    { "language": "Slovenski", "country": "SI", "code": "sl" },
    { "language": "åarjelsaemiengiele", "country": "NO", "code": "sma" },
    { "language": "julevusámegiella", "country": "NO", "code": "smj" },
    { "language": "sämikielâ", "country": "FI", "code": "smn" },
    { "language": "sääʹmǩiõll", "country": "FI", "code": "sms" },
    { "language": "Shqip", "country": "AL", "code": "sq" },
    { "language": "srpski/српски", "country": "RS", "code": "sr" },
    { "language": "Sesotho", "country": "LS", "code": "st" },
    { "language": "Svenska", "country": "SE", "code": "sv" },
    { "language": "Kiswahili", "country": "TZ", "code": "sw" },
    { "language": "ܣܘܪܝܝܐ", "country": "SY", "code": "syc" },

    { "language": "தமிழ்", "code": "ta", "map": "ta" },
    { "country": "IN", "code": "ta", "map": "ta" },
    { "country": "LK", "code": "ta", "map": "ta" },

    { "language": "తెలుగు", "country": "IN", "code": "te" },
    { "language": "Тоҷикӣ", "country": "TJ", "code": "tg" },
    { "language": "ไทย", "country": "TH", "code": "th" },
    { "language": "Türkmençe", "country": "TM", "code": "tk" },
    { "language": "Setswana", "country": "BW", "code": "tn" },
    { "language": "Türkçe", "country": "TR", "code": "tr" },
    { "language": "Татарча", "country": "RU", "code": "tt" },
    { "language": "Tamazight", "country": "MA", "code": "tzm" },
    { "language": "ئۇيغۇرچە", "country": "CN", "code": "ug" },
    { "language": "українська", "country": "UA", "code": "uk" },

    { "language": "اُردو", "code": "ur" },
    { "country": "PK", "code": "ur", "map": "ur" },
    { "country": "IN", "code": "ur", "map": "ur" },

    { "language": "Uzbek/Ўзбек", "country": "UZ", "code": "uz" },
    { "language": "Tiếng Việt", "country": "VN", "code": "vi" },
    { "language": "Wolof", "country": "SN", "code": "wo" },
    { "language": "isiXhosa", "country": "ZA", "code": "xh" },
    { "language": "Yoruba", "country": "NG", "code": "yo" },

    { "language": "中文", "code": "zh" },
    { "country": "CN", "code": "zh", "map": "zh" },
    { "country": "TW", "code": "zh", "map": "zh" },
    { "country": "HK", "code": "zh", "map": "zh" },
    { "country": "HK", "code": "yue", "map": "zh" },

    { "language": "isiZulu", "country": "ZA", "code": "zu" }
];

var langElement = !!langElement ? langElement : document.getElementById('selLang')

langElement.querySelectorAll('option').forEach(o => o.remove())

var userLanguage = getLanguage()
var hasUserLanguage = languages.filter(l => convertLanguage(l) === userLanguage)
if (hasUserLanguage.length > 0) userLanguage = hasUserLanguage[0]
else userLanguage = {}

if (userLanguage.map) {
    userLanguage = userLanguage.map
    userLanguage = languages.filter(l => l.code === userLanguage)
    if (userLanguage.length > 0) userLanguage = userLanguage[0]
    else userLanguage = false
}

if (userLanguage) addLanguage(userLanguage)

languages.forEach(l => {
    if (l === userLanguage || l.map) return
    
    addLanguage(l)
})

function convertLanguage(l) {
    return `${l.code ? `${l.code}-` : ''}${l.country}`
}

function addLanguage(l) {
    var o = document.createElement('option')

    o.textContent = `${l.language}${l.country ? ` (${l.country})` : ''}`

    o.value = convertLanguage(l)

    langElement.appendChild(o)
}

function getLanguage() {
    var keys = ['languages', 'language', 'browserLanguage', 'systemLanguage', 'userLanguage']
    var language = null;

    var isGood = false
    keys.forEach(k => {
        var l = navigator[k];
        if (l && Array.isArray(l) && !isGood) {
            l.forEach(l => {
                if (!isGood) {
                    language = l;
                    isGood = true
                    return
                }
            })
            return
        }
        else if (l  && !isGood) {
            language = l;
            isGood = true
            return
        }
    })

    return language;
};