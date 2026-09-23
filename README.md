# Mobile Application Template

### Overview

This is a template for building mobile applications using an Expo and React-Native. It provides eslint, typescript, and prettier configs, as well as git hooks, github actions, and PR templates.

**Note: This template is a work in progress. Code formatting configurations are opinionated and shouldn't be treated as truth.**

### Navigation

**As of 8/20/2024**, this repo does not have a navigation framework configured. The main navigation frameworks supported by Expo (previously used in Blueprint projects) are [React Navigation](https://reactnavigation.org/) and [Expo Router](https://docs.expo.dev/router/introduction/):

1. (Preferred) React Navigation provides a **stack-based navigation model**, allowing screens to be pushed onto and popped out of a navigation stack. 
    1. **NOTE: This framework provides more flexibility at the expense of more boilerplate code. However, being the more popular option, there is significant documentation and examples of mobile projects using React Navigation online.**
2. Expo Router uses a **file-based router** for React Native and web applications. This framework allows applications to be accessible across platforms (iOS, Android, Web). When a file is added to the app directory, the file automatically becomes a route in your navigation. 
    1. **NOTE: Expo Router is built on top of React Navigation and was released more recently. It may be easier to use out of the box, but it has rigid opinions regarding certain navigation features.**  

### Backend

**As of 8/20/2024**, this template is not connected to a backend framework. Blueprint projects typically use Supabase backend/databases. See past mobile projects for examples.

---
## Getting Started

### Prerequisites

Check your installation of `npm` and `node`:

```sh
node -v
npm -v
```

We strongly recommend using a Node version manager like [nvm](https://github.com/nvm-sh/nvm) (for Mac) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (for Windows) to install Node.js and npm. See [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Installation

1. Fork/copy the repo.
    1. [GitHub: Cloning a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#cloning-a-repository)
    2. [GitHub: Generating SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

2. Install project dependencies. This command installs all packages from [`package.json`](package.json).
      ```sh
      # installs the pnpm tool itself — only needed once per machine
      npm install -g pnpm
      # installs this project's dependencies via pnpm
      pnpm install 
      ```
3. [in progress...] Set up secrets 

### Development environment

- **[VSCode](https://code.visualstudio.com/) (recommended)**
  1. Open the project in VSCode.
  2. Install recommended workspace VSCode extensions. You should see a pop-up on the bottom right to "install the recommended extensions for this repository".

### Running the app

1. In the project directory, run:
   ```shell
    npx expo start
   ```
2. [Download Expo Go](https://docs.expo.dev/get-started/installation/#2-expo-go-app-for-android-and) on your phone, **connect to same network as your laptop**, and use your phone camera to scan the QR code displayed in the command line.

### Development tools

View the list of development scripts in the `package.json` file. Each script can be run through the terminal in the root of the project directory using the command below:

```sh
npm run <insert script name here>
```
