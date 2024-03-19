
let  pndClass = document.getElementById("pnd-class"); 
let  alwdClass = document.getElementById("alwd-class"); 

async function getpnd() {
    let res = await axios.get("/api/user/admin/pending");
    if(res.data.length==0){
        let tb = document.createElement("div");
        tb.style.textAlign='center';
        tb.innerHTML='No Student Pending!'
        pndClass.appendChild(tb);
        return;
    }
    for (let i = 1; i <= res.data.length; i++) {
        if(res.data[i-1].userId=='admin'){
            continue;
        }
        let tb = document.createElement("div");
        tb.setAttribute("class", "std-block");

        tb.innerHTML = `<div class="std-name">${res.data[i - 1].userName}<br><div class="std-mail"><i>${res.data[i - 1].email}</i></div></div>
    <div class="test-start-btn"><button id="${res.data[i - 1].userId}" class="alwd-btn">Allowed</button></div>`;
    pndClass.appendChild(tb);
    }
    document.querySelectorAll('.alwd-btn').forEach((curr)=>{
        curr.addEventListener('click',async ()=>{
            let res = await axios.get("/api/user/admin/payment/"+curr.id);
            location.reload();
        })
    })
    
}

async function getalwd() {

    let res = await axios.get("/api/user/admin/enrolled");

    if(res.data.length==0){
        let tb = document.createElement("div");
        tb.setAttribute("class", "std-block");
        tb.style.fontStyle='italic';
        toggleMenu.innerHTML='No Student Enrolled!'
        pndClass.appendChild(tb);
        return;
    }

    for (let i = 1; i <= res.data.length; i++) {
        let tb = document.createElement("div");
        tb.setAttribute("class", "std-block");

        tb.innerHTML = `<div class="std-name">${res.data[i - 1].userName}<br><div class="std-mail"><i>${res.data[i - 1].email}</i></div></div>
    <a href="/test.html?id=${res.data[i - 1].id}"><div id="${res.data[i - 1].id}" class="alwd-btn"></div></a></div>`;
    alwdClass.appendChild(tb);
    }
    
}
getpnd();
getalwd();



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

function toggleMenu() {
    var menu = document.querySelector('.menu');
    // menu.innerHTML="☰";
    menu.classList.toggle('active');
}   