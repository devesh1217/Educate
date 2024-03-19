function toggleMenu() {
    var menu = document.querySelector('.menu');
    // menu.innerHTML="☰";
    menu.classList.toggle('active');
}

let phyf = false;
let chef = false;
let mathf = false;



function mkChapterRow(chNum) {
    let chRow = document.createElement("div");
    chRow.setAttribute("class", "ch-name");
    chRow.setAttribute("id", `ch-${chNum}-name`);
    chRow.innerText = `Chapter ${chNum}`;

    return chRow;

}

let allChapters = document.querySelector(".chapter-list");
// allChapters.innerHTML="hi"


function mkTopicRow(topicNum, topicName, topicVedioLink, topicPdfLink) {
    let topic_row = document.createElement("div");
    topic_row.setAttribute("class", "topic-row");

    topic_row.innerHTML = `<div class="topic-number">${topicNum}</div>
    <div class="topic-name">${topicName}</div>
    <div class="vedio-link"><a target="blank" href="${topicVedioLink}"><img src="bx-play-circle.svg"></a></div>
    <div class="pdf-link"><a target="blank" href="${topicPdfLink}"><img src="bxs-file-pdf.svg"></a></div>`;

    return topic_row;

}

// let chapterId = []

async function printChapters(subject) {
    let ld = document.querySelector(".loader");
    let res = await axios.get("/api/data/" + subject);
    ld.classList.add("none");

    // console.log(res);



    for (let i = 0; i < res.data.length; i++) {
        // let temp = mkChapterRow(i);
        let aChapter = document.createElement("div");
        aChapter.setAttribute("class", "a-chapter");
        // aChapter.append(temp);
        aChapter.innerHTML = `<div id="ch-${i}-name" class="ch-name">${i + 1}.${res.data[i].name}</div>
        <div id="ch-${i}-topics" class="ch-topics none"><div>`;
        allChapters.append(aChapter);
        // let topicOfThisChapter=document.createElement("div");
        // topicOfThisChapter.setAttribute("class","")
        let chapterId = res.data[i].webViewLink.split("/")[5];
        // console.log(chapterId)


        let topicRows = document.querySelector(`#ch-${i}-topics`);


        let chRes = await axios.get("/api/data/get/" + chapterId);

        let keys = Object.keys(chRes.data);
        // console.log(chRes.data);
        // console.log(keys);
        if (keys.length == 0) {
            topicRows.innerHTML = "not found";
        } else {
            for (let topicNum = 0; topicNum < keys.length; topicNum++) {


                let row = mkTopicRow(topicNum + 1, `${chRes.data[keys[topicNum]].name}`, `${chRes.data[keys[topicNum]].video}`, `${chRes.data[keys[topicNum]].pdf}`);
                topicRows.append(row);
            }
        }

        let chBtn = document.querySelector(`#ch-${i}-name`);
        chBtn.addEventListener("click", () => {
            // console.log(`ch = ${i}`);
            let ch_n_topics = document.querySelector(`#ch-${i}-topics`);
            ch_n_topics.classList.toggle("none");

        })

    }
}



let phy = document.querySelector("#phy");
let che = document.querySelector("#che");
let math = document.querySelector("#math");


phy.checked = false;
che.checked = false;
math.checked = false;


function selectSub(sub) {

    if (sub == 0) {
        if (!phyf) {
            allChapters.innerHTML = `<div class="loader"></div> `;
            printChapters("1_OQT8sEWDdTPC7AuM6Ko6a2AIvufTDyA");
            phyf = true;
            chef = false;
            mathf = false;
            phy.checked = true;
        }
        // console.log("phy");
    } else if (sub == 1) {
        if (!chef) {
            allChapters.innerHTML = `<div class="loader"></div> `;
            // console.log("che");

            printChapters("1oPCRsoSB_I_dRizZ67ZKNl9O4Kc6kT61");
            chef = true;
            phyf = false;
            mathf = false;
            che.checked = true;
        }

    } else if (sub == 2) {
        // console.log("maths");
        if (!mathf) {
            allChapters.innerHTML = `<div class="loader"></div> `;
            printChapters("1LjywiNk-85i6NWkaOgN399hDh6WUzAEp");
            mathf = true;
            phyf = false;
            chef = false;
            math.checked = true;
        }
    }
}

let Sindex = window.localStorage.getItem('Sindex');

selectSub(Sindex);

window.onbeforeunload= function(){
    window.localStorage.setItem('Sindex', 0);
}

// if(phyf){
//     selectSub(0);
// }
// else if(chef){
//     selectSub(1);
// }
// else if(mathf){
//     selectSub(2);
// }
// else{
//     selectSub(0);
// }


let phyBtn = document.querySelector("#phy-lab");
let cheBtn = document.querySelector("#che-lab");
let mathBtn = document.querySelector("#math-lab");

let subBtn = [phyBtn, cheBtn, mathBtn];

for (let i = 0; i < 3; i++) {
    subBtn[i].addEventListener("click", () => {
        selectSub(i);

    })
}

let homeBtn = document.querySelector("#home");
let testsBtn = document.querySelector("#tests");

let homeClass = document.querySelector("#home-class");
let testClass = document.querySelector("#test-class");


homeBtn.addEventListener("click", () => {
    homeClass.classList.remove("none");
    testClass.classList.add("none");
})

testsBtn.addEventListener("click", () => {
    homeClass.classList.add("none");
    testClass.classList.remove("none");
})



async function getTest() {

    let res = await axios.post("/api/data/get/test/12-3S1GgXwRi9lzGAKUzGPT309Nroby8g",{id:localStorage.getItem('loginData')});

    for (let i = 1; i <= res.data.length; i++) {
        let tb = document.createElement("div");
        tb.setAttribute("class", "test-block");
        tb.innerHTML = `<div class="test-name">${res.data[i - 1].name}</div>
    <div class="test-start-btn"><button  id="${res.data[i - 1].id}" value="${res.data[i - 1].name}" class="t-btn">Start</button></div>`;
        testClass.appendChild(tb);
    }

    document.querySelectorAll('.t-btn').forEach((curr)=>{
        curr.addEventListener('click',()=>{
            // let name;
            // // console.log(res.data,curr)
            // for (i of res.data){
            //     console.log(i.id,curr.id)
            //     if(i.id==curr.id){
            //         console.log('adfa')
            //         name=i.name;
            //         break;
            //     }
            // }
            localStorage.setItem('testId',curr.id);
            localStorage.setItem('testName',curr.value);
            window.location='/test/';
        })
    })

}
getTest();




if(window.localStorage.getItem('loginData')){
    document.getElementById('logOut_home').style.display = "flex";
    document.getElementById('logIn_home').style.display = "none";
}
else{
    document.getElementById('logIn_home').style.display = "flex";
    document.getElementById('logOut_home').style.display = "none";
}

document.getElementById("logOut_home").addEventListener("click",async function(event){
    localStorage.removeItem("loginData");
    window.location.reload();
})

if(localStorage.getItem('loginData')=='admin'){
    document.getElementById('admin').style.display='inline';
}else {
    document.getElementById('admin').style.display='none';
}
if(localStorage.getItem('loginData')){
    document.getElementById('profile').style.display='inline';
}else {
    document.getElementById('profile').style.display='none';
}