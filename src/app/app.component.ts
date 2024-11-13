import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "app"
  quizData = new Map<string, string>();
  currentIndex = 0;
  questionText = '';
  userAnswer = '';
  correctAnswer = '';
  isCorrect: boolean | undefined;
  quizStarted = false;
  previousQuestion= '';
  previousAnswer= '';
  previousUserAnswer: string | undefined;
  isInputDisabled = false;
  //Score
  correctAnswerCtn = 0;
  wrongAnswerCtn = 0
  rateCorrectAnswer: string | undefined;
  //Time
  startTime = 0;
  endTime = 0;
  timeToAnswer: string | undefined;
  listOfTime: number[] = [];
  meanOfTimes: string | undefined;
  tts = false;
  isLearningQuestion=false;
  


  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizService.getQuizData().subscribe((data) => {
      const lines = data.split('\n');

      lines.forEach((line) => {
        // Regular expression to split by comma, ignoring commas within quotes
        const match = line.match(/("(?:[^"]|"")*"|[^,]+)/g);
        
        if (match && match.length >= 2) {
          // Remove quotes if present
          const question = match[0].replace(/^"|"$/g, '');
          const answer = match[1].replace(/^"|"$/g, '');
          this.quizData.set(question, answer);
        }
      });

      // Shuffle the quiz data
      this.quizData = this.quizService.shuffleMap(this.quizData);

      // Display the first question
      this.displayQuestion();
    });
  }

  async displayQuestion() {

    if(this.quizService.nextIsWrong()){
      //this.currentIndex--;
      let {learningQuestion, learningAnswer}  = this.quizService.getFromLearning()
      this.questionText=learningQuestion
      this.correctAnswer=learningAnswer
      this.isLearningQuestion=true
      this.userAnswer = '';
     // console.log("this is a learning question POGGGGG")
    }
    else{
    if (this.currentIndex < this.quizData.size) {
      this.questionText = Array.from(this.quizData.keys())[this.currentIndex];
      this.correctAnswer = Array.from(this.quizData.values())[this.currentIndex];
      this.userAnswer = '';
      //if an empty line is in the source.csv, it will skip it
      if (this.questionText.length < 5) {
        this.currentIndex++;
        this.displayQuestion();
      }
    } else {
      this.userAnswer = '';
      this.isInputDisabled = true;
      this.questionText = 'Y reste pu de questions mon fou ! <3';// Quiz is finished
    }
  }

    if (this.tts) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      this.speak();
    }

    this.startTime = performance.now();
  }
  updateRateCorrectAnswer() {
    let rate = (this.correctAnswerCtn / (this.correctAnswerCtn + this.wrongAnswerCtn)) * 100;
    this.rateCorrectAnswer = rate.toFixed(2).toString() + "%";
  }

  checkAnswer(userAnswer: string) {
    this.calculateTime();
    this.quizStarted = true;

    if (userAnswer.startsWith('+')) {
        userAnswer = "\\" + userAnswer;
    }
  
    const pattern = new RegExp(userAnswer.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'i');
    if (pattern.test(this.correctAnswer.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) && userAnswer.trim() !== "") {
      if (this.isLearningQuestion){
        this.quizService.deleteFromLearning(this.questionText)
        this.isLearningQuestion=false
      }
      this.correctAnswerSound();
      this.currentIndex++;
      this.feedback(true, this.questionText, this.correctAnswer, userAnswer);
      this.displayQuestion();
      this.correctAnswerCtn++;
      this.updateRateCorrectAnswer()
      return true;
    } else {
      this.wrongAnswerSound();
      this.currentIndex++;
      this.feedback(false, this.questionText, this.correctAnswer, userAnswer);
      this.displayQuestion();
      this.wrongAnswerCtn++;
      this.updateRateCorrectAnswer()
      this.quizService.addQuestionToLearning(this.previousQuestion,this.previousAnswer)

      return false;
    }
  }

  feedback(positive: boolean, question: string, answer: string, userAnswer: string) {
    this.isCorrect = positive;
    this.previousQuestion = question;
    this.previousAnswer = answer;
    this.previousUserAnswer = userAnswer;
  }

  calculateTime() {
    this.endTime = performance.now();
    this.listOfTime.push((this.endTime - this.startTime) / 1000);
    this.timeToAnswer = ((this.endTime - this.startTime) / 1000).toFixed(1);
    const totalElapsedTime = this.listOfTime.reduce((acc, time) => acc + time, 0);
    const mean = totalElapsedTime / this.listOfTime.length;
    this.meanOfTimes = mean.toFixed(2);
  }

  cancelLastAnswer() {      
    this.correctAnswerSound();
    this.isCorrect = true;
    this.wrongAnswerCtn--;
    this.correctAnswerCtn++;
    this.updateRateCorrectAnswer()
    this.quizService.deleteFromLearning(this.previousQuestion)
    if (this.previousQuestion==this.questionText){
      console.log("I am here guys, trying to change the question")
      this.currentIndex++;
      this.displayQuestion();
    }
  }

  speak() {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'fr-CA';
    speech.text = this.questionText;

    window.speechSynthesis.speak(speech);
  }

  turnOnTTS() {
    this.tts = true;
    this.speak();
  }

  turnOffTTS() {
    this.tts = false;
  }

  wrongAnswerSound() {
    const audioElement = document.getElementById('wronganswer-sound') as HTMLAudioElement;
    audioElement.play();
  }

  correctAnswerSound() {
    const audioElement = document.getElementById('correctanswer-sound') as HTMLAudioElement;
    audioElement.play();
  }

   onCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            // Code to execute when checkbox is checked
            this.quizService.enableLearning();
        } else {
            // Code to execute when checkbox is unchecked
            this.quizService.disableLearning();
        }
    }


}
