const allStar = document.querySelectorAll('.rating .star')
const ratingValue = document.querySelector('.rating input')

allStar.forEach((item, idx) => {
    item.addEventListener('click', function () {
        let click = 0
        ratingValue.value = idx + 1

        allStar.forEach(i => {
            i.classList.replace('bxs-star', 'bx-star')
            i.classList.remove('active')
        })
        for (let i = 0; i < allStar.length; i++) {
            if (i <= idx) {
                allStar[i].classList.replace('bx-star', 'bxs-star')
                allStar[i].classList.add('active')
            } else {
                allStar[i].style.setProperty('--i', click)
                click++
            }
        }
    })
})

let rating = 5;

document.querySelectorAll('.bx-star').forEach((curr) => {
    curr.addEventListener('click', () => {
        rating = curr.id;
    })
})


async function print() {
    document.getElementsByClassName('loader')[0].style.display='inline';
    const doc = await axios.get('/api/review/get');
    document.getElementsByClassName('loader')[0].style.display='none';
    doc.data.forEach((curr) => {
        const reviewsContainer = document.querySelector(".reviews-container");
        const newReview = document.createElement("div");
        newReview.classList.add("review");

        const nameElement = document.createElement("p");
        nameElement.classList.add("name");
        nameElement.textContent = curr.userName;

        const ratingElement = document.createElement("p");
        ratingElement.classList.add("rating");
        ratingElement.textContent = '★'.repeat(curr.rating);

        const commentElement = document.createElement("p");
        commentElement.classList.add("comment");
        commentElement.textContent = curr.description;

        newReview.appendChild(nameElement);
        newReview.appendChild(ratingElement);
        newReview.appendChild(commentElement);

        reviewsContainer.appendChild(newReview);

        // Clear form inputs after submitting
        document.getElementById("user-name").value = "";
        document.getElementById("user-comment").value = "";
        document.getElementById("user-rating").value = "1";
    })
}
print()
document.getElementById("submit").addEventListener("click", async function (event) {
    const userName = document.getElementById("user-name").value;
    const userComment = document.getElementById("user-comment").value;
    const email = document.getElementById("email").value;
    document.getElementsByClassName('loader')[1].style.display='inline';
    await axios.post('/api/review/', {
        userName,
        description: userComment,
        email,
        rating,
    }).then(() => {
        document.getElementsByClassName('loader')[1].style.display='inline';
        alert('Message Sent!');
        location.reload();
    }).catch((err) => {
        console.log(err)
    })

});




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