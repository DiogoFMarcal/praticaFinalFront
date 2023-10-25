import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toCurrency'
})
export class ToCurrencyPipe implements PipeTransform {

  transform(value: number, withEuroSymbol: boolean): string {

    var formattedValue: string = value.toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (withEuroSymbol) ? formattedValue : formattedValue.replace('€', '');
  }
}