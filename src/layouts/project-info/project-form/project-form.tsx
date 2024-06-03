import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, DatePicker, message } from "antd";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "src/share/services";
import dayjs from "dayjs";

import type { Project } from "src/share/models";
import type { FormProps } from "antd";

interface ProjectFormProps {
  project?: Project;
}

export const ProjectForm = ({ project }: ProjectFormProps) => {
  const [form] = Form.useForm();
  const [editableForm, setEditableForm] = useState<boolean>(false);
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<Project>["onFinish"] = async (values) => {
    if (!project) {
      await createProject(values)
        .unwrap()
        .then(() => messageApi.success("Success create project"))
        .catch(() => messageApi.error("There was an error"));
    } else if (project) {
      await updateProject({ values, projectId: project.project_id })
        .unwrap()
        .then(() => messageApi.success("Success update project"))
        .catch(() => messageApi.error("There was an error"));
    }
  };

  const newProject: Project = {
    startAt: dayjs(),
    endAt: dayjs(),
    ProjectProperty: [],
    projectCode: "",
    description: "",
    investor: "",
    name: "",
  };

  useEffect(() => {
    form.setFieldsValue(
      project
        ? {
            ...project,
            startAt: dayjs(
              typeof project.startAt === "string"
                ? project.startAt.substring(0, 10)
                : new Date()
            ),
            endAt: dayjs(
              typeof project.endAt === "string"
                ? project.endAt.substring(0, 10)
                : new Date()
            ),
          }
        : { ...newProject }
    );
  });

  return (
    <>
      {contextHolder}
      {project && (
        <Checkbox
          checked={editableForm}
          onChange={() => setEditableForm(!editableForm)}
        >
          Edit information
        </Checkbox>
      )}
      <Form
        form={form}
        disabled={project ? !editableForm : false}
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item<Project> name={"name"} label='Project name'>
          <Input />
        </Form.Item>
        <Form.Item<Project> name={"projectCode"} label='Project Code'>
          <Input />
        </Form.Item>
        <Form.Item<Project> name={"investor"} label='Investor'>
          <Input />
        </Form.Item>
        <Form.Item<Project> name={"description"} label='Description'>
          <Input.TextArea />
        </Form.Item>
        {project && (
          <>
            <Form.Item<Project> name={"startAt"} label='Start'>
              <DatePicker />
            </Form.Item>
          </>
        )}
        <Form.Item<Project> name={"endAt"} label='End'>
          <DatePicker />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type='primary' htmlType='submit'>
            {project ? "Save Changes" : "Create project"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
