document.addEventListener("DOMContentLoaded", function() {
   
    const questions = [
        {
            question:"Was ist das größte Tier der Welt?",
            answer:[
                {text:"Hai", correct: false},
                {text:"Blauwal", correct: true},
                {text:"Elephant ", correct: false},
                {text:"Giraffe", correct: false},
            ]
        },
        {
            question:"Welcher ist der kleinste Kontinent der Welt?",
            answer:[
                {text:"Asien", correct: false},
                {text:"Afrika ", correct: false},
                {text:"Arktis", correct: false},
                {text:"Australien", correct: true},
            ]
        }
    
    ];
    
    const questionElement = document.getElementById("Question");
    const answerBtn = document.getElementById("AlignAnswer");
    const nextBtn = document.getElementById("next-btn");
    
    
    let currentQuestionIndex = 0;
    let score = 0;
    
    function startQuiz(){
        currentQuestionIndex = 0;
        score = 0;
        nextBtn.innerHTML = "Weiter";
        showQuestion();
    }
    
    function showQuestion(){
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1;
        questionElement.innerHTML = questionNo + ". "+currentQuestion.question;
    
        currentQuestion.answer.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer.text;
            answerBtn.appendChild(button);
            if(answer.correct){
                button.dataset.correct = answer.correct;
            }
            button.addEventListener("click",selectAnswer);
        });
    
    }

    function resetState(){
        nextBtn.style.display = "none";
        while(answerBtn.firstChild){
            answerBtn.removeChild(answerBtn.firstChild);
        }
    }

    function selectAnswer(e){
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct ==="true";
        if(isCorrect){
            selectedBtn.classList.add("correct");
            score++;
        }else{
            selectedBtn.classList.add("incorrect");
        }
        Array.from(answerBtn.children).forEach(button =>{
            if(button.dataset.correct === "true"){
                button.classList.add("correct");
            }   
            button.disabled = true;    
         });
         nextBtn.style.display = "block";
    }
    
    function handleNextButton(){
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length){
            showQuestion();
        }else{
            showScore();
        }
    }

    function showScore(){
        resetState();
        questionElement.innerHTML = `Du hast ${score} von ${questions.length}!`;
        nextBtn.innerHTML = "Erneut Spielen";
        nextBtn.style.display = "block";
    }

    nextBtn.addEventListener("click", ()=>{
        if(currentQuestionIndex < questions.length){
            handleNextButton();
        }
        else{
            startQuiz();
        }
    });
    
    startQuiz();

});





