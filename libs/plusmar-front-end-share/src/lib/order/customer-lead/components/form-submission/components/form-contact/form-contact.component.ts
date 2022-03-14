import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ILeadsFormComponent, ILeadsFormWithComponentsSelected } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
})
export class FormContactComponent implements OnInit {
  @Input() form: ILeadsFormWithComponentsSelected;
  contactForm: FormGroup;
  mappedFormControls: ILeadsFormComponent[];
  hasBeenMapped = false;
  disableInputs = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.form) {
      void this.generateForm(this.form);
    }
  }

  async generateForm(form: ILeadsFormWithComponentsSelected): Promise<void> {
    const formGroup = await this.generateComponents(form);
    this.contactForm = this.formBuilder.group(formGroup);
    this.contactForm.disable();
    this.getFormControls();
  }

  generateComponents(form: ILeadsFormWithComponentsSelected): Promise<FormGroup> {
    const { components } = form;
    const formGroup = {} as FormGroup;

    components.map((component: ILeadsFormComponent) => {
      const validation = [];
      validation.push('');
      formGroup[component.options.controlName] = validation;
    });
    return new Promise((resolve) => resolve(formGroup));
  }

  getFormControls(): ILeadsFormComponent[] {
    if (!this.hasBeenMapped) {
      this.mappedFormControls = Object.keys(this.contactForm.controls).map((name, i) => {
        if (this.hasSameIndex(i, this.form.components[i].index)) {
          const mapped = {
            name: name,
            ...this.form.components[i],
          };

          return mapped;
        }
      });

      this.hasBeenMapped = true;
    }

    return this.mappedFormControls;
  }

  hasSameIndex(index: number, secondIndex: number): boolean {
    return Number(index) === Number(secondIndex);
  }
}
