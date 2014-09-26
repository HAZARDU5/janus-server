#!/usr/bin/expect -f

#
# Test user script 1
#
# A test user script for JanusVR server running on local machine on default JanusVR server port.
#
# Automatically logs in a user called testuser1 to room eab63d0ea060b828578a4ae044f24d03 and subscribes for events from
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
send "{\"method\":\"roomlist\", \"data\":{\"userId\":\"testuser1\", \"roomIds\":\[\"eab63d0ea060b828578a4ae044f24d03\"\]}}\n"
send "{\"method\":\"move\", \"data\":\"-0.7 -0.371909 7.32 -0.283829 -0.0366191 -0.958175 -0.283829 -0.0366437 -0.958175 -0.0104075 0.999328 -0.0351346 0 0 0 . <FireBoxRoom>|<Assets>|<AssetObject~id=&kerghead&~src=&http://vrsites.com/assets/Firefoxg/8/evhead.obj&~tex0=&http://vrsites.com/assets/Firefoxg/8/evhead.png&~/>|<AssetObject~id=&kergbody&~src=&http://vrsites.com/assets/Firefoxg/8/ev2.obj&~tex0=&http://vrsites.com/assets/Firefoxg/8/ev.png&~/>|</Assets>|<Room>|<Ghost~id=&testuser1&~js_id=&1&~head_id=&kerghead&~body_id=&kergbody&~scale=&1.4~1.4~1.4&~eye_ipd=&0.064&~/>|</Room>|</FireBoxRoom>|\"}"
interact #This hands control of the keyboard over to you