module.exports = {
    types: [
        { value: 'feat', name: 'feat:     A new feature' },
        { value: 'fix', name: 'fix:      A bug fix' },
        { value: 'docs', name: 'docs:     Documentation changes' },
        { value: 'style', name: 'style:    Code style changes (formatting, etc.)' },
        { value: 'refactor', name: 'refactor: Refactoring production code' },
        { value: 'test', name: 'test:     Adding or correcting tests' },
    ],
    scopes: [
        { name: 'auth' },
        { name: 'api' },
        { name: 'ui' },
        { name: 'core' },
    ],
    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix']
};
