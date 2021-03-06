import loadable from '@loadable/component';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import { AliveScope, NodeKey } from 'react-activation';
import { history } from 'umi';
import stores from './stores';

// 最大tab菜单个数
const MAX_TABS = 20;

const MobxProvider = (props: any) => <Provider {...stores} {...props} />;

// @ts-ignore
NodeKey.defaultProps.onHandleNode = (node, mark) => {
  // 因异步组件 loaded 后会去掉 LoadableComponent 层，导致 nodeKey 变化，缓存定位错误
  // 故排除对 LoadableComponent 组件的标记，兼容 dynamicImport
  if (node.type && node.type.displayName === 'LoadableComponent') {
    return undefined;
  }
  return mark;
};

// 兼容因使用 rootContainer 导致 access 权限无效问题 (传入 routes 带有 unaccessible 才能成功)
const Wrapper = ({ children, ...props }: any) =>
  React.createElement(
    AliveScope,
    props,
    React.cloneElement(children, { ...children.props, ...props })
  );

/**
 * 修改交给 react-dom 渲染时的根组件。
 * rootContainer(lastRootContainer, args)
 * args 包含：
 * routes，全量路由配置
 * plugin，运行时插件机制
 * history，history 实例
 * 比如用于在外面包一个 Provider，
 * @param container
 * @param opts
 */
export function rootContainer(container: any, opts: any) {
  console.log('==============');
  console.log(container);
  const A = React.createElement(Wrapper, null, container);
  return React.createElement(MobxProvider, opts, A);
}

// export function innerProvider(container: any) {
//     return React.createElement(ProgressProvider, null, container);
// }
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: any;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/login') {
    fetch('/api/menu')
      .then(res => res.json())
      .then(res => {
        stores.user.setAuthorities(res.data);
      });
    return {
      settings: { layout: 'mix' }
    };
  }
  return {
    settings: { layout: 'mix' }
  };
}

// /**
//  * 覆写 render。复写这个方法会报错
//  * 比如用于渲染之前做权限校验，
//  * @param oldRender
//  */
// export function render(oldRender) {
//     console.log('render....')
//
//     fetch('/api/auth').then(res=>res.json()).then(auth => {
//         console.log('===========', auth);
//         setTimeout(()=>{
//             if (auth.isLogin) { oldRender() }
//             else {
//                 history.push('/login');
//                 // oldRender()
//             }
//         },10)
//     });
//
//     fetch('/api/menu').then(res=>res.json()).then((res) => {
//         stores.user.setAuthorities(res);
//         // oldRender();
//     })
// }

export function patchRoutes({ routes, routeComponents }: any) {
  console.log('patchRoutes', routes, routeComponents);
}

/**
 * 注：如需动态更新路由，建议使用 patchClientRoutes() ，否则你可能需要同时修改 routes 和 routeComponents。
 * @param routes
 */

export function patchClientRoutes({ routes, ...rest }: any) {
  console.log('rest>>>', rest);
  console.log('hello', PAGE_PATHS);

  toJS(stores.user.authorities).forEach((menu: any) => {
    if (menu.component && menu.path) {
      if (PAGE_PATHS.includes(menu.component)) {
        const AsyncPage = loadable(() => import(`@/pages/${menu.component}`), {
          fallback: <div>loadding</div>
        });
        console.log('AsyncPage>>>', AsyncPage);
        const Com = (
          <Suspense
            fallback={
              <div style={{ fontSize: 32, color: 'red' }}>Loading...</div>
            }
          >
            <AsyncPage />
          </Suspense>
        );
        const newRoute = {
          path: menu.path,
          exact: true,
          element: Com,
          layout: false,
          file: '@/wrappers/BaseLayout.tsx',
          parentId: '@@/global-layout'
        };
        routes[1].routes[0].children.unshift(newRoute);
        routes[1].routes[0].routes.unshift(newRoute);
      }
    }
  });
}

export function onRouteChange(opts: any) {
  const r = stores.user.authorities.filter(
    (item: any) => item.path === opts.location.pathname
  );
  if (r.length === 1) {
    const menu = r[0] as any;
    if (stores.user.openTabMenus.size < MAX_TABS) {
      stores.user.addTabMenu(menu.menuId, {
        id: menu.menuId,
        name: menu.title,
        closeable: true
      });
      // 更改页面标题
      document.title = `BICI Design Pro - ${menu.title}`;
      // 解决了pro-table删选表单有时不展示的bug
      // const myEvent = new Event('resize');
      // window.dispatchEvent(myEvent);
    }
  }
}

// export function addFoo() {
//   console.log('addFoo');
// }
