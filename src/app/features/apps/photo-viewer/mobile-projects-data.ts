/**
 * MOBILE_PROJECTS
 *
 * Mobile projects listed in the Photo Viewer. To add one, append an entry
 * here, its screenshots in public/assets/images/mobile/ and its
 * photoViewer.projects.<key> i18n description.
 *
 * @author adrianpmdev
 */

import { MobileProject } from './mobile-project';

export const MOBILE_PROJECTS: readonly MobileProject[] = [
  {
    id: 'app-1',
    name: 'Spotify2',
    platform: 'Android',
    status: 'online',
    description: 'photoViewer.projects.spotify',
    shots: [
      {
        id: 'a1',
        titleKey: 'photoViewer.shots.home',
        src: '/assets/images/mobile/Spotify/Spotify1.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'a2',
        titleKey: 'photoViewer.shots.songs',
        src: '/assets/images/mobile/Spotify/Spotify2.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'a3',
        titleKey: 'photoViewer.shots.player',
        src: '/assets/images/mobile/Spotify/Spotify3.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'a4',
        titleKey: 'photoViewer.shots.account',
        src: '/assets/images/mobile/Spotify/Spotify4.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'a5',
        titleKey: 'photoViewer.shots.splash',
        src: '/assets/images/mobile/Spotify/Spotify5.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'a6',
        titleKey: 'photoViewer.shots.register',
        src: '/assets/images/mobile/Spotify/Spotify6.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'a7',
        titleKey: 'photoViewer.shots.login',
        src: '/assets/images/mobile/Spotify/Spotify7.jpg',
        width: 1080,
        height: 2340,
      },
    ],
  },
  {
    id: 'app-2',
    name: 'Eventvs Mérida',
    platform: 'Android',
    status: 'online',
    description: 'photoViewer.projects.eventvs',
    shots: [
      {
        id: 'b1',
        titleKey: 'photoViewer.shots.splash',
        src: '/assets/images/mobile/Eventvs/Eventvs1.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b2',
        titleKey: 'photoViewer.shots.home',
        src: '/assets/images/mobile/Eventvs/Eventvs2.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b3',
        titleKey: 'photoViewer.shots.details',
        src: '/assets/images/mobile/Eventvs/Eventvs3.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b4',
        titleKey: 'photoViewer.shots.map',
        src: '/assets/images/mobile/Eventvs/Eventvs4.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b5',
        titleKey: 'photoViewer.shots.calendar',
        src: '/assets/images/mobile/Eventvs/Eventvs5.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b6',
        titleKey: 'photoViewer.shots.profile',
        src: '/assets/images/mobile/Eventvs/Eventvs6.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b7',
        titleKey: 'photoViewer.shots.account',
        src: '/assets/images/mobile/Eventvs/Eventvs7.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b8',
        titleKey: 'photoViewer.shots.events',
        src: '/assets/images/mobile/Eventvs/Eventvs8.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b9',
        titleKey: 'photoViewer.shots.login',
        src: '/assets/images/mobile/Eventvs/Eventvs9.jpg',
        width: 1080,
        height: 2340,
      },
      {
        id: 'b10',
        titleKey: 'photoViewer.shots.register',
        src: '/assets/images/mobile/Eventvs/Eventvs10.jpg',
        width: 1080,
        height: 2340,
      },
    ],
  },
];
