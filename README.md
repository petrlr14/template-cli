# Template generator

Simple CLI to clone repositories as templates. It use [Github API](https://docs.github.com/en) to fetch branches from selected repository. Must have your own [key](https://docs.github.com/en/developers/apps/authenticating-with-github-apps#generating-a-private-key).

## Local installation

First, clone this repository into your local machine

```bash
  $ git clone https://github.com/petrlr14/template-cli

  $ npm i
```

Then, you need to link the package in order to use it anywhere:

```bash
  $ npm link
```

Now you can use the `generate-template` command

You'll need two file: `.env` and your Github app private key.

## Env file

- APP_ID: Your Github App ID to be use in the Github API implementation
- TOKEN_EXP: Time (in seconds) in which the JWT will be valid (max 10 minutes)
- KEY_NAME: Name of the PEM file. Must be placed in the root level of the package
- REPO: Repo to clone
- USER: User owner of the repo to be cloned

## Args (so far)

```bash
generate-template <project-directory> [...flags]
```

- project-directory: if empty `./` assumed.

Flags

- [--skip, -s]: takes default branch to clone
- [--no-git, -g]: skip git init

## TODO

- A facy wizard

- Maybe a more dynamic way to meke the cli reusable with differents repositories
