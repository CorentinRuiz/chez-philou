import { HttpStatus } from '@nestjs/common';

import { ErrorDto } from '../../shared/dto/error.dto';

export class TableBlockedException extends ErrorDto {
  constructor(tableNumber: number) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, 'Table is blocked', `"${tableNumber}" is the number of a table which have been blocked!`);
  }
}
