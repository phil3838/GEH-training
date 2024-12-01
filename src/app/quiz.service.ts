import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {


  list = new Map<string, string>();
  probabilityOfLearning = 0.14; 
  disabled = false;


  constructor(private http: HttpClient) { }

  getQuizData() {
    return this.http.get('assets/questions/tempfile-format-questions.csv', { responseType: 'text' })
  }

  shuffleMap(map: Map<string, string>) {
    const entries = Array.from(map.entries());

    for (let i = entries.length - 1; i > 0; i--) {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const j = randomArray[0] % (i + 1);

      [entries[i], entries[j]] = [entries[j], entries[i]];
    }

    return new Map<string, string>(entries);;
  }

  addQuestionToLearning(question: string, answer: string) {
    this.list.set(question, answer);
  }

  nextIsWrong(): boolean {
    if (this.list.size === 0) {
      return false;
    }
    else if (this.disabled){
      return false;
    } else{

    const randomNumber = Math.random();

    // Check if the random number is less than 0.05 (which is 5% of the time)
    return randomNumber < this.probabilityOfLearning;
    }
  }

  getFromLearning(): { learningQuestion: string, learningAnswer: string } {
    this.list = this.shuffleMap(this.list);
  
    console.log("*** Getting From Learning ***")
    this.list.forEach((value, key) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });

    const iterator = this.list.entries();
    const firstEntry = iterator.next().value!;

    const learningQuestion = firstEntry[0];
    const learningAnswer = firstEntry[1];

    return { learningQuestion, learningAnswer };
  }

  deleteFromLearning(question: string) {
    if (this.list.has(question)) {
      this.list.delete(question);
    } else {
      console.log("question doesn't exist in the learning list")
    }
  }

  enableLearning(){
    this.disabled=false;
  }
  disableLearning(){
    this.disabled=true;
  }
}
