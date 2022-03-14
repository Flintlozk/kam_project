#!/bin/bash
npm run tslint
export exit_code_tslint=$?
if [ $exit_code_tslint -ne 0 ] ; then
    RED='\e[31m'
    NC='\e[34m' # No Color
    echo -e "${RED}TSLINT ERROR::: ${NC}Please Check Your Angular Code !!!!"
    exit 1
fi
npm run eslint
export exit_code_eslint=$?
if [ $exit_code_eslint -ne 0 ] ; then
    RED='\e[31m'
    NC='\e[34m' # No Color
    echo -e "${RED}ESLINT ERROR::: ${NC}Please Check Your NODE Code !!!!"
    exit 1
fi
npm run format
