#!/usr/bin/expect -f

#
# Test user script 1
#
# A test user script for JanusVR server running on local machine on default JanusVR server port.
#
# Automatically logs in a user to room eab63d0ea060b828578a4ae044f24d03 called testuser1 and subscribes for events from
# server. After doing this it allows interactive mode so any other command can be entered and sent by the developer on
# behalf of this user.
#
# Running this script is useful for automatically logging in a test user after restarting JanusVR server when making
# code changes as changes aren't applied until the server restarts. Restarting the server currently disconnects all
# clients connected to it and does not preserve state.
#
# @author Michael Andrew (michael@uxvirtual.com)
#

spawn telnet 127.0.0.1 5566
send "{\"method\":\"logon\",\"data\":{\"userId\":\"testuser1\", \"version\":\"28.9\", \"roomId\":\"eab63d0ea060b828578a4ae044f24d03\"}}\n"
send "{\"method\":\"subscribe\", \"data\":{\"roomId\":\"eab63d0ea060b828578a4ae044f24d03\"}}\n"
send "{\"method\":\"enter_room\", \"data\":{\"roomId\":\"eab63d0ea060b828578a4ae044f24d03\"}}\n"
interact #This hands control of the keyboard over to you