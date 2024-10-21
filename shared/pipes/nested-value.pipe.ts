import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Pipe({
    standalone: true,
    name: 'nestedValue',
})
export class NestedValuePipe implements PipeTransform {
    transform(obj, keys: string) {
        return get(obj, keys, '');
    }
}
