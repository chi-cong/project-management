import "./task-form.css";
import {
  Form,
  Button,
  Input,
  DatePicker,
  Checkbox,
  List,
  Upload,
  message,
  Typography,
  Spin,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  useCreateTaskMutation,
  useCreateAssigmentMutation,
  useGetTaskActivityQuery,
  useCreateActivityMutation,
  useUpdateTaskMutation,
  useGetDepartmentStaffsQuery,
  useUpdateAssignmentMutation,
} from "src/share/services";

import type { Task, Assignment, Project } from "src/share/models";
import type { FormProps } from "antd";

interface TaskFormFields {
  description: string;
  start: string;
  deadline: string;
  status: boolean;
  assignedStaff: string;
}

interface TaskFormProps {
  assignment?: Assignment;
  task?: Task;
  action: "create" | "update";
  project: Project;
  refetch: () => void;
}

export const TaskForm = ({
  assignment,
  action,
  project,
  refetch,
  task,
}: TaskFormProps) => {
  const [form] = Form.useForm();

  const [createAssignment, { isLoading: creAssignLoad }] =
    useCreateAssigmentMutation();
  const [createTask, { isLoading: creTaskLoad }] = useCreateTaskMutation();
  const [createActivity, { isLoading: creActiLoad }] =
    useCreateActivityMutation();
  const [updateTask, { isLoading: updTaskLoad }] = useUpdateTaskMutation();
  const [updateAssignment, { isLoading: updAssignLoad }] =
    useUpdateAssignmentMutation();
  const { data: actitvityData, isFetching: actiFetch } =
    useGetTaskActivityQuery({
      taskPropertyId: task?.TaskProperty.task_property_id,
      items_per_page: "ALL",
    });
  const { data: departmentStaff } = useGetDepartmentStaffsQuery({
    itemsPerPage: "ALL",
    departmentId: project.ProjectProperty?.department_id,
  });

  const documents: string[] = [];
  const { Text } = Typography;

  const onFinish: FormProps<TaskFormFields>["onFinish"] = async (values) => {
    switch (action) {
      case "create": {
        const newTask = await createTask({
          description: values.description,
        }).unwrap();
        await createAssignment({
          project_property_id: project.ProjectProperty?.project_property_id,
          task_property_id: newTask.task_property.task_property_id,
          user_property_id: values.assignedStaff,
        })
          .unwrap()
          .then(() => {
            message.success("successful create task");
            refetch && refetch();
          })
          .catch((e) => message.error(e));

        break;
      }
      case "update": {
        try {
          await updateTask({
            taskId: task!.task_id,
            value: { description: values.description },
          }).unwrap();
          await updateAssignment({
            assigmentId: assignment!.assignment_id!,
            value: {
              endAt: values.deadline,
              status: values.status,
              user_property_id: values.assignedStaff,
            },
          });
          message.success("Task is updated");
        } catch {
          message.error("Failed to update task");
        }
      }
    }
  };

  useEffect(() => {
    if (task && assignment) {
      form.setFieldsValue({
        description: task.description,
        deadline: assignment.endAt
          ? dayjs(assignment.endAt.substring(0, 10), "YYYY/MM/DD")
          : undefined,
        assignedStaff: assignment.user_property_id || "",
        status: assignment?.status,
      });
    } else {
      form.setFieldsValue({
        description: "",
      });
    }
  }, [assignment, project, task, actitvityData]);

  return (
    <div className='task-form-container'>
      <Spin
        spinning={
          creAssignLoad ||
          creTaskLoad ||
          creActiLoad ||
          updTaskLoad ||
          updAssignLoad ||
          actiFetch
        }
      >
        <Form
          form={form}
          name='task-form'
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          className='task-form'
        >
          <Form.Item<TaskFormFields> label='Description' name={"description"}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name={"assignedStaff"} label='Assigned'>
            <Select
              options={departmentStaff?.users.map((staff) => {
                return {
                  label: <Text>{staff.username}</Text>,
                  value: staff.UserProperty?.user_property_id,
                };
              })}
            />
          </Form.Item>
          {action === "update" && (
            <>
              <Form.Item<TaskFormFields> label='Deadline' name={"deadline"}>
                <DatePicker />
              </Form.Item>
              <Form.Item<TaskFormFields>
                label='Completed'
                name={"status"}
                valuePropName='checked'
              >
                <Checkbox />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button type='primary' htmlType='submit'>
                  {action === "update" ? "Save Changes" : "Create"}
                </Button>
              </Form.Item>
              <Form.Item label='Documents'>
                <List
                  dataSource={documents || []}
                  renderItem={(document) => (
                    <List.Item>
                      <List.Item.Meta description={document} />
                    </List.Item>
                  )}
                />
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload new Document</Button>
                </Upload>
              </Form.Item>
              <Form.Item label='Activities'>
                <List
                  dataSource={actitvityData ? actitvityData : []}
                  renderItem={(activity) => (
                    <List.Item>
                      <Text>{activity.description}</Text>
                    </List.Item>
                  )}
                />
                <Input
                  placeholder='New activity'
                  onPressEnter={async (e) => {
                    createActivity({
                      description: (e.target as HTMLInputElement).value,
                      task_property_id: task?.TaskProperty.task_property_id,
                    })
                      .unwrap()
                      .then(() => message.success("New task is created"))
                      .catch(() => message.error("Failed to create task"));
                  }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Spin>
    </div>
  );
};
