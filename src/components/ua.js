var userTail = (function () {
  var checkMobile = function () {
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if (isiPad) {
      return false;
    }
    var isMobile = navigator.userAgent.match(/iphone|android|phone|mobile|wap|netfront|x11|java|opera mobi|opera mini|ucweb|windows ce|symbian|symbianos|series|webos|sony|blackberry|dopod|nokia|samsung|palmsource|xda|pieplus|meizu|midp|cldc|motorola|foma|docomo|up.browser|up.link|blazer|helio|hosin|huawei|novarra|coolpad|webos|techfaith|palmsource|alcatel|amoi|ktouch|nexian|ericsson|philips|sagem|wellcom|bunjalloo|maui|smartphone|iemobile|spice|bird|zte-|longcos|pantech|gionee|portalmmm|jig browser|hiptop|benq|haier|^lct|320x320|240x320|176x220/i) != null;
    if (isMobile) {
      return true;
    }
    return false;
  };
  var regexMatch = function (regexArray, uaString) {
    var length = regexArray.length - 1;
    for (var i = 0; i < length; i++) {
      var regexItem = regexArray[i];
      var matchResultArray = regexItem[0].exec(uaString);
      if (matchResultArray) {
        if (typeof (regexItem[2]) === "function") {
          return regexItem[2](matchResultArray, uaString);
        } else if (regexItem[1]) {
          return regexItem[1];
        } else return matchResultArray[0];
      }
    }
    return false;
  };
  //init OSRegexs
  var OSRegexs = [
    // Windows based
    [
      /(windows\sphone(?:\sos)*|windows\smobile)[\s\/]?([ntce\d\.\s]+\w)/i //Windows Mobile/Phone
    ],
    [
      /microsoft\s(windows)\s(vista|xp)/i // Windows (iTunes)
      , "Windows Vista/XP",
      function (matchResultArray) {
        return matchResultArray[1] + matchResultArray[2];
      }
    ],
    [
      /(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
      , "Windows RT"
    ],
    [
      /Windows XP/i

    ],
    [
      /Windows 2000/i
    ],
    [
      /WinNT(\d+.\d+)/i
    ],
    [/Win(dows )?3.11|Win16/i, "Windows 3.1"],
    [/Windows 3.1/i],
    [/Win 9x 4.90|Windows ME/i, "Windows ME"],
    [/Win98/i, "Windows 98 SE"],
    [/Windows (98|4\.10)/i, "Windows 98"],
    [/Win(dows\s)?95/i, "Windows 95"],
    [/Windows\s*NT\s*([\w.]+)/i, "Windows", function (matchResultArray, uaString) {
      var version = "";
      switch (matchResultArray[1]) {
        case "5.0":
          version = "2000";
          break;
        case "5.1":
          version = "XP";
          break;
        case "6.0":
          version = "Vista";
          break;
        case "6.1":
          version = "7";
          break;
        case "6.2":
          version = "8";
          break;
        case "6.3":
          version = "8.1";
          break;
        case "10.0":
          version = "10";
          break;
      }
      var x64String = "";
      if (typeof (uaString) === "string") {
        x64String = (/(WOW64|Win64|x64)/i).test(uaString) ? " x64" : "";
      }
      if (version === "") {
        return matchResultArray[0] + x64String;
      } else return "Windows " + version + x64String;
    }],
    [
      // Mobile/Embedded OS
      /\((bb)(10);/i // BlackBerry 10
      , "BlackBerry 10"
    ],
    [
      /(blackberry)\w*\/?([\w\.]+)*/i // Blackberry
    ],
    [
      /(tizen)[\/\s]([\w\.]+)/i // Tizen
    ],
    [
      /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i
      // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
    ],
    [
      /linux;.+(sailfish);/i // Sailfish OS
      , "Sailfish OS"
    ],
    [
      /Symbian.*Series60\/([\w.]+)/i // Symbian S60
      , "Symbian S60",
      function (matchResultArray) {
        return "Symbian S60 " + matchResultArray[1];
      }
    ],
    [
      /Symbian\/\w+/i //Symbian 3
    ],
    [
      /\((series40);/i // Series 40
      , "Symbian Series 40"
    ],
    [
      /mozilla.+\(mobile;.+gecko.+firefox/i // Firefox OS
      , "Firefox OS"
    ],
    [

      /(mint)[\/\s\(]?(\w+)*/i // Mint
    ],
    [
      /(mageia|vectorlinux)[;\s]/i // Mageia/VectorLinux
    ],
    [
      /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
      // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
      // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
    ],
    [
      /(hurd|linux)\s?([\w\.]+)*/i, // Hurd/Linux
    ],
    [
      /(gnu)\s?([\w\.]+)*/i // GNU
    ],
    [
      /(cros)\s[\w]+\s([\w\.]+\w)/i // Chromium OS
      , "Chromium OS",
      function (matchResultArray) {
        return "Chromium OS " + matchResultArray[1];
      }
    ],
    [
      // Solaris
      /(sunos)\s?([\w\.]+\d)*/i // Solaris
      , "Solaris",
      function (matchResultArray) {
        return "Solaris " + matchResultArray[2];
      }
    ],
    [
      // BSD based
      /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
    ],
    [
      /(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i // iOS
      , "iOS",
      function (matchResultArray) {
        return "iOS " + matchResultArray[2].replace(/[-_\s]/ig, ".");
      }
    ],
    [
      /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
      "Mac OS X",
      function (matchResultArray) {
        return "Mac OS X " + matchResultArray[2].replace(/[-_\s]/ig, ".");
      }
    ],
    [

      // Other
      /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i // Solaris
    ],
    [
      /(haiku)\s(\w+)/i // Haiku
    ],
    [
      /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i // AIX
    ],
    [
      /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i
      // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
    ],
    [
      /(unix)\s?([\w\.]+)*/i // UNIX
    ],
  ];
  //init DeviceRegexs
  var deviceRegexs = [
    [
      /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i // iPad/PlayBook
      , "iPad/PlayBook"
    ],
    [
      /applecoremedia\/[\w\.]+ \((ipad)/i // iPad
      , "iPad"
    ],
    [
      /(apple\s{0,1}tv)/i // Apple TV
    ],
    [
      /(kindle)\/([\w\.]+)/i //old kindle
    ],
    [
      /kindle\sfire/i //new Kindle Fire
    ],
    [
      /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i // Kindle Fire HD
      , "Kindle Fire HD"
    ],
    [
      /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i // Fire Phone
      , "Kindle Fire Phone"
    ],
    [
      /\((ip[honead|\s\w*]+);.+(apple)/i // iPod/iPhone //\s\w for future?
      , "iPod/iPhone/iPad",
      function (matchResultArray) {
        return matchResultArray[1];
      }
    ],
    [
      /\((ip[honead|\s\w*]+);/i // iPod/iPhone //\s\w for future?
      , "iPod/iPhone/iPad",
      function (matchResultArray) {
        return matchResultArray[1];
      }
    ],
    [
      /(blackberry)[\s-]?(\w+)/i //Blackberry
    ],
    [
      /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i
      // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
    ],
    [
      /(hp)\s([\w\s]+\w)/i, // HP iPAQ
    ],
    [
      /(asus)-?(\w+)/i // Asus
    ],
    [
      /\(bb10;\s(\w+)/i // BlackBerry 10
      , "BlackBerry 10"
    ],
    [
      // Asus Tablets
      /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i, "Asus Tablets",
      function (matchResultArray) {
        return "Asus" + matchResultArray[1];
      }
    ],
    [
      /(sony)\s(tablet\s[ps])\sbuild\//i, // Sony

    ],
    [
      /(sony)?(?:sgp.+)\sbuild\//i
    ],
    [
      /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
    ],
    [
      /(nintendo)\s([wids3u]+)/i // Nintendo
    ],
    [
      /android.+;\s(shield)\sbuild/i // Nvidia
      , "Nvidia Shield Tablet"
    ],
    [
      /(playstation\s[34portablevi]+)[\s;]*([\w.]+)/i // Playstation
    ],
    [
      /(sprint\s(\w+))/i // Sprint Phones
    ],
    [
      /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i // Lenovo tablets
    ],
    [
      /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i // HTC
    ],
    [
      /(zte)-(\w+)*/i // ZTE
    ],
    [
      /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
      // Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
    ],
    [
      /(nexus\s9)/i // HTC Nexus 9
      , "Nexus 9"
    ],
    [
      /[\s\(;](xbox(?:\sone)?)[\s\);]/i // Microsoft Xbox
      , "XBox One"
    ],
    [
      /(kin\.[onetw]{3})/i // Microsoft Kin
      , "Microsoft Kin"
    ],
    [
      // Motorola
      /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, ""
    ],
    [
      /mot[\s-]?(\w+)*/i
    ],
    [
      /(XT\d{3,4}) build\//i
    ],
    [
      /(nexus\s6p)/i
    ],
    [
      /(nexus\s5x)/i
    ],
    [
      /(nexus\s[6])/i, "Nexus 6"
    ],
    [
      /(lg) netcast\.tv/i // LG SmartTV
      , "LG SmartTV"
    ],
    [
      /(nexus\s[45])/i
    ],
    [

      /\s(tablet)[;\/\s]/i, // Unidentifiable Tablet
      /\s(mobile)[;\/\s]/i // Unidentifiable Mobile
    ]
  ];
  //DetectBrowser
  function BrowserDetect(uaString) {
    var browserList = [
      '11(4|5)Browser', '2345(Explorer|chrome)', 'Conkeror',
      'Alienforce', 'Amaya', "Arora",
      'Beamrise',
      'Beonex', 'Blazer', "bidubrowser", 'Blackbird',
      'Bolt', 'Browzar', 'Bunjalloo', 'Camino',
      'Chromium', 'Classilla', 'Coast', 'Columbus',
      'Cruz', 'Cyberdog', 'Demeter', 'Dooble', 'dillo',
      'Doris', 'Edbrowse', 'E?links',
      'Epiphany', 'Escape|Espial', 'Fennec',
      'Firebird', 'Flock', 'Fluid', 'Galeon',
      'Hv3', 'Iris', 'lolifox',
      'Iceape', 'Hana',
      'Kapiko', 'Kazehakase', 'Kinza', 'Konqueror', 'Kylo',
      'Lunascape', 'Lynx', 'Madfox', 'Maxthon',
      'Midori', 'Minefield', 'Minimo',
      'Mosaic', 'Netscape',
      'Obigo', 'Orca',
      'Oregano', 'Otter',
      'Perk', 'Phoenix', 'Podkicker',
      'Ryouko', 'Sleipnir',
      'Shiira', 'Skyfire',
      'Stainless', 'Sundance', 'Sunrise',
      'Surf', 'Swiftfox', 'Swiftweasel',
      'Thunderbird', 'Tizen',
      'Tjusig', 'UC?\ ?Browser|UCWEB',
      'polarity', 'polaris', 'pogo', 'prism', 'superbird', 'songbird',
      'Usejump', 'Vivaldi', 'Wyzo',
    ];

    var defaultBrowserList = {
      "360se": {
        title: "360 Explorer"
      },
      "360ee": {
        title: "360 Chrome",
        image: "360se"
      },
      "360 aphone browser": {
        title: "360 Aphone Browser",
        image: "360se"
      },
      "abolimba": {
        title: "Abolimba"
      },
      "acoo browser": {
        title: "{%Acoo Browser%}",
        image: "acoobrowser"
      },
      "amiga-aweb": {
        title: "Amiga {%AWeb%}",
        image: "amiga-aweb"
      },
      "antfresco": {
        title: "ANT {%Fresco%}"
      },
      "mrchrome": {
        title: "Amigo",
        image: "amigo"
      },
      "myibrow": {
        title: "{%myibrow%}",
        image: "my-internet-browser"
      },
      "america online browser": {
        title: "{%America Online Browser%}",
        image: "aol"
      },
      "amigavoyager": {
        title: "Amiga {%Voyager%}"
      },
      "aol": {
        upper: [0, 1, 2], // AOL
      },
      "atomicbrowser": {
        upper: [0, 6], // AtomicBrowser
        image: "atomicwebbrowser"
      },
      "barcapro": {
        title: "{%BarcaPro%}",
        image: "barca"
      },
      "baidubrowser": {
        image: "bidubrowser"
      },
      "baiduhd": {
        title: "{%BaiduHD%}",
        image: "bidubrowser"
      },
      "blackhawk": {
        upper: [0, 5] //BlackHawk
      },
      "bonecho": {
        title: "{%BonEcho%}",
        image: "firefoxdevpre"
      },
      "browsex": {
        upper: [0, 6] // BrowseX
      },
      "cayman browser": {
        title: "{%Cayman Browser%}",
        image: "caymanbrowser"
      },
      "charon": {
        image: "null"
      },
      "cheshire": {
        image: "aol"
      },
      "chimera": {
        image: "null"
      },
      "chromeframe": {
        image: "chrome"
      },
      "chromeplus": {
        title: "{%ChromePlus%}"
      },
      "iron": {
        title: "SRWare {%Iron%}",
        image: "srwareiron"
      },
      "cometbird": {
        upper: [0, 5]
      },
      "comodo_dragon": {
        title: "Comodo {%Dragon%}",
        image: "comodo-dragon"
      },
      "coolnovo": {
        upper: [0, 4]
      },
      "corom": {
        upper: [0, 2] // CoRom
      },
      "crazy browser": {
        upper: [0, 6],
        image: "crazybrowser"
      },
      "crmo": {
        upper: [0, 2], // CrMo
        image: "chrome"
      },
      "dplus": {
        upper: [0, 1], // DPlus
        image: "dillo"
      },
      "deepnet explorer": {
        upper: [0, 8],
        image: "deepnetexplorer"
      },
      "deskbrowse": {
        upper: [0, 4],
      },
      "docomo": {
        upper: [0, 2, 4], // DoCoMo
        image: "null"
      },
      "doczilla": {
        upper: [0, 3],
      },
      "dolfin": {
        image: "samsung"
      },
      "dorothy": {
        image: "dorothybrowser"
      },
      "element browser": {
        upper: [0, 8],
        image: "elementbrowser"
      },
      "enigma browser": {
        upper: [0, 7],
        image: "enigmabrowser"
      },
      "enigmafox": {
        upper: [0, 6],
        image: "null"
      },
      "epic": {
        image: "epicbrowser"
      },
      "escape": {
        image: "espialtvbrowser"
      },
      "espial": {
        image: "espialtvbrowser"
      },
      "fireweb navigator": {
        upper: [0, 8],
        image: "firewebnavigator"
      },
      "globalmojo": {
        upper: [0, 6]
      },
      "gobrowser": {
        upper: [0, 1, 2]
      },
      "google wireless transcoder": {
        title: "Google Wireless Transcoder",
        image: "google"
      },
      "gosurf": {
        upper: [0, 2]
      },
      "granparadiso": {
        upper: [0, 4],
        image: "firefoxdevpre"
      },
      "greenbrowser": {
        upper: [0, 5]
      },
      "gsa": {
        upper: [0, 1, 2],
        image: "google"
      },
      "hotjava": {
        upper: [0, 3]
      },
      "hydra browser": {
        title: "Hydra Browser",
        image: "hydrabrowser"
      },
      "ibm webexplorer": {
        title: "IBM {%WebExplorer%}",
        image: "ibmwebexplorer"
      },
      "juzibrowser": {
        upper: [0, 4]
      },
      "miuibrowser": {
        upper: [0, 4]
      },
      "mxnitro": {
        upper: [0, 2]
      },
      "ibrowse": {
        upper: [0, 1]
      },
      "icab": {
        upper: [1]
      },
      "icebrowser": {
        upper: [0, 3]
      },
      "icecat": {
        title: "GNU {%IceCat%}"
      },
      "icedragon": {
        upper: [0, 3]
      },
      "iceweasel": {
        upper: [0, 3]
      },
      "inet browser": {
        upper: [1, 5],
        image: "null"
      },
      "irider": {
        upper: [1]
      },
      "internetsurfboard": {
        upper: [0, 8],
      },
      "jasmine": {
        image: "samsung"
      },
      "k-meleon": {
        upper: [0, 2],
        image: "kmeleon"
      },
      "k-ninja": {
        upper: [0, 2],
        image: "kninja"
      },
      "strata": {
        title: "Kirix {%Strata%}",
        image: "kirix-strata"
      },
      "kkman": {
        upper: [0, 1]
      },
      "kmail": {
        upper: [0, 1]
      },
      "kmlite": {
        upper: [0, 1, 2],
        image: "kmeleon"
      },
      "lbrowser": {
        upper: [0, 1]
      },
      "links": {
        image: "null"
      },
      "lbbrowser": {
        title: "Liebao Browser"
      },
      "liebaofast": {
        image: "lbbrowser"
      },
      "leechcraft": {
        title: "LeechCraft",
        image: "null"
      },
      "lobo": {
        upper: [0]
      },
      "lorentz": {
        upper: [0],
        image: "firefoxdevpre"
      },
      "maemo browser": {
        upper: [0, 6],
        image: "maemo"
      },
      " mib/": {
        title: "{%MIB%}",
        image: "mib"
      },
      "micromessenger": {
        upper: [0, 5],
        image: "wechat"
      },
      "minibrowser": {
        upper: [0, 5]
      },
      "mozilladeveloperpreview": {
        title: "{%MozillaDeveloperPreview%}",
        image: "firefoxdevpre"
      },
      "mqqbrowser": {
        upper: [0, 1, 2, 3], // MQQBrowser
        image: "qqbrowser"
      },
      "multi-browser": {
        upper: [0, 6],
        image: "multi-browserxp"
      },
      "multizilla": {
        upper: [0, 5],
        image: "mozilla"
      },
      "myie2": {
        upper: [0, 2, 3]
      },
      "namoroka": {
        image: "firefoxdevpre"
      },
      "navigator": {
        title: "Netscape {%Navigator%}",
        image: "netscape"
      },
      "netbox": {
        upper: [0, 3]
      },
      "netcaptor": {
        upper: [0, 3]
      },
      "netfront": {
        upper: [0, 3]
      },
      "netnewswire": {
        upper: [0, 3, 7]
      },
      "netpositive": {
        upper: [0, 3]
      },
      "netsurf": {
        upper: [0, 3]
      },
      "nf-browser": {
        upper: [0, 1, 2, 4],
        image: "netfront"
      },
      "nichrome/self": {
        title: "{%Nichrome/self%}",
        image: "nichromeself"
      },
      "nokiabrowser": {
        title: "Nokia {%Browser%}",
        image: "nokia"
      },
      "novarra-vision": {
        title: "Novarra {%Vision%}",
        image: "novarra"
      },
      "offbyone": {
        title: "Off By One"
      },
      "omniweb": {
        upper: [0, 4]
      },
      "onebrowser": {
        upper: [0, 3]
      },
      "origyn web browser": {
        title: "Oregano Web Browser",
        image: "owb"
      },
      "osb-browser": {
        image: "null"
      },
      " pre/": {
        title: "Palm {%Pre%}",
        image: "palmpre"
      },
      "palemoon": {
        title: "Pale {%Moon%}"
      },
      "patriott::browser": {
        title: "Patriott {%Browser%}",
        image: "patriott"
      },
      "phaseout": {
        title: "Phaseout"
      },
      "playstation 4": {
        title: "PS4 Web Browser",
        image: "webkit"
      },
      "podkicker pro": {
        upper: [0, 8],
        image: "podkicker"
      },
      "qqbrowser": {
        upper: [0, 1, 2]
      },
      "qtweb internet browser": {
        title: "{%QtWeb Internet Browser%}",
        image: "qtwebinternetbrowser"
      },
      "qtcarbrowser": {
        image: "tesla"
      },
      "qupzilla": {
        upper: [0, 3]
      },
      "rekonq": {
        title: "rekonq"
      },
      "retawq": {
        image: "terminal"
      },
      "rockmelt": {
        upper: [0, 4]
      },
      "saayaa": {
        title: "SaaYaa Explorer"
      },
      "seamonkey": {
        upper: [0, 3]
      },
      "semc-browser": {
        upper: [0, 1, 2, 3, 5],
        image: "semcbrowser"
      },
      "semc-java": {
        upper: [0, 1, 2, 3],
        image: "semcbrowser"
      },
      "shiretoko": {
        upper: [0],
        image: "firefoxdevpre"
      },
      "sitekiosk": {
        upper: [0, 4]
      },
      "skipstone": {
        upper: [0, 4]
      },
      "silk": {
        title: "Amazon {%Silk%}"
      },
      "slimboat": {
        upper: [0, 4]
      },
      "slimbrowser": {
        upper: [0, 4]
      },
      "smarttv": {
        upper: [0, 5, 6],
        image: "maplebrowser"
      },
      "substream": {
        upper: [0, 3]
      },
      "sulfur": {
        title: "Flock {%Sulfur%}",
        image: "flock"
      },
      "sylera": {
        upper: [0],
        image: "null"
      },
      "taobrowser": {
        upper: [0, 3],
      },
      "tear": {
        title: "Tear"
      },
      "teashark": {
        upper: [0, 3]
      },
      "teleca": {
        image: "obigo"
      },
      "tencenttraveler": {
        title: "Tencent {%Traveler%}"
      },
      "tenfourfox": {
        upper: [0, 3, 7]
      },
      "theworld": {
        title: "TheWorld Browser"
      },
      "ubrowser": {
        upper: [0, 1],
        image: "ucbrowser"
      },
      "ucbrowser": {
        upper: [0, 1, 2, 3],
      },
      "uc browser": {
        upper: [0, 1, 2, 4],
        image: "ucbrowser"
      },
      "ucweb": {
        upper: [0, 1, 2, 3, 4],
        image: "ucbrowser"
      },
      "ultrabrowser": {
        upper: [0, 5],
      },
      "up.browser": {
        upper: [0, 3],
        image: "openwave"
      },
      "up.link": {
        upper: [0, 3],
        image: "openwave"
      },
      "uzardweb": {
        title: "{%uZardWeb%}"
      },
      "uzard": {
        upper: [1],
        image: "uzardweb"
      },
      "uzbl": {
        title: "uzbl"
      },
      "vimprobable": {
        upper: [0],
        image: "null"
      },
      "vonkeror": {
        upper: [0],
        image: "null"
      },
      "w3m": {
        upper: [0, 2]
      },
      "wget": {
        image: "null"
      },
      "curl": {
        image: "null"
      },
      "iemobile": {
        upper: [0, 1, 2],
        image: "msie-mobile"
      },
      "waterfox": {
        upper: [0, 5]
      },
      "webianshell": {
        title: "Webian {%Shell%}"
      },
      "webrender": {
        upper: [0]
      },
      "weltweitimnetzbrowser": {
        title: "Weltweitimnetz {%Browser%}",
        image: "weltweitimnetzbrowser"
      },
      "whitehat aviator": {
        upper: [0, 5, 9],
        image: "aviator"
      },
      "wkiosk": {
        title: "wKiosk"
      },
      "worldwideweb": {
        upper: [0, 5, 9]
      },
      "x-smiles": {
        upper: [0, 2]
      },
      "xiino": {
        image: "null"
      },
      "yabrowser": {
        upper: [0, 2],
        image: "yandex"
      },
      "zbrowser": {
        upper: [1]
      },
      "zipzap": {
        upper: [0, 3]
      },
      "abrowse": {
        title: "{%ABrowse Browser%}"
      },
      "none": {
        title: "Unknown",
        image: "unknown"
      }
    };
    var browserRegEx = new RegExp(browserList.concat(Object.keys(defaultBrowserList)).join("|"), "i");

    var displayNameList = {
      "msie": {
        callback: function (rep, ret) {
          if (ret.version == "7.0" && /Trident\/4.0/i.test(ret.ua)) {
            ret.name = " 8.0 (Compatibility Mode)";
            ret.version = "";
          } else {
            ret.name = "";
          }
        }
      },
      "nf-browser": {
        name: "NetFront"
      },
      "semc-browser": {
        name: "SEMC Browser"
      },
      "ucweb": {
        name: "UC Browser"
      },
      "ubrowser": {
        name: "UC Browser"
      },
      "ucbrowser": {
        name: "UC Browser"
      },
      "uc browser": {
        name: "UC Browser"
      },
      "bidubrowser": {
        name: "Baidu Browser"
      },
      "baidubrowser": {
        name: "Baidu Browser"
      },
      "baiduhd": {
        name: "Baidu Browser"
      },
      "up.browser": {
        name: "Openwave Mobile Browser"
      },
      "up.link": {
        name: "Openwave Mobile Browser"
      },
      "chromeframe": {
        name: "Google Chrome Frame"
      },
      "mozilladeveloperpreview": {
        name: "Mozilla Developer Preview"
      },
      "opera mobi": {
        name: "Opera Mobile"
      },
      "osb-browser": {
        name: "Gtk+ WebCore"
      },
      "tablet browser": {
        name: "MicroB"
      },
      "crmo": {
        name: "Chrome Mobile"
      },
      "smarttv": {
        name: "Maple Browser"
      },
      "atomicbrowser": {
        name: "Atomic Web Browser"
      },
      "dplus": {
        name: "D+"
      },
      "micromessenger": {
        name: "WeChat"
      },
      "nichrome/self": {
        name: "NiChrome"
      },
      "gsa": {
        name: "Google Search App"
      },
      "opera labs": {
        callback: function (rep, ret) {
          rep = ret.ua.match(/Edition\ Labs([\ ._0-9a-zA-Z]+);/i);
          if (rep !== null) {
            ret.version = rep[1];
          } else {
            ret.version = "";
          }
        }
      },
      "qtcarbrowser": {
        name: "Tesla Car Browser",
        version: ""
      },
      "iceweasel": {
        callback: function (rep, ret) {
          if (ret.version == "Firefox") {
            ret.version = "";
          }
        }
      },
      "yabrowser": {
        callback: function (rep, ret) {
          ret.name = "Yandex.Browser";
        }
      }
    };
    var setRetName = function (ret, rep) {
      ret.image = rep.image;
      ret.full = rep.title.replace(/\{\%(.+)\%\}/, function (match, p1) {
        return getVersion(ret, p1);
      });
    };
    var getVersion = function (ret, title) {
      var lowerTitle = title.toLowerCase();
      var start = lowerTitle;
      ret.name = title;

      if ((lowerTitle == "opera" || lowerTitle == "opera next" || lowerTitle == "opera developer") && /OPR/i.test(ret.ua)) {
        start = "OPR";
      } else if (
        ((lowerTitle == "opera" || lowerTitle == "opera next" || lowerTitle == "opera labs") && /Version/i.test(ret.ua)) ||
        ((lowerTitle == "opera mobi" && /Version/i.test(ret.ua))) ||
        ((lowerTitle == "safari" && /Version/i.test(ret.ua))) ||
        ((lowerTitle == "pre" && /Version/i.test(ret.ua))) ||
        ((lowerTitle == "android webkit"))
      ) {
        start = "Version";
      } else if (lowerTitle == "links") {
        start = "Links (";
      } else if (lowerTitle == "smarttv") {
        start = "WebBrowser";
      } else if (lowerTitle == "ucweb" && /UCBrowser/i.test(ret.ua)) {
        start = "UCBrowser";
      } else if (
        lowerTitle == "tenfourfox" ||
        lowerTitle == "classilla" ||
        lowerTitle == "msie" && /\ rv:([.0-9a-zA-Z]+)/i.test(ret.ua)
      ) {
        // We have IE11 or newer
        start = " rv";
      } else if (lowerTitle == "nichrome/self") {
        start = "self";
      }
      start = start.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&');
      var regEx = new RegExp(start + '[\ |\/|\:]?([.0-9a-zA-Z]+)', 'i');
      var rep = ret.ua.match(regEx);
      if (rep !== null) {
        ret.version = rep[1];
      } else {
        ret.version = "";
      }

      if (ret.version.toLowerCase() == "build") { // To Fix some ua like 'Amazon Otter Build/KTU84M'
        ret.version = "";
      }
      if (lowerTitle in displayNameList) {
        if ('callback' in displayNameList[lowerTitle]) {
          displayNameList[lowerTitle].callback(rep, ret);
        } else {
          for (var tempVar in displayNameList[lowerTitle]) {
            ret[tempVar] = displayNameList[lowerTitle][tempVar];
          }
        }
      }

      return ret.name + (ret.version !== "" ? (" " + ret.version) : "");
    };

    var analyze = function (uaString) {
      var ret = {
        ua: uaString,
        name: "",
        version: "",
        full: "",
        image: "",
        dir: "browser"
      };
      var res = uaString.match(browserRegEx);
      var rep = null;
      if (res !== null) {
        var name = res[0].toLowerCase();
        var upper = null;

        rep = {};
        if (!!defaultBrowserList[name]) {
          Object.keys(defaultBrowserList[name]).forEach(function (key) {
            if (key !== 'upper') {
              rep[key] = defaultBrowserList[name][key];
            } else {
              upper = defaultBrowserList[name].upper;
            }
          });
        }
        if (!('title' in rep)) {
          if (upper !== null) {
            var upperTitle = name;
            upper.forEach(function (letterId) {
              upperTitle = upperTitle.substr(0, letterId) + upperTitle.substr(letterId, 1).toUpperCase() + upperTitle.substr(letterId + 1, upperTitle.length); // fuck IE
            });
            rep.title = "{%" + upperTitle + "%}";
          } else {
            rep.title = "{%" + name.toLowerCase().replace(/[a-z]/, function (m) {
              return m.toUpperCase(); // Repeat dirty code...
            }) + "%}";
          }
        }
        if (!('image' in rep)) {
          rep.image = name;
        }
        setRetName(ret, rep);
      } else if (/QQ(?!Download|Pinyin)/.test(ret.ua)) {
        ret.full = getVersion(ret, "QQ");
        ret.image = "qq";
      } else if (/Galaxy/i.test(ret.ua) && !/Chrome/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Galaxy');
        ret.image = "galaxy";
      } else if (/Opera Mini/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Opera Mini');
        ret.image = "opera-2";
      } else if (/Opera Mobi/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Opera Mobi');
        ret.image = "opera-2";
      } else if (/Opera/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Opera');
        ret.image = "opera-1";
        if (/Version/i.test(ret.ua)) {
          ret.image = "opera-2";
        }
      } else if (/OPR/i.test(ret.ua)) {
        if (/(Edition Next)/i.test(ret.ua)) {
          ret.full = getVersion(ret, 'Opera Next');
          ret.image = "opera-next";
        } else if (/(Edition Developer)/i.test(ret.ua)) {
          ret.full = getVersion(ret, 'Opera Developer');
          ret.image = "opera-developer";
        } else {
          ret.full = getVersion(ret, 'Opera');
          ret.image = "opera-1";
        }
      } else if (/SE\ /i.test(ret.ua) && /MetaSr/i.test(ret.ua)) {
        ret.name = ret.full = "Sogou Explorer";
        ret.image = "sogou";
      } else if ((/Ubuntu\;\ Mobile/i.test(ret.ua) || /Ubuntu\;\ Tablet/i.test(ret.ua) &&
        /WebKit/i.test(ret.ua))) {
        ret.name = ret.full = "Ubuntu Web Browser";
        ret.image = "ubuntuwebbrowser";
      } else if (/Avant\ Browser/i.test(ret.ua)) { // Fuck it
        ret.full = "Avant " + getVersion(ret, 'Browser');
        ret.image = "avantbrowser";
      } else if (/AppleWebkit/i.test(ret.ua) && /Android/i.test(ret.ua) && !/Chrome/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Android Webkit');
        ret.image = "android-webkit";
      } else if (/Windows.+Chrome.+Edge/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Edge');
        ret.image = "edge";
      } else if (/Chrome|crios/i.test(ret.ua)) {
        if (/crios/i.test(ret.ua)) {
          ret.full = "Google " + getVersion(ret, 'CriOS');
          ret.image = "chrome";
        } else {
          ret.full = "Google " + getVersion(ret, 'Chrome');
          ret.image = "chrome";
        }
      } else if (/Nokia/i.test(ret.ua) && !/Trident/i.test(ret.ua)) {
        ret.full = "Nokia Web Browser";
        ret.image = "maemo";
      } else if (/Safari/i.test(ret.ua)) {
        ret.name = "Safari";
        if (/Version/i.test(ret.ua)) {
          ret.full = getVersion(ret, 'Safari');
        } else {
          ret.full = ret.name;
        }
        if (/Mobile ?Safari/i.test(ret.ua)) {
          ret.name = "Mobile " + ret.name;
          ret.full = "Mobile " + ret.full;
        }
        ret.image = "safari";
      } else if (/Firefox/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Firefox');
        ret.image = "firefox";
      } else if (/MSIE/i.test(ret.ua) || /Trident/i.test(ret.ua)) {
        ret.full = "Internet Explorer" + getVersion(ret, 'MSIE');
        ret.image = "msie";
        rep = ret.ua.match(/(MSIE[\ |\/]?| rv:)([.0-9a-zA-Z]+)/i);
        if (rep !== null) {
          var ieVersion = parseInt(rep[2]);
          if (ieVersion >= 11) {
            ret.image = "msie11";
          } else if (ieVersion >= 10) {
            ret.image = "msie10";
          } else if (ieVersion >= 9) {
            ret.image = "msie9";
          } else if (ieVersion >= 7) {
            ret.image = "msie7";
          } else if (ieVersion >= 6) {
            ret.image = "msie6";
          } else if (ieVersion >= 4) {
            ret.image = "msie4";
          } else if (ieVersion >= 3) {
            ret.image = "msie3";
          } else if (ieVersion >= 2) {
            ret.image = "msie2";
          }
        }
      } else if (/Mozilla/i.test(ret.ua)) {
        ret.full = "Mozilla Compatible";
        ret.image = "mozilla";
      } else {
        ret.name = "Unknown";
        ret.image = "null";
        ret.full = ret.name;
      }
      return ret;
    };

    var analyzeResult = analyze(uaString);

    if (analyzeResult.full === "Unknown") {
      console.log(uaString); //问题uaString 输出控制台

      var tryParse = function (uaString) {
        var regex = /(\S+)\s(\(.+\))?\s?(\S*)/i;
        var result = uaString;

        var resultArray = regex.exec(uaString);
        if (resultArray !== null) {
          result = resultArray[1];
        }
        return result.replace(/\//ig, " ");
      };
      return tryParse(uaString);
    } else if (analyzeResult.full === "Mozilla Compatible") {
      var tryParse = function (uaString) {
        var regex = /(\S+)\s(\(.+\))?\s?(\S*)/i;
        var result = uaString;

        var resultArray = regex.exec(uaString);
        if (resultArray !== null) {
          if (typeof resultArray[3] !== "undefined") {
            result = resultArray[3];
          } else {
            result = "Mozilla Compatible";
          }
        }
        return result.replace(/\//ig, " ");
      };
      return tryParse(uaString);
    }


    return analyzeResult.full;
  };

  var getOSResult = function (OSResult) {
    var result = {};
    if ((/win/i).test(OSResult)) {
      result.os = 'windows';
      result.icon = 'windows';
    } else if ((/android/i).test(OSResult)) {
      result.os = 'android';
      result.icon = 'android';
    } else if ((/ubuntu/i).test(OSResult)) {
      result.os = 'ubuntu';
      result.icon = 'linux';
    } else if ((/linux/i).test(OSResult)) {
      result.os = 'linux';
      result.icon = 'linux';
    } else if ((/(Mac|iOS)/i).test(OSResult)) {
      result.os = 'apple';
      result.icon = 'apple';
    } else if ((/unix/i).test(OSResult)) {
      result.os = 'unix';
      result.icon = 'desktop';
    } else if ((/symbian/i).test(OSResult)) {
      result.os = 'symbian';
      result.icon = 'mobile';
    } else {
      result.os = 'other';
      result.icon = 'desktop';
    }
    return result;
  };

  var getBrowserResult = function (BrowserResult) {
    var result = {};
    if ((/firefox/i).test(BrowserResult)) {
      result.browser = result.icon = 'firefox'
    } else if ((/maxthon/i).test(BrowserResult)) {
      result.browser = 'maxthon';
      result.icon = 'globe';
    } else if ((/360/i).test(BrowserResult)) {
      result.browser = '360';
      result.icon = 'globe';
    } else if ((/baidu/i).test(BrowserResult)) {
      result.browser = 'baidu';
      result.icon = 'globe';
    } else if ((/UC\sBrowser/i).test(BrowserResult)) {
      result.browser = 'ucweb';
      result.icon = 'globe';
    } else if ((/sogou/i).test(BrowserResult)) {
      result.browser = 'sogou';
      result.icon = 'globe';
    } else if ((/2345explorer/i).test(BrowserResult)) {
      result.browser = '2345explorer';
      result.icon = 'globe';
    } else if ((/2345chrome/i).test(BrowserResult)) {
      result.browser = '2345chrome';
      result.icon = 'globe';
    } else if ((/liebao/i).test(BrowserResult)) {
      result.browser = 'lbbrowser';
      result.icon = 'globe';
    } else if ((/wechat/i).test(BrowserResult)) {
      result.browser = 'wechat';
      result.icon = 'weixin';
    } else if ((/QQ/i).test(BrowserResult)) {
      result.browser = 'qq';
      result.icon = 'globe';
    } else if ((/miui/i).test(BrowserResult)) {
      result.browser = 'mi';
      result.icon = 'globe';
    } else if ((/chrome/i).test(BrowserResult)) {
      result.browser = result.icon = 'chrome';
    } else if ((/safari/i).test(BrowserResult)) {
      result.browser = 'apple';
      result.icon = 'safari';
    } else if ((/opera/i).test(BrowserResult)) {
      result.browser = result.icon = 'opera';
    } else if ((/internet\sexplorer/i).test(BrowserResult)) {
      result.browser = 'ie';
      result.icon = 'internet-explorer';
    } else if ((/edge/i).test(BrowserResult)) {
      result.browser = 'ie';
      result.icon = 'edge';
    } else {
      result.browser = 'other';
      result.icon = 'globe';
    }
    return result;
  }
  return {
    isMobile: checkMobile(),
    getResult: function(UAString){
      let deviceText = regexMatch(deviceRegexs, UAString),
        osText = regexMatch(OSRegexs, UAString),
        browserText = BrowserDetect(UAString);
      let browserResult = browserText ? getBrowserResult(browserText) : false,
        osResult = osText ? getOSResult(osText) : false;
      
      return {
        osResult,
        osText,
        browserResult,
        browserText,
        deviceText,
      }
    },
  };
})();

export default userTail;