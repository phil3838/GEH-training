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
  questionText='';
  userAnswer='';

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.quizService.getQuizData().subscribe((data) => {
      const lines = data.split('\n');

      lines.forEach((line) => {
        const [question, answer] = line.split(',');
        this.quizData.set(question, answer);
      });

      // Shuffle the quiz data
      //this.quizService.shuffleMap(this.quizData);

      // Display the first question
      this.displayQuestion();
    });
  }

  displayQuestion() {
    if (this.currentIndex < this.quizData.size) {
      this.questionText = Array.from(this.quizData.keys())[this.currentIndex];
      
    } else {
      this.questionText = 'Quiz Finished!';// Quiz is finished
    }
  }

  checkAnswer(userAnswer: string) {
    const correctAnswer = Array.from(this.quizData.values())[this.currentIndex];
    
    if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      console.log("good answer")
      this.currentIndex++;
      this.displayQuestion();
      return true;
    } else {
      console.log(userAnswer+" is not : "+correctAnswer)
      return false;
    }
  }




  
}
