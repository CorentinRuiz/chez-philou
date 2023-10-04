import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PreparedItemDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty()
  comment: string;

  static kitchenPreparedItemToPreparedItemDtoFactory(kitchenPreparedItem): PreparedItemDto {
    const preparedItem: PreparedItemDto = new PreparedItemDto();
    preparedItem._id = kitchenPreparedItem._id;
    preparedItem.shortName = kitchenPreparedItem.shortName;
    preparedItem.comment = kitchenPreparedItem.comment;

    return preparedItem;
  }
}
