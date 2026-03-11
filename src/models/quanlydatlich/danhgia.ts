import { useState } from 'react';
import * as datLichService from '@/services/QuanLyDatLich/datlich';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyDatLich.DanhGia[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [record, setRecord] = useState<QuanLyDatLich.DanhGia | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<any>({});
  const [filters, setFilters] = useState<any[]>([]);
  const [sort, setSort] = useState<any>({});
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await datLichService.getDanhGias();
      setDanhSach(res);
    } catch (error) {
      console.error(error);
      message.error('Lấy danh sách lỗi');
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<QuanLyDatLich.DanhGia, '_id' | 'ngayTao'>) => {
    setLoading(true);
    try {
      await datLichService.addDanhGia(data);
      message.success('Thêm thành công');
      setVisibleForm(false);
      fetchDanhSach();
    } catch (error) {
      message.error('Thêm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<QuanLyDatLich.DanhGia>) => {
    setLoading(true);
    try {
      await datLichService.updateDanhGia(id, data);
      message.success('Cập nhật thành công');
      setVisibleForm(false);
      fetchDanhSach();
    } catch (error) {
      message.error('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await datLichService.deleteDanhGia(id);
      message.success('Xóa thành công');
      fetchDanhSach();
    } catch (error) {
      message.error('Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  return {
    danhSach,
    loading,
    fetchDanhSach,
    getModel: fetchDanhSach,
    add,
    update,
    remove,
    visibleForm,
    setVisibleForm,
    isEdit,
    setIsEdit,
    setEdit: setIsEdit,
    isView,
    setIsView,
    record,
    setRecord,
    page,
    setPage,
    limit,
    setLimit,
    total,
    setTotal,
    condition,
    setCondition,
    filters,
    setFilters,
    sort,
    setSort,
    selectedIds,
    setSelectedIds,
  };
};
