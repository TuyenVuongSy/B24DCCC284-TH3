import { useState } from 'react';
import * as datLichService from '@/services/QuanLyDatLich/datlich';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyDatLich.LichHen[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [record, setRecord] = useState<QuanLyDatLich.LichHen | undefined>(undefined);

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const res = await datLichService.getLichHens();
      setDanhSach(res);
    } catch (error) {
      console.error(error);
      message.error('Lấy danh sách lỗi');
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<QuanLyDatLich.LichHen, '_id'>) => {
    setLoading(true);
    try {
      await datLichService.addLichHen(data);
      message.success('Thêm thành công');
      setVisible(false);
      fetchDanhSach();
    } catch (error) {
      message.error('Thêm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<QuanLyDatLich.LichHen>) => {
    setLoading(true);
    try {
      await datLichService.updateLichHen(id, data);
      message.success('Cập nhật trạng thái thành công');
      if (visible) setVisible(false);
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
      await datLichService.deleteLichHen(id);
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
