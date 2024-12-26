async function getquestion() {
    let a = await fetch(`question_bank/ques.json`);
    let response = await a.json();

    return response;
}
async function randomQuestionArray(numberOfQuestion) {


    // console.log(numberOfQuestion)
    let uniqueSet = new Set();
    while (uniqueSet.size < numberOfQuestion) {
        let randomNum = Math.floor(Math.random() * 50)
        uniqueSet.add(randomNum)
    }
    console.log(uniqueSet)
    return Array.from(uniqueSet);


}
async function addProgressBar() {
    const progressHTML =`
        <div class="progress-container" >
            <div class="progress-bar">
                <span class="progress-text">0%</span>
            </div>
        </div>
    `

    const displayQues = document.querySelector(".container");
    displayQues.insertAdjacentHTML('afterbegin', progressHTML);
}
function updateProgress(numberOfQuestion, selectedQuestionArray) {
    console.log("updat")
    const totalQuestions = numberOfQuestion; // Using the existing numberOfQuestion variable
    let answeredQuestions = 0;
console.log(numberOfQuestion)
console.log(selectedQuestionArray)
    // Count answered questions
    // for (let i = 0; i < totalQuestions; i++) {
    //     console.log("lo")
    //     const selector = `input[name="ques${selectedQuestionArray[i]}_options"]:checked`;
    //     console.log(selector)
    //     if (document.querySelector(selector)) {
    //         answeredQuestions++;
    //     }
    // }
    selectedQuestionArray.forEach(questionIndex => {
        const selector = `input[name="ques${questionIndex}_options"]:checked`;
        if (document.querySelector(selector)) {
            answeredQuestions++;
        }
    });
    console.log(answeredQuestions)

    // Calculate percentage
    const percentage = (answeredQuestions / totalQuestions) * 100;

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}% (${answeredQuestions}/${totalQuestions})`;
}



async function changeToQuestionPage(questions, numberOfQuestion) {

    let selectedQuestionArray = await randomQuestionArray(numberOfQuestion)
    // console.log(selectedQuestionArray)
    let addingQuestionPage = document.querySelector(".displayQues").getElementsByTagName("ul")[0]
    // adding question in dom
    addingQuestionPage.innerHTML = "";
    addProgressBar();


    for (i = 0; i < numberOfQuestion; i++) {
        addingQuestionPage.innerHTML = addingQuestionPage.innerHTML + `<li>
            <div class="ques">${questions.questionarray[selectedQuestionArray[i]].question}</div>
            <div class="options">
                <ul>
                    <li>
                        <input type="radio" name="ques${selectedQuestionArray[i]}_options" 
                               value="${questions.questionarray[selectedQuestionArray[i]].options[0]}" 
                               onclick=" updateProgress(${numberOfQuestion}, ${selectedQuestionArray})">
                        <span>${questions.questionarray[selectedQuestionArray[i]].options[0]}</span>
                    </li>
                    <li>
                        <input type="radio" name="ques${selectedQuestionArray[i]}_options" 
                               value="${questions.questionarray[selectedQuestionArray[i]].options[1]}" 
                               onclick="updateProgress(${numberOfQuestion}, ${selectedQuestionArray})">
                        <span>${questions.questionarray[selectedQuestionArray[i]].options[1]}</span>
                    </li>
                    <li>
                        <input type="radio" name="ques${selectedQuestionArray[i]}_options" 
                               value="${questions.questionarray[selectedQuestionArray[i]].options[2]}" 
                               onclick="updateProgress(${numberOfQuestion}, ${selectedQuestionArray})">
                        <span>${questions.questionarray[selectedQuestionArray[i]].options[2]}</span>
                    </li>
                    <li>
                        <input type="radio" name="ques${selectedQuestionArray[i]}_options" 
                               value="${questions.questionarray[selectedQuestionArray[i]].options[3]}" 
                               onclick="updateProgress(${numberOfQuestion}, ${selectedQuestionArray})">
                        <span>${questions.questionarray[selectedQuestionArray[i]].options[3]}</span>
                    </li>
                </ul>
            </div>
        </li>`

    }

    return selectedQuestionArray

}





async function main() {
    let questions = await getquestion()


    let numberOfQuestion = 0;
    let selectedQuestionArray = [];


    function startQuiz() {
        document.querySelector(".startButton").addEventListener("click", async () => {

            let inputValue = document.querySelector(".totalQues").getElementsByTagName("input")[0].value

            if (!inputValue || isNaN(inputValue) || inputValue <= 0) {
                alert("Please enter a valid number of questions.");
                return;
            }
            document.querySelector(".displayQues").style.display = "block";
           
            document.querySelector(".frontPage").style.display = "none";

            document.querySelector(".startButton").style.display = "none"

            numberOfQuestion = parseInt(inputValue);
            selectedQuestionArray = await changeToQuestionPage(questions, numberOfQuestion)
            // console.log(selectedQuestionArray)

            resultPage();


        })
    }
    startQuiz();

    function resultPage() {

        let submitButton = document.createElement("button")
        submitButton.className = "submitButton"
        submitButton.innerHTML = "submit";
        document.querySelector(".container").append(submitButton)
       

        let UnattemptedQuestions = 0;
        let correctAnswers = 0;
        let incorrectAnswers = 0;
      
        document.querySelector(".submitButton").addEventListener("click", async () => {

      

    
      
      for (i = 0; i < numberOfQuestion; i++) {
                let selector = `input[name="ques${selectedQuestionArray[i]}_options"]:checked`;

                let checkedOption = document.querySelector(selector);
                if (checkedOption) {
                    if (checkedOption.value.trim() == questions.questionarray[selectedQuestionArray[i]].answer) {
                        correctAnswers++;
                    }
                    else {
                        incorrectAnswers++;
                    }

                } else {
                    UnattemptedQuestions++;
                }



            }
          

            document.querySelector(".displayQues").style.display = "none";
            document.querySelector(".finalPage").style.display = "block"
            document.querySelector(".submitButton").style.display = "none"
            document.querySelector(".totalAttemptedQuestions").textContent = `Your Total Unattempted questions are ${UnattemptedQuestions}`
            document.querySelector(".totalCorrectAnswers").textContent = `Your Total Correct Answer are ${correctAnswers}`
            document.querySelector(".totalIncorrectAnswers").textContent = `Your Total Wrong Answers are ${incorrectAnswers}`;
        })


    }
}
main()