/**
 * DataTable Service - Управление локальными пользовательскими таблицами данных
 * Позволяет создавать динамические структуры данных внутри проектов
 */

import prisma from '../utils/prisma';

export class DataTableService {
  /**
   * Создание новой таблицы
   */
  static async createTable(projectId: string, name: string, schema: any) {
    return await prisma.dataTable.create({
      data: {
        projectId,
        name,
        schema: JSON.stringify(schema)
      }
    });
  }

  /**
   * Добавление строки в таблицу
   */
  static async insertRow(tableId: string, data: any) {
    const table = await prisma.dataTable.findUnique({ where: { id: tableId } });
    if (!table) throw new Error('Table not found');

    return await prisma.dataRow.create({
      data: {
        tableId,
        data: JSON.stringify(data)
      }
    });
  }

  /**
   * Получение данных таблицы
   */
  static async getTableData(tableId: string) {
    const rows = await prisma.dataRow.findMany({
      where: { tableId },
      orderBy: { createdAt: 'desc' }
    });

    return rows.map(row => ({
      ...row,
      data: row.data ? JSON.parse(row.data) : null
    }));
  }

  /**
   * Удаление таблицы
   */
  static async deleteTable(tableId: string) {
    return await prisma.dataTable.delete({
      where: { id: tableId }
    });
  }
}
