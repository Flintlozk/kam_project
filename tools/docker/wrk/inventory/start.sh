#!/bin/bash

inventory(){
   ./inventory-load.sh
}


select project in Inventory Exit
do
  case $project in
    Inventory)
        inventory
    ;;
    Exit)
        echo "EXIT",
        exit
    ;;
    *)
        echo "Value not match"
        exit
    esac
done
    