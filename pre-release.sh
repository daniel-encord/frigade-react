#!/bin/bash

yarn install --frozen-lockfile
yarn build
echo "export const VERSION_NUMBER = '$1'" > ./src/api/version.ts
