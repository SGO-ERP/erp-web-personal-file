// module.exports = {
//     env: {
//         browser: true,
//         es2021: true,
//         node: true,
//     },
//     extends: [
//         'eslint:recommended',
//         'plugin:react/recommended',
//         'plugin:@typescript-eslint/recommended',
//     ],
//     overrides: [
//         {
//             files: ['*.ts', '*.tsx'],
//             parser: '@typescript-eslint/parser',
//             parserOptions: {
//                 ecmaVersion: 'latest',
//                 sourceType: 'module',
//             },
//             plugins: ['@typescript-eslint'],
//         },
//         {
//             files: ['*.js', '*.jsx'], // Добавлено исключение для файлов .js
//             rules: {
//                 'react/prop-types': 'off', // Отключение проверки prop-types для .js файлов
//             },
//         },
//     ],
//     parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//     },
//     plugins: ['react'],
//     rules: {
//         'no-mixed-spaces-and-tabs': 0,
//         '@next/next/no-img-element': 'off',
//         quotes: ['error', 'single'],
//         'react/react-in-jsx-scope': 'off',
//     },
//     settings: {
//         react: {
//             version: 'detect',
//         },
//     },
// };
