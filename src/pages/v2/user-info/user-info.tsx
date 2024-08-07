import "./profile-form.css";
import React, { useEffect } from "react";
import {
  Form,
} from "antd";
import { userRoleOptions } from "src/share/utils";
import { User, UserRole } from "src/share/models/";
interface UserInfor {
  name: string;
  email: string;
  role?: UserRole;
}
type UserInfoForm = {
    user: User;
  };
export const UserInfo: React.FC<UserInfoForm> = () => {
    return(
        
    );
};