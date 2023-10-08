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
  isCorrect: boolean | undefined;
  quizStarted=false;
  previousQuestion: string | undefined;
  previousAnswer: string | undefined;
  isInputDisabled=false;
  
  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizService.getQuizData().subscribe((data) => {
      const lines = data.split('\n');

      lines.forEach((line) => {
        const [question, answer] = line.split(',');
        this.quizData.set(question, answer);
      });

      // Shuffle the quiz data
      this.quizData=this.quizService.shuffleMap(this.quizData);

      // Display the first question
      this.displayQuestion();
    });
  }

  displayQuestion() {
    if (this.currentIndex < this.quizData.size-1) {
      this.questionText = Array.from(this.quizData.keys())[this.currentIndex];
      this.userAnswer='';
    } else {
      this.userAnswer='';
      this.isInputDisabled=true;
      this.questionText = 'Y reste pu de questions mon fou !';// Quiz is finished
    }
  }

  checkAnswer(userAnswer: string) {
    this.quizStarted=true;
    const correctAnswer = Array.from(this.quizData.values())[this.currentIndex];
    const pattern = new RegExp(userAnswer.toLowerCase().trim().normalize("NFD"), 'i');

    if (pattern.test(correctAnswer.toLowerCase().trim().normalize("NFD"))) {
      this.currentIndex++;
      this.feedback(true, this.questionText, correctAnswer);
      this.displayQuestion();
      return true;
    } else {
      this.currentIndex++;
      this.feedback(false, this.questionText, correctAnswer);
      this.displayQuestion();
      return false;
    }
  }

  feedback(positive: boolean, question: string, answer: string) {
    this.isCorrect=positive;     
    this.previousQuestion=question;
    this.previousAnswer=answer;
  }




}
