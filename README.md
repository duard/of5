#### Dependencias
```
npx create-nx-workspace of5 
npm install -g @nrwl/schematics
npm install -g nx
npm install -D @nrwl/angular
npm install --save-dev @angular-devkit/architect
npm install -D @nrwl/nest
```

#### criando aplicação Angular
```
npx nx generate @nrwl/angular:app starter-app
```

#### criando uma library Angular
```
nx g @nrwl/angular:library app-shared
```

#### criando aplicação NestJS
```
npx nx generate @nrwl/nest:application starter-api
```

#### criando uma library NestJS 
```
nx generate @nrwl/nest:library api-shared
```

#### sobre o uso do git e commits
https://dev.to/bhargavmantha/the-secret-to-configuring-eslint-prettier-prettier-eslint-plugin-in-vscode-for-angular-ts-and-js-project-51la


#### configurando shareds para todos os projetos 
https://indepth.dev/posts/1185/tiny-angular-application-projects-in-nx-workspaces


