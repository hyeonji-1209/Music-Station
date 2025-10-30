import { useState, useCallback } from 'react';

/**
 * 테이블 행 선택 관리 Hook
 */
export const useTableSelection = <T extends { id: string | number }>(
  data: T[] = []
) => {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map(item => item.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  }, [data]);

  const handleSelectOne = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string | number) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const isAllSelected = data.length > 0 && selectedIds.size === data.length;
  const selectedCount = selectedIds.size;
  const hasSelection = selectedIds.size > 0;

  return {
    selectedIds,
    selectedCount,
    hasSelection,
    isAllSelected,
    isSelected,
    handleSelectAll,
    handleSelectOne,
    clearSelection,
    setSelectedIds,
  };
};
