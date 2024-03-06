import { Component, Input } from '@angular/core';
import { FileModel } from '../../models/files.interface'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent {

  @Input() files: FileModel[] = [];

  selectedFiles: FileModel[] = [];
  selectAllChecked: boolean = false;
  selectAllIndeterminated: boolean = false;

  canBeDownloaded() {
    return this.selectedFiles.length && !this.selectedFiles.some(f => f.status !== 'available');
  }

  determineSeletAllToggle() {
    switch (this.selectedFiles.length) {
      case 0: {
        this.selectAllChecked = false;
        this.selectAllIndeterminated = false;
        break;
      }
      case this.files.length: {
        this.selectAllChecked = true;
        this.selectAllIndeterminated = false;
        break;
      }
      default: {
        this.selectAllChecked = false;
        this.selectAllIndeterminated = true;
        break;
      }
    }
  }
  downloadSelectedFiles() {
    const selectedFilesInfo = this.selectedFiles.map(file => `${file.name} - ${file.device} - ${file.path}`).join('\n');
    alert(`Selected Files:\n${selectedFilesInfo}`);
  }
  
  toggleSelectAll() {
    this.selectedFiles = this.selectedFiles.length !== this.files.length ? [...this.files] : [];
    this.determineSeletAllToggle();
  }

  toggleSelectFile(file: FileModel) {
    if (this.selectedFiles.includes(file)) {
      this.selectedFiles = this.selectedFiles.filter(selectedFile => selectedFile !== file);
    } else {
      this.selectedFiles.push(file);
    }
    this.determineSeletAllToggle();
  }
}
