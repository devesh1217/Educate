const totalTime = 3 * 60 * 60; // 3 hours in seconds
let timeRemaining = totalTime;
let timerInterval;
let currentTest;
let currentQuestionIndex = 0;
var testStarted = false;
var testSubmitted = false;
let totalQuestions = 75;
let questionForEachSubject = 25;


window.onload = function () {
    // if (testStarted) {
    //     submitTest();
    // }
};

// function selectTest() {
//     const testNumber = document.getElementById("testNumber").value;
//     currentTest = testNumber;
//     updateNavigationButtons();
// }

async function generateMCQsWithImagesAndOptions(count, subject, testNumber, a) {
    // Add logic to fetch actual questions, images, and options from your database or source
    let data;
    await axios
        .get("/api/data/"+localStorage.getItem('testId'))
        .then((doc) => {
            data = doc.data;
        })
        .catch((err) => {
            console.log(err);
        });
    const questionsWithImagesAndOptions = [];
    for (let i = 0; i < count; i++) {
        if(data[i].webViewLink.indexOf('spreadsheets')>=0){
            localStorage.setItem('ansId',data[i].id)
            continue;
        }
        if(data[i])
            var variable = data[i].name.substring(0, data[i].name.indexOf("."));
        if (variable === "ans") {
            localStorage.setItem('ansId',data[i].id)
            continue;
        }
        //   console.log(i,data[i+1].webViewLink)
        // if (data[i].name != "ans") {
        const questionNumber = variable;
        if (+variable < questionForEachSubject + 1) {
            subject = "Physics";
        } else if (+variable < 2*questionForEachSubject +  1) {
            subject = "Chemistry";
        } else {
            subject = "Mathematics";
        }
        const question = `${subject}: Question ${variable} `;
        //   const imagePath = `path/to/image${questionNumber}.jpg`;
        // const imagePath = `desktop.png`;
        const imagePath =
            data[i].webViewLink.substring(0, data[i].webViewLink.indexOf("/view")) +
            "/preview"; // Replace with the actual path to your image
        const options = generateOptions(); // You can modify this function to generate actual options
        questionsWithImagesAndOptions.push({
            question,
            imagePath,
            options,
            variable,
        });
        // }
    }
    return questionsWithImagesAndOptions;
}

function displayQuestionsWithImagesAndOptions(
    questionsWithImagesAndOptions,
    subject,
    b
) {
    const questionsContainer = document.getElementById("testQuestions");
    // console.log(questionsWithImagesAndOptions);
    sortedData = questionsWithImagesAndOptions.sort(function (a, b) {
        return a.variable - b.variable;
    });

    // console.log(questionsWithImagesAndOptions);
    questionsWithImagesAndOptions.forEach((qna, index) => {
        const questionElement = document.createElement("div");
        questionElement.classList.add("test-question");

        questionElement.innerHTML = `
            <p> ${qna.question}</p>
            <iframe src="${qna.imagePath}"></iframe>
            <form id="optionsForm${qna.variable}" class="optionsForm">
                ${qna.options
                .map(
                    (option, i) => `
                    <label>
                        <input type="radio" name="${qna.variable
                        }" value="${option}">
                        ${String.fromCharCode(65 + i)} 
                    </label>
                `
                )
                .join("")}
            </form>
        `;
        questionsContainer.appendChild(questionElement);
    });

    document.querySelectorAll('iframe').forEach((curr,indx)=>{
        curr.onloadstart=()=>{
        }
        curr.onloadeddata=()=>{
        }
    })
}

function resetQuestion(questionIndex) {
    clearOption(questionIndex);
    markedQuestions[questionIndex - 1] = false;
    updateQuestionNumbersStyling();
}
function resetCurrentQuestion() {
    resetQuestion(currentQuestionIndex + 1);
}

// let currentSubject; // Added to store the current subject

function selectTest() {
    // const testNumber = document.getElementById("testNumber").value;
    currentTest = localStorage.getItem('testId');
    // currentSubject =
    //     document.getElementById("testNumber").options[
    //         document.getElementById("testNumber").selectedIndex
    //     ].text; // Store the current subject
    updateNavigationButtons();
}

function jumpToQuestion() {
    const questionNumberInput = document.getElementById("questionNumber");
    const targetQuestion = parseInt(questionNumberInput.value, 10);

    if (isNaN(targetQuestion) || targetQuestion < 1 || targetQuestion > totalQuestions+1) {
        alert("Please enter a valid question number between 1 and 75.");
        return;
    }

    currentQuestionIndex = targetQuestion - 1; // Adjust for 0-based index
    showQuestion(currentQuestionIndex);
    updateNavigationButtons();
    questionVisitedStatus[questionNumber - 1] = true;
    updateQuestionNumbersStyling();
}
document.getElementsByClassName("nav")[0].innerHTML = "Test: "+localStorage.getItem('testName');
async function startTest() {
    // if (!currentTest) {
    //     alert("Please select a test number first.");
    //     return;
    // }
    testStarted = true;
    sessionStorage.setItem('testStarted', 'true');

    
    document.getElementById("timer").style.display = "block";
    document.getElementById("testQuestions").style.display = "block";
    document.getElementById("testNavigation").style.display = "flex";
    document.getElementById("testSelection").style.display = "none";
    document.getElementById("startTestBtn").style.display = "none";
    document.getElementsByClassName("result-box")[0].style.display = "none";
    

    // Check if the subject has changed, if yes, reset currentQuestionIndex
    // const newSubject =
    //     document.getElementById("testNumber").options[
    //         document.getElementById("testNumber").selectedIndex
    //     ].text;
    // if (currentSubject !== newSubject) {
    //     currentSubject = newSubject;
    // }
    currentQuestionIndex = 0;

    var allQuestionsWithImagesAndOptions = await generateMCQsWithImagesAndOptions(
        totalQuestions+1,
        "none",
        currentTest,
        0
    );
    displayQuestionsWithImagesAndOptions(
        allQuestionsWithImagesAndOptions,
        "none",
        0
    );

    // Show the question numbers column and buttons
    const questionNumbersColumn = document.getElementById(
        "questionNumbersColumn"
    );
    questionNumbersColumn.style.display = (window.innerWidth<1000)?'none':'block';

    // Dynamically generate question numbers based on the number of questions
    const questionNumbersList = document.getElementById("questionNumbersList");
    questionNumbersList.innerHTML = ""; // Clear existing content

    // const totalQuestions = 75;
    const questionsPerRow = 5;
    let currentRow = null;

    for (let i = 1; i <= totalQuestions; i++) {
        if (i % questionsPerRow === 1) {
            currentRow = document.createElement("div");
            currentRow.classList.add("row"); // Add 'row' class to each row
            questionNumbersList.appendChild(currentRow);
        }

        const numberItem = document.createElement("div");
        numberItem.classList.add("number");
        numberItem.textContent = i;
        numberItem.id = i;
        numberItem.onclick = () => jumpToQuestion(i);
        currentRow.appendChild(numberItem);
    }

    showQuestion(currentQuestionIndex);
    updateNavigationButtons();
    startTimer();

    const allRadioBtn = document.querySelectorAll('input[type="radio"]');
    allRadioBtn.forEach((radioBtn) => {
        radioBtn.addEventListener("input", (e) => {
            markedQuestions[+radioBtn.name - 1] = true;
        });
    });
    document.getElementById("1").style.backgroundColor = "#e74c3c";
    document.getElementById("testNavigation").style.display = "flex";
    document.getElementById("test-togle").style.display = (window.innerWidth<=1000)?'block':'none';
}

function updateTimer() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    document.getElementById("timer").innerText = `Time Remaining: ${formatTime(
        hours
    )}:${formatTime(minutes)}:${formatTime(seconds)}`;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").innerText = "Time Expired";
        submitTest();
    } else {
        timeRemaining--;
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function generateMCQsWithOptions(count, subject) {
    // Add logic to fetch actual questions and options from your database or source
    const questionsWithOptions = [];
    for (let i = 1; i <= count; i++) {
        const question = `Question ${i} (${subject})`;
        const options = generateOptions(); // You can modify this function to generate actual options
        questionsWithOptions.push({ question, options });
    }
    return questionsWithOptions;
}

function generateOptions() {
    // Modify this function to generate actual options for each question
    return ["a", "b", "c", "d"];
}

function clearOption(questionIndex) {
    const form = document.getElementById(`optionsForm${questionIndex}`);
    const radioButtons = form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radioButton) => {
        radioButton.checked = false;
    });
}

function showQuestion(index) {
    const questions = document.querySelectorAll(".test-question");
    questions.forEach((question, i) => {
        if (i === index) {
            question.style.display = "block";
        } else {
            question.style.display = "none";
        }
    });
}

function nextQuestion() {
    if (currentQuestionIndex < totalQuestions-1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
        updateNavigationButtons();
        questionVisitedStatus[currentQuestionIndex] = true;
        updateQuestionNumbersStyling();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
        updateNavigationButtons();
        questionVisitedStatus[currentQuestionIndex] = true;
        updateQuestionNumbersStyling();
    }
}

function updateNavigationButtons() {
    const prevButton = document.querySelector(
        "#testNavigation button:first-child"
    );
    const nextButton = document.querySelector(
        "#testNavigation button:last-child"
    );

    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === totalQuestions-1;
}

function submitTest() {
    sessionStorage.removeItem('testStarted');
    clearInterval(timerInterval);
    document.getElementById("questionNumbersColumn").style.display = "none";
    timeRemaining = totalTime; // Reset the timer
    // document.getElementById("timer").innerText = "Time Remaining: 3:00:00";
    document.getElementById("timer").style.display = "none";
    document.getElementById("testQuestions").style.display = "none";
    document.getElementById("testNavigation").style.display = "none";
    document.getElementById("testResults").style.display = "block";
    document.getElementById("result").style.display = "flex";
    document.getElementsByClassName("result-box")[0].style.display = "flex";
    document.getElementsByClassName("nav")[0].style.display = "none";
    // Add code for calculating and displaying test results
    storeAnswer();
}

//   document.getElementById("testResults").style.display = "none";
//   document.getElementById("testSelection").style.display = "block";
//   document.getElementById("startTestBtn").style.display = "block";

const questionVisitedStatus = Array(totalQuestions).fill(false);
const markedQuestions = Array(totalQuestions).fill(false);

function jumpToQuestion(questionNumber) {
    const targetQuestion = parseInt(questionNumber, 10);

    if (isNaN(targetQuestion) || targetQuestion < 1 || targetQuestion > totalQuestions+1) {
        alert("Please enter a valid question number between 1 and 6.");
        return;
    }
    questionVisitedStatus[questionNumber - 1] = true;
    updateQuestionNumbersStyling();

    currentQuestionIndex = targetQuestion - 1; // Adjust for 0-based index
    showQuestion(currentQuestionIndex);
    updateNavigationButtons();
}

// var physicsMarks,chemistryMarks,mathsMarks,accuracyMarks;
let courses = [
    { course: "Physics", percent: 0, color: "blue" },
    { course: "Chemistry", percent: 0, color: "green" },
    { course: "Maths", percent: 0, color: "red" },
    //   { course: "Total", percent: 85, color: "#badc58" },
];


async function storeAnswer(questionIndex, answer) {
    document.getElementById('test-togle').style.display='none';
    let answers = Array(totalQuestions).fill(""); // Array to store answers
    for (i = 0; i < totalQuestions; i++) {
        const options = document.getElementsByName(i + 1);
        for (j = 0; j < 4; j++) {
            if (options[j].checked) {
                answers[i] = options[j].value;
            }
        }
    }
    await axios
        .post(
            "/api/data/testAns/"+window.localStorage.getItem('ansId'),
            {
                id: localStorage.getItem('loginData'),
                testId: localStorage.getItem('testId'),
                testName: localStorage.getItem('testName'),
                ans: answers,
            }
        )
        .then((doc) => {
            const result = document.getElementById("result");
            const correct = document.createElement("div");
            correct.className = 'res-row';
            correct.innerHTML = "<span class='res-row-data'>Total Correct Answers: </span><span class='res-row-data'>" + doc.data.correct.length + "</span>";
            const inCorrect = document.createElement("div");
            inCorrect.className = 'res-row';
            inCorrect.innerHTML = "<span class='res-row-data'>Total Incorrect Answers:</span><span class='res-row-data'>" + doc.data.inCorrect.length + "</span>";
            const not = document.createElement("div");
            not.className = 'res-row';
            not.innerHTML = "<span class='res-row-data'>Not Answer:</span><span class='res-row-data'>" + doc.data.notMarked.length + "</span>";
            const detail = document.createElement("div");
            detail.className = 'res-row';
            detail.innerHTML = "<span class='res-row-data' id='res-detail'>Detailed result will be sent through mail.";

            result.appendChild(correct);
            result.appendChild(inCorrect);
            result.appendChild(not);
            result.appendChild(detail);

            courses[0].percent = (doc.data.phy);
            courses[1].percent = (doc.data.chem);
            courses[2].percent = (doc.data.maths);
            let total = doc.data.phy + doc.data.chem + doc.data.maths;
            document.getElementById('total-marks').innerHTML = "Total Marks: <span style='color:" + ((total > 0) ? 'green' : 'red') + ";'>" + total + "/300</span>";
            document.getElementById('result-parent').style.display='block';
        })
        .catch(function (error) {
            console.error(error);
            // Handle errors
        });

    updateQuestionNumbersStyling();
    printGraph();

    // answers[questionIndex] = answer.trim().toLowerCase(); // Store the answer in lowercase, trim to remove leading/trailing spaces
}

function updateQuestionNumbersStyling() {
    const questionNumbers = document.querySelectorAll(".number");
    // document.getElementById('1').style.backgroundColor = "#e74c3c"
    questionNumbers.forEach((number, index) => {
        if (markedQuestions[index]) {
            number.style.backgroundColor = "green"; // Red
        } else if (questionVisitedStatus[index]) {
            // Question has been visited
            number.style.backgroundColor = "#e74c3c"; // Red
        } else {
            // Question not visited
            // number.style.backgroundColor = "#9fa19f"; // Default color
        }
    });

}

function getAnswer(questionIndex) {
    return answers[questionIndex];
}

// #5271ff

// courses.forEach((course) => {
//   container.innerHTML += `
//   <div class="progess-group">
//   <div class="circular-progress" >
//     <span class="course-value" style="color:${course.color}">0%</span>
//   </div>
//   <label class="text" style="color:${course.color} ; font-size:1.5rem">${course.course}</label>
// </div>
//   `;
// });

//style="  background: conic-gradient(${course.color} ${3.6 * course.percent}deg, #fff 0deg);"

function printGraph() {
    const container = document.querySelector(".result-box");

    courses.forEach((course) => {
        container.innerHTML += `
        <div class="progess-group">
        <div class="circular-progress" >
          <span class="course-value" style="color:${course.color}">0%</span>
        </div>
        <label class="text" style="color:${course.color} ; font-size:1.5rem">${course.course}</label>
        </div>
        `;
    });

    const progressGroups = document.querySelectorAll(".progess-group");

    progressGroups.forEach((progress, index) => {
        let progressStartValue = 0;
        let progressStartEnd = (courses[index].percent <= 0) ? 1 : courses[index].percent;
        let speed = 50;
        let progessTimer = setInterval(() => {
            progressStartValue++;
            if (progressStartValue == progressStartEnd) {
                clearInterval(progessTimer);
            }
            progress.querySelector(".circular-progress").style.background = `
    conic-gradient(${courses[index].color} ${3.6 * progressStartValue
                }deg, #fff 0deg)`;

            if (courses[index].course == "Accuracy") {
                progress.querySelector(".course-value").innerHTML =
                    courses[index].percent + "%";
            } else {
                progress.querySelector(".course-value").innerHTML =
                    courses[index].percent + "/100";
            }
        }, speed);
    });
}


function returnToMain() {
    window.location='/classes';
}

// var isSubmit = 'false';
window.addEventListener('beforeunload', function (event) {
    event.preventDefault()   
});


document.getElementById("test-togle").addEventListener('click',()=>{
    document.getElementById("questionNumbersColumn").style.display=(document.getElementById("questionNumbersColumn").style.display=='none')?'block':'none';   
})

