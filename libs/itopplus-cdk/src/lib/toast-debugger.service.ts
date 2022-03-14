import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig as Config } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastDebuggerService {
  config = { timeOut: 3000, closeButton: true, newestOnTop: true } as Config;
  constructor(private toastr: ToastrService) {}

  show(constuctorName: string, message: string): void {
    console.log(constuctorName, ' :: ', message);
    this.toastr.show(message, constuctorName, this.config);
  }

  info(constuctorName: string, message: string): void {
    console.log(constuctorName, ' :: ', message);
    this.toastr.info(message, constuctorName, this.config);
  }

  init(constuctorName: string): void {
    console.log(constuctorName, ' :: ON_INIT');
    this.toastr.success('ON_INIT', constuctorName, this.config);
  }

  changes(constuctorName: string): void {
    console.log(constuctorName, ' :: ON_CHANGES');
    this.toastr.warning('ON_CHANGES', constuctorName, this.config);
  }

  destroy(constuctorName: string): void {
    console.log(constuctorName, ' :: ON_DESTROY');
    this.toastr.error('ON_DESTROY', constuctorName, this.config);
  }
}
