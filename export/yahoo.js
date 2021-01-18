let { settings } = require('./settings');
let { consoled } = require('./tools');
const fetch = require('node-fetch');
const yahooUrl = "https://query1.finance.yahoo.com/v7/finance/chart/";
const yahooApi = {
    /*"commodities": ["CL", "RB", "HO", "NG"],*/
    "engines": ["indices", "forexes", "futures","weed"/* "war", "commodities", "finances"*/],
    "weed": ["CGC","CRON","TLRY","MJ","HARV.CN","VFF.TO","OGI.TO","JUSH.CN","CL.CN","CURA.CN","GRWG","TER.CN","GWPH","APHA","IIPR","SMG","MO","STZ","CURLF","MSOS","MCMJ","ABBV","BUD","WEED.TO","TAP","ACB","NBEV","TGOD.TO","CRBP","TGODF","TRTC","CANN"/*,"HYG.TO"*/],
    "forexes": ["USDCAD", "USDEUR", "USDGBP", "USDJPY", "USDRUB", "USDCNY", "USDHKD", "USDAUD", "USDCHF", "USDNZD", "USDSGD", "USDINR", "USDIDR", "USDMYR", "USDKRW", "USDTWD", "USDBRL", "USDMXN", "USDCLP", "USDILS", "USDEGP", "GBPUSD", "EURUSD", "RUBUSD", "JPYUSD", "HKDUSD", "CNYUSD", "SGDUSD", "AUDUSD", "INRUSD", "IDRUSD", "MYRUSD", "KRWUSD", "TWDUSD", "BRLUSD", "MXNUSD", "CLPUSD", "ILSUSD", "EGPUSD", "CADUSD", "NZDUSD"],
    "futures": ["GC%3DF", "SI%3DF", "PL%3DF", "HG%3DF", "SB%3DF", "OJ%3DF", "LB%3DF", "CT%3DF", "KC%3DF", "CC%3DF", "LE%3DF", "HE%3DF", "GF%3DF", "ZS%3DF", "ZL%3DF", "ZM%3DF", "KE%3DF", "ZO%3DF", "ZC%3DF", "BZ%3DF", "RB%3DF", "NG%3DF", "HO%3DF", "CL%3DF"],
    "indices": ["%5ECMC200", "%5EGSPC", "%5EDJI", "%5EIXIC", "%5ENYA", "%5EXAX", "%5EBUK100P", "%5ERUT", "%5EVIX", "%5EFTSE", "%5EGDAXI", "%5EFCHI", "%5ESTOXX50E", "%5EN100", "%5EBFX", "IMOEX.ME", "%5EN225", "%5EHSI", "000001.SS", "399001.SZ", "%5ESTI", "%5EAXJO", "%5EAORD", "%5EBSESN", "%5EJKSE", "%5EKLSE", "%5ENZ50", "%5EKS11", "%5ETWII", "%5EGSPTSE", "%5EBVSP", "%5EMXX", "%5EIPSA", "%5EMERV", "%5ETA125.TA", "%5ECASE30", "%5EJN0U.JO"],
    /*"indices2": ["%5ENYA", "%5EGSPTSE", "%5E", "%5E", "%5E", "%5E", "%5E", "%5E", "%5E", "%5E"],*/
    /*"war": ["AAXN", "AIR", "AIRI", "AJRD", "ASTC", "ATRO", "AVAV", "BA", "BAH", "BWXT", "CAE", "CODA", "CUB", "CVU", "DCO", "EH", "ERJ", "ESLT", "GD", "HEI", "HEI-A", "HII", "HXL", "ISSC", "IVAC", "KAMN", "KTOS", "LHX", "LMT", "MOG-A", "MRCY", "NOC", "NPK", "PKE", "RADA", "RGR", "RTX", "SIF", "SPCE", "SPR", "SWBI", "TATT", "TDG", "TGI", "TXT", "UAVS", "VEC", "VSEC", "VTSI", "WWD"],*/
    /*"finances": ["AACQ","AAMC","AAME","AB","ABCB","ABTX","AC","ACACU","ACBI","ACEV","ACEVU","ACGL","ACNB","ACV","ADOCU","ADS","AEF","AEG","AEL","AFG","AFL","AFT","AGM","AGO","AHACU","AIF","AIG","AIHS","AINC","AINV","AIZ","AJG","ALAC","ALL","ALLY","ALRS","ALTA","AMAL","AMBC","AMCI","AMG","AMK","AMNB","AMP","AMRB","AMRK","AMSF","AMTB","ANAT","ANDA","AON","APAM","APO","APXT","ARCC","ARDC","ARES","ARGO","AROW","ARYA","ASA","ASB","ASPS","ASRV","ATAX","ATCO","ATH","ATIF","ATLC","ATLO","AUB","AUBN","AVAL","AVCT","AX","AXP","AXS","BAC","BAM","BANC","BANF","BANR","BANX","BAP","BBAR","BBD","BBDC","BBVA","BCBP","BCH","BCML","BCOR","BCS","BCSF","BCTG","BDGE","BEN","BFIN","BFST","BFT","BFY","BGCP","BGH","BGIO","BHB","BHF","BHLB","BHSEU","BHV","BK","BKCC","BKSC","BKU","BLE","BLK","BLSA","BLX","BMA","BMO","BMRC","BMRG","BMTC","BNS","BOCH","BOH","BOKF","BOTJ","BOWXU","BPFH","BPOP","BRK-A","BRK-B","BRKL","BRLI","BRLIU","BRO","BRP","BRPA","BSAC","BSBK","BSBR","BSIG","BSMX","BSRR","BSTZ","BTAQ","BTWNU","BUR","BUSE","BWB","BWFG","BX","BXS","BY","BYFC","BZM","C","CAC","CACC","CADE","CARE","CARV","CASH","CATC","CATY","CB","CBAN","CBFV","CBH","CBMB","CBNK","CBOE","CBSH","CBTX","CBU","CCAP","CCBG","CCIV","CCNE","CCX","CEF","CET","CEV","CFB","CFBK","CFFA","CFFI","CFFN","CFG","CFIIU","CFR","CG","CGBD","CGRO","CGROU","CHCO","CHMG","CHPM","CIA","CIB","CIIC","CIK","CINF","CIT","CIVB","CIZN","CLBK","CLM","CM","CMA","CME","CMLFU","CNA","CNBKA","CNF","CNFR","CNO","CNOB","CNS","COF","COHN","COLB","COOP","COWN","CPF","CPSS","CPTA","CRD-A","CRD-B","CRF","CRHC","CRSA","CRVL","CS","CSTR","CSWC","CTBI","CUBI","CURO","CVBF","CVCY","CVLY","CWBC","CZNC","CZWI","DB","DCOM","DCRBU","DEH","DFIN","DFPHU","DFS","DGICA","DGNR","DHIL","DHY","DKNG","DMB","DMF","DMO","DMYD","DMYT","DSE","DXF","DXR","EAD","EBC","EBMT","EBSB","EBTC","ECF","ECPG","EDF","EFC","EFF","EFSC","EGBN","EHT","EHTH","EIG","EIM","ELVT","EMCF","ENVA","ENX","EQBK","EQH","EQOS","EQS","ERC","ERESU","ERH","ERIE","ESBK","ESGR","ESNT","ESQ","ESSA","ESXB","ETAC","ETACU","ETX","EV","EVBN","EVM","EVR","EVV","EVY","EWBC","EZPW","FAF","FANH","FBC","FBIZ","FBK","FBMS","FBNC","FBP","FBSS","FCACU","FCAP","FCBC","FCBP","FCCO","FCCY","FCF","FCFS","FCNCA","FCNCP","FCRD","FDEU","FDS","FDUS","FEAC","FEN","FFBC","FFBW","FFG","FFIC","FFIN","FFNW","FFWM","FGBI","FHB","FHI","FHN","FIBK","FIII","FIIIU","FINV","FISI","FITB","FIV","FLIC","FMAO","FMBH","FMBI","FMNB","FNB","FNCB","FNF","FNHC","FNLC","FNWB","FOCS","FPL","FRBA","FRBK","FRC","FRHC","FRME","FSBW","FSDC","FSFG","FSK","FSKR","FSLF","FST","FTF","FTIVU","FTOC","FTOCU","FULT","FUNC","FUSE","FUTU","FVAC","FVAM","FVCB","GABC","GAIN","GBCI","GBDC","GBL","GBLI","GCBC","GDO","GDOT","GEC","GECC","GFED","GGAL","GGN","GHL","GHLD","GIK","GIX","GL","GLBZ","GLO","GLQ","GLRE","GLV","GMHI","GNRS","GNT","GNTY","GNW","GOAC","GOCO","GRF","GROW","GRSV","GRSVU","GS","GSAH","GSBC","GSBD","GSHD","GWACU","GWB","GWGH","HAFC","HALL","HBAN","HBCP","HBMD","HBNC","HBT","HCAC","HCAP","HCCH","HCI","HDB","HEC","HECCU","HFBL","HFRO","HFWA","HGBL","HGLB","HIFS","HIG","HKIB","HLI","HLNE","HLXA","HMN","HMNF","HMST","HNNA","HNW","HOL","HOLUU","HOMB","HONE","HOPE","HRTG","HRZN","HSAQ","HSBC","HTBI","HTBK","HTGC","HTH","HTLF","HUIZ","HUSN","HWBK","HWC","HX","HYAC","HYI","HZAC","IAF","IBCP","IBKR","IBN","IBOC","IBTX","ICBK","ICE","ICMB","IFN","IFS","IGI","IHC","IHD","IHIT","IMH","INBK","INDB","ING","INSI","IOR","IPOB","IPOC","IROQ","ISBC","ISTR","ITACU","ITCB","ITIC","ITUB","IVH","IVZ","IX","JEF","JGH","JHG","JLS","JMM","JMP","JP","JPM","JRJC","JRS","JRVR","JSD","JT","JWS","KB","KCAC","KEY","KFFB","KINS","KKR","KMPR","KNSL","KRNY","KSMTU","KXIN","L","LACQ","LARK","LATN","LAZ","LBAI","LBC","LC","LCA","LCNB","LEVL","LFAC","LFC","LFTRU","LGC","LGHL","LGVW","LKFN","LMFA","LMND","LNC","LOAK","LOB","LPLA","LPRO","LSBK","LU","LX","LYG","LYL","MA","MAACU","MACUU","MAIN","MARA","MBI","MBIN","MBNKP","MBWM","MC","MCAC","MCB","MCBC","MCBS","MCO","MCY","MDLY","MET","MFAC","MFC","MFG","MFIN","MFNC","MGI","MGYR","MHE","MHLD","MKL","MKTX","MLAC","MLVF","MMAC","MMC","MN","MNSB","MOFG","MORN","MPB","MRCC","MRLN","MS","MSBI","MSCI","MSVB","MTB","MTG","MTT","MUFG","MVBF","MVC","MVF","MXE","MZA","NAD","NAVI","NAZ","NBAC","NBB","NBH","NBHC","NBN","NBO","NBTB","NBW","NCB","NCBS","NDAQ","NDP","NEA","NEV","NEWT","NFBK","NFIN","NGHC","NHA","NHIC","NHICU","NHLD","NHS","NICK","NID","NIE","NIQ","NJV","NKG","NKSH","NKX","NMFC","NMIH","NML","NMR","NMS","NMZ","NNI","NOAH","NODK","NOVS","NOVSU","NPAUU","NPV","NRGX","NRIM","NRK","NRO","NSEC","NTB","NTRS","NUM","NUO","NUW","NVG","NWBI","NWFL","NWG","NWLI","NXJ","NYCB","NYV","NZF","OAC","OBNK","OCCI","OCFC","OCN","OCSI","OCSL","OFED","OFG","OFS","OMF","ONB","OPBK","OPES","OPHC","OPOF","OPP","OPRT","OPY","ORCC","ORI","ORRF","OSBC","OVBC","OVLY","OXBR","OXSQ","OZK","PACW","PAICU","PB","PBCT","PBFS","PBHC","PBIP","PCB","PCPL","PCSB","PDLB","PEBK","PEBO","PFBC","PFBI","PFC","PFG","PFHD","PFIS","PFLT","PFS","PFSI","PGC","PGR","PGZ","PHCF","PIH","PIPR","PJT","PKBK","PLBC","PLMR","PMBC","PMVC","PNBK","PNC","PNFP","PNNT","PPBI","PRA","PRAA","PRI","PRK","PROS","PROV","PRPB","PRU","PSAC","PSEC","PSTH","PT","PTVCB","PUK","PUYI","PVBC","PWOD","PYPL","PZN","QCRH","QD","QFIN","QIWI","RA","RACA","RAND","RBAC","RBB","RBCAA","RBNC","RCG","RDN","RE","RF","RGA","RGT","RILY","RJF","RKT","RLI","RM","RMBI","RMG","RMM","RNR","RNST","ROOT","RPLA","RRBI","RVSB","RY","SAFT","SAII","SAL","SAMA","SAMG","SAN","SAR","SASR","SBCF","SBE","SBFG","SBI","SBNY","SBSI","SBT","SC","SCHW","SCM","SCU","SEIC","SF","SFBC","SFBS","SFE","SFNC","SFST","SFTW","SG","SHBI","SHG","SI","SIEB","SIGI","SII","SIVB","SLCT","SLF","SLM","SLQT","SLRC","SMBC","SMBK","SMFG","SMM","SMMCU","SMMF","SNEX","SNFCA","SNPR","SNV","SOAC","SONA","SPFI","SPGI","SRAC","SRACU","SRCE","SRL","SSB","SSBI","SSPK","SSSS","STBA","STC","STEP","STFC","STL","STND","STPK","STT","STWOU","STXB","SUNS","SUPV","SVAC","SVACU","SVBI","SVVC","SYBT","SYF","TBBK","TBK","TBNK","TCBI","TCBK","TCF","TCFC","TCPC","TD","TEAF","TFC","TFSL","THBR","THCA","THCB","THFF","THG","TIG","TIGR","TIPT","TMP","TMTS","TOTA","TOWN","TPRE","TPVG","TPZ","TREB","TREE","TRMK","TRNE","TROW","TRST","TRUP","TRV","TSBK","TSC","TSLX","TTP","TURN","TW","TZAC","UBCP","UBFO","UBOH","UBS","UBSI","UCBI","UFCS","UIHC","UMBF","UMPQ","UNB","UNM","UNTY","USB","UVE","UVSP","V","VALU","VBFC","VBTX","VCF","VCIF","VCTR","VEL","VERY","VFL","VIRT","VLY","VMACU","VMM","VOYA","VRTS","VSPRU","WABC","WAFD","WAL","WASH","WBK","WBS","WD","WDR","WETF","WF","WFC","WHF","WHG","WLTW","WNEB","WPF","WRB","WRLD","WSBC","WSBF","WSFS","WTBA","WTFC","WTM","WTRE","WU","WVFC","XP","XYF","Y","YAC","YIN","YRD","ZION"],*/
    "pushable": {
        "currency": null,
        "symbol": null,
        "exchangeName": null,
        "instrumentType": null,
        "time": null,
        "date": null,
        "regular": null,
        "previous": null,
        "open": null,
        "close": null,
        "high": null,
        "low": null,
        "volume": null,
        "trend": null,
        "ch": null,
        "chp": null,
        "status": "init",
        "error": null,
        "retry": 0,
    },
};
let yahoo = {};
let yahooReport = {};
function createEnv() {
    for (let engine of yahooApi.engines) {
        yahoo[engine] = [];
        yahooReport[engine] = '';
        yahooReport[`${engine}Nb`] = 0;
        yahoo[engine]["SKYDEX"] = { ...yahooApi.pushable };
        for (let symbol of yahooApi[engine]) {
            yahoo[engine][symbol] = { ...yahooApi.pushable };
        }
    }
};
createEnv();
consoled("init", "loading...");
function getFuturesSymbol(type) {
    let marker = type.indexOf("%3D");
    if (marker !== -1) {
        type = type.replace("%3D", "=");
    }
    return type;
};
function sliceIndex(index) {
    let sliced = index.slice(0, 3);
    if (sliced === '%5E') {
        return index.replace('%5E', '^');
    }
    else {
        return index;
    }
};
function getCommoditySymbol(type) {
    let dateNow = new Date();
    let symbols = ["Y", "G", "H", "J", "K", "M", "N", "Q", "X", "U", "V", "Z"];
    let commodity = `${type.toUpperCase()}${symbols[dateNow.getMonth() + 1]}${dateNow.getFullYear() - 2000}.NYM`;
    return commodity;
};
function retryGetQuery(engine, symbol) {
    if (yahoo[engine][symbol].retry <= 5) {
        yahoo[engine][symbol].retry = yahoo[engine][symbol].retry + 1;
        setTimeout(function () {
            getQuery(engine, symbol);
        }, settings.retry.yahoo);
    }
    else {
        yahoo[engine][symbol].retry = yahoo[engine][symbol].retry + 1;
        setTimeout(function () {
            getQuery(engine, symbol);
        }, settings.retry.yahoo + 60000);
    }
};
function getSkydex(engine) {
    let total = {};
    total.close = 0;
    total.high = 0;
    total.low = 0;
    total.open = 0;
    let subtotal = {};
    subtotal.close = 0;
    subtotal.high = 0;
    subtotal.low = 0;
    subtotal.open = 0;
    let totalerr = 0;
    for (let symbol of yahooApi[engine]) {
        let errorCheck = false;
        if (symbol !== "SKYDEX" || symbol !== "%5ECMC200" || symbol !== "%5EVIX" || symbol !== "%5EXAX" || symbol !== "%5EIPSA" || symbol !== "%5EMERV") {
            if (yahoo[engine][symbol].currency !== "USD" && yahoo[engine][symbol].currency !== "") {
                subtotal.close = Number(yahoo[engine][symbol].close) * Number((yahoo["forexes"][`${yahoo[engine][symbol].currency}USD`].close));
                subtotal.open = Number(yahoo[engine][symbol].open) * Number((yahoo["forexes"][`${yahoo[engine][symbol].currency}USD`].close));
                subtotal.high = Number(yahoo[engine][symbol].high) * Number((yahoo["forexes"][`${yahoo[engine][symbol].currency}USD`].close));
                subtotal.low = Number(yahoo[engine][symbol].low) * Number((yahoo["forexes"][`${yahoo[engine][symbol].currency}USD`].close));
            }
            else if (yahoo[engine][symbol].currency === "") {
                errorCheck = true;
                totalerr++;
            }
            else {
                subtotal.close = Number(yahoo[engine][symbol].close);
                subtotal.open = Number(yahoo[engine][symbol].open);
                subtotal.high = Number(yahoo[engine][symbol].high);
                subtotal.low = Number(yahoo[engine][symbol].low);
            }
            if (!errorCheck) {
                total.close = total.close + subtotal.close;
                total.open = total.open + subtotal.open;
                total.high = total.high + subtotal.high;
                total.low = total.low + subtotal.low;
            }
        }
    }
    total.close = (engine === "indices")? total.close / yahooApi[engine].length - totalerr - 5 : total.close / yahooApi[engine].length - totalerr - 0;
    total.open = (engine === "indices")? total.open / yahooApi[engine].length - totalerr - 5 : total.open / yahooApi[engine].length - totalerr - 0;
    total.high = (engine === "indices")? total.high / yahooApi[engine].length - totalerr - 5 : total.high / yahooApi[engine].length - totalerr - 0;
    total.low = (engine === "indices")? total.low / yahooApi[engine].length - totalerr - 5 : total.low / yahooApi[engine].length - totalerr - 0;
    yahoo[engine]["SKYDEX"].symbol = "SKYDEX";
    yahoo[engine]["SKYDEX"].currency = "USD";
    yahoo[engine]["SKYDEX"].exchangeName = `${engine}`;
    yahoo[engine]["SKYDEX"].instrumentType = "average";
    yahoo[engine]["SKYDEX"].time = Date.now();
    yahoo[engine]["SKYDEX"].date = Date.now();
    if (yahoo[engine]["SKYDEX"].close !== null) {
        yahoo[engine]["SKYDEX"].previous = yahoo[engine]["SKYDEX"].close;
    }
    yahoo[engine]["SKYDEX"].close = total.close;
    yahoo[engine]["SKYDEX"].open = total.open;
    yahoo[engine]["SKYDEX"].high = total.high;
    yahoo[engine]["SKYDEX"].low = total.low;
    yahoo[engine]["SKYDEX"].trend = (yahoo[engine]["SKYDEX"].open > yahoo[engine]["SKYDEX"].close) ? "bear" : (yahoo[engine]["SKYDEX"].open < yahoo[engine]["SKYDEX"].close) ? "bull" : "side";
    yahoo[engine]["SKYDEX"].ch = (yahoo[engine]["SKYDEX"].trend === "bear") ? (Number(yahoo[engine]["SKYDEX"].open) - Number(yahoo[engine]["SKYDEX"].close)).toFixed(4) : (yahoo[engine]["SKYDEX"].trend === "bull") ? (Number(yahoo[engine]["SKYDEX"].close) - Number(yahoo[engine]["SKYDEX"].open)).toFixed(4) : 0;
    yahoo[engine]["SKYDEX"].chp = (yahoo[engine]["SKYDEX"].trend === "bear") ? (((Number(yahoo[engine]["SKYDEX"].open) - Number(yahoo[engine]["SKYDEX"].close)) / Number(yahoo[engine]["SKYDEX"].close)) * 100).toFixed(2) : (yahoo[engine]["SKYDEX"].trend === "bull") ? (((Number(yahoo[engine]["SKYDEX"].close) - Number(yahoo[engine]["SKYDEX"].open)) / Number(yahoo[engine]["SKYDEX"].close)) * 100).toFixed(2) : 0;
    yahoo[engine]["SKYDEX"].status = "full";
};
function getQuery(engine, symbol) {
    let url = (engine === "indices") ? `${yahooUrl}${symbol}` : (engine === "forexes") ? `${yahooUrl}${symbol}=X` : (engine === "commodities") ? `${yahooUrl}${getCommoditySymbol(symbol)}` : (engine === "war") ? `${yahooUrl}${symbol}` : `${yahooUrl}${symbol}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow'
    })
        .then((res) => {
            if (res) {
                return res.json()
            }
            else {
                console.log(res);
                consoled("error", `querry ${engine} ${symbol} ${res.statusText.json()}`);
                retryGetQuery(engine, symbol);
            }
        })
        .then((json) => {
            if (json.chart.error === null) {
                if (engine === "indices") {
                    yahoo[engine][symbol].regular = Number(json.chart.result[0].meta.regularMarketPrice).toFixed(4);
                    yahoo[engine][symbol].previous = Number(json.chart.result[0].meta.previousClose).toFixed(4);
                }
                let yReport;
                if (engine === "commodities") {
                    yReport = `${getCommoditySymbol(symbol)}`;
                }
                if (engine === "indices") {
                    yReport = `${sliceIndex(symbol)}`;
                }
                if (engine === "war" || engine === "finances" || engine === "forexes"|| engine === "weed") {
                    yReport = `${symbol}`;
                }
                if (engine === "futures") {
                    yReport = `${getFuturesSymbol(symbol)}`;
                }
                if (!json.chart.result[0].indicators.quote[0].close) {
                    yahoo[engine][symbol].currency = json.chart.result[0].meta.currency;
                    yahoo[engine][symbol].symbol = json.chart.result[0].meta.symbol;
                    yahoo[engine][symbol].exchangeName = json.chart.result[0].meta.exchangeName;
                    yahoo[engine][symbol].instrumentType = json.chart.result[0].meta.instrumentType;
                    yahoo[engine][symbol].regular = Number(json.chart.result[0].meta.regularMarketPrice).toFixed(4);
                    yahoo[engine][symbol].previous = Number(json.chart.result[0].meta.previousClose).toFixed(4);
                    yahoo[engine][symbol].close = Number(json.chart.result[0].meta.regularMarketPrice).toFixed(4);
                    yahoo[engine][symbol].open = Number(json.chart.result[0].meta.previousClose).toFixed(4);
                    yahoo[engine][symbol].trend = (Number(yahoo[engine][symbol].open) > Number(yahoo[engine][symbol].close)) ? "bear" : (Number(yahoo[engine][symbol].open) < Number(yahoo[engine][symbol].close)) ? "bull" : "side";
                    yahoo[engine][symbol].ch = (yahoo[engine][symbol].trend === "bear") ? (Number(yahoo[engine][symbol].open) - Number(yahoo[engine][symbol].close)).toFixed(4) : (yahoo[engine][symbol].trend === "bull") ? (Number(yahoo[engine][symbol].close) - Number(yahoo[engine][symbol].open)).toFixed(4) : 0;
                    yahoo[engine][symbol].chp = (yahoo[engine][symbol].trend === "bear") ? (((Number(yahoo[engine][symbol].open) - Number(yahoo[engine][symbol].close)) / Number(yahoo[engine][symbol].close)) * 100).toFixed(2) : (yahoo[engine][symbol].trend === "bull") ? (((Number(yahoo[engine][symbol].close) - Number(yahoo[engine][symbol].open)) / Number(yahoo[engine][symbol].close)) * 100).toFixed(2) : 0;
                    yahoo[engine][symbol].status = "partial";
                    yahooReport[engine] = yahooReport[engine] + `${yReport} ${yahoo[engine][symbol].status}, `;
                    yahooReport[`${engine}Nb`]++;
                }
                else {
                    let i = json.chart.result[0].indicators.quote[0].close.length;
                    while (!json.chart.result[0].indicators.quote[0].close[i]) {
                        i--;
                    }
                    yahoo[engine][symbol].currency = json.chart.result[0].meta.currency;
                    yahoo[engine][symbol].symbol = json.chart.result[0].meta.symbol;
                    yahoo[engine][symbol].exchangeName = json.chart.result[0].meta.exchangeName;
                    yahoo[engine][symbol].instrumentType = json.chart.result[0].meta.instrumentType;
                    yahoo[engine][symbol].time = Number(json.chart.result[0].timestamp[i]);
                    yahoo[engine][symbol].open = Number(json.chart.result[0].indicators.quote[0].open[i]).toFixed(4);
                    yahoo[engine][symbol].high = Number(json.chart.result[0].indicators.quote[0].high[i]).toFixed(4);
                    yahoo[engine][symbol].low = Number(json.chart.result[0].indicators.quote[0].low[i]).toFixed(4);
                    yahoo[engine][symbol].close = Number(json.chart.result[0].indicators.quote[0].close[i]).toFixed(4);
                    yahoo[engine][symbol].volume = Number(json.chart.result[0].indicators.quote[0].volume[i]).toFixed(4);
                    yahoo[engine][symbol].trend = (Number(json.chart.result[0].indicators.quote[0].open[i]) > Number(json.chart.result[0].indicators.quote[0].close[i])) ? "bear" : (Number(json.chart.result[0].indicators.quote[0].open[i]) < Number(json.chart.result[0].indicators.quote[0].close[i])) ? "bull" : "side";
                    yahoo[engine][symbol].ch = (yahoo[engine][symbol].trend === "bear") ? (Number(json.chart.result[0].indicators.quote[0].open[i]) - Number(json.chart.result[0].indicators.quote[0].close[i])).toFixed(4) : (yahoo[engine][symbol].trend === "bull") ? (Number(json.chart.result[0].indicators.quote[0].close[i]) - Number(json.chart.result[0].indicators.quote[0].open[i])).toFixed(4) : 0;
                    yahoo[engine][symbol].chp = (yahoo[engine][symbol].trend === "bear") ? (((Number(json.chart.result[0].indicators.quote[0].open[i]) - Number(json.chart.result[0].indicators.quote[0].close[i])) / Number(json.chart.result[0].indicators.quote[0].close[i])) * 100).toFixed(2) : (yahoo[engine][symbol].trend === "bull") ? (((Number(json.chart.result[0].indicators.quote[0].close[i]) - Number(json.chart.result[0].indicators.quote[0].open[i])) / Number(json.chart.result[0].indicators.quote[0].close[i])) * 100).toFixed(2) : 0;
                    yahoo[engine][symbol].status = "full";
                    yahooReport[engine] = yahooReport[engine] + `${yReport} ${yahoo[engine][symbol].status}, `;
                    yahooReport[`${engine}Nb`]++;
                }
            }
            else {
                yahoo[engine][symbol].status = "error";
                yahoo[engine][symbol].error = `${json.chart.error.code} ${json.chart.error.description}`;
                consoled("error", `yahoo api ${engine} ${symbol}: ${json.chart.error.code} ${json.chart.error.description}`);
                retryGetQuery(engine, symbol);
            }
            if (yahooReport[`${engine}Nb`] === yahooApi[engine].length) {
                consoled(`${engine}`, `refresh success.`);
                if (engine === "indices" || engine === "war" || engine === "finances" || engine === "weed") {
                    getSkydex(engine);
                }
            }
        })
};
let retryFinances = 0
function refreshEngines() {
    for (let engine of yahooApi.engines) {
        yahooReport[engine] = '';
        yahooReport[`${engine}Nb`] = 0;
        for (let symbol of yahooApi[engine]) {
            if (engine === "indices" && symbol === "SKYDEX") {
                return;
            }
            else if (engine === "finances") {
                if (retryFinances === 0) {
                    getQuery(engine,symbol);
                }
            }
            else {
                getQuery(engine, symbol);
            }
        }
        if (engine === "finances" && retryFinances === 0) {
            retryFinances++;
        }
        else if (engine === "finances" && retryFinances === 1) {
            retryFinances = 0;
        }
    }
    setTimeout(refreshEngines, settings.refresh.yahoo);
};
exports.refreshEngines = refreshEngines;
exports.sliceIndex = sliceIndex;
exports.yahoo = yahoo;
exports.yahooApi = yahooApi;
