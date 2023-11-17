import { Component } from '@angular/core';

@Component({
  selector: 'app-audio-version',
  templateUrl: './audio-version.component.html',
  styleUrls: ['./audio-version.component.scss']
})
export class AudioVersionComponent {
  questionText = 'This is a sample question in French';

  constructor() {
    this.checkSpeechSynthesisSupport();
  }

  checkSpeechSynthesisSupport() {
    if ('speechSynthesis' in window) {
      console.log('Speech synthesis is supported in this browser.');
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
    this.speak("Quel athlète américain est le seul nageur à avoir conservé un titre sur quatre olympiades consécutives?")
  }

  speak(text: string) {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'fr-FR'; // Set the language to French
    speech.text = text;
    window.speechSynthesis.speak(speech);
  }

  dictateQuestion() {
    this.speak(this.questionText); // Speak the question text
  }
}
