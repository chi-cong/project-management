import { RoleResp } from "../models/accountModels";
export interface getDepartmentsResp{
  total?:number;
  nextPage?: boolean;
  peviousPage?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  departments?: Department[];
}
export interface Department {
  department_id?: string;
  name?: string;
  description?: string;
  createdBy?: string;
  createdAt?: string;
  manager_id?: string;
  information?: information;
}
export interface information{
    total_staff?: number;
    manager?: manager;
}
export interface manager{
    user_id?: string;
    username?: string;
    email?: string;
    phone?: string;
    avartar?: string;
    name?: string;
    birthday?: string;
    createdAt?: string;
    createBy?: string;
    deletedMark?: boolean;
    userProperty?: UserProperty;
}

export interface UserProperty {
  user_property_id?: string;
  department_id?: string;
  role?: RoleResp;
}
