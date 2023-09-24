import {IsNotEmpty, IsPositive} from 'class-validator';

export class UpdateTableDto {
  @IsNotEmpty()
  blocked: boolean;
}
