import ip6addr from 'ip6addr'
import {ACLPolicy, FlowControl, RateLimit, TagRule, URLMap, WAFPolicy} from '@/types'

const CIDRRanges: { [key: string]: string } = {
  '1': '32',
  '2': '31',
  '4': '30',
  '8': '29',
  '16': '28',
  '32': '27',
  '64': '26',
  '128': '25',
  '256': '24',
  '512': '23',
  '1024': '22',
  '2048': '21',
  '4096': '20',
  '8192': '19',
  '16384': '18',
  '32768': '17',
  '65536': '16',
  '131072': '15',
  '262144': '14',
  '524288': '13',
  '1048576': '12',
  '2097152': '11',
  '4194304': '10',
  '8388608': '9',
  '16777216': '8',
  '33554432': '7',
  '67108864': '6',
  '134217728': '5',
  '268435456': '4',
  '536870912': '3',
  '1073741824': '2',
  '2147483648': '1',
  '4294967296': '0',
}
const CIDRPatterns = {
  '32': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/32'),
  '31': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/31'),
  '30': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/30'),
  '29': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/29'),
  '28': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/28'),
  '27': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/27'),
  '26': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/26'),
  '25': RegExp('(\\d{1,3}\\.){3}\\d{1,3}/25'),
  '24': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/24'),
  '23': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/23'),
  '22': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/22'),
  '21': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/21'),
  '20': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/20'),
  '19': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/19'),
  '18': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/18'),
  '17': RegExp('(\\d{1,3}\\.){2}\\d{1,3}\\.0/17'),
  '16': RegExp('(\\d{1,3}\\.){2}0\\.0/16'),
  '15': RegExp('(\\d{1,3}\\.){2}0\\.0/15'),
  '14': RegExp('(\\d{1,3}\\.){2}0\\.0/14'),
  '13': RegExp('(\\d{1,3}\\.){2}0\\.0/13'),
  '12': RegExp('(\\d{1,3}\\.){2}0\\.0/12'),
  '11': RegExp('(\\d{1,3}\\.){2}0\\.0/11'),
  '10': RegExp('(\\d{1,3}\\.){2}0\\.0/10'),
  '9': RegExp('(\\d{1,3}\\.){2}0\\.0/9'),
  '8': RegExp('\\d{1,3}\\.0\\.0\\.0/8'),
  '7': RegExp('\\d{1,3}\\.0\\.0\\.0/7'),
  '6': RegExp('\\d{1,3}\\.0\\.0\\.0/6'),
  '5': RegExp('\\d{1,3}\\.0\\.0\\.0/5'),
  '4': RegExp('\\d{1,3}\\.0\\.0\\.0/4'),
  '3': RegExp('\\d{1,3}\\.0\\.0\\.0/3'),
  '2': RegExp('\\d{1,3}\\.0\\.0\\.0/2'),
  '1': RegExp('\\d{1,3}\\.0\\.0\\.0/1'),
  '0': RegExp('0\\.0\\.0\\.0/0'),
}
const Countries = 'Norway;Uruguay;Thailand;Serbia;Germany;Republic of Lithuania;Russia;Eritrea;Hungary;Martinique;Lesotho;Venezuela;Benin;Northern Mariana Islands;Jersey;Fiji;Monaco;Argentina;Cambodia;Slovakia;Democratic Republic of Timor-Leste;Tajikistan;Dominican Republic;Namibia;Laos;Saint Barth\\u00e9lemy;Malta;Angola;Netherlands;Niger;Ireland;Papua New Guinea;French Guiana;Mayotte;Bangladesh;Republic of the Congo;Oman;Brazil;Peru;Kuwait;San Marino;Western Sahara;Azerbaijan;Belize;Uganda;United Kingdom;Guinea-Bissau;Taiwan;Saint Lucia;Saint Helena;Macedonia;Yemen;Tunisia;Guatemala;Congo;China;Senegal;Georgia;Greenland;Kyrgyzstan;Nauru;Republic of Moldova;Sierra Leone;Tanzania;Somalia;Pakistan;Japan;Philippines;Colombia;Myanmar;Honduras;India;Montenegro;Bolivia;Cook Islands;Ukraine;Palau;Liberia;Grenada;Greece;Tuvalu;Mexico;U.S. Virgin Islands;Kenya;Togo;Vietnam;Vanuatu;North Korea;Gabon;St Kitts and Nevis;Suriname;Eswatini;Algeria;Bonaire, Sint Eustatius, and Saba;South Sudan;Poland;British Indian Ocean Territory;Heard Island and McDonald Islands;Bahrain;Gambia;Samoa;Lebanon;Croatia;Cameroon;Andorra;Burkina Faso;Morocco;Dominica;Equatorial Guinea;Singapore;Czechia;Luxembourg;Italy;Guyana;Slovenia;Antarctica;Portugal;El Salvador;Syria;\\u00c5land;Saint Vincent and the Grenadines;Jamaica;Anguilla;S\\u00e3o Tom\\u00e9 and Pr\\u00edncipe;Wallis and Futuna;Guinea;Kosovo;Nigeria;Mali;Burundi;Nicaragua;Bermuda;Trinidad and Tobago;Indonesia;Saudi Arabia;French Polynesia;Malawi;French Southern Territories;Cyprus;Haiti;Libya;Svalbard and Jan Mayen;Sri Lanka;Uzbekistan;Turkey;Federated States of Micronesia;Hashemite Kingdom of Jordan;Tokelau;Liechtenstein;Vatican City;Djibouti;Ghana;Belarus;Estonia;Zimbabwe;Iraq;Mauritania;Turkmenistan;Norfolk Island;Sint Maarten;Barbados;Bosnia and Herzegovina;Israel;Saint Pierre and Miquelon;Saint Martin;Ivory Coast;Solomon Islands;Afghanistan;Faroe Islands;Falkland Islands;Hong Kong;Mozambique;Costa Rica;Aruba;Seychelles;Antigua and Barbuda;Turks and Caicos Islands;Ethiopia;Guernsey;Panama;R\\u00e9union;Macao;Qatar;Sweden;U.S. Minor Outlying Islands;Marshall Islands;Nepal;Mongolia;Chad;Chile;Kiribati;Bhutan;South Africa;American Samoa;Maldives;Ecuador;Australia;United Arab Emirates;New Caledonia;New Zealand;Spain;Cabo Verde;Cura\\u00e7ao;Isle of Man;Rwanda;Finland;Pitcairn Islands;Bouvet Island;Puerto Rico;Egypt;Tonga;United States;Guadeloupe;Zambia;Denmark;Paraguay;South Georgia and the South Sandwich Islands;Comoros;Montserrat;Sudan;South Korea;Austria;Cuba;Kazakhstan;Iran;Bulgaria;Brunei;Gibraltar;Albania;Switzerland;Guam;Mauritius;Cayman Islands;Bahamas;Latvia;Romania;Central African Republic;Madagascar;Belgium;Cocos [Keeling] Islands;France;Palestine;Iceland;Botswana;Niue;Armenia;Christmas Island;Canada;British Virgin Islands;Malaysia'.split(';')
const Classes = ['bot', 'cloud', 'tor', 'vpn', 'anon-proxy']

function RangeToCIDR(startAddress: number, endAddress: number) {
  if (startAddress === endAddress) {
    endAddress += 1
  } else {
    startAddress -= 1
    endAddress += 2
  }
  const range = endAddress - startAddress

  const bits: string = CIDRRanges[range.toString()]
  if (bits) {
    // convert start address from int to string
    const saddr = ip6addr.parse(startAddress.toString()).toString()
    // return the CIDR
    return saddr + '/' + bits
  }
}

function CIDRToRange(cidr: string) {
  const sub = ip6addr.createCIDR(cidr)
  return [sub.first().toLong(), sub.last().toLong()]
}

const Titles: { [key: string]: string } = {
  'admin': 'Admin',
  'allow': 'Allow',
  'allow_bot': 'Allow Bot',
  'args': 'Arguments',
  'attrs': 'Attributes',
  'audit-log': 'Audit Log',
  'bypass': 'Bypass',
  'cookies': 'Cookies',
  'curiefense-lists': 'Curiefense Lists',
  'customsigs': 'Custom Signatures',
  'deny': 'Deny',
  'deny_bot': 'Deny Bot',
  'events-and-attacks': 'Events & Attacks',
  'external-lists': 'External Lists',
  'force_deny': 'Enforce Deny',
  'headers': 'Headers',
  'names': 'Name',
  'reg': 'Regex',
  'regex': 'Regex',
  'saml2-sso': 'SAML2 SSO',
  'top-activities': 'Top Activities',
  'traffic-overview': 'Traffic Overview',
  'update-log': 'Update log',
  'version-control': 'Version Control',
  'include': 'Include',
  'exclude': 'Exclude',

  'headers-entry': 'Header',
  'cookies-entry': 'Cookie',
  'args-entry': 'Argument',
  'attrs-entry': 'Attribute',


  'aclpolicies': 'ACL Policies',
  'ratelimits': 'Rate Limits',
  'urlmaps': 'URL Maps',
  'wafpolicies': 'WAF Policies',
  'wafrules': 'WAF Signatures',
  'tagrules': 'Tag Rules',
  'flowcontrol': 'Flow Control',
}

const LimitRulesTypes = {
  'headers': 'Header',
  'cookies': 'Cookie',
  'args': 'Argument',
  'attrs': 'Attribute',
}

const LimitAttributes = {
  'ip': 'IP Address',
  'asn': 'Provider',
  'uri': 'URI',
  'path': 'Path',
  'tags': 'Tag',
  'query': 'Query',
  'method': 'Method',
  'company': 'Company',
  'country': 'Country',
  'authority': 'Authority',
}

const ResponseActions = {
  'default': {'title': '503 Service Unavailable'},
  'challenge': {'title': 'Challenge'},
  'monitor': {'title': 'Tag Only'},
  'response': {'title': 'Response', 'params': {'status': '', 'content': ''}},
  'redirect': {'title': 'Redirect', 'params': {'status': '30[12378]', 'location': 'https?://.+'}},
  'ban': {'title': 'Ban', 'params': {'ttl': '[0-9]+', 'action': {'type': 'default', 'params': {}}}},
  'request_header': {'title': 'Header', 'params': {'headers': ''}},
}

function convertToUUID() {
  let dt = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function convertToUUID2() {
  return convertToUUID().split('-')[4]
}

const NewDocEntryFactory: { [key: string]: Function } = {
  aclpolicies(): ACLPolicy {
    return {
      'id': convertToUUID2(),
      'name': 'New ACL Policy',
      'allow': [] as string[],
      'allow_bot': [] as string[],
      'deny_bot': [] as string[],
      'bypass': [] as string[],
      'force_deny': [] as string[],
      'deny': [] as string[],
    }
  },

  wafpolicies(): WAFPolicy {
    return {
      'id': convertToUUID2(),
      'name': 'New WAF Policy',
      'ignore_alphanum': true,

      'max_header_length': 1024,
      'max_cookie_length': 1024,
      'max_arg_length': 1024,

      'max_headers_count': 42,
      'max_cookies_count': 42,
      'max_args_count': 512,

      'args': {
        'names': [],
        'regex': [],
      },
      'headers': {
        'names': [],
        'regex': [],
      },
      'cookies': {
        'names': [],
        'regex': [],
      },
    }
  },

  tagrules(): TagRule {
    return {
      'id': convertToUUID2(),
      'name': 'New Tag Rules',
      'source': 'self-managed',
      'mdate': (new Date()).toISOString(),
      'notes': 'New List Notes and Remarks',
      'entries_relation': 'OR',
      'active': true,
      'tags': [],
      'action': {
        'type': 'monitor',
      },
      'rule': {
        'relation': 'OR',
        'sections': [],
      },
    }
  },

  urlmaps(): URLMap {
    return {
      'id': convertToUUID2(),
      'name': 'New URL Map',
      'match': '__default__',
      'map': [
        {
          'match': '/',
          'name': 'default',
          'acl_profile': '__default__',
          'waf_profile': '__default__',
          'acl_active': true,
          'waf_active': true,
          'limit_ids': [],
        },
      ],
    }
  },

  ratelimits(): RateLimit {
    return {
      'id': convertToUUID2(),
      'description': 'New Rate Limit Rule',
      'name': 'New Rate Limit Rule',
      'limit': '3',
      'key': [
        {
          'attrs': 'ip',
        },
      ],
      'ttl': '180',
      'action': {
        'type': 'default',
      },
      'exclude': {
        'headers': {},
        'cookies': {},
        'args': {},
        'attrs': {'tags': 'allowlist'},
      },
      'include': {
        'headers': {},
        'cookies': {},
        'args': {},
        'attrs': {'tags': 'blocklist'},
      },
      'pairwith': {
        'self': 'self',
      },
    }
  },

  flowcontrol(): FlowControl {
    return {
      'id': convertToUUID2(),
      'name': 'New Flow Control',
      'ttl': 60,
      'active': true,
      'notes': 'New Flow Control Notes and Remarks',
      'key': [
        {
          'attrs': 'ip',
        },
      ],
      'action': {
        'type': 'default',
      },
      'exclude': [],
      'include': ['all'],
      'sequence': [],
    }
  },

}

const ConfAPIRoot = '/conf/api'
const ConfAPIVersion = 'v1'

const LogsAPIRoot = '/logs/api'
const LogsAPIVersion = 'v1'

const ACCESSLOG_COLUMNS_NAMES = 'rowid,ProtocolVersion,SampleRate,DownstreamRemoteAddress,DownstreamRemoteAddressPort,DownstreamLocalAddress,DownstreamLocalAddressPort,StartTime,TimeToLastRxByte,TimeToFirstUpstreamTxByte,TimeToLastUpstreamTxByte,TimeToFirstUpstreamRxByte,TimeToLastUpstreamRxByte,TimeToFirstDownstreamTxByte,TimeToLastDownstreamTxByte,UpstreamRemoteAddress,UpstreamRemoteAddressPort,UpstreamLocalAddress,UpstreamLocalAddressPort,UpstreamCluster,FailedLocalHealthcheck,NoHealthyUpstream,UpstreamRequestTimeout,LocalReset,UpstreamRemoteReset,UpstreamConnectionFailure,UpstreamConnectionTermination,UpstreamOverflow,NoRouteFound,DelayInjected,FaultInjected,RateLimited,UnauthorizedDetails,RateLimitServiceError,DownstreamConnectionTermination,UpstreamRetryLimitExceeded,StreamIdleTimeout,InvalidEnvoyRequestHeaders,DownstreamProtocolError,Curiefense,UpstreamTransportFailureReason,RouteName,DownstreamDirectRemoteAddress,DownstreamDirectRemoteAddressPort,TlsVersion,TlsCipherSuite,TlsSniHostname,LocalCertificateProperties,LocalCertificatePropertiesAltNames,PeerCertificateProperties,PeerCertificatePropertiesAltNames,TlsSessionId,RequestMethod,Scheme,Authority,Port,Path,UserAgent,Referer,ForwardedFor,RequestId,OriginalPath,RequestHeadersBytes,RequestBodyBytes,RequestHeaders,ResponseCode,ResponseHeadersBytes,ResponseBodyBytes,ResponseHeaders,ResponseTrailers,ResponseCodeDetails'


const ACCESSLOG_SQL = `SELECT * FROM (SELECT *, CAST(row_to_json(row) as text) as json_row FROM logs row) rows`
const ACCESSLOG_SQL_SUFFIX = ' ORDER BY StartTime DESC LIMIT 2048'
const ACCESSLOG_COLUMNS = ACCESSLOG_COLUMNS_NAMES.split(',')

export default {
  name: 'DatasetsUtils',
  CIDRRanges,
  CIDRPatterns,
  Countries,
  ASNs,
  Classes,
  RangeToCIDR,
  CIDRToRange,
  Titles,
  ResponseActions,
  LimitAttributes,
  LimitRulesTypes,
  convertToUUID,
  convertToUUID2,
  ConfAPIRoot,
  ConfAPIVersion,
  NewDocEntryFactory,
  LogsAPIRoot,
  LogsAPIVersion,
  ACCESSLOG_SQL,
  ACCESSLOG_SQL_SUFFIX,
  ACCESSLOG_COLUMNS,
}