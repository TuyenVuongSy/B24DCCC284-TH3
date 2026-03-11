export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	// DANH MUC HE THONG
	{
		name: 'Quản lý Đặt Lịch',
		path: '/quan-ly-dat-lich',
		icon: 'CalendarOutlined',
		routes: [
			{
				name: 'Dịch Vụ',
				path: 'dich-vu',
				component: './QuanLyDichVu',
			},
			{
				name: 'Nhân Viên',
				path: 'nhan-vien',
				component: './QuanLyNhanVien',
			},
			{
				name: 'Lịch Hẹn',
				path: 'lich-hen',
				component: './QuanLyLichHen',
			},
			{
				name: 'Đánh Giá',
				path: 'danh-gia',
				component: './QuanLyDanhGia',
			},
			{
				name: 'Thống Kê',
				path: 'thong-ke',
				component: './ThongKeBaoCao',
			},
		],
	},

	///////////////////////////////////
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
