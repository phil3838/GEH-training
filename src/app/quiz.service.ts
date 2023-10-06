import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private http: HttpClient) { }

  getQuizData() { 
    return this.http.get('assets/source.csv', {responseType: 'text'})
  }

  shuffleMap(map: Map<string,string>){
  const entries = Array.from(map.entries());


  }
}
