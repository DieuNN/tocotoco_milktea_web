declare type Admin = {
    id: number,
    username: string,
    password: string,
    createAt: string,
    modifiedAt: string,
    updateAt: string
}

declare type ProductCategory = {
    id: number | null,
    name: string,
    description: string,
    displayImage: string,
    createAt: string | null,
    modifiedAt: string | null
}

declare type Product = {
    id: number | null,
    name: string,
    description: string,
    categoryId: number,
    quantity: number,
    price: number,
    discountId: number | null,
    displayImage: string,
    size: string
}

declare type Discount = {
    id: number | null,
    name: string,
    description: string,
    discountPercent: number,
    active: boolean,
    createAt: string,
    modifiedAt: string,
    displayImage: string
}

declare type User = {
    id: number | null,
    username: string,
    email: string,
    password: string | null,
    name: string,
    phoneNumber: string,
    createAt: string | null,
    modifiedAt: string | null
}


declare type UserAddress = {
    id: number | null,
    userId: number | null,
    address: string,
    phoneNumber: string
}

declare type CartItem = {
    id: number | null,              // Mã sản phẩm trong giỏ hàng tạm
    sessionId : null | number,      // Mã giỏ hàng tạm
    productId : number | null,      // Mã sản phẩm
    quantity : number,              // Số lượng sản phẩm trong giỏ hàng
    productName : string,           // Tên sản phẩm
    productDescription : string,    // Mô tả sản phẩm
    totalPrice : number,            // Tổng giá trị của sản phẩm (số lượng * giá)
    price: number ,                 // Giá của 1 sản phẩm
    productCategoryName : string    // Tên loại sản phẩm
}

declare type APIResponse = {
    isSuccess: boolean
    result: null | any,
    errorMessage: null | any
}




