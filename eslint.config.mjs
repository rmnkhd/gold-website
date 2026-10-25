import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    prettier,
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            // قانون سختِ پروژه: `any` ممنوع است (CLAUDE.md)
            '@typescript-eslint/no-explicit-any': 'error',

            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',

            // غیرفعال کردن قوانین پیش‌فرض برای جلوگیری از تداخل با unused-imports
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        ignores: ['.next/**', 'node_modules/**', 'coverage/**'],
    },
];

export default eslintConfig;
