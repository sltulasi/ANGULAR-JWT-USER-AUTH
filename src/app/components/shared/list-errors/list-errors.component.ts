import { NgForOf, NgIf } from '@angular/common';
import { AfterContentChecked, Component, Input } from '@angular/core';
import { Errors } from 'src/app/models/errors.model';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  styleUrls: ['./list-errors.component.css'],
  imports: [NgForOf, NgIf],
  standalone: true,
})
export class ListErrorsComponent {
  errorList: string[] = [];

  @Input() set errors(errorList: Errors | null) {
    this.errorList = errorList
      ? Object.keys(errorList.errors || {}).map(
          (key) => `${key} ${errorList.errors[key]}`
        )
      : [];
    console.log('this.errorList', this.errorList);
  }
}
