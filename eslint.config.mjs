import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  // 1. Подключаем рекомендованные правила напрямую
  pluginJs.configs.recommended,

  // 2. Настраиваем свои правила
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Разрешаем глобальные переменные Node.js
      },
    },
    rules: {
      "semi": "error",
      "no-unused-vars": ["error", { "args": "none" }],
      "no-undef": "error",
    },
  },
];