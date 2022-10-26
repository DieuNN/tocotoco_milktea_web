import {isAdminLogin} from "./Admin";
import {
    addProductCategory,
    deleteProductCategory,
    editProductCategory,
    getProductCategories,
    getProductCategory
} from "./ProductCategory";
import {
    createDiscount,
    deleteDiscount,
    getDiscount,
    getDiscounts,
    updateDiscount
} from "./Discount";
import {
    createUser,
    deleteUser,
    getUser,
    getUserLoginInfo,
    getUsers,
    updateUserInfo,
    updateUserAddress,
    updateUserPassword,
    getUserId,
    updateUserMomoPayment,
    addUserMomoPayment

} from "./User";
import {
    addProduct, getProducts, getProduct, updateProduct
} from "./Product";
import {createShoppingSession, deleteShoppingSession} from "./ShoppingSession";
import {addItemToCart, removeItemFromCart} from "./CartItem";

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
    createUser, getUsers, getUser, deleteUser, updateUserAddress, updateUserInfo, getUserLoginInfo,
    addProduct, updateProduct, getProduct, getProducts,
    updateUserPassword, updateUserMomoPayment, getUserId, addUserMomoPayment, addItemToCart, createShoppingSession,
    removeItemFromCart, deleteShoppingSession
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
