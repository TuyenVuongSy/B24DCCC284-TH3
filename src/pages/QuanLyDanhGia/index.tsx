import React, { useEffect } from 'react';
import { Button, Popconfirm, Space, Rate } from 'antd';
import { PlusOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Table from '@/components/Table';
import FormDanhGia from './Form';
import type { IColumn } from '@/components/Table/typing';
import moment from 'moment';

const QuanLyDanhGia = () => {
  const { remove, setVisibleForm, setIsEdit, setRecord } = useModel('quanlydatlich.danhgia');
  const modelNhanVien = useModel('quanlydatlich.nhanvien');
  const modelLichHen = useModel('quanlydatlich.lichhen');

  useEffect(() => {
    modelNhanVien.fetchDanhSach();
    modelLichHen.fetchDanhSach();
  }, []);

  const getTenKhachHang = (idLich: string) => modelLichHen.danhSach.find(item => item._id === idLich)?.tenKhachHang || 'Không rõ';
  const getTenNhanVien = (idNV: string) => modelNhanVien.danhSach.find(item => item._id === idNV)?.tenNhanVien || 'Không rõ';

  const columns: IColumn<QuanLyDatLich.DanhGia>[] = [
    {
      title: 'Khách hàng',
      dataIndex: 'idLichHen',
      key: 'khachHang',
      width: 150,
      render: (val, record) => getTenKhachHang(record.idLichHen),
    },
    {
      title: 'Nhân viên nhận ĐG',
      dataIndex: 'idNhanVien',
      key: 'nhanVien',
      width: 150,
      render: (val, record) => getTenNhanVien(record.idNhanVien),
    },
    {
      title: 'Điểm số',
      dataIndex: 'diemSo',
      key: 'diemSo',
      align: 'center',
      width: 120,
      render: (val) => <Rate disabled defaultValue={val} />,
    },
    {
      title: 'Bình luận',
      dataIndex: 'binhLuan',
      key: 'binhLuan',
      width: 200,
    },
    {
      title: 'Phản hồi của Nhân viên',
      dataIndex: 'phanHoiCuaNhanVien',
      key: 'phanHoiCuaNhanVien',
      width: 250,
      render: (val) => val ? <em>"{val}"</em> : <span style={{ color: '#aaa' }}>Chưa phản hồi</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 150,
      render: (val) => moment(val).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (val, record) => (
        <Space>
          <Button
            type="primary"
            icon={<MessageOutlined />}
            size="small"
            title="Sửa / Phản hồi"
            onClick={() => {
              setRecord(record);
              setIsEdit(true);
              setVisibleForm(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => remove(record._id!)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table 
        modelName="quanlydatlich.danhgia"
        title="Quản lý Đánh giá & Phản hồi"
        columns={columns}
        Form={FormDanhGia}
        buttons={{
          create: false,
        }}
        otherButtons={[
          <Button 
            key="btn-mock"
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setRecord(undefined);
              setIsEdit(false);
              setVisibleForm(true);
            }}
          >
            Tạo đánh giá giả lập
          </Button>
        ]}
      />
    </>
  );
};

export default QuanLyDanhGia;

