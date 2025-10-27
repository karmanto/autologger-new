#!/usr/bin/python

import time 
import board
import busio
import digitalio
from time import sleep
from datetime import datetime, date, timedelta
import MySQLdb
import bluetooth
import threading

from adafruit_mcp230xx.mcp23017 import MCP23017

i2c = busio.I2C(board.SCL, board.SDA)

tableArray = ["spare0","spare1","spare2","spare3","spare4","spare5","spare6","spare7","spare8","spare9","spare10","spare11","spare12","spare13","spare14","spare15","spare16","spare17","spare18","spare19","spare20","spare21","spare22","spare23","spare24","spare25","spare26","spare27","spare28","spare29","spare30","spare31","spare32","spare33","spare34","spare35","spare36","spare37","spare38","spare39","spare40","spare41","spare42","spare43","spare44","spare45"]
machineArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
delayOnArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
delayOffArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
recordMethodArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
recordLastMilisArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
dateRecordArray = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]

errorNameArray = ['RTC','BLUETOOTH','DATECHANGE','SPARE','SPARE','SPARE','SPARE','SPARE','SPARE','SPARE']
errorIdArray = [0,0,0,0,0,0,0,0,0,0]
delayChange = 5
recordStat = 1
runSecondsArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
milisTolerance = 30 #detik
firstRunStat = False
timeHoldPrint = 0

def pinValueCheck(x):
    if x:
        return 0
    else:
        return 1

try:
    mcp1 = MCP23017(i2c)

    pin0 = mcp1.get_pin(0)
    pin1 = mcp1.get_pin(1)
    pin2 = mcp1.get_pin(2)
    pin3 = mcp1.get_pin(3)
    pin4 = mcp1.get_pin(4)
    pin5 = mcp1.get_pin(5)
    pin6 = mcp1.get_pin(6)
    pin7 = mcp1.get_pin(7)
    pin8 = mcp1.get_pin(8)
    pin9 = mcp1.get_pin(9)
    pin10 = mcp1.get_pin(10)
    pin11 = mcp1.get_pin(11)
    pin12 = mcp1.get_pin(12)
    pin13 = mcp1.get_pin(13)
    pin14 = mcp1.get_pin(14)
    pin15 = mcp1.get_pin(15)

    pin0.direction = digitalio.Direction.INPUT
    pin0.pull = digitalio.Pull.UP
    pin1.direction = digitalio.Direction.INPUT
    pin1.pull = digitalio.Pull.UP
    pin2.direction = digitalio.Direction.INPUT
    pin2.pull = digitalio.Pull.UP
    pin3.direction = digitalio.Direction.INPUT
    pin3.pull = digitalio.Pull.UP
    pin4.direction = digitalio.Direction.INPUT
    pin4.pull = digitalio.Pull.UP
    pin5.direction = digitalio.Direction.INPUT
    pin5.pull = digitalio.Pull.UP
    pin6.direction = digitalio.Direction.INPUT
    pin6.pull = digitalio.Pull.UP
    pin7.direction = digitalio.Direction.INPUT
    pin7.pull = digitalio.Pull.UP
    pin8.direction = digitalio.Direction.INPUT
    pin8.pull = digitalio.Pull.UP
    pin9.direction = digitalio.Direction.INPUT
    pin9.pull = digitalio.Pull.UP
    pin10.direction = digitalio.Direction.INPUT
    pin10.pull = digitalio.Pull.UP
    pin11.direction = digitalio.Direction.INPUT
    pin11.pull = digitalio.Pull.UP
    pin12.direction = digitalio.Direction.INPUT
    pin12.pull = digitalio.Pull.UP
    pin13.direction = digitalio.Direction.INPUT
    pin13.pull = digitalio.Pull.UP
    pin14.direction = digitalio.Direction.INPUT
    pin14.pull = digitalio.Pull.UP
    pin15.direction = digitalio.Direction.INPUT
    pin15.pull = digitalio.Pull.UP

    machineArray[0] = pinValueCheck(pin0.value)
    machineArray[1] = pinValueCheck(pin1.value)
    machineArray[2] = pinValueCheck(pin2.value)
    machineArray[3] = pinValueCheck(pin3.value)
    machineArray[4] = pinValueCheck(pin4.value)
    machineArray[5] = pinValueCheck(pin5.value)
    machineArray[6] = pinValueCheck(pin6.value)
    machineArray[7] = pinValueCheck(pin7.value)
    machineArray[8] = pinValueCheck(pin8.value)
    machineArray[9] = pinValueCheck(pin9.value)
    machineArray[10] = pinValueCheck(pin10.value)
    machineArray[11] = pinValueCheck(pin11.value)
    machineArray[12] = pinValueCheck(pin12.value)
    machineArray[13] = pinValueCheck(pin13.value)
    machineArray[14] = pinValueCheck(pin14.value)
    machineArray[15] = pinValueCheck(pin15.value)

except:
    machineArray[0] = 2
    machineArray[1] = 2
    machineArray[2] = 2
    machineArray[3] = 2
    machineArray[4] = 2
    machineArray[5] = 2
    machineArray[6] = 2
    machineArray[7] = 2
    machineArray[8] = 2
    machineArray[9] = 2
    machineArray[10] = 2
    machineArray[11] = 2
    machineArray[12] = 2
    machineArray[13] = 2
    machineArray[14] = 2
    machineArray[15] = 2

try:
    mcp2 = MCP23017(i2c, address=0x21)

    pin16 = mcp2.get_pin(0)
    pin17 = mcp2.get_pin(1)
    pin18 = mcp2.get_pin(2)
    pin19 = mcp2.get_pin(3)
    pin20 = mcp2.get_pin(4)
    pin21 = mcp2.get_pin(5)
    pin22 = mcp2.get_pin(6)
    pin23 = mcp2.get_pin(7)
    pin24 = mcp2.get_pin(8)
    pin25 = mcp2.get_pin(9)
    pin26 = mcp2.get_pin(10)
    pin27 = mcp2.get_pin(11)
    pin28 = mcp2.get_pin(12)
    pin29 = mcp2.get_pin(13)
    pin30 = mcp2.get_pin(14)
    pin31 = mcp2.get_pin(15)

    pin16.direction = digitalio.Direction.INPUT
    pin16.pull = digitalio.Pull.UP
    pin17.direction = digitalio.Direction.INPUT
    pin17.pull = digitalio.Pull.UP
    pin18.direction = digitalio.Direction.INPUT
    pin18.pull = digitalio.Pull.UP
    pin19.direction = digitalio.Direction.INPUT
    pin19.pull = digitalio.Pull.UP
    pin20.direction = digitalio.Direction.INPUT
    pin20.pull = digitalio.Pull.UP
    pin21.direction = digitalio.Direction.INPUT
    pin21.pull = digitalio.Pull.UP
    pin22.direction = digitalio.Direction.INPUT
    pin22.pull = digitalio.Pull.UP
    pin23.direction = digitalio.Direction.INPUT
    pin23.pull = digitalio.Pull.UP
    pin24.direction = digitalio.Direction.INPUT
    pin24.pull = digitalio.Pull.UP
    pin25.direction = digitalio.Direction.INPUT
    pin25.pull = digitalio.Pull.UP
    pin26.direction = digitalio.Direction.INPUT
    pin26.pull = digitalio.Pull.UP
    pin27.direction = digitalio.Direction.INPUT
    pin27.pull = digitalio.Pull.UP
    pin28.direction = digitalio.Direction.INPUT
    pin28.pull = digitalio.Pull.UP
    pin29.direction = digitalio.Direction.INPUT
    pin29.pull = digitalio.Pull.UP
    pin30.direction = digitalio.Direction.INPUT
    pin30.pull = digitalio.Pull.UP
    pin31.direction = digitalio.Direction.INPUT
    pin31.pull = digitalio.Pull.UP

    machineArray[16] = pinValueCheck(pin16.value)
    machineArray[17] = pinValueCheck(pin17.value)
    machineArray[18] = pinValueCheck(pin18.value)
    machineArray[19] = pinValueCheck(pin19.value)
    machineArray[20] = pinValueCheck(pin20.value)
    machineArray[21] = pinValueCheck(pin21.value)
    machineArray[22] = pinValueCheck(pin22.value)
    machineArray[23] = pinValueCheck(pin23.value)
    machineArray[24] = pinValueCheck(pin24.value)
    machineArray[25] = pinValueCheck(pin25.value)
    machineArray[26] = pinValueCheck(pin26.value)
    machineArray[27] = pinValueCheck(pin27.value)
    machineArray[28] = pinValueCheck(pin28.value)
    machineArray[29] = pinValueCheck(pin29.value)
    machineArray[30] = pinValueCheck(pin30.value)
    machineArray[31] = pinValueCheck(pin31.value)

except:
    machineArray[16] = 2
    machineArray[17] = 2
    machineArray[18] = 2
    machineArray[19] = 2
    machineArray[20] = 2
    machineArray[21] = 2
    machineArray[22] = 2
    machineArray[23] = 2
    machineArray[24] = 2
    machineArray[25] = 2
    machineArray[26] = 2
    machineArray[27] = 2
    machineArray[28] = 2
    machineArray[29] = 2
    machineArray[30] = 2
    machineArray[31] = 2

try:
    mcp3 = MCP23017(i2c, address=0x22)
    
    pin32 = mcp3.get_pin(0)
    pin33 = mcp3.get_pin(1)
    pin34 = mcp3.get_pin(2)
    pin35 = mcp3.get_pin(3)
    pin36 = mcp3.get_pin(4)
    pin37 = mcp3.get_pin(5)
    pin38 = mcp3.get_pin(6)
    pin39 = mcp3.get_pin(7)
    pin40 = mcp3.get_pin(8)
    pin41 = mcp3.get_pin(9)
    pin42 = mcp3.get_pin(10)
    pin43 = mcp3.get_pin(11)
    pin44 = mcp3.get_pin(12)
    pin45 = mcp3.get_pin(13)

    pin32.direction = digitalio.Direction.INPUT
    pin32.pull = digitalio.Pull.UP
    pin33.direction = digitalio.Direction.INPUT
    pin33.pull = digitalio.Pull.UP
    pin34.direction = digitalio.Direction.INPUT
    pin34.pull = digitalio.Pull.UP
    pin35.direction = digitalio.Direction.INPUT
    pin35.pull = digitalio.Pull.UP
    pin36.direction = digitalio.Direction.INPUT
    pin36.pull = digitalio.Pull.UP
    pin37.direction = digitalio.Direction.INPUT
    pin37.pull = digitalio.Pull.UP
    pin38.direction = digitalio.Direction.INPUT
    pin38.pull = digitalio.Pull.UP
    pin39.direction = digitalio.Direction.INPUT
    pin39.pull = digitalio.Pull.UP
    pin40.direction = digitalio.Direction.INPUT
    pin40.pull = digitalio.Pull.UP
    pin41.direction = digitalio.Direction.INPUT
    pin41.pull = digitalio.Pull.UP
    pin42.direction = digitalio.Direction.INPUT
    pin42.pull = digitalio.Pull.UP
    pin43.direction = digitalio.Direction.INPUT
    pin43.pull = digitalio.Pull.UP
    pin44.direction = digitalio.Direction.INPUT
    pin44.pull = digitalio.Pull.UP
    pin45.direction = digitalio.Direction.INPUT
    pin45.pull = digitalio.Pull.UP

    machineArray[32] = pinValueCheck(pin32.value)
    machineArray[33] = pinValueCheck(pin33.value)
    machineArray[34] = pinValueCheck(pin34.value)
    machineArray[35] = pinValueCheck(pin35.value)
    machineArray[36] = pinValueCheck(pin36.value)
    machineArray[37] = pinValueCheck(pin37.value)
    machineArray[38] = pinValueCheck(pin38.value)
    machineArray[39] = pinValueCheck(pin39.value)
    machineArray[40] = pinValueCheck(pin40.value)
    machineArray[41] = pinValueCheck(pin41.value)
    machineArray[42] = pinValueCheck(pin42.value)
    machineArray[43] = pinValueCheck(pin43.value)
    machineArray[44] = pinValueCheck(pin44.value)
    machineArray[45] = pinValueCheck(pin45.value)

except:
    machineArray[32] = 2
    machineArray[33] = 2
    machineArray[34] = 2
    machineArray[35] = 2
    machineArray[36] = 2
    machineArray[37] = 2
    machineArray[38] = 2
    machineArray[39] = 2
    machineArray[40] = 2
    machineArray[41] = 2
    machineArray[42] = 2
    machineArray[43] = 2
    machineArray[44] = 2
    machineArray[45] = 2

def getRunSeconds_func(pin):
	db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
	cur = db.cursor()
	cur.execute("SELECT * FROM " + tableArray[pin]) 
	data = cur.fetchall()
	temp = 0
	result = 0
	for x in data:
		tahun 	= int(str(x[1])[0:4])
		bulan 	= int(str(x[1])[5:7])
		tanggal	= int(str(x[1])[8:10])
		y = str(x[2]).split(":")
		jam 	= int(y[0])
		menit 	= int(y[1])
		detik 	= int(y[2])
		dt 		= datetime(tahun,bulan,tanggal,jam,menit,detik)
		milis 	= int(round(dt.timestamp()))
		if x[3]==1:
			temp = milis
		elif x[3]==0:
			result = result + (milis-temp)
	return result

def saveRunSeconds_func(now):
	db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
	cur = db.cursor()
	cur.execute("SELECT * FROM runSecond1") 
	last_id = cur.fetchone()
	tanggal = now.strftime('%Y-%m-%d')
	waktu = now.strftime('%H:%M:%S')

	if last_id is not None:
		cur.execute	(	"UPDATE runSecond1 SET tanggal=(%s), waktu=(%s), spare0=(%s), spare1=(%s), " +
						"spare2=(%s), spare3=(%s), spare4=(%s), spare5=(%s), spare6=(%s), spare7=(%s), spare8=(%s), spare9=(%s), " +
						"spare10=(%s), spare11=(%s), spare12=(%s), spare13=(%s), spare14=(%s), spare15=(%s), spare16=(%s), spare17=(%s), " +
						"spare18=(%s), spare19=(%s), spare20=(%s), spare21=(%s), spare22=(%s), spare23=(%s), spare24=(%s), spare25=(%s), " +
						"spare26=(%s), spare27=(%s), spare28=(%s), spare29=(%s), spare30=(%s), spare31=(%s), spare32=(%s), spare33=(%s), " +
						"spare34=(%s), spare35=(%s), spare36=(%s), spare37=(%s), spare38=(%s), spare39=(%s), spare40=(%s), spare41=(%s), " +
						"spare42=(%s), spare43=(%s), spare44=(%s), spare45=(%s) WHERE id=(%s)", 
					(	tanggal,
						waktu,
						runSecondsArray[0],
						runSecondsArray[1],
						runSecondsArray[2],
						runSecondsArray[3],
						runSecondsArray[4],
						runSecondsArray[5],
						runSecondsArray[6],
						runSecondsArray[7],
						runSecondsArray[8],
						runSecondsArray[9],
						runSecondsArray[10],
						runSecondsArray[11],
						runSecondsArray[12],
						runSecondsArray[13],
						runSecondsArray[14],
						runSecondsArray[15],
						runSecondsArray[16],
						runSecondsArray[17],
						runSecondsArray[18],
						runSecondsArray[19],
						runSecondsArray[20],
						runSecondsArray[21],
						runSecondsArray[22],
						runSecondsArray[23],
						runSecondsArray[24],
						runSecondsArray[25],
						runSecondsArray[26],
						runSecondsArray[27],
						runSecondsArray[28],
						runSecondsArray[29],
						runSecondsArray[30],
						runSecondsArray[31],
						runSecondsArray[32],
						runSecondsArray[33],
						runSecondsArray[34],
						runSecondsArray[35],
						runSecondsArray[36],
						runSecondsArray[37],
						runSecondsArray[38],
						runSecondsArray[39],
						runSecondsArray[40],
						runSecondsArray[41],
						runSecondsArray[42],
						runSecondsArray[43],
						runSecondsArray[44],
						runSecondsArray[45],
						1
					))
		db.commit()	
	else:
		cur.execute	(	"INSERT INTO runSecond1 " +
						"(tanggal,waktu,id,spare0,spare1,spare2,spare3,spare4,spare5,spare6,spare7,spare8,spare9,spare10,spare11,spare12,spare13,spare14,spare15,spare16,spare17,spare18,spare19,spare20,spare21,spare22,spare23,spare24,spare25,spare26,spare27,spare28,spare29,spare30,spare31,spare32,spare33,spare34,spare35,spare36,spare37,spare38,spare39,spare40,spare41,spare42,spare43,spare44,spare45) " +
						"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", 
						(
						tanggal,
						waktu,
						1,
						runSecondsArray[0],
						runSecondsArray[1],
						runSecondsArray[2],
						runSecondsArray[3],
						runSecondsArray[4],
						runSecondsArray[5],
						runSecondsArray[6],
						runSecondsArray[7],
						runSecondsArray[8],
						runSecondsArray[9],
						runSecondsArray[10],
						runSecondsArray[11],
						runSecondsArray[12],
						runSecondsArray[13],
						runSecondsArray[14],
						runSecondsArray[15],
						runSecondsArray[16],
						runSecondsArray[17],
						runSecondsArray[18],
						runSecondsArray[19],
						runSecondsArray[20],
						runSecondsArray[21],
						runSecondsArray[22],
						runSecondsArray[23],
						runSecondsArray[24],
						runSecondsArray[25],
						runSecondsArray[26],
						runSecondsArray[27],
						runSecondsArray[28],
						runSecondsArray[29],
						runSecondsArray[30],
						runSecondsArray[31],
						runSecondsArray[32],
						runSecondsArray[33],
						runSecondsArray[34],
						runSecondsArray[35],
						runSecondsArray[36],
						runSecondsArray[37],
						runSecondsArray[38],
						runSecondsArray[39],
						runSecondsArray[40],
						runSecondsArray[41],
						runSecondsArray[42],
						runSecondsArray[43],
						runSecondsArray[44],
						runSecondsArray[45]
						)
					)
		db.commit()	

	cur.close()
	db.close ()

def firstRun_func():    
    runSecondsArray[0] = getRunSeconds_func(0)
    runSecondsArray[1] = getRunSeconds_func(1)
    runSecondsArray[2] = getRunSeconds_func(2)
    runSecondsArray[3] = getRunSeconds_func(3)
    runSecondsArray[4] = getRunSeconds_func(4)
    runSecondsArray[5] = getRunSeconds_func(5)
    runSecondsArray[6] = getRunSeconds_func(6)
    runSecondsArray[7] = getRunSeconds_func(7)
    runSecondsArray[8] = getRunSeconds_func(8)
    runSecondsArray[9] = getRunSeconds_func(9)
    runSecondsArray[10] = getRunSeconds_func(10)
    runSecondsArray[11] = getRunSeconds_func(11)
    runSecondsArray[12] = getRunSeconds_func(12)
    runSecondsArray[13] = getRunSeconds_func(13)
    runSecondsArray[14] = getRunSeconds_func(14)
    runSecondsArray[15] = getRunSeconds_func(15)
    runSecondsArray[16] = getRunSeconds_func(16)
    runSecondsArray[17] = getRunSeconds_func(17)
    runSecondsArray[18] = getRunSeconds_func(18)
    runSecondsArray[19] = getRunSeconds_func(19)
    runSecondsArray[20] = getRunSeconds_func(20)
    runSecondsArray[21] = getRunSeconds_func(21)
    runSecondsArray[22] = getRunSeconds_func(22)
    runSecondsArray[23] = getRunSeconds_func(23)
    runSecondsArray[24] = getRunSeconds_func(24)
    runSecondsArray[25] = getRunSeconds_func(25)
    runSecondsArray[26] = getRunSeconds_func(26)
    runSecondsArray[27] = getRunSeconds_func(27)
    runSecondsArray[28] = getRunSeconds_func(28)
    runSecondsArray[29] = getRunSeconds_func(29)
    runSecondsArray[30] = getRunSeconds_func(30)
    runSecondsArray[31] = getRunSeconds_func(31)
    runSecondsArray[32] = getRunSeconds_func(32)
    runSecondsArray[33] = getRunSeconds_func(33)
    runSecondsArray[34] = getRunSeconds_func(34)
    runSecondsArray[35] = getRunSeconds_func(35)
    runSecondsArray[36] = getRunSeconds_func(36)
    runSecondsArray[37] = getRunSeconds_func(37)
    runSecondsArray[38] = getRunSeconds_func(38)
    runSecondsArray[39] = getRunSeconds_func(39)
    runSecondsArray[40] = getRunSeconds_func(40)
    runSecondsArray[41] = getRunSeconds_func(41)
    runSecondsArray[42] = getRunSeconds_func(42)
    runSecondsArray[43] = getRunSeconds_func(43)
    runSecondsArray[44] = getRunSeconds_func(44)
    runSecondsArray[45] = getRunSeconds_func(45)

    now = datetime.now()
    saveRunSeconds_func(now)

def updateMachineRecordMethod_func(pin):
	global delayOffArray
	global delayOnArray
	global machineArray
	global recordMethodArray

	if delayOnArray[pin]==0 and delayOffArray[pin]==0: #first run
		if machineArray[pin]==1:
			delayOnArray[pin] = delayChange
			delayOffArray[pin] = 0
			recordMethodArray[pin] = 1
		else:
			delayOnArray[pin] = 0
			delayOffArray[pin] = delayChange
			recordMethodArray[pin] = 0
	else:
		if machineArray[pin]==1:
			delayOnArray[pin] = delayOnArray[pin] + 1
			if delayOnArray[pin]>delayChange:
				delayOnArray[pin] = delayChange
				delayOffArray[pin] = 0
				if recordMethodArray[pin]==0:
					recordMethodArray[pin]=1
				
		else:
			delayOffArray[pin] = delayOffArray[pin] + 1
			if delayOffArray[pin]>delayChange:
				delayOffArray[pin] = delayChange
				delayOnArray[pin] = 0
				recordMethodArray[pin]=0

def rekamPerUpdate_func(pin,now,milis):
	global recordMethodArray
	global dateRecordArray

	if recordMethodArray[pin]==1:
		db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
		cur = db.cursor()
		cur.execute("SELECT * FROM " + tableArray[pin] + " ORDER BY id DESC LIMIT 1") 
		last_id = cur.fetchone()
		tanggal = now.strftime('%Y-%m-%d')
		waktu = now.strftime('%H:%M:%S')
		dateRecordArray[pin] = tanggal
		if last_id is not None:
			cur.execute("INSERT INTO " + tableArray[pin] + " (date,time,id,stat) VALUES (%s,%s,%s,%s)", (tanggal,waktu,(int(last_id[0])+1),1))
			cur.execute("INSERT INTO " + tableArray[pin] + " (date,time,id,stat) VALUES (%s,%s,%s,%s)", (tanggal,waktu,(int(last_id[0])+2),0))
			db.commit()	
		else:
			cur.execute("INSERT INTO " + tableArray[pin] + " (date,time,id,stat) VALUES (%s,%s,%s,%s)", (tanggal,waktu,1,1))
			cur.execute("INSERT INTO " + tableArray[pin] + " (date,time,id,stat) VALUES (%s,%s,%s,%s)", (tanggal,waktu,2,0))
			db.commit()
		cur.close()
		db.close ()
		recordLastMilisArray[pin] = milis
		recordMethodArray[pin]=2

	elif recordMethodArray[pin]==2:
		db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
		cur = db.cursor()
		cur.execute("SELECT * FROM " + tableArray[pin] + " ORDER BY id DESC LIMIT 1") 
		last_id = cur.fetchone()
		tanggal = now.strftime('%Y-%m-%d')
		waktu = now.strftime('%H:%M:%S')

		if tanggal!=dateRecordArray[pin]:
			if last_id is not None:
				cur.execute	("UPDATE " + tableArray[pin] + " SET date=(%s), time=(%s), stat=(%s) WHERE id=(%s)", 
							(dateRecordArray[pin],"23:59:59",2,int(last_id[0])))
				cur.execute	("INSERT INTO " + tableArray[pin] + " (date,time,id,stat) VALUES (%s,%s,%s,%s)", 
							(tanggal,"00:00:00",(int(last_id[0])+1),3))
				cur.execute	("INSERT INTO " + tableArray[pin] + " (date,time,id,stat) VALUES (%s,%s,%s,%s)", 
							(tanggal,waktu,(int(last_id[0])+2),0))		
				db.commit()	
				runSecondsArray[pin] = runSecondsArray[pin] + (milis - recordLastMilisArray[pin])
				recordLastMilisArray[pin] = milis
			dateRecordArray[pin] = tanggal
		else:
			if last_id is not None:
				cur.execute	("UPDATE " + tableArray[pin] + " SET date=(%s), time=(%s), stat=(%s) WHERE id=(%s)", 
							(tanggal,waktu,0,int(last_id[0])))
				db.commit()
				runSecondsArray[pin] = runSecondsArray[pin] + (milis - recordLastMilisArray[pin])
				recordLastMilisArray[pin] = milis
			cur.close()
			db.close ()

def updateActiveMachine_func():
	db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
	cur = db.cursor()
	cur.execute("SELECT * FROM activeMachine1") 
	last_id = cur.fetchone()
	now = datetime.now()
	tanggal = now.strftime('%Y-%m-%d')
	waktu = now.strftime('%H:%M:%S')

	if last_id is not None:
		cur.execute	(	"UPDATE activeMachine1 SET tanggal=(%s), waktu=(%s), spare0=(%s), spare1=(%s), " +
						"spare2=(%s), spare3=(%s), spare4=(%s), spare5=(%s), spare6=(%s), spare7=(%s), spare8=(%s), spare9=(%s), " +
						"spare10=(%s), spare11=(%s), spare12=(%s), spare13=(%s), spare14=(%s), spare15=(%s), spare16=(%s), spare17=(%s), " +
						"spare18=(%s), spare19=(%s), spare20=(%s), spare21=(%s), spare22=(%s), spare23=(%s), spare24=(%s), spare25=(%s), " +
						"spare26=(%s), spare27=(%s), spare28=(%s), spare29=(%s), spare30=(%s), spare31=(%s), spare32=(%s), spare33=(%s), " +
						"spare34=(%s), spare35=(%s), spare36=(%s), spare37=(%s), spare38=(%s), spare39=(%s), spare40=(%s), spare41=(%s), " +
						"spare42=(%s), spare43=(%s), spare44=(%s), spare45=(%s) WHERE id=(%s)",
					(	tanggal,
						waktu,
						machineArray[0],
						machineArray[1],
						machineArray[2],
						machineArray[3],
						machineArray[4],
						machineArray[5],
						machineArray[6],
						machineArray[7],
						machineArray[8],
						machineArray[9],
						machineArray[10],
						machineArray[11],
						machineArray[12],
						machineArray[13],
						machineArray[14],
						machineArray[15],
						machineArray[16],
						machineArray[17],
						machineArray[18],
						machineArray[19],
						machineArray[20],
						machineArray[21],
						machineArray[22],
						machineArray[23],
						machineArray[24],
						machineArray[25],
						machineArray[26],
						machineArray[27],
						machineArray[28],
						machineArray[29],
						machineArray[30],
						machineArray[31],
						machineArray[32],
						machineArray[33],
						machineArray[34],
						machineArray[35],
						machineArray[36],
						machineArray[37],
						machineArray[38],
						machineArray[39],
						machineArray[40],
						machineArray[41],
						machineArray[42],
						machineArray[43],
						machineArray[44],
						machineArray[45],
						1
					))
		db.commit()	
	else:
		cur.execute	(	"INSERT INTO activeMachine1 " +
						"(tanggal,waktu,id,spare0,spare1,spare2,spare3,spare4,spare5,spare6,spare7,spare8,spare9,spare10,spare11,spare12,spare13,spare14,spare15,spare16,spare17,spare18,spare19,spare20,spare21,spare22,spare23,spare24,spare25,spare26,spare27,spare28,spare29,spare30,spare31,spare32,spare33,spare34,spare35,spare36,spare37,spare38,spare39,spare40,spare41,spare42,spare43,spare44,spare45) " +
						"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", 
						(
						tanggal,
						waktu,
						1,
						machineArray[0],
						machineArray[1],
						machineArray[2],
						machineArray[3],
						machineArray[4],
						machineArray[5],
						machineArray[6],
						machineArray[7],
						machineArray[8],
						machineArray[9],
						machineArray[10],
						machineArray[11],
						machineArray[12],
						machineArray[13],
						machineArray[14],
						machineArray[15],
						machineArray[16],
						machineArray[17],
						machineArray[18],
						machineArray[19],
						machineArray[20],
						machineArray[21],
						machineArray[22],
						machineArray[23],
						machineArray[24],
						machineArray[25],
						machineArray[26],
						machineArray[27],
						machineArray[28],
						machineArray[29],
						machineArray[30],
						machineArray[31],
						machineArray[32],
						machineArray[33],
						machineArray[34],
						machineArray[35],
						machineArray[36],
						machineArray[37],
						machineArray[38],
						machineArray[39],
						machineArray[40],
						machineArray[41],
						machineArray[42],
						machineArray[43],
						machineArray[44],
						machineArray[45]
						)
					)
		db.commit()	

	cur.close()
	db.close ()

def thread_func():
	while True:
		time.sleep(1)
		if machineArray[0] != 2:
		    machineArray[0] = pinValueCheck(pin0.value)
		    machineArray[1] = pinValueCheck(pin1.value)
		    machineArray[2] = pinValueCheck(pin2.value)
		    machineArray[3] = pinValueCheck(pin3.value)
		    machineArray[4] = pinValueCheck(pin4.value)
		    machineArray[5] = pinValueCheck(pin5.value)
		    machineArray[6] = pinValueCheck(pin6.value)
		    machineArray[7] = pinValueCheck(pin7.value)
		    machineArray[8] = pinValueCheck(pin8.value)
		    machineArray[9] = pinValueCheck(pin9.value)
		    machineArray[10] = pinValueCheck(pin10.value)
		    machineArray[11] = pinValueCheck(pin11.value)
		    machineArray[12] = pinValueCheck(pin12.value)
		    machineArray[13] = pinValueCheck(pin13.value)
		    machineArray[14] = pinValueCheck(pin14.value)
		    machineArray[15] = pinValueCheck(pin15.value)

		if machineArray[16] != 2:
		    machineArray[16] = pinValueCheck(pin16.value)
		    machineArray[17] = pinValueCheck(pin17.value)
		    machineArray[18] = pinValueCheck(pin18.value)
		    machineArray[19] = pinValueCheck(pin19.value)
		    machineArray[20] = pinValueCheck(pin20.value)
		    machineArray[21] = pinValueCheck(pin21.value)
		    machineArray[22] = pinValueCheck(pin22.value)
		    machineArray[23] = pinValueCheck(pin23.value)
		    machineArray[24] = pinValueCheck(pin24.value)
		    machineArray[25] = pinValueCheck(pin25.value)
		    machineArray[26] = pinValueCheck(pin26.value)
		    machineArray[27] = pinValueCheck(pin27.value)
		    machineArray[28] = pinValueCheck(pin28.value)
		    machineArray[29] = pinValueCheck(pin29.value)
		    machineArray[30] = pinValueCheck(pin30.value)
		    machineArray[31] = pinValueCheck(pin31.value)

		if machineArray[32] != 2:
		    machineArray[32] = pinValueCheck(pin32.value)
		    machineArray[33] = pinValueCheck(pin33.value)
		    machineArray[34] = pinValueCheck(pin34.value)
		    machineArray[35] = pinValueCheck(pin35.value)
		    machineArray[36] = pinValueCheck(pin36.value)
		    machineArray[37] = pinValueCheck(pin37.value)
		    machineArray[38] = pinValueCheck(pin38.value)
		    machineArray[39] = pinValueCheck(pin39.value)
		    machineArray[40] = pinValueCheck(pin40.value)
		    machineArray[41] = pinValueCheck(pin41.value)
		    machineArray[42] = pinValueCheck(pin42.value)
		    machineArray[43] = pinValueCheck(pin43.value)
		    machineArray[44] = pinValueCheck(pin44.value)
		    machineArray[45] = pinValueCheck(pin45.value)

firstRun_func()
thread1 = threading.Thread(target=thread_func)
thread1.start()

while True :
    updateMachineRecordMethod_func(0)
    updateMachineRecordMethod_func(1)
    updateMachineRecordMethod_func(2)
    updateMachineRecordMethod_func(3)
    updateMachineRecordMethod_func(4)
    updateMachineRecordMethod_func(5)
    updateMachineRecordMethod_func(6)
    updateMachineRecordMethod_func(7)
    updateMachineRecordMethod_func(8)
    updateMachineRecordMethod_func(9)
    updateMachineRecordMethod_func(10)
    updateMachineRecordMethod_func(11)
    updateMachineRecordMethod_func(12)
    updateMachineRecordMethod_func(13)
    updateMachineRecordMethod_func(14)
    updateMachineRecordMethod_func(15)
    updateMachineRecordMethod_func(16)
    updateMachineRecordMethod_func(17)
    updateMachineRecordMethod_func(18)
    updateMachineRecordMethod_func(19)
    updateMachineRecordMethod_func(20)
    updateMachineRecordMethod_func(21)
    updateMachineRecordMethod_func(22)
    updateMachineRecordMethod_func(23)
    updateMachineRecordMethod_func(24)
    updateMachineRecordMethod_func(25)
    updateMachineRecordMethod_func(26)
    updateMachineRecordMethod_func(27)
    updateMachineRecordMethod_func(28)
    updateMachineRecordMethod_func(29)
    updateMachineRecordMethod_func(30)
    updateMachineRecordMethod_func(31)
    updateMachineRecordMethod_func(32)
    updateMachineRecordMethod_func(33)
    updateMachineRecordMethod_func(34)
    updateMachineRecordMethod_func(35)
    updateMachineRecordMethod_func(36)
    updateMachineRecordMethod_func(37)
    updateMachineRecordMethod_func(38)
    updateMachineRecordMethod_func(39)
    updateMachineRecordMethod_func(40)
    updateMachineRecordMethod_func(41)
    updateMachineRecordMethod_func(42)
    updateMachineRecordMethod_func(43)
    updateMachineRecordMethod_func(44)
    updateMachineRecordMethod_func(45)
    updateActiveMachine_func()

    now = datetime.now()
    milis = int(round(time.time()))
    firstRunStat = True

    try:
        temp1 = open("/var/www/html/fullAccess/runHourStat.txt", "r")
        recordStat = int(temp1.read())
        temp1.flush()
        temp1.close()

    except:
        pass

    if recordStat==1:
        rekamPerUpdate_func(0,now,milis)
        rekamPerUpdate_func(1,now,milis)
        rekamPerUpdate_func(2,now,milis)
        rekamPerUpdate_func(3,now,milis)
        rekamPerUpdate_func(4,now,milis)
        rekamPerUpdate_func(5,now,milis)
        rekamPerUpdate_func(6,now,milis)
        rekamPerUpdate_func(7,now,milis)
        rekamPerUpdate_func(8,now,milis)
        rekamPerUpdate_func(9,now,milis)
        rekamPerUpdate_func(10,now,milis)
        rekamPerUpdate_func(11,now,milis)
        rekamPerUpdate_func(12,now,milis)
        rekamPerUpdate_func(13,now,milis)
        rekamPerUpdate_func(14,now,milis)
        rekamPerUpdate_func(15,now,milis)
        rekamPerUpdate_func(16,now,milis)
        rekamPerUpdate_func(17,now,milis)
        rekamPerUpdate_func(18,now,milis)
        rekamPerUpdate_func(19,now,milis)
        rekamPerUpdate_func(20,now,milis)
        rekamPerUpdate_func(21,now,milis)
        rekamPerUpdate_func(22,now,milis)
        rekamPerUpdate_func(23,now,milis)
        rekamPerUpdate_func(24,now,milis)
        rekamPerUpdate_func(25,now,milis)
        rekamPerUpdate_func(26,now,milis)
        rekamPerUpdate_func(27,now,milis)
        rekamPerUpdate_func(28,now,milis)
        rekamPerUpdate_func(29,now,milis)
        rekamPerUpdate_func(30,now,milis)
        rekamPerUpdate_func(31,now,milis)
        rekamPerUpdate_func(32,now,milis)
        rekamPerUpdate_func(33,now,milis)
        rekamPerUpdate_func(34,now,milis)
        rekamPerUpdate_func(35,now,milis)
        rekamPerUpdate_func(36,now,milis)
        rekamPerUpdate_func(37,now,milis)
        rekamPerUpdate_func(38,now,milis)
        rekamPerUpdate_func(39,now,milis)
        rekamPerUpdate_func(40,now,milis)
        rekamPerUpdate_func(41,now,milis)
        rekamPerUpdate_func(42,now,milis)
        rekamPerUpdate_func(43,now,milis)
        rekamPerUpdate_func(44,now,milis)
        rekamPerUpdate_func(45,now,milis)
        saveRunSeconds_func(now)
    time.sleep(1)
