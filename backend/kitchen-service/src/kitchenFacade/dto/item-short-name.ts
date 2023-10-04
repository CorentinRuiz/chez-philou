import { IsNotEmpty } from 'class-validator';

export class ItemShortNameDto {
  @IsNotEmpty()
  shortName: string;
}
