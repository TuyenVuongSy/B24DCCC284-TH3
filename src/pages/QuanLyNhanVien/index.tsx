import React, { useEffect } from 'react';
import { Button, Card, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import FormNhanVien from './Form';
import type { IColumn } from '@/components/Table/typing';

const QuanLyNhanVien = () => {
  const { danhSach, loading, fetchDanhSach, remove, setVisible, setIsEdit, setRecord, visible } = useModel('quanlydatlich.nhanvien');

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const columns: IColumn<QuanLyDatLich.NhanVien>[] = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
      width: 200,
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'chuyenMon',
      key: 'chuyenMon',
      width: 200,
    },
    {
      title: 'Giới hạn khách (ngày)',
      dataIndex: 'gioiHanKhachMoiNgay',
      key: 'gioiHanKhachMoiNgay',
      align: 'center',
      width: 150,
    },
    {
      title: 'Giờ làm việc',
      key: 'gioLamViec',
      width: 200,
      render: (val, record) => (
        <Tag color="blue">{record.lichLamViec?.gioBatDau} - {record.lichLamViec?.gioKetThuc}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      align: 'center',
      width: 120,
      render: (val) => (
        <Tag color={val === 'Hoạt động' ? 'green' : 'red'}>{val || 'Hoạt động'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (val, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setRecord(record);
              setIsEdit(true);
              setVisible(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
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
    <Card
      title="Danh sách Nhân viên"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setRecord(undefined);
            setIsEdit(false);
            setVisible(true);
          }}
        >
          Thêm nhân viên
        </Button>
      }
    >
      <Table
        dataSource={danhSach}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
      />

      {visible && <FormNhanVien />}
    </Card>
  );
};

export default QuanLyNhanVien;
