window.onscroll = function() {

    scrollfunction();

}

var nav = document.getElementById('navbar');
var scrolSize = nav.offsetTop;

function scrollfunction() {

    if (window.scrollY >= scrolSize) {

        nav.classList.add('navJS-code');

    }
    if (window.scrollY == scrolSize) {

        nav.classList.remove('navJS-code');

    }

}




function slideup() {

    document.getElementById("sear").classList.toggle("tolg");


}

document.getElementById("rotateImage").addEventListener("click", function(event) {
    const rect = this.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const angleDegrees = angle * (180 / Math.PI);

    this.style.transform = `rotate(${angleDegrees}deg)`;
    this.classList.toggle("rotate");
});

function toggleMenu() {
    var menu = document.querySelector('.menu');
    // menu.innerHTML="☰";
    menu.classList.toggle('active');
}

document.getElementById('maths-btn').addEventListener("click",function(event){
    // window.localStorage.setItem('phyf',false);
    // window.localStorage.setItem('chef',false);
    // window.localStorage.setItem('mathf',true);
    window.localStorage.setItem('Sindex',2);
})
document.getElementById('chem-btn').addEventListener("click",function(event){
    // window.localStorage.setItem('phyf',false);
    // window.localStorage.setItem('chef',true);
    // window.localStorage.setItem('mathf',false);
    window.localStorage.setItem('Sindex',1);
})
document.getElementById('phy-btn').addEventListener("click",function(event){
    // window.localStorage.setItem('phyf',true);
    // window.localStorage.setItem('chef',false);
    // window.localStorage.setItem('mathf',false);
    window.localStorage.setItem('Sindex',0);
})

window.localStorage.setItem('Sindex', 0);

// window.localStorage.setItem('loginCheck_home',1);

// document.getElementById("loginCheck_home").addEventListener("click",loginCheck_name_home())

// async function loginCheck_name_home(){
//     if(window.localStorage.getItem('loginCheck_home') == '1'){
//         let loginCheck_home = document.getElementById("loginCheck_home");
//         let res = await axios.get("/api/user/");
//         console.log(res);
//         loginCheck_home.innerHTML = "";
//     }
// } 

// loginCheck_name_home();

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

document.getElementById('demo-video').style.height=(window.innerWidth>1000)?'300px':'auto';