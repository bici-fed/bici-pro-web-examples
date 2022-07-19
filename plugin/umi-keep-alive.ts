import { lstatSync, readdirSync } from 'fs';
import { extname, relative, resolve } from 'path';
import { IApi } from 'umi';

export function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, '');
}

function visitFiles(opts: {
  dir: string;
  visitor: (file: string) => void;
  baseDir?: string;
}): void {
  opts.baseDir = opts.baseDir || opts.dir;
  for (let filename of readdirSync(opts.dir)) {
    let file = resolve(opts.dir, filename);
    let stat = lstatSync(file);
    if (stat.isDirectory()) {
      visitFiles({ ...opts, dir: file });
    } else if (
      stat.isFile() &&
      ['.tsx', '.ts', '.js', '.jsx', '.md', '.mdx', '.vue'].includes(
        extname(file)
      )
    ) {
      opts.visitor(relative(opts.baseDir, file));
    }
  }
}

function createRoutePath(routeId: string): string {
  let path = routeId
    // routes/$ -> routes/*
    // routes/nested/$.tsx (with a "routes/nested.tsx" layout)
    .replace(/^\$$/, '*')
    // routes/docs.$ -> routes/docs/*
    // routes/docs/$ -> routes/docs/*
    .replace(/(\/|\.)\$$/, '/*')
    // routes/$user -> routes/:user
    .replace(/\$/g, ':')
    // routes/not.nested -> routes/not/nested
    .replace(/\./g, '/');
  // /index/index -> /
  path = /\b\/?index\/index$/.test(path) ? path.replace(/\/?index$/, '') : path;
  path = /\b\/?index$/.test(path) ? path.replace(/\/?index$/, '') : path;
  path = /\b\/?README$/.test(path) ? path.replace(/\/?README$/, '') : path;
  return path;
}

export default (api: IApi) => {
  api.describe({
    key: 'changePageTitle',
    config: {
      schema(joi) {
        return joi.object();
      }
    },
    enableBy: api.EnableBy.config
  });
  api.modifyConfig(memo => {
    console.log('>>>', api.userConfig);
    const PAGE_PATHS: string[] = [];
    visitFiles({
      dir: 'src/pages/',
      visitor: file => {
        const path = createRoutePath(stripFileExtension(file));
        PAGE_PATHS.push(path);
        console.log('====', path);
      }
    });
    memo.define = {
      PAGE_PATHS
    };
    memo.title = api.userConfig.changePageTitle.changeFavicon;
    return memo;
  });
};
