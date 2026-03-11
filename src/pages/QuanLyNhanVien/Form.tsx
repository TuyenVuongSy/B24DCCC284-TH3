import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, TimePicker, Button } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const FormNhanVien = () => {
  const { visible, setVisible, isEdit, record, add, update, loading } = useModel('quanlydatlich.nhanvien');
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isEdit && record) {
        form.setFieldsValue({
          ...record,
          gioBatDau: moment(record.lichLamViec?.gioBatDau || '08:00', 'HH:mm'),
          gioKetThuc: moment(record.lichLamViec?.gioKetThuc || '17:00', 'HH:mm'),
          ngayTrongTuan: record.lichLamViec?.ngayTrongTuan || [1, 2, 3, 4, 5],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          trangThai: 'Hoạt động',
          gioiHanKhachMoiNgay: 10,
          gioBatDau: moment('08:00', 'HH:mm'),
          gioKetThuc: moment('17:00', 'HH:mm'),
          ngayTrongTuan: [1, 2, 3, 4, 5],
        });
      }
    }
  }, [visible, record, isEdit]);

  const onFinish = async (values: any) => {
    const submitData: any = {
      tenNhanVien: values.tenNhanVien,
      chuyenMon: values.chuyenMon,
      gioiHanKhachMoiNgay: values.gioiHanKhachMoiNgay,
      trangThai: values.trangThai || 'Hoạt động',
      lichLamViec: {
        ngayTrongTuan: values.ngayTrongTuan,
        gioBatDau: values.gioBatDau.format('HH:mm'),
        gioKetThuc: values.gioKetThuc.format('HH:mm'),
      },
    };
    if (isEdit && record?._id) {
      await update(record._id, submitData);
    } else {
      await add(submitData);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
      visible={visible}
      destroyOnClose
      confirmLoading={loading}
      onOk={() => form.submit()}
      onCancel={() => setVisible(false)}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Tên nhân viên"
          name="tenNhanVien"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
        >
          <Input placeholder="Nhập tên nhân viên" />
        </Form.Item>
        <Form.Item
          label="Chuyên môn"
          name="chuyenMon"
        >
          <Input placeholder="VD: Thợ cắt tóc, Chuyên viên Spa..." />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="gioBatDau"
            label="Giờ bắt đầu"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="gioKetThuc"
            label="Giờ kết thúc"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 16px' }}
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="Ngày làm việc trong tuần"
          name="ngayTrongTuan"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn ngày làm việc"
            options={[
              { label: 'Thứ 2', value: 1 },
              { label: 'Thứ 3', value: 2 },
              { label: 'Thứ 4', value: 3 },
              { label: 'Thứ 5', value: 4 },
              { label: 'Thứ 6', value: 5 },
              { label: 'Thứ 7', value: 6 },
              { label: 'Chủ nhật', value: 0 },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Giới hạn khách / ngày"
          name="gioiHanKhachMoiNgay"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="trangThai"
        >
          <Select
            options={[
              { label: 'Hoạt động', value: 'Hoạt động' },
              { label: 'Nghỉ phép', value: 'Nghỉ phép' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormNhanVien;
