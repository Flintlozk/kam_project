import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { IContactTask } from '@reactor-room/crm-models-lib';
import { map, startWith } from 'rxjs/operators';
import { ITaskAssign } from '../../modules/task/task.model';

@Component({
  selector: 'reactor-room-assign-form',
  templateUrl: './assign-form.component.html',
  styleUrls: ['./assign-form.component.scss'],
})
export class AssignFormComponent implements OnInit, OnChanges {
  @Input() groupAssignee: ITaskAssign[];
  @Input() allAssignee: IContactTask[];
  @ViewChild(MatMenuTrigger) addAssign: MatMenuTrigger;
  @Output() addAssignee = new EventEmitter<string>();
  filteredOptions: string[] = [];
  filteredAssigneeOptions;
  assignOption: FormControl;
  constructor() {}

  ngOnInit(): void {
    this.assignOption = new FormControl('');
  }
  onChangeInput() {
    this.filteredAssigneeOptions = this.assignOption.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAssignType(value)),
    );
  }
  private _filterAssignType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredOptions.filter((option) => option.toLowerCase().includes(filterValue));
  }
  onAddAssignee(): void {
    const assigneeName = this.groupAssignee.map((assignee) => assignee.name);
    if (!assigneeName.includes(this.assignOption.value)) {
      this.addAssignee.emit(this.assignOption.value);
      this.addAssign.closeMenu();
      this.assignOption.patchValue('');
    }
  }
  trackByIndex(index: number): number {
    return index;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.filteredOptions = this.allAssignee.map((assigneeDetail) => assigneeDetail.name);
  }
}
