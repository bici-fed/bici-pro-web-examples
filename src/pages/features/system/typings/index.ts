
export enum DATA_STATUS {
    DELETED = -1,
    DISABLED = 1,
    NORMAL = 2,
}

// 角色
export type RoleItemProps = {
    id: string;
    code: string;
    dataStatus: DATA_STATUS;
    name: string;
}

// 机构
export type DeptItemProps = {
    id: string;
    name: string;
    code: string;
    parentId: string;
    orderNum: number;
    dataStatus: DATA_STATUS;
    childDeptList?: DeptItemProps[];
}
