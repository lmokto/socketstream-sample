#!/usr/bin/env python
# -*- coding: utf-8 -*-
import redis
r = redis.StrictRedis()

__keys = r.keys()
vals = r.mget(__keys)
KV = zip(__keys, vals)

keys = r.keys('*')
for key in keys:
    type = r.type(key)
    if type == KV:
        val = r.get(key)
    if type == HASH:
        vals = r.hgetall(key)
    if type == ZSET:
        vals = r.zrange(key, 0, -1)