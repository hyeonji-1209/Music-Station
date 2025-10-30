import React from 'react';
import Tabs, { TabItem } from '../ui/Tabs';
import Table, { TableColumn } from '../ui/Table';

interface AdminPageLayoutProps<T = any> {
  // Tabs 관련
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  rightActions?: React.ReactNode;

  // Table 관련
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;

  // Select 관련
  showSelectAll?: boolean;
  selectedItems?: Set<any> | string[];
  onSelectAll?: (checked: boolean) => void;

  // 추가 컨텐츠
  children?: React.ReactNode;
}

function AdminPageLayout<T = any>({
  tabs,
  activeTab,
  onTabChange,
  rightActions,
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage,
  showSelectAll = false,
  selectedItems,
  onSelectAll,
  children,
}: AdminPageLayoutProps<T>) {
  // selectedItems를 배열로 변환
  const selectedArray = selectedItems instanceof Set
    ? Array.from(selectedItems)
    : (selectedItems || []);

  const isAllSelected = showSelectAll &&
    selectedArray.length > 0 &&
    data.length > 0 &&
    selectedArray.length === data.length;

  return (
    <>
      <div className="admin-page__tabs">
        <Tabs
          items={tabs}
          activeTab={activeTab}
          onChange={onTabChange}
          rightActions={rightActions}
        />
      </div>

      <div className="admin-page__table">
        <Table
          columns={columns}
          data={data}
          keyExtractor={keyExtractor}
          onRowClick={onRowClick}
          emptyMessage={emptyMessage}
          showSelectAll={showSelectAll}
          isAllSelected={isAllSelected}
          onSelectAll={onSelectAll}
        />
      </div>

      {children}
    </>
  );
}

export default AdminPageLayout;
