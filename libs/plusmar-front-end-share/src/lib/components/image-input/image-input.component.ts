import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { isImageByExtension, isImageValid } from '@reactor-room/itopplus-front-end-helpers';

const sizeExceededValidator =
  (size: number) =>
  (control: AbstractControl): { [key: string]: boolean } | null => {
    return control?.value?.file?.size > size ? { sizeExceeded: true } : null;
  };

const defaultAccept = 'image/x-png,image/gif,image/jpeg';
@Component({
  selector: 'reactor-room-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss'],
})
export class ImageInputComponent implements OnInit {
  parentForm: FormGroup;
  @Input() size: string;
  @Input() maxFiles = 1;
  // @Input() multiple = this.maxFiles !== 1;
  multiple;
  @Input() accept = defaultAccept;
  @Input() controlName = 'images';
  @Input() nestedIn: string;
  @Input() sizeLimit = 2097152;
  @Input() validator = [this.accept === defaultAccept ? sizeExceededValidator(this.sizeLimit) : null];
  @Input() savePreviewTo = 'url'; // Puneet wants to call the key with preview 'mediaLink', so it is dynamic :)
  imagesArray: FormArray;
  constructor(private fb: FormBuilder, private pFD: FormGroupDirective) {}
  isImageByExtension = isImageByExtension;

  ngOnInit(): void {
    this.initForm();
    this.multiple = this.maxFiles !== 1;
  }

  initForm(): void {
    this.parentForm = this.pFD.form;
    const parentControl = (this.nestedIn ? this.parentForm.get(this.nestedIn) : this.parentForm) as FormGroup;
    parentControl.addControl(this.controlName, new FormArray([]));
    this.imagesArray = (this.nestedIn ? this.parentForm.get(this.nestedIn).get(this.controlName) : this.parentForm.get(this.controlName)) as FormArray;
  }

  onFileChange(event): void {
    const files = event.target.files;

    if (files.length) {
      for (const file of files) {
        const reader = new FileReader();
        (reader.onload = (e: any) => {
          this.imagesArray.push(
            new FormControl(
              {
                file,
                [this.savePreviewTo]: e.target.result,
                extension: file.name.slice((Math.max(0, file.name.lastIndexOf('.')) || Infinity) + 1),
                filename: file.name,
              },
              this.validator,
            ),
          );

          if (this.accept === defaultAccept) {
            isImageValid(e.target.result as string, (exists) => {
              if (!exists) {
                this.imagesArray.controls[this.imagesArray.controls.length - 1]?.setErrors({ wrongType: true });
              }
            });
          }
        }),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          (reader.onloadend = () => {});

        reader.readAsDataURL(file);
      }
    }
    event.target.value = '';
  }

  remove(index: number): void {
    this.imagesArray.removeAt(index);
  }
}
