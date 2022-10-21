# JEST REACT

Para testar os apps no React, precisamos instalar as libs:

```bash
yarn add -D jest jest-dom jest-environment-jsdom @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest
```

## Arquivos de teste

Podemos criar arquivos com a extensão `.spec.ts` ou `.test.ts`

## @testing-library/react render()

Renderiza um componente de maneira "virtual", de forma que a gente consiga obter o output de um componente

## Mocks

Sempre que algo que estamos testando precisa de uma funcionalidade externa ao componente, utilizamos os mocks.
