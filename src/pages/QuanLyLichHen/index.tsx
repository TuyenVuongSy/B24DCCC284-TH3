import React, { useEffect } from 'react';
import { Button, Card, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import FormLichHen from './Form';
import type { IColumn } from '@/components/Table/typing';
import moment from 'moment';

const QuanLyLichHen = () => {
  const { danhSach, loading, fetchDanhSach, remove, update, setVisible, setIsEdit, setRecord, visible } = useModel('quanlydatlich.lichhen');
  const modelNhanVien = useModel('quanlydatlich.nhanvien');
  const modelDichVu = useModel('quanlydatlich.dichvu');

  useEffect(() => {
    fetchDanhSach();
    modelNhanVien.fetchDanhSach();
    modelDichVu.fetchDanhSach();
  }, []);

  const getTenDichVu = (id: string) => modelDichVu.danhSach.find(item => item._id === id)?.tenDichVu || 'Không rõ';
  const getTenNhanVien = (id: string) => modelNhanVien.danhSach.find(item => item._id === id)?.tenNhanVien || 'Không rõ';

  const columns: IColumn<QuanLyDatLich.LichHen>[] = [
    {
      title: 'Khách hàng',
      dataIndex: 'tenKhachHang',
      key: 'tenKhachHang',
      width: 200,
      render: (val, record) => (
        <div>
          <b>{val}</b>
          <div><small>{record.soDienThoai}</small></div>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'idDichVu',
      key: 'idDichVu',
      width: 150,
      render: (val) => getTenDichVu(val),
    },
    {
      title: 'Nhân viên phục vụ',
      dataIndex: 'idNhanVien',
      key: 'idNhanVien',
      width: 150,
      render: (val) => getTenNhanVien(val),
    },
    {
      title: 'Thời gian',
      key: 'thoiGian',
      width: 150,
      render: (val, record) => (
        <div>
          <div>{moment(record.ngayHen).format('DD/MM/YYYY')}</div>
          <Tag color="geekblue">{record.gioBatDau} - {record.gioKetThuc}</Tag>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      align: 'center',
      width: 150,
      render: (val, record) => {
        let color = 'default';
        if (val === 'Chờ duyệt') color = 'warning';
        if (val === 'Xác nhận') color = 'processing';
        if (val === 'Hoàn thành') color = 'success';
        if (val === 'Hủy') color = 'error';

        return (
          <Select
            value={val}
            size="small"
            style={{ width: 120 }}
            onChange={(newStt) => update(record._id!, { trangThai: newStt as any })}
            options={[
              { label: 'Chờ duyệt', value: 'Chờ duyệt' },
              { label: 'Xác nhận', value: 'Xác nhận' },
              { label: 'Hoàn thành', value: 'Hoàn thành' },
              { label: 'Hủy', value: 'Hủy' },
            ]}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (val, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa lịch hẹn này?"
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
      title="Danh sách Lịch hẹn"
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
          Đặt lịch mới
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

      {visible && <FormLichHen />}
    </Card>
  );
};

export default QuanLyLichHen;
