import { BICI_ADMIN_PREFIX } from '@/constant';

export default (props: any) => {
  return (
    <div className={`${BICI_ADMIN_PREFIX}-card`} style={props.style}>
      {props.children}
    </div>
  );
};
