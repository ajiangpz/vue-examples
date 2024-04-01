import { axiosInstance } from "@/plugins/axios";
export function getdata(type:number|string){
    return axiosInstance.get(`/mock/getdata?type=${type}`)
}