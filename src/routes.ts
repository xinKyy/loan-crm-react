import auth, { AuthParams } from '@/utils/authentication';
import { useEffect, useMemo, useState } from 'react';
import useStorage from "@/utils/useStorage";

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
  permission?:Array<string>
};

export const routes: IRoute[] = [
  {
    name: '配置管理',
    key: 'setting',
    ignore:true,
    children: [
      {
        name: '公告',
        key: 'post/post-table',
        permission:[]
      },
      {
        name: '添加公告',
        key: 'post/create-post',
        permission:[]
      },
      {
        name: '轮播图',
        key: 'setting/system-setting',
        permission:[]
      },
      // {
      //   name: '权限管理',
      //   key: 'setting/auth-table',
      // },
      // {
      //   name: '得到账户设置',
      //   key: 'setting/get-help-table',
      // },
      {
        name: 'AIS币价配置',
        key: 'setting/pay',
        permission:[]
      },
    ],
  },
  {
    name: '工单管理',
    key: 'work-order',
    children: [
      {
        name: '工单审核',
        key: 'work-order-management/work-order-check',
        permission:["1", "2"]
      },
      {
        name: '工单详情',
        key: 'work-order-management/work-order-check/order-detail-view',
        ignore: true,
        permission:["1", "2"]
      },
    ],
  },
  {
    name: '审批管理',
    key: 'approve-management',
    children: [
      {
        name: '工单推送',
        key: 'approve-management/check-manage',
        permission:["1", "2"]
      },
      {
        name: '工单查询',
        key: 'approve-management/order-search',
        permission:["1", "2"]
      },
      {
        name: '规则设置',
        key: 'approve-management/rule-manage',
        ignore: true,
        permission:["1"]
      },
      {
        name: '流程设置',
        key: 'approve-management/flow-manage',
        ignore: true,
        permission:["1"]
      },
    ],
  },
  {
    name: '还款查询',
    key: 'repayment-search/index',
    permission:["1", "2"]
  },
  {
    name: '催收管理',
    key: 'repayment-search/collection-manage',
    permission:["1", "4"]
  },
  {
    name: '定时任务手动触发',
    key: 'repayment-search/task-manage',
    permission:["1"]
  },
];

export const getName = (path: string, routes) => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};

export const generatePermission = (role: string) => {
  const actions = role === "'admin' ? ['*'] : ['read']";
  const result = {};
  routes.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        result[child.name] = actions;
      });
    }
  });
  return result;
};

const useRoute = (): [IRoute[], string] => {
  const filterRoute = (userPermission, routes: IRoute[], arr = []): IRoute[] => {
    if (!routes.length) {
      return [];
    }
    for (const route of routes) {
      const newRoute = { ...route, children: [] }
      if(route.children && route.children.length){
        route.children.forEach(item=>{
          if(item.permission.includes(userPermission)){
            newRoute.children.push(item)
          }
        })
        arr.push(newRoute)
      } else {
        if(route.permission.includes(userPermission)){
          arr.push(newRoute)
        }
      }
    }
    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(routes);
  const [userRole, setUserRole] =  useStorage("loanUserRole", "0")

  useEffect(() => {
    const userRole = localStorage.getItem("loanUserRole")
    const newRoutes = filterRoute(userRole, routes);
    setPermissionRoute(newRoutes);
  }, [userRole]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      const firstRoute = first?.children?.[0]?.key || first.key;
      return firstRoute;
    }
    return '';
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;
