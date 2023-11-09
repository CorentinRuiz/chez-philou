import { IsMongoId, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateOrderDto {
  @IsPositive()
  @IsNotEmpty()
  howManyMorePeople: number;

  @IsNotEmpty()
  @IsMongoId()
  orderId: string;

  @IsNotEmpty()
  tableNumberToAdd: number;
}
