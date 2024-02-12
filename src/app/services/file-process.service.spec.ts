import { TestBed } from '@angular/core/testing';
import { FileProcessService } from './file-process.service';

describe('FileProcessService', () => {
  let service: FileProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read file content', (done: DoneFn) => {
    const file = new File(['This is a test file.'], 'test.txt', { type: 'text/plain' });
    service.readFileContent(file).subscribe(content => {
      expect(content).toEqual('This is a test file.');
      done();
    });
  });

  it('should count words', () => {
    const content = 'This is a test file. It contains some words.';
    const wordCounts = service.countWords(content);
    expect(wordCounts.get('this')).toEqual(1);
    expect(wordCounts.get('is')).toEqual(1);
    expect(wordCounts.get('a')).toEqual(1);
    expect(wordCounts.get('test')).toEqual(1);
    expect(wordCounts.get('file')).toEqual(1);
    expect(wordCounts.get('contains')).toEqual(1);
    expect(wordCounts.get('some')).toEqual(1);
    expect(wordCounts.get('words')).toEqual(1);
    expect(wordCounts.get('pen')).toBeUndefined();
  });

  it('should handle empty content while counting words', () => {
    const content = '';
    const wordCounts = service.countWords(content);
    expect(wordCounts.size).toEqual(0);
  });

  it('should handle special characters while counting words', () => {
    const content = 'This! is, a: test, file.';
    const wordCounts = service.countWords(content);
    expect(wordCounts.get('this')).toEqual(1);
    expect(wordCounts.get('is')).toEqual(1);
    expect(wordCounts.get('a')).toEqual(1);
    expect(wordCounts.get('test')).toEqual(1);
    expect(wordCounts.get('file')).toEqual(1);
  });

  it('should reject invalid file types', (done: DoneFn) => {
    const file = new File(['This is a test file.'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    service.readFileContent(file).subscribe({
      next: () => {},
      error: error => {
        expect(error.message).toEqual('Invalid file type.');
        done();
      }
    });
  });
});
