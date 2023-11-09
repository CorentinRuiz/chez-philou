import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table, TableDocument } from '../schemas/table.schema';

import { AddTableDto } from '../dto/add-table.dto';
import { TableWithOrderDto } from '../../tables-with-order/dto/table-with-order.dto';

import { TableAlreadyExistsException } from '../exceptions/table-already-exists.exception';
import { TableNumberNotFoundException } from '../exceptions/table-number-not-found.exception';
import { TableAlreadyTakenException } from '../exceptions/table-already-taken.exception';
import { TableAlreadyFreeException } from '../exceptions/table-already-free.exception';
import { TablesWithOrderService } from '../../tables-with-order/services/tables-with-order.service';
import {UpdateTableDto} from "../dto/update-table.dto";
import {TableBlockedException} from "../exceptions/table-blocked.exception";

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    private readonly tablesWithOrderService: TablesWithOrderService,
  ) {}

  async findAll(): Promise<TableWithOrderDto[]> {
    const allTables: Table[] = await this.tableModel.find().lean();

    const allTablesWithOrder = allTables.map((table) => (
      this.tablesWithOrderService.tableToTableWithOrder(table)
    ));

    return Promise.all(allTablesWithOrder);
  }

  async findByNumber(tableNumber: number): Promise<TableWithOrderDto> {
    const foundItem = await this.tableModel.findOne({ number: tableNumber }).lean();

    if (foundItem === null) {
      throw new TableNumberNotFoundException(tableNumber);
    }

    return this.tablesWithOrderService.tableToTableWithOrder(foundItem);
  }

  async create(addTableDto: AddTableDto): Promise<TableWithOrderDto> {
    const alreadyExists = await this.tableModel.find({ number: addTableDto.number });
    if (alreadyExists.length > 0) {
      throw new TableAlreadyExistsException(addTableDto.number);
    }
    const newTable: Table = await this.tableModel.create(addTableDto);

    return this.tablesWithOrderService.tableToTableWithOrder(newTable);
  }

  async updateTable(tableNumber: number, updateTableDto: UpdateTableDto): Promise<TableWithOrderDto> {
    const foundItem = await this.tableModel.findOne({ number: tableNumber }).lean();

    if (foundItem === null) {
      throw new TableNumberNotFoundException(tableNumber);
    } else if (foundItem.taken) {
      throw new TableAlreadyTakenException(tableNumber);
    }

    if (updateTableDto.blocked !== undefined) foundItem.blocked = updateTableDto.blocked;
    if (updateTableDto.linkedTable !== undefined) foundItem.linkedTable = updateTableDto.linkedTable;
    if (updateTableDto.taken !== undefined) foundItem.taken = updateTableDto.taken;

    return this.tableModel.findByIdAndUpdate(foundItem._id, foundItem, { returnDocument: 'after' });
  }

  async checkAllTablesAreFree(tables: Table[]): Promise<void> {
    for(const table of tables) {
      if (table.taken) {
        throw new TableAlreadyTakenException(table.number);
      } else if (table.blocked) {
        throw new TableBlockedException(table.number);
      }
    }
  }

  async takeTables(mainTableId: number, linkedTables: number[]): Promise<Table> {
    const tablesToTake: Table[] = [];

    tablesToTake.push(await this.findByNumber(mainTableId));
    for (const number of linkedTables) {
      tablesToTake.push(await this.findByNumber(number));
    }

    await this.checkAllTablesAreFree(tablesToTake);

    // Get the main table
    const mainTable: Table = tablesToTake.shift();

    for (const table of tablesToTake) {
      table.taken = true;
      table.linkedTable = mainTableId;
      console.log(table);
      await this.tableModel.findByIdAndUpdate(table._id, table, { returnDocument: 'after' });
    }

    mainTable.taken = true;

    return this.tableModel.findByIdAndUpdate(mainTable._id, mainTable, { returnDocument: 'after' });
  }

  async releaseTables(mainTableId: number, linkedTables: number[]): Promise<Table> {
    const tablesToRelease: Table[] = [];

    console.log(linkedTables);

    tablesToRelease.push(await this.findByNumber(mainTableId));
    for (const number of linkedTables) {
      tablesToRelease.push(await this.findByNumber(number));
    }

    await this.checkAllTablesAreTaken(tablesToRelease);

    // Get the main table
    const mainTable: Table = tablesToRelease.shift();

    for (const table of tablesToRelease) {
      table.taken = false;
      table.linkedTable = null;
      console.log(table);
      await this.tableModel.findByIdAndUpdate(table._id, table, { returnDocument: 'after' });
    }

    mainTable.taken = false;

    return this.tableModel.findByIdAndUpdate(mainTable._id, mainTable, { returnDocument: 'after' });
  }

  async checkAllTablesAreTaken(tables: Table[]): Promise<void> {
    for (const table of tables) {
      if (!table.taken) {
        throw new TableAlreadyFreeException(table.number);
      }
    }
  }
}
