import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {

  transform(value: any, args: string): any {
    return value.filter(function(item) { 
		return item.categoryId == args
	});
  }

}
