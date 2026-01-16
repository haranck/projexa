import {useMutation} from "@tanstack/react-query";

import {
    adminLogin,
    adminLogout
} from "../../services/Admin/adminService";

export const useAdminLogin =() =>{
    return useMutation({
        mutationFn:adminLogin
    })
}

export const useAdminLogout = () => {
    return useMutation({
        mutationFn:adminLogout
    })
}