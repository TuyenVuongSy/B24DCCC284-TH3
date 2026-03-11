import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, message } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const FormLichHen = () => {
  const { visible, setVisible, isEdit, record, add, update, loading, danhSach } = useModel('quanlydatlich.lichhen');
  const modelNhanVien = useModel('quanlydatlich.nhanvien');
  const modelDichVu = useModel('quanlydatlich.dichvu');
  const [form] = Form.useForm();

  // Watch fields
  const idDichVu = Form.useWatch('idDichVu', form);
  const idNhanVien = Form.useWatch('idNhanVien', form);
  const ngayHen = Form.useWatch('ngayHen', form);
  const gioBatDau = Form.useWatch('gioBatDau', form);

  const selectedDichVu = useMemo(() => modelDichVu.danhSach.find(d => d._id === idDichVu), [idDichVu, modelDichVu.danhSach]);
  const selectedNhanVien = useMemo(() => modelNhanVien.danhSach.find(n => n._id === idNhanVien), [idNhanVien, modelNhanVien.danhSach]);

  useEffect(() => {
    if (visible) {
      if (isEdit && record) {
        form.setFieldsValue({
          ...record,
          ngayHen: moment(record.ngayHen),
          gioBatDau: moment(record.gioBatDau, 'HH:mm'),
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, record, isEdit]);

  // Handle conflict checking
  const checkConflict = (ngay: string, startTs: number, endTs: number, nhanVienId: string) => {
    // TÌm các lịch hẹn của nhân viên này trong ngày hôm đó (trừ lịch đang sửa nếu có)
    const cacLichHomDo = danhSach.filter(lh => 
      lh.idNhanVien === nhanVienId && 
      lh.ngayHen === ngay && 
      lh.trangThai !== 'Hủy' &&
      (!isEdit || lh._id !== record?._id)
    );

    for (const lh of cacLichHomDo) {
      const eStartTs = moment(lh.gioBatDau, 'HH:mm').valueOf();
      const eEndTs = moment(lh.gioKetThuc, 'HH:mm').valueOf();

      // Nêu thời gian mới đè lên thời gian của lịch cũ
      // s1 < e2 && e1 > s2
      if (startTs < eEndTs && endTs > eStartTs) {
        return true; // Conflict
      }
    }
    return false;
  };

  const onFinish = async (values: any) => {
    if (!selectedDichVu) return message.error('Vui lòng chọn dịch vụ');
    if (!selectedNhanVien) return message.error('Vui lòng chọn nhân viên');

    const strNgayHen = values.ngayHen.format('YYYY-MM-DD');
    const startStr = values.gioBatDau.format('HH:mm');
    // Calculate End Time
    const mStart = moment(startStr, 'HH:mm');
    const mEnd = moment(mStart).add(selectedDichVu.thoiGianThucHien, 'minutes');
    const endStr = mEnd.format('HH:mm');

    const startTs = mStart.valueOf();
    const endTs = mEnd.valueOf();

    // Check giờ làm việc
    const nvStartTs = moment(selectedNhanVien.lichLamViec.gioBatDau, 'HH:mm').valueOf();
    const nvEndTs = moment(selectedNhanVien.lichLamViec.gioKetThuc, 'HH:mm').valueOf();
    if (startTs < nvStartTs || endTs > nvEndTs) {
      return message.error('Thời gian nằm ngoài giờ làm việc của nhân viên này (' + selectedNhanVien.lichLamViec.gioBatDau + ' - ' + selectedNhanVien.lichLamViec.gioKetThuc + ')');
    }

    // Check giới hạn khách trong ngày
    const cacLichHomDo = danhSach.filter(lh => lh.idNhanVien === values.idNhanVien && lh.ngayHen === strNgayHen && lh.trangThai !== 'Hủy' && (!isEdit || lh._id !== record?._id));
    if (cacLichHomDo.length >= selectedNhanVien.gioiHanKhachMoiNgay) {
      return message.error('Nhân viên này đã quá tải số lượng khách trong ngày này (' + selectedNhanVien.gioiHanKhachMoiNgay + ')');
    }

    // Check Conflict giờ
    const isConflict = checkConflict(strNgayHen, startTs, endTs, values.idNhanVien);
    if (isConflict) {
      return message.error('Lịch đã bị trùng! Nhân viên đã có khách trong khung giờ này.');
    }

    const submitData: any = {
      tenKhachHang: values.tenKhachHang,
      soDienThoai: values.soDienThoai,
      idDichVu: values.idDichVu,
      idNhanVien: values.idNhanVien,
      ngayHen: strNgayHen,
      gioBatDau: startStr,
      gioKetThuc: endStr,
      ghiChu: values.ghiChu,
    };

    if (isEdit && record?._id) {
      await update(record._id, submitData);
    } else {
      await add(submitData);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Cập nhật lịch hẹn' : 'Thêm mới lịch hẹn'}
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
          label="Tên khách hàng"
          name="tenKhachHang"
          rules={[{ required: true, message: 'Nhập tên KH!' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="soDienThoai"
          rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
        >
          <Input placeholder="09xxxx..." />
        </Form.Item>

        <Form.Item
          label="Dịch vụ"
          name="idDichVu"
          rules={[{ required: true, message: 'Chọn dịch vụ!' }]}
        >
          <Select 
            placeholder="Chọn 1 dịch vụ"
            options={modelDichVu.danhSach.map(item => ({ label: item.tenDichVu + ` (${item.thoiGianThucHien} phút - ${item.giaTien.toLocaleString('vi-VN')}đ)`, value: item._id! }))}
          />
        </Form.Item>

        <Form.Item
          label="Nhân viên"
          name="idNhanVien"
          rules={[{ required: true, message: 'Chọn nhân viên!' }]}
        >
          <Select 
            placeholder="Chọn nhân viên"
            options={modelNhanVien.danhSach.filter(nv => nv.trangThai !== 'Nghỉ phép').map(item => ({ label: item.tenNhanVien, value: item._id! }))}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="ngayHen"
            label="Ngày hẹn"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            rules={[{ required: true, message: 'Chọn ngày!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="gioBatDau"
            label="Giờ hẹn"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 16px' }}
            rules={[{ required: true, message: 'Chọn giờ!' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form.Item>
        
        {selectedDichVu && gioBatDau && (
          <div style={{ marginBottom: 20, color: 'green' }}>
            Dự kiến hoàn thành lúc: {moment(gioBatDau).add(selectedDichVu.thoiGianThucHien, 'minutes').format('HH:mm')}
          </div>
        )}

        <Form.Item
          label="Ghi chú thêm"
          name="ghiChu"
        >
          <Input.TextArea rows={2} placeholder="Nhập ghi chú..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormLichHen;
