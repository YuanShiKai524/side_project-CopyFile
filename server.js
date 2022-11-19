const express = require('express');
const app = express();
const path = require('path');
const childProcess = require('child_process');

const bodyParser = require('body-parser');

const fs = require('fs');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const port = 3000 || 8080 || 5050; //暫時先這樣寫

app.listen(port, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server is running at http://localhost:${port}`);
        childProcess.exec(`start chrome http://localhost:${port}`);
    }
})


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/index.html"), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

// 解析post請求中的requestBody
app.use(bodyParser.urlencoded({ extended: true }));
// 接收post請求(用戶傳入檔案名稱(貨號))，並處理數據
app.post("/data", (req, res) => {
    const val = req.body.input;
    let str = val.trim();
    if (str == null || str == "") {
        res.send("<script>alert('輸入欄不可為空或只有空白鍵，請重新輸入'); location.href='/';</script>");
    } else {
        // 把用戶傳入的檔案名稱做一些簡單處理(去除空值、去除前後空格等)
        let raw = str.split(" ");
        let inputArr = raw.filter(check);
        if (inputArr.length !== 0) {
            try {
                // 從cookie中取得當初用戶傳入的兩個路徑
                let src_dir = req.cookies.src_dir;
                let des_dir = req.cookies.des_dir;
                // 調用getFilePaths函數，獲得來源資料夾下所有檔案的路徑之數組
                const filePathsArr = getFilePaths(src_dir);
                let pic = copyFile(inputArr, filePathsArr, des_dir);
                if (pic === 0) {
                    res.send(`<script>alert('不存在相對應的圖片，或資料夾內已存在檔案，也請確認資料夾路徑是否正確！'); location.href='/';</script>`)
                } else {
                    res.send(`<script>alert('** 一共下載了 ${pic} 張圖片，請前往資料夾查看確認！**'); location.href='/';</script>`);
                }
            } catch (err) {
                console.error(err);
                res.send("<script>document.write('<h2>圖庫資料夾或儲存資料夾之路徑有誤，或發生其他錯誤，</br>請回至上一頁，並查看黑色視窗中的錯誤訊息以查明原因，</br>若有疑問請聯絡工程師。</h2>')</script>");
            }
        } else {
            res.send("<script>alert('輸入欄不可為空或只有空白鍵，請重新輸入'); location.href='/';</script>");
        }
    }
})

// 讀取所有來源資料夾下的檔案，並匹配以獲得用戶想要的檔案路徑
function getFilePaths(dirPath) {
    let filePathsArr = [];
    // 尋找來源目錄之下所有目標檔案的路徑的函數
    function findFilePaths(dirpath) {
      // 獲得目錄下所有檔案
      const files = fs.readdirSync(dirpath);
      // 處理獲得的數據
      try {
        files.forEach((file) => {
          const filePath = path.join(dirpath, file);
          const statsObj = fs.statSync(filePath);
          if (statsObj.isDirectory() === true) {
            findFilePaths(filePath);
          }
          if (statsObj.isFile() === true) {
            filePathsArr.push(filePath);
          }
        })
      } catch (err) {
        console.log(err);
      }
    }
    // 調用findFilePaths函數
    findFilePaths(dirPath);
    return filePathsArr;
}

// 把空值篩選掉的函數
function check(val) {
    if (val !== " ") {
        return val;
    }
}

// 匹配用戶輸入的檔名與每個路徑下的檔案，並複製檔案從來源資料夾至目的地資料夾
function copyFile(inputArr, filePaths, des_dir) {
    let num = 0;
    for (let i = 0; i < inputArr.length; i++) {
        for (let j = 0; j < filePaths.length; j++) {
            const filePath = String(filePaths[j]);
            const val = String(inputArr[i]);
            const fileName = path.basename(filePath);
            if (fileName.indexOf(val) !== -1) {
                try {
                    const target_url = path.join(des_dir, fileName);
                    fs.copyFileSync(filePath, target_url, fs.constants.COPYFILE_EXCL);
                    num++;
                    console.log(`${fileName} was copied to destination directory.`);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
    return num;
}

// 使用static資料夾中的所有靜態文件
app.use(express.static("static"));
