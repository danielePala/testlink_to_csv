let inputElement = document.getElementById("file");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
    const areaMap = {
	"Infrastructure": "AIS",
	"History": "AIS",
	"Online Integrations": "IIT",
	"Offline Integrations": "IIT",
	"SCADA": "IOT",
	"ADMS Applications": "PAF",
	"Control room": "PAF"
    };
    const importanceMap = {
	"1": "Low",
	"2": "Medium",
	"3": "High"
    };
    let fileList = this.files;
    let reader = new FileReader();
    reader.onload = function(e) {
	d3.xml(e.target.result).then(function(data) {
	    let root = d3.select(data).select("testsuite").node();
	    // get the top-level testsuites
	    let level1 = d3.selectAll(root.children).filter("testsuite").nodes();
	    let out = [];
	    for (let l1TSuite of level1) {
		let l1TSuiteName = l1TSuite.attributes.getNamedItem("name").value;
		let tcs = d3.select(l1TSuite).selectAll("testcase");
		// test case names
		let names = tcs.nodes().map(el => el.attributes.getNamedItem("name").value);
		// test case unique ids
		let ids = tcs.nodes().map(function(el) {
		    let uniqid = d3.select(el).selectAll("custom_fields>custom_field").filter(function(field) {
			return d3.selectAll(this.children).filter("name").node().textContent === "uniq_id";
		    }).node();
		    return d3.selectAll(uniqid.children).filter("value").node().textContent;
		});
		// test case external ids
		let extids = tcs.nodes().map(function(el) {
		    let extid = d3.select(el).selectAll("externalid").node();
		    return extid.textContent;
		});
		// test case requirements
		let reqs = tcs.nodes().map(function(el) {
		    let reqNodes = d3.select(el).selectAll("requirements>requirement>doc_id").nodes();
		    return reqNodes.map(el => el.textContent);
		});
		// test case status
		let statuses = tcs.nodes().map(function(el) {
		    let uniqid = d3.select(el).selectAll("custom_fields>custom_field").filter(function(field) {
			return d3.selectAll(this.children).filter("name").node().textContent === "Status";
		    }).node();
		    return d3.selectAll(uniqid.children).filter("value").node().textContent;
		});
		// test type (baseline/customization)
		let ttypes = tcs.nodes().map(function(el) {
		    let coverage  = d3.select(el).selectAll("custom_fields>custom_field").filter(function(field) {
			return d3.selectAll(this.children).filter("name").node().textContent === "testCoverage";
		    }).node();
		    return d3.selectAll(coverage.children).filter("value").node().textContent;
		});
		// test importance
		let timportances = tcs.nodes().map(function(el) {
		    let imp = d3.select(el).selectAll("importance").node();
		    return imp.textContent;
		});
		for (let i in names) {
		    let name = names[i];
		    let id = ids[i];
		    let extid = extids[i];
		    let status = statuses[i];
		    let item = {
			uniq_id: id,
			external_id: extid,
			test_status: status,
			test: name,
			area: areaMap[l1TSuiteName],
			IDs: reqs[i],
			type: ttypes[i],
			importance: importanceMap[timportances[i]],
			l1: l1TSuiteName
		    };
		    out.push(item);
		}	    
	    }
	    // other levels
	    handleLevel(2, level1, out);
	    // add names
	    for (let item of out) {
		let testClass = "";
		switch (item["l1"]) { 
		case "SCADA":
		    switch (item["l2"]) {
		    case "Data acquisition":
			item["person"] = "Alessio";
			item["day"] = 25;	
			break;
		    case "Control Sequences":
			switch (item["l3"]) {
			case "SequenceControl":
			    item["person"] = "Alessio";
			    item["day"] = 27;	
			    break;
			} // l3	
			break;
		    case "Data processing":
		    case "Supervisory Control":
			item["person"] = "Alessio";
			item["day"] = 27;	
			break;
		    case "Acknowledge":
		    case "Alarm Notification":
		    case "Telemetry Editor":
			item["person"] = "Alessio";
			item["day"] = 30;	
			break;
		    case "Alarming&Configuration":
			item["person"] = "Alessio";
			item["day"] = 31;	
			break;
		    case "Display and visibility":
			item["person"] = "Alessio";
			item["day"] = 1;	
			break;
		    } // l2	
		    break;
		case "Infrastructure": 
		    switch (item["l2"]) {
		    case "AOR":
		    case "Availability with and without permissions":
		    case "Cyber Security":
		    case "Inter-site replication":
			item["person"] = "Fabio";
			item["day"] = 16;
			break;
		    case "Inter-system replication":
		    case "Primary and Secondary Site Failover":
		    case "Save case":
		    case "Device monitoring and control":
			item["person"] = "Fabio";
			item["day"] = 17;
			break;
		    case undefined:
		    case "Collect":
			item["person"] = "Fabio";
			item["day"] = 18;
			break;
		    }
		    break;
		case "History": 
		    item["person"] = "Fabio";
		    item["day"] = 18;
		    break;
		case "Online Integrations": 
		    switch (item["l2"]) {
		    case "Crew Integration": 
			item["person"] = "Stefano";
			item["day"] = 25;
			break;
		    case "Incident Notification": 
			item["person"] = "Federico";
			item["day"] = 18;
			break;
		    case "CRM Integration":
		    case "Normal Switch Status":
		    case "Switching and Measurement Notification": 
			item["person"] = "Federico";
			item["day"] = 19;
			break;
		    case "Weather Integration":
		    case "AVL Integration": 
			item["person"] = "Federico";
			item["day"] = 24;
			break;
		    }
		    break;
		case "Offline Integrations": 
		    switch (item["l2"]) {
		    case "Customer Data Import":
		    case "Landbase Import":
		    case "Load Profile": 
			item["person"] = "Stefano";
			item["day"] = 26;
			break;
		    case "Network Builder": 
			item["person"] = "Federico";
			item["day"] = 16;
			break;
		    case "ADMS Network Exporter Tool":
		    case "Network Import Notification":
		    case "Symbol Editor": 
			item["person"] = "Federico";
			item["day"] = 17;
			break;
		    case "Model Promotion":
		    case "Model Update Tool": 
			item["person"] = "Federico";
			item["day"] = 20;
			break;
		    case "Catalog Editor":
		    case "GIS Import": 
			item["person"] = "Federico";
			item["day"] = 23;
			break;
		    case "Study Manager": 
			item["person"] = "Federico";
			item["day"] = 24;
			break;
		    }
		    break;
		case "Control room":
		    switch (item["l2"]) {
		    case "CORE":
			switch (item["l3"]) {
			case "Control Room UI*":
			    switch (item["l4"]) {
			    case "Coloring":
			    case "Display":
			    case "Trace Functionality":
			    case "Usecases":
				item["person"] = "Antimo";
				item["day"] = 16;
				break;
			    case "First Energization Attribute":
			    case "Generic Report":
			    case "Infrastructure":
			    case "Search features":
			    case "Trending":
			    case "Workspace Management":
				item["person"] = "Antimo";
				item["day"] = 17;
				break;
			    case "Other functionalities":
				item["person"] = "Antimo";
				item["day"] = 18;
				break;
			    case "Visibility Profiles and Layers":
				item["person"] = "Antimo";
				item["day"] = 19;
				break;
			    } // l4
			    break;
			} // l3
			break;
		    case "WOM*":
			item["person"] = "Antimo";
			item["day"] = 16;
			break;
		    case "OMS (OMS, WebCC)":
			switch (item["l3"]) {
			case "Usecases":
			    item["person"] = "Antimo";
			    item["day"] = 19;
			    break;
			case "OMS":
			    switch (item["l4"]) {
			    case "Customer Management*":
			    case "OMS Alarms*":
				item["person"] = "Antimo";
				item["day"] = 19;
				break;
			    case "Profile Management*":
			    case "Callback Management*":
			    case "Problem Management*":
				item["person"] = "Antimo";
				item["day"] = 20;
				break;
			    case "Incident Management*":
				switch (item["l5"]) {
				case "Outage Incidents":
				case "Non-Outage Incidents":
				case "Incident Lifecycle configuration":
				case "Incident Browser and details":
				    item["person"] = "Antimo";
				    item["day"] = 30;
				    break;
				case "Multimedia":
				case "Momentary Incidents":
				    item["person"] = "Antimo";
				    item["day"] = 31;
				    break;
				case "Coupled and Nested Incidents":
				case "ETR and ATR":
				case "Incident Merge and Switching Operations":
				case "Notifications":
				case "Reporting":
				case "Incident Coloring":
				case "Incident outage time":
				case "Incident Overview":
				case "Incident Property Configuration":
				case "Linked Incidents":
				case "Prediction":
				    item["person"] = "Antimo";
				    item["day"] = 1;
				    break;
				} // l5	
				break;
			    case "Call Management*":
				item["person"] = "Antimo";
				item["day"] = 1;
				break;
			    case "Crew Management*":
				switch (item["l5"]) {
				case "Crew":
				    item["person"] = "Emanuele";
				    item["day"] = 23;
				    break;
				case "Crew Memeber":
				case "Crew Vehicle":
				case "Crew Shift":
				    item["person"] = "Emanuele";
				    item["day"] = 24;
				    break;
				} // l5	
				break;
			    } // l4	
			    break;
			case "WebCC*":
			    item["person"] = "Antimo";
			    item["day"] = 31;
			    break;
			} // l3
			break;
		    case "INTEGRATIONS":
			item["person"] = "Antimo";
			item["day"] = 19;
			break;
		    case "Mobile dispatching (WebDMD, FC)":
			switch (item["l3"]) {
			case "Field Client":
			    switch (item["l4"]) {
			    case "WOM":
				item["person"] = "Emanuele";
				item["day"] = 24;
				break;
			    case "OMS":
				switch (item["l5"]) {
				case "Incident Management":
				    item["person"] = "Emanuele";
				    item["day"] = 25;
				    break;
				case "General":
				    item["person"] = "Emanuele";
				    item["day"] = 26;
				    break;
				case "Customer management":
				case "Problem management":
				case "Crew management":
				case "Damage Assessment Request":
				    item["person"] = "Emanuele";
				    item["day"] = 27;
				    break;
				} // l5 
				break;
			    } // l4
			    break;
			} // l3
			break;
		    } // l2
		    break;
		case "ADMS Applications": 
		    switch (item["l2"]) {
		    case "FLISR": 
			switch (item["l3"]) {
			case "Supply Restoration":
			case "Manual FLISR":
			case "Fault Detection":
			case "Return To Normal":
			    item["person"] = "Emanuele";
			    item["day"] = 19;
			    break;
			case "Fault Location":
			case "Element Isolation": 
			    item["person"] = "Emanuele";
			    item["day"] = 20;
			    break;
			} // l3
			break;
		    case "Temporary Elements":
		    case "Fault Object": 
			item["person"] = "Daniele";
			item["day"] = 23;
			break;
		    case "Load Shedding": 
			item["person"] = "Daniele";
			item["day"] = 25;
			break;
		    case "DMS": 
			switch (item["l3"]) {
			case "Performance Indices":
			case "State Estimation":
			case "Topology Analyzer": 
			    item["person"] = "Daniele";
			    item["day"] = 26;
			    break;
			case "Distributed Energy Resource Management": 
			    item["person"] = "Daniele";
			    item["day"] = 24;
			    break;
			case "Load Flow":
			    item["person"] = "Daniele";
			    item["day"] = 27;
			    break;
			case "Switching Validation":
			    item["person"] = "Emanuele";
			    item["day"] = 18;
			    break;
			} // l3
			break; 
		    } // l2
		    break; 
		} // l1
	    }  
	    // save the CSV file
	    let outString = d3.csvFormat(out, ["uniq_id","external_id","test_status","test","area","IDs","type","importance","l1","l2","l3","l4","l5","l6","person","day"]); 
	    let blob = new Blob([outString], {type : "text/csv"});
            let objectURL = URL.createObjectURL(blob);
	    let link = document.getElementById("csv-save");
	    link.href = objectURL;
	    link.click();
	}); 
    }; 	
    reader.readAsDataURL(fileList[0]);
}

function handleLevel(levelNum, parent, out) {
    for (let pTSuite of parent) {
	let level = d3.selectAll(pTSuite.children).filter("testsuite").nodes();
	if (level.length > 0 ) {
	    let next = levelNum + 1;
	    handleLevel(next, level, out);
	}	
	for (let lTSuite of level) {
	    let tSuiteName = lTSuite.attributes.getNamedItem("name").value;
	    let tcs = d3.select(lTSuite).selectAll("testcase");
	    let names = tcs.nodes().map(el => el.attributes.getNamedItem("name").value);
	    let ids = tcs.nodes().map(function(el) {
		let uniqid = d3.select(el).selectAll("custom_fields>custom_field").filter(function(field) {
		    return d3.selectAll(this.children).filter("name").node().textContent === "uniq_id";
		}).node();
		return d3.selectAll(uniqid.children).filter("value").node().textContent;
	    });
	    for (let i in names) {
		let name = names[i];
		let id = ids[i];
		let item = out.filter(el => el.uniq_id === id)[0];
		let key = "l" + levelNum;
		item[key] = tSuiteName;
	    }
	}	
    }
}   
