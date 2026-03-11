import { message } from 'antd';

const DELAY = 500;

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get from LocalStorage
const getStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultValue;
    }
  }
  return defaultValue;
};

// Helper to set to LocalStorage
const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Generate random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// =============== NHAN VIEN ===============
export const getNhanViens = async () => {
  await delay(DELAY);
  return getStorage<QuanLyDatLich.NhanVien[]>('nhanViens', []);
};

export const addNhanVien = async (data: Omit<QuanLyDatLich.NhanVien, '_id'>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.NhanVien[]>('nhanViens', []);
  const newItem = { ...data, _id: generateId() };
  list.push(newItem);
  setStorage('nhanViens', list);
  return newItem;
};

export const updateNhanVien = async (id: string, data: Partial<QuanLyDatLich.NhanVien>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.NhanVien[]>('nhanViens', []);
  const index = list.findIndex(item => item._id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    setStorage('nhanViens', list);
    return list[index];
  }
  throw new Error('Not found');
};

export const deleteNhanVien = async (id: string) => {
  await delay(DELAY);
  let list = getStorage<QuanLyDatLich.NhanVien[]>('nhanViens', []);
  list = list.filter(item => item._id !== id);
  setStorage('nhanViens', list);
  return true;
};

// =============== DICH VU ===============
export const getDichVus = async () => {
  await delay(DELAY);
  return getStorage<QuanLyDatLich.DichVu[]>('dichVus', []);
};

export const addDichVu = async (data: Omit<QuanLyDatLich.DichVu, '_id'>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.DichVu[]>('dichVus', []);
  const newItem = { ...data, _id: generateId() };
  list.push(newItem);
  setStorage('dichVus', list);
  return newItem;
};

export const updateDichVu = async (id: string, data: Partial<QuanLyDatLich.DichVu>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.DichVu[]>('dichVus', []);
  const index = list.findIndex(item => item._id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    setStorage('dichVus', list);
    return list[index];
  }
  throw new Error('Not found');
};

export const deleteDichVu = async (id: string) => {
  await delay(DELAY);
  let list = getStorage<QuanLyDatLich.DichVu[]>('dichVus', []);
  list = list.filter(item => item._id !== id);
  setStorage('dichVus', list);
  return true;
};

// =============== LICH HEN ===============
export const getLichHens = async () => {
  await delay(DELAY);
  return getStorage<QuanLyDatLich.LichHen[]>('lichHens', []);
};

export const addLichHen = async (data: Omit<QuanLyDatLich.LichHen, '_id'>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.LichHen[]>('lichHens', []);
  const newItem = { ...data, _id: generateId(), trangThai: 'Chờ duyệt' as const };
  list.push(newItem);
  setStorage('lichHens', list);
  return newItem;
};

export const updateLichHen = async (id: string, data: Partial<QuanLyDatLich.LichHen>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.LichHen[]>('lichHens', []);
  const index = list.findIndex(item => item._id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    setStorage('lichHens', list);
    return list[index];
  }
  throw new Error('Not found');
};

export const deleteLichHen = async (id: string) => {
  await delay(DELAY);
  let list = getStorage<QuanLyDatLich.LichHen[]>('lichHens', []);
  list = list.filter(item => item._id !== id);
  setStorage('lichHens', list);
  return true;
};

// =============== DANH GIA ===============
export const getDanhGias = async () => {
  await delay(DELAY);
  return getStorage<QuanLyDatLich.DanhGia[]>('danhGias', []);
};

export const addDanhGia = async (data: Omit<QuanLyDatLich.DanhGia, '_id' | 'ngayTao'>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.DanhGia[]>('danhGias', []);
  const newItem = { ...data, _id: generateId(), ngayTao: new Date().toISOString() };
  list.push(newItem);
  setStorage('danhGias', list);
  return newItem;
};

export const updateDanhGia = async (id: string, data: Partial<QuanLyDatLich.DanhGia>) => {
  await delay(DELAY);
  const list = getStorage<QuanLyDatLich.DanhGia[]>('danhGias', []);
  const index = list.findIndex(item => item._id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    setStorage('danhGias', list);
    return list[index];
  }
  throw new Error('Not found');
};

export const deleteDanhGia = async (id: string) => {
  await delay(DELAY);
  let list = getStorage<QuanLyDatLich.DanhGia[]>('danhGias', []);
  list = list.filter(item => item._id !== id);
  setStorage('danhGias', list);
  return true;
};
