import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deepPayload',
})
export class DeepPayloadPipe implements PipeTransform {
  transform(value: unknown): unknown {
    return null;
  }
}
