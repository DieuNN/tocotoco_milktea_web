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

declare type APIResponse = {
    isSuccess: boolean
    result: null | any,
    errorMessage: null | any
}




