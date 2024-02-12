// file-process.service.ts
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileProcessService {
  constructor() {}

  readFileContent(file: File): Observable<string> {
    if (!this.isFileAllowed(file)) {
      return throwError(new Error('Invalid file type.'));
    }

    return new Observable<string>(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = error => {
        observer.error(error);
      };
      reader.readAsText(file);
    }).pipe(
      catchError(() => {
        return throwError(new Error('Error reading file.'));
      })
    );
  }

  countWords(content: string): Map<string, number> {

    const whiteSpaceReg=/\s+/;

    const sanitizedContent = this.sanitizeContent(content);
    const contentWithoutDots=this.removeSpecialCharacters(sanitizedContent);
    const words = contentWithoutDots.split(whiteSpaceReg).filter(word => word.trim() !== '');

    const wordCounts = new Map<string, number>();

    words.forEach(word => {
      const lowerCaseWord = word.toLowerCase();
      const count = wordCounts.has(lowerCaseWord) ? wordCounts.get(lowerCaseWord)! + 1 : 1;
      wordCounts.set(lowerCaseWord, count);
    });

    return wordCounts;
  }

  private isFileAllowed(file: File): boolean {
    const allowedTypes = ['text/plain'];
    return allowedTypes.includes(file.type);
  }

  private sanitizeContent(content: string): string {
    return content.replace(/<[^>]*>/g, '');
  }

  private removeSpecialCharacters(content: string): string {
    const specialCharsRegex = /[^\w\s]/g;
    return content.replace(specialCharsRegex, ' ');
  }

}
