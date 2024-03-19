let login_username;
let login_password;

let signin_username;
let signin_password;

const username="abc";
const password="123";

async function login_validate(event) {
    event.preventDefault();  // Prevent default form submission


    try {
        const login_username = document.querySelector("#input_username").value;
        const login_password = document.querySelector("#input_password").value;

        document.getElementsByClassName('loader-login')[0].style.display='inline';
        const res = await axios.post("/api/user/login/", {
            id: login_username,
            pswd: login_password
        });
        document.getElementsByClassName('loader-login')[0].style.display='none';


        if (res.data.isValid) {
            window.localStorage.setItem("loginData", login_username);
            window.location = "/";
        } else {
            alert('Invalid Id/Password');
        }



        return false;
    } catch (error) {
        console.error("Error in login:", error);
        return false;
    }
}

let objRes;
let ld = document.querySelector(".loader");


async function otpSend(event){
    event.preventDefault();  // Prevent default form submission

    try{
        ld.style.display = "block";
        // let signup_name= document.querySelector("#signup_name").value;
        let signup_email= document.querySelector("#signup_email").value;
        // let signup_mobile_no = document.querySelector("#signup_mobile.no").value;

        const res = await axios.post("/api/user/otp/",{email:signup_email});
        ld.style.display = "none";

        objRes = res;

        let optBtn = document.querySelector(".signup_otp_class");
        let signupBtn = document.querySelector("#signup_btn");
        let optVerify_btn = document.querySelector("#optVerify_btn");
        optBtn.style.display = "grid";
        optVerify_btn.style.display = "block";
        signupBtn.style.display ="none";
        // signupBtn.value = "Verify";
    } catch (error) {
        console.error("Error in SignUp:", error);
        return false;
    }
    
}

async function otpValidate(event){
    event.preventDefault();  // Prevent default form submission
    
    try{
        ld.style.display = "block";
        
        let optBtn = document.querySelector("#signup_otp");
        
        if(objRes.data.otp == optBtn.value){
            let signup_name= document.querySelector("#signup_name").value;
            let signup_email= document.querySelector("#signup_email").value;
            let signup_mobile_no = document.querySelector("#signup_mobile_no").value;
            
            
            const res = await axios.post("/api/user/",{userName:signup_name,email:signup_email,mobile:signup_mobile_no});
            ld.style.display = "none";
            
            alert('After successfull Fee payment you will be sent id/password through mail.');
            let signupBtn = document.querySelector("#signup_btn");
            optVerify_btn.style.display = "none";
            signupBtn.style.display ="none";

            window.location = "/";
            
        }
        else {
            alert("Invalid OTP. Please enter the correct OTP.");
        }
        
    } catch (error) {
        console.error("Error in SignUp:", error);
        return false;
    }
}


document.getElementById("optVerify_btn").addEventListener("click", otpValidate);


let pass=document.querySelector("#input_password");
let eye=document.querySelector("#eye-btn");
let hide=true;
eye.addEventListener("click",()=>{
    if(hide){
        pass.setAttribute("type","text");
        eye.setAttribute("src","/img/view.png");
        hide=false;
    }else{
        pass.setAttribute("type","password");
        eye.setAttribute("src","/img/hide.png");
        hide=true;
    }
})
