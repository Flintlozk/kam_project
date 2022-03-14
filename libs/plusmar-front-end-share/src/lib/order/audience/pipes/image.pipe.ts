import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'userNullImage',
})
export class UserNullImagePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      return value;
    } else {
      return 'assets/img/customer/customer_error.svg';
    }
  }
}
