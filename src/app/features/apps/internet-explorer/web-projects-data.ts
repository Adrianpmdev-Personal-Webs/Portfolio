/**
 * WEB_PROJECTS
 *
 * Web projects listed in Internet Explorer. To add one, append an entry here,
 * its screenshot in public/assets/images/webs/ and its
 * internetExplorer.projects.<id> i18n keys.
 *
 * @author adrianpmdev
 */

import { WebProject } from './web-project';

export const WEB_PROJECTS: readonly WebProject[] = [
  {
    id: 'project1',
    titleKey: 'internetExplorer.projects.project1.title',
    summaryKey: 'internetExplorer.projects.project1.summary',
    status: 'online',
    deployUrl: 'https://the-witcher-web.vercel.app/',
    previewSrc: '/assets/images/webs/project1.webp',
    stack: ['HTML', 'CSS', 'JS'],
  },
  {
    id: 'project2',
    titleKey: 'internetExplorer.projects.project2.title',
    summaryKey: 'internetExplorer.projects.project2.summary',
    status: 'online',
    deployUrl: 'https://adrianpmdev-portfolio.vercel.app',
    previewSrc: '/assets/images/webs/project2.webp',
    stack: ['Angular', 'TypeScript', 'SCSS'],
  },
  {
    id: 'project3',
    titleKey: 'internetExplorer.projects.project3.title',
    summaryKey: 'internetExplorer.projects.project3.summary',
    status: 'online',
    deployUrl: 'https://eventvsmerida.vercel.app',
    previewSrc: '/assets/images/webs/project3.webp',
    stack: ['Angular', 'TypeScript', 'SCSS'],
  },
];
