
////////////////////////////*Scope*//////////////////////////////

/* Obtain and anoymize a website visitor's IP address, tally and save 
the visitor's anonymized information in both individual and aggregate forms.
This information will be used to track the total number of visitors and product
downloads in order to differentiate return visitors and downloads from new.

//Steps to completion:

	//Get visitor information;
	//Extract users approximate geolocation from IP address;
	//Create anonymized ID Hash from visitor IP Address;
	//Compare anonymized visitor ID with database to determine if
	  the visitor is return or new;
	//Log visitor and product downloads information in database;
	//Update database on server;*/

///////////////////////*Data initialization*////////////////////

let arrayOfUsers = [0];
let totalVisitor = 0;
let totalVisitorReturn = 0 ;
let totalVisitorNew = 0;
let visitorID = 0;

let visitorDownload = 0 ;
let visitorDownloadTotal = 0;
let visitorDatabase = null;
let visitorIpHashed = 0;
let userExists = false;

//////////////////////*Functions*/////////////////////////////

	//Convert visitorIp to Hash
		async function makeHash(text) {
		//Convert to bytes
		const encoder = new TextEncoder();
		const data = encoder.encode(text);
		//Convert to HASH
		const hash = await crypto.subtle.digest('SHA-256', data);
		//Convert to Hex string
		const hashArray = Array.from(new Uint8Array(hash));
		console.log("Visitor ID (hashed):");
		return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
		};

	//Check user with database and add new user if needed
		async function checkAndStoreID (visitorIpHashed) {
			//Fetch response
			const response = await fetch('https.myserver.com');

			//Parse response object
			const responseData = await response.json();
			arrayOfUsers = responseData.users

			//Check if user exists
			for (let i = 0; i < arrayOfUsers.length; i++) {
				//Check if user exists
				if (visitorIpHashed === arrayOfUsers[i].visitorID) {
					//Update database
					arrayOfUsers[i].numberOfVisits++;
					userExists = true;
					console.log("User found. Visit number updated.");
					break;
				}
			};

			//Add visitor to database
			if (userExists === false) {
			const newUser = {
				visitorID: visitorIpHashed,
				visitorLocation: "",
				numberOfVisits: 1, 
				numberOfDownloads: 0,
				typeOfDownload: "",
			}

			arrayOfUsers.push(newUser);
			console.log("New user added successfully");
			};
		};

	//Extract approximate geolocation from IP address *SKIP FOR NOW*


/////////////////////////*Events*///////////////////////////////

	//Process visitor event
		document.addEventListener('DOMContentLoaded', async () => {
			try {

				//Retrieve visitor Ip address
				const visitorDataRaw = await fetch('https://api.ipify.org?format=json');
				const visitorData = await visitorDataRaw.json();
				const visitorIp = visitorData.ip;
				console.log("Raw IP:", visitorIp);

				//Convert visitor Ip to HASH
				visitorIpHashed = await makeHash(visitorIp);
				console.log("Hashed ID:", visitorIpHashed);

				//Compare with database; update if necessary
				await checkAndStoreID(visitorIpHashed);

				//Log download
				visitorDownload = document.querySelector('#download');
				visitorDownload.addEventListener('click', async () => {

					//Update database with download count for visitor
					const user = arrayOfUsers.find(user => user.visitorID === visitorIpHashed);
					if(user) {
						user.numberOfDownloads++;
						//Update server
						/*
						const response = await fetch('https://myserver.com/update', {
							method: 'POST',
							headers: {
							'Content-Type': 'application/json'
							},
							body: JSON.stringify(arrayOfUsers),
						});
						*/
					};

				});

				//Calcualte total visitors
					//Update macro information
					totalVisitor++
					if (userExists) {
						totalVisitorReturn++;
					} else{
						totalVisitorNew++
					};

				//Update server
				/*
				const response = await fetch('https://myserver.com/update', {
					method: 'POST',
					headers: {
					'Content-Type': 'application/json'
					},
					body: JSON.stringify(arrayOfUsers),
				});
				*/

			} catch (error) {
			console.log("Could not fetch IP:", error);
		}});

	
	



