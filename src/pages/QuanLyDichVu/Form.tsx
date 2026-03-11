import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';
import { useModel } from 'umi';

const FormDichVu = () => {
  const { visible, setVisible, isEdit, record, add, update, loading } = useModel('quanlydatlich.dichvu');
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isEdit && record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
        form.setFieldsValue({
          thoiGianThucHien: 30,
        });
      }
    }
  }, [visible, record, isEdit]);

  const onFinish = async (values: any) => {
    if (isEdit && record?._id) {
      await update(record._id, values);
    } else {
      await add(values);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Cập nhật dịch vụ' : 'Thêm mới dịch vụ'}
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
          label="Tên dịch vụ"
          name="tenDichVu"
          rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Form.Item
          label="Giá tiền (VNĐ)"
          name="giaTien"
          rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item
          label="Thời gian thực hiện (Phút)"
          name="thoiGianThucHien"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian thực hiện!' }]}
        >
          <InputNumber min={5} step={5} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Mô tả chi tiết"
          name="moTa"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormDichVu;
