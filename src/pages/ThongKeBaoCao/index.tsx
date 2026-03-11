import React, { useEffect, useMemo } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { useModel } from 'umi';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

const ThongKeBaoCao = () => {
  const modelLichHen = useModel('quanlydatlich.lichhen');
  const modelDichVu = useModel('quanlydatlich.dichvu');
  const modelNhanVien = useModel('quanlydatlich.nhanvien');

  useEffect(() => {
    modelLichHen.fetchDanhSach();
    modelDichVu.fetchDanhSach();
    modelNhanVien.fetchDanhSach();
  }, []);

  const dLichHen = modelLichHen.danhSach;
  const dDichVu = modelDichVu.danhSach;
  const dNhanVien = modelNhanVien.danhSach;

  // Tính thống kê tổng quát
  const tongLichHen = dLichHen.length;
  const lichMoi = dLichHen.filter(lh => lh.trangThai === 'Chờ duyệt').length;
  const doanhThuDuKien = dLichHen.reduce((acc, lh) => {
    if (lh.trangThai !== 'Hủy') {
      const dv = dDichVu.find(d => d._id === lh.idDichVu);
      return acc + (dv?.giaTien || 0);
    }
    return acc;
  }, 0);
  const doanhThuThucTe = dLichHen.reduce((acc, lh) => {
    if (lh.trangThai === 'Hoàn thành') {
      const dv = dDichVu.find(d => d._id === lh.idDichVu);
      return acc + (dv?.giaTien || 0);
    }
    return acc;
  }, 0);

  // Group by Date for Chart 1: Số lượng lịch hẹn 7 ngày qua
  const last7Days = Array.from({ length: 7 }, (_, i) => moment().subtract(6 - i, 'days').format('YYYY-MM-DD'));
  const dataLichTheoNgay = last7Days.map(day => {
    return dLichHen.filter(lh => lh.ngayHen === day).length;
  });

  const chartOptionsLichHen: any = {
    chart: { type: 'line', zoom: { enabled: false }, toolbar: { show: false } },
    dataLabels: { enabled: true },
    stroke: { curve: 'smooth' },
    title: { text: 'Số lượng lịch hẹn (7 ngày qua)', align: 'left' },
    xaxis: {
      categories: last7Days.map(d => moment(d).format('DD/MM')),
    },
  };
  const seriesLichHen = [{ name: 'Lịch hẹn', data: dataLichTheoNgay }];

  // Group by NhanVien for Chart 2: Doanh thu theo Nhân Viên
  const dataDoanhThuNV = dNhanVien.map(nv => {
    const listLH = dLichHen.filter(lh => lh.idNhanVien === nv._id && lh.trangThai === 'Hoàn thành');
    const dt = listLH.reduce((acc, lh) => {
      const dv = dDichVu.find(d => d._id === lh.idDichVu);
      return acc + (dv?.giaTien || 0);
    }, 0);
    return dt;
  });

  const chartOptionsDoanhThuNV: any = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    dataLabels: { enabled: false },
    title: { text: 'Doanh thu theo Nhân Viên (Chỉ tính Đã Hoàn Thành)', align: 'left' },
    xaxis: { categories: dNhanVien.map(nv => nv.tenNhanVien) },
    yaxis: { labels: { formatter: (val: number) => new Intl.NumberFormat('vi-VN').format(val) + 'đ' } },
    colors: ['#00E396'],
  };
  const seriesDoanhThuNV = [{ name: 'Doanh thu (VNĐ)', data: dataDoanhThuNV }];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng Số Lịch Hẹn" value={tongLichHen} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lịch Mới (Chờ Duyệt)" value={lichMoi} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Doanh Thu Dự Kiến" 
              value={doanhThuDuKien} 
              prefix="₫" 
              groupSeparator="." 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Doanh Thu Thực Tế (Hoàn Thành)" 
              value={doanhThuThucTe} 
              valueStyle={{ color: '#52c41a' }} 
              prefix="₫" 
              groupSeparator="." 
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <ReactApexChart options={chartOptionsLichHen} series={seriesLichHen} type="line" height={350} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactApexChart options={chartOptionsDoanhThuNV} series={seriesDoanhThuNV} type="bar" height={350} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThongKeBaoCao;
