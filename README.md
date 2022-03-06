# Serve API Spec

Sever API Spec allows you to pull open api spec from gitlab repository and serve the apis defined in the spec locally through prism mock server

# Usage

There are five required inputs

- `API_SPEC_DOMAIN`: company gitlab domain, e.g. if your company's gitlab domain is https://xyz.com, the field value here should be `xyz.com`
- `API_SPEC_PROJECT`: Project id of the project that you keep open api yaml
- `API_SPEC_TOKEN`: Project access token of the project that you keep openapi yaml
- `API_SPEC_BRANCH`: The branch that contains the openapi yaml file.
- `API_SPEC_PATH`: File path relative to project root.

You can define these inputs in you `.bashrc` or `.zshrc`. You can also pass cli params. If both exist, cli params will take precedence.

To run the package, you can simply do:

```bash
npx serve-api-spec --API_SPEC_DOMAIN 'xyz.com' --API_SPEC_PROJECT '123' --API_SPEC_TOKEN 'abcd' --API_SPEC_BRANCH 'master' --API_SPEC_PATH 'file/path'
```

Or, you can install first:

```bash
npm i serve-api-spec@latest
```

And then:

```bash
npx serve-api-spec --API_SPEC_DOMAIN 'xyz.com' --API_SPEC_PROJECT '123' --API_SPEC_TOKEN 'abcd' --API_SPEC_BRANCH 'master' --API_SPEC_PATH 'file/path'
```
