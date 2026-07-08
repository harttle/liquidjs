const gitPlugin = [
  '@semantic-release/git',
  {
    assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
    message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
  }
]

const githubPlugin = [
  '@semantic-release/github',
  {
    assets: [
      { path: 'dist/*.umd.js', label: 'liquid.js' },
      { path: 'dist/*.min.js', label: 'liquid.min.js' },
      { path: 'dist/*.min.js.map', label: 'liquid.min.js.map' }
    ]
  }
]

const basePlugins = [
  '@semantic-release/commit-analyzer',
  '@semantic-release/release-notes-generator',
  '@semantic-release/changelog',
  '@semantic-release/npm'
]

// next is branch-protected (PR-only); skip @semantic-release/git there and publish to npm only.
const onMaster = process.env.GITHUB_REF === 'refs/heads/master'

module.exports = {
  branches: [
    'master',
    { name: 'next', prerelease: 'alpha' }
  ],
  plugins: [
    ...basePlugins,
    ...(onMaster ? [gitPlugin] : []),
    githubPlugin
  ]
}
