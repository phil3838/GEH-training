import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private http: HttpClient) { }

  getQuizData() {
    return this.http.get('assets/source.csv', { responseType: 'text' })
  }

  shuffleMap(map: Map<string, string>) {
    const entries = Array.from(map.entries());

    map.forEach((value, key) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });

    // Shuffle the array of values
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }

    // Create a new Map with the shuffled values and the original keys
    const shuffledMap = new Map<string, string>(entries); 

    console.log("===============================================================================")

    shuffledMap.forEach((value, key) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });


    return shuffledMap;

  }
}
