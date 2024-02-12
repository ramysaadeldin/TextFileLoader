import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import { FileProcessService } from '../../services/file-process.service';
import { By } from '@angular/platform-browser';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let fileProcessServiceSpy: jasmine.SpyObj<FileProcessService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FileProcessService', ['readFileContent']);

    await TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      providers: [
        { provide: FileProcessService, useValue: spy }
      ]
    }).compileComponents();

    fileProcessServiceSpy = TestBed.inject(FileProcessService) as jasmine.SpyObj<FileProcessService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const file = new File(['This is a test file.'], 'test.txt', { type: 'text/plain' });

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)

    const inputDebugEl  = fixture.debugElement.query(By.css('input[type=file]'));
    inputDebugEl.nativeElement.files = dataTransfer.files;

    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    expect(component.selectedFile).toEqual(file);
});

});
