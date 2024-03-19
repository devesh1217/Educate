let test_info = document.querySelector(".test-info");



async function getTestData(){
    let res = await axios.get('/api/data/get/result/'+window.localStorage.getItem('loginData'))
    document.getElementById('userName').innerHTML=res.data.userName;
    document.getElementById('email').innerHTML=res.data.email;
    document.getElementById('mobile').innerHTML=res.data.mobile;
    document.getElementById('userId').innerHTML=res.data.userId;
    for(let i = 0 ;i<res.data.testData.length;i++){
        let card = document.createElement("div");
        card.classList.add("card");
        
        card.innerHTML = `<div class="test-sec">
        <div class="test-name">${res.data.testData[i].name}</div>
        <div class="sub-wise">
            <div class="sub phy">Physics : ${res.data.testData[i].phy}</div>
            <div class="sub che">Chemitry : ${res.data.testData[i].chem}</div>
            <div class="sub math">Maths : ${res.data.testData[i].maths}</div>
        </div>
        <div class="total">Total <br> ${res.data.testData[i].correct.length*4-res.data.testData[i].inCorrect.length}/300</div>

    </div>
    <div class="card-info">
        <h4>Analysis</h4>
        <div class="extra">
            <div class="total-r extraName"> Correct : ${res.data.testData[i].correct.length}</div>
            <div class="total-in extraName">Incorrect : ${res.data.testData[i].inCorrect.length}</div>
            <div class="total-nAttempt extraName">NA : ${res.data.testData[i].notMarked.length}</div>
            <div class="acu" > Accuracy : ${res.data.testData[i].acc} </div>
        </div>
    </div>`;
    test_info.append(card);
    }
}
getTestData();

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