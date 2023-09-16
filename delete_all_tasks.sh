#!/bin/bash
if [ $# -eq 0 ]
  then
    echo "Pass Task Router Workspace SID as first parameter"
    echo "e.g. $ $0 WS2deadbeef7..."
    exit 1
fi

echo "Getting tasks for workspace $1"
tasks=`twilio api taskrouter v1 workspaces tasks list --workspace-sid=$1 --no-header | cut -d" " -f1` 

i=0

for task in $tasks
do
    echo "Deleting $task"
    twilio api taskrouter v1 workspaces tasks remove --workspace-sid=$1 --sid="$task"
    ((i=i+1))
done

echo "Deleted $i task(s)"