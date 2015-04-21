#!/usr/bin/env python
# -*- coding: utf-8 -*-

import redis
redisCliOne = redis.StrictRedis()

def msgrun():

	print "[*] loading script"
	print "[*] run script"
	print "[*] run process"
	print "[*]================[*]"

def withpubsub():

	client = redisCliOne.pubsub()
	client.subscribe('channeltest')

	while True:
		msg = client.get_message()
		if msg:
			msgrun()

 
def withset():

	countrun = 0
	while True:
		msg = redisCliOne.get("a")
		if msg:
			if countrun != 1 and int(msg) == 1:
				countrun = 1
				msgrun()
			elif countrun == 1 and int(msg) == 0:
				countrun = 0
				print "[*] stop process"
				print "[*] stop script"
				print "[*] finish"



def getkeys():
	
	keys = r.keys()
	vals = r.mget(keys)
	KV = zip(keys, vals)

	keys = r.keys('*')
	for key in keys:
	    type = r.type(key)
	    if type == "key":
	        val = r.get(key)
	    if type == "hash":
	        vals = r.hgetall(key)
	    if type == "zset":
	        vals = r.zrange(key, 0, -1)

if __name__ == '__main__':
	withset()