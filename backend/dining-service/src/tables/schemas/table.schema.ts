import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TableDocument = Table & Document;

@Schema({
  versionKey: false,
})
export class Table {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({default: false})
  blocked: boolean;

  @ApiProperty()
  @Prop({ required: true, min: 0 })
  number: number;

  @ApiProperty()
  @Prop({ default: false })
  taken: boolean;

  @ApiProperty()
  @Prop({ default: null })
  linkedTable: number;
}

export const TableSchema = SchemaFactory.createForClass(Table);
