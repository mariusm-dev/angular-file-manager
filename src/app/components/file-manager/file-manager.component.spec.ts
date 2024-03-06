import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { FileModel } from '../../models/files.interface';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Mock component for testing purposes
@Component({
  selector: 'app-file-manager',
  template: ''
})
class MockFileManagerComponent {
  @Input() files: FileModel[] = [];
}

describe('FileManagerComponent', () => {
  let component: FileManagerComponent;
  let fixture: ComponentFixture<FileManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockFileManagerComponent], // Use mock component instead
      imports: [CommonModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle select all correctly', () => {
    const files: FileModel[] = [
      { name: 'file1', device: 'device1', path: 'path1', status: 'available' },
      { name: 'file2', device: 'device2', path: 'path2', status: 'available' },
      { name: 'file3', device: 'device3', path: 'path3', status: 'available' }
    ];

    component.files = files;

    // Select all
    component.toggleSelectAll();
    expect(component.selectedFiles.length).toBe(3);

    // Deselect all
    component.toggleSelectAll();
    expect(component.selectedFiles.length).toBe(0);

    // Select all again
    component.toggleSelectAll();
    expect(component.selectedFiles.length).toBe(3);

    // Deselect one
    component.toggleSelectFile(files[0]);
    expect(component.selectedFiles.length).toBe(2);

    // Select all again
    component.toggleSelectAll();
    expect(component.selectedFiles.length).toBe(3);
  });

  it('should correctly update select-all checkbox state', () => {
    const files: FileModel[] = [
      { name: 'file1', device: 'device1', path: 'path1', status: 'available' },
      { name: 'file2', device: 'device2', path: 'path2', status: 'available' },
      { name: 'file3', device: 'device3', path: 'path3', status: 'available' }
    ];

    component.files = files;

    // None selected - The select-all checkbox should be in an unselected state if no items are selected.
    expect(component.selectAllChecked).toBeFalsy();
    expect(component.selectAllIndeterminated).toBeFalsy();

    // Select all - The select-all checkbox should be in a selected state if all items are selected.
    component.toggleSelectAll();
    expect(component.selectAllChecked).toBeTruthy();
    expect(component.selectAllIndeterminated).toBeFalsy();

    // Deselect one - The select-all checkbox should be in an indeterminate state if some but not all items are selected.
    component.toggleSelectFile(files[0]);
    expect(component.selectAllChecked).toBeFalsy();
    expect(component.selectAllIndeterminated).toBeTruthy();
  });

  it('should update selected files count text correctly - The "Selected 2" text should reflect the count of selected items and display "None Selected" when there are none selected.', () => {
    const files: FileModel[] = [
      { name: 'file1', device: 'device1', path: 'path1', status: 'available' },
      { name: 'file2', device: 'device2', path: 'path2', status: 'available' },
      { name: 'file3', device: 'device3', path: 'path3', status: 'available' }
    ];

    component.files = files;

    // Initially no files selected
    expect(component.selectedFiles.length).toBe(0);
    expect(fixture.nativeElement.querySelector('.header').textContent).toContain('None Selected');

    // Select one file
    component.toggleSelectFile(files[0]);
    fixture.detectChanges();
    expect(component.selectedFiles.length).toBe(1);
    expect(fixture.nativeElement.querySelector('.header').textContent).toContain('Selected 1');

    // Select all files
    component.toggleSelectAll();
    fixture.detectChanges();
    expect(component.selectedFiles.length).toBe(3);
    expect(fixture.nativeElement.querySelector('.header').textContent).toContain('Selected 3');
  });

  it('should download selected files when available and generate alert', () => {
    spyOn(window, 'alert');
    const files: FileModel[] = [
      { name: 'file1', device: 'device1', path: 'path1', status: 'available' },
      { name: 'file2', device: 'device2', path: 'path2', status: 'available' },
      { name: 'file3', device: 'device3', path: 'path3', status: 'available' }
    ];

    component.files = files;

    // Select all files
    component.toggleSelectAll();
    fixture.detectChanges();

    // Download selected files
    component.downloadSelectedFiles();
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Selected Files:\nfile1 - device1 - path1\nfile2 - device2 - path2\nfile3 - device3 - path3');
  });

  it('download button should be disabled if some selected files are not available', () => {
    const files: FileModel[] = [
      { name: 'file1', device: 'device1', path: 'path1', status: 'scheduled' },
      { name: 'file2', device: 'device2', path: 'path2', status: 'available' },
      { name: 'file3', device: 'device3', path: 'path3', status: 'available' }
    ];

    component.files = files;

    // Select all files
    component.toggleSelectAll();
    fixture.detectChanges();

    // Download button is disabled
    expect(fixture.nativeElement.querySelector('.downloadBtn').disabled).toBeTrue();
  });
});
