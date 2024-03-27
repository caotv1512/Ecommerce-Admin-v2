const ROUTES = [{
        name: 'Dashboard',
        icon: 'rectangle-history-circle-user-regular',
        links: [
            { name: 'Số Liệu Thống Kê', path: '/' },
            { name: 'Danh Sách Người Bán', path: '/sellers-list' },
            // { name: 'Sellers Table', path: '/sellers-table' },
            // { name: 'Sellers Grid', path: '/sellers-grid' },
            // { name: 'Seller Profile', path: '/seller-profile' },
            // { name: 'Revenue by Period', path: '/revenue-by-period' },
        ]
    },
    {
        name: 'Sản Phẩm',
        icon: 'boxes-stacked-regular',
        links: [
            { name: 'Sản phẩm hàng đầu', path: '/top-products' },
            { name: 'Danh sách sản phẩm', path: '/products-grid' },
            { name: 'Quản Lý Sản Phẩm', path: '/products-management' },
            // { name: 'Product Editor', path: '/product-editor' },
            { name: 'Banners', path: '/banners' },
        ]
    },
    {
        name: 'Dơn Hàng',
        icon: 'cart-shopping-regular',
        path: '/orders'
    },
    {
        name: 'Số Liệu Thống Kê',
        icon: 'chart-simple-regular',
        path: '/statistics'
    },
    {
        name: 'Đánh Giá',
        icon: 'star-half-stroke-solid',
        path: '/reviews'
    },
    {
        name: 'Khách Hàng',
        icon: 'chart-user-regular',
        path: '/customers'
    },
    {
        name: 'Giao dịch',
        icon: 'money-check-dollar-pen-regular',
        path: '/transactions',
        qty: 279
    },
    {
        name: 'Các Trang',
        icon: 'layer-group-regular',
        links: [
            { name: 'Login', path: '/login' },
            { name: 'Page 404', path: '/404' },
        ]
    },
    {
        name: 'Cài Đặt',
        icon: 'gear-regular',
        links: [
            { name: 'General Settings', path: '/general-settings' },
            { name: 'Connected Apps', path: '/connected-apps' }
        ]
    }
]

export default ROUTES