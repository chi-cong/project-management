import "./create-project-form.css";
import {
  Button,
  DatePicker,
  Input,
  Space,
  Form,
  FormProps,
  Select,
  message,
} from "antd";
import React from "react";
import "./modal-create-user.css";
import { Project } from "src/share/models";
import { useCreateProjectMutation } from "src/share/services";
import { useGetDepartmentsQuery } from "src/share/services";

type ModalCreateUser = {
  isModalOpen: boolean;
  setIsModalOpen: (isShown: boolean) => void;
};

const ModalCreateUser: React.FC<ModalCreateUser> = ({ setIsModalOpen }) => {
  setIsModalOpen(false);

  const { data: departmentData } = useGetDepartmentsQuery({
    itemsPerPage: "ALL",
  });

  const [createProject] = useCreateProjectMutation();

  const onFinish: FormProps<Project>["onFinish"] = async (values) => {
    await createProject(values)
      .unwrap()
      .then(() => message.success("Success create project"))
      .catch(() => message.error("There was an error"));
  };

  return (
    <>
      <h2
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Create User
      </h2>
      <Form name='user-info' onFinish={onFinish} layout='vertical'>
        <div>
          <Form.Item<Project> name='name' label='Project Name'>
            <Input size='large' />
          </Form.Item>
        </div>
        <div>
          <Form.Item<Project>
            name='projectCode'
            rules={[{ required: true, message: "Username is required" }]}
            label='Project Code'
          >
            <Input size='large' />
          </Form.Item>
        </div>
        <div>
          <Form.Item<Project>
            name='investor'
            rules={[{ required: true, message: "Password is required" }]}
            label='Investor'
          >
            <Input.Password placeholder='Password...' size='large' />
          </Form.Item>
        </div>
        <div>
          <Form.Item<Project> name='description' label='Description'>
            <Input placeholder='Phone...' size='large' />
          </Form.Item>
        </div>
        <div>
          <Form.Item<Project> name='endAt' label='end'>
            <DatePicker
              placeholder='Birthday...'
              size='large'
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item<Project> name={"department_id"} label='Department'>
            <Select
              options={departmentData?.departments?.map((department) => {
                return {
                  label: department.name,
                  value: department.department_id,
                };
              })}
            />
          </Form.Item>
        </div>
        <Form.Item className='create-project-form-btn'>
          <Space>
            <Button type='primary' htmlType='submit' size='large'>
              Create
            </Button>
            <Button
              type='primary'
              ghost
              size='large'
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalCreateUser;
