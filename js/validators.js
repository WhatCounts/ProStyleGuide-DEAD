/* removes leading & trailing whitespace from a string. */
function trimString(str) {
    str = this != window ? this : str;
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
}
String.prototype.trim = trimString; // add this method to the String prototype object

function validateEmailAddress(addr) {
    var filter  = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(addr.trim());
}

function validateIPAddress(addr) {
    var filter = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return filter.test(addr.trim());
}

//Will match: 11/30/2003 10:12:24 am | 2/29/2003 08:14:56 pm | 5/22/2003
function validateDate(date) {
	var filter = /^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[13-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
	return filter.test((date + "").trim())
}

function validateDate4Digit(date) {
	if(validateDate(date)) {
		//Check to make sure the last digit isn't 2 (cannot find an easy way to currently do this). If you can update that regex to do it then by all means.
		return date.split(/[-\/|\.]/)[2].length == 4;
	}
	return false;
}

function validateTime(time) {
	var filter = /^ *(1[0-2]|0{0,1}[1-9]):[0-5][0-9] *(a|p|A|P)(m|M) *$/;
	return filter.test((time + "").trim());
}

function validatePersonalName(name) {
	var filter = /^[\w\.\']{2,}([\s][\w\.\']{2,})+$/;
	return filter.test(trimString(name));
}

function validatePosNumber(number) {
	var filter = /^\d*\.{0,1}\d+$/;
	return filter.test(trimString(number));
}

function validateURL(url) {
	var filter = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
	return filter.test(url.trim());
}

function isHTML(html) {
	var filter = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
	return filter.test(html.trim());
}

/* 
 * Returns list of errors if any exist 
 * Error of invalid earlierDate
 * Error of invalid laterDate
 * Error if invalid startTime (Only if exists)
 * Error if startTime prior to now (Only if beforeNowCheck == true)
 * Error of laterDate prior to earlierDate 
 **/
//Params: bothRequired[start,end,time], endDate, startDate, startTime, beforeNowCheck[true/false]
function validateDates(params) {
	errors = [];
	//First check if bothRequired exists.
	var startDate = params.startDate;
	var endDate = params.endDate;
	var startTime = params.startTime;
	var required = params.required;
	var timeArray = [];
	//If both are required we will not validate any further until they are both provided.
	
	if((required.indexOf('start') > -1 && required.indexOf('end') > -1) && (startDate == null || endDate == null)) {
		//alert('Both start date and end date are required');
		errors.push('<li>' + 'Both start date and end date are required' + '</li>');
		return errors.join('');
	} else if(params.required != null) {
		if(required.indexOf('start') > -1) {
			if(startDate == null || startDate == "") {
				errors.push('<li>' + 'Start date is required' + '</li>');
			} else if(!validateDate4Digit(startDate)) {
				errors.push('<li>' + 'Start date is in a invalid format' + '</li>');
			}
		} else if(startDate != null && startDate != "" && !validateDate(startDate)) { //Not required but exists.
			errors.push('<li>' + 'Start date is in a invalid format' + '</li>');
		}
		if(required.indexOf('end') > -1) {
			if(endDate == null || endDate == "") {
				errors.push('<li>' + 'End date is required' + '</li>');
			} else if(!validateDate(endDate)) {
				errors.push('<li>' + 'End date is in a invalid format' + '</li>');
			}
		} else if(endDate != null && endDate != "" && !validateDate(endDate)) { //Not required but exists.
			errors.push('<li>' + 'End date is in a invalid format' + '</li>');
		}
		
		if(required.indexOf('time') > -1) {
			if(startTime == null) {
				errors.push('<li>' + 'Start time is required' + '</li>');
			} else if(!validateTime(startTime)) {
				errors.push('<li>' + 'Start time is in a invalid format' + '</li>');
			} else {
				//Time is valid
			 	//alert('time IS required and converting');
				timeArray = convertTimetoArray(startTime);
			}
		} else if(startTime != null) { //Not required but exists.
			 if(!validateTime(startTime)) {
				errors.push('<li>' + 'End date is in a invalid format' + '</li>'); 
			 } else {
			 	//Time is valid
			 	//alert('time is valid but not required and converting');
				timeArray = convertTimetoArray(startTime);			 	
			 }			 
			
		} else {
			//Doesn't exist but will convert to array current time.
			timeArray = [new Date().getHours(), new Date().getMinutes()];
		}
		//alert(errors.join('\n'));
		if(errors.length > 0) {
			return errors.join('');
		}
	}
	//At this point we know both Start Date, End Date  and Start Time exist if they should and valid if they do. 
	//Start Time is now in timeArray which can be appended if required to.
	var endDateArray;
	var startDateArray;
	
	if(endDate != null) {
		endDateArray = endDate.split(/[\/|-|\.]/);
		endDate = new Date(endDateArray[2], endDateArray[0]-1, endDateArray[1], timeArray[0], timeArray[1], 59, 59);
	}
	if(startDate != null) {
		startDateArray = startDate.split(/[\/|-|\.]/);
		startDate = new Date(startDateArray[2], startDateArray[0] - 1, startDateArray[1], timeArray[0], timeArray[1], 59, 59);
	}
	//alert(startDate + "\n" + endDate + "\n" + (endDate > startDate))
	if(startDateArray != null && endDateArray != null && startDate > endDate) {
		errors.push('<li>' + 'End Date is earlier then Start Date' + '</li>'); 
	}
	if(params.beforeNowCheck == "true" || params.beforeNowCheck == "false") {
		//Need to check that both startDate and endDate are before current time.
		var mySystemTime = $('#sysTime').val();
		if(mySystemTime == undefined || mySystemTime == null || mySystemTime == "") {
			nowDate = new Date();
		} else {
			nowDate = new Date("" + mySystemTime);
		}
		
		//alert("  [" + mySystemTime + "]");
		//First check if we are scheduling for today and startTime is before now.
		if(startDate != null) {
			tempStartDate = new Date(startDateArray[2], startDateArray[0] - 1, startDateArray[1], nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds(), nowDate.getMilliseconds());
			if((nowDate.getTime() == tempStartDate.getTime()) && (nowDate.getTime() > startDate.getTime()) && params.beforeNowCheck == "true") { 
				//Start Date is same date as today but StartTime is earlier then current time.
				displayHour = nowDate.getHours() > 12 ? nowDate.getHours() - 12 : nowDate.getHours();
				if(nowDate.getHours() == 0) { displayHour = "12"; }
				if($('#startChanged').val() == "changed" || !($('#id').val() > 0)) {
					errors.push('<li>' + 'Start Time must be after ' + displayHour + ":" + (nowDate.getMinutes() < 10 ? "0" : "" ) + nowDate.getMinutes() + ((nowDate.getHours() < 12 || nowDate.getHours() == 0) ? "AM" : "PM") +							
						" if you wish to start the schedule today. </li>");										
				}
			} else if(nowDate.getTime() > tempStartDate.getTime() && params.beforeNowCheck == "true") { //Start Date date is earlier then current date.
				if($('#startChanged').val() == "changed" || !($('#id').val() > 0)) {
					errors.push('<li>' + 'StartDate is earlier then ' + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear() + ". </li>");					
				}
			} else if(nowDate.getTime() < tempStartDate.getTime() && params.beforeNowCheck == "false") { //Start Date is later then today and is required to be earlier then current date.
				errors.push('<li>' + 'StartDate is later then ' + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear() + ". </li>");
			}
		}
		if(endDate != null) {
			tempEndDate = new Date(endDateArray[2], endDateArray[0] - 1, endDateArray[1], nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds(), nowDate.getMilliseconds());
			if(nowDate.getTime() > tempEndDate.getTime() && params.beforeNowCheck == "true") {
				//If we have already scheduled the report then this means we have already ended that report and wouldn't want the user to edit it.
				if($('#id').val() > 0) {
					//$('#scheduleEnded').val('over');
				} else {
					errors.push('<li>' + 'End Date is earlier then ' + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear() + ". </li>");
				}
			} else if(nowDate.getTime() < tempEndDate.getTime() && params.beforeNowCheck == "false") {
				errors.push('<li>' + 'End Date is later then ' + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear() + ". </li>");
			}
		}
	}
	
	if(errors.length > 0) {
		return errors.join('\n');
	} else {
		return errors;
	}
}

function convertTimetoArray(startTime) {
	isPm = startTime.toLowerCase().indexOf("pm") != -1;
	ampmlocation = isPm ? startTime.toLowerCase().indexOf("pm") : startTime.toLowerCase().indexOf("am");
	timeArray = startTime.substring(0, ampmlocation).trim().split(":");
	if(isPm && timeArray[0] != "12") { timeArray[0] = parseInt(timeArray[0]) + 12; }
	if(!isPm && timeArray[0] == "12") { timeArray[0] = parseInt(timeArray[0]) - 12; } //12:20AM --> 00:20
	return timeArray;
}
