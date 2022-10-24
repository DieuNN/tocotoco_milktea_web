import {isAdminLogin} from "./Admin";
import {
    addProductCategory,
    deleteProductCategory,
    editProductCategory,
    getProductCategories,
    getProductCategory
} from "./ProductCategory";
import {createDiscount, deleteDiscount, getDiscount, getDiscounts, updateDiscount} from "./Discount";
import {createUser, deleteUser, getUser, getUserLoginInfo, getUsers, updateUser, updateUserAddress} from "./User";

export {
    isAdminLogin,
    addProductCategory,
    getProductCategories,
    editProductCategory,
    deleteProductCategory,
    createDiscount,
    getDiscounts, deleteDiscount,
    updateDiscount,
    getProductCategory,
    getDiscount,
    createUser, getUsers, getUser, deleteUser, updateUserAddress, updateUser, getUserLoginInfo
}

export function createException(e: any): APIResponse {
    return {
        isSuccess: false,
        errorMessage: "Lỗi server: " + e,
        result: null
    }
}

export function createResult(result: any): APIResponse {
    return {
        isSuccess: true,
        errorMessage: null,
        result: result
    }
}
