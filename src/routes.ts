import auth, { AuthParams } from '@/utils/authentication';
import { useEffect, useMemo, useState } from 'react';

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
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
      },
      {
        name: '添加公告',
        key: 'post/create-post',
      },
      {
        name: '轮播图',
        key: 'setting/system-setting',
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
      },
      {
        name: '工单详情',
        key: 'work-order-management/work-order-check/order-detail-view',
        ignore: true,
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
      },
      {
        name: '工单查询',
        key: 'approve-management/order-search',
      },
      {
        name: '规则设置',
        key: 'approve-management/rule-manage',
      },
      {
        name: '流程设置',
        key: 'approve-management/flow-manage',
      },
    ],
  },
  {
    name: '还款查询',
    key: 'repayment-search/index',
  },
  {
    name: '催收管理',
    key: 'repayment-search/collection-manage',
  },
  {
    name: '定时任务手动触发',
    key: 'repayment-search/task-manage',
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
  const actions = role === 'admin' ? ['*'] : ['read'];
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

const useRoute = (userPermission): [IRoute[], string] => {
  const filterRoute = (routes: IRoute[], arr = []): IRoute[] => {
    if (!routes.length) {
      return [];
    }
    for (const route of routes) {
      const { requiredPermissions, oneOfPerm } = route;
      let visible = true;
      if (requiredPermissions) {
        visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
      }

      if (!visible) {
        continue;
      }
      if (route.children && route.children.length) {
        const newRoute = { ...route, children: [] };
        filterRoute(route.children, newRoute.children);
        if (newRoute.children.length) {
          arr.push(newRoute);
        }
      } else {
        arr.push({ ...route });
      }
    }

    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(routes);

  useEffect(() => {
    const newRoutes = filterRoute(routes);
    setPermissionRoute(newRoutes);
  }, [JSON.stringify(userPermission)]);

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
