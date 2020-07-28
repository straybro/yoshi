// TODO - this is a temp hack until teamcity-autorelease-surge would support Base Url.
const isPr =
  process.env.VCS_BRANCH_NAME &&
  !!process.env.VCS_BRANCH_NAME.replace(/\D+/g, '');

const versions = require('./versions.json');
const flows = require('./flows.json');

module.exports = {
  title: 'Yoshi Universe',
  tagline: 'A Galaxy of toolkits to develop applications at Wix',
  url: 'https://wix.github.io',
  baseUrl: isPr ? '/' : '/yoshi/',
  favicon: 'img/favicon.ico',

  // Used for publishing and more
  projectName: 'yoshi',
  organizationName: 'wix',

  customFields: {
    flows,
  },
  onBrokenLinks: 'log',
  themeConfig: {
    // syntax highlighting
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    algolia: {
      apiKey: '5807169f7e8a322a659ac4145a3e5d8a',
      indexName: 'wix_yoshi',
      algoliaOptions: {
        // The search currently work for version 4 only
        // Once this is fixed in docusaurus we can use the dynamic
        // version of the page to filter the results
        facetFilters: [`version:${versions[0]}`],
      },
    },
    navbar: {
      title: 'Yoshi',
      hideOnScroll: true,
      logo: {
        alt: 'Yoshi Logo',
        src: 'img/yoshi.png',
      },
      items: [
        {
          label: 'Docs',
          position: 'left',
          to: 'docs/welcome',
        },
        {
          label: 'Flows',
          position: 'left',
          items: flows,
        },
        {
          label: 'Yoshi Server',
          position: 'left',
          to: 'docs/yoshi-server/getting-started',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        // It would be much nicer to have the dynamic version of the page here
        // e.g. v3.x
        // This is a temporary fix
        {
          to: 'versions',
          label: `Versions`,
          position: 'right',
        },
        {
          href: 'https://github.com/wix/yoshi',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: 'docs/welcome',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Wix.com, Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/wix/yoshi/edit/master/website/',
          routeBasePath: 'docs',

          // Docs will show the last update time
          showLastUpdateTime: true,
          // Docs will show the last author updated the doc
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
