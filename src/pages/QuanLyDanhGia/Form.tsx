import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Rate, Button, message } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const FormDanhGia = () => {
  const { visibleForm, setVisibleForm, isEdit, record, add, update, loading } = useModel('quanlydatlich.danhgia');
  const modelLichHen = useModel('quanlydatlich.lichhen');
  const modelNhanVien = useModel('quanlydatlich.nhanvien');
  const [form] = Form.useForm();
  
  // Lọc lấy các lịch hẹn đã Hoàn thành để đánh giá
  const lichHenHoanThanh = modelLichHen.danhSach.filter(item => item.trangThai === 'Hoàn thành');

  useEffect(() => {
    if (visibleForm) {
      if (isEdit && record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
        form.setFieldsValue({
          diemSo: 5,
        });
      }
    }
  }, [visibleForm, record, isEdit]);

  const onFinish = async (values: any) => {
    if (isEdit && record?._id) {
      await update(record._id, { phanHoiCuaNhanVien: values.phanHoiCuaNhanVien });
    } else {
      // Create mode
      const targetLichHen = lichHenHoanThanh.find(item => item._id === values.idLichHen);
      if (!targetLichHen) return;

      const submitData: any = {
        idLichHen: values.idLichHen,
        idNhanVien: targetLichHen.idNhanVien,
        idDichVu: targetLichHen.idDichVu,
        diemSo: values.diemSo,
        binhLuan: values.binhLuan,
      };
      await add(submitData);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Phản hồi đánh giá' : 'Tạo đánh giá mới (Cho Khách)'}
      visible={visibleForm}
      destroyOnClose
      confirmLoading={loading}
      onOk={() => form.submit()}
      onCancel={() => setVisibleForm(false)}
      okText={isEdit ? 'Gửi phản hồi' : 'Tạo đánh giá'}
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {!isEdit ? (
          <>
            <Form.Item
              label="Chọn Lịch hẹn (Đã hoàn thành)"
              name="idLichHen"
              rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn!' }]}
            >
              <Select 
                showSearch
                placeholder="Tìm ngày hoặc tên khách"
                options={lichHenHoanThanh.map(lh => {
                  const nv = modelNhanVien.danhSach.find(n => n._id === lh.idNhanVien);
                  return {
                    label: `${lh.tenKhachHang} - ${moment(lh.ngayHen).format('DD/MM/YYYY')} (NV: ${nv?.tenNhanVien || 'Không rõ'})`,
                    value: lh._id!
                  };
                })}
              />
            </Form.Item>

            <Form.Item
              label="Điểm số đánh giá"
              name="diemSo"
              rules={[{ required: true, message: 'Hãy chọn điểm số' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              label="Bình luận của Khách hàng"
              name="binhLuan"
            >
              <Input.TextArea rows={3} placeholder="Nhập cảm nhận..." />
            </Form.Item>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <strong>Khách đánh giá {record?.diemSo} sao: </strong>
              <span style={{ color: '#666' }}>{record?.binhLuan || '(Không có bình luận)'}</span>
            </div>
            <Form.Item
              label="Phản hồi của Nhân viên / Quản lý"
              name="phanHoiCuaNhanVien"
              rules={[{ required: true, message: 'Hãy nhập nội dung phản hồi!' }]}
            >
              <Input.TextArea rows={3} placeholder="Cảm ơn quý khách..." />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FormDanhGia;
