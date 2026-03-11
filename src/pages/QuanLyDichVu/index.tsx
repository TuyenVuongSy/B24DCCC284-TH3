import React, { useEffect } from 'react';
import { Button, Card, Popconfirm, Space, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import FormDichVu from './Form';
import type { IColumn } from '@/components/Table/typing';

const QuanLyDichVu = () => {
  const { danhSach, loading, fetchDanhSach, remove, setVisible, setIsEdit, setRecord, visible } = useModel('quanlydatlich.dichvu');

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const columns: IColumn<QuanLyDatLich.DichVu>[] = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
      width: 200,
    },
    {
      title: 'Giá tiền (VNĐ)',
      dataIndex: 'giaTien',
      key: 'giaTien',
      width: 150,
      align: 'right',
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Thời gian thực hiện (Phút)',
      dataIndex: 'thoiGianThucHien',
      key: 'thoiGianThucHien',
      width: 150,
      align: 'center',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      width: 300,
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
            title="Bạn có chắc chắn muốn xóa dịch vụ này?"
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
      title="Danh sách Dịch vụ"
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
          Thêm dịch vụ
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

      {visible && <FormDichVu />}
    </Card>
  );
};

export default QuanLyDichVu;
