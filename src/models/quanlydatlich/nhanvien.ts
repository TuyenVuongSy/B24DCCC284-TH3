import { useState, useEffect } from 'react';
import * as datLichService from '@/services/QuanLyDatLich/datlich';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyDatLich.NhanVien[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState<QuanLyDatLich.NhanVien | undefined>(undefined);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await datLichService.getNhanViens();
      setDanhSach(res);
    } catch (error) {
      console.error(error);
      message.error('Lấy danh sách lỗi');
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<QuanLyDatLich.NhanVien, '_id'>) => {
    setLoading(true);
    try {
      await datLichService.addNhanVien(data);
      message.success('Thêm thành công');
      setVisible(false);
      fetchDanhSach();
    } catch (error) {
      message.error('Thêm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<QuanLyDatLich.NhanVien>) => {
    setLoading(true);
    try {
      await datLichService.updateNhanVien(id, data);
      message.success('Cập nhật thành công');
      setVisible(false);
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
      await datLichService.deleteNhanVien(id);
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
    add,
    update,
    remove,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    record,
    setRecord,
  };
};
