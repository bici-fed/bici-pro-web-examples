import { useLocation } from 'react-router-dom';
import { history, Outlet } from 'umi';
/**
 * 全局的基础布局
 */
export default function Layout(props: any) {
  console.log('rerender layout', props, history);
  const location = useLocation();
  console.log(location);
  return (
    <div>
      <Outlet />
    </div>
  );
}
