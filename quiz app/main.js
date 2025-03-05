//select elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets span");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".result");
let countDownElement = document.querySelector(".count-down");
//set options
let currentIndex =0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions(){
let myRequest = new XMLHttpRequest();

myRequest.onreadystatechange = function(){
if (this.readyState === 4 && this.status === 200) {
let questionObject = JSON.parse(this.responseText);
let questionCount = questionObject.length;

createBullets(questionCount);


//add question data
addQuestionData(questionObject[currentIndex],questionCount);


//start count down
countDown(10,questionCount);

submitButton.onclick =  () => {
let theRightAnswer =  questionObject[currentIndex].right_answer;

currentIndex++;

checkAnswer(theRightAnswer,questionCount);

quizArea.innerHTML = "";
answerArea.innerHTML = "";
addQuestionData(questionObject[currentIndex],questionCount);

//handle bullets class
handleBullets(currentIndex);
clearInterval(countDownInterval);
countDown(10,questionCount);


//show result
showResult(questionCount);
};

}

}

myRequest.open("GET","html-questions.json",true);
myRequest.send(); 
};
getQuestions();

function createBullets(num){
countSpan.innerHTML = num;

//create spans
for (let i = 0; i < num; i++) {
let theBullet = document.createElement("span");
//if it is first span
if (i === 0) {
theBullet.className = "on";
}
bulletsSpanContainer.appendChild(theBullet);
}

}


function addQuestionData(obj,count){
if(currentIndex < count){

let questionTitle = document.createElement("h2");

let questionText = document.createTextNode(obj["title"]);

questionTitle.appendChild(questionText);

quizArea.appendChild(questionTitle);

//create answers 
for (let i = 1; i <= 4; i++) {
//create main div
let mainDiv = document.createElement("div");
mainDiv.className = "answer";
//create input radio 
let radioInput = document.createElement("input");
//add name , id , type , data-attributes
radioInput.name = "question";
radioInput.type = "radio";
radioInput.id = `answer_${i}`;
radioInput.dataset.answer = obj[`answer_${i}`];

//create label
let theLabel = document.createElement("label");
theLabel.htmlFor =`answer_${i}`;

let theLabelText = document.createTextNode(obj[`answer_${i}`]);

theLabel.appendChild(theLabelText);
mainDiv.appendChild(radioInput);
mainDiv.appendChild(theLabel);

answerArea.appendChild(mainDiv);

}

}
};

function checkAnswer(rAnswer,qCount){
let answers = document.getElementsByName("question");
let theChosenAnswer;

for(let i = 0 ; i < answers.length ; i++){

if (answers[i].checked) {
theChosenAnswer = answers[i].dataset.answer;    
}
}

if (rAnswer === theChosenAnswer) {
rightAnswers++;
}

};

function handleBullets(){
let bulletsSpans = document.querySelectorAll(".bullets .spans span");
let arrayOfSpan = Array.from(bulletsSpans);
arrayOfSpan.forEach((span,index) => {
if (currentIndex === index) {
span.className = "on";
}
})
};

function showResult(count){
let theResults;
if (currentIndex === count) {
quizArea.remove();
answerArea.remove();
bullets.remove();
submitButton.remove();

if (rightAnswers > (count / 2) && rightAnswers < count) {
theResults = `<span class="good">Good</span> ${rightAnswers} From ${count}`;
}else if(rightAnswers === count){
theResults = `<span class="perfect">Perfect</span> ${rightAnswers} From ${count}`;
}else{
theResults = `<span class="bad">Bda</span> ${rightAnswers} From ${count}`;
}
resultsContainer.innerHTML = theResults;
resultsContainer.style.padding = "10px";
resultsContainer.style.backGroundColor = "white";
resultsContainer.style.marginTop = "10px";

}
};

function countDown(duration,count){
if (currentIndex < count) {
let minutes , seconds;
countDownInterval = setInterval(function(){
minutes = parseInt(duration / 60);
seconds = parseInt(duration % 60);

minutes = minutes < 10 ? `0${minutes}`:minutes;
seconds = seconds < 10 ? `0${seconds}`:seconds;


countDownElement.innerHTML = `${minutes}:${seconds}`;
if (--duration < 0) {
clearInterval(countDownInterval);
submitButton.click();
}

},1000)

}
};