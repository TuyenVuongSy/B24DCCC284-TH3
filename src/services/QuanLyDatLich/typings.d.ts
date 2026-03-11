declare namespace QuanLyDatLich {
  type NhanVien = {
    _id?: string;
    tenNhanVien: string;
    anhDaiDien?: string;
    chuyenMon?: string;
    gioiTieu?: string;
    lichLamViec: {
      ngayTrongTuan: number[]; // 0: CN, 1: T2, ...
      gioBatDau: string; // VD: '08:00'
      gioKetThuc: string; // VD: '17:00'
    };
    gioiHanKhachMoiNgay: number;
    diemDanhGiaTrungBinh?: number;
    soLuotDanhGia?: number;
    trangThai?: 'Hoạt động' | 'Nghỉ phép';
  };

  type DichVu = {
    _id?: string;
    tenDichVu: string;
    giaTien: number;
    thoiGianThucHien: number; // số phút
    moTa?: string;
    hinhAnh?: string;
  };

  type LichHen = {
    _id?: string;
    tenKhachHang: string;
    soDienThoai: string;
    idDichVu: string;
    idNhanVien: string;
    ngayHen: string; // ISO date string: 'YYYY-MM-DD'
    gioBatDau: string; // 'HH:mm'
    gioKetThuc: string; // 'HH:mm'
    trangThai: 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
    ghiChu?: string;
  };

  type DanhGia = {
    _id?: string;
    idLichHen: string;
    idNhanVien: string;
    idDichVu?: string;
    diemSo: number; // 1 - 5 sao
    binhLuan?: string;
    phanHoiCuaNhanVien?: string;
    ngayTao: string;
  };
}
