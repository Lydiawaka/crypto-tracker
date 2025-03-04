/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['project-setup', 'running-the-app'],
    },
    {
      type: 'category',
      label: 'Technical Details',
      items: ['api-integration', 'state-management', 'challenges'],
    },
  ],
};

module.exports = sidebars;
