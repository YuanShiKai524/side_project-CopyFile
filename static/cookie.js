let srcpath = document.querySelector('#src_path');
let despath = document.querySelector('#des_path');

function setCookie (cname, cvalue, days) {
    let d = new Date();
    let now = d.getTime();
    let expires = d.setTime(now + days * (24*60*60*1000)).toString();
    // 透過加密，可將有中文字或無法辨讀的文字轉成編譯後可讀的字
    let encoded = encodeURIComponent(cvalue);
    document.cookie = `${cname} = ${encoded}; expires = ${expires}; path=/`;
}

function getCookie (cname) {
    let name = cname + "=";
    let decodedCookies = decodeURIComponent(document.cookie);
    let ca = decodedCookies.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        // 消除前頭的空白鍵
        while(c.charAt(0) === " ") {
            c = c.substring(1);
        }
        // 開始比對是否有與cname相同的cookie，若有，則利用substring取得cookie的值
        if (c.indexOf(name) === 0) {
            let cval = c.substring(name.length, c.length);
            return cval;
        }
    }
    return ""; //若return後面什麼都沒寫，則會返回undefined，所以才要寫一個空的字符串在後面
}

function checkCookie () {
    let cval1 = getCookie("src_dir");
    let cval2 = getCookie("des_dir");
    if (cval1 === "" || cval1 === "null" && cval2 === "" || cval2 === "null") {     // 兩者皆空
        let src_dir = prompt("請輸入圖庫資料夾路徑");
        let des_dir = prompt("請輸入儲存資料夾路徑");
        setCookie("src_dir", src_dir, 365);
        setCookie("des_dir", des_dir, 365);
        srcpath.innerHTML = getCookie("src_dir");
        despath.innerHTML = getCookie("des_dir");
    } else if (cval1 === "" || cval1 === "null" && cval2 !== "" && cval2 !== "null") {  // src空，des不空
        let src_dir = prompt("請輸入圖庫資料夾路徑");
        setCookie("src_dir", src_dir, 365);
        srcpath.innerHTML = getCookie("src_dir");
    } else if (cval1 !== "" && cval1 !== "null" && cval2 === "" || cval2 === "null") {  // src不空，des空
        let des_dir = prompt("請輸入儲存資料夾路徑");
        setCookie("des_dir", des_dir, 365);
        despath.innerHTML = getCookie("des_dir");
    } else {                                                                 // src、des皆有值
        console.log("src_dir: " + cval1 + ", " + "des_dir: " + cval2);
        srcpath.innerHTML = getCookie("src_dir");
        despath.innerHTML = getCookie("des_dir");
    }
}

function changeCookie(btn) {
    let d = new Date();
    d.setTime(0);
    if(btn.getAttribute('id') === "srcbtn") {
        document.cookie = `src_dir=; expires=${d}; path=/`;
        let newPath = prompt("請輸入新的路徑");
        while(newPath === "") {
            alert("請勿輸入空白值，並重新輸入路徑");
            newPath = prompt("請輸入新的路徑");
        }
        if (newPath !== null) {
            setCookie("src_dir", newPath, 365);
            srcpath.innerHTML = getCookie("src_dir");
        }
    } else if (btn.getAttribute('id') === "desbtn") {
        document.cookie = `des_dir=; expires=${d}; path=/`;
        let newPath = prompt("請輸入新的路徑");
        while(newPath === "") {
            alert("請勿輸入空白值，並重新輸入路徑");
            newPath = prompt("請輸入新的路徑");
        }
        if (newPath !== null) {
            setCookie("des_dir", newPath, 365);
            despath.innerHTML = getCookie("des_dir");
        }
    }
}


let body = document.querySelector("body");
body.onload = checkCookie();

let srcbtn = document.getElementById("srcbtn");
srcbtn.addEventListener("click", () => {
    changeCookie(srcbtn);
})

let desbtn = document.querySelector("#desbtn");
desbtn.addEventListener("click", () => {
    changeCookie(desbtn);
})