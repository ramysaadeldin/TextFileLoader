// file-upload.component.ts
import { Component } from '@angular/core';
import { FileProcessService } from '../../services/file-process.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  fileContent: string | null = null;
  wordCounts: Map<string, number> | null = null;
  error: string | null = null;

  constructor(private fileProcessService: FileProcessService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      this.error='No File';
    }
      this.selectedFile = file;
      this.error = null;
      this.readFileContent(file);

  }

  private readFileContent(file: File): void {
    this.fileProcessService.readFileContent(file)
      .subscribe({
        next: content => {
          this.fileContent = content;
          this.wordCounts = this.fileProcessService.countWords(content);
          this.error = null;
        },
        error: error => {
          console.log(error);
          this.error = 'Error reading file.';
          this.fileContent = null;
          this.wordCounts = null;
        }
      });
  }
}
