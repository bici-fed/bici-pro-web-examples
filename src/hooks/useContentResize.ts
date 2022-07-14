import { BICI_ADMIN_PREFIX } from '@/constant';

const useContentResize = () => {
  if (window.ResizeObserver) {
    const content = document.querySelector(
      `.${BICI_ADMIN_PREFIX}-content`
    ) as Element;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect) {
          console.log(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(content);
  }
  return {
    width: 1800
  };
};
export default useContentResize;
