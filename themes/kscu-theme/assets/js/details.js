
function generateHash(date) {
    // Define the array of characters
    const asciiArt = [
        "╰(°▽°)╯",
        "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
        "(づ｡◕‿‿◕｡)づ",
        "(ﾉ^^)ﾉ",
        "(づ￣ ³￣)づ",
        "¯\(ツ)_/¯",
        "ʕ•ᴥ•ʔ",
        "ლ(╹◡╹ლ)",
        "(ง'̀-'́)ง",
        "(^▽^)",
        "(＾◡＾)ノ",
        "(｡◕‿‿◕｡)",
        "(✿◠‿◠)",
        "(•̀ᴗ•́)و ̑̑",
        "♪┏(・o･)┛♪",
        "┌(・。・)┘♪",
        "ヽ(・∀・)ﾉ",
        "（＾ｖ＾）",
        "（＾∀＾）",
        "(o˘◡˘o)",
        "(⌒▽⌒)☆",
        "(ﾉ´ヮ)ﾉ*:･ﾟ✧", 
        "◕‿◕", "(｡•̀ᴗ-)✧", 
        "（っ＾▿＾）", 
        "ヾ(＾∇＾)", 
        "(*^_^*)", 
        "(^◡^ )", 
        "(´• ω •)",
        "(ง°ل͜°)ง",
        "ღゝ◡╹)ノ♡",
        "٩(●ᴗ●)۶",
        "(╯°□°）╯︵ ┻━┻",
        "(°▽°)",
        "╰(°▽°)╯",
        "(づ｡◕‿‿◕｡)づ",
        "ヾ(⌐■_■)ノ♪",
        "(✿╹◡╹)",
        "┌(・。・)┘♪",
        "ヾ(≧∇≦)",
        "ヽ(´ー｀)ﾉ",
        "(ﾟ∀ﾟ)",
        "☜(⌒▽⌒)☞",
        "(つ・▽・)つ",
        "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
        "(◕‿◕✿)",
        "(｡･ω･｡)",
        "(˘▾˘)",
        "(✿◠‿◠)",
        "ʕ•́ᴥ•̀ʔっ",
        "(づ￣ ³￣)づ",
        "ヾ(´￢｀)ﾉ",
        "ヾ(＾∇＾)",
        "٩(◕‿◕｡)۶",
        "ヾ(＠^∇^＠)ノ",
        "(´｡• ᵕ •｡`) ♡",
        "(^人^)",
        "(ง'̀-'́)ง"
    ];

    const asciiChar = ["♨", "◑", "↕", "★", "♦", "♠", "♣", "❤", "♩", "の", "♫", "☺", "♪", "✿", "❀", "✦", "✩", "✭", "☽", "♨", "☉", "♪", "§", "✈", "☂", "✈", "✌", "❥", "✄", "☯", "❦", "➳", "♫"]

    const asciiMusic = ["♫ ♬", "♪♩", "♪♩♭", "☎✰", "☏♪♩", "✰", "☻♬♪", "♬♪", "♩♭", "♪", "♠♣❤"];
    // console.log(asciiMusic.length)

    // // Get the day of the year as the seed
    const seed = getDayOfYear(date);

    // // Generate a hash value by multiplying the seed by a large prime number
    let hash = seed * 37;

    // Map the hash value to two characters from the character array using base conversion
    let result = [];
    

    if (seed % 2 === 0) {
        result.push(asciiChar[Math.floor(hash % 33)])
        result.push(asciiArt[Math.floor(hash % 58)])
        result.push(asciiMusic[Math.floor(hash % 11)])
    } else {
        result.push(asciiArt[Math.floor(hash % 58)])
        result.push(asciiChar[Math.floor(hash % 33)] + asciiChar[Math.floor(hash % 31)])
        result.push(asciiMusic[Math.floor(hash % 11)])
    }

    return result
}

function getDayOfYear(date) {
    // Calculate the number of days between January 1 and the given date
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    return dayOfYear;
}

asciiResult = generateHash(new Date());
document.querySelector("#left-ascii").innerHTML = asciiResult[0];
document.querySelector("#right-ascii").innerHTML = asciiResult[1];
// document.querySelector("#spins-ascii").innerHTML = asciiResult[2];
