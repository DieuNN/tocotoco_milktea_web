import {isAdminLogin} from "./Admin";
import {
    addProductCategory,
    deleteProductCategory,
    editProductCategory,
    getProductCategories,
    getProductCategory
} from "./ProductCategory";
import {createDiscount, getDiscounts, deleteDiscount, updateDiscount, getDiscount} from "./Discount";
import {
    createUser,
    getUsers,
    getUser,
    updateUserAddress,
    deleteUser,
    updateUser,
    getUserLoginInfo,
} from "./User";

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
