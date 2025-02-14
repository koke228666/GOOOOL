/*
 * CREATED: 2021-10-19
 * AUTHOR: toydotgame
 * GOOOOL: koke228
 * Main replacement script that handles boilerplate classes
 */

//var logoUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png";
//var favicon = "https://www.w3schools.com/favicon.ico";
var logoUrlDefault = browser.runtime.getURL('resources/logo.png');
var logoUrlNoBear = browser.runtime.getURL('resources/logo_nobear.png');
var logoUrlGoyda = browser.runtime.getURL('resources/logo_goyda.png');
var faviconDefault = browser.runtime.getURL('resources/favicon.ico');

browser.storage.local.get(['logoChoice', 'noFavicon']).then((result) => {
	var logoUrl;
    switch(result.logoChoice) {
        case 'noBear':
            logoUrl = logoUrlNoBear;
            break;
        case 'goyda':
            logoUrl = logoUrlGoyda;
            break;
        case 'noChange':
            return;
        default:
            logoUrl = logoUrlBear;
    }
	var favicon = result.noFavicon ? null : faviconDefault;
	var homepageLogo = [".lnXdpd", ".k1zIA", ".SuUcIb"]; // Homepage logo, its container, and the Doodle share button
	var searchLogo = [".jfN4p", ".TYpZOd"]; // PNG and SVG (respectively) results page logos
	var randRow = [".IUOThf", ".XtQzZd"]; // Classes of actual button div and then the navbar which is left too high

	if (favicon) {
		RunWhenReady(["head"], function(loadedElement) {
			loadedElement.append(Object.assign(document.createElement("link"),{rel:"icon", href:favicon}));
		});
	}

	var subdomain = window.location.host.split(".")[0];
	var page = "/" + location.pathname.split("/")[1];
	var isImageSearch = false;
	if(new URLSearchParams(window.location.search).get("tbm") == "isch") { // Query string `&tbm=isch` only present on Images results, where the logo is an SVG
		isImageSearch = true;
	}

	RunWhenReady([
		homepageLogo[1], searchLogo[0], searchLogo[1]
	], function(loadedElement) {
		Main();
	});

	/*
	* void Main()
	* Calls either function depending on what page is loaded right now
	*/
	function Main() {
		switch(page) {
			case "/":
			case "/webhp":
			case "/imghp":
				SwapHomepageLogo();
				break;
			case "/search":
				SwapResultsLogo();
		}
	}

	/*
	* void SwapHomepageLogo()
	* Replaces Google Doodles and the regular logo image with the old logo on the Google homepages
	*/
	function SwapHomepageLogo() {
		if(!(page == "/imghp" || subdomain == "images")) {
			document.querySelector(homepageLogo[1]).outerHTML = '<div style="margin-top:auto; max-height:92px;"><img class="' + homepageLogo[0].split(".")[1] + '"></div>';
		}

		document.querySelector(homepageLogo[0]).src = logoUrl;
		document.querySelector(homepageLogo[0]).srcset = ""; // Clear override
		// Override Doodle size styles:
		document.querySelector(homepageLogo[0]).width = "272";
		document.querySelector(homepageLogo[0]).height = "100";
		// Remove share button (only present on Doodles):
		try {
			document.querySelector(homepageLogo[2]).remove();
		} catch(TypeError) {}
	}

	/*
	* void SwapResultsLogo()
	* Replaces small logo on search pages
	* TODO: Doodle compatibility
	*/
	function SwapResultsLogo() {
		// Remove random bar of buttons Google thought'd be a good idea to add:
		RunWhenReady([randRow[0]], function (loadedElement) {
			document.querySelector(randRow[0]).remove();
			document.querySelector(randRow[1]).style.height = "57px";
		});

		if(!isImageSearch) {
			document.querySelector(searchLogo[0]).src = logoUrl;
			document.querySelector(searchLogo[0]).height = "33";
			return;
		}
	}

	/*
	* void RunWhenReady(String[] selectors, function code)
	* Takes code and runs it when at least one of the input querySelectors is detected.
	* Returns a DOMObject `loadedElement`, corresponding to the earliest loaded element
	* that matches a selector.
	* TODO: Asynchronously create a new thread to run this code.
	*/
	function RunWhenReady(selectors, code) {
		var loadedElement;
		var observer = new MutationObserver(function (mutations, mutationInstance) {
			for(var i = 0; i < selectors.length; i++) {
				if(document.querySelector(selectors[i]) != null) {
					loadedElement = document.querySelector(selectors[i]);
					code(loadedElement);
					mutationInstance.disconnect();
					break;
				}
			}
		});
		observer.observe(document, {childList: true, subtree: true});
	}
});