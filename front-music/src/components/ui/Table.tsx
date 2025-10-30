import React from 'react';
import Checkbox from './Checkbox';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
  onSelectAll?: (checked: boolean) => void;
  isAllSelected?: boolean;
  showSelectAll?: boolean;
}

function Table<T = any>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = '데이터가 없습니다.',
  className = '',
  onSelectAll,
  isAllSelected = false,
  showSelectAll = false,
}: TableProps<T>) {
  const shouldIgnoreRowClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return false;
    // Ignore clicks originating from interactive elements
    return Boolean(
      target.closest('input, button, a, label, select, textarea, [data-row-click-ignore]')
    );
  };
  const getKey = (row: T, index: number): string | number => {
    if (keyExtractor) {
      try {
        return keyExtractor(row, index);
      } catch (error) {
        console.warn('Error in keyExtractor:', error);
        return index;
      }
    }
    return index;
  };

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="table">
        <thead className="table__header">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className="table__header-cell"
                style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
              >
                {showSelectAll && index === 0 && onSelectAll ? (
                  <Checkbox
                    checked={isAllSelected}
                    onChange={onSelectAll}
                  />
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {!data || data.length === 0 ? (
            <tr>
              <td
                className="table__empty"
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              if (!row) {
                console.warn(`Row at index ${rowIndex} is undefined`);
                return null;
              }
              return (
                <tr
                  key={getKey(row, rowIndex)}
                  className={`table__row ${onRowClick ? 'table__row--clickable' : ''}`}
                  onClick={(event) => {
                    if (shouldIgnoreRowClick(event)) return;
                    onRowClick?.(row, rowIndex);
                  }}
                >
                  {columns.map((column) => {
                    const value = (row as any)[column.key];
                    const content = column.render
                      ? column.render(row, rowIndex)
                      : value ?? '';

                    return (
                      <td
                        key={column.key}
                        className="table__cell"
                        style={{
                          textAlign: column.align || 'left',
                        }}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            }).filter(Boolean)
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

