#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
import redis
import urllib
import json
import time
from datetime import datetime
import types

redisCliOne = redis.StrictRedis()

borneras_aire_5t = ["9061", "9062", "9063"]
borneras_luz_5t = ["9014", "9016"]
borneras_tomas_5t = ["9013", "9015", "9064", "9071", "9072", "9074", "9075"]
borneras_aire_2d = ["9031", "9033", "9035"]
borneras_luz_2d = ["9021", "9022", "9023"]
borneras_tomas_2d = ["9034", "9051", "9052", "9053", "9054", "9055", "9056"]

quintopiso = borneras_aire_5t + borneras_luz_5t + borneras_tomas_5t
segundopiso = borneras_aire_2d + borneras_luz_2d + borneras_tomas_2d

API_CLIMA = "http://api.openweathermap.org/data/2.5/weather?id=3435910"
API_LESS = "http://52.10.233.24/v1/circuits/{0}/latest"


def msgrun(sensor):

	print "[*] loading script"
	print "[*] run script sensor {0}".format(sensor)
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
				sensor = redisCliOne.get("sensor")
				msgrun(sensor)
				code = beforeislive(sensor, True, True)
				time.sleep(1)
				print code
				if code in ["INTIME", "INDAY", "OUTDAY"]:
					redisCliOne.set(sensor, code)
				else:
					redisCliOne.set(sensor, "RELOAD")
			elif countrun == 1 and int(msg) == 0:
				countrun = 0
				print "[*] stop process"
				print "[*] stop script"
				print "[*] finish"


def epochhuman(epoch):

	dt = datetime.fromtimestamp(epoch / 1000)
	s = dt.strftime('%Y-%m-%d %H:%M:%S')
	
	return s 


cielo = {
    800: "Soleado",
    801: "Parcialmente soleado",
    802: "Parcialmente nublado",
    803: "Mayormente nublado",
    804: "Nublado",
    711: "Neblina"
}


def GET(url):

    # hace peticion a api en amazon, y api clima
    result = []
    try:
        response = urllib.urlopen(url)
    except:
        print "failed host {0}".format(url)
        return 0
    else:
        if response.code == 200:
            result = dict(json.load(response))
            # print result
            if result.has_key('data'):
                return result['data'][0]
            elif result.has_key('weather') and result.has_key('main'):
                return result
            else:
                return 0
        elif response.code == 500:
            return 0
        else:
            return 0


def checkdate(timestamp):

	fecha = timestamp.split()[0].replace("-", " ").split()
	horario = timestamp.split()[1].replace(":", " ").split()

	yyyy, mm, dd = fecha[0], fecha[1], fecha[2]
	hra, mins, seg = horario[0], horario[1], horario[2]

	return tuple((yyyy, mm, dd, hra, mins, seg))


CODES = [(True,'INTIME'), (False, 'INDAY', 'OUTDAY')]


def beforecheck(collector_timestamp, now=True, last=True):

	lasthumantime = epochhuman(collector_timestamp)
	tuplelastime = checkdate(lasthumantime)

	if (now and last) == True:
		
		nowhumantime = datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
		tuplenowtime = checkdate(nowhumantime)

		return tuplenowtime, tuplelastime
	
	elif now == False and last == True:
		
		return tuplelastime

	elif now == True and last == False:
		
		nowhumantime = datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
		tuplenowtime = checkdate(nowhumantime)

		return tuplenowtime
		

def checkinline(tuplelastime, tuplenowtime):

	if tuplelastime[0:5] == tuplenowtime[0:5]:
		if int(tuplelastime[5]) in range(int(tuplenowtime[5])):
			return "INTIME"
	else:
		if tuplelastime[0:4] == tuplenowtime[0:4]:
			return "INDAY"
		else:
			return "OUTDAY"


def beforeislive(_id, last, now):

	data = GET("http://52.10.233.24/v1/circuits/{0}/latest".format(_id))
	if type(data) == dict:
		dateresult = beforecheck(data['collector_timestamp'], last, now)
		code = checkinline(dateresult[0], dateresult[1])
		return code
	else:
		return "RELOAD"
		

def islive(_id):

	code = beforeislive(_id, True, True)

	if code == "INTIME":
		return True
	elif code == "INDAY":
		return False
	elif code == "OUTDAY":
		return False


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