#!/usr/bin/python

import time 
from time import sleep
from datetime import datetime, date, timedelta
import MySQLdb
import RPi.GPIO as GPIO
import bluetooth
import threading

buttonArray = [29,31,26,24,21,19,23,32,33,13,22,36,11,12,35,38,40,15,1]
LED1 = 16
LED2 = 18
LED3 = 7
tableArray = ["cbc1","cbc2","prs1","prs2","prs3","prs4","prs5","prs6","prs7","prs8","dtr1","dtr2","dtr3","dtr4","dtr5","dtr6","dtr7","dtr8","rpi"]
machineArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
delayOnArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
delayOffArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
recordMethodArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
recordLastMilisArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
dateRecordArray = ["","","","","","","","","","","","","","","","","","",""]
errorNameArray = ['RTC','BLUETOOTH','DATECHANGE','SPARE','SPARE','SPARE','SPARE','SPARE','SPARE','SPARE']
errorIdArray = [0,0,0,0,0,0,0,0,0,0]
delayChange = 2
recordStat = 1
runSecondsArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
milisTolerance = 30 #detik
firstRunStat = False
timeHoldPrint = 0

def handle(pin):
	global machineArray
	if GPIO.input(pin):
		machineArray[pin] = 0
	else:
		machineArray[pin] = 1

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
	cur.execute("SELECT * FROM runSecond") 
	last_id = cur.fetchone()
	tanggal = now.strftime('%Y-%m-%d')
	waktu = now.strftime('%H:%M:%S')

	if last_id is not None:
		cur.execute	(	"UPDATE runSecond SET tanggal=(%s), waktu=(%s), CBC1=(%s), CBC2=(%s), " +
						"PRS1=(%s), PRS2=(%s), PRS3=(%s), PRS4=(%s), PRS5=(%s), PRS6=(%s), PRS7=(%s), PRS8=(%s), " +
						"DTR1=(%s), DTR2=(%s), DTR3=(%s), DTR4=(%s), DTR5=(%s), DTR6=(%s), DTR7=(%s), DTR8=(%s), RPI=(%s) WHERE id=(%s)", 
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
						1
					))
		db.commit()	
	else:
		cur.execute	(	"INSERT INTO runSecond " +
						"(tanggal,waktu,id,CBC1,CBC2,PRS1,PRS2,PRS3,PRS4,PRS5,PRS6,PRS7,PRS8,DTR1,DTR2,DTR3,DTR4,DTR5,DTR6,DTR7,DTR8,RPI) " +
						"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", 
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
						runSecondsArray[18]
						)
					)
		db.commit()	

	cur.close()
	db.close ()

def firstRun_func():
	global buttonArray
	GPIO.setup(LED1, GPIO.OUT)
	GPIO.setup(LED2, GPIO.OUT)
	GPIO.setup(LED3, GPIO.OUT)
	GPIO.output(LED1, GPIO.HIGH)
	GPIO.output(LED2, GPIO.LOW)
	GPIO.output(LED3, GPIO.LOW)
	GPIO.setup(buttonArray[0], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[1], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[2], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[3], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[4], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[5], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[6], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[7], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[8], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[9], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[10], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[11], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[12], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[13], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[14], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[15], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[16], GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(buttonArray[17], GPIO.IN, pull_up_down=GPIO.PUD_UP)	
	handle(buttonArray[0])
	handle(buttonArray[1])
	handle(buttonArray[2])
	handle(buttonArray[3])
	handle(buttonArray[4])
	handle(buttonArray[5])
	handle(buttonArray[6])
	handle(buttonArray[7])
	handle(buttonArray[8])
	handle(buttonArray[9])
	handle(buttonArray[10])
	handle(buttonArray[11])
	handle(buttonArray[12])
	handle(buttonArray[13])
	handle(buttonArray[14])
	handle(buttonArray[15])
	handle(buttonArray[16])
	handle(buttonArray[17])
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

	now = datetime.now()
	saveRunSeconds_func(now)

def alarmRecord(pin,stat,now):
	global errorIdArray
	if errorIdArray[pin]==0 and stat==1:
		errorIdArray[pin] = 1
		tanggal = now.strftime('%Y-%m-%d')
		waktu = now.strftime('%H:%M:%S')
		db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
		cur = db.cursor()
		cur.execute("SELECT * FROM alarm ORDER BY id DESC LIMIT 1") 
		last_id = cur.fetchone()
		if last_id is not None:
			cur.execute("INSERT INTO alarm (date,time,id,alarm_id,alarm_name) VALUES (%s,%s,%s,%s,%s)", (tanggal,waktu,(int(last_id[0])+1),pin,errorNameArray[pin]))
			db.commit()
		else:
			cur.execute("INSERT INTO alarm (date,time,id,alarm_id,alarm_name) VALUES (%s,%s,%s,%s,%s)", (tanggal,waktu,1,pin,errorNameArray[pin]))
			db.commit()
		cur.close()
		db.close ()

	elif errorIdArray[pin]==1 and stat==0:
		errorIdArray[pin] = 0

def updateMachineRecordMethod_func(pin):
	global delayOffArray
	global delayOnArray
	global machineArray
	global recordMethodArray
	global buttonArray

	if delayOnArray[buttonArray[pin]]==0 and delayOffArray[buttonArray[pin]]==0: #first run
		if machineArray[buttonArray[pin]]==1:
			delayOnArray[buttonArray[pin]] = delayChange
			delayOffArray[buttonArray[pin]] = 0
			recordMethodArray[buttonArray[pin]] = 1
		else:
			delayOnArray[buttonArray[pin]] = 0
			delayOffArray[buttonArray[pin]] = delayChange
			recordMethodArray[buttonArray[pin]] = 0
	else:
		if machineArray[buttonArray[pin]]==1:
			delayOnArray[buttonArray[pin]] = delayOnArray[buttonArray[pin]] + 1
			if delayOnArray[buttonArray[pin]]>delayChange:
				delayOnArray[buttonArray[pin]] = delayChange
				delayOffArray[buttonArray[pin]] = 0
				if recordMethodArray[buttonArray[pin]]==0:
					recordMethodArray[buttonArray[pin]]=1
				
		else:
			delayOffArray[buttonArray[pin]] = delayOffArray[buttonArray[pin]] + 1
			if delayOffArray[buttonArray[pin]]>delayChange:
				delayOffArray[buttonArray[pin]] = delayChange
				delayOnArray[buttonArray[pin]] = 0
				recordMethodArray[buttonArray[pin]]=0

def rekamPerUpdate_func(pin,now,milis):
	global recordMethodArray
	global buttonArray
	global dateRecordArray

	if recordMethodArray[buttonArray[pin]]==1:
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
		recordMethodArray[buttonArray[pin]]=2

	elif recordMethodArray[buttonArray[pin]]==2:
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

def cekRTCerror_func(now,milis):
	global recordStat
	db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
	cur = db.cursor()
	cur.execute("SELECT * FROM lastMilisRecord") 
	last_id = cur.fetchone()
	tanggal = now.strftime('%Y-%m-%d')
	waktu = now.strftime('%H:%M:%S')

	if last_id is not None:
		if last_id[1]>=milis:
			alarmRecord(0,1,now)
			recordStat = 0
		elif (milis-last_id[1])>=milisTolerance and firstRunStat:
			alarmRecord(2,1,now)
			recordStat = 1
		else:
			alarmRecord(0,0,now)
			alarmRecord(2,0,now)
			recordStat = 1
			cur.execute	("UPDATE lastMilisRecord SET lastMilis=(%s), tanggal=(%s), waktu=(%s) WHERE id=(%s)", (milis,tanggal,waktu,1))
			db.commit()	
	else:
		alarmRecord(0,0,now)
		alarmRecord(2,0,now)
		recordStat = 1
		cur.execute("INSERT INTO lastMilisRecord (id,lastMilis,tanggal,waktu) VALUES (%s,%s,%s,%s)", (1,milis,tanggal,waktu))
		db.commit()	

	# cur.execute("SELECT * FROM lastMilisRecord") 
	# last_id = cur.fetchall()
	# for lastID in last_id:
    # 		print(lastID)
	cur.close()
	db.close ()

def updateActiveMachine_func():
	db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
	cur = db.cursor()
	cur.execute("SELECT * FROM activeMachine") 
	last_id = cur.fetchone()
	now = datetime.now()
	tanggal = now.strftime('%Y-%m-%d')
	waktu = now.strftime('%H:%M:%S')

	if last_id is not None:
		cur.execute	(	"UPDATE activeMachine SET tanggal=(%s), waktu=(%s), CBC1=(%s), CBC2=(%s), " +
						"PRS1=(%s), PRS2=(%s), PRS3=(%s), PRS4=(%s), PRS5=(%s), PRS6=(%s), PRS7=(%s), PRS8=(%s), " +
						"DTR1=(%s), DTR2=(%s), DTR3=(%s), DTR4=(%s), DTR5=(%s), DTR6=(%s), DTR7=(%s), DTR8=(%s) WHERE id=(%s)", 
					(	tanggal,
						waktu,
						machineArray[buttonArray[0]],
						machineArray[buttonArray[1]],
						machineArray[buttonArray[2]],
						machineArray[buttonArray[3]],
						machineArray[buttonArray[4]],
						machineArray[buttonArray[5]],
						machineArray[buttonArray[6]],
						machineArray[buttonArray[7]],
						machineArray[buttonArray[8]],
						machineArray[buttonArray[9]],
						machineArray[buttonArray[10]],
						machineArray[buttonArray[11]],
						machineArray[buttonArray[12]],
						machineArray[buttonArray[13]],
						machineArray[buttonArray[14]],
						machineArray[buttonArray[15]],
						machineArray[buttonArray[16]],
						machineArray[buttonArray[17]],
						1
					))
		db.commit()	
	else:
		cur.execute	(	"INSERT INTO activeMachine " +
						"(tanggal,waktu,id,CBC1,CBC2,PRS1,PRS2,PRS3,PRS4,PRS5,PRS6,PRS7,PRS8,DTR1,DTR2,DTR3,DTR4,DTR5,DTR6,DTR7,DTR8) " +
						"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", 
						(
						tanggal,
						waktu,
						1,
						machineArray[buttonArray[0]],
						machineArray[buttonArray[1]],
						machineArray[buttonArray[2]],
						machineArray[buttonArray[3]],
						machineArray[buttonArray[4]],
						machineArray[buttonArray[5]],
						machineArray[buttonArray[6]],
						machineArray[buttonArray[7]],
						machineArray[buttonArray[8]],
						machineArray[buttonArray[9]],
						machineArray[buttonArray[10]],
						machineArray[buttonArray[11]],
						machineArray[buttonArray[12]],
						machineArray[buttonArray[13]],
						machineArray[buttonArray[14]],
						machineArray[buttonArray[15]],
						machineArray[buttonArray[16]],
						machineArray[buttonArray[17]]
						)
					)
		db.commit()	
	
	# cur.execute("SELECT * FROM activeMachine") 
	# last_id = cur.fetchall()
	# for lastID in last_id:
	# 	print(lastID)

	cur.close()
	db.close ()

def doPrint_function():
	printData = ""

	try:           
		fileRead = open("/var/www/html/fullAccess/printPreview.txt", "r")
		printData = fileRead.read()
		fileRead.flush()
		fileRead.close()	
	except:
		pass

	try:
		with open("/var/www/html/fullAccess/printPreview.txt", "r+") as f:
			f.write("")
			f.flush()
			f.close()
	except:
		pass

	try:           
		fileRead = open("/var/www/html/fullAccess/bluetoothMAC.txt", "r")
		bd_addr = str(fileRead.readline())
		port = 1
		fileRead.flush()
		fileRead.close()
	except:
		bd_addr = "00:00:00:00:00:00"
		port = 1

	result = bluetooth.lookup_name(bd_addr, timeout=5)
	now = datetime.now()         

	if (result == None):
		now = datetime.now()
		alarmRecord(1,1,now)
		alarmRecord(1,0,now)
		
		try:
			with open("/var/www/html/fullAccess/printProses.txt", "r+") as f:
				f.write("2")
				f.flush()
				f.close()
		except:
			pass

	else:
		try:
			sock=bluetooth.BluetoothSocket(bluetooth.RFCOMM)
			sock.connect((bd_addr, port))
			sock.send(printData)
			sock.close()
		except:
			now = datetime.now()
			alarmRecord(1,1,now)
			alarmRecord(1,0,now)
			try:
				with open("/var/www/html/fullAccess/printProses.txt", "r+") as f:
					f.write("2")
					f.flush()
					f.close()
			except:
				pass

		try:
			with open("/var/www/html/fullAccess/printProses.txt", "r+") as f:
				f.write("0")
				f.flush()
				f.close()
		except:
			pass

def print_function():
	printProses = "0"
	global timeHoldPrint

	try:
		with open("/var/www/html/fullAccess/printAccess.txt", "r+") as f:
			f.write("0")
			f.flush()
			f.close()
	except:
		pass

	try:           
		temp1 = open("/var/www/html/fullAccess/printProses.txt", "r")
		printProses = temp1.read()
		temp1.flush()
		temp1.close()	
	except:
		pass

	if printProses == "1":
		GPIO.output(LED2, GPIO.HIGH)
		print("led on")
		doPrint_function()
		GPIO.output(LED2, GPIO.LOW)
		print("led off")
		timeHoldPrint = -1

	timeHoldPrint = timeHoldPrint + 1
	if timeHoldPrint >= 10:
		timeHoldPrint = 10
		try:
			with open("/var/www/html/fullAccess/printAccess.txt", "r+") as f:
				f.write("1")
				f.flush()
				f.close()
		except:
			pass

def thread_func():
	while True:
		handle(buttonArray[0])
		handle(buttonArray[1])
		handle(buttonArray[2])
		handle(buttonArray[3])
		handle(buttonArray[4])
		handle(buttonArray[5])
		handle(buttonArray[6])
		handle(buttonArray[7])
		handle(buttonArray[8])
		handle(buttonArray[9])
		handle(buttonArray[10])
		handle(buttonArray[11])
		handle(buttonArray[12])
		handle(buttonArray[13])
		handle(buttonArray[14])
		handle(buttonArray[15])
		handle(buttonArray[16])
		handle(buttonArray[17])		
		time.sleep(1)

def remoteControl_func():
	db = MySQLdb.connect(host="localhost", user="admin", passwd="qweytr123654%", db="logging")
	cur = db.cursor()
	cur.execute("SELECT * FROM remoteControl")
	last_id = cur.fetchone()

	if last_id is not None:
		try:
			with open("/var/www/html/fullAccess/remoteControl.txt", "w") as f:
				f.write(str(last_id[1]))
				f.flush()
				f.close()
		except:
			pass

firstRun_func()
thread1 = threading.Thread(target=thread_func)
thread1.start()
recordMethodArray[buttonArray[18]] = 1 #record for rpi - always on pin

while True :
	now = datetime.now()
	milis = int(round(time.time()))
	cekRTCerror_func(now,milis)
	firstRunStat = True
	remoteControl_func()

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
	#updateMachineRecordMethod_func(18) record for rpi - always on pin
	updateActiveMachine_func()
	print_function()

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
		saveRunSeconds_func(now)
		GPIO.output(LED1, GPIO.LOW)

		try:
			with open("/var/www/html/fullAccess/runHourStat.txt", "w") as f:
				f.write("1")
				f.flush()
				f.close()
		except:
			pass

	else:
		GPIO.output(LED1, GPIO.HIGH)

		try:
			with open("/var/www/html/fullAccess/runHourStat.txt", "w") as f:
				f.write("0")
				f.flush()
				f.close()
		except:
			pass

	time.sleep(1)
	GPIO.output(LED1, GPIO.HIGH)
	time.sleep(1)
